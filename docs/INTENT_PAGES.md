# Intent Pages

## Purpose

Intent pages capture high-value search and AI-retrieval demand without creating thin programmatic SEO pages.

They are English-first until data proves a page deserves maintained localization. They should explain tradeoffs, limitations, browser behavior, and the relevant ConvertUnlimited workflow.

## Page Types

- Alternatives: compare ConvertUnlimited with server-side converter platforms.
- Comparisons: explain format or workflow tradeoffs.
- Without-upload guides: explain how browser-native workflows work for supported tools.
- Best/free pages: recommend practical tool paths without fake rankings.
- Browser-based workflows: connect several tools into a complete job.

## Quality Requirements

Every intent page must include:

- Answer-first summary.
- Precise privacy wording.
- Limitations.
- Comparison table where useful.
- Related tools.
- Helpful guides or trust links.
- FAQ schema.
- Canonical and x-default hreflang.
- At least one internal CTA.
- Sitemap inclusion.

Do not use exaggerated claims such as absolute-private wording, absolute no-transmission wording, guaranteed-security wording, or device-boundary absolutes.

Preferred wording:

- "Selected file contents are processed locally in your browser."
- "For supported tools, ConvertUnlimited does not provide a server-side upload endpoint for this processing flow."
- "The public site may load ads and analytics; use the privacy build for privacy-sensitive workflows."

## v1 Batch

- `/alternatives/cloudconvert/`
- `/alternatives/online-convert/`
- `/best/free-image-converter/`
- `/best/browser-based-pdf-tools/`
- `/guides/convert-webp-without-upload/`
- `/guides/convert-jpg-to-webp-without-upload/`
- `/guides/remove-metadata-without-upload/`
- `/compare/webp-vs-jpg/`
- `/compare/avif-vs-webp/`
- `/compare/png-vs-webp/`

## Generation

Source data lives in `scripts/data/intent-pages.js`.

Generate pages with:

```bash
node scripts/generate-intent-pages.js
node scripts/generate-sitemap.js
```

Validate with:

```bash
npm run validate:intent-pages
```

## Localization Rule

Do not localize these pages automatically. A page becomes a localization candidate only after the English page shows search demand, acceptable completion behavior, and maintainable copy requirements for the target locale.
