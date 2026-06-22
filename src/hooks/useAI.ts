/**
 * ============================================================
 * useAI HOOK — Frontend tRPC Integration for AI Services
 * ============================================================
 * Provides typed mutations for:
 *   - generateChallenge: CONFRONT™ scenario generation
 *   - evaluateOwn: OWN™ phase accountability scoring
 *   - transcribeAudio: Voice-to-text dictation
 * ============================================================
 */

import { trpc } from "@/providers/trpc";

export function useAI() {
  // CONFRONT challenge generation
  const generateChallenge = trpc.ai.generateChallenge.useMutation();

  // OWN phase evaluation
  const evaluateOwn = trpc.ai.evaluateOwn.useMutation();

  // Audio transcription
  const transcribeAudio = trpc.ai.transcribeAudio.useMutation();

  return {
    // Generate CONFRONT challenge
    generateChallenge: generateChallenge.mutateAsync,
    isGenerating: generateChallenge.isPending,
    challengeError: generateChallenge.error,

    // Evaluate OWN response
    evaluateOwn: evaluateOwn.mutateAsync,
    isEvaluating: evaluateOwn.isPending,
    evaluationError: evaluateOwn.error,

    // Transcribe audio
    transcribeAudio: transcribeAudio.mutateAsync,
    isTranscribing: transcribeAudio.isPending,
    transcriptionError: transcribeAudio.error,
  };
}
