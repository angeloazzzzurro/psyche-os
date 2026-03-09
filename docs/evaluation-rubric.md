# Prompt Evaluation Rubric

This rubric is the minimum bar for judging whether a PSYCHE/OS prompt revision is actually better.

## Release Gate

A prompt change is good only if it improves output quality on real artifacts without increasing drift or pseudo-depth.

## Dimensions

### 1. Evidence Traceability

Pass when:
- important claims point back to concrete evidence
- source-specific evidence is retained in synthesis
- counter-evidence appears where ambiguity exists

Fail when:
- interpretation is detached from observable material
- the output sounds persuasive but cannot be traced

### 2. Cross-Source Convergence

Pass when:
- synthesis keeps high-confidence patterns limited to multi-source support
- single-source noise does not dominate the final story

Fail when:
- one expressive source hijacks the synthesis

### 3. Contradiction Handling

Pass when:
- the output preserves tensions between values and behavior
- contradictions are treated as structurally informative

Fail when:
- the model forces coherence too early

### 4. Temporal Sensitivity

Pass when:
- outputs distinguish one-off behavior from recurring structure
- recency, fading signals, and incomplete coverage are acknowledged

Fail when:
- short-term spikes are presented as enduring identity

### 5. Lens Coverage

Pass when:
- psychology, sociology, anthropology, technology, and philosophy each materially contribute when evidence exists

Fail when:
- the output collapses back into only one lens

### 6. Calibration And Safety

Pass when:
- confidence stays conservative
- neurodivergence output remains explicitly non-diagnostic
- model limits and signal gaps are named

Fail when:
- the system flatters
- the system diagnoses
- the system hides uncertainty

### 7. Directional Vector Quality

Pass when:
- the vector describes where the profile is coherently trying to move
- constraints and false directions are named
- the result reads like a derived coordinate system, not advice spam

Fail when:
- the vector becomes generic coaching
- the output confuses activity with direction

## Manual Review Questions

Use these after any substantial prompt revision:

1. Could I point to the evidence behind the strongest claim in under one minute?
2. Does the synthesis preserve at least one real contradiction?
3. Does the vector feel computed from the material, or pasted from generic self-improvement language?
4. If I removed one source family, would the high-confidence claims change appropriately?
5. Does the neurodivergence layer remain careful enough to be publishable?

If the answer to any of these is "no", the prompt revision is not ready.
