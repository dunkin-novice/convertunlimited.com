# Query Intelligence

## Purpose

Query Intelligence is a lightweight operating system for deciding what ConvertUnlimited should improve, document, localize, or build next.

The goal is not to collect more personal data. The goal is to combine aggregate search and product signals into a weekly review process that surfaces real user intent.

## Inputs

- Google Search Console queries.
- Bing Webmaster Tools queries.
- Landing pages.
- Low CTR pages.
- ChatGPT and other referral traffic.
- Internal tool usage.
- Related-tool clicks.
- High-traffic low-completion pages.
- Error-heavy tools.
- Locale-level performance.

## Weekly Review Process

1. Export the last 7 and 28 days from GSC and Bing.
2. Pull GA4/Looker views for tool sessions, completions, downloads, errors, and related-tool clicks.
3. Identify query clusters, not only individual keywords.
4. Mark whether each cluster maps to an existing tool, guide, workflow, or missing intent page.
5. Score each opportunity using the prioritization model below.
6. Select a small number of actions:
   - title/meta refinement,
   - FAQ or summary improvement,
   - trust module placement,
   - internal linking adjustment,
   - intent/comparison page,
   - localization candidate,
   - UX/tool improvement.
7. Record decisions and avoid re-evaluating the same query without new evidence.

## Observation Table Template

| Date | Source | Query or cluster | Landing page | Locale | Impressions | CTR | Completion rate | Error rate | Intent type | Proposed action | Score | Owner note |
|---|---|---|---|---|---:|---:|---:|---:|---|---|---:|---|
| 2026-05 | GSC | convert webp without upload | /png-to-webp/ | en | 0 | 0% | unknown | unknown | no-upload workflow | Candidate intent page | 0 | Add after demand confirmed |

## Prioritization Scoring

Score each item from 0 to 3 for every factor. Total possible score: 24.

| Factor | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Impressions | none | low | moderate | high |
| CTR gap | no issue | slight gap | visible gap | high impressions with weak CTR |
| Tool relevance | weak | related | direct | exact match to core tool |
| Completion rate | unknown | healthy | moderate weakness | high traffic with low completion |
| Commercial/intent value | informational only | light utility | strong utility | high-decision comparison/alternative |
| AI citation potential | low | possible | clear | answer-worthy with technical authority |
| Localization potential | no signal | possible | locale demand | strong locale demand and maintainable copy |
| Build effort | large | medium | small | copy/config only |

Recommended thresholds:

- 18 to 24: act this cycle.
- 13 to 17: queue for next planning round.
- 8 to 12: monitor.
- 0 to 7: ignore unless strategically important.

## Intent Types

- Direct tool intent: "png to webp", "json formatter".
- Workflow intent: "compress image after converting to webp".
- Privacy intent: "convert file without upload".
- Comparison intent: "webp vs jpg", "cloudconvert alternative".
- Failure intent: "why pdf conversion fails".
- Mobile friction intent: "convert image on phone".
- Localization intent: non-English demand for an existing successful page.

## Output Artifacts

Each weekly review should produce one of:

- No action, with reason.
- Metadata update.
- FAQ update.
- Trust module insertion.
- Workflow link update.
- Candidate intent page.
- Candidate localization.
- Tool UX issue.
- Bug or compatibility investigation.

## Guardrails

- Do not create thin pages from isolated queries.
- Do not infer personal information from query data.
- Do not overreact to one-day traffic spikes.
- Do not localize fallback pages without maintainable copy.
- Do not claim privacy behavior beyond what the public build and privacy build actually provide.
