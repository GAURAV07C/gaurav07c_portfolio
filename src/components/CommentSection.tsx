"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { CommentUserModal } from "@/components/CommentUserModal";

interface Comment {
  id: string;
  content: string;
  name: string;
  email: string;
  parentId: string | null;
  replies?: Comment[];
  createdAt: string;
}

interface CommentSectionProps {
  blogId?: string;
  projectId?: string;
}

function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("commentUser");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function CommentItem({
  comment,
  depth = 0,
  onReply,
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent,
  submitting,
  setSubmitting,
  currentUser,
}: {
  comment: Comment;
  depth?: number;
  onReply: (parentId: string, content: string, name: string, email: string) => Promise<void>;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyContent: string;
  setReplyContent: (v: string) => void;
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
  currentUser: { name: string; email: string } | null;
}) {
  const [showReplies, setShowReplies] = useState(true);
  const isReplying = replyingTo === comment.id;

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !currentUser) return;
    setSubmitting(true);
    try {
      await onReply(comment.id, replyContent.trim(), currentUser.name, currentUser.email);
      setReplyContent("");
      setReplyingTo(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${depth > 0 ? "ml-8 mt-4 border-l-2 border-white/10 pl-4" : "mb-6"}`}>
      <div className="bg-gray-950 border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-300/20 text-emerald-300 flex items-center justify-center text-sm font-semibold">
            {comment.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-white font-medium text-sm">{comment.name}</div>
            <div className="text-white/40 text-xs">{comment.email}</div>
          </div>
          <div className="ml-auto text-white/30 text-xs">
            {new Date(comment.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
        <p className="text-white/70 text-base leading-relaxed whitespace-pre-wrap">{comment.content}</p>
        <div className="mt-3 flex items-center gap-4">
          <button
            onClick={() => {
              if (isReplying) {
                setReplyingTo(null);
              } else {
                setReplyingTo(comment.id);
              }
            }}
            className="text-xs text-emerald-300 hover:text-emerald-400 transition-colors font-medium"
          >
            {isReplying ? "Cancel Reply" : "Reply"}
          </button>
          {comment.replies && comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              {showReplies ? "Hide" : "Show"} {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>
      </div>

      {isReplying && (
        <form onSubmit={handleReplySubmit} className="mt-4 ml-4 bg-gray-900 border border-white/10 rounded-xl p-4">
          <div className="mb-3">
            <label className="block text-xs text-white/50 mb-1.5 font-medium">Reply</label>
            <MarkdownEditor
              value={replyContent}
              onChange={setReplyContent}
              placeholder="Write a reply..."
              minHeight="150px"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !currentUser}
              className="bg-emerald-300 hover:bg-emerald-400 text-gray-950 font-semibold text-sm px-4 py-2 rounded-lg transition-all disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post Reply"}
            </button>
          </div>
        </form>
      )}

      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              submitting={submitting}
              setSubmitting={setSubmitting}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentSection({ blogId, projectId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser && storedUser.name && storedUser.email) {
      setCurrentUser(storedUser);
    } else {
      setShowUserModal(true);
    }
  }, []);

  const fetchComments = useCallback(async () => {
    if (!blogId && !projectId) return;
    setLoading(true);
    try {
      const url = new URL("/api/comments", window.location.origin);
      if (blogId) url.searchParams.set("blogId", blogId);
      if (projectId) url.searchParams.set("projectId", projectId);
      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [blogId, projectId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleUserSave = (name: string, email: string) => {
    setCurrentUser({ name, email });
    setShowUserModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUser) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          name: currentUser.name,
          email: currentUser.email,
          blogId,
          projectId,
        }),
      });
      if (res.ok) {
        setContent("");
        fetchComments();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: string, replyContentText: string, replyNameText: string, replyEmailText: string) => {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: replyContentText,
        name: replyNameText,
        email: replyEmailText,
        blogId,
        projectId,
        parentId,
      }),
    });
    if (res.ok) {
      fetchComments();
    }
    return Promise.resolve();
  };

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-serif text-white mb-6">
        Comments ({comments.length})
      </h3>

      {currentUser && (
        <form onSubmit={handleSubmit} className="mb-10 bg-gray-950 border border-white/10 rounded-xl p-6">
          <div className="mb-4">
            <label className="block text-xs text-white/50 mb-1.5 font-medium">Comment</label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="Share your thoughts..."
              minHeight="200px"
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-white/40">
              Commenting as <span className="text-emerald-300 font-medium">{currentUser.name}</span> ({currentUser.email})
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-300 hover:bg-emerald-400 text-gray-950 font-semibold text-sm px-5 py-2.5 rounded-lg transition-all disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center text-white/50 py-8">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center text-white/40 py-8 border border-dashed border-white/10 rounded-xl">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-1">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              depth={0}
              onReply={handleReply}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              submitting={submitting}
              setSubmitting={setSubmitting}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}

      <CommentUserModal
        isOpen={showUserModal}
        onSave={handleUserSave}
      />
    </div>
  );
}
