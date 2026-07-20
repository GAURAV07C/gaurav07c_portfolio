"use client";

import React from "react";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

function renderInlineMarkdown(text: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let partIndex = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/^\*(.+?)\*/);
    const codeMatch = remaining.match(/^`(.+?)`/);
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);

    if (boldMatch) {
      parts.push(<strong key={`${keyPrefix}-${partIndex++}`} className="font-semibold text-white">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
    } else if (italicMatch) {
      parts.push(<em key={`${keyPrefix}-${partIndex++}`} className="italic">{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch[0].length);
    } else if (codeMatch) {
      parts.push(
        <code key={`${keyPrefix}-${partIndex++}`} className="bg-gray-950 px-2 py-1 rounded text-sm font-mono text-emerald-300">
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
    } else if (linkMatch) {
      parts.push(
        <a
          key={`${keyPrefix}-${partIndex++}`}
          href={linkMatch[2]}
          className="text-emerald-300 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
    } else {
      const nextSpecial = remaining.search(/[*`\[]/);
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

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-3xl font-serif text-white mt-8 mb-4">
          {trimmed.slice(2)}
        </h1>
      );
      i++;
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-serif text-white mt-8 mb-4">
          {trimmed.slice(3)}
        </h2>
      );
      i++;
    } else if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-xl font-semibold text-white mt-6 mb-3">
          {trimmed.slice(4)}
        </h3>
      );
      i++;
    } else if (trimmed.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`list-${i}`} className="space-y-2 mb-6">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-3 text-white/70 text-lg">
              <span className="text-emerald-300 flex-shrink-0">•</span>
              <span>{renderInlineMarkdown(item, `li-${i}-${idx}`)}</span>
            </li>
          ))}
        </ul>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-2 mb-6 list-decimal list-inside">
          {items.map((item, idx) => (
            <li key={idx} className="text-white/70 text-lg">
              {renderInlineMarkdown(item, `ol-${i}-${idx}`)}
            </li>
          ))}
        </ol>
      );
    } else if (trimmed.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={`code-${i}`}
          className="bg-gray-950 border border-white/10 rounded-xl p-4 mb-6 overflow-x-auto"
        >
          <code className="text-sm text-white/80 font-mono">{codeLines.join("\n")}</code>
        </pre>
      );
      i++;
    } else if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-4 border-emerald-300/50 pl-4 italic text-white/60 mb-6"
        >
          {quoteLines.join("\n")}
        </blockquote>
      );
    } else if (trimmed === "---") {
      elements.push(<hr key={`hr-${i}`} className="border-white/10 my-8" />);
      i++;
    } else {
      elements.push(
        <p key={i} className="text-white/70 text-lg leading-relaxed mb-4">
          {renderInlineMarkdown(trimmed, `p-${i}`)}
        </p>
      );
      i++;
    }
  }

  return <div className={className}>{elements}</div>;
}
