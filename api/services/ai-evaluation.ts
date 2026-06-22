/**
 * ============================================================
 * OWN™ PHASE AI EVALUATION SERVICE
 * ============================================================
 * Evaluates Levav 28™ OWN phase responses for personal
 * accountability. Uses pattern matching + OpenAI analysis to:
 *   - Detect passive language, deflection, blame-shifting
 *   - Require first-person ownership statements
 *   - Flag entitlement phrases
 *   - Score personal accountability (0-100)
 * 
 * If evaluation fails (score < 50), user must rewrite.
 * No submission allowed without passing the OWN test.
 * ============================================================
 */

import { env } from "../lib/env";

interface OwnEvaluationInput {
  response: string;
  profession: string;
  scenario: string;
}

interface OwnEvaluationResult {
  passed: boolean;
  score: number; // 0-100
  feedback: string;
  flags: string[];
  strengths: string[];
  rewriteRequired: boolean;
}

/* ─── PASSIVE / DEFLECTION PATTERNS ─── */
const NEGATIVE_PATTERNS = [
  { pattern: /they (never|didn't|did not|always|wouldn't)/i, label: "Blames others ('they')" },
  { pattern: /(my boss|management|the team|colleagues?) (is|was|were|did|didn't)/i, label: "Deflects to others" },
  { pattern: /(the system|the process|the policy|the environment)/i, label: "Blames systems/processes" },
  { pattern: /(couldn't|could not|unable to|didn't have|lacked|no access|not my)/i, label: "Excuses/circumstances" },
  { pattern: /(if only|had (they|management)|wish (they|someone)|should have been)/i, label: "Conditional blame" },
  { pattern: /(not fair|unreasonable|impossible|too much|overwhelming)/i, label: "Entitlement language" },
  { pattern: /(someone|somebody|others?|everyone) (should|could|would|needs? to)/i, label: "Delegating responsibility" },
];

const POSITIVE_PATTERNS = [
  { pattern: /\b(I should have|I could have|I would have|I need to|I must|I will)\b/i, weight: 10 },
  { pattern: /\b(my responsibility|my fault|my mistake|my role|my action|my decision)\b/i, weight: 15 },
  { pattern: /\b(I take ownership|I take responsibility|I own this|I acknowledge)\b/i, weight: 20 },
  { pattern: /\b(I learned|I realize|I understand now|reflecting on|in hindsight)\b/i, weight: 10 },
  { pattern: /\b(I will|going forward|next time|from now on)\b/i, weight: 8 },
  { pattern: /\b(my part|my contribution|what I did|what I said)\b/i, weight: 12 },
];

/**
 * Evaluate an OWN phase response for personal accountability.
 * Uses local pattern analysis (fast) + optional OpenAI (detailed).
 */
export async function evaluateOwnResponse(
  input: OwnEvaluationInput,
): Promise<OwnEvaluationResult> {
  const flags: string[] = [];
  const strengths: string[] = [];
  let score = 50; // Start neutral

  const response = input.response.toLowerCase();

  /* ─── Check for negative patterns (deflection, blame) ─── */
  for (const { pattern, label } of NEGATIVE_PATTERNS) {
    if (pattern.test(response)) {
      flags.push(label);
      score -= 8;
    }
  }

  /* ─── Check for positive patterns (ownership, accountability) ─── */
  for (const { pattern, weight } of POSITIVE_PATTERNS) {
    if (pattern.test(response)) {
      strengths.push(`Demonstrates accountability language`);
      score += weight;
    }
  }

  /* ─── I-statement ratio ─── */
  const iStatements = (response.match(/\bi\b/gi) ?? []).length;
  const theyStatements = (response.match(/\b(they|them|their)\b/gi) ?? []).length;
  if (theyStatements > iStatements) {
    flags.push("More 'they' than 'I' — deflection detected");
    score -= 15;
  }
  if (iStatements >= 3) {
    strengths.push("Strong first-person ownership");
    score += 10;
  }

  /* ─── Length check ─── */
  if (input.response.length < 80) {
    flags.push("Response too brief for meaningful reflection");
    score -= 10;
  }

  /* ─── Normalize score ─── */
  score = Math.max(0, Math.min(100, score));

  /* ─── Generate feedback ─── */
  const feedback = generateFeedback(score, flags, strengths);
  const passed = score >= 60;

  return {
    passed,
    score,
    feedback,
    flags: [...new Set(flags)],
    strengths: [...new Set(strengths)],
    rewriteRequired: !passed,
  };
}

function generateFeedback(score: number, flags: string[], strengths: string[]): string {
  if (score >= 80) {
    return `Strong personal accountability demonstrated (${score}/100). You clearly own your role in the situation. ${strengths.length > 0 ? strengths[0] + "." : ""} This response meets the Levav Code™ standard for Ownership.`;
  }
  if (score >= 60) {
    return `Acceptable accountability (${score}/100). You show some ownership, but ${flags.length > 0 ? flags[0].toLowerCase() + "." : "could go deeper."} Consider: What specifically did YOU do or fail to do?`;
  }
  if (score >= 40) {
    return `Needs revision (${score}/100). Your response contains ${flags.slice(0, 2).join(" and ")}. The Levav Code™ requires personal ownership — not excuses. Rewrite focusing only on your own actions and decisions.`;
  }
  return `Rewrite required (${score}/100). Your response focuses on external factors rather than personal accountability. ${flags.length > 0 ? "Issues: " + flags.slice(0, 3).join("; ") + "." : ""} The OWN™ phase demands honest self-examination. What did YOU do? What will YOU change?`;
}

/**
 * Enhanced evaluation using OpenAI (when API key available).
 * Provides nuanced, context-aware feedback.
 */
export async function evaluateOwnWithAI(
  input: OwnEvaluationInput,
): Promise<OwnEvaluationResult> {
  /* ─── Always run local evaluation first ─── */
  const localResult = await evaluateOwnResponse(input);

  if (!env.openaiApiKey) {
    return localResult;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You evaluate personal accountability in workplace reflections. Score 0-100. Return JSON: {score, passed(score>=60), feedback(string), flags(array), rewriteRequired(boolean)}.`,
          },
          {
            role: "user",
            content: `Scenario: ${input.scenario}\n\nProfession: ${input.profession}\n\nResponse: "${input.response}"\n\nEvaluate for personal accountability. Does the person own their mistakes? Do they blame others? Is the language passive or active?`,
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) return localResult;

    const data = (await response.json()) as {
      choices: [{ message: { content: string } }];
    };
    const ai = JSON.parse(data.choices[0].message.content) as Partial<OwnEvaluationResult>;

    /* ─── Blend local + AI scores ─── */
    const blendedScore = Math.round((localResult.score + (ai.score ?? 50)) / 2);

    return {
      ...localResult,
      score: blendedScore,
      passed: blendedScore >= 60,
      feedback: ai.feedback ?? localResult.feedback,
      rewriteRequired: blendedScore < 60,
    };
  } catch {
    return localResult;
  }
}
