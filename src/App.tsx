/**
 * ============================================================
 * LEVAV™ TALENT AFRIKA — APP ROUTER
 * ============================================================
 * Routing per Blueprint v1.0.0 — Part V: Four Pathways
 *   LEARN (/learn), EARN (/earn), CONTRIBUTE (/contribute), BUILD (/build)
 * All other routes per Part IV: Core Portal Logic.
 * ============================================================
 */

import { Routes, Route } from "react-router";
import { RootLayout } from "@/components/layout/RootLayout";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { RouteGuard } from "@/components/layout/RouteGuard";
import { withErrorBoundary } from "@/components/layout/ErrorBoundary";

// Core Four Pathways
import Home from "./pages/Home";
import OnboardingPage from "./pages/OnboardingPage";
import ProfilePage from "./pages/ProfilePage";
import TalentDashboard from "./pages/TalentDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import LearnPage from "./pages/LearnPage";
import QuickworkPage from "./pages/QuickworkPage";
import VolunteerPage from "./pages/VolunteerPage";
import BuildPage from "./pages/BuildPage";
import EarnPage from "./pages/EarnPage";
import EmployerPortal from "./pages/EmployerPortal";
import AdminDashboard from "./pages/AdminDashboard";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFound from "./pages/NotFound";

// Portals per Blueprint Part IV
import AdminMaster from "./pages/AdminMaster";
import CreatorStudio from "./pages/CreatorStudio";
import CoordinatorPanel from "./pages/CoordinatorPanel";
import WalletPage from "./pages/WalletPage";
import JobDiscoveryPage from "./pages/JobDiscoveryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AdvisorPage from "./pages/AdvisorPage";
import SearchPage from "./pages/SearchPage";
import WriHistoryPage from "./pages/WriHistoryPage";
import LevavIdExportPage from "./pages/LevavIdExportPage";
import ApplicantTrackingPage from "./pages/ApplicantTrackingPage";
import MessagesPage from "./pages/MessagesPage";
import LessonPlayerPage from "./pages/LessonPlayerPage";
import SocialFeedPage from "./pages/SocialFeedPage";
import WalletTopUpPage from "./pages/WalletTopUpPage";
import CertificatePage from "./pages/CertificatePage";
import JobMatchingPage from "./pages/JobMatchingPage";
import ReferralPage from "./pages/ReferralPage";
import InterviewPage from "./pages/InterviewPage";
import NotificationSettingsPage from "./pages/NotificationSettingsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ChampionsPage from "./pages/ChampionsPage";
import ChampionOnboardingPage from "./pages/ChampionOnboardingPage";
import CreatorOnboardingPage from "./pages/CreatorOnboardingPage";
import DiscoveryJourney from "./pages/DiscoveryJourney";
import Levav28Page from "./pages/Levav28Page";

// ErrorBoundary wrappers
const SafeVerifyEmail = withErrorBoundary(VerifyEmailPage, "Verify Email");
const SafeResetPassword = withErrorBoundary(ResetPasswordPage, "Reset Password");
const SafeHome = withErrorBoundary(Home, "Home");
const SafeOnboarding = withErrorBoundary(OnboardingPage, "Onboarding");
const SafeProfile = withErrorBoundary(ProfilePage, "Levav ID™ Profile");
const SafeTalent = withErrorBoundary(TalentDashboard, "Levav ID™");
const SafeEmployer = withErrorBoundary(EmployerDashboard, "Employer Hub");
const SafeLearn = withErrorBoundary(LearnPage, "Levav Learn™");
const SafeContribute = withErrorBoundary(VolunteerPage, "Levav Impact™");
const SafeQuickwork = withErrorBoundary(QuickworkPage, "QuickWork™");
const SafeBuild = withErrorBoundary(BuildPage, "Build Portal");
const SafeEarn = withErrorBoundary(EarnPage, "Earn Portal");
const SafeAdmin = withErrorBoundary(AdminMaster, "Admin Master");
const SafeCreator = withErrorBoundary(CreatorStudio, "Creator Studio");
const SafeCoordinator = withErrorBoundary(CoordinatorPanel, "Coordinator Panel");
const SafeWallet = withErrorBoundary(WalletPage, "Levav Wallet™");
const SafeJobs = withErrorBoundary(JobDiscoveryPage, "Job Discovery");
const SafeAnalytics = withErrorBoundary(AnalyticsPage, "Platform Analytics");
const SafeAdvisor = withErrorBoundary(AdvisorPage, "AI Career Advisor");
const SafeSearch = withErrorBoundary(SearchPage, "Search");
const SafeWriHistory = withErrorBoundary(WriHistoryPage, "WRI™ History");
const SafeExport = withErrorBoundary(LevavIdExportPage, "Levav ID™ Export");
const SafeApplicants = withErrorBoundary(ApplicantTrackingPage, "Applicant Tracking");
const SafeMessages = withErrorBoundary(MessagesPage, "Messages");
const SafeLessonPlayer = withErrorBoundary(LessonPlayerPage, "Lesson Player");
const SafeSocialFeed = withErrorBoundary(SocialFeedPage, "Community Feed");
const SafeWalletTopUp = withErrorBoundary(WalletTopUpPage, "Wallet Top-Up");
const SafeCertificate = withErrorBoundary(CertificatePage, "Certificates");
const SafeJobMatching = withErrorBoundary(JobMatchingPage, "AI Job Matching");
const SafeReferral = withErrorBoundary(ReferralPage, "Refer & Earn");
const SafeInterview = withErrorBoundary(InterviewPage, "Interviews");
const SafeNotifications = withErrorBoundary(NotificationSettingsPage, "Notification Settings");
const SafeEmployerPortal = withErrorBoundary(EmployerPortal, "Employer Portal");
const SafeAdminDashboard = withErrorBoundary(AdminDashboard, "Admin Console");
const SafeSettings = withErrorBoundary(SettingsPage, "Settings");
const SafeChampions = withErrorBoundary(ChampionsPage, "Levav Champions™");
const SafeLeaderboard = withErrorBoundary(LeaderboardPage, "Leaderboard");
const SafeChampionApply = withErrorBoundary(ChampionOnboardingPage, "Champion Application");
const SafeCreatorApply = withErrorBoundary(CreatorOnboardingPage, "Creator Application");
const SafeDiscovery = withErrorBoundary(DiscoveryJourney, "Discovery Journey");
const SafeCrucible = withErrorBoundary(Levav28Page, "Levav 28™ Crucible");

export default function App() {
  return (
    <>
      <RootLayout>
        <Routes>
          {/* === PUBLIC === */}
          <Route path="/" element={<SafeHome />} />
          <Route path="/onboarding" element={<SafeOnboarding />} />
          <Route path="/profile" element={<SafeProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<SafeVerifyEmail />} />
          <Route path="/reset-password" element={<SafeResetPassword />} />
          <Route path="/jobs" element={<SafeJobs />} />
          <Route path="/search" element={<SafeSearch />} />
          <Route path="/leaderboard" element={<SafeLeaderboard />} />
          <Route path="/champions" element={<SafeChampions />} />
          <Route path="/champions/apply" element={<SafeChampionApply />} />
          <Route path="/creators/apply" element={<SafeCreatorApply />} />
          <Route path="/discovery" element={<SafeDiscovery />} />

          {/* === FOUR PATHWAYS (Blueprint Part V) === */}
          <Route path="/learn" element={<RouteGuard><SafeLearn /></RouteGuard>} />
          <Route path="/earn" element={<RouteGuard><SafeEarn /></RouteGuard>} />
          <Route path="/contribute" element={<RouteGuard><SafeContribute /></RouteGuard>} />
          <Route path="/volunteer" element={<RouteGuard><SafeContribute /></RouteGuard>} />
          <Route path="/build" element={<RouteGuard><SafeBuild /></RouteGuard>} />

          {/* === TALENT PORTFOLIO (Blueprint Part IV-A) === */}
          <Route path="/talent" element={<RouteGuard><SafeTalent /></RouteGuard>} />
          <Route path="/wri-history" element={<RouteGuard><SafeWriHistory /></RouteGuard>} />
          <Route path="/export" element={<RouteGuard><SafeExport /></RouteGuard>} />
          <Route path="/advisor" element={<RouteGuard><SafeAdvisor /></RouteGuard>} />
          <Route path="/skillspace" element={<RouteGuard><SafeBuild /></RouteGuard>} />

          {/* === QUICKWORK™ (Blueprint Part IV-B) === */}
          <Route path="/quickwork" element={<RouteGuard><SafeQuickwork /></RouteGuard>} />

          {/* === EMPLOYER HUB (Blueprint Part IV-B) === */}
          <Route path="/employer" element={<RouteGuard requiredRole="employer"><SafeEmployer /></RouteGuard>} />
          <Route path="/employer-portal" element={<RouteGuard requiredRole="employer"><SafeEmployerPortal /></RouteGuard>} />
          <Route path="/employer/applicants" element={<RouteGuard requiredRole="employer"><SafeApplicants /></RouteGuard>} />

          {/* === CREATOR STUDIO (Blueprint Part IV-C) === */}
          <Route path="/creator-dashboard" element={<RouteGuard requiredRole="creator"><SafeCreator /></RouteGuard>} />

          {/* === LEVAV IMPACT™ — COORDINATOR (Blueprint Part IV-D) === */}
          <Route path="/contribute/coordinator" element={<RouteGuard><SafeCoordinator /></RouteGuard>} />

          {/* === SOCIAL & MESSAGING === */}
          <Route path="/messages" element={<RouteGuard><SafeMessages /></RouteGuard>} />
          <Route path="/feed" element={<RouteGuard><SafeSocialFeed /></RouteGuard>} />

          {/* === LEVAV WALLET™ (Blueprint Part VI) === */}
          <Route path="/wallet" element={<RouteGuard><SafeWallet /></RouteGuard>} />
          <Route path="/wallet/topup" element={<RouteGuard><SafeWalletTopUp /></RouteGuard>} />

          {/* === CERTIFICATES === */}
          <Route path="/certificates" element={<RouteGuard><SafeCertificate /></RouteGuard>} />
          <Route path="/verify/:certNumber" element={<SafeCertificate />} />

          {/* === AI JOB MATCHING === */}
          <Route path="/job-matching" element={<RouteGuard><SafeJobMatching /></RouteGuard>} />

          {/* === REFER & EARN === */}
          <Route path="/refer" element={<RouteGuard><SafeReferral /></RouteGuard>} />

          {/* === INTERVIEWS === */}
          <Route path="/interviews" element={<RouteGuard><SafeInterview /></RouteGuard>} />

          {/* === NOTIFICATIONS === */}
          <Route path="/notifications" element={<RouteGuard><SafeNotifications /></RouteGuard>} />

          {/* === LEVAV 28™ CRUCIBLE (Blueprint Part IV-A) === */}
          <Route path="/crucible" element={<RouteGuard><SafeCrucible /></RouteGuard>} />

          {/* === ADMIN MASTER (Blueprint Part IV-E) === */}
          <Route path="/admin" element={<RouteGuard requiredRole="admin"><SafeAdminDashboard /></RouteGuard>} />
          <Route path="/admin-master" element={<RouteGuard requiredRole="admin"><SafeAdmin /></RouteGuard>} />
          <Route path="/admin-master/analytics" element={<RouteGuard requiredRole="admin"><SafeAnalytics /></RouteGuard>} />

          {/* === SETTINGS === */}
          <Route path="/settings" element={<RouteGuard><SafeSettings /></RouteGuard>} />

          {/* === LESSON PLAYER (Blueprint: Native Playback Rule) === */}
          <Route path="/lesson/:courseId/:lessonId" element={<RouteGuard><SafeLessonPlayer /></RouteGuard>} />

          {/* === 404 === */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RootLayout>
      <ToastProvider />
    </>
  );
}
