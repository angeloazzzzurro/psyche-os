# Security Policy

## Supported Scope

Security support currently applies to the latest state of the default branch.

This repository mixes interface code, local scripts, prompt workflows, and handling for highly personal datasets. Security reports are welcome for:

- code execution issues
- unsafe defaults in scripts or prompts
- data leakage risks
- secrets exposure
- dependency vulnerabilities
- privacy failures in contribution or example flows

## Reporting A Vulnerability

Please use GitHub private vulnerability reporting if it is enabled for the repository.

If private reporting is not available, open a minimal public issue without exploit detail and ask for a private follow-up channel.

Do not include:

- personal chat histories
- browsing exports
- generated psyche profiles
- API keys, tokens, or credentials
- screenshots containing private user data

When reporting, include:

- affected file or script
- reproduction steps
- expected impact
- sanitized proof of concept if needed

## Data Safety Expectations

This project is built around sensitive personal material. Contributors and users should assume that raw source data and generated analysis outputs are private by default.

- Keep `sources/`, `output/`, and extraction dumps out of git.
- Sanitize any fixture or screenshot before sharing it publicly.
- Prefer synthetic or heavily reduced examples in issues and pull requests.

## Secure Usage Notes

- Client-side code must not contain secrets.
- Environment variables intended for the browser must be treated as public.
- Deployments should add browser hardening headers or equivalent hosting policy where possible.
- Dangerous permission-skipping modes should remain opt-in, never default.

A baseline hardening configuration for static hosts is included in [`web/public/_headers`](web/public/_headers), and broader guidance lives in [`docs/deployment-hardening.md`](docs/deployment-hardening.md).

## Response Approach

Confirmed issues will be triaged, reproduced, and fixed with the smallest safe change that preserves the intended workflow.
