# Privacy Policy for the Privacy Build

This document applies to the generated privacy build in `dist/privacy-build/`
and to any deployment that serves that artifact without modification.

## Summary

The privacy build is a static web app. File contents selected by the user are
handled in the browser process and are not intentionally transmitted by the app.
The build does not include analytics, ads, third-party runtime scripts, remote
fonts, or telemetry events.

## Data Processed Locally

Depending on the tool, the browser may process:

- selected file bytes;
- file names shown in the local UI;
- file sizes shown in the local UI;
- image dimensions after local decoding;
- generated output blobs for download.

This data is kept in browser memory or object URLs until the page is refreshed,
the user clears the session, or the browser releases it.

## Network Behavior

The privacy build is designed so the page can be loaded from a static host and
then process files without network requests. The generated `_headers` file sets
`connect-src 'none'` where supported.

The only expected network activity is loading the static site assets from the
origin that serves the privacy build.

If the static host injects analytics, challenge scripts, performance beacons, or
other runtime JavaScript, that deployment no longer matches this policy.

## No Analytics or Ads

The privacy build does not contain:

- Google Analytics;
- Google Tag Manager;
- Google AdSense;
- DoubleClick ad requests;
- Cloudflare Web Analytics / RUM scripts;
- third-party font loading;
- runtime CDN script loading.

## Public Build Difference

The public ConvertUnlimited website may use analytics or advertising. Do not
use the public build as evidence for the privacy build. The privacy-reviewed
artifact is `dist/privacy-build/`.

For privacy-sensitive workflows, use a deployment that serves only the privacy
build, such as `privacy.convertunlimited.com`.

## Limits

The privacy build does not protect against:

- a compromised browser or operating system;
- malicious browser extensions;
- a modified deployment that adds third-party scripts;
- a static host that injects scripts;
- browser crash reports or OS-level telemetry outside this app.

## Verification

Run:

```sh
npm run verify:privacy
```

See [LOCAL_PROCESSING.md](LOCAL_PROCESSING.md) for the verification model.
