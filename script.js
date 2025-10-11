// Get references to our HTML elements
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const imagePreviews = document.getElementById('image-previews');
const controls = document.getElementById('controls');
const convertAllBtn = document.getElementById('convert-all-btn');

let conversionProgress = 0;
let totalToConvert = 0;

// --- EVENT LISTENERS ---

uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (event) => {
    handleFiles(event.target.files);
    event.target.value = null;
});
uploadArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadArea.classList.add('drag-over');
});
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
uploadArea.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadArea.classList.remove('drag-over');
    handleFiles(event.dataTransfer.files);
});

convertAllBtn.addEventListener('click', handleConvertAll);

// --- CORE FUNCTIONS ---

function handleFiles(files) {
    if (files.length === 0) return;
    for (const file of files) {
        createImagePreview(file);
    }
    // MODIFIED: Show controls if there are 2 or more images
    if (document.querySelectorAll('.preview-wrapper').length > 1) {
        controls.classList.remove('hidden');
    }
    // NEW: Reset the 'Convert All' button if new files are added
    resetConvertAllButtonState();
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

        // MODIFIED: Add click listener for post-download feedback
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

// NEW: Function to change the button to 'Download All'
function updateToDownloadAllState() {
    convertAllBtn.textContent = 'Download All (.zip)';
    convertAllBtn.disabled = false;
    convertAllBtn.removeEventListener('click', handleConvertAll);
    convertAllBtn.addEventListener('click', handleDownloadAll);
}

// NEW: Function to handle downloading all files as a zip
async function handleDownloadAll() {
    convertAllBtn.textContent = 'Zipping...';
    convertAllBtn.disabled = true;

    const zip = new JSZip();
    const downloadLinks = document.querySelectorAll('.download-link');

    for (const link of downloadLinks) {
        const response = await fetch(link.href);
        const blob = await response.blob();
        zip.file(link.download, blob);
    }

    zip.generateAsync({ type: 'blob' }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'ConvertUnlimited.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Reset button after zipping is complete
        resetConvertAllButtonState();
    });
}

// NEW: Function to reset the main button's state
function resetConvertAllButtonState() {
    convertAllBtn.textContent = 'Convert All to WebP';
    convertAllBtn.disabled = false;
    convertAllBtn.removeEventListener('click', handleDownloadAll);
    convertAllBtn.addEventListener('click', handleConvertAll);
}
