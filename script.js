// Get references to our HTML elements
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');

// --- EVENT LISTENERS ---

// 1. Handle clicking on the upload area
uploadArea.addEventListener('click', () => {
  fileInput.click(); // This triggers the hidden file input
});

// 2. Handle file selection via the file dialog
fileInput.addEventListener('change', (event) => {
  const files = event.target.files;
  handleFiles(files);
});

// 3. Handle files being dragged over the upload area
uploadArea.addEventListener('dragover', (event) => {
  event.preventDefault(); // Prevents the browser from opening the file
  uploadArea.classList.add('drag-over');
});

// 4. Handle files leaving the drag area
uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('drag-over');
});

// 5. Handle files being dropped onto the upload area
uploadArea.addEventListener('drop', (event) => {
  event.preventDefault(); // Prevents the browser from opening the file
  uploadArea.classList.remove('drag-over');
  const files = event.dataTransfer.files;
  handleFiles(files);
});


// --- CORE FUNCTION ---

/**
 * A central function to handle the files selected by the user,
 * whether by clicking or by dropping.
 * @param {FileList} files The list of files from the input.
 */
function handleFiles(files) {
  if (files.length === 0) {
    console.log("No files selected.");
    return;
  }
  
  // For now, we just log the files to the console.
  // In the next step, we will process them.
  console.log("Files received:", files);
}
