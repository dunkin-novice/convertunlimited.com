(function () {
  "use strict";

  var SCHEMA_VERSION = "v1";
  var UNKNOWN_TOOL = "unknown";

  var ALLOWED_EVENTS = new Set([
    "tools_nav_opened",
    "tools_hub_clicked",
    "related_tool_clicked",
    "guide_clicked",
    "language_changed",
    "tool_loaded",
    "file_selected",
    "text_input_started",
    "option_changed",
    "sample_used",
    "conversion_started",
    "conversion_completed",
    "conversion_failed",
    "tool_completed",
    "error_shown",
    "retry_clicked",
    "download_clicked",
    "batch_download_clicked",
    "copy_clicked",
    "reset_clicked",
    "new_file_clicked",
    "ad_slot_viewed",
    "ad_slot_clicked",
    "privacy_link_clicked",
    "how_it_works_clicked",
    "external_submit_clicked",
    "processing_started",
    "processing_completed",
    "pdf_action_started",
    "pdf_action_completed"
  ]);

  var FORBIDDEN_PARAMS = new Set([
    "filename",
    "file_name",
    "file_content",
    "image_content",
    "document_text",
    "jwt_token_content",
    "csv_content",
    "json_content",
    "raw_text",
    "input_value",
    "output_value",
    "personal_metadata"
  ]);

  var ALLOWED_PARAMS = new Set([
    "bytes",
    "total_in_bytes",
    "total_out_bytes",
    "kb",
    "mb",
    "width",
    "height",
    "page_count",
    "quality",
    "format",
    "input_format",
    "output_format",
    "file_count",
    "batch",
    "ms",
    "error_type",
    "option_name",
    "option_value",
    "destination_tool",
    "destination_guide",
    "guide_type",
    "workflow_cluster",
    "reason",
    "position"
  ]);

  var TOOL_META = {
    "image-converter": { tool_category: "image", tool_family: "image" },
    "background-remover": { tool_category: "image", tool_family: "image" },
    "image-compressor": { tool_category: "image", tool_family: "image" },
    "image-resizer": { tool_category: "image", tool_family: "image" },
    "metadata-remover": { tool_category: "image", tool_family: "image" },
    "heic-to-jpg": { tool_category: "image", tool_family: "image" },
    "watermark-tool": { tool_category: "image", tool_family: "image" },
    "avif-converter": { tool_category: "image", tool_family: "image" },
    "png-to-webp": { tool_category: "image-conversions", tool_family: "image" },
    "jpg-to-webp": { tool_category: "image-conversions", tool_family: "image" },
    "webp-to-jpg": { tool_category: "image-conversions", tool_family: "image" },
    "webp-to-png": { tool_category: "image-conversions", tool_family: "image" },
    "png-to-jpg": { tool_category: "image-conversions", tool_family: "image" },
    "images-to-pdf": { tool_category: "pdf", tool_family: "pdf" },
    "pdf-to-images": { tool_category: "pdf", tool_family: "pdf" },
    "merge-pdf": { tool_category: "pdf", tool_family: "pdf" },
    "split-pdf": { tool_category: "pdf", tool_family: "pdf" },
    "compress-pdf": { tool_category: "pdf", tool_family: "pdf" },
    "qr-generator": { tool_category: "seo", tool_family: "seo" },
    "meta-preview-checker": { tool_category: "seo", tool_family: "seo" },
    "base64-encoder-decoder": { tool_category: "developer", tool_family: "developer" },
    "url-encoder-decoder": { tool_category: "developer", tool_family: "developer" },
    "uuid-generator": { tool_category: "developer", tool_family: "developer" },
    "hash-generator": { tool_category: "developer", tool_family: "developer" },
    "timestamp-converter": { tool_category: "developer", tool_family: "developer" },
    "regex-tester": { tool_category: "developer", tool_family: "developer" },
    "jwt-decoder": { tool_category: "developer", tool_family: "developer" },
    "json-formatter": { tool_category: "developer", tool_family: "data" },
    "csv-cleaner": { tool_category: "developer", tool_family: "data" },
    "csv-to-json": { tool_category: "developer", tool_family: "data" },
    "json-to-csv": { tool_category: "developer", tool_family: "data" },
    "diff-checker": { tool_category: "developer", tool_family: "data" }
  };

  function isDev() {
    var host = window.location && window.location.hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "" ||
      (window.location && /[?&]debug_analytics=1\b/.test(window.location.search));
  }

  function warn(message, detail) {
    if (!isDev() || !window.console || typeof window.console.warn !== "function") return;
    if (detail === undefined) window.console.warn("[ConvertUnlimited analytics] " + message);
    else window.console.warn("[ConvertUnlimited analytics] " + message, detail);
  }

  function normalizeTool(slug) {
    var value = String(slug || "").trim();
    return value === "" ? "image-converter" : value;
  }

  function currentTool() {
    var body = document.body;
    var tool = body ? normalizeTool(body.getAttribute("data-tool")) : UNKNOWN_TOOL;
    if (!tool || tool === "image-converter" && body && !body.hasAttribute("data-tool")) {
      warn("missing <body data-tool>; using unknown");
      return UNKNOWN_TOOL;
    }
    return tool;
  }

  function currentLocale() {
    return String(document.documentElement.lang || "en").toLowerCase().split("-")[0] || "en";
  }

  function currentSourcePageType() {
    var body = document.body;
    var pageType = body && body.getAttribute("data-page-type");
    return pageType ? String(pageType).trim() : "tool";
  }

  function sanitizeValue(value) {
    if (value === null || value === undefined) return undefined;
    if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.slice(0, 120);
    return undefined;
  }

  function sanitizeParams(params) {
    var clean = {};
    var strippedForbidden = false;
    if (!params || typeof params !== "object") return clean;

    Object.keys(params).forEach(function (key) {
      if (FORBIDDEN_PARAMS.has(key)) {
        strippedForbidden = true;
        warn("stripped forbidden parameter", key);
        return;
      }
      if (!ALLOWED_PARAMS.has(key)) {
        warn("dropped non-allowlisted parameter", key);
        return;
      }
      var value = sanitizeValue(params[key]);
      if (value !== undefined) clean[key] = value;
    });

    if (strippedForbidden) clean.forbidden_param_stripped = true;
    return clean;
  }

  window.cuTrack = function cuTrack(eventName, params) {
    if (!ALLOWED_EVENTS.has(eventName)) {
      warn("rejected unknown event", eventName);
      return;
    }
    if (!window.dataLayer || typeof window.dataLayer.push !== "function") {
      return;
    }

    var tool = currentTool();
    var meta = TOOL_META[tool] || { tool_category: UNKNOWN_TOOL, tool_family: UNKNOWN_TOOL };
    if (!TOOL_META[tool]) warn("unknown tool metadata", tool);

    var eventPayload = Object.assign({
      event: eventName,
      schema_version: SCHEMA_VERSION,
      tool: tool,
      tool_category: meta.tool_category,
      tool_family: meta.tool_family,
      locale: currentLocale(),
      source_page_type: currentSourcePageType()
    }, sanitizeParams(params));

    window.dataLayer.push(eventPayload);
  };

  function relatedToolLink(target) {
    while (target && target !== document) {
      if (target.getAttribute && target.getAttribute("data-track") === "related-tool-click") return target;
      target = target.parentNode;
    }
    return null;
  }

  function guideLink(target) {
    while (target && target !== document) {
      if (target.getAttribute && target.getAttribute("data-track") === "guide-click") return target;
      target = target.parentNode;
    }
    return null;
  }

  document.addEventListener("click", function (event) {
    var link = relatedToolLink(event.target);
    if (!link || typeof window.cuTrack !== "function") return;
    window.cuTrack("related_tool_clicked", {
      destination_tool: link.getAttribute("data-destination-tool"),
      workflow_cluster: link.getAttribute("data-workflow-cluster"),
      reason: link.getAttribute("data-reason"),
      position: Number(link.getAttribute("data-position") || 0)
    });
  });

  document.addEventListener("click", function (event) {
    var link = guideLink(event.target);
    if (!link || typeof window.cuTrack !== "function") return;
    window.cuTrack("guide_clicked", {
      destination_guide: link.getAttribute("data-destination-guide"),
      guide_type: link.getAttribute("data-guide-type"),
      reason: link.getAttribute("data-reason"),
      position: Number(link.getAttribute("data-position") || 0)
    });
  });
})();
