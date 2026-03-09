import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { openclawAdapter } from "../../../src/pipeline/adapters/openclaw.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
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
