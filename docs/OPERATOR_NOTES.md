# Operator Notes and Freshness Signals

## Purpose

Operator notes provide factual freshness signals without pretending every page is updated daily. They should be based on actual review, not automatic date changes.

## Proposed Data Model

Each reviewed page or workflow can define:

```js
{
  route: "/png-to-webp/",
  last_verified: "2026-05",
  browser_support_updated: "2026-05",
  workflow_reviewed: "2026-05",
  comparison_reviewed: null,
  privacy_claims_reviewed: "2026-05",
  known_limitations_updated: "2026-05",
  notes: [
    "Canvas-based re-encoding reviewed for current public tool behavior."
  ]
}
```

Use month-level precision unless a specific date matters.

## Display Rules

- Show freshness notes only on pages where review was performed.
- Prefer compact copy.
- Do not display empty fields.
- Do not auto-update dates at build time.
- Do not claim a localized page is fully reviewed if it is an English fallback.
- Keep public-build and privacy-build claim scopes separate.

Suggested display copy:

- "Last verified: May 2026"
- "Browser behavior reviewed: May 2026"
- "Privacy claims reviewed: May 2026"
- "Comparison criteria reviewed: May 2026"
- "Known limitations updated: May 2026"

## Pages That Should Show Freshness Notes

High priority:

- proof-of-local-processing
- privacy build documentation
- metadata-remover
- image-converter and pair conversion pages
- image-compressor
- image-resizer
- background-remover
- PDF tools
- comparison pages
- alternative pages

Lower priority:

- simple developer utilities
- static category pages
- pages with no technical claim changes

## Validation Rules

Future validation should fail when:

- A page displays a freshness field not present in the operator notes data.
- A freshness date is in the future.
- A generated date is updated without a matching source data change.
- A fallback localized page displays full localized review status.
- Public pages claim privacy-build guarantees.
- Comparison pages lack `comparison_reviewed` once they are live.

## Guardrails

- Do not fake freshness.
- Do not auto-update dates without review.
- Do not use "updated today" style copy unless a real review happened that day.
- Do not bury known limitations.
- Do not turn operator notes into marketing text.
