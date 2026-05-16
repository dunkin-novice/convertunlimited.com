function faqSchema(t, locale) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale.hreflang,
    mainEntity: (t.faq || []).map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  });
}

function appSchema(t, locale, options = {}) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': options.type || 'WebApplication',
    name: options.name || t.hero || t.title,
    description: options.description || t.description,
    url: options.url,
    applicationCategory: options.applicationCategory || 'UtilitiesApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    inLanguage: locale.hreflang,
    featureList: options.featureList || [
      t.panelTitle || t.hero || 'Browser-native utility workflow',
      'Processed locally in your browser for supported operations',
      'No account required',
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  });
}

function schemaScripts(t, locale, options = {}) {
  return [
    `<script type="application/ld+json">${faqSchema(t, locale)}</script>`,
    `<script type="application/ld+json">${appSchema(t, locale, options)}</script>`,
  ].join('\n    ');
}

function aeoSummary(t, esc) {
  if (!t.aeoWhat && !t.aeoPrivacy && !t.aeoWorkflow && !t.panelText && !t.sub && !t.description) return '';
  return `
            <section class="article aeo-summary" id="tool-summary">
                <h2>${esc(t.aeoWhatTitle || 'What this tool does')}</h2>
                <p>${esc(t.aeoWhat || t.panelText || t.sub || '')}</p>
                <h2>${esc(t.aeoPrivacyTitle || 'Privacy behavior')}</h2>
                <p>${esc(t.aeoPrivacy || 'Selected inputs are processed locally in your browser for this workflow. The public site may load ads and analytics; use the privacy build for privacy-sensitive workflows.')}</p>
                <h2>${esc(t.aeoWorkflowTitle || 'Supported workflow')}</h2>
                <p>${esc(t.aeoWorkflow || t.articleP1 || '')}</p>
            </section>`;
}

function withAeoDefaults(text, options = {}) {
  for (const value of Object.values(text)) {
    if (!value || typeof value !== 'object') continue;
    value.aeoWhatTitle ||= options.aeoWhatTitle || 'What this tool does';
    value.aeoPrivacyTitle ||= options.aeoPrivacyTitle || 'Privacy behavior';
    value.aeoWorkflowTitle ||= options.aeoWorkflowTitle || 'Supported workflow';
    value.aeoWhat ||= value.panelText || value.sub || value.description;
    value.aeoPrivacy ||= 'Selected inputs are processed locally in your browser for this workflow. The public site may load ads and analytics; use the privacy build for privacy-sensitive workflows.';
    value.aeoWorkflow ||= value.articleP1 || 'Use the controls on this page, review the output in your browser, then copy or download the result.';
  }
  return text;
}

module.exports = {
  aeoSummary,
  appSchema,
  faqSchema,
  schemaScripts,
  withAeoDefaults,
};
