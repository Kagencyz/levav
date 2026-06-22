/**
 * ============================================================
 * DEMO DATA — Sample Content for Offline Development Mode
 * ============================================================
 * All pages import from here when backend is unavailable.
 * This lets you test every page without needing a live API.
 * ============================================================
 */

export const demoUser = {
  id: 999,
  name: "Chanda Banda",
  email: "chanda@levav.dev",
  role: "talent" as const,
  avatar: null,
};

export const demoProfile = {
  id: 1,
  userId: 999,
  levavCode: "LVA-CHK001",
  firstName: "Chanda",
  lastName: "Banda",
  displayName: "Chanda Banda",
  professionTitle: "Software Developer",
  location: "Lusaka, Zambia",
  city: "Lusaka",
  country: "Zambia",
  bio: "Passionate developer building the future of Africa's workforce.",
  avatarUrl: null,
  onboardingCompleted: true,
  balanceZmw: "250.00",
  wriScore: 72,
  goldKeyTier: "gold" as const,
};

export const demoWri = {
  id: 1,
  profileId: 1,
  overallScore: "72.5",
  goldKeyTier: "gold",
  componentCulture: 78,
  componentCriticalThinking: 75,
  componentReliability: 80,
  componentCommunication: 70,
  componentLearning: 68,
  componentLeadership: 65,
  componentImpact: 72,
};

export const demoJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    companyName: "BongoHive",
    location: "Lusaka, Zambia",
    salaryRange: "ZMW 15,000 - 25,000",
    employmentType: "full_time",
    description: "Join Zambia's leading tech hub as a senior frontend developer. Work with React, TypeScript, and modern web technologies.",
    requiredSkills: "React, TypeScript, Tailwind CSS",
    postedAt: new Date(Date.now() - 2 * 86400000),
  },
  {
    id: 2,
    title: "Customer Success Manager",
    companyName: "MTN Zambia",
    location: "Lusaka, Zambia",
    salaryRange: "ZMW 8,000 - 12,000",
    employmentType: "full_time",
    description: "Drive customer satisfaction and retention for MTN's enterprise clients.",
    requiredSkills: "Communication, CRM, Sales",
    postedAt: new Date(Date.now() - 5 * 86400000),
  },
  {
    id: 3,
    title: "Data Analyst",
    companyName: "FSD Zambia",
    location: "Remote",
    salaryRange: "ZMW 10,000 - 18,000",
    employmentType: "remote",
    description: "Analyze agricultural data to support smallholder farmers across Zambia.",
    requiredSkills: "Python, SQL, Data Visualization",
    postedAt: new Date(Date.now() - 1 * 86400000),
  },
  {
    id: 4,
    title: "Mobile App Developer",
    companyName: "Zamtel",
    location: "Lusaka, Zambia",
    salaryRange: "ZMW 12,000 - 20,000",
    employmentType: "full_time",
    description: "Build mobile applications serving millions of Zambian users.",
    requiredSkills: "Flutter, Dart, Firebase",
    postedAt: new Date(Date.now() - 3 * 86400000),
  },
];

export const demoCourses = [
  {
    id: 1,
    title: "React & TypeScript Mastery",
    description: "Master modern frontend development with React 19 and TypeScript. Build production-ready applications from scratch.",
    category: "Technology",
    level: "intermediate",
    totalLessons: 24,
    durationHours: 18,
    instructorName: "David Mwila",
    instructorTitle: "Senior Engineer at BongoHive",
    instructorAvatar: null,
    priceZmw: "150.00",
    averageRating: "4.8",
    totalEnrollments: 342,
    reviewCount: 89,
    tier: "paid",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&h=360&fit=crop",
    lastUpdated: "June 2025",
  },
  {
    id: 2,
    title: "Customer Excellence for the Zambian Market",
    description: "Learn world-class customer service skills tailored for the Zambian workplace. From first impression to lasting relationships.",
    category: "Business",
    level: "beginner",
    totalLessons: 12,
    durationHours: 8,
    instructorName: "Grace Lungu",
    instructorTitle: "Customer Success Lead, MTN Zambia",
    instructorAvatar: null,
    priceZmw: "75.00",
    averageRating: "4.6",
    totalEnrollments: 518,
    reviewCount: 134,
    tier: "free",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&h=360&fit=crop",
    lastUpdated: "May 2025",
  },
  {
    id: 3,
    title: "Data Science with Python",
    description: "From pandas basics to machine learning. Work with real African datasets and build analytics skills employers demand.",
    category: "Technology",
    level: "advanced",
    totalLessons: 36,
    durationHours: 28,
    instructorName: "Dr. Kenneth Kaunda Jr.",
    instructorTitle: "Data Science Professor, UNZA",
    instructorAvatar: null,
    priceZmw: "200.00",
    averageRating: "4.9",
    totalEnrollments: 189,
    reviewCount: 67,
    tier: "subscription",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=360&fit=crop",
    lastUpdated: "June 2025",
  },
  {
    id: 4,
    title: "Leadership Fundamentals",
    description: "Develop leadership skills that matter. From team management to strategic decision-making in African business contexts.",
    category: "Business",
    level: "beginner",
    totalLessons: 16,
    durationHours: 12,
    instructorName: "Sarah Zulu",
    instructorTitle: "Executive Coach & TEDx Speaker",
    instructorAvatar: null,
    priceZmw: "120.00",
    averageRating: "4.7",
    totalEnrollments: 267,
    reviewCount: 78,
    tier: "paid",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=640&h=360&fit=crop",
    lastUpdated: "April 2025",
  },
  {
    id: 5,
    title: "Digital Marketing Essentials",
    description: "Master social media marketing, SEO, and content strategy. Build brands that resonate across African markets.",
    category: "Marketing",
    level: "beginner",
    totalLessons: 20,
    durationHours: 14,
    instructorName: "Mutale Mwanza",
    instructorTitle: "Digital Marketing Director",
    instructorAvatar: null,
    priceZmw: "100.00",
    averageRating: "4.5",
    totalEnrollments: 156,
    reviewCount: 45,
    tier: "free",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=360&fit=crop",
    lastUpdated: "May 2025",
  },
  {
    id: 6,
    title: "Electrical Installation & Safety",
    description: "Comprehensive electrical installation training. From wiring fundamentals to safety compliance for Zambian standards.",
    category: "Trades",
    level: "beginner",
    totalLessons: 18,
    durationHours: 22,
    instructorName: "Peter Chileshe",
    instructorTitle: "Licensed Master Electrician",
    instructorAvatar: null,
    priceZmw: "180.00",
    averageRating: "4.8",
    totalEnrollments: 203,
    reviewCount: 56,
    tier: "paid",
    thumbnail: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=640&h=360&fit=crop",
    lastUpdated: "March 2025",
  },
];

export const demoNotifications = [
  { id: 1, type: "achievement", title: "WRI Score Updated", message: "Your score improved to 72 — Gold tier!", createdAt: new Date(Date.now() - 3600000) },
  { id: 2, type: "job", title: "New Job Match", message: "BongoHive is hiring a Senior Frontend Developer", createdAt: new Date(Date.now() - 7200000) },
  { id: 3, type: "course", title: "Course Completed", message: "You completed 'Customer Excellence' — Certificate earned!", createdAt: new Date(Date.now() - 86400000) },
];

export const demoWalletTransactions = [
  { id: 1, type: "wallet_topup", amount: "150.00", status: "completed", description: "Wallet top-up via MTN MoMo", createdAt: new Date(Date.now() - 86400000) },
  { id: 2, type: "course_purchase", amount: "-75.00", status: "completed", description: "Purchased 'Customer Excellence'", createdAt: new Date(Date.now() - 172800000) },
  { id: 3, type: "quickwork_payout", amount: "175.00", status: "completed", description: "QuickWork shift payment — Shoprite", createdAt: new Date(Date.now() - 259200000) },
];

export const demoFeedPosts = [
  { id: 1, profileName: "Mutale Mwanza", content: "Just earned my Gold WRI badge! Hard work pays off. #LevavProud", postType: "achievement", likeCount: 24, commentCount: 5, createdAt: new Date(Date.now() - 3600000) },
  { id: 2, profileName: "Peter Chileshe", content: "Completed the React & TypeScript course. Highly recommend it to all devs!", postType: "course_complete", likeCount: 18, commentCount: 3, createdAt: new Date(Date.now() - 7200000) },
  { id: 3, profileName: "Levav Official", content: "Welcome to 50 new talents who joined this week! The future of African workforce starts here.", postType: "update", likeCount: 67, commentCount: 12, createdAt: new Date(Date.now() - 86400000) },
];

export const demoCertificates = [
  { id: 1, certificateNumber: "LEVAV-2026-0142", courseTitle: "Customer Excellence", instructorName: "Grace Lungu", issueDate: new Date(Date.now() - 86400000) },
  { id: 2, certificateNumber: "LEVAV-2026-0098", courseTitle: "Levav 28 Crucible", instructorName: "Levav Academy", issueDate: new Date(Date.now() - 604800000) },
];

export const demoReferralStats = {
  code: "LV999ABC123",
  totalReferrals: 3,
  completed: 2,
  earned: "10.00",
};

/* ─── SEARCH RESULTS ─── */
export const demoSearchResults = [
  { id: 1, type: "job", title: "Senior Frontend Developer", description: "Join Zambia's leading tech hub. Work with React, TypeScript, and modern web technologies.", city: "Lusaka", badge: "Full-time", meta: { salaryRange: "ZMW 15,000 - 25,000", requiredSkills: "React, TypeScript" } },
  { id: 2, type: "job", title: "Data Analyst", description: "Analyze agricultural data to support smallholder farmers across Zambia.", city: "Remote", badge: "Remote", meta: { salaryRange: "ZMW 10,000 - 18,000", requiredSkills: "Python, SQL" } },
  { id: 3, type: "course", title: "React & TypeScript Mastery", description: "Master modern frontend development with React 19 and TypeScript.", city: null, badge: "Intermediate", meta: { category: "Technology", avgRating: "4.8", instructor: "David Mwila" } },
  { id: 4, type: "course", title: "Customer Excellence", description: "Learn world-class customer service skills for the Zambian market.", city: null, badge: "Beginner", meta: { category: "Business", avgRating: "4.6", instructor: "Grace Lungu" } },
  { id: 5, type: "shift", title: "Weekend Retail Assistant", description: "Support weekend operations at Shoprite Lusaka.", city: "Lusaka", badge: "QuickWork", meta: { hourlyRate: "25", date: "This Saturday" } },
  { id: 6, type: "opportunity", title: "Community Garden Coordinator", description: "Lead a community garden project in Matero township.", city: "Lusaka", badge: "Impact", meta: { hours: "20", organization: "Green Zambia" } },
  { id: 7, type: "job", title: "Mobile App Developer", description: "Build mobile applications serving millions of Zambian users.", city: "Lusaka", badge: "Full-time", meta: { salaryRange: "ZMW 12,000 - 20,000", requiredSkills: "Flutter, Dart" } },
  { id: 8, type: "course", title: "Data Science with Python", description: "From basics to advanced analytics — become a data scientist.", city: null, badge: "Advanced", meta: { category: "Technology", avgRating: "4.9", instructor: "Dr. Kenneth Kaunda Jr." } },
];

/* ─── COORDINATOR: VOLUNTEER ENTRIES ─── */
export const demoVolunteerEntries = [
  { id: 1, profileId: 101, opportunityId: 1, hoursLogged: 8, activityDescription: "Organized weekend coding workshop for 15 high school students at BongoHive. Taught basic HTML and CSS.", logDate: new Date(Date.now() - 86400000), status: "pending" },
  { id: 2, profileId: 102, opportunityId: 2, hoursLogged: 12, activityDescription: "Distributed food supplies to 50 families in Kanyama community as part of the relief program.", logDate: new Date(Date.now() - 172800000), status: "pending" },
  { id: 3, profileId: 103, opportunityId: 3, hoursLogged: 6, activityDescription: "Planted 30 trees at the Levy Mwanawasa stadium grounds for the Green Lusaka initiative.", logDate: new Date(Date.now() - 259200000), status: "pending" },
  { id: 4, profileId: 104, opportunityId: 1, hoursLogged: 4, activityDescription: "Mentored two junior developers through the Levav mentorship program, reviewed their portfolio projects.", logDate: new Date(Date.now() - 345600000), status: "pending" },
];

export const demoCoordinatorStats = {
  totalValidated: 24,
  totalHours: 186,
  uniqueVolunteers: 15,
};

/* ─── CREATOR STUDIO: COURSES & STATS ─── */
export const demoCreatorCourses = [
  { id: 1, title: "React & TypeScript Mastery", description: "Master modern frontend development with React 19 and TypeScript. Build production-ready apps.", category: "Technology", tier: "free", totalEnrollments: 342, averageRating: "4.8", price: 0, createdAt: new Date(Date.now() - 30 * 86400000) },
  { id: 2, title: "Zambian Business Communication", description: "Professional communication skills tailored for the Zambian workplace context.", category: "Business", tier: "paid", totalEnrollments: 128, averageRating: "4.5", price: 75, createdAt: new Date(Date.now() - 15 * 86400000) },
  { id: 3, title: "Advanced Python for Data Science", description: "Deep dive into pandas, numpy, and machine learning with real African datasets.", category: "Technology", tier: "subscription", totalEnrollments: 89, averageRating: "4.9", price: 0, createdAt: new Date(Date.now() - 7 * 86400000) },
];

export const demoCreatorStats = {
  totalCourses: 3,
  totalEnrollments: 559,
  avgRating: "4.73",
  revenueZmw: "9,600",
};

/* ─── MESSAGES: CONVERSATIONS ─── */
export const demoConversations = [
  { id: 1, updatedAt: new Date(Date.now() - 300000), jobId: 1 },
  { id: 2, updatedAt: new Date(Date.now() - 3600000), jobId: null },
  { id: 3, updatedAt: new Date(Date.now() - 86400000), jobId: 3 },
];

export const demoMessages: Record<number, Array<{ id: number; senderId: number; content: string; createdAt: Date; isRead: boolean }>> = {
  1: [
    { id: 1, senderId: 999, content: "Hi! I'm very interested in the Senior Frontend Developer position at BongoHive. I have 3 years of experience with React.", createdAt: new Date(Date.now() - 7200000), isRead: true },
    { id: 2, senderId: 201, content: "Hello Chanda! Thanks for reaching out. Could you share your portfolio and GitHub profile? We'd love to review your work.", createdAt: new Date(Date.now() - 7000000), isRead: true },
    { id: 3, senderId: 999, content: "Absolutely! Here are my links: github.com/chandabanda and chandabanda.dev. I recently built a fintech dashboard using React and TypeScript.", createdAt: new Date(Date.now() - 6800000), isRead: true },
    { id: 4, senderId: 201, content: "Impressive work! We'd like to invite you for a technical interview next Tuesday at 2 PM. Would that work for you?", createdAt: new Date(Date.now() - 300000), isRead: false },
  ],
  2: [
    { id: 5, senderId: 202, content: "Hi Chanda! I saw your profile on Levav. I'm Grace from MTN Zambia's HR team. We're impressed with your WRI score.", createdAt: new Date(Date.now() - 86400000), isRead: true },
    { id: 6, senderId: 999, content: "Thank you Grace! I'm currently exploring new opportunities. What roles do you have available?", createdAt: new Date(Date.now() - 85000000), isRead: true },
    { id: 7, senderId: 202, content: "We have a Full Stack Developer role that might be a great fit. Shall I send you the job details?", createdAt: new Date(Date.now() - 3600000), isRead: true },
  ],
  3: [
    { id: 8, senderId: 999, content: "Hello! I applied for the Data Analyst position. I have strong Python and SQL skills and I'm passionate about agricultural data.", createdAt: new Date(Date.now() - 172800000), isRead: true },
    { id: 9, senderId: 203, content: "Hi Chanda! Thanks for your application. Your background looks promising. Are you available for a 30-minute call this week?", createdAt: new Date(Date.now() - 86400000), isRead: true },
  ],
};

/* ─── LESSON PLAYER: COURSE + LESSONS ─── */
export const demoCourse = {
  id: 1,
  title: "React & TypeScript Mastery",
  category: "Technology",
  description: "Master modern frontend development with React 19 and TypeScript. Build production-ready applications from scratch.",
  totalLessons: 6,
};

export const demoLessons = [
  { id: 1, title: "Introduction to React 19", description: "Learn what's new in React 19 and set up your development environment.", durationMinutes: 15, contentType: "video", isFreePreview: true },
  { id: 2, title: "TypeScript Fundamentals", description: "Master TypeScript basics: types, interfaces, generics, and type inference.", durationMinutes: 22, contentType: "video", isFreePreview: true },
  { id: 3, title: "Component Architecture", description: "Build scalable component systems with proper separation of concerns.", durationMinutes: 18, contentType: "video", isFreePreview: false },
  { id: 4, title: "State Management Patterns", description: "Explore useState, useReducer, Context API, and external state libraries.", durationMinutes: 25, contentType: "video", isFreePreview: false },
  { id: 5, title: "Performance Optimization", description: "Learn memo, useMemo, useCallback, and React Server Components.", durationMinutes: 20, contentType: "video", isFreePreview: false },
  { id: 6, title: "Building a Real Project", description: "Apply everything you've learned to build a production-ready dashboard.", durationMinutes: 30, contentType: "video", isFreePreview: false },
];

/* ─── WALLET TOP-UP: PAYMENT HISTORY ─── */
export const demoPaymentHistory = [
  { id: 1, transactionType: "wallet_topup", amountZmw: "150.00", status: "completed", provider: "mtn_momo", phone: "0977123456", createdAt: new Date(Date.now() - 86400000) },
  { id: 2, transactionType: "course_purchase", amountZmw: "75.00", status: "completed", provider: null, phone: null, createdAt: new Date(Date.now() - 172800000) },
  { id: 3, transactionType: "wallet_topup", amountZmw: "200.00", status: "completed", provider: "airtel_money", phone: "0777123456", createdAt: new Date(Date.now() - 259200000) },
  { id: 4, transactionType: "wallet_topup", amountZmw: "50.00", status: "pending", provider: "mtn_momo", phone: "0977123456", createdAt: new Date(Date.now() - 3600000) },
];

/* ─── APPLICANT TRACKING: APPLICANTS ─── */
export const demoApplicants = [
  { id: 1, profileId: 201, jobId: 1, jobTitle: "Senior Frontend Developer", status: "interview", coverLetter: "I am excited to apply for this position. With 4 years of React experience and a passion for clean code, I believe I'm a strong fit.", employerNotes: "Strong portfolio, recommended for interview", profile: { firstName: "Mutale", lastName: "Mwanza", currentWriScore: "78.5" } },
  { id: 2, profileId: 202, jobId: 1, jobTitle: "Senior Frontend Developer", status: "screening", coverLetter: "Recent graduate with strong TypeScript skills and internship experience at a local startup.", employerNotes: "Junior level but eager to learn", profile: { firstName: "Peter", lastName: "Chileshe", currentWriScore: "62.3" } },
  { id: 3, profileId: 203, jobId: 2, jobTitle: "Customer Success Manager", status: "applied", coverLetter: "5 years in customer-facing roles. Looking to transition into tech.", employerNotes: "", profile: { firstName: "Grace", lastName: "Lungu", currentWriScore: "71.0" } },
  { id: 4, profileId: 204, jobId: 1, jobTitle: "Senior Frontend Developer", status: "offer", coverLetter: "Full-stack developer with React and Node.js expertise. Built multiple production apps.", employerNotes: "Excellent technical skills, making offer", profile: { firstName: "David", lastName: "Mwila", currentWriScore: "85.2" } },
  { id: 5, profileId: 205, jobId: 3, jobTitle: "Data Analyst", status: "hired", coverLetter: "Data scientist with agriculture background. Perfect fit for FSD Zambia.", employerNotes: "Hired! Starts next Monday", profile: { firstName: "Sarah", lastName: "Zulu", currentWriScore: "74.8" } },
  { id: 6, profileId: 206, jobId: 1, jobTitle: "Senior Frontend Developer", status: "rejected", coverLetter: "Self-taught developer looking for first professional role.", employerNotes: "Not enough experience for senior role", profile: { firstName: "John", lastName: "Banda", currentWriScore: "35.5" } },
];

/* ─── WRI HISTORY: ENTRIES ─── */
export const demoWriHistory = [
  { id: 1, componentType: "culture", score: "78.0", sourceEvent: "levav_28_session", sourceDescription: "Completed Day 1: CONFRONT scenario on workplace ethics", recordedAt: new Date(Date.now() - 30 * 86400000) },
  { id: 2, componentType: "critical_thinking", score: "75.0", sourceEvent: "levav_28_session", sourceDescription: "Completed Day 7: DISSECT scenario on system debugging", recordedAt: new Date(Date.now() - 24 * 86400000) },
  { id: 3, componentType: "reliability", score: "80.0", sourceEvent: "quickwork_shift", sourceDescription: "Completed 5 QuickWork shifts with 100% attendance", recordedAt: new Date(Date.now() - 20 * 86400000) },
  { id: 4, componentType: "communication", score: "70.0", sourceEvent: "course_completion", sourceDescription: "Completed 'Customer Excellence' course with distinction", recordedAt: new Date(Date.now() - 15 * 86400000) },
  { id: 5, componentType: "learning", score: "68.0", sourceEvent: "course_completion", sourceDescription: "Completed 'React & TypeScript Mastery' module 3", recordedAt: new Date(Date.now() - 10 * 86400000) },
  { id: 6, componentType: "leadership", score: "65.0", sourceEvent: "volunteer_validation", sourceDescription: "Led community garden project, 20 hours validated", recordedAt: new Date(Date.now() - 7 * 86400000) },
  { id: 7, componentType: "impact", score: "72.0", sourceEvent: "volunteer_validation", sourceDescription: "Mentored 3 junior developers through Levav program", recordedAt: new Date(Date.now() - 3 * 86400000) },
];

export const demoWriTrends: Record<string, Array<{ score: string }>> = {
  culture: [{ score: "60" }, { score: "65" }, { score: "70" }, { score: "75" }, { score: "78" }],
  critical_thinking: [{ score: "55" }, { score: "62" }, { score: "68" }, { score: "72" }, { score: "75" }],
  reliability: [{ score: "70" }, { score: "72" }, { score: "75" }, { score: "78" }, { score: "80" }],
  communication: [{ score: "50" }, { score: "55" }, { score: "60" }, { score: "65" }, { score: "70" }],
  learning: [{ score: "45" }, { score: "50" }, { score: "58" }, { score: "64" }, { score: "68" }],
  leadership: [{ score: "40" }, { score: "45" }, { score: "52" }, { score: "58" }, { score: "65" }],
  impact: [{ score: "55" }, { score: "60" }, { score: "65" }, { score: "70" }, { score: "72" }],
};

/* ─── ADVISOR: DEMO RESPONSES ─── */
export const demoAdvisorResponses: Record<string, string> = {
  "How can I improve my WRI?": "Great question! Based on your profile, I recommend focusing on your Leadership score (currently 65). Try volunteering for team lead roles in community projects. Your Critical Thinking at 75 is strong — maintain that! Consider taking the 'Advanced Communication' course to boost that component from 70 to 75+.",
  "What careers match my profile?": "With your WRI of 72.5 (Gold tier) and strong technical skills, you're well-suited for: 1) Frontend Developer roles at tech hubs like BongoHive, 2) Product Manager positions where your balanced scores shine, 3) Technical Lead roles after boosting Leadership to 70+. Your Reliability score of 80 makes you attractive to employers.",
  "What skills should I learn?": "Looking at market demand in Zambia: 1) Cloud skills (AWS/Azure) — high demand, 2) Mobile development (Flutter) — growing market, 3) Data visualization (Tableau/PowerBI) — complements your analytical strengths. I recommend starting with the 'Data Science with Python' course on Levav Learn.",
  "Explain my WRI score": "Your Workforce Readiness Index of 72.5 places you in the Gold tier (top 25%). Here's your breakdown: Culture 78% (strong ethics), Critical Thinking 75% (good problem solver), Reliability 80% (excellent — employers value this!), Communication 70%, Learning 68%, Leadership 65% (growth area), Impact 72%. Focus on Leadership for the biggest overall boost.",
};

/* ─── QUICKWORK: SHIFTS ─── */
export const demoShifts = [
  { id: 1, title: "Weekend Retail Assistant", companyName: "Shoprite", city: "Lusaka", hourlyRate: "25.00", startTime: new Date(Date.now() + 86400000), endTime: new Date(Date.now() + 86400000 + 28800000), status: "open", slotsFilled: 2, slotsTotal: 5 },
  { id: 2, title: "Event Setup Crew", companyName: "Lusaka Event Services", city: "Lusaka", hourlyRate: "35.00", startTime: new Date(Date.now() + 2 * 86400000), endTime: new Date(Date.now() + 2 * 86400000 + 21600000), status: "open", slotsFilled: 1, slotsTotal: 4 },
  { id: 3, title: "Delivery Driver", companyName: "Yango Delivery", city: "Kitwe", hourlyRate: "30.00", startTime: new Date(Date.now() + 3 * 86400000), endTime: new Date(Date.now() + 3 * 86400000 + 36000000), status: "open", slotsFilled: 3, slotsTotal: 6 },
  { id: 4, title: "Warehouse Packer", companyName: "Game Stores", city: "Ndola", hourlyRate: "22.00", startTime: new Date(Date.now() - 86400000), endTime: new Date(Date.now() - 86400000 + 28800000), status: "completed", slotsFilled: 3, slotsTotal: 3 },
];

/* ─── VOLUNTEER: OPPORTUNITIES ─── */
export const demoOpportunities = [
  { id: 1, title: "Youth Coding Mentor", organizationName: "BongoHive Foundation", city: "Lusaka", description: "Mentor underprivileged youth in basic programming. Weekend sessions.", hoursPerWeek: 4, spotsAvailable: 5 },
  { id: 2, title: "Food Distribution Volunteer", organizationName: "World Food Programme", city: "Lusaka", description: "Help distribute food supplies to vulnerable communities in Kanyama.", hoursPerWeek: 8, spotsAvailable: 10 },
  { id: 3, title: "Tree Planting Coordinator", organizationName: "Green Zambia", city: "Lusaka", description: "Lead tree planting initiatives across Lusaka. Physical work outdoors.", hoursPerWeek: 6, spotsAvailable: 8 },
  { id: 4, title: "Literacy Tutor", organizationName: "Read for Life", city: "Kitwe", description: "Teach adult literacy classes twice a week. No experience needed.", hoursPerWeek: 4, spotsAvailable: 3 },
];

/* ─── LEADERBOARD: ENTRIES ─── */
export const demoLeaderboard = [
  { rank: 1, levavCode: "LVA-DMW001", displayName: "David Mwila", wriScore: "91.2", goldKeyTier: "Diamond", componentCulture: 92, componentCriticalThinking: 90, componentReliability: 95, componentCommunication: 88, componentLearning: 90, componentLeadership: 92, componentImpact: 93 },
  { rank: 2, levavCode: "LVA-SZU001", displayName: "Sarah Zulu", wriScore: "88.5", goldKeyTier: "Platinum", componentCulture: 90, componentCriticalThinking: 87, componentReliability: 92, componentCommunication: 85, componentLearning: 88, componentLeadership: 86, componentImpact: 90 },
  { rank: 3, levavCode: "LVA-MMN001", displayName: "Mutale Mwanza", wriScore: "82.1", goldKeyTier: "Platinum", componentCulture: 85, componentCriticalThinking: 82, componentReliability: 88, componentCommunication: 80, componentLearning: 82, componentLeadership: 79, componentImpact: 85 },
  { rank: 4, levavCode: "LVA-GLU001", displayName: "Grace Lungu", wriScore: "78.5", goldKeyTier: "Gold", componentCulture: 82, componentCriticalThinking: 75, componentReliability: 85, componentCommunication: 88, componentLearning: 75, componentLeadership: 78, componentImpact: 76 },
  { rank: 5, levavCode: "LVA-PCH001", displayName: "Peter Chileshe", wriScore: "72.3", goldKeyTier: "Gold", componentCulture: 75, componentCriticalThinking: 78, componentReliability: 72, componentCommunication: 70, componentLearning: 75, componentLeadership: 68, componentImpact: 70 },
  { rank: 6, levavCode: "LVA-CHK001", displayName: "Chanda Banda", wriScore: "72.5", goldKeyTier: "Gold", componentCulture: 78, componentCriticalThinking: 75, componentReliability: 80, componentCommunication: 70, componentLearning: 68, componentLeadership: 65, componentImpact: 72 },
  { rank: 7, levavCode: "LVA-JKA001", displayName: "John Kabwe", wriScore: "65.8", goldKeyTier: "Silver", componentCulture: 70, componentCriticalThinking: 68, componentReliability: 72, componentCommunication: 62, componentLearning: 65, componentLeadership: 60, componentImpact: 68 },
  { rank: 8, levavCode: "LVA-AMA001", displayName: "Alice Mwansa", wriScore: "58.2", goldKeyTier: "Silver", componentCulture: 62, componentCriticalThinking: 55, componentReliability: 68, componentCommunication: 60, componentLearning: 55, componentLeadership: 52, componentImpact: 60 },
  { rank: 9, levavCode: "LVA-RCH001", displayName: "Robert Chanda", wriScore: "42.5", goldKeyTier: "Bronze", componentCulture: 45, componentCriticalThinking: 40, componentReliability: 50, componentCommunication: 42, componentLearning: 38, componentLeadership: 35, componentImpact: 45 },
  { rank: 10, levavCode: "LVA-MMU001", displayName: "Mary Mulenga", wriScore: "35.0", goldKeyTier: "Bronze", componentCulture: 38, componentCriticalThinking: 32, componentReliability: 42, componentCommunication: 35, componentLearning: 30, componentLeadership: 28, componentImpact: 38 },
];
