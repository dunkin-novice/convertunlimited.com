# Workflow Clusters

## Purpose

Workflow clusters make ConvertUnlimited easier to navigate, easier to measure, and easier for retrieval systems to understand. Tools should not be treated as isolated pages when users commonly perform a sequence of actions.

## Recommended Clusters

### Image Optimization Workflow

Primary sequence:

1. Resize image.
2. Compress image.
3. Remove metadata.
4. Convert format.
5. Download.

Tools:

- image-resizer
- image-compressor
- metadata-remover
- image-converter
- png-to-webp
- jpg-to-webp
- webp-to-jpg
- webp-to-png
- png-to-jpg
- avif-converter
- heic-to-jpg

### Image Editing Workflow

Primary sequence:

1. Select image.
2. Remove background or add watermark.
3. Resize/compress if needed.
4. Download.

Tools:

- background-remover
- watermark-tool
- image-resizer
- image-compressor
- metadata-remover

### PDF Assembly Workflow

Primary sequence:

1. Convert images to PDF.
2. Merge PDF.
3. Compress PDF.
4. Split PDF if needed.

Tools:

- images-to-pdf
- merge-pdf
- compress-pdf
- split-pdf
- pdf-to-images

### Developer/Data Workflow

Primary sequence:

1. Format or validate structured text.
2. Convert between formats.
3. Copy or download output.

Tools:

- json-formatter
- csv-cleaner
- csv-to-json
- json-to-csv
- diff-checker
- regex-tester
- base64-encoder-decoder
- url-encoder-decoder
- jwt-decoder
- uuid-generator
- hash-generator
- timestamp-converter

### SEO Sharing Workflow

Primary sequence:

1. Preview metadata.
2. Generate QR code.
3. Share or download assets.

Tools:

- meta-preview-checker
- qr-generator

## Internal Linking Implications

Related links should be workflow-aware:

- Show the next likely action before generic popular tools.
- Limit inline recommendations to 3 to 5 links.
- Prefer same workflow, then same category, then supporting guide.
- Avoid repeating the same link blocks across every page.
- Include one trust/guide link only when it helps explain the current task.

Example for png-to-webp:

1. image-compressor
2. metadata-remover
3. image-resizer
4. webp-to-png
5. avif-converter

## Dashboard Implications

Dashboards should support workflow-level analysis:

- sessions by workflow_id
- completion rate by workflow_id
- download rate by workflow_id
- related-tool CTR by source workflow
- error rate by workflow
- mobile completion by workflow

Workflow reporting prevents over-optimizing one tool while missing a broken multi-step path.

## Future Page and Template Implications

Workflow clusters can power:

- workflow landing pages,
- comparison pages,
- no-upload intent pages,
- related-tool blocks,
- FAQ recommendations,
- trust module placement,
- localization prioritization.

## Proposed Data Structure

See `scripts/data/workflow-clusters.js` for a skeleton data model. It should stay data-only until a generator or validator consumes it.
