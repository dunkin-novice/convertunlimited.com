const fs = require('fs');
const path = require('path');

const locales = ['es', 'fr', 'ja', 'ko', 'th', 'vi', 'zh'];

const targetHTML = `                            <div class="bg-controls">
                                <div class="bg-mode-toggle" style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px;">
                                    <label class="radio-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="radio" name="bg-mode" value="simple" checked style="accent-color: var(--accent);">
                                        <span style="font-weight: 500;">Simple Fill (Instant)</span>
                                    </label>
                                    <label class="radio-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="radio" name="bg-mode" value="ai" style="accent-color: var(--accent);">
                                        <span style="font-weight: 500;">AI Deep Cutout <span style="font-size: 13px; color: var(--text-muted); font-weight: 400;">(~40MB model download, runs locally)</span></span>
                                    </label>
                                </div>
                                <div id="bg-simple-controls">
                                    <label class="range-field" for="bg-tolerance">
                                        <span>Tolerance</span>
                                        <input id="bg-tolerance" type="range" min="18" max="90" value="42">
                                        <span class="mono num" id="bg-tolerance-value">42</span>
                                    </label>
                                    <label class="range-field" for="bg-feather">
                                        <span>Edge softness</span>
                                        <input id="bg-feather" type="range" min="45" max="130" value="90">
                                        <span class="mono num" id="bg-feather-value">90</span>
                                    </label>
                                    <label class="range-field" for="bg-protection">
                                        <span>Subject protection</span>
                                        <input id="bg-protection" type="range" min="0" max="80" value="34">
                                        <span class="mono num" id="bg-protection-value">34</span>
                                    </label>
                                </div>
                                <button class="btn btn-accent" id="bg-process-btn" disabled>Remove background</button>
                                <button class="btn btn-ghost" id="bg-download-btn" disabled>Download PNG</button>
                            </div>`;

const searchRegex = /<div class="bg-controls">[\s\S]*?<button class="btn btn-ghost" id="bg-download-btn" disabled>.*?<\/button>\s*<\/div>/;

locales.forEach(loc => {
    const file = path.join(__dirname, '..', loc, 'background-remover', 'index.html');
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (searchRegex.test(content) && !content.includes('bg-mode-toggle')) {
            content = content.replace(searchRegex, targetHTML);
            fs.writeFileSync(file, content, 'utf8');
            console.log('Patched ' + loc);
        } else {
            console.log('Skipped ' + loc + ' (already patched or no match)');
        }
    }
});
