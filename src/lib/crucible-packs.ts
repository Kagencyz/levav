/**
 * ============================================================
 * ADDITIONAL PROFESSION PACKS — Finance, Management, Creative,
 * Customer Service, Hospitality, Engineering, Healthcare, Sales
 * ============================================================
 * Each pack: 7 days × 4 phases (CONFRONT→DISSECT→OWN→EXECUTE)
 * Connected scenarios specific to each profession.
 * ============================================================
 */

import type { ProfessionPack } from "./crucible-data";

const dt = (day: number, title: string) => ({ day, title });

/* ═══════════════════════════════════════════
   FINANCE & ACCOUNTING — 7 Days
   ═══════════════════════════════════════════ */
export const financePack: ProfessionPack = {
  profession: "accountant",
  displayLabel: "Finance & Accounting",
  days: [
    {
      ...dt(1, "The Payroll Nightmare"),
      context: "You are the senior accountant at a mid-sized manufacturing company in Ndola. You handle payroll for 200 employees across three shifts.",
      confront: {
        title: "Salaries Disappeared",
        scenario: "It is 4:30 PM on payday. The mobile money disbursement platform processed all 200 payments — but every single employee received ZERO kwacha. The platform shows 'Transaction Successful' but the money never reached anyone's account. Workers are calling, WhatsApp groups are exploding, and the factory floor supervisor is at your door with 15 angry workers demanding answers. The mobile money provider's support line is busy.",
        prompt: "What do you do in the FIRST 30 MINUTES? Every phone call, email, system check, and communication. Walk through YOUR exact moves in order.",
        minLength: 120,
      },
      dissect: {
        title: "Where Did The Money Go?",
        scenario: "Investigation reveals: The disbursement API had a bug where the 'amount' field was being read as '0' when formatted with commas (e.g., '3,500.00' became '0.00'). Your Excel export template added commas last month when you reformatted it. Nobody tested the disbursement after the template change. There is no reconciliation step between the export and the actual transfer.",
        prompt: "DISSECT the root causes. What SYSTEMS, PROCESSES, and CULTURAL patterns made this inevitable? Why did nobody catch this? (Copy/paste disabled. Type your original analysis.)",
        minLength: 150,
      },
      own: {
        title: "The Mirror",
        scenario: "Your manager says 'The software vendor should have handled this.' The HR manager says 'I told you Excel was risky.' The vendor says 'Your format broke our parser.' The workers say 'Every month there's a new problem with payroll.'",
        prompt: "What do YOU personally take responsibility for? Write an honest self-assessment. What did YOU fail to do that contributed to this? NO deflection. Only YOUR accountability.",
        minLength: 100,
      },
      execute: {
        title: "Build The Fortress",
        scenario: "The CEO asks you to present a plan at tomorrow's management meeting to ensure this never happens again. She wants a new payroll process that is bulletproof.",
        prompt: "Design a complete new payroll disbursement workflow with THREE concrete safeguards. Include: validation checks, reconciliation steps, and an emergency protocol. Be specific — not generic 'use better software' advice.",
        minLength: 150,
      },
    },
    {
      ...dt(2, "The Tax Audit Bomb"),
      context: "You work as a financial analyst at a logistics company. ZRA (Zambia Revenue Authority) has announced an audit covering the past 3 years.",
      confront: {
        title: "The Auditor Arrives",
        scenario: "A ZRA auditor walks in unannounced at 9 AM Monday. She wants all VAT records, expense receipts, and payroll tax filings for 2022-2025. Your predecessor kept paper records in a filing cabinet that got damaged during the last rainy season. The digital records are scattered across three different systems. Your boss is on a flight to Johannesburg and not answering calls.",
        prompt: "How do you handle the FIRST HOUR of this audit? What do you say to the auditor? What do you prioritize? What do you NOT do?",
        minLength: 120,
      },
      dissect: {
        title: "Why Are We So Unprepared?",
        scenario: "The company has never been audited before. There is no document retention policy. Expenses are approved by WhatsApp messages. The previous accountant left 8 months ago and took all their knowledge with them. The CEO has always said 'we are too small for ZRA to bother with.'",
        prompt: "DISSECT the organizational failures. Why did the company treat tax compliance as optional? What cultural and structural factors led to this vulnerability?",
        minLength: 150,
      },
      own: {
        title: "Your Role In The Mess",
        scenario: "You have been here for 6 months. You noticed the record-keeping was chaotic on your first day but focused on 'more urgent' month-end tasks instead. You once suggested digitizing records but dropped it when the CEO said it was expensive.",
        prompt: "What specific decisions did YOU make (or NOT make) that left the company exposed? What will you do differently going forward?",
        minLength: 100,
      },
      execute: {
        title: "The Compliance System",
        scenario: "The CEO returns and asks you to build a compliance framework that satisfies the auditor AND prevents future chaos.",
        prompt: "Design a 4-step document management and tax compliance system that a small-to-medium Zambian company can actually implement. Include: digitization approach, retention policy, monthly reconciliation ritual, and audit-readiness checklist.",
        minLength: 150,
      },
    },
    {
      ...dt(3, "The Cash Flow Crisis"),
      context: "You are the finance manager at a construction materials supplier in Lusaka.",
      confront: {
        title: "We Cannot Pay Suppliers",
        scenario: "Your biggest client — a government infrastructure project — has delayed payment by 90 days. You owe K2.5 million to three cement suppliers who are threatening to stop deliveries. Your warehouse is already half-empty. The payroll for 45 workers is due Friday. The bank will not extend your overdraft because your debt-to-income ratio is too high.",
        prompt: "You have 72 hours to solve this. What are your exact moves? Who do you call first, second, third? What do you negotiate? What do you sacrifice?",
        minLength: 150,
      },
      dissect: {
        title: "How Did We Get Here?",
        scenario: "The company has one client that represents 60% of revenue. Payment terms were never formalized in writing. The CEO personally 'handled' the government relationship and never shared details. There is no cash flow forecasting — you only find out about problems when checks bounce.",
        prompt: "DISSECT the structural vulnerabilities. Why did the company bet everything on one client? What financial management practices were missing? How did the CEO's informality create this crisis?",
        minLength: 150,
      },
      own: {
        title: "The Finance Manager's Burden",
        scenario: "You saw the revenue concentration risk in your first month. You raised it once in a meeting and the CEO said 'government always pays, just slowly.' You never raised it again.",
        prompt: "What is YOUR accountability here? What should you have done? What will you commit to doing differently as a finance professional?",
        minLength: 100,
      },
      execute: {
        title: "The Recovery Plan",
        scenario: "The CEO agrees to implement any financial controls you recommend — but you must keep the business running while fixing everything.",
        prompt: "Create a 90-day financial stabilization plan. Include: immediate cash preservation measures, client diversification strategy, payment terms policy, and a simple cash flow forecasting system.",
        minLength: 150,
      },
    },
    {
      ...dt(4, "The Fraud Discovery"),
      context: "You are an internal auditor at a retail chain with 12 stores across Zambia.",
      confront: {
        title: "The Numbers Do Not Add Up",
        scenario: "During a routine stock reconciliation, you discover that Store #7 in Kitwe is reporting 40% higher sales than any other store of the same size — but inventory levels are normal. The store manager has been Employee of the Month for 6 months straight. When you request the sales receipts, the manager says 'the printer broke' and offers to email them later.",
        prompt: "What do you do RIGHT NOW? Who do you involve? What evidence do you preserve? How do you handle the manager? Walk through your exact actions.",
        minLength: 150,
      },
      dissect: {
        title: "How Deep Does It Go?",
        scenario: "Further investigation reveals: fake receipts created in Microsoft Word, sales being rung up on the POS then immediately voided (but commission still recorded), and the manager sharing the 'bonus' with the area supervisor who approves all the numbers.",
        prompt: "DISSECT the control failures. How did a fraud this obvious go undetected for 6 months? What gaps in the system, oversight, and culture allowed two employees to steal with confidence?",
        minLength: 150,
      },
      own: {
        title: "The Auditor's Conscience",
        scenario: "You have been auditing this store for a year. You noticed the anomaly numbers 3 months ago but told yourself 'maybe they are just really good.' The manager has a family with three children.",
        prompt: "What is your personal accountability? How did your hesitation and assumptions contribute? How do you handle the human element while maintaining professional integrity?",
        minLength: 120,
      },
      execute: {
        title: "Fraud-Proof The System",
        scenario: "The CEO wants new anti-fraud controls across ALL 12 stores within 30 days.",
        prompt: "Design a 5-point anti-fraud control system for a multi-store retail operation. Include: POS controls, inventory verification, whistleblower mechanism, random audit protocol, and management oversight. Be specific to the Zambian retail context.",
        minLength: 150,
      },
    },
    {
      ...dt(5, "The Budget Battle"),
      context: "You are the finance controller at an NGO implementing education programs across rural Zambia.",
      confront: {
        title: "Donor Demands Cuts",
        scenario: "Your primary donor — a European foundation — has cut your funding by 35% effective next quarter. You have 23 staff under contract, 8 active school programs, and 3 vehicle leases. The deadline to submit a revised budget is in 5 days. The program director refuses to cut any education activities. The operations manager says 'we should lay off the new hires.'",
        prompt: "How do you facilitate the budget revision process? What framework do you use? How do you balance the program director's mission focus with financial reality? What specific cuts do you propose and why?",
        minLength: 150,
      },
      dissect: {
        title: "Why One Donor Controls Everything",
        scenario: "The NGO has operated for 7 years with 70% of funding from one donor. There is no fundraising strategy. The board has no finance committee. When the donor's priorities shifted, the NGO had zero buffer.",
        prompt: "DISSECT the strategic vulnerability. Why did the leadership ignore financial diversification for 7 years? What cultural factors in the non-profit sector enable this dependency?",
        minLength: 150,
      },
      own: {
        title: "The Controller's Voice",
        scenario: "You have been warning about donor concentration for 18 months. You presented data at three board meetings. Each time, the response was 'let's focus on program delivery, fundraising will sort itself out.'",
        prompt: "Looking back, how could YOU have been more effective? What different approach to communication and persuasion might have worked? What do you commit to doing differently as a finance leader?",
        minLength: 120,
      },
      execute: {
        title: "Financial Resilience Plan",
        scenario: "The board finally agrees you need a sustainable funding model. They have given you 6 months to design and begin implementing it.",
        prompt: "Design a financial sustainability plan for a Zambian education NGO. Include: diversified funding sources (with specific examples), cost structure optimization, reserve fund policy, and a financial health dashboard for monthly board reporting.",
        minLength: 150,
      },
    },
    {
      ...dt(6, "The Investment Decision"),
      context: "You are the CFO advisor at a family-owned agribusiness in Eastern Province.",
      confront: {
        title: "Expand or Survive?",
        scenario: "The founder's son — who just returned from studying business in South Africa — wants to spend K8 million on a new cold storage facility. Current cold storage utilization is only 60%. The company's debt is already K12 million. Maize prices have been volatile. The founder (his father) says 'my son has the education, I trust him.' Your financial model shows a 40% chance the investment fails within 2 years.",
        prompt: "How do you present your analysis to the founder and his son? What data do you show? How do you balance respect for family dynamics with your fiduciary duty? What alternative do you propose?",
        minLength: 150,
      },
      dissect: {
        title: "The Family Business Trap",
        scenario: "The company has no formal investment approval process. The founder makes all decisions based on gut feel. The son feels pressure to prove his education was worth it. There is no board of directors, just family members who never challenge the founder.",
        prompt: "DISSECT why family businesses in Zambia struggle with professional financial management. What cultural dynamics prevent objective decision-making? What structural changes are needed without destroying family trust?",
        minLength: 150,
      },
      own: {
        title: "Your Financial Advice",
        scenario: "Last year, you approved a K3 million equipment purchase that is now sitting unused 70% of the time. You did not push back hard enough because the founder was excited about it.",
        prompt: "What does your past approval say about YOUR judgment? How have you changed since then? What principles will guide your advice going forward — even when it is unpopular?",
        minLength: 120,
      },
      execute: {
        title: "The Investment Framework",
        scenario: "The founder, impressed by your honesty, asks you to create a formal investment decision process for the company.",
        prompt: "Design a 5-step investment evaluation framework tailored for a medium-sized Zambian agribusiness. Include: financial metrics, risk assessment, market analysis, stakeholder consultation process, and go/no-go criteria with specific thresholds.",
        minLength: 150,
      },
    },
    {
      ...dt(7, "The Year-End Reckoning"),
      context: "You are the head of finance at a growing tech company preparing for Series A funding.",
      confront: {
        title: "Investor Due Diligence",
        scenario: "A venture capital firm from Nairobi is conducting due diligence. They discover: your revenue recognition policy is inconsistent (some contracts recognized upfront, others monthly), two 'customers' are actually sister companies of your CEO, and your burn rate calculation excludes contractor costs. The lead investor calls you directly and asks: 'Is this company investable?'",
        prompt: "How do you respond to the investor in that phone call? What do you admit? What do you explain? What commitments do you make? Then, what do you do in the next 48 hours?",
        minLength: 150,
      },
      dissect: {
        title: "Startup Finance Fantasy",
        scenario: "The CEO has been optimizing for 'growth metrics' that impress investors rather than sustainable business health. The inconsistent revenue recognition started as a 'temporary' workaround 18 months ago. The sister-company deals were never disclosed to the team.",
        prompt: "DISSECT the startup culture that prioritizes fundraising over financial integrity. How did the CEO's ambition create a culture where financial corners were cut? What warning signs did everyone ignore?",
        minLength: 150,
      },
      own: {
        title: "The Finance Head's Integrity",
        scenario: "You signed off on the financial reports knowing the revenue recognition was inconsistent. You told yourself 'every startup does this' and 'we will fix it after the raise.'",
        prompt: "What does this say about YOUR professional integrity? When did you cross the line from 'pragmatic' to 'complicit'? What will you do differently in your next role — or even this one?",
        minLength: 120,
      },
      execute: {
        title: "Investor-Grade Finance",
        scenario: "The CEO agrees to clean everything up and asks you to design a finance function worthy of institutional investment.",
        prompt: "Design a complete finance operating system for a Zambian tech startup seeking Series A. Include: chart of accounts, monthly close process, revenue recognition policy, burn rate tracking, cap table management, and investor reporting template.",
        minLength: 200,
      },
    },
  ],
};

/* ═══════════════════════════════════════════
   CUSTOMER SERVICE — 7 Days
   ═══════════════════════════════════════════ */
export const customerServicePack: ProfessionPack = {
  profession: "customer_service",
  displayLabel: "Customer Service",
  days: [
    {
      ...dt(1, "The Angry Customer"),
      context: "You work at a mobile network provider's call center in Lusaka. You handle 40-60 calls per day.",
      confront: {
        title: "The Screaming Caller",
        scenario: "A business customer is screaming that his company lost K50,000 because your network was down for 6 hours yesterday. He is threatening to sue. He wants to speak to 'the highest person in the company.' His contract is worth K2 million annually. Your script says 'I understand your frustration.' He just hung up on the last agent.",
        prompt: "You answer the call. What is your EXACT opening? How do you de-escalate? What do you offer? What do you NOT say? Walk through the conversation beat by beat.",
        minLength: 150,
      },
      dissect: {
        title: "Why The Network Failed",
        scenario: "The outage was caused by a power surge at the base station. Backup generators failed because maintenance was deferred for 3 months. The customer received no proactive notification because the alert system only monitors — it does not send customer communications.",
        prompt: "DISSECT the service failure. What SYSTEM gaps allowed a preventable power issue to become a customer catastrophe? Why is there no connection between technical monitoring and customer communication?",
        minLength: 150,
      },
      own: {
        title: "The Agent's Responsibility",
        scenario: "You knew the generators were unreliable because three agents complained about 'weird static' on calls from that area last month. Nobody reported it through official channels because the internal reporting system is confusing.",
        prompt: "What is YOUR accountability? What should you have done with the information about static? How can frontline agents bridge the gap between what they observe and what the technical team knows?",
        minLength: 100,
      },
      execute: {
        title: "Service Recovery Protocol",
        scenario: "Your manager asks you to help design a new service recovery process for business customers after outages.",
        prompt: "Create a 4-step service recovery protocol: immediate response, root cause communication, compensation framework, and prevention commitment. Make it specific to the Zambian telecom context.",
        minLength: 150,
      },
    },
    {
      ...dt(2, "The System Is Down"),
      context: "You are a help desk support agent at a bank's digital banking department.",
      confront: {
        title: "100 Customers Cannot Access Accounts",
        scenario: "The mobile banking app is throwing errors. Customers cannot check balances, transfer money, or pay bills. It is 11 AM — peak transaction time. The queue of waiting customers at your branch is 30 people deep. The IT team says 'we are working on it' with no ETA. An elderly customer is crying because she cannot pay her hospital bill.",
        prompt: "You are the ONLY help desk agent on duty. What do you do? How do you prioritize? What do you tell each type of customer? How do you get information from IT?",
        minLength: 150,
      },
      dissect: {
        title: "Single Point of Failure",
        scenario: "The app depends on one API gateway. There is no failover. There is only one help desk agent scheduled for mid-morning because management considers it a 'quiet period.' The IT team has no incident communication protocol.",
        prompt: "DISSECT why a bank's digital banking has zero redundancy. What business and cultural factors led to under-investing in customer-facing technology and support?",
        minLength: 150,
      },
      own: {
        title: "The Frontline Reality",
        scenario: "You have been asking for a second mid-morning agent for 2 months. Your supervisor said 'budget constraints.' You stopped asking.",
        prompt: "What could YOU have done differently to advocate for proper staffing? What data or approach might have worked? What will you do next time you see a capacity problem coming?",
        minLength: 100,
      },
      execute: {
        title: "The Crisis Playbook",
        scenario: "The branch manager wants a written crisis response plan for digital banking outages.",
        prompt: "Design a crisis communication and triage playbook for a bank's digital banking failure. Include: customer communication templates by severity, queue management, IT escalation protocol, and branch staff coordination.",
        minLength: 150,
      },
    },
    {
      ...dt(3, "The Difficult Colleague"),
      context: "You work in a retail store's customer service desk.",
      confront: {
        title: "Your Coworker Is Rude To Customers",
        scenario: "You overhear your colleague telling a customer 'that is not my problem, go to the other counter' — but the other counter closed an hour ago. This is the third time this week. The customer is a regular who shops here monthly. Your colleague is the store manager's cousin.",
        prompt: "What do you do in the NEXT 5 MINUTES? How do you handle the immediate customer situation? How do you address your colleague? When and how do you escalate?",
        minLength: 120,
      },
      dissect: {
        title: "Nepotism And Service Culture",
        scenario: "The store has no customer service standards. There is no training. The manager hired family members for half the positions. Customer complaints go to the manager — who dismisses them because 'my family would not do that.'",
        prompt: "DISSECT how nepotism destroys service quality. Why do small businesses in Zambia hire family despite the risks? What alternative structures could work?",
        minLength: 120,
      },
      own: {
        title: "Your Silence",
        scenario: "You noticed the cousin's attitude on your first day but told yourself 'not my business.' You have seen 4 regular customers stop coming.",
        prompt: "What is your accountability? When should you have spoken up? What stopped you? What would you do now if you could go back to day one?",
        minLength: 100,
      },
      execute: {
        title: "Service Standards For Small Retail",
        scenario: "The store owner (not the manager) overhears your conversation with the customer and asks you to help improve service.",
        prompt: "Design a simple but effective customer service standard for a small Zambian retail store with 8 staff. Include: greeting protocol, complaint handling, staff accountability, and a basic training outline.",
        minLength: 150,
      },
    },
    {
      ...dt(4, "The VIP Complaint"),
      context: "You are the client relations manager at an insurance company.",
      confront: {
        title: "The Policyholder Who Knows The CEO",
        scenario: "A prominent businessman's claim for a K3 million fire damage has been rejected because the policy lapsed 3 days before the fire. He says he paid the renewal premium but the agent never processed it. He has tweeted that your company is a scam. The CEO's office just called asking for a briefing in 1 hour.",
        prompt: "How do you prepare for the CEO briefing? What facts do you verify? What position do you recommend? How do you handle the reputational crisis?",
        minLength: 150,
      },
      dissect: {
        title: "The Agent Problem",
        scenario: "The agent who 'collected' the premium is a freelance commission-only salesperson. He has been cited 4 times for payment irregularities but brings in 15% of new business. There is no electronic payment verification system.",
        prompt: "DISSECT the structural problem. Why does the company rely on freelance agents with no oversight? What incentives create this risk? What does it say about the insurance model in Zambia?",
        minLength: 150,
      },
      own: {
        title: "Your Due Diligence",
        scenario: "You approved the original claim rejection based on the system showing 'lapsed.' You did not call the agent to verify before rejecting.",
        prompt: "Where did YOUR process fail? What verification steps should you have taken? How do you balance efficiency with thoroughness in claims processing?",
        minLength: 100,
      },
      execute: {
        title: "Trust Through Transparency",
        scenario: "The CEO asks you to redesign the claims process to prevent this from happening again.",
        prompt: "Design a claims process that builds customer trust while preventing fraud. Include: payment verification, agent oversight, communication protocol for rejections, and escalation path for disputed claims.",
        minLength: 150,
      },
    },
    {
      ...dt(5, "The Social Media Storm"),
      context: "You are the social media and customer service lead at a restaurant chain.",
      confront: {
        title: "Viral Food Poisoning Post",
        scenario: "A customer's Facebook post about food poisoning at your Kitwe branch has 2,000 shares in 3 hours. The photo shows a cockroach on a plate. Local news stations are calling. Your Kitwe branch manager says 'that photo looks fake.' But three other people have commented saying they also got sick. Your boss is at a conference and unreachable.",
        prompt: "You have the social media passwords. What do you post? What do you NOT post? Who do you call? How do you handle the media? What do you tell the Kitwe branch?",
        minLength: 150,
      },
      dissect: {
        title: "Food Safety Blind Spots",
        scenario: "Health inspections happen once per year and are announced in advance. The Kitwe branch has no temperature logs for the past month. The kitchen staff turnover is 80% — most new hires get 2 hours of training. There is no pest control contract.",
        prompt: "DISSECT why food safety is treated as a compliance checkbox rather than a daily practice. What economic and cultural factors allow restaurants to cut corners on hygiene?",
        minLength: 150,
      },
      own: {
        title: "The Social Media Leader",
        scenario: "You saw a one-star review from last month mentioning 'funny smell' at the Kitwe branch. You deleted it because 'one bad review hurts our rating.'",
        prompt: "What does deleting the review say about YOUR approach to customer feedback? How could that review have been a warning signal? What is your commitment to honest customer communication going forward?",
        minLength: 100,
      },
      execute: {
        title: "The Reputation Recovery",
        scenario: "The health inspector cleared you — the cockroach photo was from a competitor's restaurant. But the damage to your brand is real.",
        prompt: "Design a reputation recovery plan. Include: social media response strategy, transparency initiative, customer trust rebuilding, and operational improvements that prevent real incidents.",
        minLength: 150,
      },
    },
    {
      ...dt(6, "The Escalation Maze"),
      context: "You are a customer experience specialist at an e-commerce platform.",
      confront: {
        title: "The Order That Never Arrived",
        scenario: "A customer ordered a K15,000 laptop 3 weeks ago. The tracking says 'delivered' but the customer never received it. The delivery company says 'someone at the address signed.' The customer lives alone. Your refund policy requires a police report for lost items over K10,000. The customer has called 7 times and been transferred to 4 different departments.",
        prompt: "The customer calls you — their 8th call. What do you say? What do you do? How do you cut through the bureaucratic maze? What is the RIGHT outcome?",
        minLength: 150,
      },
      dissect: {
        title: "Fragmented Responsibility",
        scenario: "No department owns the full customer journey. Shipping blames delivery. Delivery blames the recipient. Finance requires police reports. Customer service has no authority to issue refunds over K5,000.",
        prompt: "DISSECT why companies design customer service systems that protect the company instead of solving customer problems. What incentives created this fragmented mess?",
        minLength: 150,
      },
      own: {
        title: "Your Authority Limits",
        scenario: "You have a K5,000 refund authority. The laptop is K15,000. Your supervisor is on leave. The company policy says 'escalate to supervisor' — but there is no backup escalation path.",
        prompt: "What do YOU do when the system gives you no power but the customer needs help? How do you work within broken systems while advocating for change?",
        minLength: 100,
      },
      execute: {
        title: "The Customer-First Redesign",
        scenario: "The COO asks you to redesign the lost-item handling process.",
        prompt: "Design a customer-first lost/damaged item process for a Zambian e-commerce company. Include: single point of contact, authority levels, resolution timeframes, and a trust-based refund policy for verified customers.",
        minLength: 150,
      },
    },
    {
      ...dt(7, "The Service Legacy"),
      context: "You have been promoted to Head of Customer Experience at a telecom company.",
      confront: {
        title: "Transform Or Die",
        scenario: "Your company has the worst NPS in the industry. Churn is 35% annually. The CEO has given you 6 months to turn it around with a K500,000 budget. Your team of 45 agents has an average tenure of 8 months. The current CSAT is 2.1 out of 5. Your first town hall, an agent stands up and says: 'We want to help customers but the systems are broken and management never listens.' The room erupts in applause.",
        prompt: "What is your FIRST public response to that agent? Then, what are your FIRST 5 ACTIONS in your first week? What quick wins do you pursue? What long-term foundations do you begin?",
        minLength: 200,
      },
      dissect: {
        title: "The Broken Service Machine",
        scenario: "Agents work 10-hour shifts with 15-minute breaks. They handle 80 calls/day with an average handle time target of 3 minutes. Customer history is on a different system than billing. Agents get penalized for long calls even when solving complex problems. Management measures 'calls answered' not 'problems solved.'",
        prompt: "DISSECT why service organizations optimize for speed over quality. How did management metrics create a system where both employees AND customers are miserable? What is the fundamental flaw?",
        minLength: 150,
      },
      own: {
        title: "Your Leadership Test",
        scenario: "You were a high-performing agent who hit all the metrics. You never questioned the system because you were winning within it. Now you see the human cost.",
        prompt: "How did your success within a broken system make you complicit? What will you now prioritize as a leader — even if it means short-term metric drops? What is your personal leadership philosophy going forward?",
        minLength: 120,
      },
      execute: {
        title: "The Service Revolution",
        scenario: "You have 6 months and K500,000. The CEO wants a transformation plan by Friday.",
        prompt: "Design a complete customer experience transformation for a Zambian telecom company. Include: agent experience improvements, technology fixes, measurement overhaul, customer communication strategy, and a 90/180-day milestone plan with specific targets.",
        minLength: 250,
      },
    },
  ],
};


/* ═══════════════════════════════════════════
   MANAGEMENT & OPERATIONS — 7 Days
   ═══════════════════════════════════════════ */
export const managementPack: ProfessionPack = {
  profession: "project_manager",
  displayLabel: "Management & Operations",
  days: [
    {
      ...dt(1, "The Team Revolt"),
      context: "You are the new operations manager at a manufacturing plant in Kabwe with 85 workers across three shifts.",
      confront: {
        title: "The Walkout",
        scenario: "Monday morning, 6 AM shift: 23 workers refuse to enter the factory. They are demanding overtime pay for last Saturday's mandatory inventory — which management called 'voluntary team building.' The night shift supervisor sided with them and locked the main gate. Production targets for the week are already at risk. The plant director is in South Africa.",
        prompt: "You arrive at 7 AM to find the gate locked and workers chanting outside. What do you do in the FIRST HOUR? Who do you speak to? What do you promise? What do you NOT promise?",
        minLength: 150,
      },
      dissect: {
        title: "Management By Deception",
        scenario: "This is the fourth time 'mandatory' work has been labeled voluntary. The previous manager used this tactic to avoid overtime costs. Workers tolerated it because they feared losing their jobs. The new labor inspector has been asking questions. There is no written overtime policy.",
        prompt: "DISSECT why management resorted to deception instead of honest negotiation. What power dynamics, cost pressures, and cultural factors made lying seem easier than fair labor practices?",
        minLength: 150,
      },
      own: {
        title: "The New Manager's Dilemma",
        scenario: "You were briefed about the 'voluntary work' system in your first week by the outgoing manager. He said 'this is how we stay competitive.' You nodded and moved on to other priorities.",
        prompt: "What is YOUR accountability? When you heard about the system, what should you have done? Why did you prioritize other issues over worker rights? What does this reveal about YOUR leadership?",
        minLength: 120,
      },
      execute: {
        title: "The Labor Framework",
        scenario: "The plant director returns and asks you to create a sustainable labor relations framework that meets production targets WITHOUT exploiting workers.",
        prompt: "Design a comprehensive overtime and shift management system for a Zambian manufacturing plant. Include: fair compensation structure, voluntary vs mandatory work policy, dispute resolution mechanism, and a production-labor balance model.",
        minLength: 150,
      },
    },
    {
      ...dt(2, "The Supplier Collapse"),
      context: "You are a supply chain manager for a food processing company.",
      confront: {
        title: "Our Main Supplier Just Closed",
        scenario: "At 10 AM, you receive a call: your primary maize supplier — who provides 70% of your raw material — has gone bankrupt. Their warehouse is being padlocked by bailiffs. You have 4 days of maize inventory left. Three other suppliers exist but each can only provide 20% of your needs at 40% higher prices. The procurement director who managed these relationships left 2 months ago.",
        prompt: "What is your emergency response plan? Who do you call? What do you negotiate? How do you keep production running? What short-term and long-term moves do you make?",
        minLength: 150,
      },
      dissect: {
        title: "The Single-Supplier Trap",
        scenario: "The company has relied on one supplier for 5 years because they offered the best price. No backup supplier was ever qualified. The procurement director managed the relationship informally — no written contracts, no performance reviews, no financial health checks.",
        prompt: "DISSECT why supply chain diversification was ignored. What organizational and cultural factors made price more important than resilience? How did personal relationships replace professional procurement?",
        minLength: 150,
      },
      own: {
        title: "Your Procurement Blindness",
        scenario: "You approved the last purchase order from the failing supplier 3 weeks ago. Their payment delays had already started but you assumed 'they are just having cash flow issues like everyone.'",
        prompt: "What due diligence did YOU skip? What warning signs did you rationalize away? What procurement discipline will you commit to going forward?",
        minLength: 100,
      },
      execute: {
        title: "Anti-Fragile Supply Chain",
        scenario: "The CEO wants a supply chain that cannot be broken by any single supplier's failure.",
        prompt: "Design a resilient supply chain strategy for a Zambian food processor. Include: supplier diversification model, qualification process, financial health monitoring, inventory buffer policy, and emergency sourcing protocol.",
        minLength: 150,
      },
    },
    {
      ...dt(3, "The Office Crisis"),
      context: "You are the HR manager at a growing tech company with 50 employees.",
      confront: {
        title: "The Harassment Report",
        scenario: "A female developer reports that a senior engineer has been making inappropriate comments for 3 months. She has emails and Slack screenshots as evidence. The accused engineer is the company's top performer — he built 40% of the core product. The CEO says 'he is irreplaceable, handle this delicately.' The developer says if nothing happens, she is quitting and going public.",
        prompt: "What do you do? How do you balance the developer's rights, the engineer's contribution, and the CEO's concern? What process do you follow? What outcome do you pursue?",
        minLength: 150,
      },
      dissect: {
        title: "The Star Performer Problem",
        scenario: "The engineer's behavior was reported informally twice before. Each time, management moved the complainant to a different team. There is no anti-harassment policy. The company culture celebrates 'brilliant jerks' because they ship code fast.",
        prompt: "DISSECT the cultural rot. Why do tech companies protect toxic high-performers? What does 'irreplaceable' really mean? How did the organization systematically silence previous victims?",
        minLength: 150,
      },
      own: {
        title: "The HR Professional",
        scenario: "You drafted an anti-harassment policy 4 months ago. The CEO said 'let's focus on hiring first, we will do HR stuff later.' You put it in a drawer.",
        prompt: "What is YOUR accountability as the HR leader? When should you have pushed harder? What would you do differently knowing what you know now? What does this teach you about the role of HR in protecting people?",
        minLength: 120,
      },
      execute: {
        title: "Safe Workplace Architecture",
        scenario: "The board demands a comprehensive workplace safety and ethics framework within 30 days.",
        prompt: "Design a complete anti-harassment and workplace ethics system for a Zambian tech company. Include: reporting mechanisms (anonymous and direct), investigation protocol, consequences framework, prevention training, and leadership accountability.",
        minLength: 150,
      },
    },
    {
      ...dt(4, "The Quality Failure"),
      context: "You are the quality assurance manager at a pharmaceutical distributor.",
      confront: {
        title: "Expired Medicine In The Supply",
        scenario: "A hospital reports that a batch of antibiotics you distributed has 6 months less shelf life than the invoice stated. 2,000 units are already in 12 rural clinics with no temperature-controlled storage. The manufacturer claims the batch was correct when it left their facility. Your warehouse records show the shipment sat on your dock for 3 weeks before processing.",
        prompt: "What is your immediate action plan? How do you handle the hospital, the clinics, the manufacturer, and the public health risk? What do you do about the 3-week dock delay?",
        minLength: 150,
      },
      dissect: {
        title: "Quality Theater",
        scenario: "The company has ISO certification but the auditor never checked the dock process. QA checks are box-ticking exercises. The warehouse manager cuts processing time to meet KPIs. Nobody has ever been disciplined for a quality failure.",
        prompt: "DISSECT why quality assurance became a compliance theater instead of genuine safety practice. What incentives made speed more important than quality? How did certification create a false sense of security?",
        minLength: 150,
      },
      own: {
        title: "The QA Manager's Oversight",
        scenario: "You visited the warehouse once in 3 months. The dock backlog was visible but you assumed 'operations has it under control.' Your QA reports always showed 99% compliance.",
        prompt: "How did YOUR distance from operations create blind spots? What does '99% compliance' actually mean when the 1% can harm people? What changes in YOUR approach to quality management are needed?",
        minLength: 120,
      },
      execute: {
        title: "Life-Critical Quality System",
        scenario: "The managing director asks for a pharmaceutical quality system that ensures patient safety above all else.",
        prompt: "Design a pharmaceutical supply chain quality management system. Include: receiving verification, storage monitoring, batch tracking, expiry management, recall protocol, and supplier qualification — all tailored to Zambian infrastructure realities.",
        minLength: 150,
      },
    },
    {
      ...dt(5, "The Strategic Pivot"),
      context: "You are the operations director at a transportation company.",
      confront: {
        title: "The New Competitor",
        scenario: "A Chinese-backed ride-hailing app launches in Lusaka with prices 30% below yours. They have GPS tracking, instant booking, and driver ratings. Your fleet is 15 years old. Your booking system requires a phone call. Within 2 weeks, you lose 25% of your corporate clients. The founder wants to cut prices to match. Your CFO says you will go bankrupt if you do.",
        prompt: "You have a board meeting tomorrow. What is your strategic recommendation? How do you compete? What do you NOT do? What is your 90-day survival plan?",
        minLength: 150,
      },
      dissect: {
        title: "Complacent Operations",
        scenario: "Your company dominated the market for 12 years. Nobody invested in technology. Customer complaints about booking difficulty were ignored because 'they have no alternative.' Driver turnover was 60% annually but management called it 'the industry norm.'",
        prompt: "DISSECT the complacency. Why did market dominance lead to technological stagnation? How did 'no alternative' thinking blind the company to its own fragility? What cultural factors made change impossible?",
        minLength: 150,
      },
      own: {
        title: "Your Operational Blindness",
        scenario: "You have been operations director for 3 years. You requested a mobile app upgrade 18 months ago but accepted the CFO's 'next year' response. You never brought it up again.",
        prompt: "What strategic fights did YOU avoid? What would have happened if you had pushed harder for technology investment? How will you approach strategic advocacy differently in the future?",
        minLength: 100,
      },
      execute: {
        title: "The Compete-Or-Die Plan",
        scenario: "The board approves a K5 million transformation budget. You have 6 months to show results.",
        prompt: "Design a competitive transformation plan for a legacy transportation company facing a tech disruptor. Include: technology modernization, driver retention program, customer experience upgrade, pricing strategy, and strategic partnership opportunities.",
        minLength: 150,
      },
    },
    {
      ...dt(6, "The Remote Team"),
      context: "You manage a hybrid team of 20 people across 4 cities in Zambia.",
      confront: {
        title: "The Productivity Crisis",
        scenario: "Two team leads report that remote workers in Livingstone and Ndola are unresponsive, missing deadlines, and producing lower-quality work. The on-site team in Lusaka resents carrying the load. One remote worker says 'we feel invisible, the Lusaka team gets all the recognition.' Another says 'my internet is unreliable but nobody cares.' The CEO wants everyone back in the office full-time.",
        prompt: "How do you handle this? Do you support the CEO's return-to-office mandate? What do you tell each group? What specific actions do you take in the next week?",
        minLength: 150,
      },
      dissect: {
        title: "Hybrid Without Design",
        scenario: "Remote work was implemented during COVID with no policy, no tools, no training. The company bought Zoom licenses but nobody taught managers how to run remote meetings. Performance reviews still assume everyone is in the same office. There is no async communication culture.",
        prompt: "DISSECT why hybrid work fails without intentional design. What assumptions about 'work' are embedded in management practices that predate remote work? How does geographic bias affect career outcomes?",
        minLength: 150,
      },
      own: {
        title: "The Manager's Geography",
        scenario: "You are based in Lusaka. You have visited the Livingstone office once in 8 months. Your 1:1s with remote workers are consistently cut short because 'something came up in the main office.'",
        prompt: "How has YOUR physical presence in Lusaka created inequality? What should you have done differently? What commitments do you make to your remote team members going forward?",
        minLength: 100,
      },
      execute: {
        title: "The Distributed Team Blueprint",
        scenario: "The CEO gives you 30 days to create a hybrid work policy that works for everyone.",
        prompt: "Design a hybrid work system for a Zambian company with teams across multiple cities. Include: communication protocols, performance measurement, inclusion practices, infrastructure support, and a fair recognition system.",
        minLength: 150,
      },
    },
    {
      ...dt(7, "The Legacy Decision"),
      context: "You are the General Manager of a family business that has operated for 35 years. The founder is retiring and passing leadership to the next generation.",
      confront: {
        title: "Tradition vs Transformation",
        scenario: "The founder's son wants to digitize operations, hire external professionals, and expand to new markets. The founder's daughter wants to maintain the traditional business model, keep family control, and focus on existing customers. Both have valid points. The founder says 'you two decide, I am done.' The company has 120 employees whose livelihoods depend on this decision.",
        prompt: "You are the GM — the founder trusts you completely. What process do you design for this decision? How do you bring the siblings together? What framework do you use? What is YOUR recommendation?",
        minLength: 200,
      },
      dissect: {
        title: "The Succession Void",
        scenario: "There is no succession plan. No governance structure. The founder made every decision for 35 years. There is no board, no advisory committee, no documented strategy. The siblings have never worked together on anything significant.",
        prompt: "DISSECT why family businesses in Africa often fail at succession. What cultural factors prevent planning for transition? How does the founder's identity become so intertwined with the business that letting go feels like dying?",
        minLength: 150,
      },
      own: {
        title: "Your Role In The Legacy",
        scenario: "You have worked here for 15 years. You watched the founder resist modernization for a decade. You never pushed back because 'he built this place.' Now the future is uncertain and employees are nervous.",
        prompt: "What is YOUR legacy in this company? What should you have challenged? What can you still do to ensure 120 families have stable employment in 10 years? What does ethical leadership look like in this moment?",
        minLength: 120,
      },
      execute: {
        title: "The Governance Framework",
        scenario: "Both siblings agree to implement whatever governance system you recommend.",
        prompt: "Design a governance and succession framework for a 35-year-old Zambian family business. Include: decision-making structure, professionalization roadmap, family employment policy, external advisory board, and a strategic planning process that honors tradition while enabling growth.",
        minLength: 200,
      },
    },
  ],
};

/* ═══════════════════════════════════════════
   ENGINEERING — 7 Days
   ═══════════════════════════════════════════ */
export const engineeringPack: ProfessionPack = {
  profession: "civil_engineer",
  displayLabel: "Engineering",
  days: [
    {
      ...dt(1, "The Bridge Crack"),
      context: "You are a structural engineer overseeing a K45 million bridge project connecting a rural district to the main highway.",
      confront: {
        title: "The Inspection Discovery",
        scenario: "During a routine inspection, your junior engineer spots a crack in the main support pillar. It is 8cm wide and runs 40cm deep. The bridge is scheduled to open in 2 weeks. The contractor says 'all concrete has cracks, this is normal.' The Ministry of Works is pressuring for completion before the election. 15,000 people will use this bridge daily.",
        prompt: "What do you do in the FIRST HOUR? Who do you call? What tests do you order? What do you tell the contractor? What do you tell the Ministry? At what point do you refuse to certify the bridge?",
        minLength: 150,
      },
      dissect: {
        title: "Construction Under Pressure",
        scenario: "The contractor cut costs by using lower-grade concrete than specified. The Ministry approved the substitution 'to save budget.' There is no independent materials testing lab in the province. The project is 6 months behind schedule and the contractor faces liquidated damages.",
        prompt: "DISSECT how political and economic pressure corrupts engineering standards. What SYSTEM failures allowed substandard materials to be approved? How does the lack of independent testing infrastructure enable corner-cutting?",
        minLength: 150,
      },
      own: {
        title: "The Engineer's Stamp",
        scenario: "You noticed the concrete looked different on delivery three weeks ago but told yourself 'the lab must have tested it.' You did not request the test results.",
        prompt: "What is YOUR professional failure? What should you have done when you noticed the different concrete? How do you balance trust in the supply chain with professional verification? What does your engineering license require of you?",
        minLength: 120,
      },
      execute: {
        title: "The Quality Fortress",
        scenario: "The Ministry asks you to design a materials verification system for all future projects.",
        prompt: "Design a construction materials quality assurance system for Zambian infrastructure projects. Include: sampling protocol, testing requirements, chain of custody, approval authority, and consequences for non-compliance.",
        minLength: 150,
      },
    },
    {
      ...dt(2, "The Water Crisis"),
      context: "You are a water resources engineer for a district with 80,000 residents.",
      confront: {
        title: "The Boreholes Failed",
        scenario: "6 of your 12 community boreholes have dried up in the past month. The district health office reports a cholera outbreak with 45 cases linked to contaminated water sources. The remaining boreholes cannot serve the population. The national water utility says 'we have no budget for emergency drilling.' NGOs are offering drilling services but want their logos on everything. The rainy season is 3 months away.",
        prompt: "What is your emergency water supply plan? How do you prioritize communities? How do you handle the NGO offers? What short-term and long-term solutions do you pursue simultaneously?",
        minLength: 150,
      },
      dissect: {
        title: "Reactive Water Management",
        scenario: "The boreholes were drilled 15 years ago with no hydrogeological survey. The district has grown 300% since then. There is no water demand forecasting. Maintenance was deferred for 5 years because 'the pumps still work.' Climate data showing declining water tables was ignored.",
        prompt: "DISSECT why water infrastructure is built without sustainable planning. What political and institutional failures led to a reactive approach? How does short-term thinking create long-term crises?",
        minLength: 150,
      },
      own: {
        title: "The Engineer's Data",
        scenario: "You had access to the climate data showing declining water tables 2 years ago. You mentioned it once at a district planning meeting but did not follow up when nobody acted.",
        prompt: "What is YOUR accountability as the technical expert? How should you have communicated the risk? What does professional responsibility mean when decision-makers ignore your warnings?",
        minLength: 100,
      },
      execute: {
        title: "Resilient Water System",
        scenario: "The district commissioner asks for a 10-year water security plan.",
        prompt: "Design a sustainable water management system for a growing Zambian district. Include: hydrogeological assessment, demand forecasting, infrastructure maintenance plan, community governance model, climate adaptation strategy, and emergency response protocol.",
        minLength: 150,
      },
    },
    {
      ...dt(3, "The Power Failure"),
      context: "You are an electrical engineer at a copper mine in the Copperbelt.",
      confront: {
        title: "The Grid Collapse",
        scenario: "The national grid fails at 2 PM. Your backup generators kick in but can only power 40% of operations. The mine has 400 workers underground who need ventilation. The smelter is mid-process — stopping it will destroy K12 million of copper concentrate. ZESCO says 'restoration in 6-8 hours.' Your fuel reserves are 4 hours at full generation.",
        prompt: "How do you prioritize power allocation? Who do you send underground? What do you do about the smelter? How do you stretch 4 hours of fuel across 8 hours? What is your emergency shutdown protocol?",
        minLength: 150,
      },
      dissect: {
        title: "The Dependency Problem",
        scenario: "The mine has operated for 20 years with inadequate backup power because 'ZESCO is reliable' and 'generators are expensive.' The last power study was 12 years ago. No renewable energy was ever considered. The smelter design has no safe mid-process stopping mechanism.",
        prompt: "DISSECT why critical infrastructure relies on a single unreliable power source. What economic and institutional factors prevent investment in energy resilience? How does 'it has always worked' thinking create catastrophic risk?",
        minLength: 150,
      },
      own: {
        title: "Your Engineering Judgment",
        scenario: "You recommended upgrading backup generators 18 months ago. The CFO rejected it as 'too expensive.' You accepted the decision with a one-page memo and moved on.",
        prompt: "How should you have fought for this? What data, scenarios, or approaches might have changed the outcome? What does professional engineering ethics require when safety-critical recommendations are rejected?",
        minLength: 100,
      },
      execute: {
        title: "Energy Independence Plan",
        scenario: "The mine CEO approves a K50 million energy resilience investment. You have 6 months to design it.",
        prompt: "Design an energy system for a Zambian copper mine that can operate independently during grid failures. Include: generator upgrade, solar integration, battery storage, load prioritization system, and a gradual renewable transition plan.",
        minLength: 150,
      },
    },
    {
      ...dt(4, "The Road Disaster"),
      context: "You are a civil engineer at the Road Development Agency.",
      confront: {
        title: "The Washout",
        scenario: "Heavy rains washed out a 200-meter section of the main road connecting two provinces. 50,000 people use this road daily. There is one detour — a 90km gravel track that takes 4 hours. A pregnant woman died yesterday because the ambulance could not reach the hospital in time. The Minister wants the road open in 48 hours. Your geotechnical assessment says safe reconstruction will take 3 weeks minimum.",
        prompt: "What do you tell the Minister? What temporary solution do you propose? How do you balance speed against safety? What do you tell the public? What long-term solution do you design?",
        minLength: 150,
      },
      dissect: {
        title: "Roads Without Resilience",
        scenario: "The road was built 25 years ago with no drainage system. Climate change has increased rainfall intensity but road design standards have not been updated. Maintenance budgets were cut 40% over 5 years. There is no emergency road repair fund.",
        prompt: "DISSECT why infrastructure is built without climate resilience. What political and budgetary cycles prevent long-term thinking? How does maintenance funding get sacrificed for new projects?",
        minLength: 150,
      },
      own: {
        title: "The Engineer's Voice",
        scenario: "You wrote a report 2 years ago recommending drainage upgrades for this road. It was filed without action. You did not escalate beyond your direct supervisor.",
        prompt: "What should you have done with the ignored report? How do engineers advocate for preventive maintenance in systems that only respond to crises? What is your commitment going forward?",
        minLength: 100,
      },
      execute: {
        title: "Climate-Resilient Roads",
        scenario: "The Minister asks for a nationwide road resilience program.",
        prompt: "Design a climate-resilient road infrastructure program for Zambia. Include: vulnerability assessment methodology, drainage design standards, emergency repair protocol, maintenance funding mechanism, and community early warning integration.",
        minLength: 150,
      },
    },
    {
      ...dt(5, "The Housing Project"),
      context: "You are a project engineer managing a 500-unit affordable housing development.",
      confront: {
        title: "The Subcontractor Scam",
        scenario: "Your main building subcontractor has been using substandard cement — mixing in extra sand to stretch supplies. 80 completed units show wall cracks after 3 months. The subcontractor is the brother of a local councilor. 200 families have already paid deposits and are expecting to move in next month. The media has started asking questions.",
        prompt: "What do you do? How do you handle the subcontractor? The councilor? The families? The media? What technical assessment do you commission? What is your remediation plan?",
        minLength: 150,
      },
      dissect: {
        title: "Construction Corruption",
        scenario: "The subcontractor was selected through a 'local preference' process with no technical qualification review. There is no on-site materials testing. The project manager visited the site once per month. Cost overruns were hidden by using cheaper materials.",
        prompt: "DISSECT how political connections compromise construction quality. What procurement failures enabled this? How does 'local preference' become a loophole for corruption? What oversight mechanisms were missing?",
        minLength: 150,
      },
      own: {
        title: "Your Site Oversight",
        scenario: "You reduced site visits from weekly to monthly because 'the project was going well.' You never requested independent materials testing despite it being in the contract.",
        prompt: "What is YOUR accountability? How did complacency replace vigilance? What site management practices will you implement that make corner-cutting impossible?",
        minLength: 100,
      },
      execute: {
        title: "The Housing Quality Standard",
        scenario: "The Ministry of Local Government wants a quality framework for all affordable housing.",
        prompt: "Design a construction quality assurance system for Zambian affordable housing. Include: materials testing, inspection frequency, documentation requirements, subcontractor qualification, community involvement, and a redress mechanism for defective units.",
        minLength: 150,
      },
    },
    {
      ...dt(6, "The Environmental Impact"),
      context: "You are an environmental engineer reviewing a mining expansion permit.",
      confront: {
        title: "The Community Protest",
        scenario: "A mining company wants to expand into a forest area that supports 3 villages' water supply. The Environmental Impact Assessment says 'minimal impact' but the community leader says 'our rivers already run brown.' The mine promises 200 jobs. The villagers block the access road. The Ministry of Mines has approved the permit. The Ministry of Environment has not reviewed it yet.",
        prompt: "You are the engineer who must sign off on the EIA. What do you do? What additional assessments do you require? How do you balance economic development against environmental protection? What is your final recommendation?",
        minLength: 150,
      },
      dissect: {
        title: "Regulatory Capture",
        scenario: "The EIA was conducted by a consultant paid by the mining company. No community consultation was documented. Water quality baseline data is from 5 years ago — before the existing mine started operations. The '200 jobs' promise has no written commitment.",
        prompt: "DISSECT how regulatory capture works in practice. Why do mining companies fund their own assessments? What institutional failures allow ministries to approve without proper review? How does job creation rhetoric override environmental protection?",
        minLength: 150,
      },
      own: {
        title: "The Engineer's Ethical Line",
        scenario: "You have signed EIAs before with similar gaps, telling yourself 'the Ministry approved it, not my fault.' This time, a child from one of the villages brought you a bottle of brown water and asked 'will it always be like this?'",
        prompt: "How have YOUR past compromises enabled this situation? What is the ethical line you will not cross going forward? How do you maintain professional integrity when the system pressures you to look away?",
        minLength: 120,
      },
      execute: {
        title: "The Community-First EIA",
        scenario: "The government asks you to redesign the environmental assessment process.",
        prompt: "Design an environmental impact assessment framework that genuinely protects communities. Include: independent assessment funding, community participation requirements, water/soil/air monitoring, enforceable mitigation commitments, and a community veto mechanism for critical impacts.",
        minLength: 150,
      },
    },
    {
      ...dt(7, "The Innovation Challenge"),
      context: "You are a senior engineer at the Zambia Bureau of Standards.",
      confront: {
        title: "The Import Invasion",
        scenario: "Substandard electrical equipment from an Asian supplier is flooding the Zambian market. Three house fires in Lusaka have been linked to faulty circuit breakers. The supplier has certification from their home country. Your testing lab can only test 2% of imports due to capacity. Retailers say 'the price is unbeatable, customers want cheap.' Local manufacturers who meet standards cannot compete and are laying off workers.",
        prompt: "What is your action plan? How do you protect consumers without creating a trade dispute? How do you support local manufacturers? What regulatory changes do you recommend? What public communication strategy do you pursue?",
        minLength: 200,
      },
      dissect: {
        title: "Standards Without Enforcement",
        scenario: "The Bureau has 12 engineers for the entire country. Testing equipment is 20 years old. There is no border inspection of electrical goods. Corruption at the ports allows anything through with the right payment. Local manufacturers have been lobbying for protection for 5 years.",
        prompt: "DISSECT why standards bodies are powerless. What institutional, budgetary, and political factors prevent enforcement? How does the race to the bottom on price become a public safety crisis?",
        minLength: 150,
      },
      own: {
        title: "The Standard-Setter's Duty",
        scenario: "You drafted stricter import regulations 2 years ago. They are still 'under review' at the Ministry. You stopped pushing because 'it is political now, not technical.'",
        prompt: "What is YOUR duty as a technical expert when political processes stall public safety measures? How should you have advocated? What will you do now with the house fire victims in mind?",
        minLength: 120,
      },
      execute: {
        title: "National Quality Infrastructure",
        scenario: "The President announces a National Quality Policy and asks you to lead the technical design.",
        prompt: "Design a comprehensive national quality infrastructure for Zambia. Include: standards development, testing laboratory network, market surveillance system, border control, local manufacturer support, public awareness campaign, and institutional capacity building. Be ambitious but realistic about Zambian resource constraints.",
        minLength: 250,
      },
    },
  ],
};
