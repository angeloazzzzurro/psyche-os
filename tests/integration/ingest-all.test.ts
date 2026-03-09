import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdtemp, writeFile, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ingestAll } from "../../src/pipeline/ingest.js";

describe("ingestAll integration", () => {
  let tempDir: string;

  beforeAll(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "psyche-test-"));

    // Claude source
    await mkdir(join(tempDir, "claude"), { recursive: true });
    await writeFile(
      join(tempDir, "claude", "session.jsonl"),
      [
        JSON.stringify({
          type: "user",
          sessionId: "s1",
          timestamp: "2026-03-01T10:00:00.000Z",
          message: {
            role: "user",
            content: [{ type: "text", text: "test message" }],
          },
        }),
        JSON.stringify({
          type: "assistant",
          sessionId: "s1",
          timestamp: "2026-03-01T10:00:05.000Z",
          message: {
            role: "assistant",
            content: [{ type: "text", text: "response" }],
          },
        }),
      ].join("\n")
    );

    // Codex source
    await mkdir(join(tempDir, "codex"), { recursive: true });
    await writeFile(
      join(tempDir, "codex", "session.jsonl"),
      [
        JSON.stringify({
          timestamp: "2026-03-01T10:00:00.000Z",
          type: "session_meta",
          payload: {
            id: "test-session",
            timestamp: "2026-03-01T10:00:00.000Z",
            cwd: "/tmp",
            cli_version: "0.1.0",
          },
        }),
        JSON.stringify({
          timestamp: "2026-03-01T10:00:01.000Z",
          type: "message",
          role: "user",
          content: "test codex message",
        }),
        JSON.stringify({
          timestamp: "2026-03-01T10:00:02.000Z",
          type: "message",
          role: "assistant",
          content: "codex response",
        }),
      ].join("\n")
    );

    // Twitter source
    await mkdir(join(tempDir, "twitter"), { recursive: true });
    await writeFile(
      join(tempDir, "twitter", "bookmarks.md"),
      "## AI (1 bookmarks)\n\n- [Test](https://x.com/u/status/1) — Test bookmark (2026-01-01)\n"
    );

    // YouTube source
    await mkdir(join(tempDir, "youtube"), { recursive: true });
    await writeFile(
      join(tempDir, "youtube", "playlists.md"),
      "## Tech (1 videos)\n\n- [abc](https://www.youtube.com/watch?v=abc) — 2026-01-01\n"
    );

    // OpenClaw source
    await mkdir(join(tempDir, "openclaw-local"), { recursive: true });
    await writeFile(
      join(tempDir, "openclaw-local", "agent.md"),
      "# Agent Config\n\n## Rules\n\n- Rule 1\n"
    );
  });

  afterAll(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it("ingests all source types and returns validated documents", async () => {
    const docs = await ingestAll(tempDir);

    expect(docs.length).toBeGreaterThanOrEqual(5);

    const adapters = docs.map((d) => d.metadata?.["adapter"]).filter(Boolean);
    expect(adapters).toContain("claude-code");
    expect(adapters).toContain("codex");
    expect(adapters).toContain("twitter");
    expect(adapters).toContain("youtube");
    expect(adapters).toContain("openclaw");
  });

  it("every document has required fields", async () => {
    const docs = await ingestAll(tempDir);
    for (const doc of docs) {
      expect(doc.id).toBeTruthy();
      expect(doc.sourcePath).toBeTruthy();
      expect(doc.sourceType).toBeTruthy();
      expect(doc.sourceDir).toBeTruthy();
      expect(doc.content).toBeTruthy();
    }
  });
});
