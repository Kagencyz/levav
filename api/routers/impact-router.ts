/**
 * ============================================================
 * IMPACT ROUTER (Agent 2 — Integration & Triggers)
 * ============================================================
 * Impact partner and opportunity management.
 * Partners must be admin-verified before listing opportunities.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, publicQuery, authedQuery, adminQuery } from "../middleware";
import { throwLevavError, safeOperation } from "../lib/levav-errors";
import {
  listImpactPartners,
  findPartnerById,
  createImpactPartner,
  verifyPartner,
  incrementPartnerOpportunityCount,
  listImpactOpportunities,
  findOpportunityById,
  createImpactOpportunity,
} from "../queries/impact";
import {
  CreateImpactPartnerSchema,
  CreateImpactOpportunitySchema,
} from "@contracts/schemas";

export const impactRouter = createRouter({
  /* ─── IMPACT PARTNERS ─── */

  partners: publicQuery
    .input(
      z
        .object({
          sector: z.string().optional(),
          city: z.string().optional(),
          verificationStatus: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return safeOperation(async () => {
        return listImpactPartners({
          verificationStatus: input?.verificationStatus ?? "verified",
          sector: input?.sector,
          city: input?.city,
        });
      }, "INTERNAL_ERROR");
    }),

  partnerById: publicQuery
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      return safeOperation(async () => {
        const partner = await findPartnerById(input.id);
        if (!partner) throwLevavError("PARTNER_NOT_FOUND");
        return partner;
      }, "PARTNER_NOT_FOUND");
    }),

  registerPartner: authedQuery
    .input(CreateImpactPartnerSchema)
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        const partnerId = await createImpactPartner({
          ...input,
          verificationStatus: "pending",
        });

        // Notify admins (placeholder — would send to admin notification queue)
        if (!env.isProduction) console.log(`[Admin Notification] New partner registration: ${input.name} (ID: ${partnerId})`);

        return { partnerId, status: "pending", message: "Partner registration submitted for review." };
      }, "INTERNAL_ERROR");
    }),

  verifyPartner: adminQuery
    .input(
      z.object({
        partnerId: z.number().int().positive(),
        status: z.enum(["verified", "rejected"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const partner = await findPartnerById(input.partnerId);
        if (!partner) throwLevavError("PARTNER_NOT_FOUND");

        await verifyPartner(input.partnerId, ctx.user.id, input.status);

        return {
          success: true,
          partnerId: input.partnerId,
          status: input.status,
        };
      }, "PARTNER_NOT_FOUND");
    }),

  /* ─── IMPACT OPPORTUNITIES ─── */

  opportunities: publicQuery
    .input(
      z
        .object({
          partnerId: z.number().int().positive().optional(),
          city: z.string().optional(),
          status: z.string().default("open"),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return safeOperation(async () => {
        return listImpactOpportunities({
          partnerId: input?.partnerId,
          city: input?.city,
          status: input?.status ?? "open",
        });
      }, "INTERNAL_ERROR");
    }),

  opportunityById: publicQuery
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      return safeOperation(async () => {
        const opportunity = await findOpportunityById(input.id);
        if (!opportunity) throwLevavError("OPPORTUNITY_NOT_FOUND");
        return opportunity;
      }, "OPPORTUNITY_NOT_FOUND");
    }),

  createOpportunity: authedQuery
    .input(CreateImpactOpportunitySchema)
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        const partner = await findPartnerById(input.partnerId);
        if (!partner) throwLevavError("PARTNER_NOT_FOUND");

        if (partner.verificationStatus !== "verified") {
          throwLevavError("PARTNER_NOT_VERIFIED");
        }

        const opportunityId = await createImpactOpportunity({
          partnerId: input.partnerId,
          title: input.title,
          description: input.description,
          location: input.location,
          city: input.city,
          province: input.province,
          requiredSkills: input.requiredSkills ?? [],
          timeCommitmentHours: input.timeCommitmentHours?.toFixed(1) ?? null,
          startDate: input.startDate ? new Date(input.startDate) : null,
          endDate: input.endDate ? new Date(input.endDate) : null,
          spotsAvailable: input.spotsAvailable,
          coordinatorName: input.coordinatorName ?? null,
          coordinatorEmail: input.coordinatorEmail ?? null,
          coordinatorPhone: input.coordinatorPhone ?? null,
          status: "open",
        });

        // Increment partner's opportunity count
        await incrementPartnerOpportunityCount(input.partnerId);

        return { opportunityId, success: true };
      }, "PARTNER_NOT_FOUND");
    }),
});
