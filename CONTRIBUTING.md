# Contributing

ConvertUnlimited has two deploy targets. Contributions must not break the
privacy build.

## Before Opening a PR

Run:

```sh
npm run verify:privacy
```

## Rules for Privacy-Build Compatibility

- Do not add analytics, ads, or telemetry to the privacy build.
- Do not add runtime CDN scripts.
- Do not load remote fonts.
- Do not send file names, file sizes, dimensions, hashes, or output stats to a
  server from the privacy build.
- Vendor required browser libraries in `vendor/` and document them in
  `THIRD_PARTIES.md`.
- Keep local-processing claims precise and testable.

## Acceptable Changes

- Tool improvements that keep processing in the browser.
- Dependency updates with pinned vendored files.
- Documentation that improves verifiability.
- Tests for network behavior and local processing.

## Claims Language

Avoid broad absolute privacy or security claims. Do not imply that every layer
of the user's device, browser, host, and network has been eliminated from the
threat model.

Use precise wording:

- "The privacy build does not include analytics or ads."
- "Selected file contents are processed in the browser."
- "The verification test fails if processing triggers network requests."
