# Privacy Build Audit

## Phase 1 Findings

| Area | Current public build | Privacy build requirement | Status |
| --- | --- | --- | --- |
| File upload paths | Core tools use browser APIs; no upload endpoint found in audited tool code | Preserve local processing | PASS with verification |
| Google Analytics | Present on pages and conversion events | Remove | FAIL public / PASS privacy build |
| Google AdSense | Present with auto/manual ads | Remove | FAIL public / PASS privacy build |
| Google Fonts | Present | Self-host or system fonts | FAIL public / PASS privacy build |
| Runtime CDNs | cdnjs, unpkg, jsDelivr | Vendor locally | FAIL public / PASS privacy build |
| Cloudflare RUM | Observed on live site | Remove or disable for privacy host | FAIL live / host configuration required |
| Telemetry | `track()` sends file-operation stats when GA exists | No telemetry | FAIL public / PASS privacy build |
| Claims | Some claims are broader than the actual public build | Precise build-specific claims | Needs copy cleanup |
| OSS trust | README existed but was too broad | Add license, policies, proof docs, tests | Improved |

## Third-Party Dependency Inventory

See [../THIRD_PARTIES.md](../THIRD_PARTIES.md).

## Privacy-Risk Inventory

| Risk | Why it matters | Fix |
| --- | --- | --- |
| GA4 page and event collection | Third party receives page/device/session data and file-operation metadata | Removed from privacy build |
| AdSense/DoubleClick | Third-party ad ecosystem conflicts with privacy-first review | Removed from privacy build |
| Runtime CDNs | CDN can observe page loads and becomes executable supply-chain dependency | Vendored locally |
| Google Fonts | Third-party request on every page load | Removed; use existing CSS/system fallback or self-host later |
| Cloudflare RUM | Host-level telemetry undermines zero-telemetry claims | Disable on privacy subdomain |
| Broad claims | Maintainers reject unverifiable or contradicted language | Use build-specific wording |

## Trust-Risk Inventory

| Risk | Fix |
| --- | --- |
| No obvious privacy artifact | `scripts/build-privacy.js` creates `dist/privacy-build/` |
| No proof path | `tests/no-network-processing.js` verifies runtime processing behavior |
| No clear policy docs | Added privacy, threat model, third parties, security, contributing docs |
| Public and privacy versions confused | README and docs explicitly separate builds |
| No deployment headers | `_headers` generated for Cloudflare Pages/Netlify-style hosts |

## Network Request Classification

| Request class | Classification | Privacy build action |
| --- | --- | --- |
| Same-origin HTML/CSS/JS/vendor files | Essential | Keep |
| Google Fonts | Replaceable | Remove |
| cdnjs/unpkg/jsDelivr libraries | Replaceable | Vendor |
| Google Analytics / Tag Manager | Harmful to privacy positioning | Remove |
| AdSense / DoubleClick / ad-quality endpoints | Harmful to privacy positioning | Remove |
| Cloudflare Insights/RUM | Harmful to privacy positioning | Disable on privacy host |
| File-processing network calls | Not acceptable | Test fails if present |

## File-Processing Verification

Run:

```sh
npm run verify:privacy
```

The static audit fails on known third-party references. The runtime audit opens
the generated privacy build, patches network APIs, processes a sample image, and
fails on external or processing-time network requests.
