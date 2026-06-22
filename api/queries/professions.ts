/**
 * ============================================================
 * PROFESSIONS QUERY FUNCTIONS
 * ============================================================
 * Type-safe Drizzle ORM queries for the professions catalog.
 * ============================================================
 */

import { eq, like, and } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertProfession } from "@db/schema";
import { getDb } from "./connection";

const db = getDb;

export async function listProfessions(filters?: {
  category?: string;
  search?: string;
  activeOnly?: boolean;
}) {
  const conditions = [];

  if (filters?.category) {
    conditions.push(eq(schema.professions.category, filters.category));
  }
  if (filters?.search) {
    conditions.push(like(schema.professions.name, `%${filters.search}%`));
  }
  if (filters?.activeOnly !== false) {
    conditions.push(eq(schema.professions.isActive, true));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db()
    .select()
    .from(schema.professions)
    .where(whereClause);
}

export async function findProfessionById(id: number) {
  return db()
    .query.professions.findFirst({
      where: eq(schema.professions.id, id),
    });
}

export async function listProfessionCategories() {
  return db()
    .selectDistinct({ category: schema.professions.category })
    .from(schema.professions)
    .where(eq(schema.professions.isActive, true));
}

export async function createProfession(data: InsertProfession) {
  const result = await db()
    .insert(schema.professions)
    .values(data)
    .$returningId();
  return result[0]?.id;
}
