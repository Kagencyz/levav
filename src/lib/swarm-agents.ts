/**
 * ============================================================
 * SWARM AGENTS — Multi-Agent Career Intelligence System
 * ============================================================
 * 5 conversational AI agents that collaborate to provide
 * personalized career guidance, plus 20 implementation teams
 * that build, maintain, and optimize the Levav™ ecosystem.
 *
 * Per Orchestration Directive:
 *   - Preserve existing architecture
 *   - Accelerate execution through specialized teams
 *   - Complete, connect, optimize, validate, scale
 * ============================================================
 */

/* ═══════════════════════════════════════════
   CONVERSATIONAL AGENTS (User-facing)
   ═══════════════════════════════════════════ */

export interface SwarmAgent {
  id: string;
  name: string;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  personality: string;
  expertise: string[];
  greeting: string;
  triggers: string[];
}

export const SWARM_AGENTS: SwarmAgent[] = [
  {
    id: "nexus",
    name: "Nexus",
    title: "The Orchestrator",
    color: "text-[#C6FF34]",
    bgColor: "bg-[#C6FF34]/10",
    borderColor: "border-[#C6FF34]/20",
    icon: "Orbit",
    personality: "Strategic, organized, sees the big picture. Coordinates all other agents.",
    expertise: ["Career strategy", "Goal setting", "Progress tracking", "Agent coordination"],
    greeting: "I'm Nexus, your command center. I coordinate all the agents in our swarm. Tell me what you need — I'll bring the right experts together.",
    triggers: ["help", "start", "overview", "plan", "strategy", "goals", "where do i begin", "nexus"],
  },
  {
    id: "career_sage",
    name: "Career Sage",
    title: "The Pathfinder",
    color: "text-[#7E3BED]",
    bgColor: "bg-[#7E3BED]/10",
    borderColor: "border-[#7E3BED]/20",
    icon: "Compass",
    personality: "Wise, patient, deeply knowledgeable about African career landscapes.",
    expertise: ["Career paths", "Industry trends", "Salary insights", "Long-term planning", "Leadership development"],
    greeting: "I'm Career Sage. I've studied career journeys across Africa. Ask me about your path, your industry, or where the opportunities are heading.",
    triggers: ["career", "path", "industry", "salary", "promotion", "leadership", "manager", "trend", "future", "growth", "sage"],
  },
  {
    id: "interview_forge",
    name: "Interview Forge",
    title: "The Master Crafter",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    icon: "Hammer",
    personality: "Intense, practical, no-nonsense. Focuses on preparation and performance under pressure.",
    expertise: ["Interview prep", "Mock interviews", "STAR method", "Negotiation", "Presentation skills"],
    greeting: "I'm Interview Forge. I don't do theory — I do practice. Tell me about an upcoming interview or let me put you through a mock session.",
    triggers: ["interview", "negotiate", "salary negotiation", "present", "speak", "confidence", "nervous", "prepare", "mock", "forge"],
  },
  {
    id: "skill_smith",
    name: "Skill Smith",
    title: "The Builder",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    icon: "Wrench",
    personality: "Hands-on, practical, always building. Focused on concrete skill acquisition.",
    expertise: ["Skill gaps", "Learning paths", "Course recommendations", "Technical skills", "Certifications"],
    greeting: "I'm Skill Smith. Show me what you have, I'll show you what to build. I design learning paths based on your WRI™ gaps and market demand.",
    triggers: ["skill", "learn", "course", "certification", "training", "technical", "coding", "build", "gap", "improve", "smith"],
  },
  {
    id: "opportunity_scout",
    name: "Opportunity Scout",
    title: "The Hunter",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    icon: "Telescope",
    personality: "Energetic, network-savvy, always scanning the horizon.",
    expertise: ["Job matching", "Market opportunities", "Networking", "Application strategy", "Hidden jobs"],
    greeting: "I'm Opportunity Scout. I know where the jobs are — even the ones that never get posted. Tell me what you're hunting for.",
    triggers: ["job", "opportunity", "hire", "apply", "vacancy", "network", "connect", "referral", "market", "scout", "hunt"],
  },
];

export function getAgentById(id: string): SwarmAgent | undefined {
  return SWARM_AGENTS.find((a) => a.id === id);
}

export function routeToAgent(message: string): SwarmAgent[] {
  const lower = message.toLowerCase();
  const scores: { agent: SwarmAgent; score: number }[] = [];

  for (const agent of SWARM_AGENTS) {
    let score = 0;
    if (lower.includes(`@${agent.id.replace("_", "")}`) || lower.includes(`@${agent.name.toLowerCase().replace(" ", "")}`)) {
      score += 100;
    }
    for (const trigger of agent.triggers) {
      if (lower.includes(trigger)) score += 10;
    }
    scores.push({ agent, score });
  }

  scores.sort((a, b) => b.score - a.score);

  if (scores[0].score === 0) {
    return [SWARM_AGENTS[0]];
  }

  if (scores.length > 1 && scores[1].score > 0 && scores[0].score - scores[1].score < 20) {
    return [scores[0].agent, scores[1].agent];
  }

  return [scores[0].agent];
}

/* ═══════════════════════════════════════════
   IMPLEMENTATION TEAMS (20 Agent Teams)
   ═══════════════════════════════════════════ */

export interface AgentTeam {
  id: number;
  name: string;
  focus: string[];
  responsibilities: string[];
  integrations?: string[];
  status: "complete" | "in-progress" | "planned";
  completion: number; // 0-100
}

export const AGENT_TEAMS: AgentTeam[] = [
  {
    id: 1,
    name: "Identity & Workforce Intelligence Team",
    focus: ["Levav ID™", "WRI™", "Profile architecture", "Score generation", "Talent dashboards"],
    responsibilities: ["Data aggregation", "Identity relationships", "WRI calculations", "User growth tracking", "Historical analytics"],
    status: "in-progress",
    completion: 85,
  },
  {
    id: 2,
    name: "Levav 28™ Transformation Team",
    focus: ["Daily challenge engine", "CONFRONT™", "DISSECT™", "OWN™", "EXECUTE™"],
    responsibilities: ["Challenge generation", "Critical thinking pathways", "Reflection systems", "Progress scoring", "Completion validation"],
    status: "in-progress",
    completion: 90,
  },
  {
    id: 3,
    name: "QuickWork™ Workforce Activation Team",
    focus: ["QuickWork marketplace", "Shift-based opportunities", "Micro-work infrastructure"],
    responsibilities: ["Job dispatching", "Availability management", "Earnings tracking", "Completion verification", "Settlement triggers"],
    status: "planned",
    completion: 25,
  },
  {
    id: 4,
    name: "Opportunity Marketplace Team",
    focus: ["Employment opportunities", "Internships", "Graduate programs", "Apprenticeships"],
    responsibilities: ["Listings architecture", "Employer workflows", "Search systems", "Recommendation engine"],
    status: "in-progress",
    completion: 80,
  },
  {
    id: 5,
    name: "Employer Intelligence Team",
    focus: ["Employer portal", "Workforce analytics", "Candidate discovery", "Pipeline management"],
    responsibilities: ["Search architecture", "Filtering", "Reporting", "Workforce intelligence dashboards"],
    status: "in-progress",
    completion: 88,
  },
  {
    id: 6,
    name: "Levav Impact™ Team",
    focus: ["Volunteer ecosystem", "Impact opportunities", "NGO onboarding", "Organization verification"],
    responsibilities: ["Impact Partner onboarding", "Opportunity verification", "Impact tracking", "Volunteer validation"],
    status: "planned",
    completion: 30,
  },
  {
    id: 7,
    name: "Learning Ecosystem Team",
    focus: ["Levav Learn™", "Learning pathways", "Content discovery", "Recommendations"],
    responsibilities: ["Learning workflows", "Course delivery", "Progress tracking", "Certification integration"],
    status: "in-progress",
    completion: 60,
  },
  {
    id: 8,
    name: "University & Institutional Partner Team",
    focus: ["University onboarding", "Institutional dashboards", "Program marketing", "Scholarship promotion"],
    responsibilities: ["Institution profiles", "Program management", "Educational partnerships", "Workforce intelligence integrations"],
    status: "planned",
    completion: 15,
  },
  {
    id: 9,
    name: "Champions™ Team",
    focus: ["Champion onboarding", "Contribution workflows", "Media submissions", "Honorarium routing"],
    responsibilities: ["Champion verification", "Content approvals", "Impact Contribution routing", "Legacy content management"],
    status: "planned",
    completion: 20,
  },
  {
    id: 10,
    name: "Content Studio Team",
    focus: ["Media infrastructure"],
    responsibilities: ["Video uploads", "Audio uploads", "Document uploads", "PDF management", "External content integrations"],
    integrations: ["Native uploads", "YouTube", "Vimeo", "Institutional repositories"],
    status: "planned",
    completion: 35,
  },
  {
    id: 11,
    name: "Payments & Settlement Team",
    focus: ["Unified Payments Layer"],
    responsibilities: ["Levav Wallet", "Revenue sharing", "Payout orchestration", "Commission logic", "Settlement tracking"],
    integrations: ["Flutterwave", "DPO", "TechPay", "Visa", "Mastercard", "Mobile Money", "Airtel Money", "MTN Money", "Bank Transfers"],
    status: "planned",
    completion: 20,
  },
  {
    id: 12,
    name: "Mobile Applications Team",
    focus: ["iOS", "Android", "PWA"],
    responsibilities: ["Performance", "Responsiveness", "Push notifications", "Offline capabilities"],
    status: "planned",
    completion: 40,
  },
  {
    id: 13,
    name: "Design Systems Team",
    focus: ["Framer", "UI Pro", "Design consistency", "Component systems"],
    responsibilities: ["Design tokens", "Glass UI implementation", "Light mode", "Dark mode", "Mobile consistency", "Accessibility"],
    status: "in-progress",
    completion: 75,
  },
  {
    id: 14,
    name: "API & Integrations Team",
    focus: ["Internal APIs", "External APIs", "Data synchronization"],
    responsibilities: ["Payment integrations", "Learning integrations", "Analytics integrations", "Communication integrations"],
    status: "in-progress",
    completion: 70,
  },
  {
    id: 15,
    name: "Data Architecture Team",
    focus: ["Database relationships", "Entity mapping", "Data consistency"],
    responsibilities: ["Data lineage", "Data integrity", "Data modeling", "Query optimization"],
    status: "in-progress",
    completion: 65,
  },
  {
    id: 16,
    name: "Security & Compliance Team",
    focus: ["Authentication", "Authorization", "Audit logging", "Privacy"],
    responsibilities: ["Security reviews", "Permissions", "Access controls", "Threat monitoring"],
    status: "in-progress",
    completion: 60,
  },
  {
    id: 17,
    name: "Analytics & Intelligence Team",
    focus: ["Workforce trends", "Opportunity trends", "Platform analytics"],
    responsibilities: ["Reporting", "Forecasting", "Workforce insights", "Ecosystem intelligence"],
    status: "in-progress",
    completion: 55,
  },
  {
    id: 18,
    name: "Brand & Narrative Team",
    focus: ["Language", "Tone", "Messaging"],
    responsibilities: ["User-facing language review", "Human Capital narrative protection", "Brand consistency", "Ecosystem language"],
    status: "in-progress",
    completion: 80,
  },
  {
    id: 19,
    name: "Quality Assurance Team",
    focus: ["Functional testing", "Workflow testing", "UX testing"],
    responsibilities: ["Validate every page", "Validate every button", "Validate every integration", "Validate every workflow"],
    status: "in-progress",
    completion: 50,
  },
  {
    id: 20,
    name: "Ecosystem Optimization Team",
    focus: ["Performance", "Scalability", "Future readiness"],
    responsibilities: ["Identify bottlenecks", "Improve efficiency", "Recommend future enhancements"],
    status: "planned",
    completion: 30,
  },
];

export const EXECUTIVE_COORDINATOR = {
  id: "exec",
  name: "Executive Swarm Coordinator",
  title: "Ecosystem Supervisor",
  responsibilities: [
    "Overall ecosystem supervision",
    "Cross-agent dependency management",
    "Progress tracking",
    "Conflict resolution",
    "Architecture compliance",
    "Brand compliance",
  ],
};

/* ═══════════════════════════════════════════
   STATUS HELPERS
   ═══════════════════════════════════════════ */

export function getOverallCompletion(): number {
  const total = AGENT_TEAMS.reduce((s, t) => s + t.completion, 0);
  return Math.round(total / AGENT_TEAMS.length);
}

export function getStatusCounts(): Record<string, number> {
  return AGENT_TEAMS.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/* ═══════════════════════════════════════════
   AGENT RESPONSE GENERATION
   ═══════════════════════════════════════════ */

export interface AgentResponse {
  agentId: string;
  content: string;
  actions?: string[];
}

export function generateAgentResponse(agentId: string, message: string, profile: any): AgentResponse {
  const lower = message.toLowerCase();
  const role = profile?.role || "professional";
  const experience = profile?.experience || "mid";
  const profession = profile?.profession || "your field";
  const wriScore = profile?.wriScore || 65;

  switch (agentId) {
    case "nexus":
      return generateNexusResponse(lower, role, experience, profession, wriScore);
    case "career_sage":
      return generateCareerSageResponse(lower, role, experience, profession, wriScore);
    case "interview_forge":
      return generateInterviewForgeResponse(lower, role, experience, profession, wriScore);
    case "skill_smith":
      return generateSkillSmithResponse(lower, role, experience, profession, wriScore);
    case "opportunity_scout":
      return generateOpportunityScoutResponse(lower, role, experience, profession, wriScore);
    default:
      return { agentId: "nexus", content: "I'm coordinating the swarm for you. Let me bring in the right expert." };
  }
}

/* ─── Response generators ─── */

function generateNexusResponse(_msg: string, role: string, exp: string, prof: string, wri: number): AgentResponse {
  const overall = getOverallCompletion();
  return {
    agentId: "nexus",
    content: `**Your Strategic Overview** (${role} in ${prof})

**WRI™**: ${wri}/100 (${wri >= 75 ? "Platinum" : wri >= 60 ? "Gold" : "Silver"})
**Experience**: ${exp === "entry" ? "0-2 years" : exp === "mid" ? "3-5 years" : exp === "senior" ? "6-10 years" : "10+ years"}
**Ecosystem Status**: ${overall}% operational

**Recommended Focus**:
${wri < 70 ? "1. • Complete Levav 28™ crucible daily (+5 WRI/month)\n" : "1. ✓ WRI strong — target senior roles\n"}2. • ${exp === "entry" ? "Build portfolio with 2 showcase projects" : exp === "mid" ? "Take on cross-functional leadership" : "Mentor juniors + build external reputation"}
3. • Target: ${prof.split(" ")[0]} ${exp === "entry" ? "entry" : "growth"} positions

I'm routing you to Career Sage for path planning and Skill Smith for gap analysis.`,
    actions: ["Full Career Review", "Skill Gap Analysis", "Job Market Scan"],
  };
}

function generateCareerSageResponse(msg: string, role: string, exp: string, prof: string, wri: number): AgentResponse {
  if (msg.includes("salary") || msg.includes("pay")) {
    return {
      agentId: "career_sage",
      content: `**${role} Salary Guide — Zambia 2025**

${exp === "entry" ? "Entry (0-2 yrs): ZMW 4,000-8,000/mo" : exp === "mid" ? "Mid (3-5 yrs): ZMW 8,000-18,000/mo" : exp === "senior" ? "Senior (6-10 yrs): ZMW 18,000-35,000/mo" : "Expert (10+ yrs): ZMW 35,000-60,000+/mo"}

**Negotiation Power**: WRI™ ${wri} = ${wri >= 75 ? "strong leverage" : wri >= 60 ? "solid bargaining position" : "moderate — boost to 75+ for max leverage"}

**Pro Tip**: Anchor 20% above target. First number sets the frame.`,
      actions: ["Salary Negotiation Guide", "Compare Markets"],
    };
  }
  return {
    agentId: "career_sage",
    content: `The ${prof} landscape in Africa is evolving fast. Your WRI™ ${wri} positions you ${wri >= 75 ? "as top-tier talent" : wri >= 60 ? "competitively" : "with growth potential"}.

As a ${exp === "entry" ? "0-2 year" : exp === "mid" ? "3-5 year" : "6+ year"} ${role}, your highest-impact move is ${wri < 70 ? "completing Levav 28™ to raise your WRI™" : "targeting roles that leverage your Gold/Platinum credentials"}.

Want salary benchmarks, leadership paths, or industry trends?`,
    actions: ["Salary Benchmarks", "Leadership Path", "Industry Trends"],
  };
}

function generateInterviewForgeResponse(msg: string, role: string, _exp: string, _prof: string, wri: number): AgentResponse {
  if (msg.includes("mock") || msg.includes("practice")) {
    return {
      agentId: "interview_forge",
      content: `**Mock Interview: ${role}**

**Q1** (Behavioral): "Tell me about a major challenge you faced."

Use STAR:
- **S**ituation (1 sentence)
- **T**ask (1 sentence)
- **A**ction: What YOU did (3-4 sentences)
- **R**esult: Quantify (1-2 sentences)

**Q2**: "How do you approach ${role.toLowerCase().includes("developer") ? "debugging under pressure" : role.toLowerCase().includes("design") ? "balancing feedback with principles" : "prioritizing competing deadlines"}?"

Your ${wri >= 70 ? "Critical Thinking score excels at analytical Qs" : "Communication score shines in behavioral Qs"}.

Type your answer to Q1 and I'll give detailed feedback.`,
      actions: ["More Questions", "STAR Method Guide"],
    };
  }
  return {
    agentId: "interview_forge",
    content: `Interview prep is **repetition under pressure**. Your plan:

**Week Before**: Research company, prepare 5 STAR stories, practice 2-min pitch
**Day Before**: Review WRI™ breakdown, prepare 3 questions for THEM, sleep 8hrs
**Morning**: Arrive 15 min early, power pose 2 min

Your ${wri >= 70 ? "Platinum/Gold WRI™ impresses interviewers" : "WRI™ journey shows growth mindset — mention it"}.

Ready for a mock interview?`,
    actions: ["Start Mock Interview", "STAR Method Guide"],
  };
}

function generateSkillSmithResponse(msg: string, role: string, _exp: string, prof: string, wri: number): AgentResponse {
  if (msg.includes("gap") || msg.includes("analysis")) {
    return {
      agentId: "skill_smith",
      content: `**Skill Gap: ${role}**

**Strong**: ${wri >= 70 ? "Critical Thinking, Culture Fit" : wri >= 60 ? "Core skills, Reliability" : "Foundational knowledge"}
**Growth**: ${wri < 75 ? "Leadership\n" : ""}${wri < 70 ? "Communication\n" : ""}${wri < 65 ? "Impact measurement\n" : ""}

**30-Day Plan**:
1. ${prof.includes("Technology") ? "Advanced patterns + TypeScript" : prof.includes("Health") ? "Patient communication + EMR" : prof.includes("Finance") ? "Financial modeling + Excel" : "Industry certification prep"}
2. Leadership course on Levav Learn™
3. Cross-functional project
4. Portfolio sprint`,
      actions: ["View Courses", "Create Learning Plan"],
    };
  }
  return {
    agentId: "skill_smith",
    content: `**Hot Skills in ${prof.split(" ")[0]} (2025)**:
${prof.includes("Technology") ? "AI/ML integration, Cloud architecture, Cybersecurity" : prof.includes("Health") ? "Telemedicine, Electronic records, Data analytics" : prof.includes("Finance") ? "Data analytics, Financial modeling, Fintech tools" : "Digital tools, Project management, Data literacy"}

**Your Move**: Pick ONE. Spend 30 min/day for 30 days. Document publicly.

This habit raises WRI™ by 5-10 points and makes you visible to employers.

Want a personalized 30-day sprint?`,
    actions: ["30-Day Skill Sprint", "Skill Gap Analysis"],
  };
}

function generateOpportunityScoutResponse(msg: string, role: string, exp: string, prof: string, wri: number): AgentResponse {
  if (msg.includes("job") || msg.includes("hunt")) {
    return {
      agentId: "opportunity_scout",
      content: `**${role} Openings — Active Now**
${prof.includes("Technology") ? "• Senior Frontend — BongoHive (ZMW 15-25k)\n• DevOps Engineer — Fintech Zambia (ZMW 18-28k)\n• Product Designer — ZamHealth (ZMW 12-18k)" : prof.includes("Health") ? "• Registered Nurse — UTH (ZMW 8-12k)\n• Clinical Officer — CIDRZ (ZMW 10-15k)\n• Health Program Manager — CHAI (ZMW 15-25k)" : "• Project Manager — BongoHive (ZMW 12-20k)\n• Operations Lead — Trade Kings (ZMW 10-18k)\n• Business Development — SeedCo (ZMW 8-15k)"}

**Your Match**: ${wri >= 75 ? "95% — Platinum gets priority" : wri >= 60 ? "85% — Strong candidate" : "70% — Complete Levav 28™ to boost"}

**This Week**: Update Levav ID™ → Set alerts → Apply to 3`,
      actions: ["View All Jobs", "Optimize CV", "Application Tracker"],
    };
  }
  return {
    agentId: "opportunity_scout",
    content: `I'm scanning the ${prof} market for you.

**Matches**: ${wri >= 75 ? "3 jobs match Platinum tier" : wri >= 60 ? "3 jobs match Gold range" : "7 companies hiring — boost WRI™ for better matches"}
**Avg Salary**: ${exp === "entry" ? "ZMW 4-8k" : exp === "mid" ? "ZMW 8-18k" : "ZMW 18-35k"}

**This Week**: Update Levav ID™ → Set alerts → Apply to 3

Show specific openings or optimize strategy?`,
    actions: ["View Matching Jobs", "Optimize CV", "Set Alerts"],
  };
}
