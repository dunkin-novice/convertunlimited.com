// Get references to our HTML elements
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const imagePreviews = document.getElementById('image-previews'); // New reference

// --- EVENT LISTENERS ---

// 1. Handle clicking on the upload area
uploadArea.addEventListener('click', () => {
  fileInput.click();
});

// 2. Handle file selection via the file dialog
fileInput.addEventListener('change', (event) => {
  const files = event.target.files;
  handleFiles(files);
  event.target.value = null; // Reset the input so the user can upload the same file again
});

// 3. Handle files being dragged over the upload area
uploadArea.addEventListener('dragover', (event) => {
  event.preventDefault();
  uploadArea.classList.add('drag-over');
});

// 4. Handle files leaving the drag area
uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('drag-over');
});

// 5. Handle files being dropped onto the upload area
uploadArea.addEventListener('drop', (event) => {
  event.preventDefault();
  uploadArea.classList.remove('drag-over');
  const files = event.dataTransfer.files;
  handleFiles(files);
});

// --- CORE FUNCTIONS ---

/**
 * A central function to handle the files selected by the user.
 * @param {FileList} files The list of files from the input.
 */
function handleFiles(files) {
  if (files.length === 0) {
    console.log("No files selected.");
    return;
  }
  
  for (const file of files) {
    // We will process each file here
    createImagePreview(file);
  }
}

/**
 * Creates and displays a preview for a single image file.
 * @param {File} file The image file to preview.
 */
function createImagePreview(file) {
  // Use FileReader to read the file content
  const reader = new FileReader();

  reader.onload = (event) => {
    const previewWrapper = document.createElement('div');
    previewWrapper.className = 'preview-wrapper';

    const img = document.createElement('img');
    img.src = event.target.result;
    img.className = 'preview-image';

    const info = document.createElement('div');
    info.className = 'preview-info';
    info.innerHTML = `
      <span class="file-name">${file.name}</span>
      <span class="file-size">${(file.size / 1024).toFixed(1)} KB</span>
    `;

    previewWrapper.appendChild(img);
    previewWrapper.appendChild(info);
    imagePreviews.appendChild(previewWrapper);
  };
  
  reader.readAsDataURL(file);
}
