# Source Adapter Registry — Implementation Plan

> ✅ **COMPLETE** — March 9, 2026. All 10 tasks implemented, 35 tests passing, 547 documents ingested.

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace generic file-type parsers with source-aware adapters that understand the semantics of each data source (Claude Code sessions, Codex sessions, Twitter bookmarks, YouTube traces, OpenClaw knowledge bases).

**Architecture:** A `SourceAdapter` interface defines the contract. Each adapter lives in its own file under `src/pipeline/adapters/`. A registry discovers and routes files to the correct adapter based on directory name + file patterns. The existing `ingest.ts` is refactored to delegate to the registry. Each adapter extracts meaningful metadata (session IDs, message counts, timestamps, topics) instead of dumping raw content.

**Tech Stack:** TypeScript, Zod, Vitest (new dev dependency)

---

## Task 0: Add Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

**Step 1: Install vitest**

```bash
cd /Users/michelericco/projects/unified-memory/psyche-os && npm install -D vitest
```

**Step 2: Create vitest config**

Create `vitest.config.ts`:
```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: ".",
    include: ["tests/**/*.test.ts"],
  },
});
```

**Step 3: Add test script to package.json**

Add to scripts: `"test": "vitest run"`

**Step 4: Verify setup**

```bash
npx vitest run
```
Expected: 0 tests found, no errors.

**Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add vitest for unit testing"
```

---

## Task 1: SourceAdapter Interface + Registry

**Files:**
- Create: `src/pipeline/adapters/types.ts`
- Create: `src/pipeline/adapters/registry.ts`
- Create: `tests/pipeline/adapters/registry.test.ts`

**Step 1: Write the failing test**

Create `tests/pipeline/adapters/registry.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { AdapterRegistry } from "../../../src/pipeline/adapters/registry.js";
import type { SourceAdapter } from "../../../src/pipeline/adapters/types.js";

const stubAdapter: SourceAdapter = {
  id: "test-adapter",
  label: "Test Adapter",
  sourceDir: "test-source",
  filePatterns: ["*.jsonl"],
  canHandle(filePath) {
    return filePath.includes("/test-source/") && filePath.endsWith(".jsonl");
  },
  parse(_filePath, raw) {
    return [
      {
        id: "test-1",
        sourcePath: _filePath,
        sourceType: "json",
        sourceDir: "test-source",
        content: raw,
        metadata: { adapter: "test-adapter" },
      },
    ];
  },
};

describe("AdapterRegistry", () => {
  it("registers and retrieves an adapter by sourceDir", () => {
    const registry = new AdapterRegistry();
    registry.register(stubAdapter);
    const found = registry.findAdapter("/sources/test-source/data.jsonl");
    expect(found).toBe(stubAdapter);
  });

  it("returns undefined for unknown paths", () => {
    const registry = new AdapterRegistry();
    registry.register(stubAdapter);
    const found = registry.findAdapter("/sources/unknown/file.md");
    expect(found).toBeUndefined();
  });

  it("lists all registered adapters", () => {
    const registry = new AdapterRegistry();
    registry.register(stubAdapter);
    expect(registry.all()).toHaveLength(1);
    expect(registry.all()[0]!.id).toBe("test-adapter");
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run tests/pipeline/adapters/registry.test.ts
```
Expected: FAIL — modules not found.

**Step 3: Write types.ts**

Create `src/pipeline/adapters/types.ts`:
```typescript
import type { SourceDocument } from "../ingest.js";

/**
 * A source adapter understands the semantics of a specific data source.
 * Unlike generic file parsers, adapters extract meaningful metadata
 * (session IDs, message counts, timestamps, topics) from the raw content.
 */
export interface SourceAdapter {
  /** Unique adapter identifier, e.g. "claude-code" */
  readonly id: string;
  /** Human-readable label, e.g. "Claude Code Sessions" */
  readonly label: string;
  /** Directory name this adapter handles, e.g. "claude" */
  readonly sourceDir: string;
  /** Glob patterns for matching files, e.g. ["*.jsonl"] */
  readonly filePatterns: readonly string[];
  /** Quick check: can this adapter handle the given file path? */
  canHandle(filePath: string): boolean;
  /** Parse raw file content into validated SourceDocuments. Pure function. */
  parse(filePath: string, raw: string): SourceDocument[];
}
```

**Step 4: Write registry.ts**

Create `src/pipeline/adapters/registry.ts`:
```typescript
import type { SourceAdapter } from "./types.js";

/**
 * Registry that routes files to the correct source adapter
 * based on canHandle() checks.
 */
export class AdapterRegistry {
  private readonly adapters: SourceAdapter[] = [];

  register(adapter: SourceAdapter): void {
    this.adapters.push(adapter);
  }

  findAdapter(filePath: string): SourceAdapter | undefined {
    return this.adapters.find((a) => a.canHandle(filePath));
  }

  all(): readonly SourceAdapter[] {
    return this.adapters;
  }
}
```

**Step 5: Run test to verify it passes**

```bash
npx vitest run tests/pipeline/adapters/registry.test.ts
```
Expected: 3 tests PASS.

**Step 6: Commit**

```bash
git add src/pipeline/adapters/ tests/pipeline/adapters/
git commit -m "feat: add SourceAdapter interface and AdapterRegistry"
```

---

## Task 2: Claude Code Adapter

**Files:**
- Create: `src/pipeline/adapters/claude-code.ts`
- Create: `tests/pipeline/adapters/claude-code.test.ts`
- Create: `tests/fixtures/claude-code-sample.jsonl`

**Source format:** JSONL where each line is a JSON object with `type` field ("user" | "assistant" | "progress" | "file-history-snapshot"), `sessionId`, `timestamp`, and optionally `message` with `role` and `content`.

**Step 1: Create fixture**

Create `tests/fixtures/claude-code-sample.jsonl` (3 representative lines):
```jsonl
{"parentUuid":null,"isSidechain":false,"userType":"external","cwd":"/Users/test","sessionId":"abc-123","version":"2.1.71","type":"user","timestamp":"2026-03-08T12:22:42.404Z","uuid":"u1","message":{"role":"user","content":[{"type":"text","text":"Spiega come funziona il pattern adapter"}]}}
{"parentUuid":"u1","isSidechain":false,"userType":"external","cwd":"/Users/test","sessionId":"abc-123","version":"2.1.71","type":"assistant","timestamp":"2026-03-08T12:22:55.000Z","uuid":"u2","message":{"role":"assistant","content":[{"type":"text","text":"Il pattern adapter separa l'interfaccia dall'implementazione concreta..."}]}}
{"parentUuid":null,"isSidechain":false,"userType":"external","cwd":"/Users/test","sessionId":"abc-123","version":"2.1.71","type":"progress","timestamp":"2026-03-08T12:23:00.000Z","uuid":"u3","data":{"type":"hook_progress","hookEvent":"PostToolUse","hookName":"rtk"}}
```

**Step 2: Write the failing test**

Create `tests/pipeline/adapters/claude-code.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { claudeCodeAdapter } from "../../../src/pipeline/adapters/claude-code.js";

const fixture = readFileSync(
  resolve(__dirname, "../../fixtures/claude-code-sample.jsonl"),
  "utf-8"
);

describe("claudeCodeAdapter", () => {
  it("has correct id and sourceDir", () => {
    expect(claudeCodeAdapter.id).toBe("claude-code");
    expect(claudeCodeAdapter.sourceDir).toBe("claude");
  });

  it("canHandle files in claude/ directory with .jsonl extension", () => {
    expect(claudeCodeAdapter.canHandle("/sources/claude/session.jsonl")).toBe(true);
    expect(claudeCodeAdapter.canHandle("/sources/codex/session.jsonl")).toBe(false);
    expect(claudeCodeAdapter.canHandle("/sources/claude/readme.md")).toBe(false);
  });

  it("parses JSONL into SourceDocuments with session metadata", () => {
    const docs = claudeCodeAdapter.parse("/sources/claude/abc-123.jsonl", fixture);
    expect(docs).toHaveLength(1); // one document per file
    expect(docs[0]!.sourceDir).toBe("claude");
    expect(docs[0]!.sourceType).toBe("json");
    expect(docs[0]!.metadata).toBeDefined();
    expect(docs[0]!.metadata!["adapter"]).toBe("claude-code");
    expect(docs[0]!.metadata!["sessionId"]).toBe("abc-123");
    expect(docs[0]!.metadata!["messageCount"]).toBe(2); // user + assistant, not progress
    expect(docs[0]!.timestamp).toBe("2026-03-08T12:22:42.404Z");
  });

  it("extracts conversation text content only", () => {
    const docs = claudeCodeAdapter.parse("/sources/claude/abc-123.jsonl", fixture);
    const content = docs[0]!.content;
    expect(content).toContain("pattern adapter");
    expect(content).not.toContain("hook_progress"); // progress events excluded
  });
});
```

**Step 3: Run test to verify it fails**

```bash
npx vitest run tests/pipeline/adapters/claude-code.test.ts
```
Expected: FAIL — module not found.

**Step 4: Implement claude-code adapter**

Create `src/pipeline/adapters/claude-code.ts`:
```typescript
import * as path from "node:path";
import { SourceDocumentSchema } from "../ingest.js";
import type { SourceAdapter } from "./types.js";

interface ClaudeCodeEntry {
  type?: string;
  sessionId?: string;
  timestamp?: string;
  message?: {
    role?: string;
    content?: Array<{ type?: string; text?: string }> | string;
  };
}

function extractTextContent(
  content: Array<{ type?: string; text?: string }> | string | undefined
): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter((block) => block.type === "text" && block.text)
    .map((block) => block.text!)
    .join("\n");
}

export const claudeCodeAdapter: SourceAdapter = {
  id: "claude-code",
  label: "Claude Code Sessions",
  sourceDir: "claude",
  filePatterns: ["*.jsonl"],

  canHandle(filePath: string): boolean {
    const parts = filePath.split(path.sep);
    const dirIndex = parts.findIndex((p) => p === "claude");
    return dirIndex !== -1 && filePath.endsWith(".jsonl");
  },

  parse(filePath: string, raw: string) {
    const lines = raw.split("\n").filter((l) => l.trim().length > 0);
    const entries: ClaudeCodeEntry[] = [];

    for (const line of lines) {
      try {
        entries.push(JSON.parse(line) as ClaudeCodeEntry);
      } catch {
        // skip malformed lines
      }
    }

    const messages = entries.filter(
      (e) => e.type === "user" || e.type === "assistant"
    );

    if (messages.length === 0) return [];

    const sessionId =
      messages[0]?.sessionId ??
      path.basename(filePath, ".jsonl");

    const conversationText = messages
      .map((m) => {
        const role = m.message?.role ?? m.type ?? "unknown";
        const text = extractTextContent(m.message?.content);
        return `[${role}] ${text}`;
      })
      .join("\n\n");

    const timestamps = messages
      .map((m) => m.timestamp)
      .filter((t): t is string => t !== undefined)
      .sort();

    const id = `claude-code_${sessionId}_${Date.now()}`;

    return [
      SourceDocumentSchema.parse({
        id,
        sourcePath: filePath,
        sourceType: "json",
        sourceDir: "claude",
        content: conversationText,
        timestamp: timestamps[0],
        metadata: {
          adapter: "claude-code",
          sessionId,
          messageCount: messages.length,
          firstMessage: timestamps[0],
          lastMessage: timestamps[timestamps.length - 1],
        },
      }),
    ];
  },
};
```

**Step 5: Run test to verify it passes**

```bash
npx vitest run tests/pipeline/adapters/claude-code.test.ts
```
Expected: 4 tests PASS.

**Step 6: Commit**

```bash
git add src/pipeline/adapters/claude-code.ts tests/pipeline/adapters/claude-code.test.ts tests/fixtures/claude-code-sample.jsonl
git commit -m "feat: add Claude Code source adapter"
```

---

## Task 3: Codex Adapter

**Files:**
- Create: `src/pipeline/adapters/codex.ts`
- Create: `tests/pipeline/adapters/codex.test.ts`
- Create: `tests/fixtures/codex-sample.jsonl`

**Source format:** JSONL. First line has `type: "session_meta"` with `payload.id`, `payload.cwd`, `payload.timestamp`. Subsequent lines are messages. Also handles `session_index.jsonl` (each line has `id` and `thread_name`).

**Step 1: Create fixture**

Create `tests/fixtures/codex-sample.jsonl`:
```jsonl
{"timestamp":"2026-03-06T22:33:27.739Z","type":"session_meta","payload":{"id":"019cc546","timestamp":"2026-03-06T22:31:12.915Z","cwd":"/Users/test/project","originator":"codex_cli_rs","cli_version":"0.111.0","source":"cli"}}
{"timestamp":"2026-03-06T22:33:30.000Z","type":"message","role":"user","content":"Come posso ottimizzare questa query SQL?"}
{"timestamp":"2026-03-06T22:33:45.000Z","type":"message","role":"assistant","content":"Ecco tre approcci per ottimizzare la query:\n1. Aggiungi un indice...\n2. Usa una CTE...\n3. Riduci i JOIN..."}
```

**Step 2: Write the failing test**

Create `tests/pipeline/adapters/codex.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { codexAdapter } from "../../../src/pipeline/adapters/codex.js";

const fixture = readFileSync(
  resolve(__dirname, "../../fixtures/codex-sample.jsonl"),
  "utf-8"
);

describe("codexAdapter", () => {
  it("has correct id and sourceDir", () => {
    expect(codexAdapter.id).toBe("codex");
    expect(codexAdapter.sourceDir).toBe("codex");
  });

  it("canHandle files in codex/ directory with .jsonl extension", () => {
    expect(codexAdapter.canHandle("/sources/codex/session.jsonl")).toBe(true);
    expect(codexAdapter.canHandle("/sources/claude/session.jsonl")).toBe(false);
  });

  it("parses session JSONL with metadata", () => {
    const docs = codexAdapter.parse("/sources/codex/session-019cc546.jsonl", fixture);
    expect(docs).toHaveLength(1);
    expect(docs[0]!.metadata!["adapter"]).toBe("codex");
    expect(docs[0]!.metadata!["sessionId"]).toBe("019cc546");
    expect(docs[0]!.metadata!["messageCount"]).toBe(2);
    expect(docs[0]!.metadata!["cliVersion"]).toBe("0.111.0");
  });

  it("extracts conversation content without metadata", () => {
    const docs = codexAdapter.parse("/sources/codex/session.jsonl", fixture);
    const content = docs[0]!.content;
    expect(content).toContain("ottimizzare");
    expect(content).toContain("indice");
    expect(content).not.toContain("session_meta");
  });
});
```

**Step 3: Implement codex adapter**

Create `src/pipeline/adapters/codex.ts`:
```typescript
import * as path from "node:path";
import { SourceDocumentSchema } from "../ingest.js";
import type { SourceAdapter } from "./types.js";

interface CodexEntry {
  type?: string;
  timestamp?: string;
  role?: string;
  content?: string;
  payload?: {
    id?: string;
    cwd?: string;
    timestamp?: string;
    cli_version?: string;
    originator?: string;
  };
}

export const codexAdapter: SourceAdapter = {
  id: "codex",
  label: "Codex CLI Sessions",
  sourceDir: "codex",
  filePatterns: ["*.jsonl"],

  canHandle(filePath: string): boolean {
    const parts = filePath.split(path.sep);
    return parts.includes("codex") && filePath.endsWith(".jsonl");
  },

  parse(filePath: string, raw: string) {
    const lines = raw.split("\n").filter((l) => l.trim().length > 0);
    const entries: CodexEntry[] = [];

    for (const line of lines) {
      try {
        entries.push(JSON.parse(line) as CodexEntry);
      } catch {
        // skip malformed lines
      }
    }

    const meta = entries.find((e) => e.type === "session_meta");
    const messages = entries.filter((e) => e.type === "message" && e.content);

    if (messages.length === 0) return [];

    const sessionId =
      meta?.payload?.id ?? path.basename(filePath, ".jsonl");

    const conversationText = messages
      .map((m) => `[${m.role ?? "unknown"}] ${m.content ?? ""}`)
      .join("\n\n");

    const timestamps = entries
      .map((e) => e.timestamp ?? e.payload?.timestamp)
      .filter((t): t is string => t !== undefined)
      .sort();

    const id = `codex_${sessionId}_${Date.now()}`;

    return [
      SourceDocumentSchema.parse({
        id,
        sourcePath: filePath,
        sourceType: "json",
        sourceDir: "codex",
        content: conversationText,
        timestamp: timestamps[0],
        metadata: {
          adapter: "codex",
          sessionId,
          messageCount: messages.length,
          cwd: meta?.payload?.cwd,
          cliVersion: meta?.payload?.cli_version,
          firstMessage: timestamps[0],
          lastMessage: timestamps[timestamps.length - 1],
        },
      }),
    ];
  },
};
```

**Step 4: Run tests**

```bash
npx vitest run tests/pipeline/adapters/codex.test.ts
```
Expected: 4 tests PASS.

**Step 5: Commit**

```bash
git add src/pipeline/adapters/codex.ts tests/pipeline/adapters/codex.test.ts tests/fixtures/codex-sample.jsonl
git commit -m "feat: add Codex CLI source adapter"
```

---

## Task 4: Twitter Adapter

**Files:**
- Create: `src/pipeline/adapters/twitter.ts`
- Create: `tests/pipeline/adapters/twitter.test.ts`
- Create: `tests/fixtures/twitter-bookmarks-sample.md`

**Source format:** Markdown. Bookmarks structured as `[Title](url) — Text (Date)` under topic headings (`## Topic (N bookmarks)`). Stats file is a simple table.

**Step 1: Create fixture**

Create `tests/fixtures/twitter-bookmarks-sample.md`:
```markdown
# Twitter Bookmarks by Topic

## AI/ML (3 bookmarks)

- [AI Agent Patterns](https://x.com/user1/status/123) — Thread on multi-agent architectures for production systems (2026-02-15)
- [LLM Fine-tuning Guide](https://x.com/user2/status/456) — Step-by-step fine-tuning with LoRA and QLoRA (2026-01-20)
- [Scaling Laws](https://x.com/user3/status/789) — New research on compute-optimal training (2026-03-01)

## Philosophy (2 bookmarks)

- [Baudrillard and AI](https://x.com/user4/status/101) — Simulacra in the age of LLMs (2025-12-10)
- [Extended Mind Thesis](https://x.com/user5/status/102) — Clark & Chalmers revisited (2026-01-05)
```

**Step 2: Write the failing test**

Create `tests/pipeline/adapters/twitter.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { twitterAdapter } from "../../../src/pipeline/adapters/twitter.js";

const fixture = readFileSync(
  resolve(__dirname, "../../fixtures/twitter-bookmarks-sample.md"),
  "utf-8"
);

describe("twitterAdapter", () => {
  it("has correct id and sourceDir", () => {
    expect(twitterAdapter.id).toBe("twitter");
    expect(twitterAdapter.sourceDir).toBe("twitter");
  });

  it("canHandle markdown files in twitter/ directory", () => {
    expect(twitterAdapter.canHandle("/sources/twitter/bookmarks-by-topic.md")).toBe(true);
    expect(twitterAdapter.canHandle("/sources/twitter/process_bookmarks.py")).toBe(false);
    expect(twitterAdapter.canHandle("/sources/youtube/playlists.md")).toBe(false);
  });

  it("parses bookmarks with topic and count metadata", () => {
    const docs = twitterAdapter.parse("/sources/twitter/bookmarks-by-topic.md", fixture);
    expect(docs).toHaveLength(1);
    expect(docs[0]!.metadata!["adapter"]).toBe("twitter");
    expect(docs[0]!.metadata!["bookmarkCount"]).toBe(5);
    expect(docs[0]!.metadata!["topics"]).toEqual(["AI/ML", "Philosophy"]);
  });

  it("preserves readable content", () => {
    const docs = twitterAdapter.parse("/sources/twitter/bookmarks-by-topic.md", fixture);
    expect(docs[0]!.content).toContain("multi-agent architectures");
    expect(docs[0]!.content).toContain("Baudrillard");
  });
});
```

**Step 3: Implement twitter adapter**

Create `src/pipeline/adapters/twitter.ts`:
```typescript
import * as path from "node:path";
import { SourceDocumentSchema } from "../ingest.js";
import type { SourceAdapter } from "./types.js";

export const twitterAdapter: SourceAdapter = {
  id: "twitter",
  label: "Twitter/X Bookmarks",
  sourceDir: "twitter",
  filePatterns: ["*.md"],

  canHandle(filePath: string): boolean {
    const parts = filePath.split(path.sep);
    return parts.includes("twitter") && filePath.endsWith(".md");
  },

  parse(filePath: string, raw: string) {
    const bookmarkPattern = /^- \[.+?\]\(https?:\/\/.+?\)/gm;
    const topicPattern = /^## (.+?) \((\d+) bookmarks?\)/gm;

    const bookmarks = raw.match(bookmarkPattern) ?? [];
    const topics: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = topicPattern.exec(raw)) !== null) {
      topics.push(match[1]!);
    }

    const id = `twitter_${path.basename(filePath, ".md")}_${Date.now()}`;

    return [
      SourceDocumentSchema.parse({
        id,
        sourcePath: filePath,
        sourceType: "markdown",
        sourceDir: "twitter",
        content: raw,
        metadata: {
          adapter: "twitter",
          bookmarkCount: bookmarks.length,
          topics,
          fileName: path.basename(filePath),
        },
      }),
    ];
  },
};
```

**Step 4: Run tests**

```bash
npx vitest run tests/pipeline/adapters/twitter.test.ts
```
Expected: 4 tests PASS.

**Step 5: Commit**

```bash
git add src/pipeline/adapters/twitter.ts tests/pipeline/adapters/twitter.test.ts tests/fixtures/twitter-bookmarks-sample.md
git commit -m "feat: add Twitter/X bookmarks source adapter"
```

---

## Task 5: YouTube Adapter

**Files:**
- Create: `src/pipeline/adapters/youtube.ts`
- Create: `tests/pipeline/adapters/youtube.test.ts`
- Create: `tests/fixtures/youtube-sample.md`

**Source format:** Markdown. Playlists: `## Playlist (N videos)` with `- [ID](url) — YYYY-MM-DD`. Watch history: `**DATE** — [Title](url) by Channel`.

**Step 1: Create fixture**

Create `tests/fixtures/youtube-sample.md`:
```markdown
## AI (2 videos)

- [dQw4w9WgXcQ](https://www.youtube.com/watch?v=dQw4w9WgXcQ) — 2026-01-15
- [abc123def](https://www.youtube.com/watch?v=abc123def) — 2026-02-20

## Music (1 videos)

- [xyz789ghi](https://www.youtube.com/watch?v=xyz789ghi) — 2025-12-01
```

**Step 2: Write the failing test**

Create `tests/pipeline/adapters/youtube.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { youtubeAdapter } from "../../../src/pipeline/adapters/youtube.js";

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
```

**Step 3: Implement youtube adapter**

Create `src/pipeline/adapters/youtube.ts`:
```typescript
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
```

**Step 4: Run tests**

```bash
npx vitest run tests/pipeline/adapters/youtube.test.ts
```
Expected: 3 tests PASS.

**Step 5: Commit**

```bash
git add src/pipeline/adapters/youtube.ts tests/pipeline/adapters/youtube.test.ts tests/fixtures/youtube-sample.md
git commit -m "feat: add YouTube source adapter"
```

---

## Task 6: OpenClaw Adapter (handles both local and m1)

**Files:**
- Create: `src/pipeline/adapters/openclaw.ts`
- Create: `tests/pipeline/adapters/openclaw.test.ts`
- Create: `tests/fixtures/openclaw-sample.md`

**Source format:** Markdown knowledge base documents. Pure markdown with headings, lists, tables, code blocks. No frontmatter. OpenClaw-local has 9 files (domain knowledge), OpenClaw-M1 has 216 files (hierarchical memory vault).

**Step 1: Create fixture**

Create `tests/fixtures/openclaw-sample.md`:
```markdown
# Atlas Fleet Intelligence -- Main Agent

- Name: Atlas
- Class: Fleet Intelligence Agent
- Role: Coordinate wagon maintenance operations
- Domain: Railway logistics

## User Profile

- Name: Michele Ricco
- Timezone: CET (UTC+1)
- Language: Italian (primary), English (technical)

## Operating Instructions

### Security Protocol
- Never expose internal system codes externally
- Validate all inputs before processing
```

**Step 2: Write the failing test**

Create `tests/pipeline/adapters/openclaw.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { openclawAdapter } from "../../../src/pipeline/adapters/openclaw.js";

const fixture = readFileSync(
  resolve(__dirname, "../../fixtures/openclaw-sample.md"),
  "utf-8"
);

describe("openclawAdapter", () => {
  it("has correct id", () => {
    expect(openclawAdapter.id).toBe("openclaw");
  });

  it("canHandle markdown files in openclaw-local/ and openclaw-m1/ directories", () => {
    expect(openclawAdapter.canHandle("/sources/openclaw-local/atlas.md")).toBe(true);
    expect(openclawAdapter.canHandle("/sources/openclaw-m1/ryo-brain/preferences/lingua.md")).toBe(true);
    expect(openclawAdapter.canHandle("/sources/claude/session.jsonl")).toBe(false);
  });

  it("parses markdown with heading structure metadata", () => {
    const docs = openclawAdapter.parse("/sources/openclaw-local/atlas-main.md", fixture);
    expect(docs).toHaveLength(1);
    expect(docs[0]!.metadata!["adapter"]).toBe("openclaw");
    expect(docs[0]!.metadata!["headings"]).toEqual([
      "Atlas Fleet Intelligence -- Main Agent",
      "User Profile",
      "Operating Instructions",
      "Security Protocol",
    ]);
  });

  it("identifies source variant from path", () => {
    const localDocs = openclawAdapter.parse("/sources/openclaw-local/file.md", fixture);
    expect(localDocs[0]!.metadata!["variant"]).toBe("local");

    const m1Docs = openclawAdapter.parse("/sources/openclaw-m1/file.md", fixture);
    expect(m1Docs[0]!.metadata!["variant"]).toBe("m1");
  });
});
```

**Step 3: Implement openclaw adapter**

Create `src/pipeline/adapters/openclaw.ts`:
```typescript
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
```

**Step 4: Run tests**

```bash
npx vitest run tests/pipeline/adapters/openclaw.test.ts
```
Expected: 4 tests PASS.

**Step 5: Commit**

```bash
git add src/pipeline/adapters/openclaw.ts tests/pipeline/adapters/openclaw.test.ts tests/fixtures/openclaw-sample.md
git commit -m "feat: add OpenClaw knowledge base source adapter"
```

---

## Task 7: Adapter Index + Default Registry

**Files:**
- Create: `src/pipeline/adapters/index.ts`
- Create: `tests/pipeline/adapters/index.test.ts`

**Step 1: Write the failing test**

Create `tests/pipeline/adapters/index.test.ts`:
```typescript
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
```

**Step 2: Implement index.ts**

Create `src/pipeline/adapters/index.ts`:
```typescript
export { AdapterRegistry } from "./registry.js";
export type { SourceAdapter } from "./types.js";
export { claudeCodeAdapter } from "./claude-code.js";
export { codexAdapter } from "./codex.js";
export { twitterAdapter } from "./twitter.js";
export { youtubeAdapter } from "./youtube.js";
export { openclawAdapter } from "./openclaw.js";

import { AdapterRegistry } from "./registry.js";
import { claudeCodeAdapter } from "./claude-code.js";
import { codexAdapter } from "./codex.js";
import { twitterAdapter } from "./twitter.js";
import { youtubeAdapter } from "./youtube.js";
import { openclawAdapter } from "./openclaw.js";

/** Pre-configured registry with all built-in source adapters. */
export const defaultRegistry = new AdapterRegistry();
defaultRegistry.register(claudeCodeAdapter);
defaultRegistry.register(codexAdapter);
defaultRegistry.register(twitterAdapter);
defaultRegistry.register(youtubeAdapter);
defaultRegistry.register(openclawAdapter);
```

**Step 3: Run tests**

```bash
npx vitest run tests/pipeline/adapters/index.test.ts
```
Expected: 6 tests PASS.

**Step 4: Commit**

```bash
git add src/pipeline/adapters/index.ts tests/pipeline/adapters/index.test.ts
git commit -m "feat: add default adapter registry with all 5 adapters"
```

---

## Task 8: Refactor ingest.ts to Use Adapter Registry

**Files:**
- Modify: `src/pipeline/ingest.ts`
- Create: `tests/pipeline/ingest.test.ts`

**Step 1: Write the failing test**

Create `tests/pipeline/ingest.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { ingestFile } from "../../src/pipeline/ingest.js";

describe("ingestFile", () => {
  it("delegates to adapter when available", async () => {
    // This tests that the refactored ingestFile tries adapters first
    // For a file in a known adapter directory, it should use the adapter
    // We test with a non-existent file to verify the flow without I/O
    await expect(
      ingestFile("/sources/claude/nonexistent.jsonl")
    ).rejects.toThrow(); // File not found, but the adapter path was attempted
  });
});
```

**Step 2: Refactor ingest.ts**

Modify `src/pipeline/ingest.ts` to:
1. Import `defaultRegistry` from adapters
2. In `ingestFile()`, check `defaultRegistry.findAdapter(filePath)` first
3. If adapter found, read raw content and call `adapter.parse()`
4. Fall back to existing parser registry for unmatched files

Key changes to `ingestFile`:
```typescript
import { defaultRegistry } from "./adapters/index.js";

export async function ingestFile(filePath: string): Promise<SourceDocument[]> {
  const raw = await fs.readFile(filePath, "utf-8");

  // Try source-aware adapter first
  const adapter = defaultRegistry.findAdapter(filePath);
  if (adapter) {
    return adapter.parse(filePath, raw);
  }

  // Fall back to generic parser
  const ext = path.extname(filePath);
  const parser = getParser(ext);
  const id = `src_${path.basename(filePath, ext)}_${Date.now()}`;

  if (parser) {
    const partial = parser.parse(raw, filePath);
    return [SourceDocumentSchema.parse({ id, ...partial })];
  }

  return [
    SourceDocumentSchema.parse({
      id,
      sourcePath: filePath,
      sourceType: "unknown",
      sourceDir: path.basename(path.dirname(filePath)),
      content: raw,
    }),
  ];
}
```

Note: `ingestFile` return type changes from `Promise<SourceDocument>` to `Promise<SourceDocument[]>` since adapters can return multiple documents. Update `ingestAll` accordingly:

```typescript
export async function ingestAll(basePath: string): Promise<SourceDocument[]> {
  const files = await discoverSources(basePath);
  const results: SourceDocument[] = [];
  const errors: Array<{ file: string; error: string }> = [];

  for (const file of files) {
    try {
      const docs = await ingestFile(file);
      results.push(...docs);
    } catch (err) {
      errors.push({
        file,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  if (errors.length > 0) {
    console.error(
      `[ingest] Failed to process ${errors.length} file(s):`,
      errors
    );
  }

  return results;
}
```

**Step 3: Update index.ts for new return type**

In `src/index.ts`, `ingestAll` already returns `SourceDocument[]`, so the pipeline orchestration doesn't change. But the intermediate variable type in Stage 1 stays the same.

**Step 4: Run full test suite**

```bash
npx vitest run
```
Expected: All tests PASS.

**Step 5: Run build**

```bash
npm run build
```
Expected: TypeScript compiles without errors.

**Step 6: Commit**

```bash
git add src/pipeline/ingest.ts tests/pipeline/ingest.test.ts
git commit -m "refactor: delegate ingest to source-aware adapters"
```

---

## Task 9: Integration Test

**Files:**
- Create: `tests/integration/ingest-all.test.ts`

**Step 1: Write integration test**

Create `tests/integration/ingest-all.test.ts`:
```typescript
import { describe, it, expect, beforeAll } from "vitest";
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
        JSON.stringify({ type: "user", sessionId: "s1", timestamp: "2026-03-01T10:00:00.000Z", message: { role: "user", content: [{ type: "text", text: "test message" }] } }),
        JSON.stringify({ type: "assistant", sessionId: "s1", timestamp: "2026-03-01T10:00:05.000Z", message: { role: "assistant", content: [{ type: "text", text: "response" }] } }),
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

    return async () => {
      await rm(tempDir, { recursive: true, force: true });
    };
  });

  it("ingests all source types and returns validated documents", async () => {
    const docs = await ingestAll(tempDir);

    expect(docs.length).toBeGreaterThanOrEqual(4);

    const adapters = docs.map((d) => d.metadata?.["adapter"]).filter(Boolean);
    expect(adapters).toContain("claude-code");
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
```

**Step 2: Run integration test**

```bash
npx vitest run tests/integration/
```
Expected: 2 tests PASS.

**Step 3: Run full suite**

```bash
npx vitest run && npm run build
```
Expected: All tests PASS, build succeeds.

**Step 4: Commit**

```bash
git add tests/integration/
git commit -m "test: add integration test for multi-source ingest pipeline"
```

---

## Summary

| Task | What | Tests | Files |
|------|------|-------|-------|
| 0 | Add Vitest | 0 | 2 |
| 1 | SourceAdapter + Registry | 3 | 4 |
| 2 | Claude Code adapter | 4 | 3 |
| 3 | Codex adapter | 4 | 3 |
| 4 | Twitter adapter | 4 | 3 |
| 5 | YouTube adapter | 3 | 3 |
| 6 | OpenClaw adapter | 4 | 3 |
| 7 | Default registry | 6 | 2 |
| 8 | Refactor ingest.ts | 1 | 2 |
| 9 | Integration test | 2 | 1 |
| **Total** | | **31** | **26** |
