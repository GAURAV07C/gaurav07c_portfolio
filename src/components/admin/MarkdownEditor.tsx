"use client";

import React, { useState, useCallback } from "react";
import { ToolbarButton, ToolbarSeparator } from "@/components/admin/MarkdownToolbar";
import { MarkdownPreview } from "@/components/admin/MarkdownPreview";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: string;
}

type TabMode = "edit" | "split" | "preview";

function insertMarkdown(text: string, before: string, after: string = ""): string {
  if (typeof document === "undefined") return text;

  const textarea = document.querySelector(
    "textarea[data-md-editor]"
  ) as HTMLTextAreaElement | null;
  if (!textarea) return text;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = text.substring(start, end) || "text";
  const newText =
    text.substring(0, start) +
    before +
    selectedText +
    after +
    text.substring(end);

  return newText;
}

export function MarkdownEditor({
  value,
  onChange,
  label,
  placeholder,
  minHeight = "300px",
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<TabMode>("edit");

  const wrap = useCallback(
    (before: string, after: string = "") => {
      const next = insertMarkdown(value, before, after);
      onChange(next);
    },
    [value, onChange]
  );

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-white/70 mb-3">
          {label}
        </label>
      )}

      <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 bg-gray-950/50">
          <div className="flex items-center gap-1 p-2 flex-wrap">
            <ToolbarButton onClick={() => wrap("# ", "")} title="Heading 1">
              H1
            </ToolbarButton>
            <ToolbarButton onClick={() => wrap("## ", "")} title="Heading 2">
              H2
            </ToolbarButton>
            <ToolbarButton onClick={() => wrap("### ", "")} title="Heading 3">
              H3
            </ToolbarButton>
            <ToolbarSeparator />
            <ToolbarButton onClick={() => wrap("**", "**")} title="Bold">
              B
            </ToolbarButton>
            <ToolbarButton onClick={() => wrap("*", "*")} title="Italic">
              I
            </ToolbarButton>
            <ToolbarButton onClick={() => wrap("~~", "~~")} title="Strikethrough">
              S
            </ToolbarButton>
            <ToolbarSeparator />
            <ToolbarButton onClick={() => wrap("- ", "")} title="Bullet List">
              •
            </ToolbarButton>
            <ToolbarButton onClick={() => wrap("1. ", "")} title="Numbered List">
              1.
            </ToolbarButton>
            <ToolbarSeparator />
            <ToolbarButton onClick={() => wrap("[", "](url)")} title="Link">
              🔗
            </ToolbarButton>
            <ToolbarButton onClick={() => wrap("`", "`")} title="Inline Code">
              &lt;/&gt;
            </ToolbarButton>
            <ToolbarButton onClick={() => wrap("```\n", "\n```")} title="Code Block">
              {"{ }"}
            </ToolbarButton>
            <ToolbarSeparator />
            <ToolbarButton onClick={() => wrap("> ", "")} title="Quote">
              &quot;
            </ToolbarButton>
            <ToolbarButton onClick={() => wrap("---\n", "")} title="Horizontal Rule">
              —
            </ToolbarButton>
          </div>

          <div className="flex items-center gap-1 p-2">
            <ToolbarButton
              onClick={() => setMode("edit")}
              title="Edit"
              active={mode === "edit"}
            >
              Edit
            </ToolbarButton>
            <ToolbarButton
              onClick={() => setMode("split")}
              title="Split view"
              active={mode === "split"}
            >
              Split
            </ToolbarButton>
            <ToolbarButton
              onClick={() => setMode("preview")}
              title="Preview"
              active={mode === "preview"}
            >
              Preview
            </ToolbarButton>
          </div>
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns:
              mode === "split" ? "1fr 1fr" : "1fr",
          }}
        >
          {(mode === "edit" || mode === "split") && (
            <textarea
              data-md-editor="true"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || "Write markdown here..."}
              className="w-full bg-gray-900 text-white px-4 py-3 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-emerald-300/20 font-mono border-r border-white/10"
              style={{ minHeight }}
            />
          )}

          {(mode === "preview" || mode === "split") && (
            <div
              className="bg-gray-900/50 p-4 overflow-y-auto"
              style={{
                minHeight,
                maxHeight: "600px",
              }}
            >
              <MarkdownPreview content={value} className="text-white/70 text-base leading-relaxed" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
