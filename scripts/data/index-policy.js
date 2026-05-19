"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const REGISTRY_PATH = path.join(ROOT, "tools-registry.json");

const INDEXED_LOCALES = new Set(["en", "th"]);
const NOINDEX_LOCALE_PREFIXES = new Set(["vi", "fr", "es", "zh", "ja", "ko"]);
const KEPT_HREFLANGS = new Set(["en", "th", "x-default"]);

const LEGAL_ROUTES = new Set([
  "/about/",
  "/contact/",
  "/privacy/",
  "/terms/",
]);

const TRUST_ROUTES = new Set([
  "/proof-of-local-processing/",
  "/trust/",
  "/trust/local-processing/",
  "/trust/privacy-build/",
  "/trust/security-architecture/",
  "/trust/verification/",
  "/trust/limitations/",
  "/trust/third-parties/",
]);

const CORE_GUIDE_ROUTES = new Set([
  "/guides/",
  "/guides/how-it-works/",
  "/guides/local-processing/",
  "/guides/remove-metadata-without-upload/",
  "/guides/webp-vs-png/",
  "/guides/webp-vs-jpg/",
  "/guides/avif-vs-webp/",
  "/guides/what-is-webp/",
]);

const TEMPORARY_NOINDEX_PREFIXES = [
  "/alternatives/",
  "/best/",
  "/compare/",
];

const readToolRegistry = () => {
  try {
    return JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  } catch (error) {
    return { categories: [] };
  }
};

const toolSlugs = () => {
  const registry = readToolRegistry();
  const slugs = new Set();
  for (const category of registry.categories || []) {
    for (const tool of category.tools || []) {
      if (tool.status !== "live") continue;
      if (typeof tool.slug === "string" && tool.slug) slugs.add(tool.slug);
    }
  }
  return slugs;
};

const LIVE_TOOL_SLUGS = toolSlugs();

const normalizeRoute = (route) => {
  if (!route) return "/";
  let value = route.split("#")[0].split("?")[0].trim();
  if (!value.startsWith("/")) value = `/${value}`;
  value = value.replace(/\/index\.html$/i, "/");
  if (value.endsWith(".html")) return value;
  if (!value.endsWith("/")) value = `${value}/`;
  return value.replace(/\/{2,}/g, "/");
};

const localePrefixForRoute = (route) => {
  const [first] = normalizeRoute(route).split("/").filter(Boolean);
  return first || "";
};

const slugForToolRoute = (route) => {
  const normalized = normalizeRoute(route);
  if (normalized === "/" || normalized === "/th/") return "";
  const parts = normalized.split("/").filter(Boolean);
  if (parts[0] === "th") return parts.length === 2 ? parts[1] : null;
  return parts.length === 1 ? parts[0] : null;
};

const isCoreToolRoute = (route) => {
  const normalized = normalizeRoute(route);
  if (normalized === "/" || normalized === "/th/") return true;
  const slug = slugForToolRoute(normalized);
  if (!slug) return false;
  if (!LIVE_TOOL_SLUGS.has(slug)) return false;
  return true;
};

const classifyRoute = (route) => {
  const normalized = normalizeRoute(route);

  if (normalized === "/tools/" || normalized === "/th/tools/") {
    return { route: normalized, indexable: true, reason: "core-tools-hub" };
  }

  if (isCoreToolRoute(normalized)) {
    return { route: normalized, indexable: true, reason: "core-tool" };
  }

  if (LEGAL_ROUTES.has(normalized)) {
    return { route: normalized, indexable: true, reason: "publisher-trust" };
  }

  if (TRUST_ROUTES.has(normalized)) {
    return { route: normalized, indexable: true, reason: "privacy-trust" };
  }

  if (CORE_GUIDE_ROUTES.has(normalized)) {
    return { route: normalized, indexable: true, reason: "core-guide" };
  }

  const prefix = localePrefixForRoute(normalized);
  if (NOINDEX_LOCALE_PREFIXES.has(prefix)) {
    return { route: normalized, indexable: false, reason: "temporary-non-core-locale" };
  }

  if (TEMPORARY_NOINDEX_PREFIXES.some((item) => normalized.startsWith(item))) {
    return { route: normalized, indexable: false, reason: "temporary-intent-footprint-reduction" };
  }

  if (normalized.startsWith("/th/")) {
    return { route: normalized, indexable: false, reason: "temporary-thin-thai-non-tool" };
  }

  return { route: normalized, indexable: false, reason: "temporary-non-core-page" };
};

const isIndexableRoute = (route) => classifyRoute(route).indexable;

const shouldKeepHreflang = (hreflang) => KEPT_HREFLANGS.has(hreflang);

module.exports = {
  CORE_GUIDE_ROUTES,
  INDEXED_LOCALES,
  LEGAL_ROUTES,
  TRUST_ROUTES,
  classifyRoute,
  isIndexableRoute,
  normalizeRoute,
  shouldKeepHreflang,
};
