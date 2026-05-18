# Growth Intelligence Dashboards

## Purpose

Growth dashboards turn ConvertUnlimited telemetry into operational decisions. They are not vanity reports and they are not a reason to add user profiling.

Use these dashboards to decide which tools need UX work, which workflows deserve stronger internal linking, which guide blocks are useful, which locales are ready for deeper investment, and which search intents deserve content work.

## Current Telemetry Capability

The public build emits governed `window.cuTrack()` events through the centralized analytics wrapper. The privacy build strips tracking and is not a dashboard data source.

Confirmed local schema support:

| Capability | Current source | Dashboard readiness |
|---|---|---|
| Tool identity | `tool` stamped from `<body data-tool>` | Ready |
| Tool grouping | `tool_category`, `tool_family` stamped by wrapper | Ready |
| Locale | `locale` from `<html lang>` | Ready |
| Page type | `source_page_type` from `<body data-page-type>` | Ready |
| File/tool flow | `tool_loaded`, `file_selected`, `text_input_started`, `conversion_completed`, `processing_completed`, `pdf_action_completed`, `tool_completed` | Ready |
| Download behavior | `download_clicked`, `batch_download_clicked`, `copy_clicked` | Ready |
| Errors | `error_shown`, `conversion_failed`, `error_type` | Ready |
| Workflow clicks | `related_tool_clicked`, `destination_tool`, `workflow_cluster`, `reason`, `position` | Ready |
| Guide clicks | `guide_clicked`, `destination_guide`, `guide_type`, `reason`, `position` | Ready |
| Format analysis | `input_format`, `output_format`, `format` where available | Partially ready |
| Performance latency | `ms` is allowed but not consistently emitted | Not ready for platform-level dashboard |

## GA4 And GTM Operational Audit

The repository can verify the event schema and GTM snippet placement. It cannot verify GA4 Admin custom-dimension registration or GTM UI variable configuration.

Required GA4 custom dimensions:

| Parameter | Scope | Reason |
|---|---|---|
| `tool` | Event | Tool ranking, funnels, error monitoring |
| `tool_category` | Event | Category performance |
| `tool_family` | Event | Image/PDF/developer/data/SEO grouping |
| `workflow_cluster` | Event | Workflow intelligence |
| `locale` | Event | Locale performance |
| `reason` | Event | Related-link and guide-click intent |
| `guide_type` | Event | Trust/help engagement |
| `input_format` | Event | Format demand |
| `output_format` | Event | Format demand and completion quality |
| `error_type` | Event | Failure diagnosis |
| `source_page_type` | Event | Tool vs hub vs guide segmentation |
| `destination_tool` | Event | Related-tool progression |
| `destination_guide` | Event | Guide/help interest |

Required GTM mappings:

- One GA4 event tag routes custom events from `dataLayer`.
- Event name is preserved from `{{Event}}`.
- Event parameters above are mapped from Data Layer Variables to GA4 event parameters.
- The tag fires only for the governed event names, not DOM-scraped user content.
- Direct `gtag.js` collection remains absent from generated HTML.

Critical verification gap:

- Before acting on dashboard numbers, confirm the dimensions above are registered in GA4 Admin and visible in Explorations or Looker Studio.

## Dashboard Groups

### 1. Platform Overview

Use this view to answer whether the platform is growing without degrading completion quality.

Core cards:

- Users.
- Sessions.
- Engaged sessions.
- Tool loads.
- Completed events.
- Downloads.
- Errors.
- Related-tool clicks.
- Guide clicks.

Primary dimensions:

- Date.
- Device category.
- Locale.
- Tool family.
- Source / medium.

Operational interpretation:

- Traffic growth without completion growth indicates acquisition-quality or UX mismatch.
- Completion growth without download growth indicates unclear output, weak result visibility, or copy/download friction.
- Guide-click growth can be good if paired with completion stability; it is a warning if errors also rise.

### 2. Tool Performance

Use this view to rank tools by real utility, not pageviews alone.

Metrics:

- Sessions.
- Users.
- Engagement rate.
- `tool_loaded` count.
- Completion count.
- Download count.
- Error count.

Dimensions:

- `tool`.
- `tool_category`.
- `tool_family`.
- Device category.
- Locale.

Computed metrics:

- Completion rate = completed events / `tool_loaded`.
- Download rate = downloads / completed events.
- Error rate = errors / attempt events.

Completed events:

- `conversion_completed`.
- `processing_completed`.
- `pdf_action_completed`.
- `tool_completed`.

Download events:

- `download_clicked`.
- `batch_download_clicked`.
- `copy_clicked` for developer/data tools where copy is the expected output.

Attempt events:

- `conversion_started`.
- `processing_started`.
- `pdf_action_started`.
- `file_selected`.
- `text_input_started`.

### 3. Workflow Intelligence

Use this view to see whether workflow-aware recommendations are helping users move through a task.

Events:

- `related_tool_clicked`.
- Next-page `tool_loaded`.
- Downstream completed event.

Dimensions:

- `tool`.
- `destination_tool`.
- `workflow_cluster`.
- `reason`.
- `position`.
- Device category.

Metrics:

- Related-link CTR = `related_tool_clicked` / `tool_loaded`.
- Next-step load rate = destination `tool_loaded` after related click.
- Next-step completion rate = destination completed events after progression.

Interpretation rules:

- High CTR with low destination completion means the link intent is attractive but the destination tool may not satisfy the job.
- Low CTR on position 1 can mean the recommended next action is wrong or visually buried.
- Strong same-workflow movement is evidence for future workflow landing pages.

### 4. Trust And Guide Engagement

Use this view to measure whether trust/help blocks reduce uncertainty and support completion.

Events:

- `guide_clicked`.
- Tool completed events.
- Error events.

Dimensions:

- `tool`.
- `destination_guide`.
- `guide_type`.
- `reason`.
- `position`.
- Locale.
- Device category.

Metrics:

- Guide CTR = `guide_clicked` / `tool_loaded`.
- Guide-assisted completion rate = completed sessions with a guide click / sessions with a guide click.
- Guide-assisted error rate = error sessions with a guide click / sessions with a guide click.

Interpretation rules:

- High troubleshooting guide CTR and high error rate means the tool likely needs clearer in-product error handling.
- High trust explainer CTR on privacy-sensitive tools is acceptable; do not remove trust content solely because it draws clicks.
- Low guide CTR is not automatically bad if completion and download rates are healthy.

### 5. Error Monitoring

Use this view to catch broken tools, browser limitations, or confusing workflows.

Events:

- `error_shown`.
- `conversion_failed`.

Dimensions:

- `tool`.
- `tool_family`.
- `error_type`.
- Device category.
- Browser.
- Locale.

Metrics:

- Error count.
- Error rate per session.
- Error rate per attempt.
- Error-to-completion ratio.

Alert rules:

- Investigate immediately when error rate doubles week over week on a high-traffic tool.
- Investigate immediately when one `error_type` dominates a tool.
- Wait for more data when a low-volume tool has fewer than 100 tool loads in the selected window.

### 6. Locale Intelligence

Use this view to decide where localization deserves deeper work.

Dimensions:

- `locale`.
- `tool`.
- `tool_family`.
- `workflow_cluster`.
- Country.
- Source / medium.

Metrics:

- Tool loads.
- Completion rate.
- Download rate.
- Error rate.
- Related-link CTR.
- Guide CTR.

Interpretation rules:

- Strong impressions plus weak CTR suggests localized title/meta work.
- Strong tool loads plus weak completion suggests localization or UX clarity problems.
- Strong completion and downstream engagement supports guide or comparison page localization.

### 7. AI Retrieval And Referral Signals

Use this view to identify pages being recommended or cited by answer engines.

Sources to watch:

- ChatGPT referrals when visible.
- Bing referrals.
- Perplexity referrals when visible.
- Gemini or other AI referrals when visible.
- Direct traffic spikes to technical guide pages.

Dimensions:

- Session source / medium.
- Landing page.
- `source_page_type`.
- `tool`.
- `destination_guide`.

Metrics:

- Sessions.
- Engagement rate.
- Tool loads.
- Completed events.
- Guide clicks.
- Related-tool clicks.

Interpretation rules:

- AI referral traffic that completes tools is a strong signal to improve answer-first summaries and trust blocks.
- AI referral traffic that lands on guides but never reaches tools suggests weak calls to relevant workflows.
- Do not create pages solely from one referral spike.

### 8. Mobile Vs Desktop

Use this view to detect device-specific friction.

Dimensions:

- Device category.
- `tool`.
- `tool_family`.
- `workflow_cluster`.
- Browser.

Metrics:

- Completion rate.
- Download rate.
- Error rate.
- Batch-download usage.
- Guide CTR for browser behavior or mobile performance reasons.

Interpretation rules:

- Mobile completion under desktop completion by more than 30% on high-volume tools should trigger UX review.
- Mobile error concentration on image/PDF tools may indicate memory limits or file-picker friction.
- Do not assume mobile users have the same output intent as desktop users.

### 9. Funnel Dropoff

Recommended funnel:

1. `tool_loaded`
2. `file_selected` or `text_input_started`
3. `conversion_started`, `processing_started`, `pdf_action_started`, or direct completion for instant tools
4. `conversion_completed`, `processing_completed`, `pdf_action_completed`, or `tool_completed`
5. `download_clicked`, `batch_download_clicked`, or `copy_clicked`

Breakdowns:

- `tool`.
- Device category.
- Locale.
- `tool_family`.
- Landing page.

Interpretation rules:

- Dropoff from load to input means intro, upload UI, mobile layout, or intent mismatch.
- Dropoff from input to completion means processing failure, unsupported format, or unclear action button.
- Dropoff from completion to download/copy means result visibility or output affordance needs work.

### 10. SEO And AEO Opportunity Detection

Use this view with GSC and Bing exports, not GA4 alone.

Signals:

- High impressions, low CTR.
- High landing sessions, low tool completion.
- High guide engagement, low tool progression.
- Strong AI referral landing pages.
- Locale demand with healthy completion behavior.
- Queries that imply alternatives, comparisons, or browser-native privacy intent.

Operational outputs:

- Title/meta refinement.
- FAQ update.
- Trust/help block adjustment.
- Workflow link adjustment.
- Candidate comparison page.
- Candidate localization.
- Tool UX fix.

## Looker Studio Plan

Keep the first dashboard compact. Prefer operational tables with conditional formatting over decorative charts.

Recommended pages:

1. Executive Overview
   - Scorecards for users, sessions, tool loads, completions, downloads, errors.
   - Time series for completion rate and error rate.
   - Filters: date, locale, device, tool family.

2. Tool Operations
   - Table: tool, tool family, sessions, tool loads, completion rate, download rate, error rate.
   - Bar chart: top tools by completions.
   - Table: high sessions with low completion.

3. Workflow Intelligence
   - Table: source tool, destination tool, workflow cluster, reason, clicks, next-step completion.
   - Bar chart: related-link CTR by workflow cluster.

4. Trust And Guides
   - Table: tool, destination guide, guide type, reason, guide clicks, guide CTR.
   - Table: high guide CTR with high error rate.

5. Errors And Device Friction
   - Table: tool, error type, device category, browser, error count, error rate.
   - Time series: errors by tool family.

6. Locale And Referral Intelligence
   - Table: locale, tool, completion rate, download rate, guide CTR.
   - Table: source / medium, landing page, sessions, completions, guide clicks.

## GA4 Exploration Setup

Create these Explorations first:

| Exploration | Technique | Rows | Columns | Values | Filters |
|---|---|---|---|---|---|
| Tool funnel | Funnel exploration | Event sequence | Device category | Users, completion rate | `source_page_type=tool` |
| Top tools | Free form | `tool` | Device category | Event count, users | Event name in tool events |
| Workflow clicks | Free form | `tool`, `destination_tool`, `workflow_cluster` | `reason` | Event count | `eventName=related_tool_clicked` |
| Guide engagement | Free form | `tool`, `destination_guide`, `guide_type` | `reason` | Event count | `eventName=guide_clicked` |
| Error monitor | Free form | `tool`, `error_type` | Device category | Event count | `eventName=error_shown` or `conversion_failed` |
| Locale quality | Free form | `locale`, `tool` | Device category | Tool loads, completions, downloads | Locale present |

## Decision Thresholds

Use thresholds to avoid noisy decisions:

- Do not act on a tool-level rate with fewer than 100 `tool_loaded` events in the selected period.
- Use 7-day views for breakage detection.
- Use 28-day views for UX and content decisions.
- Use 90-day views for localization and intent-page decisions.
- Treat one-day spikes as investigation prompts, not strategy changes.

Priority rules:

- High traffic plus low completion is a UX or intent mismatch.
- High completion plus low download/copy is output-flow friction.
- High errors on one device category is likely compatibility or memory friction.
- High related-link CTR plus downstream completion is a workflow expansion signal.
- High guide CTR plus low error is trust interest, not necessarily product failure.

## Privacy And Governance

Dashboard data must remain aggregate and operational.

Rules:

- Do not add filenames, raw file contents, pasted text, document text, JWT contents, CSV/JSON contents, or user-entered values.
- Do not use dashboards for user profiling.
- Do not create audience segments based on sensitive behavior.
- Do not combine analytics with file contents because file contents are not part of the telemetry model.
- Keep the privacy build tracker-free.
- Keep `scripts/validate-analytics-events.js` as the schema gate before adding or changing telemetry.

## Critical Gaps And Decisions

No schema change is required for v1 dashboards.

Operational gaps to verify outside the repo:

- GA4 custom dimensions exist for every dashboard parameter.
- GTM Data Layer Variables map the parameters exactly.
- The universal GA4 event tag preserves event names.
- Looker Studio can access event-scoped custom dimensions after GA4 processing delay.

Known telemetry limitations:

- `workflow_cluster` is present on related-tool clicks, not every tool event.
- Some tools complete via `tool_completed` instead of conversion-specific events.
- `conversion_started`, `processing_started`, and `pdf_action_started` are not consistently emitted across every flow, so initial funnels should use input events and completed events until start-event coverage is normalized.
- `ms` is allowed but not consistently emitted; do not build latency dashboards yet.
