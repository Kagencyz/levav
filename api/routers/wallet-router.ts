/**
 * ============================================================
 * WALLET ROUTER
 * ============================================================
 * tRPC endpoints for Levav Wallet™ management.
 * Protected by: authedQuery
 * ============================================================
 */

import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";
import { findProfileByUserId } from "../queries/levav-profiles";
import { listTransactions, getWalletBalance, getWalletStats } from "../queries/wallet";

export const walletRouter = createRouter({
  /* ─── Get Wallet Balance ─── */
  balance: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) return { balance: 0, currency: "ZMW" };

      const balance = await getWalletBalance(profile.id);
      return { balance, currency: "ZMW" };
    }, "INTERNAL_ERROR");
  }),

  /* ─── Get Wallet Stats ─── */
  stats: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) {
        return { balance: 0, totalIn: 0, totalOut: 0, transactionCount: 0, pendingIn: 0, currency: "ZMW" };
      }

      const stats = await getWalletStats(profile.id);
      return { ...stats, currency: "ZMW" };
    }, "INTERNAL_ERROR");
  }),

  /* ─── List Transactions ─── */
  transactions: authedQuery
    .input(
      z.object({
        direction: z.enum(["in", "out"]).optional(),
        status: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(50),
        offset: z.number().int().min(0).default(0),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) return [];

        return listTransactions({
          profileId: profile.id,
          status: input?.status,
          limit: input?.limit,
          offset: input?.offset,
        });
      }, "INTERNAL_ERROR");
    }),
});
