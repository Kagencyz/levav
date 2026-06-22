/**
 * ============================================================
 * LEVAV 28™ AUDIO DICTATION PREVIEW CANVAS
 * ============================================================
 * Active interface text field for the daily socratic loop.
 * - Blocks native browser paste events (onPaste={e => e.preventDefault()})
 * - Mic-activation button with audio state visualization
 * - Voice transcription preview pane with editing before submission
 * - Framer Motion animated state transitions
 * ============================================================
 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAI } from "@/hooks/useAI";
import {
  Mic,
  MicOff,
  Square,
  Send,
  Edit3,
  Volume2,
  AlertCircle,
} from "lucide-react";

type AudioState = "idle" | "listening" | "processing" | "preview" | "error";

interface AudioDictationCanvasProps {
  challengeLabel: string;
  placeholder?: string;
  onSubmit: (text: string) => void;
  minLength?: number;
}

export function AudioDictationCanvas({
  challengeLabel,
  placeholder = "Type your analysis here...",
  onSubmit,
  minLength = 50,
}: AudioDictationCanvasProps) {
  const { transcribeAudio, isTranscribing } = useAI();
  const [text, setText] = useState("");
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [transcribedText, setTranscribedText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  /* ─── Paste Blocker ─── */
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    // Show brief flash feedback
    const el = textareaRef.current;
    if (el) {
      el.classList.add("ring-2", "ring-red-500/50");
      setTimeout(() => el.classList.remove("ring-2", "ring-red-500/50"), 300);
    }
  }, []);

  /* ─── Voice Recording with Live Transcription ─── */
  const startListening = useCallback(async () => {
    try {
      setAudioState("listening");
      audioChunksRef.current = [];

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setAudioState("processing");

        try {
          // Convert audio blob to base64 and send to transcription API
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          const arrayBuffer = await audioBlob.arrayBuffer();
          const base64 = btoa(
            String.fromCharCode(...new Uint8Array(arrayBuffer)),
          );

          const result = await transcribeAudio({
            audioBase64: base64,
            mimeType,
          });

          if (result.text) {
            setTranscribedText(result.text);
          } else {
            // Fallback: transcription unavailable — let user type
            setTranscribedText("");
          }
          setAudioState("preview");
        } catch {
          // Transcription failed — switch to manual typing
          setAudioState("idle");
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms

      // Auto-stop after 60 seconds
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, 60000);
    } catch {
      setAudioState("error");
      setTimeout(() => setAudioState("idle"), 3000);
    }
  }, [transcribeAudio]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  /* ─── Accept Transcription ─── */
  const acceptTranscription = useCallback(() => {
    setText(transcribedText);
    setAudioState("idle");
    setTranscribedText("");
    // Focus textarea for editing
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, [transcribedText]);

  /* ─── Submit ─── */
  const handleSubmit = useCallback(() => {
    if (text.length >= minLength) {
      onSubmit(text);
    }
  }, [text, minLength, onSubmit]);

  const charCount = text.length;
  const isValid = charCount >= minLength;

  return (
    <div className="space-y-4">
      {/* Challenge Label */}
      <div className="flex items-center gap-2">
        <span className="badge-lime">{challengeLabel}</span>
        <span className="text-[10px] text-white/30">
          {charCount}/{minLength} characters minimum
        </span>
      </div>

      {/* ─── Main Text Area ─── */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onPaste={handlePaste}
          placeholder={placeholder}
          rows={6}
          className="glass-input w-full resize-none text-sm leading-relaxed"
          style={{ minHeight: "150px" }}
        />

        {/* Paste Blocked Indicator */}
        <AnimatePresence>
          {audioState === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5"
            >
              <AlertCircle className="w-3 h-3 text-white/30" />
              <span className="text-[10px] text-white/30">Copy/paste disabled</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Audio State Visualization ─── */}
      <AnimatePresence mode="wait">
        {/* LISTENING STATE */}
        {audioState === "listening" && (
          <motion.div
            key="listening"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard variant="glow" animate={false} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Animated waveform bars */}
                  <div className="flex items-end gap-0.5 h-6">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-[#C6FF34] rounded-full"
                        animate={{
                          height: [8, 20 + Math.random() * 4, 8],
                        }}
                        transition={{
                          duration: 0.6 + Math.random() * 0.4,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-[#C6FF34]">Listening...</span>
                </div>
                <button
                  onClick={stopListening}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <Square className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* PROCESSING STATE */}
        {audioState === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard variant="strong" animate={false} className="p-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-[#7E3BED] border-t-transparent rounded-full"
                />
                <span className="text-sm text-white/70">
                  {isTranscribing
                    ? "Transcribing via AI..."
                    : "Processing your voice..."}
                </span>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* PREVIEW STATE — Transcription Review */}
        {audioState === "preview" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard variant="glow" animate={false} className="p-5">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="w-4 h-4 text-[#C6FF34]" />
                <h3 className="text-sm font-semibold text-white">
                  Review Your Spoken Words
                </h3>
              </div>
              <p className="text-xs text-white/50 mb-4">
                Edit any formatting or concepts before locking in your submission.
              </p>

              {/* Transcribed Text Preview */}
              <div className="p-4 rounded-lg bg-black/40 border border-white/5 mb-4">
                <p className="text-sm text-white/90 leading-relaxed">{transcribedText}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={acceptTranscription}
                  className="btn-lime flex-1 flex items-center justify-center gap-2 text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit & Use
                </button>
                <button
                  onClick={() => {
                    setAudioState("idle");
                    setTranscribedText("");
                  }}
                  className="btn-ghost text-sm"
                >
                  Discard
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ERROR STATE */}
        {audioState === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlassCard variant="strong" animate={false} className="p-4 border-red-500/20">
              <p className="text-sm text-red-400">
                Microphone access denied. Please check permissions and try again.
              </p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Action Bar ─── */}
      <div className="flex items-center gap-3">
        {/* Mic Toggle */}
        {audioState === "idle" && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={startListening}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#7E3BED]/20 text-[#7E3BED] border border-[#7E3BED]/30 hover:bg-[#7E3BED]/30 transition-all text-sm font-medium"
          >
            <Mic className="w-4 h-4" />
            Voice Dictation
          </motion.button>
        )}

        {audioState === "listening" && (
          <button
            onClick={stopListening}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-medium"
          >
            <MicOff className="w-4 h-4" />
            Stop
          </button>
        )}

        {/* Character Counter */}
        <div className="flex-1 flex justify-end items-center gap-2">
          <span
            className={`text-xs tabular-nums ${
              isValid ? "text-[#C6FF34]" : "text-white/30"
            }`}
          >
            {charCount}
          </span>
          <span className="text-xs text-white/20">/</span>
          <span className="text-xs text-white/20">{minLength}</span>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="btn-lime flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          Submit
        </button>
      </div>
    </div>
  );
}
