"use strict";

const OPERATOR_NOTE_FIELDS = [
  "route",
  "last_verified",
  "browser_support_updated",
  "workflow_reviewed",
  "comparison_reviewed",
  "privacy_claims_reviewed",
  "known_limitations_updated",
  "locale_status",
  "notes"
];

const OPERATOR_NOTES = [
  {
    route: "/proof-of-local-processing/",
    last_verified: "2026-05",
    browser_support_updated: null,
    workflow_reviewed: null,
    comparison_reviewed: null,
    privacy_claims_reviewed: "2026-05",
    known_limitations_updated: "2026-05",
    locale_status: "source",
    notes: [
      "Privacy build verification docs reviewed for no ads, no analytics, and no third-party runtime script claims."
    ]
  },
  {
    route: "/metadata-remover/",
    last_verified: null,
    browser_support_updated: null,
    workflow_reviewed: null,
    comparison_reviewed: null,
    privacy_claims_reviewed: null,
    known_limitations_updated: null,
    locale_status: "source",
    notes: []
  }
];

module.exports = {
  OPERATOR_NOTE_FIELDS,
  OPERATOR_NOTES
};
