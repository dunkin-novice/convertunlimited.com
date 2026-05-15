# Awesome Privacy Readiness

## Current Assessment

| Area | Public build | Privacy build target |
| --- | --- | --- |
| Ads | FAIL: Google AdSense | PASS: removed |
| Analytics | FAIL: GA4 | PASS: removed |
| Remote fonts | FAIL: Google Fonts | PASS: removed |
| Runtime CDNs | FAIL: cdnjs/unpkg/jsDelivr | PASS: vendored |
| File processing | PARTIAL: local code, but event telemetry exists | PASS target: no file-operation telemetry |
| OSS transparency | PARTIAL: needs stronger docs and release history | IMPROVED by repo docs |
| Security posture | PARTIAL | IMPROVED with CSP, policies, tests |

## Maintainer Objections to Expect

- The public site still contains ads and analytics.
- The project needs public maintenance history.
- Some tools depend on complex third-party libraries, even if vendored.
- CSP still allows inline styles because current pages use inline style
  attributes.
- Privacy claims must consistently distinguish public and privacy builds.

## Recommended Submission Wording

> ConvertUnlimited privacy build is a static browser-native file utility suite.
> Selected file contents are processed in the browser using File, Canvas,
> WebAssembly-capable browser APIs, and vendored client-side libraries. The
> privacy build removes ads, analytics, remote fonts, runtime CDN scripts, and
> file-operation telemetry. It includes a reproducible build and a no-network
> processing verification test.

## Best Category Fit

Awesome Privacy category:

```text
Media -> File Converters
```

Secondary fit if maintainers prefer a narrower placement:

```text
Utilities -> Metadata Removal
```

## Acceptance Probability

- Public build as-is: low.
- Privacy build with source, docs, verification, and a no-injection deployment:
  moderate.
- Privacy build with several months of public maintenance history, releases,
  issues, and external review: materially stronger.

Estimated probability after clean deployment: 60-70%.

Remaining blockers before submission:

- Deploy `dist/privacy-build/` to `privacy.convertunlimited.com`.
- Verify the deployed hostname does not receive Cloudflare or host-injected
  analytics/challenge scripts during normal page loads.
- Publish the repository and keep the source link visible.
- Disclose the submitter's affiliation in the Awesome Privacy PR.

## Submission Checklist

- [ ] Publish repository with MIT license.
- [ ] Tag a stable release older than four months if possible.
- [ ] Deploy `dist/privacy-build/` to `privacy.convertunlimited.com`.
- [ ] Confirm host does not inject analytics or scripts.
- [ ] Confirm Cloudflare Web Analytics, Zaraz, Rocket Loader, and script
      injection features are disabled on the privacy hostname.
- [ ] Run `npm run verify:privacy` and attach output to the PR.
- [ ] Link `PRIVACY.md`, `LOCAL_PROCESSING.md`, `THIRD_PARTIES.md`, and
      `THREAT_MODEL.md`.
- [ ] Disclose maintainer affiliation in the Awesome Privacy PR.
- [ ] Keep description objective and under 250 characters.

## Suggested YAML Entry

```yaml
- name: ConvertUnlimited Privacy Build
  url: https://privacy.convertunlimited.com
  icon: https://privacy.convertunlimited.com/favicon.svg
  openSource: true
  github: dunkin-novice/convertunlimited.com
  description: |
    Static browser-native file tools. The privacy build removes ads, analytics,
    runtime CDNs, and telemetry; selected files are processed in the browser.
```
