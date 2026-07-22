import { NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";

function stripMarkdown(value: string): string {
  return value
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*[-•*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/!\[(.+?)\]\(.+?\)/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sanitizeString(value: unknown): string {
  return typeof value === "string" ? stripMarkdown(value) : String(value);
}

function sanitizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(item => sanitizeString(item));
}

const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.3,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawData = body.rawData || body.description || "";

    if (!rawData || typeof rawData !== "string") {
      return NextResponse.json({ error: "rawData is required" }, { status: 400 });
    }

    const prompt = `You are a professional portfolio assistant. Analyze the provided raw project data and generate a structured JSON object matching this exact Prisma schema:

{
  "company": "string",
  "year": "string (YYYY)",
  "title": "string",
  "slug": "string (kebab-case)",
  "description": "string (100-300 words)",
  "results": "JSON array of plain strings (6-10 bullet points)",
  "features": "JSON array of plain strings (10-20 items)",
  "challenges": "JSON array of plain strings (5-8 items)",
  "outcomes": "JSON array of plain strings (5-8 items)",
  "techStack": "JSON array of plain strings",
  "tags": "JSON array of plain strings",
  "liveLink": "string or empty",
  "sourceLink": "string or empty",
  "demoLink": "string or empty",
  "image": "string (placeholder path like /images/project.png)",
  "isRecent": "boolean"
}

Rules:
- All array fields (results, features, challenges, outcomes, techStack, tags) MUST use plain string arrays. Do NOT use [{title:"..."}] objects.
- IMPORTANT: Write all text in plain text only. Do NOT use markdown formatting in any string values. No bold, italics, headers, lists, links, or code blocks. Just plain sentences.
- Never hallucinate. If information is missing, infer only from visible evidence or write "Not specified".
- Output MUST be valid JSON only. No markdown, no code blocks.
- Slug must be lowercase kebab-case derived from title.
- TechStack items should be clean framework/library names.
- Results, features, challenges, outcomes must be arrays of plain strings.
- Description must be portfolio-ready, professional, ATS-friendly.
- If year is not in the data, use current year.
- isRecent should be true if year is current or previous year.
- Example results: ["Built a production-ready platform", "Designed responsive UI"]
- Example features: ["User authentication", "Real-time chat", "Dashboard analytics"]

Raw Project Data:
${rawData}`;

    const response = await groq.invoke(prompt);
    const content = response.content as string;

    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) {
        return NextResponse.json(
          { error: "AI response was not valid JSON", raw: content },
          { status: 500 }
        );
      }
      parsed = JSON.parse(match[0]);
    }

    const safe = {
      company: sanitizeString(parsed.company || "Project"),
      year: sanitizeString(parsed.year || new Date().getFullYear().toString()),
      title: sanitizeString(parsed.title || "Untitled Project"),
      slug: sanitizeString(
        parsed.slug ||
          (typeof parsed.title === "string"
            ? parsed
                .title.toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")
            : "untitled-project")
      ),
      description: sanitizeString(parsed.description || ""),
      results: JSON.stringify(sanitizeStringArray(parsed.results)),
      features: JSON.stringify(sanitizeStringArray(parsed.features)),
      challenges: JSON.stringify(sanitizeStringArray(parsed.challenges)),
      outcomes: JSON.stringify(sanitizeStringArray(parsed.outcomes)),
      techStack: JSON.stringify(sanitizeStringArray(parsed.techStack)),
      tags: JSON.stringify(sanitizeStringArray(parsed.tags)),
      liveLink: sanitizeString(parsed.liveLink || ""),
      sourceLink: sanitizeString(parsed.sourceLink || ""),
      demoLink: sanitizeString(parsed.demoLink || ""),
      image: sanitizeString(parsed.image || "/images/project.png"),
      isRecent: parsed.isRecent === true,
      skills: Array.isArray(parsed.skills)
        ? parsed.skills.map((s: unknown) => ({
            title: sanitizeString((s as { title?: string })?.title || ""),
          }))
        : [],
    };

    return NextResponse.json(safe, { status: 200 });
  } catch (error) {
    console.error("POST /api/ai/generate-project error:", error);
    const message = error instanceof Error ? error.message : "AI generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
