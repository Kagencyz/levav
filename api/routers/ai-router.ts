/**
 * ============================================================
 * AI ROUTER — tRPC Endpoints for Levav 28™ AI Services
 * ============================================================
 * Exposes AI-powered features to the frontend:
 *   - generateChallenge: Profession-tailored CONFRONT™ scenarios
 *   - evaluateOwn: OWN™ phase accountability analysis
 *   - transcribeAudio: Whisper voice-to-text dictation
 * ============================================================
 */

import { z } from "zod";
import { createRouter, talentQuery } from "../middleware";
import { generateConfrontChallenge } from "../services/ai-challenge";
import { evaluateOwnWithAI } from "../services/ai-evaluation";
import { transcribeAudioBuffer } from "../services/whisper-dictation";

export const aiRouter = createRouter({
  /* ─── CONFRONT™ Challenge Generation ─── */
  generateChallenge: talentQuery
    .input(
      z.object({
        profession: z.string().min(1, "Profession is required").max(255),
        dayNumber: z.number().int().min(1).max(28),
        previousTopics: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const challenge = await generateConfrontChallenge({
        profession: input.profession,
        dayNumber: input.dayNumber,
        previousTopics: input.previousTopics,
      });

      return {
        scenario: challenge.scenario,
        professionContext: challenge.professionContext,
        difficulty: challenge.difficulty,
        estimatedTimeMinutes: challenge.estimatedTimeMinutes,
      };
    }),

  /* ─── OWN™ Phase Accountability Evaluation ─── */
  evaluateOwn: talentQuery
    .input(
      z.object({
        response: z.string().min(1, "Response is required").max(5000),
        profession: z.string().min(1).max(255),
        scenario: z.string().min(1).max(3000),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await evaluateOwnWithAI({
        response: input.response,
        profession: input.profession,
        scenario: input.scenario,
      });

      return {
        passed: result.passed,
        score: result.score,
        feedback: result.feedback,
        flags: result.flags,
        strengths: result.strengths,
        rewriteRequired: result.rewriteRequired,
      };
    }),

  /* ─── Whisper Voice Transcription ─── */
  transcribeAudio: talentQuery
    .input(
      z.object({
        audioBase64: z.string().min(1, "Audio data is required"),
        mimeType: z.string().default("audio/webm"),
      }),
    )
    .mutation(async ({ input }) => {
      const audioBuffer = Buffer.from(input.audioBase64, "base64");
      const transcription = await transcribeAudioBuffer({
        audioBuffer,
        mimeType: input.mimeType,
      });

      return {
        text: transcription.text,
        confidence: transcription.confidence,
        language: transcription.language,
      };
    }),
});
