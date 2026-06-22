/**
 * ============================================================
 * CONTENT STUDIO — Content Studio Team (Team 10)
 * ============================================================
 * Full content creation, upload, preview, and publish system.
 * Supports video, audio, documents, and articles.
 * Connected to unified data layer.
 * ============================================================
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImageUpload } from "@/components/ImageUpload";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import { getContentItems, saveContentItem, updateContentItem, deleteContentItem } from "@/lib/data-layer";
import type { ContentItem } from "@/lib/data-layer";
import {
  Video, FileText, Mic, BookOpen, Plus, Upload, Eye,
  Edit3, Trash2, Clock, CheckCircle2, X, ChevronRight,
  Play, Headphones, File, Star, TrendingUp, Filter,
} from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  published: "bg-[#C6FF34]/10 text-[#C6FF34] border-[#C6FF34]/20",
  draft: "bg-white/5 text-white/40 border-white/10",
  under_review: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  video: <Video className="w-4 h-4" />,
  audio: <Headphones className="w-4 h-4" />,
  document: <File className="w-4 h-4" />,
  article: <BookOpen className="w-4 h-4" />,
};

const CATEGORIES = ["Career Development", "Education", "Inspiration", "Technical", "Leadership", "Health", "Finance"];

export default function CreatorStudio() {
  const { isAuthenticated } = useAuth();
  const { isOnline } = useBackend();
  const [localItems, setLocalItems] = useState<ContentItem[]>(() => getContentItems());
  const [showCreate, setShowCreate] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  /* tRPC: Load courses from backend */
  const { data: trpcCourses } = trpc.course.myCourses.useQuery(undefined, {
    retry: 1,
    enabled: isOnline && isAuthenticated,
  });

  /* Merge: tRPC courses mapped to ContentItem shape, fallback to localStorage */
  const items: ContentItem[] = (trpcCourses && Array.isArray(trpcCourses) && trpcCourses.length > 0)
    ? trpcCourses.map((c: any) => ({
        id: c.id,
        title: c.title,
        type: (c.contentType || "article") as "video" | "audio" | "document" | "article",
        status: (c.status || "draft") as "draft" | "published" | "under_review",
        createdAt: c.createdAt || new Date().toISOString(),
        updatedAt: c.updatedAt || c.createdAt || new Date().toISOString(),
        thumbnail: c.thumbnailUrl || null,
        description: c.description || "",
        category: c.category || "General",
        views: c.viewCount || 0,
        likes: c.likeCount || 0,
      }))
    : localItems;

  const filtered = items.filter((i) => {
    const matchesStatus = statusFilter === "all" || i.status === statusFilter;
    const matchesType = typeFilter === "all" || i.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const published = items.filter((i) => i.status === "published");
  const totalViews = published.reduce((s, i) => s + i.views, 0);
  const totalLikes = published.reduce((s, i) => s + i.likes, 0);

  const handleDelete = (id: number) => {
    if (confirm("Delete this content?")) {
      deleteContentItem(id);
      setLocalItems(getContentItems());
    }
  };

  const handleStatusChange = (id: number, status: ContentItem["status"]) => {
    updateContentItem(id, { status });
    setLocalItems(getContentItems());
  };

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-5xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-violet flex items-center gap-1"><Video className="w-3 h-3" /> Content Studio</span>
            <span className="text-xs text-white/30">{items.length} items</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-hero text-2xl sm:text-3xl">Creator Studio</h1>
              <p className="text-body mt-1">Create, upload, and publish content</p>
            </div>
            <button onClick={() => setShowCreate(true)} className="btn-lime flex items-center gap-2 text-xs">
              <Plus className="w-3.5 h-3.5" /> New Content
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <GlassCard><div className="text-center"><p className="text-lg font-bold text-[#C6FF34]">{published.length}</p><p className="text-[10px] text-white/40">Published</p></div></GlassCard>
            <GlassCard><div className="text-center"><p className="text-lg font-bold text-white">{items.filter((i) => i.status === "draft").length}</p><p className="text-[10px] text-white/40">Drafts</p></div></GlassCard>
            <GlassCard><div className="text-center"><p className="text-lg font-bold text-white">{totalViews.toLocaleString()}</p><p className="text-[10px] text-white/40">Total Views</p></div></GlassCard>
            <GlassCard><div className="text-center"><p className="text-lg font-bold text-[#C6FF34]">{totalLikes}</p><p className="text-[10px] text-white/40">Likes</p></div></GlassCard>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {["all", "published", "draft", "under_review"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`text-[10px] px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${statusFilter === s ? "bg-[#C6FF34] text-black" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>
                {s === "all" ? "All" : s === "under_review" ? "Review" : s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {["all", "video", "audio", "document", "article"].map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`text-[10px] px-3 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1 ${typeFilter === t ? "bg-[#7E3BED]/20 text-[#7E3BED] border border-[#7E3BED]/30" : "bg-white/5 text-white/40 border border-transparent hover:bg-white/10"}`}>
                {TYPE_ICONS[t] || <File className="w-3 h-3" />}{t === "all" ? "All Types" : t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: 0.03 * i }}>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group h-full flex flex-col">
                  {/* Thumbnail or placeholder */}
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-[#7E3BED]/20 to-[#C6FF34]/10 flex items-center justify-center mb-3 relative overflow-hidden">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-white/20">{TYPE_ICONS[item.type]}</div>
                    )}
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                          <Play className="w-4 h-4 text-white ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${STATUS_STYLES[item.status]}`}>{item.status}</span>
                    <span className="text-[9px] text-white/30 flex items-center gap-1">{TYPE_ICONS[item.type]}{item.type}</span>
                  </div>

                  <h3 className="text-xs font-semibold text-white mb-1 group-hover:text-[#C6FF34] transition-colors">{item.title}</h3>
                  <p className="text-[10px] text-white/40 mb-3 line-clamp-2 flex-1">{item.description}</p>

                  {/* Stats */}
                  {item.status === "published" && (
                    <div className="flex items-center gap-3 mb-3 text-[10px] text-white/30">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{item.views}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3" />{item.likes}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 pt-2 border-t border-white/5">
                    <button onClick={() => setEditingItem(item)} className="text-[10px] text-white/40 hover:text-white/80 px-2 py-1 rounded hover:bg-white/5 transition-all flex items-center gap-1"><Edit3 className="w-3 h-3" /> Edit</button>
                    {item.status === "draft" && (
                      <button onClick={() => handleStatusChange(item.id, "published")} className="text-[10px] text-[#C6FF34] hover:text-[#C6FF34] px-2 py-1 rounded hover:bg-[#C6FF34]/5 transition-all flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Publish</button>
                    )}
                    {item.status === "published" && (
                      <button onClick={() => handleStatusChange(item.id, "draft")} className="text-[10px] text-white/30 hover:text-white/60 px-2 py-1 rounded hover:bg-white/5 transition-all flex items-center gap-1"><Clock className="w-3 h-3" /> Unpublish</button>
                    )}
                    <button onClick={() => handleDelete(item.id)} className="text-[10px] text-red-400/50 hover:text-red-400 px-2 py-1 rounded hover:bg-red-400/5 transition-all ml-auto"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Upload className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30">No content found</p>
            <button onClick={() => setShowCreate(true)} className="btn-lime text-xs mt-3">Create Your First Content</button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && <CreateContentModal onClose={() => setShowCreate(false)} onSave={() => setLocalItems(getContentItems())} />}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && <EditContentModal item={editingItem} onClose={() => setEditingItem(null)} onSave={() => setLocalItems(getContentItems())} />}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CREATE CONTENT MODAL
   ═══════════════════════════════════════════ */
function CreateContentModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ContentItem["type"]>("article");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!title.trim()) return;
    saveContentItem({ title, type, category, description, thumbnail, status: "draft" });
    onSave();
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#0a0e1a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/5 bg-[#0a0e1a]/90 backdrop-blur-xl">
          <h2 className="text-section text-sm">New Content</h2>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-white/10"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <ImageUpload label="Thumbnail" currentImage={thumbnail} onImageSelect={(url) => setThumbnail(url)} shape="rounded" size="md" />
          <div>
            <label className="text-xs text-white/40 mb-1 block">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-levav text-xs w-full" placeholder="Enter content title" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as ContentItem["type"])} className="input-levav text-xs w-full">
                <option value="video">Video</option><option value="audio">Audio</option><option value="document">Document</option><option value="article">Article</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-levav text-xs w-full">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="input-levav text-xs w-full resize-none" placeholder="Describe your content..." />
          </div>
        </div>
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-2 p-5 border-t border-white/5 bg-[#0a0e1a]/90 backdrop-blur-xl">
          <button onClick={onClose} className="btn-outline text-xs">Cancel</button>
          <button onClick={handleSubmit} disabled={!title.trim()} className="btn-lime text-xs flex items-center gap-2 disabled:opacity-50"><CheckCircle2 className="w-3.5 h-3.5" /> Create</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   EDIT CONTENT MODAL
   ═══════════════════════════════════════════ */
function EditContentModal({ item, onClose, onSave }: { item: ContentItem; onClose: () => void; onSave: () => void }) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [category, setCategory] = useState(item.category);
  const [thumbnail, setThumbnail] = useState<string | null>(item.thumbnail || null);

  const handleSave = () => {
    if (!title.trim()) return;
    updateContentItem(item.id, { title, description, category, thumbnail });
    onSave();
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#0a0e1a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/5 bg-[#0a0e1a]/90 backdrop-blur-xl">
          <h2 className="text-section text-sm">Edit Content</h2>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-white/10"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <ImageUpload label="Thumbnail" currentImage={thumbnail} onImageSelect={(url) => setThumbnail(url)} shape="rounded" size="md" />
          <div>
            <label className="text-xs text-white/40 mb-1 block">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-levav text-xs w-full" autoFocus />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-levav text-xs w-full">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="input-levav text-xs w-full resize-none" />
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between text-[10px] text-white/30">
              <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
              <span>Views: {item.views} · Likes: {item.likes}</span>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-2 p-5 border-t border-white/5 bg-[#0a0e1a]/90 backdrop-blur-xl">
          <button onClick={onClose} className="btn-outline text-xs">Cancel</button>
          <button onClick={handleSave} disabled={!title.trim()} className="btn-lime text-xs flex items-center gap-2 disabled:opacity-50"><CheckCircle2 className="w-3.5 h-3.5" /> Save Changes</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
