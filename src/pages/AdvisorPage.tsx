/**
 * ============================================================
 * LEVAV ADVISOR™ — Swarm Agents Hub
 * ============================================================
 * 5 conversational AI agents + 20 implementation teams.
 * Per Orchestration Directive: preserve architecture, accelerate
 * execution through specialized teams.
 * ============================================================
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  SWARM_AGENTS, routeToAgent, generateAgentResponse,
  AGENT_TEAMS, getOverallCompletion, getStatusCounts,
} from "@/lib/swarm-agents";
import type { SwarmAgent } from "@/lib/swarm-agents";
import {
  Sparkles, Send, User, Loader2, Orbit, Compass,
  Hammer, Wrench, Telescope, Users, ChevronRight,
  Bot, Zap, BarChart3, CheckCircle2, Clock,
  AlertTriangle, TrendingUp, LayoutGrid, MessageSquare,
} from "lucide-react";

const AGENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Orbit, Compass, Hammer, Wrench, Telescope,
};

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  agentId?: string;
  content: string;
  actions?: string[];
  timestamp: Date;
}

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "agent",
  agentId: "nexus",
  content: "Welcome to the Swarm. I'm Nexus — your command center. Five specialized agents and 20 implementation teams are working to complete Africa's Workforce Intelligence Ecosystem™. Ask me anything or @mention a specific agent.",
  actions: ["Start Career Review", "Skill Gap Analysis", "View Ecosystem Status"],
  timestamp: new Date(),
};

export default function AdvisorPage() {
  const { isAuthenticated } = useAuth();
  const { isOnline } = useBackend();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");

  /* tRPC: AI advisor query (for complex queries that need backend AI) */
  const advisorMutation = trpc.advisor.ask.useMutation({
    onSuccess: (data) => {
      if (data?.answer) {
        setMessages((prev) => [...prev, {
          id: `ai-${Date.now()}`,
          role: "agent",
          agentId: "nexus",
          content: data.answer,
          timestamp: new Date(),
        }]);
      }
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [swarmMode, setSwarmMode] = useState(false);
  const [showRoster, setShowRoster] = useState(true);
  const [showTeams, setShowTeams] = useState(false);
  const [typingAgent, setTypingAgent] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Load profile */
  const [profile, setProfile] = useState<any>({});
  useEffect(() => {
    const raw = localStorage.getItem("levav_profile");
    if (raw) { try { setProfile(JSON.parse(raw)); } catch { /* ok */ } }
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typingAgent]);

  /* Send handler */
  const handleSend = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setIsLoading(true);

    /* Handle ecosystem status command */
    if (text.toLowerCase().includes("ecosystem status") || text.toLowerCase().includes("view ecosystem")) {
      const overall = getOverallCompletion();
      const counts = getStatusCounts();
      const statusMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        agentId: "nexus",
        content: `**Levav™ Ecosystem Status Report**

**Overall Completion**: ${overall}%
**Teams**: ${AGENT_TEAMS.length} agent teams operational

**By Status**:
${counts["complete"] || 0} Complete | ${counts["in-progress"] || 0} In Progress | ${counts["planned"] || 0} Planned

**Top 5 Active Teams**:
${AGENT_TEAMS.filter((t) => t.status === "in-progress").sort((a, b) => b.completion - a.completion).slice(0, 5).map((t) => `• Team ${t.id}: ${t.name} (${t.completion}%)`).join("\n")}

**Priority Pipeline**:
${AGENT_TEAMS.filter((t) => t.completion < 50).slice(0, 5).map((t) => `• Team ${t.id}: ${t.name} (${t.completion}%)`).join("\n")}

The swarm is executing. Architecture preserved. Heartbeat protected.`,
        actions: ["View All Teams", "Priority Pipeline", "Completed Features"],
        timestamp: new Date(),
      };
      setMessages((p) => [...p, statusMsg]);
      setIsLoading(false);
      return;
    }

    const agents = routeToAgent(text);
    const toUse = swarmMode && agents.length > 1 ? agents : [agents[0]];

    for (let i = 0; i < toUse.length; i++) {
      const agent = toUse[i];
      setTypingAgent(agent.id);
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
      const response = generateAgentResponse(agent.id, text, profile);
      const agentMsg: ChatMessage = {
        id: (Date.now() + i + 1).toString(),
        role: "agent",
        agentId: agent.id,
        content: response.content,
        actions: response.actions,
        timestamp: new Date(),
      };
      setMessages((p) => [...p, agentMsg]);
    }

    setTypingAgent(null);
    setIsLoading(false);
  }, [profile, swarmMode]);

  const handleMentionAgent = (agent: SwarmAgent) => {
    const mention = `@${agent.name.replace(" ", "")} `;
    setInput((c) => (c ? c + " " : "") + mention);
    inputRef.current?.focus();
  };

  const getAgent = (id?: string) => SWARM_AGENTS.find((a) => a.id === id);

  /* ─── RENDER ─── */
  return (
    <div className="min-h-screen bg-black pb-8 flex flex-col">
      <div className="levav-container max-w-5xl mx-auto py-6 sm:py-8 flex-1 flex flex-col">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="badge-violet flex items-center gap-1"><Bot className="w-3 h-3" /> Swarm AI</span>
            <span className="badge-lime">{SWARM_AGENTS.length} Agents</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/5">{AGENT_TEAMS.length} Teams</span>
            {swarmMode && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[10px] px-2 py-0.5 rounded-full bg-[#C6FF34]/20 text-[#C6FF34] border border-[#C6FF34]/30 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Swarm Mode
              </motion.span>
            )}
          </div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-hero text-2xl sm:text-3xl">Levav Advisor™</h1>
              <p className="text-body mt-1">{swarmMode ? "All agents collaborating" : "@mention any agent or ask the swarm"}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowTeams(!showTeams)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${showTeams ? "bg-[#7E3BED]/10 text-[#7E3BED] border border-[#7E3BED]/20" : "bg-white/5 text-white/50 border border-white/5 hover:bg-white/10"}`}>
                <LayoutGrid className="w-3.5 h-3.5" />{showTeams ? "Hide Teams" : "Ecosystem"}
              </button>
              <button onClick={() => setSwarmMode(!swarmMode)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${swarmMode ? "bg-[#C6FF34]/10 text-[#C6FF34] border border-[#C6FF34]/20" : "bg-white/5 text-white/50 border border-white/5 hover:bg-white/10"}`}>
                <Users className="w-3.5 h-3.5" />{swarmMode ? "Swarm On" : "Swarm"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Ecosystem Status Panel */}
        <AnimatePresence>
          {showTeams && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
              <EcosystemPanel />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">

          {/* Agent Roster Sidebar */}
          <AnimatePresence>
            {showRoster && (
              <motion.div initial={{ opacity: 0, x: -20, width: 0 }} animate={{ opacity: 1, x: 0, width: "auto" }} exit={{ opacity: 0, x: -20, width: 0 }} className="lg:w-64 flex-shrink-0">
                <div className="space-y-2">
                  <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3 px-2">Conversational Agents</h3>
                  {SWARM_AGENTS.map((agent) => {
                    const Icon = AGENT_ICONS[agent.icon] || Sparkles;
                    return (
                      <button key={agent.id} onClick={() => handleMentionAgent(agent)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all bg-white/[0.02] border border-transparent hover:bg-white/5 hover:border-white/10`}>
                        <div className={`p-2 rounded-lg ${agent.bgColor} ${agent.color}`}><Icon className="w-4 h-4" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{agent.name}</p>
                          <p className="text-[10px] text-white/40 truncate">{agent.title}</p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-white/20 flex-shrink-0" />
                      </button>
                    );
                  })}

                  <div className="pt-3 mt-3 border-t border-white/5">
                    <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3 px-2">Quick Tips</h3>
                    <div className="space-y-2 px-2">
                      <p className="text-[10px] text-white/40"><span className="text-[#C6FF34]">@AgentName</span> to target a specific agent</p>
                      <p className="text-[10px] text-white/40"><span className="text-[#C6FF34]">Swarm Mode</span> for multi-agent collaboration</p>
                      <p className="text-[10px] text-white/40"><span className="text-[#C6FF34]">"Ecosystem status"</span> to view team progress</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
              <AnimatePresence>
                {messages.map((msg) => {
                  if (msg.role === "user") {
                    return (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 flex-row-reverse">
                        <div className="p-2 rounded-xl bg-[#C6FF34]/10 text-[#C6FF34] flex-shrink-0"><User className="w-4 h-4" /></div>
                        <div className="max-w-[80%] text-right">
                          <div className="inline-block p-4 rounded-2xl bg-[#C6FF34]/10 border border-[#C6FF34]/20">
                            <p className="text-sm text-white/80 whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }
                  const agent = getAgent(msg.agentId);
                  const Icon = agent ? (AGENT_ICONS[agent.icon] || Sparkles) : Sparkles;
                  return (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl flex-shrink-0 ${agent?.bgColor || ""} ${agent?.color || ""}`}><Icon className="w-4 h-4" /></div>
                      <div className="flex-1 min-w-0">
                        {agent && <div className="flex items-center gap-2 mb-1"><span className={`text-[10px] font-semibold ${agent.color}`}>{agent.name}</span><span className="text-[9px] text-white/20">{agent.title}</span></div>}
                        <div className="glass-card border border-white/5 p-4 rounded-2xl">
                          <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{
                            __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/\n/g, '<br/>')
                          }} />
                          {msg.actions && (
                            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
                              {msg.actions.map((a) => (
                                <button key={a} onClick={() => handleSend(a)} className="text-[10px] px-3 py-1.5 rounded-full bg-white/5 text-white/50 hover:bg-[#C6FF34]/10 hover:text-[#C6FF34] transition-all border border-white/5 hover:border-[#C6FF34]/20">{a}</button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {typingAgent && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                  {(() => { const a = getAgent(typingAgent); const I = a ? (AGENT_ICONS[a.icon] || Sparkles) : Sparkles;
                    return <><div className={`p-2 rounded-xl flex-shrink-0 ${a?.bgColor || ""} ${a?.color || ""}`}><I className="w-4 h-4" /></div>
                    <div className="flex items-center gap-2 text-xs text-white/30"><Loader2 className="w-3 h-3 animate-spin" />{a?.name || "Agent"} is analyzing...</div></>;
                  })()}
                </motion.div>
              )}
            </div>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {["How can I improve my WRI™?", "What careers match my profile?", "Help me prepare for an interview", "What skills should I learn?", "@CareerSage What's my path?", "View ecosystem status"].map((p) => (
                  <button key={p} onClick={() => handleSend(p)} className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#C6FF34]/20 transition-all text-left group">
                    <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#C6FF34] transition-colors flex-shrink-0" />
                    <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors">{p}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="sticky bottom-0 bg-black/80 backdrop-blur-sm pt-2">
              <div className="flex items-center gap-2">
                <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend(input)}
                  placeholder={swarmMode ? "Ask the swarm..." : "Ask or @mention an agent..."}
                  className="glass-input flex-1 text-sm" disabled={isLoading} />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading} className="p-3 rounded-xl bg-[#C6FF34] text-black hover:shadow-lime transition-all disabled:opacity-30">
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
                <span className="text-[9px] text-white/20 flex-shrink-0">@</span>
                {SWARM_AGENTS.map((a) => { const I = AGENT_ICONS[a.icon] || Sparkles;
                  return <button key={a.id} onClick={() => handleMentionAgent(a)} className={`flex items-center gap-1 text-[9px] px-2 py-1 rounded-full transition-all flex-shrink-0 ${a.bgColor} ${a.color} ${a.borderColor} border hover:opacity-80`}><I className="w-2.5 h-2.5" />{a.name.split(" ")[0]}</button>;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ECOSYSTEM PANEL — 20 Agent Teams Status
   ═══════════════════════════════════════════ */
function EcosystemPanel() {
  const overall = getOverallCompletion();
  const counts = getStatusCounts();

  return (
    <GlassCard variant="strong">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2"><BarChart3 className="w-4 h-4 text-[#C6FF34]" /> Swarm Ecosystem Status</h3>
          <p className="text-[10px] text-white/40">Per Orchestration Directive — 20 Agent Teams</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#C6FF34]">{overall}%</p>
          <p className="text-[10px] text-white/40">Operational</p>
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-2 mb-4">
        {counts["complete"] && <span className="flex items-center gap-1 text-[10px] text-[#C6FF34]"><CheckCircle2 className="w-3 h-3" />{counts["complete"]} Complete</span>}
        {counts["in-progress"] && <span className="flex items-center gap-1 text-[10px] text-[#7E3BED]"><Clock className="w-3 h-3" />{counts["in-progress"]} In Progress</span>}
        {counts["planned"] && <span className="flex items-center gap-1 text-[10px] text-white/40"><AlertTriangle className="w-3 h-3" />{counts["planned"]} Planned</span>}
        <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden ml-2">
          <div className="h-full rounded-full bg-gradient-to-r from-[#7E3BED] to-[#C6FF34] transition-all" style={{ width: `${overall}%` }} />
        </div>
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
        {AGENT_TEAMS.map((team) => (
          <div key={team.id} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold ${team.status === "complete" ? "text-[#C6FF34]" : team.status === "in-progress" ? "text-[#7E3BED]" : "text-white/40"}`}>{team.id}</span>
              <span className="text-[10px] text-white/60 truncate flex-1">{team.name.replace(" Team", "")}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${team.status === "complete" ? "bg-[#C6FF34]/10 text-[#C6FF34]" : team.status === "in-progress" ? "bg-[#7E3BED]/10 text-[#7E3BED]" : "bg-white/5 text-white/30"}`}>
                {team.status === "in-progress" ? "Active" : team.status === "complete" ? "Done" : "Planned"}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${team.completion}%`, backgroundColor: team.completion >= 80 ? "#C6FF34" : team.completion >= 50 ? "#7E3BED" : "#ffffff30" }} />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[9px] text-white/30">{team.completion}%</span>
              {team.integrations && <span className="text-[8px] text-white/20">{team.integrations.length} integrations</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5 text-[10px] text-white/30">
        <span><TrendingUp className="w-3 h-3 inline mr-1" />Priority: Complete existing → Scale</span>
        <span><CheckCircle2 className="w-3 h-3 inline mr-1" />Rule: Preserve architecture, protect heartbeat</span>
      </div>
    </GlassCard>
  );
}
