/**
 * ============================================================
 * MESSAGES PAGE — Direct Messaging Center
 * ============================================================
 * Real-time chat UI with conversation list, message thread,
 * send input, and unread indicators. Uses demo data for
 * offline development mode.
 * ============================================================
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { useBackend } from "@/hooks/useBackend";
import { GlassCard } from "@/components/ui/GlassCard";
import { demoConversations, demoMessages } from "@/lib/demo-data";
import {
  Send,
  MessageCircle,
  ChevronLeft,
  Clock,
  Check,
  CheckCheck,
  Inbox,
} from "lucide-react";

/* ─── Message Bubble Component ─── */
function MessageBubble({
  content,
  isMine,
  createdAt,
  isRead,
}: {
  content: string;
  isMine: boolean;
  createdAt: Date | string | null;
  isRead: boolean;
}) {
  const timeStr = createdAt
    ? new Date(createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isMine
            ? "bg-[#C6FF34] text-black rounded-br-md"
            : "bg-white/10 text-white/90 rounded-bl-md border border-white/5"
        }`}
      >
        <p>{content}</p>
        <div
          className={`flex items-center gap-1 mt-1.5 text-[10px] ${
            isMine ? "text-black/50" : "text-white/40"
          }`}
        >
          <span>{timeStr}</span>
          {isMine && (
            <span className="ml-0.5">
              {isRead ? (
                <CheckCheck className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Conversation List Item ─── */
function ConversationItem({
  conv,
  isActive,
  onClick,
  userId,
}: {
  conv: {
    id: number;
    updatedAt: Date | string | null;
    jobId: number | null;
  };
  isActive: boolean;
  onClick: () => void;
  userId: number;
}) {
  const messages = demoMessages[conv.id] ?? [];
  const lastMessage = messages[messages.length - 1] ?? null;
  const hasUnread = lastMessage
    ? lastMessage.senderId !== userId && !lastMessage.isRead
    : false;

  const timeStr = conv.updatedAt
    ? new Date(conv.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-[#C6FF34]/10 border border-[#C6FF34]/20"
          : "hover:bg-white/5 border border-transparent"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
            isActive
              ? "bg-[#C6FF34] text-black"
              : "bg-[#7E3BED]/20 text-[#7E3BED]"
          }`}
        >
          {conv.jobId ? "J" : "C"}
          {conv.id}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p
              className={`text-sm font-medium truncate ${
                isActive ? "text-[#C6FF34]" : "text-white/90"
              }`}
            >
              {conv.jobId
                ? `Job Discussion #${conv.jobId}`
                : `Conversation #${conv.id}`}
            </p>
            <span className="text-[10px] text-white/40 shrink-0 ml-2">
              {timeStr}
            </span>
          </div>
          <p className="text-xs text-white/50 truncate mt-0.5">
            {lastMessage
              ? lastMessage.content
              : "No messages yet"}
          </p>
        </div>
        {hasUnread && (
          <div className="w-2.5 h-2.5 rounded-full bg-[#C6FF34] shrink-0" />
        )}
      </div>
    </button>
  );
}

/* ─── Main Messages Page ─── */
export default function MessagesPage() {
  const { user, isAuthenticated } = useAuth();
  const { isOnline } = useBackend();
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [inputText, setInputText] = useState("");
  const [localMessages, setLocalMessages] = useState(demoMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* tRPC: Load conversations from backend */
  const { data: trpcConversations } = trpc.message.conversations.useQuery(undefined, {
    retry: 1,
    enabled: isOnline && isAuthenticated,
  });
  const { data: trpcMessages } = trpc.message.list.useQuery(
    { conversationId: selectedConvId ?? 0 },
    { retry: 1, enabled: isOnline && isAuthenticated && selectedConvId !== null },
  );

  /* Auto-scroll to bottom on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, selectedConvId, trpcMessages]);

  const handleSend = () => {
    if (!inputText.trim() || !selectedConvId) return;
    const newMsg = {
      id: Date.now(),
      senderId: user?.id ?? 999,
      content: inputText.trim(),
      createdAt: new Date(),
      isRead: false,
    };
    setLocalMessages((prev) => ({
      ...prev,
      [selectedConvId]: [...(prev[selectedConvId] ?? []), newMsg],
    }));
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const conversations = demoConversations;
  const selectedConv = conversations.find((c) => c.id === selectedConvId);
  const currentMessages = selectedConvId ? (localMessages[selectedConvId] ?? []) : [];

  return (
    <div className="h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-white/5 bg-[#070a13]/60 backdrop-blur-xl">
        <div className="levav-container flex items-center h-14">
          {selectedConvId && (
            <button
              onClick={() => setSelectedConvId(null)}
              className="md:hidden mr-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <MessageCircle className="w-5 h-5 text-[#C6FF34] mr-2" />
          <h1 className="text-base font-semibold">
            {selectedConv
              ? selectedConv.jobId
                ? `Job Discussion #${selectedConv.jobId}`
                : `Conversation #${selectedConv.id}`
              : "Messages"}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation List - Hidden on mobile when thread is open */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-white/5 bg-[#070a13]/40 overflow-y-auto ${
            selectedConvId !== null ? "hidden md:block" : ""
          }`}
        >
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
              <Inbox className="w-12 h-12 text-white/20 mb-3" />
              <p className="text-sm text-white/60 mb-1">No conversations yet</p>
              <p className="text-xs text-white/40">
                Start messaging from job listings or employer pages.
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {conversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  isActive={conv.id === selectedConvId}
                  onClick={() => setSelectedConvId(conv.id)}
                  userId={user?.id ?? 0}
                />
              ))}
            </div>
          )}
        </div>

        {/* Message Thread - Full width on mobile when selected */}
        <div
          className={`flex-1 flex flex-col bg-[#070a13]/20 ${
            selectedConvId === null ? "hidden md:flex" : ""
          }`}
        >
          {selectedConvId === null ? (
            /* Empty state - desktop only */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-[#C6FF34]/10 border border-[#C6FF34]/20 flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-[#C6FF34]" />
              </div>
              <h3 className="text-lg font-semibold text-white/80 mb-2">
                Select a conversation
              </h3>
              <p className="text-sm text-white/40 max-w-xs">
                Choose a conversation from the list to view and send messages.
              </p>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Clock className="w-10 h-10 text-white/15 mb-3" />
                    <p className="text-sm text-white/40">
                      No messages yet. Send the first message!
                    </p>
                  </div>
                ) : (
                  <>
                    {currentMessages.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        content={msg.content}
                        isMine={msg.senderId === (user?.id ?? 0)}
                        createdAt={msg.createdAt}
                        isRead={msg.isRead}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Send Input */}
              <div className="shrink-0 border-t border-white/5 bg-[#070a13]/60 backdrop-blur-xl p-3">
                <div className="flex items-center gap-2 max-w-3xl mx-auto">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C6FF34]/30 focus:bg-white/10 transition-all"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="p-3 rounded-xl bg-[#C6FF34] text-black hover:shadow-lime disabled:opacity-30 disabled:hover:shadow-none transition-all duration-200"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
