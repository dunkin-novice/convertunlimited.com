// Get references to our HTML elements
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const imagePreviews = document.getElementById('image-previews');
const controls = document.getElementById('controls'); // New reference
const convertAllBtn = document.getElementById('convert-all-btn'); // New reference

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

// New: Event listener for the "Convert All" button
convertAllBtn.addEventListener('click', handleConvertAll);

// --- CORE FUNCTIONS ---

function handleFiles(files) {
    if (files.length === 0) return;
    for (const file of files) {
        createImagePreview(file);
    }
    // New: Show the controls if there are previews
    if (imagePreviews.children.length > 0) {
        controls.classList.remove('hidden');
    }
}

function createImagePreview(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const previewWrapper = document.createElement('div');
        previewWrapper.className = 'preview-wrapper';
        // New: Attach the file object directly to the element for later access
        previewWrapper.fileData = file;

        const img = document.createElement('img');
        img.src = event.target.result;
        img.className = 'preview-image';

        const info = document.createElement('div');
        info.className = 'preview-info';
        info.innerHTML = `
            <span class="file-name">${file.name}</span>
            <span class="file-size">${(file.size / 1024).toFixed(1)} KB</span>
        `;

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

/**
 * Converts a single image to WebP, using the preview wrapper as its source of data.
 * @param {HTMLElement} previewWrapper The preview card element for this image.
 */
function convertImageToWebP(previewWrapper) {
    const file = previewWrapper.fileData; // Get the file from the element
    const convertBtn = previewWrapper.querySelector('.convert-btn');

    // Prevent double-conversion if a button is somehow clicked twice
    if (!convertBtn) return;

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

        const downloadLink = document.createElement('a');
        downloadLink.href = webpDataUrl;
        const newFileName = file.name.split('.').slice(0, -1).join('.') + '.webp';
        downloadLink.download = newFileName;
        downloadLink.textContent = 'Download WebP';
        downloadLink.className = 'download-link';

        convertBtn.replaceWith(downloadLink);
    };
    img.src = URL.createObjectURL(file); // More efficient than using FileReader again
}

/**
 * New: Handles the "Convert All" button click.
 */
function handleConvertAll() {
    convertAllBtn.textContent = 'Converting All...';
    convertAllBtn.disabled = true;

    const wrappersToConvert = document.querySelectorAll('.preview-wrapper');
    wrappersToConvert.forEach(wrapper => {
        // Check if it has a convert button (i.e., not already converted)
        if (wrapper.querySelector('.convert-btn')) {
            convertImageToWebP(wrapper);
        }
    });
}
