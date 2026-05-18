# Selective Localization Strategy

## Purpose

Selective localization prevents ConvertUnlimited from creating large numbers of low-quality fallback pages. New English intent and comparison pages should earn localization through evidence.

## Localization Decision Checklist

Localize a new page only when most of these are true:

- The English page is indexed.
- The page receives meaningful impressions.
- CTR is acceptable or fixable with localized metadata.
- The related tool has completion or downstream engagement.
- Query demand exists in the target locale.
- The page can be maintained with accurate localized copy.
- The page is not thin.
- The localized version will not be mostly English fallback.
- Canonical and hreflang mappings are clear.

## Localization Priority Scoring

Score each locale candidate from 0 to 3. Total possible score: 21.

| Factor | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Indexed English source | not indexed | indexed weakly | indexed | indexed and stable |
| English performance | no signal | low | moderate | strong |
| Target-locale query demand | none | weak | moderate | strong |
| Tool engagement | no engagement | low | moderate | high |
| Translation maintainability | risky | needs review | manageable | high confidence |
| Strategic value | low | useful | important | core workflow |
| Content uniqueness | thin | mostly generic | useful | strong local-specific value |

Recommended thresholds:

- 16 to 21: localize.
- 11 to 15: prepare copy but wait.
- 6 to 10: monitor.
- 0 to 5: do not localize.

## Fallback Policy

- English fallback pages must carry an explicit fallback status in source data or generated markup.
- Fallback pages must not present themselves as fully localized.
- Important headings, summaries, and FAQ can be selectively localized before full body localization.
- Hreflang should not point to a page as an equivalent localized answer if the localized page is mostly English and not useful for that locale.

## Canonical and Hreflang Implications

- English source pages should remain canonical to themselves.
- Localized pages should self-canonical only when they are real localized equivalents.
- `x-default` should point to the default English or global route.
- Fallback pages should be handled conservatively; do not create misleading hreflang clusters.

## What To Localize First

Prioritize:

- High-traffic tool pages.
- High-intent comparison pages after English validation.
- Privacy/local-processing explainers when target-locale demand exists.
- Workflow pages with demonstrated related-tool movement.

Avoid:

- Auto-localizing every new intent page.
- Localizing competitor/alternative pages before English quality is proven.
- Translating thin keyword variants.
- Publishing pages that require frequent expert updates without review capacity.
