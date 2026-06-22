/**
 * ============================================================
 * LEVAV TALENT AFRIKA — tRPC MIDDLEWARE & PROCEDURE TYPES
 * ============================================================
 * Base procedures: publicQuery, authedQuery, adminQuery
 * Role-specific procedures: talentQuery, employerQuery, creatorQuery
 * ============================================================
 */

import { ErrorMessages } from "@contracts/constants";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

const requireAuth = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: ErrorMessages.unauthenticated,
    });
  }

  return next({ ctx: { ...ctx, user: ctx.user } });
});

function requireRole(role: string) {
  return t.middleware(async (opts) => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== role) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: ErrorMessages.insufficientRole,
      });
    }

    return next({ ctx: { ...ctx, user: ctx.user } });
  });
}

/**
 * Multi-role middleware: accepts an array of allowed roles.
 * Used for actions accessible by talent, employer, or creator.
 */
function requireAnyRole(roles: string[]) {
  return t.middleware(async (opts) => {
    const { ctx, next } = opts;

    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: ErrorMessages.unauthenticated,
      });
    }

    if (!roles.includes(ctx.user.role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `This action requires one of the following roles: ${roles.join(", ")}`,
      });
    }

    return next({ ctx: { ...ctx, user: ctx.user } });
  });
}

// Base procedures
export const authedQuery = t.procedure.use(requireAuth);
export const adminQuery = authedQuery.use(requireRole("admin"));

// Role-specific procedures (Levav ecosystem)
export const talentQuery = authedQuery.use(requireAnyRole(["talent"]));
export const employerQuery = authedQuery.use(requireAnyRole(["employer"]));
export const creatorQuery = authedQuery.use(requireAnyRole(["creator"]));

// Multi-role procedures (cross-portal access)
export const talentOrAdminQuery = authedQuery.use(requireAnyRole(["talent", "admin"]));
export const employerOrAdminQuery = authedQuery.use(requireAnyRole(["employer", "admin"]));
export const creatorOrAdminQuery = authedQuery.use(requireAnyRole(["creator", "admin"]));
export const anyRoleQuery = authedQuery; // Any authenticated user
