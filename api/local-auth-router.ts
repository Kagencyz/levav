/**
 * ============================================================
 * LOCAL AUTH ROUTER — Bulletproof Authentication
 * ============================================================
 * Simple, robust email & password auth.
 * Throws proper TRPC errors that the client can handle.
 * ============================================================
 */

import { z } from "zod";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { generateLevavCode, createProfile } from "./queries/levav-profiles";
import { eq, and } from "drizzle-orm";
import * as schema from "@db/schema";
import { env } from "./lib/env";
import { TRPCError } from "@trpc/server";

const JWT_ALG = "HS256";
const SALT_ROUNDS = 12;

/* ─── JWT Helpers ─── */
async function signLocalToken(userId: number): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret);
  return new jose.SignJWT({ userId, type: "local" })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyLocalToken(token: string): Promise<{ userId: number } | null> {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(env.appSecret);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
      clockTolerance: 60,
    });
    if (payload.type !== "local" || !payload.userId) return null;
    return { userId: payload.userId as number };
  } catch {
    return null;
  }
}

export const localAuthRouter = createRouter({
  /* ─── REGISTER ─── */
  register: publicQuery
    .input(
      z.object({
        name: z.string().min(1, "Name is required").max(255),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      /* Check if email already exists */
      const existing = await db()
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, input.email))
        .limit(1);

      if (existing[0]) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with this email already exists. Please sign in instead.",
        });
      }

      /* Hash password */
      const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

      /* Create user (auto-verified in dev for testing) */
      const result = await db()
        .insert(schema.users)
        .values({
          name: input.name,
          email: input.email,
          passwordHash,
          loginType: "local",
          role: "talent",
          emailVerified: !env.isProduction,
          unionId: `local:${input.email}`,
        })
        .$returningId();

      const userId = result[0].id;

      /* Create profile */
      const levavCode = await generateLevavCode();
      await createProfile({
        userId,
        levavCode,
        firstName: input.name.split(" ")[0] ?? input.name,
        lastName: input.name.split(" ").slice(1).join(" ") || null,
        city: "",
        bio: `Levav ID member since ${new Date().getFullYear()}`,
        country: "Zambia",
        onboardingCompleted: false,
      });

      /* Dev mode: return token immediately for instant access */
      if (!env.isProduction) {
        const token = await signLocalToken(userId);
        return { success: true, token, userId, message: "Welcome to Levav!" };
      }

      /* Production: require email verification */
      return {
        success: true,
        userId,
        message: "Account created! Please check your email for the verification code.",
      };
    }),

  /* ─── LOGIN ─── */
  login: publicQuery
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(1, "Password is required"),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      /* Find user */
      const users = await db()
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, input.email))
        .limit(1);

      const user = users[0];
      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password.",
        });
      }

      /* Verify password */
      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password.",
        });
      }

      /* Production: check email verification */
      if (env.isProduction && !user.emailVerified) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Please verify your email before signing in.",
        });
      }

      /* Update last sign in */
      await db()
        .update(schema.users)
        .set({ lastSignInAt: new Date() })
        .where(eq(schema.users.id, user.id));

      /* Create session */
      const token = await signLocalToken(user.id);

      return {
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      };
    }),

  /* ─── GET CURRENT USER ─── */
  me: publicQuery.query(async ({ ctx }) => {
    const authHeader = ctx.req.headers.get("x-local-auth-token");
    if (!authHeader) return null;

    const session = await verifyLocalToken(authHeader);
    if (!session) return null;

    const db = getDb();
    const users = await db()
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, session.userId))
      .limit(1);

    return users[0] ?? null;
  }),
});
