import './style.css';
import { splitText, createDownloadableParts } from './src/splitter/textSplitter.js';

// ========== DARK MODE ==========
const darkModeToggle = document.getElementById('dark-mode-toggle');
const savedTheme = localStorage.getItem('theme');

// Apply saved theme or default to light
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
}

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ========== TAB NAVIGATION ==========
const tabBtns = document.querySelectorAll('.tab-btn');
const converterSection = document.getElementById('converter-section');
const splitterSection = document.getElementById('splitter-section');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.getAttribute('data-tab');

    // Update active states
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show/hide sections
    if (tab === 'converter') {
      converterSection.style.display = 'block';
      splitterSection.style.display = 'none';
    } else if (tab === 'splitter') {
      converterSection.style.display = 'none';
      splitterSection.style.display = 'block';
    }
  });
});

// ========== CONVERTER SECTION ==========
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileListContainer = document.getElementById('file-list');
const batchActions = document.getElementById('batch-actions');
const convertAllBtn = document.getElementById('convert-all');
const downloadAllBtn = document.getElementById('download-all');

let filesToProcess = [];

// Drag and Drop handlers
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
  handleFiles(e.target.files);
});

function handleFiles(files) {
  const newFiles = Array.from(files).filter(file => {
    const ext = file.name.split('.').pop().toLowerCase();
    return ['epub', 'mobi', 'fb2'].includes(ext);
  });

  if (newFiles.length === 0) return;

  filesToProcess = [...filesToProcess, ...newFiles.map(file => ({
    file,
    id: Math.random().toString(36).substr(2, 9),
    status: 'pending',
    result: null
  }))];

  renderFileList();
  updateBatchActions();
}

function renderFileList() {
  fileListContainer.innerHTML = '';
  filesToProcess.forEach(item => {
    const div = document.createElement('div');
    div.className = 'file-item';
    div.innerHTML = `
      <div class="file-info">
        <span class="file-name">${item.file.name}</span>
        <span class="file-meta">
          ${(item.file.size / 1024).toFixed(1)} KB | 
          <span style="color: ${item.status === 'error' ? '#e74c3c' : 'inherit'}">
            ${item.status === 'error' ? (item.error || 'Ошибка') : item.status}
          </span>
        </span>
      </div>
      <div class="file-actions">
        ${item.status === 'pending' || item.status === 'error' ? `<button class="convert-btn" data-id="${item.id}">Конвертировать</button>` : ''}
        ${item.status === 'completed' ? `<button class="convert-btn" style="background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);" data-id="${item.id}">Скачать TXT</button>` : ''}
      </div>
    `;
    fileListContainer.appendChild(div);
  });

  // Re-attach listeners
  document.querySelectorAll('.convert-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      const item = filesToProcess.find(f => f.id === id);
      if (item.status === 'pending' || item.status === 'error') {
        processFile(item);
      } else if (item.status === 'completed') {
        downloadTxt(item);
      }
    });
  });
}

function updateBatchActions() {
  batchActions.style.display = filesToProcess.length > 1 ? 'flex' : 'none';
}

async function processFile(item) {
  item.status = 'processing';
  renderFileList();

  try {
    const ext = item.file.name.split('.').pop().toLowerCase();
    let text = '';

    console.log(`Processing ${item.file.name}...`);

    if (ext === 'epub') {
      const { parseEpub } = await import('./src/parsers/epub.js');
      text = await parseEpub(item.file);
    } else if (ext === 'fb2') {
      const { parseFb2 } = await import('./src/parsers/fb2.js');
      text = await parseFb2(item.file);
    } else if (ext === 'mobi') {
      const { parseMobi } = await import('./src/parsers/mobi.js');
      text = await parseMobi(item.file);
    }

    console.log(`Parsed text length: ${text.length}`);

    if (!text || text.trim().length === 0) {
      item.status = 'error';
      item.error = 'Текст не найден или файл пуст';
    } else {
      item.result = text;
      item.status = 'completed';
    }
  } catch (error) {
    console.error(`Error processing ${item.file.name}:`, error);
    item.status = 'error';
    item.error = error.message;
  }

  renderFileList();
}

function downloadTxt(item) {
  const blob = new Blob([item.result], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = item.file.name.replace(/\.[^/.]+$/, "") + ".txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

convertAllBtn.addEventListener('click', () => {
  filesToProcess.filter(f => f.status === 'pending' || f.status === 'error').forEach(processFile);
});

// ========== SPLITTER SECTION ==========
const splitDropZone = document.getElementById('split-drop-zone');
const splitFileInput = document.getElementById('split-file-input');
const splitControl = document.getElementById('split-control');
const splitResults = document.getElementById('split-results');
const partsSlider = document.getElementById('parts-slider');
const partsValue = document.getElementById('parts-value');
const partsPreview = document.getElementById('parts-preview');
const splitBtn = document.getElementById('split-btn');
const splitFilename = document.querySelector('.split-filename');
const splitFilesize = document.querySelector('.split-filesize');
const splitFilesList = document.getElementById('split-files-list');
const downloadAllSplits = document.getElementById('download-all-splits');
const resetSplitter = document.getElementById('reset-splitter');

let currentTextFile = null;
let currentTextContent = '';
let splitParts = [];

// Splitter drag and drop
splitDropZone.addEventListener('click', () => splitFileInput.click());

splitDropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  splitDropZone.classList.add('drag-over');
});

splitDropZone.addEventListener('dragleave', () => {
  splitDropZone.classList.remove('drag-over');
});

splitDropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  splitDropZone.classList.remove('drag-over');
  handleSplitFile(e.dataTransfer.files);
});

splitFileInput.addEventListener('change', (e) => {
  handleSplitFile(e.target.files);
});

async function handleSplitFile(files) {
  if (files.length === 0) return;

  const file = files[0];
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext !== 'txt') {
    alert('Пожалуйста, выберите TXT файл');
    return;
  }

  currentTextFile = file;

  try {
    currentTextContent = await file.text();

    splitFilename.textContent = file.name;
    splitFilesize.textContent = `${(file.size / 1024).toFixed(1)} KB`;

    splitControl.style.display = 'block';
    splitResults.style.display = 'none';

    updatePartsPreview();
  } catch (error) {
    console.error('Error reading file:', error);
    alert('Ошибка при чтении файла');
  }
}

// Slider interaction
partsSlider.addEventListener('input', (e) => {
  partsValue.textContent = e.target.value;
  updatePartsPreview();
});

function updatePartsPreview() {
  const parts = parseInt(partsSlider.value);
  partsPreview.innerHTML = '';

  for (let i = 0; i < parts; i++) {
    const div = document.createElement('div');
    div.className = 'part-preview';
    div.style.setProperty('--i', i);
    div.textContent = `Часть ${i + 1}`;
    partsPreview.appendChild(div);
  }
}

// Split button
splitBtn.addEventListener('click', () => {
  const parts = parseInt(partsSlider.value);

  try {
    splitParts = splitText(currentTextContent, parts);
    const downloadables = createDownloadableParts(splitParts, currentTextFile.name);

    renderSplitResults(downloadables);

    splitControl.style.display = 'none';
    splitResults.style.display = 'block';
  } catch (error) {
    console.error('Error splitting file:', error);
    alert('Ошибка при разделении файла');
  }
});

function renderSplitResults(downloadables) {
  splitFilesList.innerHTML = '';

  downloadables.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'file-item';
    div.innerHTML = `
      <div class="file-info">
        <span class="file-name">${item.fileName}</span>
        <span class="file-meta">
          ${(item.blob.size / 1024).toFixed(1)} KB | Часть ${index + 1} из ${downloadables.length}
        </span>
      </div>
      <div class="file-actions">
        <button class="download-btn" data-index="${index}">Скачать</button>
      </div>
    `;
    splitFilesList.appendChild(div);
  });

  // Attach download listeners
  document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      downloadSplitPart(downloadables[index]);
    });
  });
}

function downloadSplitPart(item) {
  const url = URL.createObjectURL(item.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = item.fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Download all splits
downloadAllSplits.addEventListener('click', () => {
  const downloadables = createDownloadableParts(splitParts, currentTextFile.name);
  downloadables.forEach(item => downloadSplitPart(item));
});

// Reset splitter
resetSplitter.addEventListener('click', () => {
  currentTextFile = null;
  currentTextContent = '';
  splitParts = [];
  splitControl.style.display = 'none';
  splitResults.style.display = 'none';
  splitFileInput.value = '';
  partsSlider.value = 2;
  partsValue.textContent = '2';
  updatePartsPreview();
});
