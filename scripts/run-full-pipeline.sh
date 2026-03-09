#!/bin/bash
# PSYCHE/OS - Full pipeline: extract all sources, synthesize, screen neurodivergence
# Runs Phase 1 (extractions) in parallel, then Phase 2 (synthesis + neurodivergence) sequentially.
#
# Configuration:
#   PSYCHE_CLI=claude|codex|gemini   (default: claude)
#   PSYCHE_SOURCES_DIR=/path/to/sources
#   PSYCHE_CLAUDE_HISTORY=/path/to/claude-history.md
#   PSYCHE_CODEX_HISTORY=/path/to/codex-history.md
#   PSYCHE_MAX_BUDGET=5              (max USD per extraction)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/_config.sh"

mkdir -p "$OUTPUT_DIR"

echo "=== PSYCHE/OS Full Pipeline ==="
echo "CLI: $PSYCHE_CLI"
echo "Sources: $SOURCES_DIR"
echo "Output: $OUTPUT_DIR"
echo ""

# --- Phase 1: Parallel extractions ---
echo "--- Phase 1: Extractions (parallel) ---"

bash "$SCRIPT_DIR/extract-claude-sessions.sh" &
PID1=$!

bash "$SCRIPT_DIR/extract-codex-sessions.sh" &
PID2=$!

bash "$SCRIPT_DIR/extract-social-traces.sh" &
PID3=$!

echo "Running 3 extractions in parallel (PIDs: $PID1, $PID2, $PID3)..."
echo ""

wait $PID1; STATUS1=$?
wait $PID2; STATUS2=$?
wait $PID3; STATUS3=$?

echo ""
echo "--- Phase 1 Results ---"
echo "claude-sessions: $([ $STATUS1 -eq 0 ] && echo 'OK' || echo 'FAILED')"
echo "codex-sessions:  $([ $STATUS2 -eq 0 ] && echo 'OK' || echo 'FAILED')"
echo "social-traces:   $([ $STATUS3 -eq 0 ] && echo 'OK' || echo 'FAILED')"
echo ""

# --- Phase 2: Synthesis + Neurodivergence ---
if [ $STATUS1 -eq 0 ] && [ $STATUS2 -eq 0 ] && [ $STATUS3 -eq 0 ]; then
  echo "--- Phase 2: Synthesis + Neurodivergence ---"

  bash "$SCRIPT_DIR/synthesize.sh"
  SYNTH_STATUS=$?

  bash "$SCRIPT_DIR/neurodivergence.sh"
  NEURO_STATUS=$?

  echo ""
  echo "=== Pipeline Complete ==="
  echo "claude-sessions: OK"
  echo "codex-sessions:  OK"
  echo "social-traces:   OK"
  echo "synthesis:       $([ $SYNTH_STATUS -eq 0 ] && echo 'OK' || echo 'FAILED')"
  echo "neurodivergence: $([ $NEURO_STATUS -eq 0 ] && echo 'OK' || echo 'FAILED')"
else
  echo "Phase 2 skipped — one or more extractions failed."
  exit 1
fi

echo ""
ls -la "$OUTPUT_DIR"/*.json 2>/dev/null
