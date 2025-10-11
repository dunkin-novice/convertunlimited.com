// Get references to our HTML elements
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const imagePreviews = document.getElementById('image-previews');
const controls = document.getElementById('controls');
const convertAllBtn = document.getElementById('convert-all-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const dragOverlay = document.getElementById('drag-overlay');

let conversionProgress = 0;
let totalToConvert = 0;
let dragCounter = 0; // NEW: To track dragenter/dragleave events

// --- EVENT LISTENERS ---

// Standard input methods
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (event) => {
    handleFiles(event.target.files);
    event.target.value = null;
});

// MODIFIED: Global Drag & Drop Listeners
window.addEventListener('dragenter', (e) => {
    e.preventDefault();
    // Only show overlay if dragging files
    if (e.dataTransfer.types && (Array.from(e.dataTransfer.types).includes('Files') || Array.from(e.dataTransfer.types).includes('text/uri-list'))) {
        dragCounter++; // Increment counter
        if (dragCounter === 1) { // Only add 'active' class on first dragenter
            dragOverlay.classList.add('active');
        }
    }
});

window.addEventListener('dragleave', (e) => {
    e.preventDefault();
    if (e.dataTransfer.types && (Array.from(e.dataTransfer.types).includes('Files') || Array.from(e.dataTransfer.types).includes('text/uri-list'))) {
        // Ensure the event target is outside our window to hide overlay
        // This prevents hiding when dragging over child elements of the overlay
        if (e.target === document.body || e.target === document.documentElement) {
            dragCounter--; // Decrement counter
            if (dragCounter === 0) { // Only hide when drag leaves main window entirely
                dragOverlay.classList.remove('active');
            }
        }
    }
});

window.addEventListener('dragover', (e) => e.preventDefault()); // Allow drop

// MODIFIED: Drop event for global drop zone
window.addEventListener('drop', (event) => {
    event.preventDefault();
    dragOverlay.classList.remove('active'); // Hide overlay on drop
    dragCounter = 0; // Reset counter
    handleFiles(event.dataTransfer.files);
});

// Button listeners
convertAllBtn.addEventListener('click', handleConvertAll);
clearAllBtn.addEventListener('click', handleClearAll);

// --- CORE LOGIC ---

function handleFiles(files) {
    if (files.length === 0) return;
    for (const file of files) {
        createImagePreview(file);
    }
    updateControlsState();
}

function createImagePreview(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const previewWrapper = document.createElement('div');
        previewWrapper.className = 'preview-wrapper';
        previewWrapper.fileData = file;

        const img = document.createElement('img');
        img.src = event.target.result;
        img.className = 'preview-image';

        const info = document.createElement('div');
        info.className = 'preview-info';
        info.innerHTML = `<span class="file-name">${file.name}</span><span class="file-size">${(file.size / 1024).toFixed(1)} KB</span>`;

        const convertBtn = document.createElement('button');
        convertBtn.className = 'convert-btn';
        convertBtn.textContent = 'Convert to WebP';
        convertBtn.onclick = () => convertImageToWebP(previewWrapper);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent click from bubbling to parent (if any)
            previewWrapper.remove();
            updateControlsState();
        };

        previewWrapper.appendChild(removeBtn);
        previewWrapper.appendChild(img);
        previewWrapper.appendChild(info);
        previewWrapper.appendChild(convertBtn);
        imagePreviews.appendChild(previewWrapper);
    };
    reader.readAsDataURL(file);
}

function convertImageToWebP(previewWrapper, onCompleteCallback) {
    const file = previewWrapper.fileData;
    const convertBtn = previewWrapper.querySelector('.convert-btn');
    if (!convertBtn) { if (onCompleteCallback) onCompleteCallback(); return; }

    convertBtn.textContent = 'Converting...';
    convertBtn.disabled = true;

    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const webpDataUrl = canvas.toDataURL('image/webp', 0.9);
        const newFileName = file.name.split('.').slice(0, -1).join('.') + '.webp';

        const downloadLink = document.createElement('a');
        downloadLink.href = webpDataUrl;
        downloadLink.download = newFileName;
        downloadLink.textContent = 'Download WebP';
        downloadLink.className = 'download-link';
        downloadLink.onclick = () => {
            downloadLink.textContent = 'Done ✅';
            downloadLink.classList.add('downloaded');
        };

        convertBtn.replaceWith(downloadLink);
        if (onCompleteCallback) onCompleteCallback();
    };
    img.src = URL.createObjectURL(file);
}

function handleConvertAll() {
    const wrappersToConvert = Array.from(document.querySelectorAll('.preview-wrapper')).filter(w => w.querySelector('.convert-btn'));
    totalToConvert = wrappersToConvert.length;
    if (totalToConvert === 0) return;

    conversionProgress = 0;
    convertAllBtn.textContent = `Converting... (0/${totalToConvert})`;
    convertAllBtn.disabled = true;

    wrappersToConvert.forEach(wrapper => {
        convertImageToWebP(wrapper, () => {
            conversionProgress++;
            convertAllBtn.textContent = `Converting... (${conversionProgress}/${totalToConvert})`;
            if (conversionProgress === totalToConvert) {
                updateToDownloadAllState();
            }
        });
    });
}

async function handleDownloadAll() {
    convertAllBtn.textContent = 'Zipping...';
    convertAllBtn.disabled = true;
    const zip = new JSZip();
    const downloadLinks = document.querySelectorAll('.download-link:not(.downloaded)');

    for (const link of downloadLinks) {
        const response = await fetch(link.href);
        const blob = await response.blob();
        zip.file(link.download, blob);
        link.textContent = 'Done ✅';
        link.classList.add('downloaded');
    }

    if (Object.keys(zip.files).length > 0) {
         zip.generateAsync({ type: 'blob' }).then(content => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'ConvertUnlimited.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // No reset here, as user might want to re-download if they removed a file
        });
    }
    // Always enable the button again, even if no files were zipped or if error
    updateControlsState(); 
}

function handleClearAll() {
    imagePreviews.innerHTML = '';
    updateControlsState();
}

function updateControlsState() {
    const numPreviews = document.querySelectorAll('.preview-wrapper').length;
    const numUnconverted = document.querySelectorAll('.convert-btn').length;

    if (numPreviews > 1) { // Show controls if 2 or more images
        controls.classList.remove('hidden');
    } else {
        controls.classList.add('hidden');
    }

    if (numUnconverted > 0) { // If there are any unconverted, show convert all
        resetConvertAllButtonState();
    } else if (numPreviews > 0) { // If all are converted, show download all
        updateToDownloadAllState();
    } else { // No images at all
        convertAllBtn.textContent = 'Convert All to WebP'; // Reset text
        convertAllBtn.disabled = false; // Ensure it's not disabled if no images
        convertAllBtn.removeEventListener('click', handleDownloadAll);
        convertAllBtn.addEventListener('click', handleConvertAll);
    }
}

function updateToDownloadAllState() {
    convertAllBtn.textContent = 'Download All (.zip)';
    convertAllBtn.disabled = false;
    convertAllBtn.onclick = handleDownloadAll;
}

function resetConvertAllButtonState() {
    convertAllBtn.textContent = 'Convert All to WebP';
    convertAllBtn.disabled = false;
    convertAllBtn.onclick = handleConvertAll;
}
