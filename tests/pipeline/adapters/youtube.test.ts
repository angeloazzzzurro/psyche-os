import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { youtubeAdapter } from "../../../src/pipeline/adapters/youtube.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(
  resolve(__dirname, "../../fixtures/youtube-sample.md"),
  "utf-8"
);

describe("youtubeAdapter", () => {
  it("has correct id and sourceDir", () => {
    expect(youtubeAdapter.id).toBe("youtube");
    expect(youtubeAdapter.sourceDir).toBe("youtube");
  });

  it("canHandle markdown files in youtube/ directory", () => {
    expect(youtubeAdapter.canHandle("/sources/youtube/playlists.md")).toBe(true);
    expect(youtubeAdapter.canHandle("/sources/twitter/bookmarks.md")).toBe(false);
  });

  it("parses playlists with video count and categories", () => {
    const docs = youtubeAdapter.parse("/sources/youtube/playlists.md", fixture);
    expect(docs).toHaveLength(1);
    expect(docs[0]!.metadata!["adapter"]).toBe("youtube");
    expect(docs[0]!.metadata!["videoCount"]).toBe(3);
    expect(docs[0]!.metadata!["playlists"]).toEqual(["AI", "Music"]);
  });
});
