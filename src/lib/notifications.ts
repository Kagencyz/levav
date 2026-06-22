/**
 * ============================================================
 * NOTIFICATION SYSTEM — Cross-Portal Event Bus
 * ============================================================
 * LocalStorage-based notification system for demo mode.
 * Every action (job posted, interview scheduled, talent viewed,
 * application received) creates notifications for all parties.
 * ============================================================
 */

export interface Notification {
  id: string;
  type: "job_posted" | "application_received" | "interview_scheduled" | "interview_reminder" | "talent_liked" | "offer_made" | "status_changed" | "message" | "system";
  title: string;
  message: string;
  fromRole: "employer" | "talent" | "admin" | "system";
  toRole: "employer" | "talent" | "admin";
  entityId?: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

const STORAGE_KEY = "levav_notifications";

export function getNotifications(): Notification[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function addNotification(n: Omit<Notification, "id" | "createdAt">): void {
  const all = getNotifications();
  const newN: Notification = {
    ...n,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  all.unshift(newN);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, 200)));
  // Dispatch event so UI can react
  window.dispatchEvent(new Event("levav-notification"));
}

export function markRead(id: string): void {
  const all = getNotifications().map((n) => n.id === id ? { ...n, read: true } : n);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function markAllRead(role: string): void {
  const all = getNotifications().map((n) => n.toRole === role ? { ...n, read: true } : n);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getUnreadCount(role: string): number {
  return getNotifications().filter((n) => n.toRole === role && !n.read).length;
}

/* ─── Helper: Create employer action notifications ─── */
export function notifyInterviewScheduled(employerName: string, talentName: string, jobTitle: string, date: string, time: string): void {
  addNotification({
    type: "interview_scheduled",
    title: "Interview Scheduled",
    message: `${employerName} scheduled an interview for "${jobTitle}" on ${date} at ${time}.`,
    fromRole: "employer",
    toRole: "talent",
    entityId: "interview",
    read: false,
    link: "/interviews",
  });
}

export function notifyApplicationReceived(talentName: string, jobTitle: string): void {
  addNotification({
    type: "application_received",
    title: "New Application",
    message: `${talentName} applied for "${jobTitle}".`,
    fromRole: "talent",
    toRole: "employer",
    read: false,
    link: "/employer",
  });
}

export function notifyJobPosted(employerName: string, jobTitle: string): void {
  addNotification({
    type: "job_posted",
    title: "New Job Available",
    message: `${employerName} posted a new position: ${jobTitle}.`,
    fromRole: "employer",
    toRole: "talent",
    read: false,
    link: "/jobs",
  });
}

export function notifyTalentViewed(employerName: string, talentName: string): void {
  addNotification({
    type: "talent_liked",
    title: "Employer Interest",
    message: `${employerName} viewed your profile and expressed interest.`,
    fromRole: "employer",
    toRole: "talent",
    read: false,
    link: "/talent",
  });
}

export function notifyStatusChanged(talentName: string, jobTitle: string, status: string): void {
  addNotification({
    type: "status_changed",
    title: "Application Status Updated",
    message: `Your application for "${jobTitle}" has been moved to: ${status}.`,
    fromRole: "employer",
    toRole: "talent",
    read: false,
    link: "/talent",
  });
}
