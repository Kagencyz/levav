/**
 * ============================================================
 * IMPACT & VOLUNTEER QUERY FUNCTIONS
 * ============================================================
 * Type-safe Drizzle ORM queries for Levav Impact portal.
 * Includes: impact_partners, impact_opportunities, volunteer_ledger
 * ============================================================
 */

import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import type {
  InsertImpactPartner,
  InsertImpactOpportunity,
  InsertVolunteerLedger,
} from "@db/schema";
import { getDb } from "./connection";

const db = getDb;

/* ─── IMPACT PARTNERS ─── */

export async function listImpactPartners(filters?: {
  verificationStatus?: string;
  sector?: string;
  city?: string;
}) {
  const conditions = [];
  if (filters?.verificationStatus)
    conditions.push(eq(schema.impactPartners.verificationStatus, filters.verificationStatus as any));
  if (filters?.sector) conditions.push(eq(schema.impactPartners.sector, filters.sector));
  if (filters?.city) conditions.push(eq(schema.impactPartners.city, filters.city));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db()
    .select()
    .from(schema.impactPartners)
    .where(whereClause)
    .orderBy(desc(schema.impactPartners.createdAt));
}

export async function findPartnerById(id: number) {
  return db()
    .query.impactPartners.findFirst({
      where: eq(schema.impactPartners.id, id),
    });
}

export async function createImpactPartner(data: InsertImpactPartner) {
  const result = await db()
    .insert(schema.impactPartners)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

export async function verifyPartner(
  partnerId: number,
  adminId: number,
  status: "verified" | "rejected" = "verified",
) {
  await db()
    .update(schema.impactPartners)
    .set({
      verificationStatus: status,
      verifiedByAdminId: adminId,
      verifiedAt: new Date(),
    })
    .where(eq(schema.impactPartners.id, partnerId));
}

export async function incrementPartnerOpportunityCount(partnerId: number) {
  await db()
    .update(schema.impactPartners)
    .set({
      totalOpportunitiesListed: sql`${schema.impactPartners.totalOpportunitiesListed} + 1`,
    })
    .where(eq(schema.impactPartners.id, partnerId));
}

export async function addPartnerVolunteerHours(partnerId: number, hours: string) {
  await db()
    .update(schema.impactPartners)
    .set({
      totalVolunteerHoursLogged: sql`${schema.impactPartners.totalVolunteerHoursLogged} + ${hours}`,
    })
    .where(eq(schema.impactPartners.id, partnerId));
}

/* ─── IMPACT OPPORTUNITIES ─── */

export async function listImpactOpportunities(filters?: {
  partnerId?: number;
  status?: string;
  city?: string;
}) {
  const conditions = [];
  if (filters?.partnerId) conditions.push(eq(schema.impactOpportunities.partnerId, filters.partnerId));
  if (filters?.status) conditions.push(eq(schema.impactOpportunities.status, filters.status as any));
  if (filters?.city) conditions.push(eq(schema.impactOpportunities.city, filters.city));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db()
    .select()
    .from(schema.impactOpportunities)
    .where(whereClause)
    .orderBy(desc(schema.impactOpportunities.createdAt));
}

export async function findOpportunityById(id: number) {
  return db()
    .query.impactOpportunities.findFirst({
      where: eq(schema.impactOpportunities.id, id),
    });
}

export async function createImpactOpportunity(data: InsertImpactOpportunity) {
  const result = await db()
    .insert(schema.impactOpportunities)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

export async function fillOpportunitySpot(opportunityId: number) {
  await db()
    .update(schema.impactOpportunities)
    .set({
      spotsFilled: sql`${schema.impactOpportunities.spotsFilled} + 1`,
    })
    .where(eq(schema.impactOpportunities.id, opportunityId));
}

/* ─── VOLUNTEER LEDGER ─── */

export async function listVolunteerEntries(filters?: {
  profileId?: number;
  opportunityId?: number;
  validated?: boolean;
}) {
  const conditions = [];
  if (filters?.profileId) conditions.push(eq(schema.volunteerLedger.profileId, filters.profileId));
  if (filters?.opportunityId)
    conditions.push(eq(schema.volunteerLedger.opportunityId, filters.opportunityId));
  if (filters?.validated !== undefined)
    conditions.push(eq(schema.volunteerLedger.validatedByCoordinator, filters.validated));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db()
    .select()
    .from(schema.volunteerLedger)
    .where(whereClause)
    .orderBy(desc(schema.volunteerLedger.createdAt));
}

export async function findVolunteerEntryById(id: number) {
  return db()
    .query.volunteerLedger.findFirst({
      where: eq(schema.volunteerLedger.id, id),
    });
}

export async function logVolunteerHours(data: InsertVolunteerLedger) {
  const result = await db()
    .insert(schema.volunteerLedger)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

export async function validateVolunteerHours(
  ledgerEntryId: number,
  coordinatorName: string,
  coordinatorId?: number,
  notes?: string,
) {
  await db()
    .update(schema.volunteerLedger)
    .set({
      validatedByCoordinator: true,
      coordinatorName,
      coordinatorId: coordinatorId ?? null,
      validatedAt: new Date(),
      notes: notes ?? null,
    })
    .where(eq(schema.volunteerLedger.id, ledgerEntryId));
}

export async function getCoordinatorStats() {
  const allEntries = await listVolunteerEntries({});
  const validated = allEntries.filter((e) => e.validatedByCoordinator);
  const pending = allEntries.filter((e) => !e.validatedByCoordinator);

  const uniqueVolunteers = new Set(allEntries.map((e) => e.profileId)).size;

  return {
    totalValidated: validated.length,
    totalHours: validated.reduce((sum, e) => sum + Number(e.hoursLogged), 0),
    uniqueVolunteers,
    pendingCount: pending.length,
  };
}

export async function getTotalVolunteerHours(profileId: number): Promise<number> {
  const result = await db()
    .select({
      total: sql<number>`COALESCE(SUM(${schema.volunteerLedger.hoursLogged}), 0)`,
    })
    .from(schema.volunteerLedger)
    .where(
      and(
        eq(schema.volunteerLedger.profileId, profileId),
        eq(schema.volunteerLedger.validatedByCoordinator, true),
      ),
    );
  return result[0]?.total ?? 0;
}
