/**
 * ============================================================
 * SOCIAL FEED PAGE — Community Hub
 * ============================================================
 * Talent community feed with posts, likes, and comments.
 * Glass architecture with neon lime accent interactions.
 * ============================================================
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { demoFeedPosts } from "@/lib/demo-data";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import {
  Heart,
  MessageCircle,
  Send,
  Trophy,
  Award,
  BookOpen,
  UserPlus,
  Loader2,
  Zap,
} from "lucide-react";

/* ─── Post Type Badge ─── */
function PostTypeBadge({ type }: { type: string }) {
  const config: Record<string, { icon: React.ElementType; color: string; label: string }> = {
    achievement: { icon: Trophy, color: "#C6FF34", label: "Achievement" },
    milestone: { icon: Award, color: "#7E3BED", label: "Milestone" },
    course_complete: { icon: BookOpen, color: "#3B82F6", label: "Course Complete" },
    peer_endorsement: { icon: UserPlus, color: "#F59E0B", label: "Endorsement" },
    update: { icon: Zap, color: "#10B981", label: "Update" },
  };
  const c = config[type] ?? config.update;
  const Icon = c.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{ backgroundColor: `${c.color}15`, color: c.color }}
    >
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

/* ─── Post Card ─── */
function PostCard({
  post,
}: {
  post: {
    id: number;
    content: string;
    postType: string;
    likeCount: number;
    commentCount: number;
    createdAt: Date | string | null;
    profileName: string;
    profileAvatar: string | null;
    profession: string | null;
  };
}) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const utils = trpc.useUtils();

  const { data: commentsList } = trpc.feed.comments.useQuery(
    { postId: post.id },
    { enabled: showComments },
  );

  const toggleLike = trpc.feed.toggleLike.useMutation({
    onSuccess: () => {
      utils.feed.list.invalidate();
    },
  });

  const commentMutation = trpc.feed.comment.useMutation({
    onSuccess: () => {
      setCommentText("");
      utils.feed.comments.invalidate({ postId: post.id });
      utils.feed.list.invalidate();
      toast.success("Comment posted!");
    },
  });

  const timeStr = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <GlassCard className="p-4" glow={false}>
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#7E3BED]/20 flex items-center justify-center shrink-0">
          {post.profileAvatar ? (
            <img
              src={post.profileAvatar}
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-[#7E3BED]">
              {(post.profileName ?? "?")[0]?.toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white/90 truncate">
            {post.profileName}
          </p>
          <div className="flex items-center gap-2">
            <PostTypeBadge type={post.postType} />
            <span className="text-[10px] text-white/30">{timeStr}</span>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-sm text-white/70 leading-relaxed mb-4">
        {post.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-white/5">
        <button
          onClick={() => toggleLike.mutate({ postId: post.id })}
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#C6FF34] transition-colors"
        >
          <Heart className="w-4 h-4" />
          {post.likeCount}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#7E3BED] transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          {post.commentCount}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 pt-3 border-t border-white/5"
        >
          {/* Comment List */}
          <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
            {commentsList?.length === 0 && (
              <p className="text-xs text-white/30 text-center py-2">
                No comments yet. Be the first!
              </p>
            )}
            {commentsList?.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-[10px] font-bold text-white/50">
                  {(comment.profileName ?? "?")[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white/60">
                    {comment.profileName}
                  </p>
                  <p className="text-xs text-white/40">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#7E3BED]/30"
              onKeyDown={(e) => {
                if (e.key === "Enter" && commentText.trim()) {
                  commentMutation.mutate({
                    postId: post.id,
                    content: commentText.trim(),
                  });
                }
              }}
            />
            <button
              onClick={() => {
                if (commentText.trim()) {
                  commentMutation.mutate({
                    postId: post.id,
                    content: commentText.trim(),
                  });
                }
              }}
              disabled={!commentText.trim() || commentMutation.isPending}
              className="p-2 rounded-lg bg-[#7E3BED] text-white hover:bg-[#7E3BED]/80 transition-colors disabled:opacity-30"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </GlassCard>
  );
}

/* ─── Main Feed Page ─── */
export default function SocialFeedPage() {
  const { isDemoMode } = useDemoAuth();
  const { isAuthenticated } = useAuth();
  const [newPost, setNewPost] = useState("");
  const utils = trpc.useUtils();

  const { data: postsQuery, isLoading } = trpc.feed.list.useQuery(undefined, {
    enabled: !isDemoMode,
    refetchInterval: 30000,
  });
  const posts = isDemoMode ? demoFeedPosts : (postsQuery ?? []);

  const createPost = trpc.feed.create.useMutation({
    onSuccess: () => {
      setNewPost("");
      utils.feed.list.invalidate();
      toast.success("Post shared!");
    },
  });

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    createPost.mutate({
      content: newPost.trim(),
      postType: "update",
    });
  };

  return (
    <div className="levav-container pt-6 pb-24 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-2">Community Feed</h1>
        <p className="text-sm text-white/50 mb-6">
          Celebrate wins, share milestones, endorse peers.
        </p>

        {/* Create Post */}
        {isAuthenticated && (
          <GlassCard className="p-4 mb-6" glow={false}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C6FF34]/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-[#C6FF34]" />
              </div>
              <input
                type="text"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share an achievement or update..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C6FF34]/30"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newPost.trim()) handleCreatePost();
                }}
              />
              <button
                onClick={handleCreatePost}
                disabled={!newPost.trim() || createPost.isPending}
                className="p-2.5 rounded-xl bg-[#C6FF34] text-black hover:shadow-lime disabled:opacity-30 transition-all"
              >
                {createPost.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </GlassCard>
        )}

        {/* Posts Feed */}
        {isLoading && !isDemoMode ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-[#C6FF34]" />
          </div>
        ) : !posts || posts.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <Trophy className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/60 mb-1">No posts yet</p>
            <p className="text-xs text-white/40">
              Be the first to share your Levav™ journey!
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
