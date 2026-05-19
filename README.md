# ConvertUnlimited

ConvertUnlimited is a static browser-native utility suite for file and developer
tools. The repository supports two deployable variants:

- **Public build:** the current SEO/ad-supported website.
- **Privacy build:** a generated build for privacy-first review, self-hosting,
  and OSS distribution. It removes ads, analytics, remote fonts, runtime CDNs,
  and file-operation telemetry.

The privacy build is the version intended for Awesome Privacy, Hacker News
privacy discussions, and self-hosting communities.

## Privacy Build

Generate and verify the privacy build:

```sh
npm run build:privacy
npm run audit:privacy
npm run test:privacy-network
```

The output is written to:

```text
dist/privacy-build/
```

Recommended hosted location:

```text
https://privacy.convertunlimited.com/
```

Deploying the privacy build on a separate subdomain is deliberate. It avoids
mixing privacy-reviewed pages with the ad-supported public website and keeps CSP,
asset paths, and reviewer expectations simple.

Deployment notes are in [docs/DEPLOYMENT_PRIVACY.md](docs/DEPLOYMENT_PRIVACY.md).
Do not deploy the repository root as the privacy site.

## What the Privacy Build Guarantees

For the generated privacy build:

- No Google Analytics or GA4 event calls.
- No Google AdSense or ad iframes.
- No Google Fonts.
- No runtime CDN script tags.
- No third-party JavaScript required for the app to run.
- No file-operation telemetry.
- A CSP with `connect-src 'none'` is emitted for static hosts that support
  `_headers`.

These guarantees are about the generated build artifact. They do not describe
the current public ad-supported website.

The public website at `convertunlimited.com` may include ads and analytics.
Use `privacy.convertunlimited.com` for privacy-sensitive workflows and for OSS
privacy review.

## Local Processing Model

Most tools use browser-native APIs:

- `File` and `FileReader` for user-selected inputs.
- `URL.createObjectURL` for local blob references.
- `Image`, `CanvasRenderingContext2D`, and `canvas.toBlob()` for image tools.
- Client-side PDF and archive libraries vendored in `vendor/`.
- Browser downloads via object URLs.

There is no application backend in this repository for file upload or storage.
See [LOCAL_PROCESSING.md](LOCAL_PROCESSING.md) and
[THREAT_MODEL.md](THREAT_MODEL.md) for limits and non-goals.

## Repository Layout

```text
/
  *.html, */index.html        Static public pages
  */*.js                      Tool implementations
  vendor/                     Pinned local copies of runtime libraries
  scripts/build-privacy.js    Privacy build generator
  scripts/audit-privacy-build.js
                              Static privacy build audit
  tests/no-network-processing.js
                              Runtime no-network processing verification
  docs/                       Operational notes
```

## Verification

`npm run verify:privacy` performs three checks:

1. Builds `dist/privacy-build`.
2. Scans the generated artifact for known third-party runtime references.
3. Runs a headless-browser test that exercises representative processing flows
   while blocking `fetch`, `XMLHttpRequest`, and `sendBeacon`, then fails if
   external requests occur.

The runtime test needs a local Chrome-compatible browser. Override its path with:

```sh
CHROME=/path/to/chrome npm run test:privacy-network
```

## Dependencies

Runtime libraries used by the privacy build are vendored under `vendor/`.
See [THIRD_PARTIES.md](THIRD_PARTIES.md) for the dependency inventory, purpose,
and replacement policy.

## Security

Report security issues privately. See [SECURITY.md](SECURITY.md).

## Contributing

Contributions must preserve local file processing and must not add telemetry or
remote runtime dependencies to the privacy build. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
