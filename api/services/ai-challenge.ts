/**
 * ============================================================
 * AI CHALLENGE GENERATION SERVICE
 * ============================================================
 * Generates profession-tailored CONFRONT™ scenarios for Levav 28™
 * daily challenges using OpenAI GPT-4. Takes the user's profession
 * and generates realistic workplace crisis scenarios that require
 * critical thinking and problem-solving.
 * ============================================================
 */

import { env } from "../lib/env";

interface ChallengePrompt {
  profession: string;
  dayNumber: number;
  previousTopics?: string[];
}

interface GeneratedChallenge {
  scenario: string;
  professionContext: string;
  difficulty: "entry" | "mid" | "senior";
  estimatedTimeMinutes: number;
}

const SYSTEM_PROMPT = `You are Levav™, Africa's Workforce Intelligence Ecosystem™ challenge architect.
Generate realistic, profession-specific workplace crisis scenarios for the CONFRONT™ phase of Levav 28™ daily socratic challenges.

Rules:
- Scenarios must be grounded in real workplace situations relevant to the profession
- Include specific stakes (deadlines, clients, budgets, team dynamics)
- The crisis should have multiple root causes (not obvious)
- Write in second person ("You are...", "Your team...")
- Keep scenarios to 3-4 sentences
- Difficulty should increase with day number (1-10: entry, 11-20: mid, 21-28: senior)
- NEVER generate the same scenario twice for the same profession
- Return ONLY valid JSON, no markdown, no explanations`;

/**
 * Generate a profession-tailored CONFRONT scenario.
 * Falls back to curated templates if OpenAI key is not configured.
 */
export async function generateConfrontChallenge(
  prompt: ChallengePrompt,
): Promise<GeneratedChallenge> {
  /* ─── Fallback: curated templates when no API key ─── */
  if (!env.openaiApiKey) {
    return getFallbackChallenge(prompt.profession, prompt.dayNumber);
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
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: buildUserPrompt(prompt),
          },
        ],
        temperature: 0.8,
        max_tokens: 400,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      // console.warn(`[AI Challenge] OpenAI error: ${response.status}, using fallback`);
      return getFallbackChallenge(prompt.profession, prompt.dayNumber);
    }

    const data = (await response.json()) as {
      choices: [{ message: { content: string } }];
    };
    const parsed = JSON.parse(data.choices[0].message.content) as GeneratedChallenge;
    return {
      ...parsed,
      difficulty: getDifficulty(prompt.dayNumber),
      estimatedTimeMinutes: 15 + Math.floor(prompt.dayNumber / 2),
    };
  } catch (error) {
    // console.warn("[AI Challenge] Error, using fallback:", error);
    return getFallbackChallenge(prompt.profession, prompt.dayNumber);
  }
}

function buildUserPrompt(prompt: ChallengePrompt): string {
  const difficulty = getDifficulty(prompt.dayNumber);
  return `Generate a CONFRONT™ scenario for:
- Profession: ${prompt.profession}
- Day: ${prompt.dayNumber} of 28
- Difficulty: ${difficulty}
${prompt.previousTopics ? `- Previous topics covered: ${prompt.previousTopics.join(", ")}` : ""}

Return JSON with fields: scenario (string), professionContext (string)`;
}

function getDifficulty(day: number): "entry" | "mid" | "senior" {
  if (day <= 10) return "entry";
  if (day <= 20) return "mid";
  return "senior";
}

/* ─── CURATED FALLBACK CHALLENGES ─── */
function getFallbackChallenge(profession: string, day: number): GeneratedChallenge {
  const challengesByProfession: Record<string, string[]> = {
    "Software Developer": [
      "You are the lead developer on a critical fintech app. Two days before launch, a junior developer accidentally pushed untested code that corrupted the user authentication system. 50,000 users are locked out. The client is threatening to sue and your CEO is demanding answers in 2 hours.",
      "Your startup's mobile app has a 1-star rating on the Play Store. Reviews say it crashes constantly. Your CTO says the codebase is 'fine' and blames user devices. Your investor demo is in 3 days and you need to decide: fix the existing code or rebuild from scratch.",
      "A security audit revealed that your team's API endpoints have been exposing sensitive user data for 6 months. No one noticed. The auditor says you must shut down production immediately, but your biggest client has a live event tomorrow that depends on your platform.",
    ],
    "Data Analyst": [
      "You presented quarterly revenue analysis to the board. The CFO just emailed saying your numbers are wrong — the actual revenue is 40% lower than what you reported. The board already made strategic decisions based on your analysis. You have 24 hours to find the error and fix the report.",
      "Your health NGO's malaria intervention program data shows zero impact after 18 months of funding. The donors are demanding a report in 48 hours. The field team says the data collection process was flawed, but you must present findings to keep the program alive.",
    ],
    "Registered Nurse": [
      "During your night shift, you discover that three patients received the wrong medication due to a labeling error in the pharmacy. Two patients are stable, but one is showing adverse reactions. The doctor on call is unavailable and the pharmacy won't open for 4 hours.",
      "Your clinic received 50% of its expected vaccine shipment. You have 200 children scheduled for vaccination this week. The community has already experienced a measles outbreak. Parents are lining up at 5 AM and you must decide who gets vaccinated and who doesn't.",
    ],
    "default": [
      "A key client has threatened to terminate their contract due to repeated delivery delays and communication gaps. The project was supposed to launch 3 weeks ago. Your team is blaming each other, and you must identify the real root cause before the client meeting tomorrow.",
      "Your department's budget was cut by 30% effective immediately. You must deliver the same output with fewer resources, but your team is already overworked and two key members are threatening to resign. The deadline is non-negotiable.",
      "A serious safety incident occurred on your watch. No one was injured, but the investigation revealed that safety protocols have been ignored for months. Your supervisor is pushing you to downplay the report, but you know the truth could save lives.",
    ],
  };

  const professionKey = Object.keys(challengesByProfession).find((k) =>
    profession.toLowerCase().includes(k.toLowerCase()),
  ) ?? "default";

  const list = challengesByProfession[professionKey];
  const scenario = list[day % list.length];

  return {
    scenario,
    professionContext: `Tailored for ${profession} professionals`,
    difficulty: getDifficulty(day),
    estimatedTimeMinutes: 15 + Math.floor(day / 2),
  };
}
