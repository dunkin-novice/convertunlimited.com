"use strict";

const QUERY_OBSERVATION_FIELDS = [
  "date",
  "source",
  "query_cluster",
  "landing_page",
  "locale",
  "impressions",
  "ctr",
  "completion_rate",
  "error_rate",
  "intent_type",
  "proposed_action",
  "score",
  "owner_note"
];

const QUERY_SCORE_FACTORS = [
  "impressions",
  "ctr_gap",
  "tool_relevance",
  "completion_rate",
  "commercial_intent_value",
  "ai_citation_potential",
  "localization_potential",
  "build_effort"
];

const QUERY_ACTIONS = [
  "no_action",
  "metadata_update",
  "faq_update",
  "trust_module",
  "workflow_link_update",
  "intent_page_candidate",
  "localization_candidate",
  "tool_ux_issue",
  "compatibility_investigation"
];

module.exports = {
  QUERY_OBSERVATION_FIELDS,
  QUERY_SCORE_FACTORS,
  QUERY_ACTIONS
};
