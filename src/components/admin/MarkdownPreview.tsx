"use client";

import React, { useMemo } from "react";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const BLOCK_RE = /^(#{1,3})\s+(.+)$/;
const LIST_RE = /^(\s*)[-*]\s+(.+)$/;
const NUMBERED_RE = /^(\s*)\d+\.\s+(.+)$/;
const CODE_FENCE_RE = /^```/;
const QUOTE_RE = /^>\s?(.*)$/;
const HR_RE = /^---$/;

function parseBlock(line: string) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const headingMatch = trimmed.match(BLOCK_RE);
  if (headingMatch) {
    const level = headingMatch[1].length;
    const text = headingMatch[2];
    if (level === 1) return { type: "h1", text };
    if (level === 2) return { type: "h2", text };
    return { type: "h3", text };
  }

  if (CODE_FENCE_RE.test(trimmed)) return { type: "code-fence", text: trimmed };
  if (HR_RE.test(trimmed)) return { type: "hr" };

  const quoteMatch = trimmed.match(QUOTE_RE);
  if (quoteMatch) return { type: "quote", text: quoteMatch[1] };

  const listMatch = trimmed.match(LIST_RE);
  if (listMatch) return { type: "list", text: listMatch[2], indent: listMatch[1].length };

  const numberedMatch = trimmed.match(NUMBERED_RE);
  if (numberedMatch) return { type: "numbered", text: numberedMatch[2], indent: numberedMatch[1].length };

  return { type: "paragraph", text: trimmed };
}

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let partIndex = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/^\*(.+?)\*/);
    const codeMatch = remaining.match(/^`(.+?)`/);

    if (boldMatch) {
      parts.push(
        <strong key={`${keyPrefix}-${partIndex++}`} className="font-semibold text-white">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
    } else if (italicMatch) {
      parts.push(
        <em key={`${keyPrefix}-${partIndex++}`} className="italic">
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
    } else if (codeMatch) {
      parts.push(
        <code
          key={`${keyPrefix}-${partIndex++}`}
          className="bg-gray-950 px-2 py-1 rounded text-sm font-mono text-emerald-300"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
    } else {
      const nextSpecial = remaining.search(/[*`]/);
      if (nextSpecial === -1) {
        parts.push(remaining);
        break;
      }
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return parts;
}

export function MarkdownPreview({ content, className = "" }: MarkdownPreviewProps) {
  const elements = useMemo(() => {
    if (!content) return [];

    const lines = content.split("\n");
    const items: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const trimmed = lines[i].trim();

      if (!trimmed) {
        i++;
        continue;
      }

      const block = parseBlock(lines[i]);
      if (!block) {
        i++;
        continue;
      }

      if (block.type === "h1") {
        items.push(
          <h1 key={i} className="text-3xl font-serif text-white mt-8 mb-4">
            {block.text}
          </h1>
        );
        i++;
      } else if (block.type === "h2") {
        items.push(
          <h2 key={i} className="text-2xl font-serif text-white mt-8 mb-4">
            {block.text}
          </h2>
        );
        i++;
      } else if (block.type === "h3") {
        items.push(
          <h3 key={i} className="text-xl font-semibold text-white mt-6 mb-3">
            {block.text}
          </h3>
        );
        i++;
      } else if (block.type === "hr") {
        items.push(<hr key={i} className="border-white/10 my-8" />);
        i++;
      } else if (block.type === "code-fence") {
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !CODE_FENCE_RE.test(lines[i].trim())) {
          codeLines.push(lines[i]);
          i++;
        }
        items.push(
          <pre
            key={`code-${i}`}
            className="bg-gray-950 border border-white/10 rounded-xl p-4 mb-6 overflow-x-auto"
          >
            <code className="text-sm text-white/80 font-mono">{codeLines.join("\n")}</code>
          </pre>
        );
        i++;
      } else if (block.type === "quote") {
        const quoteLines: string[] = [block.text ?? ""];
        i++;
        while (i < lines.length && lines[i].trim().startsWith(">")) {
          quoteLines.push(lines[i].trim().slice(2));
          i++;
        }
        items.push(
          <blockquote
            key={`quote-${i}`}
            className="border-l-4 border-emerald-300/50 pl-4 italic text-white/60 mb-6"
          >
            {quoteLines.join("\n")}
          </blockquote>
        );
      } else if (block.type === "list" || block.type === "numbered") {
        const listItems: string[] = [block.text ?? ""];
        const listType = block.type;
        i++;
        while (i < lines.length) {
          const next = parseBlock(lines[i]);
          if (next && (next.type === listType)) {
            listItems.push(next.text ?? "");
            i++;
          } else {
            break;
          }
        }
        if (listType === "list") {
          items.push(
            <ul key={`list-${i}`} className="space-y-2 mb-6 list-disc list-inside">
              {listItems.map((item, idx) => (
                <li key={idx} className="text-white/70 text-lg">
                  {renderInline(item, `li-${i}-${idx}`)}
                </li>
              ))}
            </ul>
          );
        } else {
          items.push(
            <ol key={`ol-${i}`} className="space-y-2 mb-6 list-decimal list-inside">
              {listItems.map((item, idx) => (
                <li key={idx} className="text-white/70 text-lg">
                  {renderInline(item, `ol-${i}-${idx}`)}
                </li>
              ))}
            </ol>
          );
        }
      } else {
        items.push(
          <p key={i} className="text-white/70 text-lg leading-relaxed mb-4">
            {renderInline(trimmed, `p-${i}`)}
          </p>
        );
        i++;
      }
    }

    return items;
  }, [content]);

  if (!content) {
    return (
      <div className={`text-white/40 italic ${className}`}>
        Nothing to preview
      </div>
    );
  }

  return <div className={className}>{elements}</div>;
}

