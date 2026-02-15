import './style.css';

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
        ${item.status === 'completed' ? `<button class="convert-btn" style="background: var(--accent);" data-id="${item.id}">Скачать TXT</button>` : ''}
      </div>
    `;
    fileListContainer.appendChild(div);
  });

  // Re-attach listeners
  document.querySelectorAll('.convert-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      const item = filesToProcess.find(f => f.id === id);
      if (item.status === 'pending') {
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
  filesToProcess.filter(f => f.status === 'pending').forEach(processFile);
});
