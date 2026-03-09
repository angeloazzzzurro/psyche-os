# PSYCHE/OS Pipeline Methodology

This document explains what the current pipeline is trying to do, what each stage is allowed to infer, and where the system is still intentionally conservative.

## Design Goal

PSYCHE/OS is not trying to generate motivational advice or a personality horoscope.

The target is narrower and harder:

- extract as much grounded signal as possible from heterogeneous digital traces
- compare sources without collapsing their differences
- convert those traces into inspectable structures
- identify the direction of movement implied by the evidence

## Canonical Prompt Architecture

The prompt source of truth now lives in:

- [web/src/prompts/extraction.txt](../web/src/prompts/extraction.txt)
- [web/src/prompts/synthesis.txt](../web/src/prompts/synthesis.txt)
- [web/src/prompts/neurodivergence.txt](../web/src/prompts/neurodivergence.txt)

The UI imports those files directly. Shell scripts also read them directly. `scripts/setup-prompts.sh` is now only a sync helper for clipboard and shell-copy workflows, not a second source of truth.

## Pipeline Phases

### Phase 1: Source Extraction

Purpose:
- maximize recall inside one source family
- separate observations from interpretations
- capture contradictions, gaps, and contextual biases before synthesis

What extraction should surface:
- entities, themes, connections, emotional tone
- cognitive patterns, cycles, projections, sabotage loops, potentials
- social-field dynamics, symbolic systems, technological ecology, philosophical commitments
- contradictions, evidence ledgers, and signal gaps

What extraction should not do:
- declare clinical diagnoses
- flatten all tensions into one elegant story
- confuse self-presentation with stable structure

### Phase 2: Cross-Source Synthesis

Purpose:
- identify what survives triangulation across source families
- distinguish recurring structure from source-specific style
- compute a directional vector rather than a list of generic tips

What synthesis is allowed to do:
- keep only 2-plus-source patterns as high-confidence structure
- map archetypes when behavior supports them
- estimate dimensional convergence and blind spots
- name the strongest direction of travel and its constraints

What synthesis must avoid:
- turning ambiguity into certainty
- producing productivity clichés
- confusing a compelling story with a justified one

### Phase 3: Neurodivergence Screening

Purpose:
- identify overlaps with researched behavioral profiles
- preserve caveats, alternatives, and differential interpretation

Rules:
- this is screening, never diagnosis
- counter-evidence is required
- strengths and tradeoffs must both be named

### Phase 4: Directional Vector

The vector is the part that matters most for forward motion.

It should answer:

- where does the current profile sit now
- what structural tension is unresolved
- which direction is already implied by the evidence
- what constraints and false directions are visible

It should not answer:

- how to "be better"
- generic life coaching
- cheap advice detached from the extracted pattern landscape

## Epistemic Rules

Every stage should preserve these rules:

- evidence before interpretation
- counter-evidence whenever relevant
- recurrence before identity claim
- time sensitivity before trait inflation
- structure over vibe
- direction over advice

## Current Limits

The interface is ahead of the analysis engine in some areas.

Still incomplete:

- schema validation across all real outputs
- regression tests for prompt quality
- broader adapter coverage
- longitudinal deltas across repeated runs
- stronger coupling between generated outputs and UI rendering

That incompleteness is deliberate in the sense that it is visible, documented, and still under active construction.
