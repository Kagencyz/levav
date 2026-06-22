# 20-Agent Backend Integration Swarm
## Mission: Wire Frontend -> Backend -> Database (100% Functional)

### Agent 1: AUTH & SESSION CORE
- Fix useAuth.ts to call trpc.auth.me first, fallback to demo mode
- Fix useAuth to read real token from localStorage
- Wire Login.tsx success to properly set user state
- Handle logout via tRPC

### Agent 2: DATA LAYER BRIDGE
- Rewrite data-layer.ts to actually USE tRPC queries
- Add tRPC -> localStorage fallback for every function
- Create smart cache: tRPC success = persist to localStorage
- Offline mode: read localStorage when tRPC fails

### Agent 3: PROFILE ROUTER + LevavProfilePage
- Audit/fix levav-profile-router.ts backend
- Wire ProfilePage.tsx to use tRPC profile.me
- Wire profile update mutations
- Connect skills, experience, education

### Agent 4: WRI ROUTER + Analytics
- Audit/fix wri-router.ts
- Wire TalentDashboard.tsx to use tRPC wri.me
- Wire WriHistoryPage.tsx
- Connect WRI calculator service

### Agent 5: CRUCIBLE ROUTER
- Audit/fix levav28 session/response routers
- Wire Levav28Page.tsx to use tRPC
- Connect AI challenge generation
- Connect AI evaluation service

### Agent 6: JOB BROADCAST ROUTER + JobDiscovery
- Audit/fix job-broadcast-router.ts
- Wire JobDiscoveryPage.tsx to use tRPC job.listJobs
- Wire job creation (employer) to use tRPC
- Connect job search/filter

### Agent 7: APPLICATION ROUTER + ApplicantTracking
- Audit/fix job-application-router.ts
- Wire ApplicantTrackingPage.tsx
- Connect apply flow (talent -> employer sees it)
- Handle application status changes

### Agent 8: EMPLOYER ROUTER + EmployerDashboard
- Audit/fix employer-router.ts
- Wire EmployerDashboard.tsx to use tRPC
- Connect company profile, job management
- Connect billing/subscription

### Agent 9: WALLET ROUTER + WalletPage
- Audit/fix wallet-router.ts (already partially wired)
- Wire WalletPage.tsx fully
- Wire WalletTopUpPage.tsx
- Connect transaction history

### Agent 10: COURSE/CONTENT ROUTER + CreatorStudio
- Audit/fix course-router.ts
- Wire CreatorStudio.tsx to use tRPC
- Connect content CRUD (create, read, update, delete)
- Wire content status (draft/published/under_review)

### Agent 11: CHAMPIONS ROUTER + ChampionsPage
- Create champions-router.ts (backend)
- Create champions table in schema if missing
- Wire ChampionsPage.tsx to use tRPC
- Wire ChampionOnboardingPage.tsx

### Agent 12: CREATOR ROUTER + CreatorOnboarding
- Create creator-router.ts (backend)
- Create creator_applications table
- Wire CreatorOnboardingPage.tsx

### Agent 13: QUICKWORK ROUTER + QuickworkPage
- Audit/fix quickwork-router.ts
- Wire QuickworkPage.tsx
- Connect shift posting, applications

### Agent 14: IMPACT/VOLUNTEER ROUTER + VolunteerPage
- Audit/fix impact-router.ts and volunteer-router.ts
- Wire VolunteerPage.tsx
- Connect opportunity listings, hours logging

### Agent 15: MESSAGING ROUTER + MessagesPage
- Audit/fix message-router.ts
- Wire MessagesPage.tsx
- Connect conversations, real-time messaging

### Agent 16: FEED ROUTER + SocialFeedPage
- Audit/fix feed-router.ts (already partially wired)
- Wire SocialFeedPage.tsx fully
- Connect posts, likes, comments

### Agent 17: NOTIFICATION ROUTER + NotificationCenter
- Audit/fix notification-router.ts and push-router.ts
- Wire NotificationCenter.tsx
- Connect push subscriptions

### Agent 18: AI SERVICES + AdvisorPage
- Audit/fix ai-router.ts and advisor-router.ts
- Wire AdvisorPage.tsx to use real AI endpoints
- Connect swarm agent responses
- Wire OpenRouter LLM integration

### Agent 19: ANALYTICS + ADMIN
- Audit/fix analytics-router.ts
- Wire AdminMaster.tsx fully
- Wire AdminDashboard.tsx
- Connect platform metrics

### Agent 20: TESTING HARNESS + QA
- Build API test suite for all 30 routers
- Build integration tests (frontend -> backend -> DB)
- Verify auth flow end-to-end
- Verify CRUD operations for all entities
- Performance testing (rate limits, concurrency)
