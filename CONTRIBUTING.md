# Contributing To PSYCHE/OS

PSYCHE/OS is being opened while it is still evolving. Contributions are welcome precisely because the repo is not "finished".

High-value contribution areas:

- new source adapters and import formats
- prompt calibration and extraction quality
- synthesis logic and evaluation
- semantic search and graph exploration
- accessibility, performance, and visual refinement
- scientific references, caveats, and documentation

## Principles

- Privacy first. Never commit personal exports, chat histories, or generated profiles.
- Local-first by default. Prefer workflows that do not require hosted services.
- Keep the interface restrained. Reduce clutter instead of adding it.
- Be explicit about uncertainty. If a feature is experimental, say so in the UI or docs.

Please also follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Local Setup

```bash
git clone https://github.com/michelericco/psyche-os.git
cd psyche-os
npm install
npm --prefix web install
```

Run the frontend:

```bash
npm --prefix web run dev
```

Build and validate before opening a PR:

```bash
npm run validate
```

## Working On Source Compatibility

One of the main open fronts is compatibility with more source types.

Good contributions here include:

- new importers for exported chat histories
- adapters for bookmarks, browsing traces, notes, repositories, or quantified-self data
- schema normalization between heterogeneous sources
- validation tooling and fixture design

If you add a new source path, keep these constraints:

- generated outputs must remain gitignored
- example fixtures must be sanitized
- setup instructions must be reproducible
- the README should describe the new compatibility honestly

## Data Hygiene

Do not commit:

- `sources/`
- `output/` contents other than `.gitkeep`
- raw extraction JSON generated from real users
- `.env` files, API keys, or tokens
- screenshots containing personal traces unless intentionally sanitized

## Pull Requests

Please keep PRs focused.

- Explain the user-facing change.
- Mention any privacy or security implications.
- Mention what you validated locally.
- If the work expands source compatibility, note what is supported now and what is still missing.

## Discussion

If you are unsure where to contribute, open an issue or start with documentation and adapter ideas. Source compatibility, evaluation rigor, and UI polish are all active areas.
