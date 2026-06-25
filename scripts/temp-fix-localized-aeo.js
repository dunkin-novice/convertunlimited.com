const fs = require('fs');
const path = require('path');
const locales = require('./data/locales');

const ROOT = path.join(__dirname, '..');

const englishWhatTitle = /<h2>What this page does<\/h2>/g;
const englishPrivacyTitle = /<h2>Privacy behavior<\/h2>/g;
const englishWorkflowTitle = /<h2>Supported workflow<\/h2>/g;
const englishPrivacyText = /<p>Selected file contents are processed locally in your browser for supported workflows\. The public site may load ads and analytics; use the privacy build for privacy-sensitive workflows\.<\/p>/g;
const englishWorkflowText1 = /<p>Use the controls on this page, review the output in your browser, then download the result from this tab\.<\/p>/g;
const englishWorkflowText2 = /<p>Use this page to understand the workflow, then open the linked tool page when you are ready to process files\.<\/p>/g;
const englishWorkflowText3 = /<p>Use the controls on this page, review the output in your browser, then copy or download the result\.<\/p>/g;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    if (entry.isFile() && entry.name === "index.html") files.push(full);
  }
  return files;
}

let changed = 0;

for (const locale of locales) {
  if (!locale.prefix) continue; // Skip English
  
  const dirPath = path.join(ROOT, locale.prefix);
  if (!fs.existsSync(dirPath)) continue;

  const files = walk(dirPath);
  for (const file of files) {
    let html = fs.readFileSync(file, 'utf8');
    const original = html;

    // AEO Strings
    html = html.replace(englishWhatTitle, `<h2>${locale.aeoWhatTitle}</h2>`);
    html = html.replace(englishPrivacyTitle, `<h2>${locale.aeoPrivacyTitle}</h2>`);
    html = html.replace(englishWorkflowTitle, `<h2>${locale.aeoWorkflowTitle}</h2>`);
    html = html.replace(englishPrivacyText, `<p>${locale.aeoPrivacy}</p>`);
    html = html.replace(englishWorkflowText1, `<p>${locale.aeoWorkflow}</p>`);
    html = html.replace(englishWorkflowText2, `<p>${locale.aeoWorkflow}</p>`);
    html = html.replace(englishWorkflowText3, `<p>${locale.aeoWorkflow}</p>`);

    // Schema featureList Strings
    html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/gi, (full, open, json, close) => {
      try {
        const data = JSON.parse(json);
        if (data && data.featureList && Array.isArray(data.featureList)) {
          let updated = false;
          data.featureList = data.featureList.map(feature => {
            if (feature === "Browser-native utility workflow") {
              updated = true;
              return locale.aeoWhatTitle; // Approximation since we don't have a specific translation for this in locales.js
            }
            if (feature === "Local processing for supported file operations") {
              updated = true;
              return locale.localProcessingFeature;
            }
            if (feature === "No account required") {
              updated = true;
              return locale.noAccountFeature;
            }
            return feature;
          });
          if (updated) {
            return `${open}${JSON.stringify(data)}${close}`;
          }
        }
      } catch (error) {
        // Skip invalid JSON
      }
      return full;
    });

    if (html !== original) {
      fs.writeFileSync(file, html, 'utf8');
      changed++;
    }
  }
}

console.log(`Updated localized AEO and Schema strings in ${changed} files.`);
