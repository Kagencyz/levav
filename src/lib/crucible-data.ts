/**
 * ============================================================
 * LEVAV 28™ CRUCIBLE — PROFESSION-SPECIFIC SCENARIO ENGINE
 * ============================================================
 * Per Blueprint Part IV-A: Each day = CONFRONT™ → DISSECT™ →
 * OWN™ → EXECUTE™. Scenarios are CONNECTED — each phase
 * builds on the same crisis. Personalized by profession,
 * experience level, and workplace context.
 * ============================================================
 */

export interface CrucibleDay {
  day: number;
  title: string;
  context: string;
  confront: {
    title: string;
    scenario: string;
    prompt: string;
    minLength: number;
  };
  dissect: {
    title: string;
    scenario: string;
    prompt: string;
    minLength: number;
  };
  own: {
    title: string;
    scenario: string;
    prompt: string;
    minLength: number;
  };
  execute: {
    title: string;
    scenario: string;
    prompt: string;
    minLength: number;
  };
}

export interface ProfessionPack {
  profession: string;
  displayLabel: string;
  days: CrucibleDay[];
}

/* ─── HELPER: Generate day titles ─── */
const dt = (day: number, title: string) => ({ day, title });

/* ═══════════════════════════════════════════
   SOFTWARE DEVELOPER — 7 Days
   ═══════════════════════════════════════════ */
const developerPack: ProfessionPack = {
  profession: "software_developer",
  displayLabel: "Software Developer",
  days: [
    {
      ...dt(1, "The 2 AM Production Crash"),
      context: "You are a mid-level developer at a fintech startup in Lusaka. The company serves 15,000 Zambian users who rely on the platform for mobile money transfers.",
      confront: {
        title: "The Platform Is Down",
        scenario: "It is 2:17 AM. Your phone explodes with alerts. The payment processing API is returning 500 errors. Users cannot complete transactions. The CTO is calling. Your junior teammate who deployed the last update is not responding. The CEO just posted in the company Slack: 'What is happening??' You have no runbook for this.",
        prompt: "What do you do in the FIRST 15 MINUTES? Walk through every action, communication, and decision. Do not give generic advice — describe YOUR exact moves, in order.",
        minLength: 120,
      },
      dissect: {
        title: "How Did This Happen?",
        scenario: "The post-mortem reveals: the junior dev deployed at 11 PM without code review because 'it was just a small fix.' There is no staging environment. The database migration failed silently. The monitoring only checks if the server is up, not if payments are processing. Nobody was on-call.",
        prompt: "DISSECT the root causes. Not symptoms — ROOT CAUSES. What SYSTEMS, PROCESSES, and CULTURAL patterns made this inevitable? (Copy/paste disabled. Type your original analysis.)",
        minLength: 150,
      },
      own: {
        title: "The Mirror",
        scenario: "Your manager says: 'The junior dev should have known better.' The CEO says: 'Our tech team needs to be more careful.' The junior dev says: 'I have never been trained on deployment procedures.'",
        prompt: "What do YOU personally take responsibility for? Write an honest self-assessment. What did you fail to do that contributed to this? NO deflection. NO 'but they...' statements. Only YOUR accountability.",
        minLength: 100,
      },
      execute: {
        title: "Build It Back Better",
        scenario: "You have been given authority to fix the systems that failed. The CEO wants a plan by Friday. The team is demoralized. You have a budget of $0.",
        prompt: "Write your specific tactical plan: what do you implement in the next 48 hours? What do you build in the next 2 weeks? How do you prevent this from ever happening again? Include tools, processes, and who owns each piece.",
        minLength: 180,
      },
    },
    {
      ...dt(2, "The Impossible Deadline"),
      context: "Your team is building a new feature for a major client — a payroll integration for Zambian SMEs. The client needs it live in 5 days for their month-end payroll run.",
      confront: {
        title: "The Scope Creep Crisis",
        scenario: "On day 3, the client adds 4 'small' requirements that would each take 2+ days. Your product manager says 'we cannot say no, they are our biggest client.' Your lead developer says 'this is impossible with the current timeline.' The client threatens to cancel the contract if it is not delivered on time with all features.",
        prompt: "You are the tech lead. What do you do RIGHT NOW? How do you handle the client, your product manager, your developer, and the deadline — all at once? Be specific about what you say and do.",
        minLength: 120,
      },
      dissect: {
        title: "Why Scope Creep Keeps Happening",
        scenario: "This is the third project this quarter where the client added requirements mid-sprint. There is no change request process. The sales team promises features without consulting engineering. Sprints are planned in isolation from client contracts.",
        prompt: "DISSECT why scope creep keeps happening at your company. What SYSTEMIC failures enable this pattern? Go beyond 'bad communication' — what structures, incentives, and processes are broken? (Type your original analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Role in the Chaos",
        scenario: "Your product manager says: 'You should have raised this risk earlier.' Your developer says: 'I told you the estimate was too optimistic.' The client says: 'We have worked with professional teams before — this never happens.'",
        prompt: "What is YOUR accountability here? What assumptions did you make? What conversations did you avoid? What will you do differently on the next project? Write honestly — no external blame.",
        minLength: 100,
      },
      execute: {
        title: "The Recovery Plan",
        scenario: "You have 48 hours before the client meeting. You need to salvage the relationship and deliver something valuable. The team is burned out.",
        prompt: "Write your exact plan: What do you deliver now vs later? How do you negotiate with the client? What processes do you put in place to prevent this forever? How do you support your burned-out team?",
        minLength: 180,
      },
    },
    {
      ...dt(3, "The Toxic Teammate"),
      context: "You are a senior developer mentoring two junior developers. One junior, Brian, is brilliant but consistently writes code that is hard to maintain. He refuses to attend code reviews and dismisses feedback as 'bureaucracy.' He just pushed production code that broke the build for the third time this month.",
      confront: {
        title: "The Build Breaks — Again",
        scenario: "Brian's latest commit broke the CI/CD pipeline. Three other developers are blocked. The release scheduled for today is delayed. Brian's response in Slack: 'The tests are too strict. My code works on my machine.' The other juniors are losing respect for the process. One is considering leaving.",
        prompt: "You need to address this NOW. What do you say to Brian? What do you say to the blocked team? What do you say to your manager? Write the actual conversations you would have — not generic advice.",
        minLength: 120,
      },
      dissect: {
        title: "Why Brilliant Developers Become Toxic",
        scenario: "Brian joined 8 months ago as a top graduate. He was never given proper onboarding. Code reviews were optional until last month. There is no coding standards document. Senior developers never pair-programmed with him. He learned that 'shipping fast' is valued more than 'shipping right.'",
        prompt: "DISSECT how this situation was CREATED. What systems turned a promising developer into a liability? What cultural signals did Brian pick up? What structural gaps allowed his behavior to continue? (Type original analysis.)",
        minLength: 150,
      },
      own: {
        title: "The Mentor's Failures",
        scenario: "Brian says: 'Nobody ever sat down with me to explain why code reviews matter.' Your manager says: 'As senior dev, mentoring is part of your role.' The junior considering leaving says: 'I do not see the point of following process if Brian does not have to.'",
        prompt: "You are the senior developer. What did YOU fail to do? What mentoring moments did you miss? What standards did you not set? How did your inaction contribute to this? Write your honest self-assessment.",
        minLength: 100,
      },
      execute: {
        title: "Rebuilding the Team Culture",
        scenario: "You have one week to turn this around before the quarterly review. Brian needs to change or leave. The other juniors need to trust the process again. Your manager supports whatever approach you take.",
        prompt: "Write your week-by-week plan: Day 1-2 actions, Week 1 goals, ongoing processes. How do you handle Brian? How do you rebuild team trust? What systems do you put in place? Be specific.",
        minLength: 180,
      },
    },
    {
      ...dt(4, "The Technical Debt Trap"),
      context: "Your codebase is 3 years old. Features that used to take days now take weeks. Bugs are appearing in code that 'was working fine.' Your startup is scaling but the code is not.",
      confront: {
        title: "The Feature That Broke Everything",
        scenario: "A 'simple' user profile update feature has been in development for 3 weeks. Every time the developer fixes one bug, two more appear. The database schema was designed for 1,000 users — you now have 50,000. The original developer left 6 months ago and there is no documentation. The CEO wants to know why a 'simple button' is taking so long.",
        prompt: "You are asked to take over and 'just fix it.' What do you do? Do you refactor, rewrite, or patch? How do you explain the situation to the CEO without sounding like you are making excuses? Be specific.",
        minLength: 120,
      },
      dissect: {
        title: "How Technical Debt Accumulates",
        scenario: "The company has never allocated time for refactoring. 'Ship fast' has been the mantra for 3 years. Three key developers have left. No handover documentation exists. Code reviews were introduced last year but are often skipped under pressure. There is no technical roadmap.",
        prompt: "DISSECT how this technical debt accumulated. What decisions, cultural values, and structural factors made this inevitable? Why did everyone see it coming but nobody stopped it? (Type your original analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Technical Choices",
        scenario: "You have been on this team for 18 months. You have shipped many features on this codebase. You have raised technical debt concerns twice but accepted 'we will fix it later' as the answer.",
        prompt: "What technical decisions did YOU make that added to this debt? When did you choose speed over quality? What conversations did you not push hard enough? Write your honest technical self-assessment.",
        minLength: 100,
      },
      execute: {
        title: "The Technical Roadmap",
        scenario: "The CEO has given you 2 weeks to create a plan and 3 months to start showing improvement. You need to balance new feature delivery with debt reduction. The team is skeptical — they have heard 'we will fix debt' before.",
        prompt: "Write your 90-day technical roadmap. What do you tackle first? How do you measure progress? How do you convince the team and CEO this time is different? Include specific metrics and milestones.",
        minLength: 180,
      },
    },
    {
      ...dt(5, "The Security Breach"),
      context: "A security researcher emails you: 'I found a vulnerability in your authentication system that allows account takeover.' Your platform handles financial transactions for Zambian users.",
      confront: {
        title: "The Vulnerability Report",
        scenario: "The researcher has published a proof-of-concept on Twitter. Users are asking questions. Your security team is just you — the company has never had a dedicated security role. The vulnerability allows anyone to reset any user's password. You do not know how long it has existed.",
        prompt: "You have 1 hour before this becomes a news story. What is your incident response plan? What do you communicate? What do you fix first? How do you handle the researcher, users, and media? Be specific.",
        minLength: 120,
      },
      dissect: {
        title: "Security Culture Failure",
        scenario: "There has never been a security audit. Password reset was built by a freelancer 2 years ago. No pen testing has ever been done. Security is not part of sprint planning. The CEO considered security 'something we will invest in when we are bigger.'",
        prompt: "DISSECT how this security failure was inevitable. What cultural, structural, and resource decisions created this vulnerability? Why was security always deprioritized? (Type original analysis.)",
        minLength: 150,
      },
      own: {
        title: "The Developer's Security Responsibility",
        scenario: "You have reviewed pull requests that touched authentication. You noticed the password reset did not verify identity properly. You flagged it as 'needs improvement' but accepted the merge when the deadline was tight.",
        prompt: "What is YOUR security accountability? What did you notice but not act on? What standards did you not enforce? How did deadline pressure override security? Write your honest assessment.",
        minLength: 100,
      },
      execute: {
        title: "Building Security In",
        scenario: "You need to fix the immediate vulnerability AND prevent this from ever happening again. The CEO has approved one security-focused sprint. Users are losing trust.",
        prompt: "Write your security sprint plan and ongoing security strategy. What do you fix immediately? What processes do you implement? How do you rebuild user trust? How do you make security part of development culture?",
        minLength: 180,
      },
    },
    {
      ...dt(6, "The Career Crossroads"),
      context: "You have been at your current company for 3 years. You started as junior, now you are senior. A competitor has offered you 40% more salary. Your current company cannot match it but promises 'growth opportunities.'",
      confront: {
        title: "The Offer",
        scenario: "The competitor is well-funded and expanding. The role is a step up — Tech Lead. Your current company is bootstrapped and struggling financially. Your manager says: 'We are like family here. Leaving now would really hurt the team.' Your mentor says: 'Never make decisions based on loyalty alone.' Your family needs the money.",
        prompt: "How do you make this decision? What factors do you weigh? What conversations do you have? What do you actually decide and why? Walk through your complete decision-making process.",
        minLength: 120,
      },
      dissect: {
        title: "Understanding Your Career Values",
        scenario: "You realize you have never thought strategically about your career. You took this job because it was available. You stayed because it was comfortable. You have not invested in skills that would make you marketable. Your network is limited to your current colleagues.",
        prompt: "DISSECT your career trajectory so far. What decisions were intentional vs accidental? What skills have you developed vs neglected? What has comfort cost you? What does this offer reveal about your actual market value? (Type honestly.)",
        minLength: 150,
      },
      own: {
        title: "Your Career Ownership",
        scenario: "Your current manager admits: 'We cannot promote you because we do not have budget.' Your family says: 'You need to think about us.' Your colleague who left last year is now thriving. You feel guilty about considering leaving.",
        prompt: "What do you take responsibility for in your career situation? What choices did you make that led here? What ownership have you avoided? What does 'owning your career' actually mean to you? Write honestly.",
        minLength: 100,
      },
      execute: {
        title: "The Career Plan",
        scenario: "Regardless of which job you take, you need a 5-year career plan. Your goal is to become a technical leader who can build teams and products that impact Africa.",
        prompt: "Write your 5-year career roadmap. Year 1, 2, 3, 4, 5 — what do you achieve each year? What skills do you develop? What roles do you target? How do you measure success? What is your contribution to African tech?",
        minLength: 180,
      },
    },
    {
      ...dt(7, "The Legacy Project"),
      context: "You have been asked to lead a project that will digitize government services for rural Zambian communities. 2 million people will be affected. The project has failed twice before. The government has allocated significant budget.",
      confront: {
        title: "The Project Everyone Fears",
        scenario: "Two previous teams have failed. The first was an international consultancy that delivered a system nobody could use. The second was a local team that ran out of money. The rural community representatives say: 'We need something that works on basic phones with poor network.' The government wants a full-featured web app. The timeline is 6 months.",
        prompt: "You have been appointed Tech Lead. Your first meeting with all stakeholders is tomorrow. What do you prepare? What do you say? What do you push back on? What do you commit to? Be specific about your approach.",
        minLength: 120,
      },
      dissect: {
        title: "Why Digital Projects Fail in Africa",
        scenario: "The consultancy designed for London users, not rural Zambia. The local team had no product management experience. Neither team visited the actual communities. Infrastructure assumptions were wrong. Government requirements changed mid-project. There was no user testing in actual conditions.",
        prompt: "DISSECT the systemic reasons African digital projects fail. What assumptions do external teams make? What local knowledge gets ignored? What infrastructure realities get underestimated? What governance issues exist? (Type your deep analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Responsibility to Africa",
        scenario: "You are a Zambian developer with skills that are in global demand. You could work remotely for a Silicon Valley company and earn 5x more. But projects like this need people like you. Your peers say: 'Why work on government projects when you can earn dollars remotely?'",
        prompt: "What do you believe is your responsibility as a skilled African technologist? How do you balance personal prosperity with continental impact? What role will you play in Africa's digital transformation? Write your honest position.",
        minLength: 100,
      },
      execute: {
        title: "The Plan That Works",
        scenario: "You have 6 months, a real budget, and government backing. The rural communities are waiting. Previous failures have created skepticism. You need to deliver something that actually changes lives.",
        prompt: "Write your complete project plan: approach, team, technology choices, community engagement strategy, risk mitigation, success metrics. How is this different from the failed attempts? How do you ensure this actually serves the people?",
        minLength: 200,
      },
    },
  ],
};

/* ═══════════════════════════════════════════
   TEACHER — 7 Days
   ═══════════════════════════════════════════ */
const teacherPack: ProfessionPack = {
  profession: "teacher",
  displayLabel: "Teacher / Educator",
  days: [
    {
      ...dt(1, "The Failing Class"),
      context: "You are a Grade 12 Mathematics teacher at a government school in Lusaka. National exams are in 8 weeks. 70% of your class is averaging below 40%.",
      confront: {
        title: "The Confrontation",
        scenario: "A parent storms into the staffroom during break: 'My son is failing because YOU cannot teach! He had an A in Grade 9! What have you been doing?' Other teachers are watching. The headteacher calls you to her office. Three of your best students have stopped attending. The parent committee wants a meeting.",
        prompt: "What do you do TODAY — starting right now? Address the parent, the headteacher, the absent students, and your lesson plan for this afternoon. Be specific about every action and conversation.",
        minLength: 120,
      },
      dissect: {
        title: "Root Cause Analysis",
        scenario: "Investigation reveals: most students work part-time to support families. The textbook is 14 years old. Last year's math teacher left mid-year and the substitute taught nothing. Internet access is unreliable. The parent who confronted you works two jobs and cannot afford tutoring. Your class has 52 students.",
        prompt: "DISSECT the root causes. Why is this class REALLY failing? What systems, structures, and circumstances created this? Go deeper than 'lack of resources' — what policy failures, what community dynamics, what institutional gaps? (Type original analysis.)",
        minLength: 150,
      },
      own: {
        title: "The Teacher's Mirror",
        scenario: "A student anonymously writes: 'You explain too fast and never check if we understand.' A fellow teacher says: 'These kids are lazy — they do not want to learn.' The headteacher says: 'Math has the worst results in the school.'",
        prompt: "What do YOU take responsibility for? What teaching practices have you assumed work but might not? What students have you overlooked? What could you have done differently this term? Write your honest self-assessment.",
        minLength: 100,
      },
      execute: {
        title: "The 8-Week Turnaround",
        scenario: "You have 8 weeks until exams. The headteacher will support reasonable requests. Some students can stay after school if transport is provided. Others can meet on weekends. You have no budget but community support.",
        prompt: "Write your detailed 8-week recovery plan. Week-by-week for the first 3 weeks, then the approach for the remaining 5. How do you handle different student needs? What do you teach, how, and when? What do you ask from the headteacher and community?",
        minLength: 180,
      },
    },
    {
      ...dt(2, "The Cheating Scandal"),
      context: "You are a secondary school teacher. During a national mock exam, you discover three of your best students have been sharing answers via WhatsApp. One of them is the headteacher's child.",
      confront: {
        title: "Caught in the Act",
        scenario: "You see the WhatsApp messages on a student's phone. The exam is still in progress. The three students include: the headteacher's daughter, a student on scholarship who cannot afford to fail, and the class captain who is supposed to be a role model. The exam counts for 30% of their final grade.",
        prompt: "What do you do IN THIS MOMENT? During the exam. Then what do you do after? How do you handle each student? How do you handle the headteacher? What do you tell the class? Be specific.",
        minLength: 120,
      },
      dissect: {
        title: "Why Students Cheat",
        scenario: "The scholarship student faces family pressure — if she fails, she cannot continue school. The class captain has been told by parents that anything less than an A is failure. The headteacher's daughter feels she must match her mother's expectations. The exam pressure is enormous. There is no academic integrity education.",
        prompt: "DISSECT the root causes of academic dishonesty in your context. What pressures do students face? What cultural factors exist? What systemic issues make cheating feel like the only option? How does the school contribute? (Type original analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Classroom Culture",
        scenario: "You realize you have never explicitly discussed academic integrity with your class. Your assessment style emphasizes high-stakes exams over continuous learning. You have noticed stressed students but dismissed it as 'exam season.'",
        prompt: "What is YOUR responsibility in this cheating incident? What classroom culture did you create that made this possible? What did you not do that you should have? Write your honest self-assessment.",
        minLength: 100,
      },
      execute: {
        title: "Rebuilding Academic Integrity",
        scenario: "You need to handle this incident fairly, support the students, prevent future cheating, and maintain your relationship with the headteacher. The whole school is watching.",
        prompt: "Write your complete response plan: How do you handle each student? What consequences are fair? How do you address the class? What systemic changes do you implement? How do you support students under pressure?",
        minLength: 180,
      },
    },
    {
      ...dt(3, "The Overwhelmed Teacher"),
      context: "You are teaching 5 subjects across 3 grade levels. You have 52 students in your largest class. You have not had a proper break in 3 months. You are exhausted.",
      confront: {
        title: "The Breaking Point",
        scenario: "It is 6 PM. You have been at school since 6:30 AM. You still have 47 assignments to grade, tomorrow's lessons to prepare, and a parent meeting in 30 minutes. Your own child is sick at home. You receive an email: the Ministry of Education has added a new mandatory reporting requirement that takes 3 hours per week. You have not eaten since breakfast.",
        prompt: "You are at your breaking point. What do you do RIGHT NOW? Do you stay and finish? Do you go home? Do you push back? How do you handle the parent meeting? What do you communicate to whom? Be honest about your real response.",
        minLength: 120,
      },
      dissect: {
        title: "The Teacher Burnout System",
        scenario: "Your school has 45 students per class on average. Teachers handle 5+ subjects. There are no teacher assistants. Administrative tasks consume 8+ hours weekly. Professional development is a half-day once per year. Teacher wellbeing is never discussed. The system assumes infinite teacher capacity.",
        prompt: "DISSECT the systemic causes of teacher burnout in your context. What policies, funding decisions, and cultural assumptions create this? Why is teacher wellbeing deprioritized? What invisible labor is expected but never acknowledged? (Type original analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Boundaries",
        scenario: "You have said 'yes' to every extra responsibility for 3 years. You grade assignments during family time. You have not invested in your own professional growth because you have no time. You feel guilty when you rest.",
        prompt: "What boundaries have YOU failed to set? What 'yes' should have been 'no'? How has your inability to say no affected your teaching quality, your health, and your relationships? Write your honest self-assessment.",
        minLength: 100,
      },
      execute: {
        title: "Sustainable Teaching",
        scenario: "You must create a sustainable teaching practice or you will burn out and leave the profession. The headteacher is sympathetic but has no budget. You need solutions that cost nothing.",
        prompt: "Write your sustainable teaching plan: What do you stop doing? What do you delegate or automate? What new habits do you build? How do you protect your wellbeing? What do you communicate to your headteacher? How do you still deliver quality education?",
        minLength: 180,
      },
    },
    {
      ...dt(4, "The Inclusive Classroom"),
      context: "A student with a learning disability joins your class mid-year. You have no special education training. The school has no special education resources. Other students are reacting negatively.",
      confront: {
        title: "The New Student",
        scenario: "Chiko has dyslexia and processes information more slowly. He cannot keep up with note-taking. Other students mock him when he reads aloud. His parents say previous schools rejected him. The Ministry requires inclusive education but provides no support. You have 51 other students to teach.",
        prompt: "Chiko is in your class tomorrow. What specific accommodations do you make? How do you handle the bullying? What do you say to Chiko? What do you communicate to his parents? What do you tell the other students? Be specific.",
        minLength: 120,
      },
      dissect: {
        title: "Inclusive Education Gaps",
        scenario: "Your teacher training covered special education in one 2-hour session. There are no special education teachers in your school. Assessment methods assume uniform ability. Physical infrastructure is not accessible. Parents of children with disabilities often keep them home due to stigma.",
        prompt: "DISSECT why inclusive education fails in your context. What policy gaps exist? What training is missing? What cultural barriers prevent inclusion? How does the system itself exclude? (Type original analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Inclusive Practice",
        scenario: "You have taught for years without adapting for diverse learners. You have noticed struggling students but assumed they 'were not trying hard enough.' You have never sought training in differentiated instruction.",
        prompt: "What is YOUR responsibility toward Chiko and other diverse learners? What assumptions have you held that excluded students? What will you commit to learning and doing? Write your honest self-assessment.",
        minLength: 100,
      },
      execute: {
        title: "Building an Inclusive Classroom",
        scenario: "You need to support Chiko AND improve your teaching for ALL learners. You have no budget but you have creativity and community. Other teachers are watching to see if inclusion can work.",
        prompt: "Write your inclusive classroom plan: What teaching strategies do you adopt? How do you handle assessment? What peer support systems do you create? How do you address stigma? What do you need to learn? Be specific.",
        minLength: 180,
      },
    },
    {
      ...dt(5, "The Curriculum Crisis"),
      context: "The Ministry of Education introduces a new curriculum that is poorly designed, lacks resources, and expects implementation in 2 months. Teachers are confused and parents are angry.",
      confront: {
        title: "The rollout Disaster",
        scenario: "The new curriculum arrives with a 200-page document and zero training. It contradicts what you have been teaching for years. Parents complain that their children are confused. The old textbooks do not match the new curriculum. Exams are still based on the old curriculum. Your colleagues want to ignore the new curriculum and teach the old one.",
        prompt: "What do you do? Do you follow the new curriculum, the old one, or something in between? How do you handle parent complaints? What do you tell your students? How do you work with resistant colleagues? Be specific.",
        minLength: 120,
      },
      dissect: {
        title: "Education Policy Failure",
        scenario: "The curriculum was designed by consultants with no classroom experience. No pilot program was conducted. Teacher input was not solicited. Resources were not developed before rollout. Communication to schools was a single memo.",
        prompt: "DISSECT how education policy fails in implementation. What systemic issues prevent good policy from becoming good practice? How are teachers excluded from decisions that affect them? What would effective policy implementation look like? (Type analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Professional Voice",
        scenario: "You complained about the curriculum to colleagues but never raised it formally. You followed the new curriculum half-heartedly. You did not seek clarity from the Ministry. You let frustration affect your teaching quality.",
        prompt: "What professional responsibility did you avoid? What constructive actions did you not take? How did your silence or half-measures affect your students? Write your honest self-assessment.",
        minLength: 100,
      },
      execute: {
        title: "Leading Through Change",
        scenario: "You decide to take leadership on this issue. Other teachers will follow if someone provides direction. The Ministry might listen if approached professionally. Parents need clarity.",
        prompt: "Write your action plan: How do you navigate the curriculum gap? What do you communicate to stakeholders? How do you advocate for better policy? What immediate teaching strategy do you implement? How do you lead colleagues through this?",
        minLength: 180,
      },
    },
    {
      ...dt(6, "The Student with Potential"),
      context: "You discover that one of your quietest students, Maria, is brilliant but her family cannot afford secondary school fees. She will drop out at the end of this term.",
      confront: {
        title: "The Discovery",
        scenario: "Maria solves a math problem in a way you have never seen — elegant, creative, deeply understood. You learn she walks 8km to school, has not eaten today, and her father lost his job. The term fee is K2,500. She has already stopped doing homework because she knows she is leaving. She has no idea how gifted she is.",
        prompt: "You have discovered extraordinary potential that will be lost. What do you do? How do you approach Maria? How do you approach her family? What actions do you take immediately? What systems do you try to activate? Be specific.",
        minLength: 120,
      },
      dissect: {
        title: "The Talent Loss System",
        scenario: "Maria's situation is not unique. 30% of students in your school face similar circumstances. Scholarship programs exist but are unknown to families. Application processes are complex. Merit-based aid often requires documentation that poor families lack. The system assumes uniform family capacity.",
        prompt: "DISSECT how the education system loses talented students from poor families. What barriers exist at every stage? What assumptions does the system make? What structural changes would prevent this loss? (Type deep analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Role as Talent Guardian",
        scenario: "You have taught for years. How many Marias have you missed because you focused on the loud students, the troublemakers, the obvious high-achievers? How many quiet geniuses dropped out on your watch?",
        prompt: "What is YOUR responsibility as a teacher toward hidden talent? What practices have you used that favor visible students? What will you change to see every student? Write your honest self-assessment.",
        minLength: 100,
      },
      execute: {
        title: "Saving Maria and the Marias",
        scenario: "You decide to fight for Maria and build a system to prevent this from happening again. You have limited resources but unlimited determination. Other teachers want to help.",
        prompt: "Write your complete action plan: How do you save Maria? What support systems do you build? How do you identify hidden talent? What partnerships do you create? What sustainable model can you establish? Be specific.",
        minLength: 180,
      },
    },
    {
      ...dt(7, "The Teacher as Nation Builder"),
      context: "You have been teaching for years. You see the bigger picture now — education is not just about exams, it is about building Zambia's future. But the system fights you at every turn.",
      confront: {
        title: "The System vs. The Mission",
        scenario: "You realize that most of what you are required to teach will be irrelevant to your students' lives. The exam system rewards memorization over critical thinking. Your best lessons — the ones that actually develop students — are not in the curriculum. You are evaluated on exam pass rates, not student growth. You feel you are preparing students for a world that no longer exists.",
        prompt: "You are facing an existential crisis about your profession. What do you actually believe education should be? How do you reconcile the system's demands with your mission? What do you actually do in your classroom? Be deeply honest.",
        minLength: 120,
      },
      dissect: {
        title: "Education for What?",
        scenario: "Zambia's curriculum was inherited from colonial systems and barely updated. It prepares students for jobs that do not exist while ignoring skills that do. Entrepreneurship is not taught. Digital literacy is optional. Critical thinking is not assessed. The system was designed for a different era and a different economy.",
        prompt: "DISSECT the purpose of education in contemporary Zambia. What should it achieve? What skills matter? How does the current system succeed and fail? What would a system designed for ZAMBIA look like? (Type your deepest analysis.)",
        minLength: 150,
      },
      own: {
        title: "The Teacher You Want to Be",
        scenario: "You have been teaching within the system, following its rules, accepting its limitations. You have told yourself 'I am just one teacher, I cannot change the system.' But you have 150 students whose futures depend on what YOU do in YOUR classroom.",
        prompt: "What kind of teacher do you want to be? What have you accepted that you should have challenged? What is YOUR unique contribution to your students? What legacy do you want to leave? Write your honest commitment to yourself.",
        minLength: 100,
      },
      execute: {
        title: "Your Legacy Plan",
        scenario: "You decide to be the teacher who makes a difference. Not someday — starting now. You will work within the system while pushing its boundaries. You will prepare your students for the real world, not just the exam.",
        prompt: "Write your legacy plan: What do you implement immediately? What do you build over the next year? How do you measure success beyond exam results? How do you influence other teachers? What is your contribution to Zambia's future? Be specific and bold.",
        minLength: 200,
      },
    },
  ],
};

/* ═══════════════════════════════════════════
   NURSE / HEALTHCARE — 7 Days
   ═══════════════════════════════════════════ */
const nursePack: ProfessionPack = {
  profession: "registered_nurse",
  displayLabel: "Healthcare Professional",
  days: [
    {
      ...dt(1, "The Ward Crisis"),
      context: "You are the senior nurse on a 30-bed medical ward at University Teaching Hospital. You have 2 junior nurses and a heavy patient load.",
      confront: {
        title: "Multiple Codes",
        scenario: "Three patients code simultaneously. One junior nurse is in her second week. The other has been on shift for 14 hours and is showing fatigue. The ward doctor is in surgery. Four other patients need medications within 10 minutes. A family member is screaming for help.",
        prompt: "Walk through your EXACT first 5 minutes. Who do you assign where? What do you do yourself? What do you delegate? How do you triage when every patient matters? Be specific about every decision.",
        minLength: 120,
      },
      dissect: {
        title: "System Failure Analysis",
        scenario: "The ward has been understaffed for 6 months. The new graduate was put on night shift without a preceptor. 14-hour shifts happen because replacements are not found. Medication rounds are delayed daily because pharmacy delivers late. The nurse-to-patient ratio is 1:15 instead of the recommended 1:5.",
        prompt: "DISSECT the root causes. What SYSTEMIC failures created this crisis? What policies, budget decisions, and cultural patterns made understaffing normal? (Type original analysis.)",
        minLength: 150,
      },
      own: {
        title: "The Nurse's Accountability",
        scenario: "The hospital administrator says: 'Nurses need to work more efficiently.' A colleague says: 'I have been complaining about staffing for months.' A family says: 'My father almost died because nobody was watching him.'",
        prompt: "What do YOU take responsibility for? What could you have done before this crisis? What leadership did you not provide? Write your honest self-assessment. No external blame.",
        minLength: 100,
      },
      execute: {
        title: "Building a Safer Ward",
        scenario: "You have 30 minutes with the board next week. The new graduate is traumatized and considering quitting. You need to prevent this from ever happening again.",
        prompt: "Write your plan: What do you propose to the board? What ward-level changes do you implement? How do you support the new graduate? What systems prevent future crises? Be specific.",
        minLength: 180,
      },
    },
    {
      ...dt(2, "The Ethics Dilemma"),
      context: "A 16-year-old patient confides in you that she is pregnant and wants an abortion. She begs you not to tell her parents. Her parents are your neighbors and will ask about her visit.",
      confront: {
        title: "The Confidentiality Crisis",
        scenario: "Patient confidentiality vs. parental rights vs. your personal beliefs vs. legal requirements vs. community relationships. The patient is crying. The parents arrive at the hospital looking for her. The doctor says 'it is your call, nurse.' You have 2 minutes to decide.",
        prompt: "What do you do? Walk through your decision-making process in real-time. What principles guide you? What do you say to the patient? What do you say to the parents? What do you document? Be specific.",
        minLength: 120,
      },
      dissect: {
        title: "Healthcare Ethics Gaps",
        scenario: "Your training on patient ethics was one afternoon 5 years ago. There is no ethics committee. No hospital lawyer. The law is unclear on minors' rights. Community expectations conflict with professional standards. You have no one to consult.",
        prompt: "DISSECT why healthcare ethics is so difficult in your context. What training gaps exist? What legal ambiguities? What cultural tensions? What systemic support should exist but does not? (Type analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Ethical Compass",
        scenario: "You have strong personal beliefs about this situation. You also have professional obligations. You have never truly examined what you would do when they conflict.",
        prompt: "What are YOUR ethical boundaries? What will you always protect? What have you compromised before that you should not have? What kind of healthcare provider do you want to be? Write your honest ethical self-assessment.",
        minLength: 100,
      },
      execute: {
        title: "Building Ethics Infrastructure",
        scenario: "You decide this cannot happen again without support. You need ethics resources, training, and clear protocols. The hospital administration says 'we do not have budget for that.'",
        prompt: "Write your plan: How do you create ethics support with no budget? What protocols do you establish? How do you train colleagues? How do you advocate for policy change? What is your ethical framework?",
        minLength: 180,
      },
    },
    {
      ...dt(3, "The Burnout Ward"),
      context: "You have been working 60-hour weeks for 3 months. Three colleagues have left. Morale is at rock bottom. You are considering leaving healthcare entirely.",
      confront: {
        title: "The Breaking Point",
        scenario: "You make a near-miss medication error due to exhaustion. You catch yourself just in time. You realize you are not safe to practice. But if you call in sick, the ward will be dangerously understaffed. Your family needs your income. You have used all your leave.",
        prompt: "You are not safe to practice but you cannot leave. What do you do? How do you protect patients while protecting yourself? What conversations do you have? What boundaries do you set? Be honest.",
        minLength: 120,
      },
      dissect: {
        title: "The Nursing Crisis",
        scenario: "Zambia has 1 nurse per 1,500 people (WHO recommends 1 per 300). Nurses earn less than many unskilled workers. Training programs are underfunded. Burnout is normalized as 'dedication.' International recruitment is poaching experienced nurses. The system depends on nurse sacrifice.",
        prompt: "DISSECT the nursing crisis in Zambia. Why do nurses leave? Why is the profession undervalued? What policy failures exist? How does the global nursing shortage affect Africa? (Type deep analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Choice to Stay or Leave",
        scenario: "You have a job offer in the UK that pays 10x your salary. Your family says take it. Your colleagues say 'if you leave, we are finished.' Your patients need you. You are exhausted.",
        prompt: "What is YOUR responsibility? What do you owe yourself? What do you owe your patients? What do you owe Zambia? What decision will you make and why? Write your honest deliberation.",
        minLength: 100,
      },
      execute: {
        title: "Sustainable Nursing Practice",
        scenario: "You decide to stay and fight for change. You need sustainable practices that do not depend on sacrifice. Other nurses will follow if someone leads.",
        prompt: "Write your plan for sustainable nursing: What boundaries do you establish? What advocacy do you undertake? What peer support systems do you create? How do you improve working conditions? How do you still deliver quality care?",
        minLength: 180,
      },
    },
    {
      ...dt(4, "The Community Health Challenge"),
      context: "You are assigned to a rural community where HIV prevalence is 18%. Medication adherence is below 40%. Traditional healers are the first point of care for most residents.",
      confront: {
        title: "The Healing Conflict",
        scenario: "A patient stops taking ARVs because a traditional healer told him they interfere with herbal medicine. His CD4 count is dropping. His family supports the traditional healer. Community leaders view you as an outsider pushing 'Western medicine.' You need this man's trust to save his life.",
        prompt: "How do you approach this patient and community? What do you say to the traditional healer? How do you navigate cultural respect vs. medical necessity? What is your actual conversation strategy? Be specific.",
        minLength: 120,
      },
      dissect: {
        title: "Healthcare Delivery Gaps",
        scenario: "The clinic is 15km away on bad roads. ARV stockouts happen monthly. Patient education materials are not in local languages. Follow-up depends on patients traveling to the clinic. Community health workers are unpaid volunteers. Traditional medicine is culturally embedded and accessible.",
        prompt: "DISSECT why healthcare delivery fails in rural communities. What infrastructure gaps exist? What cultural barriers? What policy failures? How does the health system design exclude rural patients? (Type analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Cultural Competency",
        scenario: "You have dismissed traditional medicine as 'unscientific.' You have not learned about local healing practices. You have delivered health education in English that many do not understand. You have not built community relationships.",
        prompt: "What cultural assumptions have you held that hindered your effectiveness? What have you not learned that you should have? How has your approach excluded the very people you want to help? Write honestly.",
        minLength: 100,
      },
      execute: {
        title: "Integrated Community Health",
        scenario: "You decide to bridge Western medicine and traditional healing. You need community trust, reliable medication delivery, and sustainable health education. You have limited resources but deep commitment.",
        prompt: "Write your community health plan: How do you build trust? How do you integrate traditional and modern medicine? What delivery innovations do you implement? How do you train community health workers? What is your measurable impact?",
        minLength: 180,
      },
    },
    {
      ...dt(5, "The Outbreak Response"),
      context: "A cholera outbreak is declared in your district. Your facility is the main treatment center. You have 20 beds and 50+ patients arriving daily.",
      confront: {
        title: "The Outbreak Begins",
        scenario: "Patients are arriving faster than you can treat them. You are running out of IV fluids. The water supply to the facility is contaminated. Two of your staff show symptoms. The Ministry promises supplies 'tomorrow.' Journalists are asking for statements. A politician arrives for a photo opportunity.",
        prompt: "You are the incident commander. What are your immediate priorities? How do you triage? How do you protect staff? How do you handle the politician and media? What do you tell waiting families? Be specific.",
        minLength: 120,
      },
      dissect: {
        title: "Outbreak Preparedness Gaps",
        scenario: "There is no outbreak response plan. Emergency supplies are expired. Staff have never done outbreak drills. Communication channels to the Ministry are unreliable. The community does not understand cholera prevention. Water and sanitation infrastructure has been neglected for years.",
        prompt: "DISSECT why outbreaks overwhelm healthcare systems. What preparedness gaps exist? What infrastructure failures enable disease spread? What communication breakdowns occur? How does chronic underinvestment create crisis? (Type analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Professional Courage",
        scenario: "You are afraid. Your family wants you to stay home. Two colleagues called in sick. You have not slept properly in 48 hours. The risk to your own health is real.",
        prompt: "What courage means to you as a healthcare worker? What are your limits? What duty do you have vs. what duty do you have to yourself? What does professionalism require in a crisis? Write honestly.",
        minLength: 100,
      },
      execute: {
        title: "Crisis Response Leadership",
        scenario: "You need to lead through this outbreak AND prevent the next one. The community is looking to you. The system is failing but you are not.",
        prompt: "Write your complete outbreak response plan: Immediate triage and treatment. Staff protection and rotation. Community prevention education. Resource advocacy. Post-outbreak prevention. How do you lead when the system fails?",
        minLength: 180,
      },
    },
    {
      ...dt(6, "The Mentor"),
      context: "A new nursing student is assigned to your ward. She is eager but makes frequent mistakes. Other staff do not have patience for her. You see yourself in her 10 years ago.",
      confront: {
        title: "The Mistake That Could Have Hurt Someone",
        scenario: "The student almost administers the wrong medication. You catch it at the last moment. She is shaken and in tears. A senior doctor shouts at her in front of patients. She wants to quit nursing. You know she has the potential to be exceptional.",
        prompt: "What do you do in this moment? How do you handle the student? How do you address the doctor? How do you turn this into a learning moment? What do you say to the student who wants to quit? Be specific.",
        minLength: 120,
      },
      dissect: {
        title: "Nursing Education Reality",
        scenario: "Nursing students get limited clinical supervision. The ratio of students to mentors is 8:1. Teaching is not valued in performance reviews. Mistakes are punished rather than learned from. The best nurses leave teaching roles because they are not rewarded. The cycle continues.",
        prompt: "DISSECT why nursing mentorship is broken. What structural issues prevent good teaching? How does the system lose future excellent nurses? What would effective clinical education look like? (Type analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Mentoring Responsibility",
        scenario: "You remember the nurse who mentored you. She changed your life. But you have not been that person for anyone else. You have been 'too busy' to properly supervise students. You have let them learn from mistakes without guidance.",
        prompt: "What mentoring responsibility have you neglected? What student did you fail? What would your mentor think of your current practice? What kind of mentor do you want to be? Write honestly.",
        minLength: 100,
      },
      execute: {
        title: "Building the Next Generation",
        scenario: "You commit to transforming how nurses are trained in your facility. The student becomes your first success story. Other nurses want to learn how to mentor.",
        prompt: "Write your mentorship program: How do you structure clinical supervision? What teaching methods do you use? How do you create a learning culture? How do you advocate for better student-mentor ratios? What is your legacy?",
        minLength: 180,
      },
    },
    {
      ...dt(7, "The Healer's Legacy"),
      context: "You have been a nurse for years. You have seen everything — birth, death, joy, suffering. You are now a senior figure in your facility. What legacy will you leave?",
      confront: {
        title: "The Patient Who Changed Everything",
        scenario: "A patient you treated 5 years ago returns. She is now a doctor. She says: 'You are why I chose medicine. You treated me like a person, not a diagnosis. I want to work here and be like you.' But the system has not changed. It still breaks nurses. It still underfunds care. She will face the same battles you did.",
        prompt: "What do you tell her? Do you encourage her to join this system? Do you warn her? How do you reconcile your pride in her with your knowledge of what she will face? What is your honest advice?",
        minLength: 120,
      },
      dissect: {
        title: "Healthcare as a System of Care",
        scenario: "Healthcare in Zambia faces chronic underfunding, brain drain, infrastructure gaps, and rising disease burden. Yet dedicated healthcare workers keep showing up. The system survives on their sacrifice. This is neither sustainable nor fair.",
        prompt: "DISSECT what needs to change in Zambia's healthcare system. What policy reforms? What resource allocation? What cultural shifts? What role do healthcare workers play in advocacy? What is the path to a system that does not depend on sacrifice? (Type deep analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Healing Journey",
        scenario: "You started nursing to help people. Along the way, you lost some of that idealism. The system hardened you. You became efficient but maybe less compassionate. You survived but at what cost?",
        prompt: "What have you lost and gained in your nursing career? What kind of healer are you now vs. what you aspired to be? What do you need to reclaim? What is your ongoing commitment to your patients and yourself? Write honestly.",
        minLength: 100,
      },
      execute: {
        title: "The Legacy Plan",
        scenario: "You decide to leave nursing better than you found it. Not through grand gestures — through consistent, deliberate action. You will mentor, advocate, and transform your corner of the system.",
        prompt: "Write your legacy plan: What do you change in your remaining career? How do you develop the next generation? What do you advocate for? How do you measure your impact? What is your contribution to Zambian healthcare? Be bold and specific.",
        minLength: 200,
      },
    },
  ],
};

/* ═══════════════════════════════════════════
   GENERIC / OTHER — 7 Days
   ═══════════════════════════════════════════ */
const genericPack: ProfessionPack = {
  profession: "generic",
  displayLabel: "Professional",
  days: [
    {
      ...dt(1, "The Crisis Moment"),
      context: "You are a professional working in your field. An unexpected crisis hits your workplace.",
      confront: {
        title: "The Unexpected Crisis",
        scenario: "A critical deadline is tomorrow. Your key colleague just resigned. An essential resource is unavailable. Your manager wants a status update. The client is calling. Everything depends on you.",
        prompt: "Describe your exact first hour. What do you prioritize? What do you communicate? What decisions do you make under pressure? Be specific about your actions.",
        minLength: 120,
      },
      dissect: {
        title: "Root Cause Analysis",
        scenario: "The crisis revealed: no backup plans, over-reliance on one person, poor communication systems, unrealistic timelines agreed to under pressure. This pattern has happened before.",
        prompt: "DISSECT the root causes. What systems failed? What processes enabled this? What cultural patterns made this inevitable? (Type original analysis.)",
        minLength: 150,
      },
      own: {
        title: "Personal Accountability",
        scenario: "Everyone has someone to blame. But you are the professional in this situation. You had choices. You had warnings. You had opportunities to prevent this.",
        prompt: "What do YOU take responsibility for? What did you fail to do? What will you do differently? Write your honest self-assessment. No external blame.",
        minLength: 100,
      },
      execute: {
        title: "The Recovery Plan",
        scenario: "You need to fix the immediate crisis AND prevent the next one. You have limited resources but unlimited determination.",
        prompt: "Write your recovery and prevention plan. Specific actions, timelines, and ownership. How do you handle the immediate crisis? What systems do you build? Be specific.",
        minLength: 180,
      },
    },
    {
      ...dt(2, "The Difficult Conversation"),
      context: "You need to have a conversation you have been avoiding. It affects your work, a colleague, and your integrity.",
      confront: {
        title: "The Conversation You Fear",
        scenario: "A colleague is underperforming and it affects your work. You have hinted but never been direct. The situation is getting worse. Your manager expects the team to 'sort it out.' Today, their mistake impacted a client directly.",
        prompt: "You must have the conversation today. What do you say? How do you approach it? What outcome do you want? What do you do if they become defensive? Write the actual conversation.",
        minLength: 120,
      },
      dissect: {
        title: "Why Difficult Conversations Are Avoided",
        scenario: "Your workplace culture avoids confrontation. Feedback is seen as criticism. Hierarchy prevents honesty. Relationships are prioritized over results. Everyone knows the problem but nobody addresses it.",
        prompt: "DISSECT why your workplace avoids difficult conversations. What cultural patterns? What fear? What would a culture of honest feedback look like? (Type analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Avoidance Pattern",
        scenario: "You have been avoiding this conversation for weeks. You told yourself 'it will get better.' It did not. Your avoidance has allowed the situation to worsen.",
        prompt: "What conversations have YOU avoided? What has avoidance cost you? What does it cost your team? What would courage look like in your daily work? Write honestly.",
        minLength: 100,
      },
      execute: {
        title: "Building a Feedback Culture",
        scenario: "You decide to model honest communication. One conversation at a time, you will change the culture of your team.",
        prompt: "Write your plan: How do you have better conversations? What frameworks do you use? How do you train yourself and others? What feedback systems do you implement? Be specific.",
        minLength: 180,
      },
    },
    {
      ...dt(3, "The Innovation Opportunity"),
      context: "You see a better way to do something. But change is resisted. The current way is 'how we have always done it.'",
      confront: {
        title: "The Resistance",
        scenario: "You propose a process improvement that would save 10 hours per week. Your manager says: 'We do not have time to change.' Your colleague says: 'That will never work here.' The person who created the current process is now senior leadership.",
        prompt: "How do you push for change when everyone resists? What is your strategy? What evidence do you gather? Who do you enlist? What do you do when your first attempt fails? Be specific.",
        minLength: 120,
      },
      dissect: {
        title: "Why Organizations Resist Change",
        scenario: "The current process was created by someone powerful. Change threatens identity. People fear obsolescence. Past change initiatives failed. There is no mechanism for proposing improvements. Innovation is not rewarded.",
        prompt: "DISSECT why your organization resists improvement. What cultural, structural, and psychological factors? How do successful organizations handle change? (Type analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Relationship with Change",
        scenario: "You resist some changes yourself. You have ideas you never shared. You have accepted 'the way things are' in areas where you could have pushed.",
        prompt: "Where have YOU been the resistor? What changes did you not embrace? What ideas did you not share? What would a more innovative YOU look like? Write honestly.",
        minLength: 100,
      },
      execute: {
        title: "Leading Change from Anywhere",
        scenario: "You do not need permission to start improving things. You will demonstrate, persuade, and build momentum.",
        prompt: "Write your change leadership plan: What do you improve first? How do you demonstrate value? How do you build allies? What is your 90-day roadmap? Be specific.",
        minLength: 180,
      },
    },
    {
      ...dt(4, "The Ethical Dilemma"),
      context: "You discover something at work that conflicts with your values. Speaking up has consequences. Staying silent eats at your integrity.",
      confront: {
        title: "The Discovery",
        scenario: "You discover your organization is cutting corners on safety / quality / fairness. It benefits the organization financially. Customers do not know. Speaking up could cost you your job. Staying silent makes you complicit.",
        prompt: "What do you do? Walk through your decision-making process. What do you investigate? Who do you talk to? What do you document? What risks do you accept? Be specific.",
        minLength: 120,
      },
      dissect: {
        title: "Why Ethics Fail in Practice",
        scenario: "Whistleblower protections are weak. Reporting channels are not trustworthy. Organizational loyalty is valued over integrity. The cost of speaking up is borne by the individual. The benefit of cutting corners is shared.",
        prompt: "DISSECT why ethical behavior is difficult in your context. What structures enable wrongdoing? What protects wrongdoers? What would genuine ethical infrastructure look like? (Type analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Ethical Line",
        scenario: "You have seen things you did not report. You have accepted practices you disagreed with. You have told yourself 'I am just one person' or 'I need this job.'",
        prompt: "Where have you compromised your ethics? What line will you not cross? What kind of professional do you want to be? Write your honest ethical self-assessment.",
        minLength: 100,
      },
      execute: {
        title: "Ethical Leadership in Action",
        scenario: "You decide to act with integrity regardless of cost. You need a strategy that protects yourself while doing what is right.",
        prompt: "Write your ethical action plan: How do you address the issue? How do you protect yourself? How do you build support? What systems do you advocate for? What is your ethical framework?",
        minLength: 180,
      },
    },
    {
      ...dt(5, "The Team Crisis"),
      context: "Your team is falling apart. Conflict, poor performance, low morale. You did not create this situation but you are part of it.",
      confront: {
        title: "The Team is Breaking",
        scenario: "Two team members refuse to work together. One is your friend. Another is underperforming but has been here for years. The newest member is disillusioned and looking for another job. Your manager says 'figure it out' and goes on leave. Productivity is 40% of normal.",
        prompt: "You are now the de facto team lead. What do you do in your first week? How do you address each person? What do you prioritize? What do you communicate? Be specific.",
        minLength: 120,
      },
      dissect: {
        title: "Why Teams Fail",
        scenario: "The team was assembled without considering dynamics. Conflict was ignored for months. Performance issues were never addressed. The manager abdicated responsibility. There is no team charter, no shared values, no accountability.",
        prompt: "DISSECT why this team failed. What organizational failures? What individual failures? What would a high-performing team require? (Type analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Team Role",
        scenario: "You have contributed to the dysfunction. You took sides in the conflict. You did not speak up about the underperformer. You complained to your friend instead of addressing issues directly.",
        prompt: "What is YOUR responsibility for the team's state? What did you contribute to the dysfunction? What will you do differently? Write your honest self-assessment.",
        minLength: 100,
      },
      execute: {
        title: "Rebuilding the Team",
        scenario: "You commit to rebuilding this team into something excellent. You have no formal authority but you have influence and determination.",
        prompt: "Write your team rebuilding plan: Week 1, Week 2, Month 1 actions. How do you address conflict? How do you set standards? How do you build trust? What rituals do you create? Be specific.",
        minLength: 180,
      },
    },
    {
      ...dt(6, "The Career Pivot"),
      context: "You realize your current path is not taking you where you want to go. Change is scary but staying is scarier.",
      confront: {
        title: "The Realization",
        scenario: "You wake up dreading work. You have been in this role for years with minimal growth. Your skills are becoming outdated. Younger colleagues are being promoted past you. You have a family depending on your income. You are not sure what else you could do.",
        prompt: "How do you face this reality? What honest assessment do you make of your situation? What options do you explore? What conversations do you have? What is your first step? Be specific and honest.",
        minLength: 120,
      },
      dissect: {
        title: "Career Stagnation Analysis",
        scenario: "You stopped investing in your development. Your network shrank to your current workplace. You conflated years of experience with years of growth. The industry changed around you. You were comfortable until you were not.",
        prompt: "DISSECT how you became stagnant. What choices led here? What habits prevented growth? What did you avoid learning? What would a growth-oriented career look like? (Type honest analysis.)",
        minLength: 150,
      },
      own: {
        title: "Your Career Ownership",
        scenario: "You have blamed the company, the economy, the system, your circumstances. But your career is YOUR responsibility. You made choices. You accepted limitations. You stopped reaching.",
        prompt: "What career ownership have you avoided? What risks did you not take? What did you accept that you should have challenged? Write your honest self-assessment.",
        minLength: 100,
      },
      execute: {
        title: "The Pivot Plan",
        scenario: "You decide to take control of your career. Whether you stay or go, you will be intentional. You will grow. You will not be stagnant again.",
        prompt: "Write your career pivot plan: What skills do you develop? What network do you build? What role do you target? What is your 12-month roadmap? How do you measure progress? Be specific and bold.",
        minLength: 180,
      },
    },
    {
      ...dt(7, "The Professional Legacy"),
      context: "You have built a career. You have developed skills, relationships, and experience. What will you leave behind? What impact will you have had?",
      confront: {
        title: "The Legacy Question",
        scenario: "A younger professional asks you: 'What advice would you give someone starting their career?' You realize your answer reveals everything about what you value. You also realize you are not sure you have lived by your own advice.",
        prompt: "What advice do you give? And have YOU followed it? What gap exists between what you believe and what you have done? Be brutally honest with yourself.",
        minLength: 120,
      },
      dissect: {
        title: "Professional Life in Review",
        scenario: "You review your career: the wins, the losses, the compromises, the moments of pride, the regrets. The patterns emerge. The person you were. The person you became. The person you wanted to be.",
        prompt: "What patterns define your professional life? What have you prioritized? What have you neglected? What are you proud of? What do you regret? What does this review reveal? (Type deep reflection.)",
        minLength: 150,
      },
      own: {
        title: "The Person You Want to Be",
        scenario: "You are not done. But you are at a point where you must choose who you will be for the rest of your career. The choices you make now define your legacy.",
        prompt: "What kind of professional do you want to be remembered as? What changes must you make? What must you preserve? What is your commitment to yourself? Write your honest commitment.",
        minLength: 100,
      },
      execute: {
        title: "Your Legacy Plan",
        scenario: "You decide to be intentional about your remaining career. Every action will align with who you want to be. You will mentor, create, contribute, and leave things better than you found them.",
        prompt: "Write your legacy plan: What do you achieve in the next 5 years? How do you develop others? What do you create? What is your contribution to your field and your community? What is your definition of a life well-lived professionally? Be bold and specific.",
        minLength: 200,
      },
    },
  ],
};

/* ═══════════════════════════════════════════
   PROFESSION PACK REGISTRY
   ═══════════════════════════════════════════ */
import { financePack, customerServicePack, managementPack, engineeringPack } from "./crucible-packs";

export const PROFESSION_PACKS: Record<string, ProfessionPack> = {
  software_developer: developerPack,
  data_analyst: developerPack,
  registered_nurse: nursePack,
  teacher: teacherPack,
  accountant: financePack,
  sales_representative: managementPack,
  project_manager: managementPack,
  graphic_designer: managementPack,
  electrician: engineeringPack,
  customer_service: customerServicePack,
  chef: managementPack,
  civil_engineer: engineeringPack,
  other: genericPack,
  generic: genericPack,
};

export function getProfessionPack(profession: string | null | undefined): ProfessionPack {
  if (!profession) return genericPack;
  return PROFESSION_PACKS[profession] ?? genericPack;
}

/* ═══════════════════════════════════════════
   THE LEVAV CODE™
   ═══════════════════════════════════════════ */
export const LEVAV_CODE = [
  { code: "OWNERSHIP", desc: "I take absolute responsibility for outcomes" },
  { code: "EXCELLENCE", desc: "I pursue mastery in everything I do" },
  { code: "RELIABILITY", desc: "My word is my bond. I deliver what I promise" },
  { code: "INITIATIVE", desc: "I see what needs doing and I act" },
  { code: "GROWTH", desc: "I am committed to continuous learning" },
  { code: "CRITICAL THINKING", desc: "I question assumptions and seek truth" },
  { code: "SERVICE", desc: "I exist to create value for others" },
  { code: "IMPACT", desc: "I measure success by the difference I make" },
];
