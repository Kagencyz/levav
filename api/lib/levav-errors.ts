/**
 * ============================================================
 * LEVAV TALENT AFRIKA — STRUCTURED ERROR HANDLING TEMPLATES
 * ============================================================
 * Standardized JSON error wrappers to prevent screen freezes
 * or app crashes. Every tRPC error flows through these templates.
 *
 * Pattern: All errors return { error: { code, message, details? } }
 * preventing unhandled exceptions from reaching the client raw.
 * ============================================================
 */

import { TRPCError } from "@trpc/server";

export type LevavErrorCode =
  | "PROFILE_NOT_FOUND"
  | "PROFILE_EXISTS"
  | "PROFESSION_NOT_FOUND"
  | "LEVAV_CODE_EXISTS"
  | "LEVAV_CODE_REQUIRED"
  | "ONBOARDING_INCOMPLETE"
  | "ROLE_INVALID"
  | "ROLE_UPGRADE_DENIED"
  | "WRI_NOT_FOUND"
  | "SHIFT_NOT_FOUND"
  | "SHIFT_CLOSED"
  | "SHIFT_ALREADY_APPLIED"
  | "APPLICATION_NOT_FOUND"
  | "JOB_NOT_FOUND"
  | "JOB_CLOSED"
  | "OPPORTUNITY_NOT_FOUND"
  | "OPPORTUNITY_CLOSED"
  | "PARTNER_NOT_FOUND"
  | "PARTNER_NOT_VERIFIED"
  | "VOLUNTEER_NOT_VALIDATED"
  | "UNAUTHORIZED_ACTION"
  | "FORBIDDEN_ROLE"
  | "VALIDATION_FAILED"
  | "INTERNAL_ERROR";

interface ErrorTemplate {
  trpcCode: "NOT_FOUND" | "BAD_REQUEST" | "FORBIDDEN" | "UNAUTHORIZED" | "INTERNAL_SERVER_ERROR" | "CONFLICT";
  message: string;
  httpStatus: number;
}

const ERROR_MAP: Record<LevavErrorCode, ErrorTemplate> = {
  PROFILE_NOT_FOUND: { trpcCode: "NOT_FOUND", message: "Levav profile not found.", httpStatus: 404 },
  PROFILE_EXISTS: { trpcCode: "CONFLICT", message: "A profile already exists for this user.", httpStatus: 409 },
  PROFESSION_NOT_FOUND: { trpcCode: "NOT_FOUND", message: "The selected profession was not found.", httpStatus: 404 },
  LEVAV_CODE_EXISTS: { trpcCode: "CONFLICT", message: "This Levav Code is already in use.", httpStatus: 409 },
  LEVAV_CODE_REQUIRED: { trpcCode: "BAD_REQUEST", message: "Levav Code is required.", httpStatus: 400 },
  ONBOARDING_INCOMPLETE: { trpcCode: "FORBIDDEN", message: "Please complete onboarding to access this feature.", httpStatus: 403 },
  ROLE_INVALID: { trpcCode: "BAD_REQUEST", message: "Invalid role selection.", httpStatus: 400 },
  ROLE_UPGRADE_DENIED: { trpcCode: "FORBIDDEN", message: "Role upgrade not permitted.", httpStatus: 403 },
  WRI_NOT_FOUND: { trpcCode: "NOT_FOUND", message: "WRI analytics record not found.", httpStatus: 404 },
  SHIFT_NOT_FOUND: { trpcCode: "NOT_FOUND", message: "Shift not found.", httpStatus: 404 },
  SHIFT_CLOSED: { trpcCode: "BAD_REQUEST", message: "This shift is no longer accepting applications.", httpStatus: 400 },
  SHIFT_ALREADY_APPLIED: { trpcCode: "CONFLICT", message: "You have already applied to this shift.", httpStatus: 409 },
  APPLICATION_NOT_FOUND: { trpcCode: "NOT_FOUND", message: "Application not found.", httpStatus: 404 },
  JOB_NOT_FOUND: { trpcCode: "NOT_FOUND", message: "Job posting not found.", httpStatus: 404 },
  JOB_CLOSED: { trpcCode: "BAD_REQUEST", message: "This job posting is closed.", httpStatus: 400 },
  OPPORTUNITY_NOT_FOUND: { trpcCode: "NOT_FOUND", message: "Impact opportunity not found.", httpStatus: 404 },
  OPPORTUNITY_CLOSED: { trpcCode: "BAD_REQUEST", message: "This opportunity is no longer open.", httpStatus: 400 },
  PARTNER_NOT_FOUND: { trpcCode: "NOT_FOUND", message: "Impact partner not found.", httpStatus: 404 },
  PARTNER_NOT_VERIFIED: { trpcCode: "FORBIDDEN", message: "Impact partner is not yet verified.", httpStatus: 403 },
  VOLUNTEER_NOT_VALIDATED: { trpcCode: "BAD_REQUEST", message: "Volunteer hours must be validated by a coordinator.", httpStatus: 400 },
  UNAUTHORIZED_ACTION: { trpcCode: "UNAUTHORIZED", message: "You must be signed in to perform this action.", httpStatus: 401 },
  FORBIDDEN_ROLE: { trpcCode: "FORBIDDEN", message: "You do not have the required role for this action.", httpStatus: 403 },
  VALIDATION_FAILED: { trpcCode: "BAD_REQUEST", message: "Input validation failed. Check your data and try again.", httpStatus: 400 },
  INTERNAL_ERROR: { trpcCode: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred. Our team has been notified.", httpStatus: 500 },
};

/**
 * Throw a standardized Levav error as a TRPCError.
 * Use this in all routers for consistent error responses.
 */
export function throwLevavError(code: LevavErrorCode, customMessage?: string): never {
  const template = ERROR_MAP[code];
  throw new TRPCError({
    code: template.trpcCode,
    message: customMessage || template.message,
  });
}

/**
 * Wrap any operation in a try/catch that standardizes the error.
 * Prevents raw database errors from leaking to the client.
 */
export async function safeOperation<T>(
  operation: () => Promise<T>,
  fallbackCode: LevavErrorCode = "INTERNAL_ERROR",
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    // If it's already a TRPCError, re-throw as-is
    if (error instanceof TRPCError) {
      throw error;
    }

    // Log for monitoring
    console.error(`[LevavError] ${fallbackCode}:`, error);

    // Wrap in standardized error
    throwLevavError(fallbackCode);
  }
}

/**
 * Structured error response for client consumption.
 * Ensures every error response has the same shape.
 */
export interface StructuredErrorResponse {
  error: {
    code: LevavErrorCode;
    message: string;
    details?: string;
  };
}

export function formatErrorResponse(code: LevavErrorCode, details?: string): StructuredErrorResponse {
  return {
    error: {
      code,
      message: ERROR_MAP[code].message,
      ...(details ? { details } : {}),
    },
  };
}
