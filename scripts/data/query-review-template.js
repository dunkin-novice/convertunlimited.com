"use strict";

const REVIEW_CADENCES = [
  {
    cadence: "weekly",
    window_days: 7,
    purpose: "Detect breakage, error spikes, workflow dropoffs, and obvious UX regressions.",
    default_actions: [
      "bug_investigation",
      "copy_clarification",
      "tool_ux_fix",
      "workflow_link_adjustment",
      "monitor"
    ]
  },
  {
    cadence: "twenty_eight_day",
    window_days: 28,
    purpose: "Review emerging search intent, CTR gaps, workflow opportunities, guide demand, and localization candidates.",
    default_actions: [
      "improve_existing_page",
      "metadata_update",
      "create_guide",
      "create_comparison",
      "workflow_content",
      "localization_candidate",
      "do_nothing_yet"
    ]
  },
  {
    cadence: "ninety_day",
    window_days: 90,
    purpose: "Review strategic clusters, new tool opportunities, workflow expansion, trust expansion, and selective localization.",
    default_actions: [
      "workflow_landing_page",
      "guide_series",
      "comparison_expansion",
      "selective_localization_plan",
      "new_tool_candidate",
      "no_build_decision"
    ]
  }
];

const PRIORITIZATION_FACTORS = [
  { key: "impressions_or_demand", weight: 2 },
  { key: "ctr_gap", weight: 1 },
  { key: "completion_quality", weight: 2 },
  { key: "workflow_continuation", weight: 2 },
  { key: "guide_help_engagement", weight: 1 },
  { key: "referral_quality", weight: 1 },
  { key: "ai_citation_potential", weight: 1 },
  { key: "localization_potential", weight: 1 },
  { key: "implementation_effort", weight: 2 },
  { key: "strategic_fit", weight: 2 }
];

const DECISION_OUTPUTS = [
  "do_nothing_yet",
  "improve_existing_page",
  "create_guide",
  "create_comparison",
  "create_workflow_content",
  "localize",
  "redesign_ux",
  "create_new_tool",
  "investigate_bug",
  "monitor"
];

const REVIEW_TEMPLATES = {
  weekly_review: [
    "date",
    "window",
    "issue",
    "evidence",
    "severity",
    "decision",
    "owner",
    "follow_up_date"
  ],
  intent_opportunity_review: [
    "query_cluster",
    "landing_page",
    "impressions",
    "ctr",
    "completion_rate",
    "download_or_copy_rate",
    "current_asset",
    "decision"
  ],
  workflow_opportunity_review: [
    "source_tool",
    "destination_tool",
    "workflow_cluster",
    "related_ctr",
    "destination_completion",
    "abandonment_point",
    "decision"
  ],
  localization_decision_review: [
    "page",
    "locale",
    "query_demand",
    "completion_quality",
    "maintenance_confidence",
    "decision",
    "reason"
  ],
  trust_help_expansion_review: [
    "tool_or_page",
    "guide_clicked",
    "guide_type",
    "reason",
    "error_rate",
    "completion_rate",
    "decision"
  ]
};

module.exports = {
  REVIEW_CADENCES,
  PRIORITIZATION_FACTORS,
  DECISION_OUTPUTS,
  REVIEW_TEMPLATES
};
