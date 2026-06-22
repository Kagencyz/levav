/**
 * ============================================================
 * WALLET & TRANSACTIONS QUERY FUNCTIONS
 * ============================================================
 * Type-safe Drizzle ORM queries for the Levav Wallet™.
 * ============================================================
 */

import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertTransactionsWallet } from "@db/schema";
import { getDb } from "./connection";

const db = getDb;

/* ─── TRANSACTION CRUD ─── */

export async function listTransactions(filters: {
  profileId?: number;
  transactionType?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const conditions = [];
  if (filters.profileId) conditions.push(eq(schema.transactionsWallet.profileId, filters.profileId));
  if (filters.transactionType) conditions.push(eq(schema.transactionsWallet.transactionType, filters.transactionType as any));
  if (filters.status) conditions.push(eq(schema.transactionsWallet.status, filters.status as any));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db()
    .select()
    .from(schema.transactionsWallet)
    .where(whereClause)
    .orderBy(desc(schema.transactionsWallet.createdAt))
    .limit(filters.limit ?? 50)
    .offset(filters.offset ?? 0);
}

export async function findTransactionById(id: number) {
  return db()
    .query.transactionsWallet.findFirst({
      where: eq(schema.transactionsWallet.id, id),
    });
}

export async function createTransaction(data: InsertTransactionsWallet) {
  const result = await db()
    .insert(schema.transactionsWallet)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

export async function updateTransactionStatus(
  transactionId: number,
  status: "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded",
  metadata?: Record<string, unknown>,
) {
  await db()
    .update(schema.transactionsWallet)
    .set({
      status,
      metadata: metadata ?? null,

    })
    .where(eq(schema.transactionsWallet.id, transactionId));
}

/* ─── BALANCE CALCULATIONS ─── */

export async function getWalletBalance(profileId: number): Promise<number> {
  const result = await db()
    .select({
      total: sql<number>`COALESCE(SUM(${schema.transactionsWallet.amount}), 0)`,
    })
    .from(schema.transactionsWallet)
    .where(
      and(
        eq(schema.transactionsWallet.profileId, profileId),
        eq(schema.transactionsWallet.status, "completed"),
      ),
    );
  return result[0]?.total ?? 0;
}

export async function getWalletStats(profileId: number) {
  const completed = await db()
    .select({
      totalIn: sql<number>`COALESCE(SUM(${schema.transactionsWallet.amount}), 0)`,
      count: sql<number>`COUNT(*)`,
    })
    .from(schema.transactionsWallet)
    .where(
      and(
        eq(schema.transactionsWallet.profileId, profileId),
        eq(schema.transactionsWallet.status, "completed"),
      ),
    );

  const pending = await db()
    .select({
      pendingAmount: sql<number>`COALESCE(SUM(${schema.transactionsWallet.amount}), 0)`,
    })
    .from(schema.transactionsWallet)
    .where(
      and(
        eq(schema.transactionsWallet.profileId, profileId),
        eq(schema.transactionsWallet.status, "pending"),
      ),
    );

  return {
    balance: completed[0]?.totalIn ?? 0,
    totalIn: completed[0]?.totalIn ?? 0,
    totalOut: 0,
    transactionCount: completed[0]?.count ?? 0,
    pendingIn: pending[0]?.pendingAmount ?? 0,
  };
}
