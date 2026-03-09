#!/bin/bash
# PSYCHE/OS — Sync canonical prompt files for shell/clipboard workflows
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROMPT_DIR="$PROJECT_DIR/web/src/prompts"

echo "=== PSYCHE/OS Prompt Sync ==="

for name in extraction synthesis neurodivergence; do
  SOURCE_FILE="$PROMPT_DIR/$name.txt"
  TARGET_FILE="$SCRIPT_DIR/_prompt-$name.txt"

  if [ ! -f "$SOURCE_FILE" ]; then
    echo "ERROR: Missing canonical prompt: $SOURCE_FILE"
    exit 1
  fi

  install -m 0644 "$SOURCE_FILE" "$TARGET_FILE"
  echo "Synced: $(basename "$TARGET_FILE")"
done

echo ""
echo "Canonical prompts live in: $PROMPT_DIR"
echo "Shell copies refreshed in: $SCRIPT_DIR"
