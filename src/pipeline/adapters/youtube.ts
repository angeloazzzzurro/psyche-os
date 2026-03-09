import * as path from "node:path";
import { SourceDocumentSchema } from "../ingest.js";
import type { SourceAdapter } from "./types.js";

export const youtubeAdapter: SourceAdapter = {
  id: "youtube",
  label: "YouTube Traces",
  sourceDir: "youtube",
  filePatterns: ["*.md"],

  canHandle(filePath: string): boolean {
    const parts = filePath.split(path.sep);
    return parts.includes("youtube") && filePath.endsWith(".md");
  },

  parse(filePath: string, raw: string) {
    const videoPattern = /\[.+?\]\(https?:\/\/www\.youtube\.com\/watch\?v=.+?\)/g;
    const playlistPattern = /^## (.+?) \((\d+) videos?\)/gm;

    const videos = raw.match(videoPattern) ?? [];
    const playlists: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = playlistPattern.exec(raw)) !== null) {
      playlists.push(match[1]!);
    }

    const id = `youtube_${path.basename(filePath, ".md")}_${Date.now()}`;

    return [
      SourceDocumentSchema.parse({
        id,
        sourcePath: filePath,
        sourceType: "markdown",
        sourceDir: "youtube",
        content: raw,
        metadata: {
          adapter: "youtube",
          videoCount: videos.length,
          playlists: playlists.length > 0 ? playlists : undefined,
          fileName: path.basename(filePath),
        },
      }),
    ];
  },
};
