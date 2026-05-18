# Query Intelligence Operations

## Purpose

This document defines the operating loop for turning aggregate search, telemetry, workflow, guide, localization, and referral signals into decisions.

The goal is to decide what to improve, document, localize, or build next without adding vanity analytics, user profiling, or sensitive tracking.

## Operational Gap Summary

Existing infrastructure provides the raw ingredients:

- Search demand from Google Search Console and Bing Webmaster Tools.
- Tool behavior from governed GA4 events.
- Workflow movement from `related_tool_clicked`.
- Trust and help interest from `guide_clicked`.
- Tool quality from completion, download, copy, and error events.
- Strategic structure from workflow clusters, intent pages, and localization governance.

The remaining gap is not more telemetry. The gap is an explicit review loop that separates:

- immediate operational breakage,
- near-term page and UX improvements,
- longer-term workflow, localization, content, and tool decisions.

## Data Inputs

Use only aggregate operational data.

| Input | Source | Main use |
|---|---|---|
| Queries and impressions | GSC, Bing Webmaster Tools | Demand and CTR gaps |
| Landing page sessions | GA4 / Looker Studio | Page quality and acquisition fit |
| Tool funnel events | GA4 governed events | Completion and download quality |
| Related-tool clicks | `related_tool_clicked` | Workflow discovery |
| Guide/help clicks | `guide_clicked` | Trust, troubleshooting, and education needs |
| Error events | `error_shown`, `conversion_failed` | Breakage and UX friction |
| Referral sources | GA4 source / medium | AI retrieval and partner signals |
| Locale performance | `locale`, country, landing page | Selective localization |

## Weekly Review

Cadence: once per week.

Window: last 7 days, compared with the previous 7 days.

Purpose: catch breakage and obvious regressions. Do not use the weekly review to justify large new builds unless the issue is severe.

Checklist:

1. Error spikes.
   - Sort by `tool`, `error_type`, browser, and device category.
   - Investigate immediately if a high-traffic tool doubles its error rate week over week.
   - Treat low-volume spikes as monitor items unless user-facing breakage is obvious.

2. High-traffic low-completion pages.
   - Compare `tool_loaded` to completed events.
   - Flag pages where load-to-completion drops sharply.
   - Check whether the drop is device-specific or locale-specific.

3. Completion-to-download friction.
   - Compare completed events to `download_clicked`, `batch_download_clicked`, or `copy_clicked`.
   - If completions are healthy but output actions are weak, inspect result visibility and button copy.

4. Workflow dropoffs.
   - Review `related_tool_clicked` by `workflow_cluster`, `destination_tool`, `reason`, and `position`.
   - Flag high-click destinations with low downstream completion.

5. Guide/help anomalies.
   - Review `guide_clicked` by `destination_guide`, `guide_type`, `reason`, and tool.
   - High troubleshooting CTR plus high error rate means the tool needs clearer failure handling.
   - High trust-explainer CTR plus healthy completion is trust demand, not product failure.

Weekly outputs:

- Bug investigation.
- Copy clarification.
- Tool UX fix.
- Workflow-link adjustment.
- Monitor item with threshold.
- No action with reason.

## 28-Day Review

Cadence: monthly or every 28 days.

Window: last 28 days, compared with the previous 28 days.

Purpose: decide page, guide, workflow, and UX improvements.

Checklist:

1. Emerging search intent.
   - Group queries by cluster, not one-off keywords.
   - Map each cluster to existing tool, guide, comparison page, workflow cluster, or missing page type.

2. CTR gaps.
   - Look for high impressions with weak CTR.
   - If completion quality is healthy, prioritize title/meta and answer-first summary work.
   - If completion quality is weak, fix intent match or UX before creating more pages.

3. Workflow opportunities.
   - Identify related-tool flows with meaningful CTR and downstream completion.
   - Mark candidates for workflow explainer pages or stronger in-page sequencing.

4. Guide/help opportunities.
   - Identify high guide CTR by tool and reason.
   - If users seek privacy clarification, improve trust blocks.
   - If users seek troubleshooting, improve error messaging or limitations.

5. AI/referral growth.
   - Review ChatGPT, Bing/Copilot, Perplexity, Gemini, and direct spikes to guide or comparison pages when visible.
   - Pair referral growth with engagement, tool progression, and completion quality.

6. Underperforming pages.
   - Find high sessions with weak completion, high bounce, weak guide progression, or weak workflow continuation.

28-day outputs:

- Improve existing page.
- Improve metadata.
- Add or revise FAQ.
- Create guide.
- Create comparison page.
- Improve workflow links.
- Candidate localization.
- Tool UX issue.
- Do nothing yet.

## 90-Day Strategic Review

Cadence: quarterly.

Window: last 90 days, with trend notes from prior quarter.

Purpose: decide strategic expansion, not tactical cleanup.

Checklist:

1. Strategic workflow clusters.
   - Which clusters produce repeated tool usage and downstream completions?
   - Which clusters have search demand plus workflow behavior?
   - Which clusters deserve hub pages, richer guides, or new workflow templates?

2. New tool opportunities.
   - Require evidence from search demand, workflow dropoff, guide/help behavior, and strategic fit.
   - Do not build tools from isolated queries.
   - Prefer improving existing workflows before adding tools.

3. Intent-page expansion.
   - Expand only when the topic has demand, decision value, and a non-thin angle.
   - Favor comparison, alternative, browser-based, and limitations pages that clarify real choices.

4. Trust/help expansion.
   - Use guide clicks and error patterns to decide which trust modules need more depth.
   - Prioritize local-processing proof, metadata limits, browser behavior, mobile performance, and failure explanations.

5. Localization expansion.
   - Localize only pages with search demand, healthy engagement, and maintainable copy.
   - Avoid fallback-only localization for new intent pages.

90-day outputs:

- Workflow landing page candidate.
- New guide series.
- Comparison-page expansion.
- Selective localization plan.
- Tool roadmap candidate.
- Tool deprecation or consolidation question.
- No-build decision with evidence.

## Prioritization Framework

Score each candidate from 0 to 3 for each factor. Weighted score is factor score multiplied by weight.

| Factor | Weight | 0 | 1 | 2 | 3 |
|---|---:|---|---|---|---|
| Impressions or demand | 2 | none | low | moderate | high |
| CTR gap | 1 | no gap | small gap | visible gap | high demand with weak CTR |
| Completion quality | 2 | unknown | weak | acceptable | strong |
| Workflow continuation | 2 | none | weak | visible | strong downstream completion |
| Guide/help engagement | 1 | none | unclear | useful signal | strong explanatory need |
| Referral quality | 1 | none | low engagement | engaged | engaged plus tool progression |
| AI citation potential | 1 | low | possible | clear | answer-worthy and technical |
| Localization potential | 1 | none | possible | demand exists | demand plus quality signal |
| Implementation effort | 2 | large | medium | small | copy/config only |
| Strategic fit | 2 | weak | adjacent | strong | core platform pillar |

Recommended bands:

- 30 or higher: act in the current cycle.
- 22 to 29: queue for next cycle.
- 14 to 21: monitor with a specific threshold.
- 13 or lower: do nothing yet unless risk is high.

## Decision Output Rules

Use the score and evidence to choose one output.

| Evidence pattern | Default output |
|---|---|
| High impressions, low CTR, healthy completion | Improve existing page |
| High impressions, low CTR, weak completion | Fix UX or intent match first |
| High workflow continuation and downstream completion | Create workflow content |
| High guide CTR and high errors | Improve troubleshooting or UX |
| High guide CTR and healthy completion | Expand trust/help content |
| Strong comparison queries and current page gap | Create comparison page |
| Strong non-English demand and healthy completion | Localize |
| Repeated unmet workflow step with high demand | Consider new tool |
| Low volume or contradictory signals | Do nothing yet |

## Weighted Scoring Examples

| Candidate | Demand | Completion | Workflow | Guide/help | Effort | Strategic fit | Decision |
|---|---:|---:|---:|---:|---:|---:|---|
| Improve `/png-to-webp/` title and FAQ | 3 | 3 | 2 | 1 | 3 | 3 | Act now |
| Create "AVIF vs WebP" follow-up section | 2 | 2 | 1 | 1 | 2 | 2 | Queue |
| Localize a new comparison page | 1 | 2 | 0 | 0 | 1 | 1 | Monitor |
| Build a new obscure format converter | 1 | 0 | 0 | 0 | 0 | 1 | Do nothing |

## Operator Workflow Examples

### Example 1: Existing Page Improvement

Signal:

- GSC shows impressions for "convert jpg to webp without upload".
- `/guides/convert-jpg-to-webp-without-upload/` has engaged sessions.
- `jpg-to-webp` completion rate is healthy.

Decision:

- Improve title/meta and add a clearer internal link from the guide to `jpg-to-webp`.
- Do not add a new page.

### Example 2: Workflow Content Candidate

Signal:

- Users click from `png-to-webp` to `image-compressor`.
- A meaningful share then completes compression and downloads output.

Decision:

- Create or improve an image optimization workflow guide.
- Keep the related-tool sequence.

### Example 3: Tool UX Issue

Signal:

- `merge-pdf` receives traffic.
- Mobile completion drops while `error_type=corrupt_input` rises.
- Troubleshooting guide CTR increases.

Decision:

- Improve mobile PDF error messaging and input guidance.
- Do not create more PDF SEO pages until completion quality recovers.

## Workflow Discovery Intelligence

Detect real workflows by combining existing signals:

- Source `tool`.
- `related_tool_clicked` destination.
- Same-session destination `tool_loaded`.
- Destination completed event.
- Download or copy event.
- Guide click before or after failure.

Priority workflow patterns:

- `png-to-webp` -> `image-compressor` -> `metadata-remover`.
- `jpg-to-webp` -> `image-compressor` -> `image-resizer`.
- `merge-pdf` -> `compress-pdf` -> `split-pdf`.
- `json-formatter` -> `json-to-csv` or `diff-checker`.
- `qr-generator` -> `meta-preview-checker`.

Abandonment points:

- Related click without destination load: link target may be slow, unclear, or opened in a blocked context.
- Destination load without input: destination page may not match the promised next action.
- Input without completion: tool behavior, browser support, or error handling issue.
- Completion without download/copy: output affordance issue.

Trust/help influence:

- Guide click before completion can indicate the guide reduced uncertainty.
- Guide click after error can indicate missing in-tool troubleshooting.
- High trust-explainer clicks on privacy-sensitive workflows may support more proof-oriented content.

Do not add new events for this loop. Use the existing governed events first.

## AI Retrieval Observation

AI referral data is often incomplete. Treat it as directional.

Sources to watch:

- ChatGPT referrals when visible in GA4.
- Bing/Copilot referrals where identifiable.
- Perplexity referrals where identifiable.
- Gemini referrals where identifiable.
- Direct spikes to technical guides or comparison pages.

Observation fields:

- Referrer or source / medium.
- Landing page.
- Page type.
- Query cluster if known from GSC/Bing.
- Engagement rate.
- Tool progression.
- Completion or download/copy behavior.
- Guide/help clicks.

Recommended actions:

- If AI referrals land on comparison pages and complete tools, improve answer-first summaries and comparison tables.
- If AI referrals land on guides but do not reach tools, add clearer workflow CTAs.
- If AI referrals land on trust pages, improve proof blocks and link to practical tools.
- Do not create pages from a single unexplained referral spike.

Future expansion ideas:

- Maintain a monthly list of pages with AI/referral growth.
- Compare AI-referral landing pages with GSC query clusters.
- Track which page structures correlate with downstream tool usage.

## Localization Decision Intelligence

Do not auto-localize intent or comparison pages.

Localization inputs:

- Locale query impressions.
- CTR gap in that locale.
- Landing-page engagement.
- Tool completion quality.
- Download/copy quality.
- Workflow depth.
- Guide/help demand.
- Maintenance burden.
- Availability of accurate localized copy.

Localization decision checklist:

1. Is the English page proven by search or referral demand?
2. Does the matching tool or workflow complete well?
3. Does target-locale query demand exist?
4. Can the page be maintained in that locale without fallback-only content?
5. Does the page need locale-specific examples, format names, or caveats?
6. Will localization improve outcomes, not only index count?

Decision outputs:

- Localize now.
- Improve English first.
- Monitor locale demand.
- Keep English-only.
- Remove or mark fallback if quality cannot be maintained.

## Operator Templates

### Weekly Review Template

| Date | Window | Issue | Evidence | Severity | Decision | Owner | Follow-up date |
|---|---|---|---|---|---|---|---|
| 2026-05 | 7 days | Example error spike | Tool/error/device | medium | investigate | owner | 2026-05 |

### Intent Opportunity Review

| Query cluster | Landing page | Impressions | CTR | Completion rate | Download/copy rate | Current asset | Decision |
|---|---|---:|---:|---:|---:|---|---|
| convert webp without upload | `/guides/convert-webp-without-upload/` | unknown | unknown | unknown | unknown | intent page | monitor |

### Workflow Opportunity Review

| Source tool | Destination tool | Workflow cluster | Related CTR | Destination completion | Abandonment point | Decision |
|---|---|---|---:|---:|---|---|
| `png-to-webp` | `image-compressor` | image-optimization | unknown | unknown | unknown | monitor |

### Localization Decision Review

| Page | Locale | Query demand | Completion quality | Maintenance confidence | Decision | Reason |
|---|---|---:|---:|---:|---|---|
| `/compare/webp-vs-jpg/` | th | unknown | unknown | unknown | keep English-only | not enough evidence |

### Trust/Help Expansion Review

| Tool/page | Guide clicked | Guide type | Reason | Error rate | Completion rate | Decision |
|---|---|---|---|---:|---:|---|
| `metadata-remover` | proof-of-local-processing | trust_explainer | privacy_clarification | unknown | unknown | monitor |

## Governance Rules

- Do not add telemetry for curiosity.
- Do not add user profiling.
- Do not collect filenames, raw file contents, pasted text, document text, JWT contents, CSV/JSON contents, or user-entered values.
- Do not mass-localize pages.
- Do not build new tools without repeated evidence.
- Do not act on low-volume metrics without a risk reason.
- Keep the privacy build tracker-free.
- Record "do nothing yet" as a valid decision.
