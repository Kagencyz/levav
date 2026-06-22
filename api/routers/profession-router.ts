/**
 * ============================================================
 * PROFESSION ROUTER (Agent 1 — Backend & Security)
 * ============================================================
 * Public catalog of curated professions for Zambia/Africa.
 * No authentication required — used during onboarding.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";
import { listProfessions, listProfessionCategories, findProfessionById } from "../queries/professions";

export const professionRouter = createRouter({
  /**
   * List all active professions with optional filtering.
   */
  list: publicQuery
    .input(
      z
        .object({
          category: z.string().optional(),
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return safeOperation(async () => {
        return listProfessions({
          category: input?.category,
          search: input?.search,
          activeOnly: true,
        });
      }, "INTERNAL_ERROR");
    }),

  /**
   * Get a single profession by ID.
   */
  byId: publicQuery
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      return safeOperation(async () => {
        const profession = await findProfessionById(input.id);
        if (!profession) {
          const { throwLevavError } = await import("../lib/levav-errors");
          throwLevavError("PROFESSION_NOT_FOUND");
        }
        return profession;
      }, "PROFESSION_NOT_FOUND");
    }),

  /**
   * List all distinct profession categories.
   */
  categories: publicQuery.query(async () => {
    return safeOperation(async () => {
      return listProfessionCategories();
    }, "INTERNAL_ERROR");
  }),
});
