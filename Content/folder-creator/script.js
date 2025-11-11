// script.js

// Elementos del DOM
const folderNameInput = document.getElementById('folderName');
const addFolderBtn = document.getElementById('addFolderBtn');
const folderTree = document.getElementById('folderTree');
const commandOutput = document.getElementById('commandOutput');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const messageEl = document.getElementById('message');
const messageText = document.getElementById('messageText');

// Estructura de carpetas
let folderStructure = [];

// Actualizar árbol de carpetas
function updateFolderTree() {
  if (folderStructure.length === 0) {
    folderTree.innerHTML = '<div class="text-muted fst-italic">Aún no hay carpetas...</div>';
    commandOutput.textContent = '';
    return;
  }

  let tree = '';
  let cmd = '';

  folderStructure.forEach(folder => {
    tree += `📁 ${folder}\n`;
    cmd += `mkdir "${folder}"\n`;
  });

  folderTree.textContent = tree.trim();
  commandOutput.textContent = cmd.trim();
}

// Agregar carpeta
function addFolder() {
  const name = folderNameInput.value.trim();
  if (!name) {
    showMessage('Ingresa un nombre de carpeta ❌', 'warning');
    return;
  }

  if (folderStructure.includes(name)) {
    showMessage('La carpeta ya existe ❌', 'danger');
    return;
  }

  folderStructure.push(name);
  folderNameInput.value = '';
  updateFolderTree();
  showMessage(`Carpeta "${name}" agregada ✅`, 'success');
}

// Mostrar mensaje
function showMessage(text, type = 'info') {
  messageText.textContent = text;
  messageEl.className = `alert alert-${type} d-block`;
  setTimeout(() => {
    messageEl.classList.add('d-none');
  }, 3000);
}

// Copiar comando al portapapeles
function copyToClipboard() {
  if (commandOutput.textContent) {
    navigator.clipboard.writeText(commandOutput.textContent).then(() => {
      showMessage('Comando copiado al portapapeles ✅', 'success');
    }).catch(() => {
      showMessage('No se pudo copiar ❌', 'danger');
    });
  } else {
    showMessage('No hay comando para copiar ❌', 'warning');
  }
}

// Limpiar todo
function clearAll() {
  folderStructure = [];
  folderNameInput.value = '';
  updateFolderTree();
  showMessage('Estructura limpiada ✨', 'secondary');
}

// Eventos
addFolderBtn.addEventListener('click', addFolder);
copyBtn.addEventListener('click', copyToClipboard);
clearBtn.addEventListener('click', clearAll);

// Atajo de teclado: Enter para agregar
folderNameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addFolder();
});