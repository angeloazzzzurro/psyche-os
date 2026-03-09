import * as path from "node:path";
import { SourceDocumentSchema } from "../ingest.js";
import type { SourceAdapter } from "./types.js";

const OPENCLAW_DIRS = ["openclaw-local", "openclaw-m1"] as const;

function detectVariant(filePath: string): "local" | "m1" | "unknown" {
  if (filePath.includes("openclaw-local")) return "local";
  if (filePath.includes("openclaw-m1")) return "m1";
  return "unknown";
}

function extractHeadings(content: string): string[] {
  const headingPattern = /^#{1,4} (.+)$/gm;
  const headings: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingPattern.exec(content)) !== null) {
    headings.push(match[1]!);
  }

  return headings;
}

export const openclawAdapter: SourceAdapter = {
  id: "openclaw",
  label: "OpenClaw Knowledge Base",
  sourceDir: "openclaw-local",
  filePatterns: ["*.md"],

  canHandle(filePath: string): boolean {
    const parts = filePath.split(path.sep);
    return (
      OPENCLAW_DIRS.some((dir) => parts.includes(dir)) &&
      filePath.endsWith(".md")
    );
  },

  parse(filePath: string, raw: string) {
    const variant = detectVariant(filePath);
    const headings = extractHeadings(raw);
    const sourceDir = variant === "m1" ? "openclaw-m1" : "openclaw-local";

    const id = `openclaw_${variant}_${path.basename(filePath, ".md")}_${Date.now()}`;

    return [
      SourceDocumentSchema.parse({
        id,
        sourcePath: filePath,
        sourceType: "markdown",
        sourceDir,
        content: raw,
        metadata: {
          adapter: "openclaw",
          variant,
          headings,
          fileName: path.basename(filePath),
        },
      }),
    ];
  },
};
