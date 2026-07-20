"use client";

import React from "react";

export type BlockType = "paragraph" | "heading" | "list";

interface Block {
  id: string;
  type: BlockType;
  content: string;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function parseBlocks(value: string): Block[] {
  if (!value) {
    return [{ id: generateId(), type: "paragraph", content: "" }];
  }

  const lines = value.split("\n");
  const blocks: Block[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("## ")) {
      blocks.push({ id: generateId(), type: "heading", content: trimmed.slice(3) });
    } else if (trimmed.startsWith("- ")) {
      blocks.push({ id: generateId(), type: "list", content: trimmed.slice(2) });
    } else {
      blocks.push({ id: generateId(), type: "paragraph", content: trimmed });
    }
  }

  return blocks.length > 0 ? blocks : [{ id: generateId(), type: "paragraph", content: "" }];
}

function serializeBlocks(blocks: Block[]): string {
  return blocks
    .map(block => {
      if (block.type === "heading") return `## ${block.content}`;
      if (block.type === "list") return `- ${block.content}`;
      return block.content;
    })
    .join("\n");
}

export function RichTextEditor({ value, onChange, label }: RichTextEditorProps) {
  const [blocks, setBlocks] = React.useState<Block[]>(() => parseBlocks(value));

  React.useEffect(() => {
    setBlocks(parseBlocks(value));
  }, [value]);

  const updateBlock = (id: string, content: string) => {
    const next = blocks.map(b => b.id === id ? { ...b, content } : b);
    setBlocks(next);
    onChange(serializeBlocks(next));
  };

  const addBlock = (afterId: string, type: BlockType = "paragraph") => {
    const index = blocks.findIndex(b => b.id === afterId);
    const newBlock: Block = { id: generateId(), type, content: "" };
    const next = [...blocks];
    next.splice(index + 1, 0, newBlock);
    setBlocks(next);
    onChange(serializeBlocks(next));
  };

  const removeBlock = (id: string) => {
    if (blocks.length === 1) return;
    const next = blocks.filter(b => b.id !== id);
    setBlocks(next);
    onChange(serializeBlocks(next));
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex(b => b.id === id);
    if (index < 0) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    setBlocks(next);
    onChange(serializeBlocks(next));
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-white/70 mb-3">{label}</label>}

      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div key={block.id} className="group relative">
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col gap-1">
              <button
                type="button"
                onClick={() => moveBlock(block.id, "up")}
                disabled={index === 0}
                className="text-white/30 hover:text-white text-xs disabled:opacity-30"
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveBlock(block.id, "down")}
                disabled={index === blocks.length - 1}
                className="text-white/30 hover:text-white text-xs disabled:opacity-30"
                title="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeBlock(block.id)}
                disabled={blocks.length === 1}
                className="text-red-400 hover:text-red-300 text-xs disabled:opacity-30"
                title="Delete"
              >
                ✕
              </button>
            </div>

            {block.type === "heading" ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-300 font-mono bg-emerald-300/10 px-2 py-1 rounded-lg flex-shrink-0">
                  H2
                </span>
                <input
                  type="text"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addBlock(block.id, "paragraph");
                    }
                  }}
                  placeholder="Heading..."
                  className="flex-1 bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-lg font-semibold text-white focus:outline-none focus:border-emerald-300 transition"
                />
              </div>
            ) : block.type === "list" ? (
              <div className="flex items-start gap-2">
                <span className="text-emerald-300 mt-2.5 select-none">•</span>
                <input
                  type="text"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addBlock(block.id, "list");
                    }
                  }}
                  placeholder="List item..."
                  className="flex-1 bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-300 transition"
                />
              </div>
            ) : (
              <textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addBlock(block.id, "paragraph");
                  }
                }}
                placeholder="Type something..."
                rows={2}
                className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-300 transition resize-y"
              />
            )}

            <div className="absolute -right-24 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1">
              {block.type !== "heading" && (
                <button
                  type="button"
                  onClick={() => {
                    const next = blocks.map(b => b.id === block.id ? { ...b, type: "heading" as BlockType } : b);
                    setBlocks(next);
                    onChange(serializeBlocks(next));
                  }}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-lg transition"
                  title="Make heading"
                >
                  H
                </button>
              )}
              {block.type !== "list" && (
                <button
                  type="button"
                  onClick={() => {
                    const next = blocks.map(b => b.id === block.id ? { ...b, type: "list" as BlockType } : b);
                    setBlocks(next);
                    onChange(serializeBlocks(next));
                  }}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-lg transition"
                  title="Make list item"
                >
                  •
                </button>
              )}
              {block.type !== "paragraph" && (
                <button
                  type="button"
                  onClick={() => {
                    const next = blocks.map(b => b.id === block.id ? { ...b, type: "paragraph" as BlockType } : b);
                    setBlocks(next);
                    onChange(serializeBlocks(next));
                  }}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-lg transition"
                  title="Make paragraph"
                >
                  ¶
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => {
            const newBlock: Block = { id: generateId(), type: "heading", content: "" };
            setBlocks([...blocks, newBlock]);
            onChange(serializeBlocks([...blocks, newBlock]));
          }}
          className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl transition"
        >
          + Heading
        </button>
        <button
          type="button"
          onClick={() => {
            const newBlock: Block = { id: generateId(), type: "paragraph", content: "" };
            setBlocks([...blocks, newBlock]);
            onChange(serializeBlocks([...blocks, newBlock]));
          }}
          className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl transition"
        >
          + Paragraph
        </button>
        <button
          type="button"
          onClick={() => {
            const newBlock: Block = { id: generateId(), type: "list", content: "" };
            setBlocks([...blocks, newBlock]);
            onChange(serializeBlocks([...blocks, newBlock]));
          }}
          className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl transition"
        >
          + List Item
        </button>
      </div>
    </div>
  );
}
