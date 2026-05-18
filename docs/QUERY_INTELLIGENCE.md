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
- Guide/help clicks.
- Workflow cluster progression.
- High-traffic low-completion pages.
- Error-heavy tools.
- Locale-level performance.

## Weekly Review Process

1. Export the last 7 and 28 days from GSC and Bing.
2. Pull GA4/Looker views for tool sessions, completions, downloads, errors, and related-tool clicks.
3. Join search signals to operational quality:
   - landing page,
   - tool loaded,
   - file selected or text input started,
   - completed event,
   - download or copy event,
   - related-tool click,
   - guide click,
   - error type.
4. Identify query clusters, not only individual keywords.
5. Mark whether each cluster maps to an existing tool, guide, workflow, or missing intent page.
6. Score each opportunity using the prioritization model below.
7. Select a small number of actions:
   - title/meta refinement,
   - FAQ or summary improvement,
   - trust module placement,
   - internal linking adjustment,
   - intent/comparison page,
   - localization candidate,
   - UX/tool improvement.
8. Record decisions and avoid re-evaluating the same query without new evidence.

## Observation Table Template

| Date | Source | Query or cluster | Landing page | Locale | Impressions | CTR | Completion rate | Error rate | Intent type | Proposed action | Score | Owner note |
|---|---|---|---|---|---:|---:|---:|---:|---|---|---:|---|
| 2026-05 | GSC | convert webp without upload | /png-to-webp/ | en | 0 | 0% | unknown | unknown | no-upload workflow | Candidate intent page | 0 | Add after demand confirmed |

Add these optional fields when data is available:

| Workflow cluster | Related CTR | Guide CTR | Download rate | AI/referral signal | Decision |
|---|---:|---:|---:|---|---|
| image-optimization | unknown | unknown | unknown | unknown | Monitor |

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

## Dashboard Integration

Use `docs/GROWTH_DASHBOARDS.md` as the operating view for GA4 and Looker Studio setup. Query Intelligence should not rely on impressions alone.

Connect each promising query cluster to:

- A landing page from GSC or Bing.
- A GA4 landing page or page path report.
- `tool` and `tool_family` where a tool page is involved.
- `workflow_cluster` where related-tool movement exists.
- `destination_guide` and `guide_type` where users seek trust or troubleshooting help.
- Completion rate and download/copy rate.
- Error rate and dominant `error_type`.

Decision examples:

- High impressions, low CTR, healthy completion: improve title/meta and answer-first summary.
- High impressions, low CTR, weak completion: fix page intent and tool UX before expanding content.
- High completion, high related-tool CTR: strengthen workflow links or create a workflow guide.
- High guide CTR, high error rate: improve troubleshooting copy and inspect the tool.
- Strong locale traffic, healthy completion, low guide coverage: candidate for selective localization.
- ChatGPT or AI referral traffic with completion: improve AI-readable factual blocks and guide links.

## Guardrails

- Do not create thin pages from isolated queries.
- Do not infer personal information from query data.
- Do not overreact to one-day traffic spikes.
- Do not localize fallback pages without maintainable copy.
- Do not claim privacy behavior beyond what the public build and privacy build actually provide.
- Do not add telemetry only to satisfy a dashboard unless a real operational decision depends on it.
