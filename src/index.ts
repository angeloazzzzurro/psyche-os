import * as path from "node:path";
import * as fs from "node:fs/promises";
import { ingestAll } from "./pipeline/ingest.js";
import { extractBatch } from "./pipeline/extract.js";
import { detectAllPatterns } from "./pipeline/patterns.js";
import { synthesizeArchetypes } from "./pipeline/synthesize.js";
import { generateScaffold } from "./scaffold/generator.js";
import type { ContextScaffold } from "./scaffold/generator.js";
import type { ArchetypeSynthesis } from "./pipeline/synthesize.js";
import type { PatternDetectionResult } from "./pipeline/patterns.js";
import type { ExtractionResult } from "./pipeline/extract.js";
import type { SourceDocument } from "./pipeline/ingest.js";

// ---------------------------------------------------------------------------
// Analysis result
// ---------------------------------------------------------------------------

interface AnalysisResult {
  readonly documentsIngested: number;
  readonly extractionResults: readonly ExtractionResult[];
  readonly patterns: PatternDetectionResult;
  readonly synthesis: ArchetypeSynthesis;
  readonly scaffold: ContextScaffold;
}

// ---------------------------------------------------------------------------
// Main analysis pipeline
// ---------------------------------------------------------------------------

/**
 * Run the full PSYCHE/OS analysis pipeline.
 *
 * Pipeline stages:
 * 1. Ingest: discover and parse source documents
 * 2. Extract: semantic extraction via Claude API
 * 3. Detect: pattern detection across extractions
 * 4. Synthesize: archetype mapping and dimensional scoring
 * 5. Scaffold: generate context scaffold for downstream agents
 *
 * @param sourcesPath - Path to the unified-memory sources directory
 * @param apiKey - Optional Claude API key for extraction
 * @returns Complete analysis result
 */
async function analyze(
  sourcesPath: string,
  apiKey?: string
): Promise<AnalysisResult> {
  console.log("[psyche-os] Starting analysis pipeline...");
  console.log(`[psyche-os] Sources path: ${sourcesPath}`);

  // Stage 1: Ingestion
  console.log("[psyche-os] Stage 1: Ingesting sources...");
  const documents: readonly SourceDocument[] = await ingestAll(sourcesPath);
  console.log(`[psyche-os] Ingested ${documents.length} document(s)`);

  if (documents.length === 0) {
    console.warn("[psyche-os] No documents found. Check sources path.");
  }

  // Stage 2: Extraction
  console.log("[psyche-os] Stage 2: Extracting semantics...");
  const extractionResults = await extractBatch(documents, apiKey);
  console.log(
    `[psyche-os] Extracted from ${extractionResults.length} document(s)`
  );

  // Stage 3: Pattern detection
  console.log("[psyche-os] Stage 3: Detecting patterns...");
  const patterns = await detectAllPatterns(extractionResults);
  console.log(
    `[psyche-os] Found ${patterns.sabotageIndicators.length} sabotage indicator(s), ` +
      `${patterns.projections.length} projection(s), ` +
      `${patterns.cycles.length} cycle(s)`
  );

  // Stage 4: Synthesis
  console.log("[psyche-os] Stage 4: Synthesizing archetypes...");
  const synthesis = await synthesizeArchetypes(extractionResults, patterns);
  console.log(
    `[psyche-os] Mapped ${synthesis.archetypeMappings.length} archetype(s)`
  );

  // Stage 5: Scaffold generation
  console.log("[psyche-os] Stage 5: Generating context scaffold...");
  const scaffold = generateScaffold(
    "L2_Cognitive",
    [],
    {
      purpose: "Full psyche analysis",
      domain: "personal development",
      urgency: "low",
      previousInteractions: 0,
    },
    synthesis
  );

  console.log("[psyche-os] Pipeline complete.");

  return {
    documentsIngested: documents.length,
    extractionResults,
    patterns,
    synthesis,
    scaffold,
  };
}

// ---------------------------------------------------------------------------
// CLI interface
// ---------------------------------------------------------------------------

/**
 * Parse CLI arguments and run the analysis.
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  const sourcesPath =
    args[0] ?? path.resolve(import.meta.dirname ?? ".", "..", "sources");
  const outputPath =
    args[1] ?? path.resolve(import.meta.dirname ?? ".", "..", "output");
  const apiKey = process.env["ANTHROPIC_API_KEY"];

  try {
    const result = await analyze(sourcesPath, apiKey);

    // Write results to output directory
    await fs.mkdir(outputPath, { recursive: true });
    const outputFile = path.join(
      outputPath,
      `analysis_${Date.now()}.json`
    );
    await fs.writeFile(
      outputFile,
      JSON.stringify(result, null, 2),
      "utf-8"
    );

    console.log(`[psyche-os] Results written to: ${outputFile}`);
    console.log(
      `[psyche-os] Summary: ${result.documentsIngested} docs, ` +
        `${result.extractionResults.length} extractions, ` +
        `${result.patterns.sabotageIndicators.length} sabotage patterns, ` +
        `${result.synthesis.archetypeMappings.length} archetypes`
    );
  } catch (err) {
    console.error(
      "[psyche-os] Pipeline failed:",
      err instanceof Error ? err.message : String(err)
    );
    process.exitCode = 1;
  }
}

// Run CLI when executed directly
main();

export { analyze };
export type { AnalysisResult };
