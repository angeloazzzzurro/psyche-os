import { describe, it, expect } from "vitest";
import { defaultRegistry } from "../../../src/pipeline/adapters/index.js";

describe("defaultRegistry", () => {
  it("has all 5 adapters registered", () => {
    const adapters = defaultRegistry.all();
    const ids = adapters.map((a) => a.id).sort();
    expect(ids).toEqual([
      "claude-code",
      "codex",
      "openclaw",
      "twitter",
      "youtube",
    ]);
  });

  it("routes claude files to claude-code adapter", () => {
    const adapter = defaultRegistry.findAdapter("/sources/claude/session.jsonl");
    expect(adapter?.id).toBe("claude-code");
  });

  it("routes codex files to codex adapter", () => {
    const adapter = defaultRegistry.findAdapter("/sources/codex/session.jsonl");
    expect(adapter?.id).toBe("codex");
  });

  it("routes twitter files to twitter adapter", () => {
    const adapter = defaultRegistry.findAdapter("/sources/twitter/bookmarks.md");
    expect(adapter?.id).toBe("twitter");
  });

  it("routes youtube files to youtube adapter", () => {
    const adapter = defaultRegistry.findAdapter("/sources/youtube/playlists.md");
    expect(adapter?.id).toBe("youtube");
  });

  it("routes openclaw files to openclaw adapter", () => {
    const adapter = defaultRegistry.findAdapter("/sources/openclaw-local/atlas.md");
    expect(adapter?.id).toBe("openclaw");
    const m1 = defaultRegistry.findAdapter("/sources/openclaw-m1/ryo-brain/file.md");
    expect(m1?.id).toBe("openclaw");
  });
});
