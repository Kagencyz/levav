/**
 * ============================================================
 * EMPLOYER DEMO DATA — B2B Portal Content
 * ============================================================
 * Realistic demo data for the employer dashboard showing
 * company profiles, jobs, applicants, interviews, and talent pool.
 * ============================================================
 */

export interface CompanyProfile {
  id: number;
  name: string;
  industry: string;
  location: string;
  description: string;
  website: string;
  companySize: string;
  verificationStatus: "verified" | "pending" | "unverified";
  logo: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export const demoCompany: CompanyProfile = {
  id: 1,
  name: "BongoHive",
  industry: "Technology & Innovation",
  location: "Lusaka, Zambia",
  description: "Zambia's premier technology and innovation hub. We build solutions that matter for Africa.",
  website: "bongohive.co.zm",
  companySize: "50-200 employees",
  verificationStatus: "verified",
  logo: null,
  contactName: "Lukonga Lindunda",
  contactEmail: "careers@bongohive.co.zm",
  contactPhone: "+260 211 123 456",
};

export interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  salaryRange: string;
  postedDate: string;
  status: "active" | "paused" | "closed";
  applicants: number;
  newApplicants: number;
  views: number;
  description: string;
  requirements: string[];
  deadline?: string;
}

export const demoJobs: JobPosting[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Lusaka, Zambia",
    type: "Full-time",
    salaryRange: "ZMW 15,000 - 25,000",
    postedDate: "2025-06-10",
    status: "active",
    applicants: 24,
    newApplicants: 3,
    views: 342,
    description: "Join our engineering team building scalable web applications for the African market.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Team leadership"],
    deadline: "2026-08-30",
  },
  {
    id: 2,
    title: "Product Designer",
    department: "Design",
    location: "Lusaka, Zambia",
    type: "Full-time",
    salaryRange: "ZMW 12,000 - 18,000",
    postedDate: "2025-06-08",
    status: "active",
    applicants: 18,
    newApplicants: 5,
    views: 289,
    description: "Design user-centered products that solve real problems for African users.",
    requirements: ["Figma expertise", "User research", "Design systems"],
    deadline: "2026-08-25",
  },
  {
    id: 3,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salaryRange: "ZMW 18,000 - 28,000",
    postedDate: "2025-06-05",
    status: "active",
    applicants: 12,
    newApplicants: 1,
    views: 198,
    description: "Build and maintain our cloud infrastructure across AWS and Azure.",
    requirements: ["AWS/Azure certified", "Kubernetes", "CI/CD pipelines"],
    deadline: "2026-08-20",
  },
  {
    id: 4,
    title: "Customer Success Manager",
    department: "Operations",
    location: "Lusaka, Zambia",
    type: "Full-time",
    salaryRange: "ZMW 8,000 - 14,000",
    postedDate: "2025-06-01",
    status: "paused",
    applicants: 31,
    newApplicants: 0,
    views: 456,
    description: "Ensure our clients achieve their goals with our products.",
    requirements: ["3+ years CS experience", "CRM tools", "Communication"],
    deadline: "2026-08-15",
  },
];

export interface Applicant {
  id: number;
  firstName: string;
  lastName: string;
  levavCode: string;
  wriScore: number;
  goldKeyTier: string;
  profession: string;
  city: string;
  appliedFor: string;
  appliedDate: string;
  status: "new" | "screening" | "interview" | "offer" | "hired" | "rejected";
  coverLetter: string;
  skills: string[];
  experience: string;
  rating: number;
  /* ─── Documents & Progress ─── */
  cvUploaded: boolean;
  cvFilename: string;
  portfolioUrl: string | null;
  certifications: string[];
  levav28Progress: number; // days completed out of 28
  levav28AvgScore: number;
  wriComponents: {
    culture: number;
    criticalThinking: number;
    reliability: number;
    communication: number;
    learning: number;
    leadership: number;
    impact: number;
  };
  education: string;
  phone: string;
  email: string;
  linkedIn: string | null;
  languages: string[];
  references: { name: string; role: string; contact: string }[];
}

export const demoApplicants: Applicant[] = [
  {
    id: 1, firstName: "Mutale", lastName: "Mwanza", levavCode: "LVA-MMN001", wriScore: 82.1, goldKeyTier: "Platinum",
    profession: "Software Developer", city: "Lusaka", appliedFor: "Senior Frontend Developer", appliedDate: "2025-06-15",
    status: "interview", coverLetter: "Dear Hiring Manager,\n\nI am writing to express my strong interest in the Senior Frontend Developer position at BongoHive. With 6 years of experience building scalable web applications and a WRI™ score of 82.1 (Platinum tier), I bring both technical expertise and proven workplace readiness.\n\nAt my current role, I led the migration of a legacy Angular application to React 18, improving load times by 60% and reducing bundle size by 45%. I am particularly drawn to BongoHive's mission of building technology for Africa, and I believe my experience with fintech platforms aligns perfectly with your work.\n\nI have attached my CV and Levav ID™ portfolio for your review. I would welcome the opportunity to discuss how I can contribute to your engineering team.\n\nBest regards,\nMutale Mwanza",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "CI/CD"], experience: "6 years", rating: 4.8,
    cvUploaded: true, cvFilename: "Mutale_Mwanza_CV_2025.pdf", portfolioUrl: "mutale.dev",
    certifications: ["AWS Certified Developer", "Meta Frontend Professional"], levav28Progress: 18, levav28AvgScore: 84.2,
    wriComponents: { culture: 85, criticalThinking: 88, reliability: 90, communication: 80, learning: 82, leadership: 78, impact: 84 },
    education: "BSc Computer Science, University of Zambia (2019)", phone: "+260 97 123 4567", email: "mutale.mwanza@email.com", linkedIn: "linkedin.com/in/mutalemw",
    languages: ["English", "Bemba", "Nyanja"], references: [{ name: "Dr. James Banda", role: "CTO, Fintech Zambia", contact: "james@fintech.co.zm" }, { name: "Grace Lungu", role: "Engineering Manager", contact: "grace@tech.co.zm" }],
  },
  {
    id: 2, firstName: "Grace", lastName: "Lungu", levavCode: "LVA-GLU001", wriScore: 78.5, goldKeyTier: "Gold",
    profession: "Product Designer", city: "Lusaka", appliedFor: "Product Designer", appliedDate: "2025-06-14",
    status: "screening", coverLetter: "Hello BongoHive Team,\n\nI am Grace Lungu, a Product Designer with 4 years of experience creating user-centered digital products. My WRI™ score of 78.5 reflects my commitment to excellence across all seven workforce readiness components.\n\nI recently completed a design system overhaul for a health-tech startup that reduced design-to-development handoff time by 40%. My background in user research and prototyping, combined with my Levav 28™ crucible completion (14 days), demonstrates my ability to think critically under pressure.\n\nI am excited about the opportunity to bring my design expertise to BongoHive and contribute to products that serve African communities.\n\nWarm regards,\nGrace Lungu",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "HTML/CSS"], experience: "4 years", rating: 4.5,
    cvUploaded: true, cvFilename: "Grace_Lungu_CV_2025.pdf", portfolioUrl: "gracelungu.design",
    certifications: ["Google UX Design Certificate"], levav28Progress: 14, levav28AvgScore: 76.5,
    wriComponents: { culture: 80, criticalThinking: 76, reliability: 85, communication: 82, learning: 78, leadership: 72, impact: 76 },
    education: "BA Design, Copperbelt University (2021)", phone: "+260 96 234 5678", email: "grace.lungu@email.com", linkedIn: "linkedin.com/in/gracelungu",
    languages: ["English", "Nyanja"], references: [{ name: "Sarah Phiri", role: "Design Director, ZamHealth", contact: "sarah@zamhealth.co.zm" }],
  },
  {
    id: 3, firstName: "David", lastName: "Mwila", levavCode: "LVA-DMW001", wriScore: 91.2, goldKeyTier: "Diamond",
    profession: "DevOps Engineer", city: "Ndola", appliedFor: "DevOps Engineer", appliedDate: "2025-06-13",
    status: "new", coverLetter: "Dear BongoHive Engineering Team,\n\nI am David Mwila, a DevOps Engineer with 8 years of experience and a Diamond WRI™ score of 91.2 — the highest tier on the Levav™ platform. I have completed 22 days of the Levav 28™ crucible with an average score of 88.3.\n\nI specialize in cloud infrastructure automation and have reduced deployment times from 4 hours to 15 minutes at my current organization. I hold AWS Solutions Architect and Kubernetes Administrator certifications.\n\nI am particularly impressed by BongoHive's commitment to local tech talent, and I would be honored to contribute my infrastructure expertise to your platform serving 15,000+ Zambian users.\n\nBest,\nDavid Mwila",
    skills: ["AWS", "Kubernetes", "Terraform", "Docker", "Python", "Linux"], experience: "8 years", rating: 4.9,
    cvUploaded: true, cvFilename: "David_Mwila_CV_2025.pdf", portfolioUrl: null,
    certifications: ["AWS Solutions Architect Professional", "CKA - Certified Kubernetes Administrator", "HashiCorp Terraform Associate"], levav28Progress: 22, levav28AvgScore: 88.3,
    wriComponents: { culture: 92, criticalThinking: 94, reliability: 96, communication: 88, learning: 90, leadership: 92, impact: 93 },
    education: "BSc Computer Engineering, University of Zambia (2017)", phone: "+260 95 345 6789", email: "david.mwila@email.com", linkedIn: "linkedin.com/in/davidmwila",
    languages: ["English", "Bemba"], references: [{ name: "Eng. Peter Chanda", role: "VP Engineering, MTN Zambia", contact: "peter.chanda@mtn.com" }, { name: "Dr. Lisa Mutale", role: "Cloud Architect, AWS Africa", contact: "lisa@aws.africa" }],
  },
  {
    id: 4, firstName: "Sarah", lastName: "Zulu", levavCode: "LVA-SZU001", wriScore: 88.5, goldKeyTier: "Platinum",
    profession: "Software Developer", city: "Kitwe", appliedFor: "Senior Frontend Developer", appliedDate: "2025-06-12",
    status: "offer", coverLetter: "Dear BongoHive Team,\n\nI am thrilled to apply for the Senior Frontend Developer position. With 7 years of experience and a Platinum WRI™ score of 88.5, I have consistently delivered high-impact web applications.\n\nI built and maintain a React-based e-commerce platform serving 100K+ users across 5 African countries. My Levav 28™ journey (20 days completed) has sharpened my critical thinking and ownership skills — qualities I bring to every project.\n\nI have attached my comprehensive CV, portfolio, and Levav ID™ verification for your review. I am ready to discuss how I can contribute to BongoHive's growth.\n\nRegards,\nSarah Zulu",
    skills: ["React", "Next.js", "GraphQL", "TypeScript", "Tailwind CSS", "Testing"], experience: "7 years", rating: 4.7,
    cvUploaded: true, cvFilename: "Sarah_Zulu_CV_2025.pdf", portfolioUrl: "sarahzulu.dev",
    certifications: ["Meta Frontend Professional", "Google Cloud Associate"], levav28Progress: 20, levav28AvgScore: 85.1,
    wriComponents: { culture: 88, criticalThinking: 90, reliability: 92, communication: 86, learning: 88, leadership: 84, impact: 90 },
    education: "BSc Software Engineering, University of Zambia (2018)", phone: "+260 97 456 7890", email: "sarah.zulu@email.com", linkedIn: "linkedin.com/in/sarahzulu",
    languages: ["English", "Bemba", "Nyanja"], references: [{ name: "Mutale Mwanza", role: "Senior Developer, TechCorp", contact: "mutale@techcorp.co.zm" }],
  },
  {
    id: 5, firstName: "Peter", lastName: "Chileshe", levavCode: "LVA-PCH001", wriScore: 72.3, goldKeyTier: "Gold",
    profession: "Customer Success Manager", city: "Lusaka", appliedFor: "Customer Success Manager", appliedDate: "2025-06-11",
    status: "hired", coverLetter: "Dear BongoHive HR Team,\n\nI am writing to express my enthusiasm for the Customer Success Manager role. With 5 years of experience managing enterprise accounts at MTN Zambia and a Gold WRI™ score of 72.3, I bring proven customer relationship expertise.\n\nMy proudest achievement was reducing customer churn by 25% through a proactive engagement program I designed and implemented. My Levav 28™ crucible experience strengthened my communication and reliability scores significantly.\n\nI would welcome the opportunity to bring my customer success expertise to BongoHive and help grow your client relationships.\n\nBest regards,\nPeter Chileshe",
    skills: ["CRM", "Communication", "Sales", "Account Management", "Data Analysis"], experience: "5 years", rating: 4.4,
    cvUploaded: true, cvFilename: "Peter_Chileshe_CV_2025.pdf", portfolioUrl: null,
    certifications: ["HubSpot CRM Certification", "Salesforce Administrator"], levav28Progress: 12, levav28AvgScore: 71.2,
    wriComponents: { culture: 78, criticalThinking: 72, reliability: 80, communication: 82, learning: 70, leadership: 68, impact: 72 },
    education: "BA Business Administration, Cavendish University (2020)", phone: "+260 96 567 8901", email: "peter.chileshe@email.com", linkedIn: null,
    languages: ["English", "Nyanja"], references: [{ name: "Mary Banda", role: "Head of Customer Success, MTN", contact: "mary.banda@mtn.com" }],
  },
  {
    id: 6, firstName: "Alice", lastName: "Bwalya", levavCode: "LVA-ABW001", wriScore: 65.8, goldKeyTier: "Silver",
    profession: "Junior Developer", city: "Lusaka", appliedFor: "Senior Frontend Developer", appliedDate: "2025-06-10",
    status: "rejected", coverLetter: "Dear Hiring Manager,\n\nI am a recent graduate from the University of Zambia with a degree in Computer Science. I am eager to start my career in software development and I am particularly interested in frontend technologies.\n\nI have completed several online courses in HTML, CSS, and JavaScript. I am a fast learner and I am excited about the opportunity to grow with BongoHive.\n\nThank you for considering my application.\n\nAlice Bwalya",
    skills: ["HTML", "CSS", "JavaScript", "React Basics"], experience: "1 year", rating: 3.9,
    cvUploaded: false, cvFilename: "", portfolioUrl: null,
    certifications: [], levav28Progress: 5, levav28AvgScore: 58.5,
    wriComponents: { culture: 68, criticalThinking: 62, reliability: 70, communication: 64, learning: 72, leadership: 55, impact: 58 },
    education: "BSc Computer Science, University of Zambia (2024)", phone: "+260 95 678 9012", email: "alice.bwalya@email.com", linkedIn: null,
    languages: ["English"], references: [],
  },
];

export interface Interview {
  id: number;
  applicantName: string;
  applicantId: number;
  jobTitle: string;
  date: string;
  time: string;
  type: "video" | "phone" | "in-person";
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
}

export const demoInterviews: Interview[] = [
  { id: 1, applicantName: "Mutale Mwanza", applicantId: 1, jobTitle: "Senior Frontend Developer", date: "2025-06-18", time: "10:00 AM", type: "video", status: "scheduled", notes: "Technical round with senior engineer" },
  { id: 2, applicantName: "Grace Lungu", applicantId: 2, jobTitle: "Product Designer", date: "2025-06-18", time: "2:00 PM", type: "in-person", status: "scheduled", notes: "Portfolio review session" },
  { id: 3, applicantName: "David Mwila", applicantId: 3, jobTitle: "DevOps Engineer", date: "2025-06-17", time: "11:00 AM", type: "video", status: "completed", notes: "Strong candidate. Recommended for next round." },
];

export interface TalentPoolEntry {
  id: number;
  firstName: string;
  lastName: string;
  levavCode: string;
  wriScore: number;
  goldKeyTier: string;
  profession: string;
  headline: string;
  city: string;
  skills: string[];
  verified: boolean;
  available: boolean;
}

export const demoTalentPool: TalentPoolEntry[] = [
  { id: 1, firstName: "Mutale", lastName: "Mwanza", levavCode: "LVA-MMN001", wriScore: 82.1, goldKeyTier: "Platinum", profession: "Software Developer", headline: "Full-stack developer specializing in React and Node.js", city: "Lusaka", skills: ["React", "TypeScript", "Node.js", "PostgreSQL"], verified: true, available: true },
  { id: 2, firstName: "David", lastName: "Mwila", levavCode: "LVA-DMW001", wriScore: 91.2, goldKeyTier: "Diamond", profession: "DevOps Engineer", headline: "Cloud infrastructure expert. AWS certified.", city: "Ndola", skills: ["AWS", "Kubernetes", "Docker", "Terraform"], verified: true, available: true },
  { id: 3, firstName: "Sarah", lastName: "Zulu", levavCode: "LVA-SZU001", wriScore: 88.5, goldKeyTier: "Platinum", profession: "Software Developer", headline: "Frontend architect with 7 years experience", city: "Kitwe", skills: ["React", "Next.js", "GraphQL", "TypeScript"], verified: true, available: true },
  { id: 4, firstName: "Grace", lastName: "Lungu", levavCode: "LVA-GLU001", wriScore: 78.5, goldKeyTier: "Gold", profession: "Product Designer", headline: "User-centered designer passionate about African UX", city: "Lusaka", skills: ["Figma", "User Research", "Prototyping", "Design Systems"], verified: true, available: true },
  { id: 5, firstName: "John", lastName: "Kabwe", levavCode: "LVA-JKA001", wriScore: 65.8, goldKeyTier: "Silver", profession: "Data Analyst", headline: "Data-driven decision maker", city: "Lusaka", skills: ["Python", "SQL", "Tableau"], verified: true, available: false },
  { id: 6, firstName: "Mary", lastName: "Mulenga", levavCode: "LVA-MMU001", wriScore: 58.2, goldKeyTier: "Silver", profession: "Marketing Specialist", headline: "Digital marketing for African markets", city: "Kitwe", skills: ["Social Media", "SEO", "Content Strategy"], verified: true, available: true },
  { id: 7, firstName: "Robert", lastName: "Chanda", levavCode: "LVA-RCH001", wriScore: 42.5, goldKeyTier: "Bronze", profession: "Sales Representative", headline: "Results-driven sales professional", city: "Ndola", skills: ["Sales", "CRM", "Negotiation"], verified: true, available: true },
  { id: 8, firstName: "Elizabeth", lastName: "Phiri", levavCode: "LVA-EPH001", wriScore: 74.8, goldKeyTier: "Gold", profession: "Project Manager", headline: "PMP certified project manager", city: "Lusaka", skills: ["Agile", "Scrum", "Risk Management"], verified: true, available: true },
];
