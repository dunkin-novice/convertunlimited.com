# AI Retrieval Readiness

## Purpose

AI Retrieval Readiness defines how ConvertUnlimited pages should be structured so they are understandable and citable by ChatGPT, Perplexity, Gemini, Copilot, Claude retrieval, Google, and Bing.

This is not a prompt-engineering layer. It is page quality, information architecture, and source-of-truth discipline.

Use the language rules in [LANGUAGE_STYLE.md](LANGUAGE_STYLE.md). ConvertUnlimited copy should sound like a technical utility site: formal, precise, scoped, and low-hype.

## Page Requirements

Every important page should include:

- Answer-first summary.
- Clear statement of what the tool/page does.
- Privacy behavior written precisely.
- Supported formats or workflows.
- Machine-readable headings.
- Concise factual sections.
- FAQ clarity.
- Limitations section.
- "How it works" section.
- Trust/source-of-truth block.
- Freshness or operator note when review has actually happened.

## Reusable Checklist

Before publishing or localizing a page:

- The first screen explains the task directly.
- The page says "processed locally in your browser" where true.
- Public-build copy avoids overclaims because ads/analytics may exist.
- Privacy-build copy is scoped to the privacy build.
- The page identifies supported inputs and outputs.
- The page includes limitations and failure cases.
- The FAQ answers real decision questions.
- Structured data is present when appropriate.
- Canonical and hreflang rules pass validation.
- The page links to the relevant workflow cluster.
- No generated fallback page pretends to be fully localized.
- Copy uses formal technical language instead of casual marketing language.

## Banned Vague Claims

Do not use:

- absolute privacy claims
- absolute no-transmission claims
- "zero risk"
- military-style security claims
- "no one can see anything"
- "guaranteed secure"
- totalizing privacy claims
- maximum-privacy claims
- broad "privacy-first" labels on public pages
- "supported processing runs in your browser" on pages that may load ads, analytics, fonts, or CDN assets
- "instant", "magic", "ultimate", "perfect", "fast and secure", or "free, bulk, and secure"
- unqualified "no limits"

Preferred wording:

- "Selected file contents are processed locally in your browser."
- "This tool does not intentionally upload file contents for this processing flow."
- "ConvertUnlimited does not provide a server-side upload endpoint for this processing flow."
- "Use the privacy build for privacy-sensitive workflows."
- "The privacy build does not intentionally load analytics, ads, or third-party runtime scripts."
- "No software-imposed file count limit; browser memory and CPU still apply."

## Page Block Requirements

### Tool Page

Required blocks:

- What this tool does.
- Privacy behavior.
- Supported formats/workflow.
- How local processing works.
- Limitations.
- FAQ.
- Related next actions.

### Comparison Page

Required blocks:

- Direct answer.
- Criteria used.
- Comparison table.
- When to use each option.
- Privacy/local-processing difference.
- Limitations.
- FAQ.
- Relevant tools and workflows.
- Comparison criteria reviewed date when actually reviewed.

### Guide Page

Required blocks:

- Short answer.
- Step-by-step workflow.
- Browser behavior notes.
- Common failure reasons.
- Related tools.
- FAQ.
- Last verified note when actually reviewed.

### Trust Page

Required blocks:

- Exact claim scope.
- Architecture overview.
- Runtime dependency notes.
- Browser APIs used.
- Privacy build versus public build distinction.
- Verification steps.
- Known limitations.
- Security contact or disclosure route.

## Example Summaries

Tool page:

> Convert PNG to WebP locally in your browser. The selected image is decoded and re-encoded by browser APIs; ConvertUnlimited does not provide a server-side upload endpoint for this processing flow.

Comparison page:

> WebP is usually better for smaller web images, while JPG remains useful for broad compatibility and photo workflows. The best choice depends on browser support, quality needs, and whether transparency is required.

Guide page:

> To convert WebP without upload, use a browser-native converter that decodes the selected file locally and writes the new format in the browser. Check the network panel if you need to verify no file-content upload occurs.

Trust page:

> The privacy build is the review target for no-ads, no-analytics operation. The public build may include ads and analytics, while core file processing still runs in the browser for supported flows.
