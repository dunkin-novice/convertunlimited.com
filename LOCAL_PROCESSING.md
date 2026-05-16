# Local Processing

This document describes how the privacy build processes files.

## Architecture

```text
User-selected file
      |
      v
Browser File / Blob APIs
      |
      v
Tool logic in local JavaScript
      |
      v
Canvas / PDF library / browser encoder
      |
      v
Object URL or generated Blob
      |
      v
Browser download
```

There is no server-side file-ingest endpoint in this repository. The privacy build does not
include analytics or advertising code that receives file-operation events.

## Tool Verification Summary

| Tool family | Local APIs used | Network needed after load |
| --- | --- | --- |
| Image conversion | `File`, `Image`, `URL.createObjectURL`, `canvas.toBlob` | No |
| Image compression | `FileReader`, `Image`, `Canvas`, `JSZip` | No |
| Image resizing | `FileReader`, `Image`, `Canvas`, `JSZip` | No |
| Metadata removal | `FileReader`, `Image`, `Canvas`, re-encoding | No |
| Background removal | `Image`, `Canvas`, `getImageData`, `putImageData` | No |
| PDF merge/split/compress | local PDF library, `ArrayBuffer`, `Blob` | No |
| PDF to images | local PDF.js library, local worker, `Canvas` | No |
| Developer text tools | browser string/crypto APIs | No |

## How to Verify

Build the privacy artifact:

```sh
npm run build:privacy
```

Run static checks:

```sh
npm run audit:privacy
```

Run runtime processing verification:

```sh
npm run test:privacy-network
```

The runtime test:

- serves `dist/privacy-build/` from localhost;
- opens the main converter in headless Chrome;
- patches `fetch`, `XMLHttpRequest`, and `sendBeacon` to fail if called;
- adds a generated sample image through file inputs;
- runs representative image conversion, metadata removal, and background
  removal flows;
- fails if any external request or processing-time network request occurs.

## Reviewer Notes

The privacy build should be reviewed as the artifact in `dist/privacy-build/`.
The public website can keep different business logic, but it should not be used
as the privacy submission target while it includes ads or analytics.
