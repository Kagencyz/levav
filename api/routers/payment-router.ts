/**
 * ============================================================
 * PAYMENT ROUTER — Mobile Money Integration
 * ============================================================
 * tRPC endpoints for MTN MoMo and Airtel Money wallet top-ups.
 * Production: Integrates with MTN/Airtel APIs.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";
import { findProfileByUserId } from "../queries/levav-profiles";
import { getDb } from "../queries/connection";
import { eq, desc } from "drizzle-orm";
import * as schema from "@db/schema";

const db = getDb;

/**
 * Initiate a mobile money transaction.
 * Production: Replace with actual MTN/Airtel API calls.
 */
async function initiateMobileMoneyPayment(params: {
  phone: string;
  amount: number;
  provider: "mtn_momo" | "airtel_money";
  reference: string;
}): Promise<{ success: boolean; transactionRef: string; message: string }> {
  const { phone, amount, provider, reference } = params;

  /* Validate phone format for Zambia */
  const cleanPhone = phone.replace(/\s/g, "").replace(/^0/, "260");
  if (!cleanPhone.match(/^260(97|96|95|77|76|75)\d{7}$/)) {
    return { success: false, transactionRef: "", message: "Invalid phone number. Use format: 097xxxxxxx or 077xxxxxxx" };
  }

  /* Mock: Simulate payment processing */
  if (!env.isProduction) console.log(`[MobileMoney] ${provider} | Amount: ZMW ${amount} | Phone: ${cleanPhone} | Ref: ${reference}`);

  /* Production integration:
   * MTN MoMo API:
   * POST https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay
   *
   * Airtel Money API:
   * POST https://openapi.airtel.africa/merchant/v1/payments/
   */

  return {
    success: true,
    transactionRef: reference,
    message: `Payment request sent to ${provider === "mtn_momo" ? "MTN MoMo" : "Airtel Money"} number ending in ${cleanPhone.slice(-4)}. Approve the prompt on your phone.`,
  };
}

export const paymentRouter = createRouter({
  /* ─── Initiate Wallet Top-Up ─── */
  topup: authedQuery
    .input(
      z.object({
        amount: z.number().positive().min(1).max(10000),
        phone: z.string().min(9).max(15),
        provider: z.enum(["mtn_momo", "airtel_money"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throw new Error("Profile required");

        const reference = `LEVAV-${Date.now()}-${profile.id}`;

        /* Create pending transaction record */
        const result = await db()
          .insert(schema.paymentTransactions)
          .values({
            profileId: profile.id,
            transactionType: "wallet_topup",
            provider: input.provider,
            amountZmw: input.amount.toFixed(2),
            externalReference: reference,
            status: "pending",
            phoneNumber: input.phone,
            description: `Wallet top-up of ZMW ${input.amount} via ${input.provider === "mtn_momo" ? "MTN MoMo" : "Airtel Money"}`,
          })
          .$returningId();

        /* Initiate payment */
        const paymentResult = await initiateMobileMoneyPayment({
          phone: input.phone,
          amount: input.amount,
          provider: input.provider,
          reference,
        });

        return {
          transactionId: result[0].id,
          reference,
          ...paymentResult,
        };
      }, "INTERNAL_ERROR");
    }),

  /* ─── Check Transaction Status ─── */
  status: authedQuery
    .input(z.object({ transactionId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const tx = await db()
          .select()
          .from(schema.paymentTransactions)
          .where(eq(schema.paymentTransactions.id, input.transactionId))
          .limit(1);

        if (!tx[0]) throw new Error("Transaction not found");

        /* Verify ownership */
        const profile = await findProfileByUserId(ctx.user.id);
        if (profile && tx[0].profileId !== profile.id) {
          throw new Error("Unauthorized");
        }

        return tx[0];
      }, "INTERNAL_ERROR");
    }),

  /* ─── My Transaction History ─── */
  history: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) return [];

      return db()
        .select()
        .from(schema.paymentTransactions)
        .where(eq(schema.paymentTransactions.profileId, profile.id))
        .orderBy(desc(schema.paymentTransactions.createdAt));
    }, "INTERNAL_ERROR");
  }),

  /* ─── Verify Payment (webhook for providers) ─── */
  verify: authedQuery
    .input(z.object({ reference: z.string() }))
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        /* In production: verify with provider API */
        const tx = await db()
          .select()
          .from(schema.paymentTransactions)
          .where(eq(schema.paymentTransactions.externalReference, input.reference))
          .limit(1);

        if (!tx[0]) throw new Error("Transaction not found");

        /* Mock: Auto-complete after 10 seconds for demo */
        const created = new Date(tx[0].createdAt).getTime();
        if (Date.now() - created > 10000 && tx[0].status === "pending") {
          await db()
            .update(schema.paymentTransactions)
            .set({ status: "completed", completedAt: new Date() })
            .where(eq(schema.paymentTransactions.id, tx[0].id));

          /* Credit wallet */
          await db()
            .update(schema.levavProfiles)
            .set({
              balanceZmw: sql`${schema.levavProfiles.balanceZmw} + ${tx[0].amountZmw}`,
            })
            .where(eq(schema.levavProfiles.id, tx[0].profileId));

          return { status: "completed", amount: tx[0].amountZmw };
        }

        return { status: tx[0].status, amount: tx[0].amountZmw };
      }, "INTERNAL_ERROR");
    }),
});
