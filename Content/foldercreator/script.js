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
const selectedFolderDisplay = document.getElementById('selectedFolderDisplay');

// Estructura de carpetas: árbol jerárquico
let folderStructure = [];
let selectedFolder = null;

// Actualizar árbol de carpetas
function updateFolderTree() {
  if (folderStructure.length === 0) {
    folderTree.innerHTML = '<div class="text-muted fst-italic">Aún no hay carpetas...</div>';
    commandOutput.textContent = '';
    return;
  }

  let html = '';
  let cmd = '';

  function renderFolder(folder, level = 0) {
    const indent = '&nbsp;'.repeat(level * 4);
    const isSelected = selectedFolder === folder.path;
    const className = `folder-item ${isSelected ? 'selected' : ''}`;
    html += `<div class="${className}" data-path="${folder.path}">${indent}📁 ${folder.name}</div>`;

    if (folder.children && folder.children.length > 0) {
      folder.children.forEach(child => renderFolder(child, level + 1));
    }
  }

  folderStructure.forEach(folder => renderFolder(folder));

  folderTree.innerHTML = html;

  // Actualizar comando
  function generateCommands(folders, parentPath = '') {
    folders.forEach(folder => {
      const fullPath = parentPath ? `${parentPath}\\${folder.name}` : folder.name;
      cmd += `mkdir "${fullPath}"\n`;
      if (folder.children && folder.children.length > 0) {
        generateCommands(folder.children, fullPath);
      }
    });
  }

  generateCommands(folderStructure);
  commandOutput.textContent = cmd.trim();

  // Añadir eventos a los elementos del árbol
  document.querySelectorAll('.folder-item').forEach(item => {
    item.addEventListener('click', () => {
      selectedFolder = item.dataset.path;
      selectedFolderDisplay.textContent = selectedFolder || 'Ninguna (raíz)';
      updateFolderTree();
    });
  });
}

// Agregar carpeta
function addFolder() {
  const name = folderNameInput.value.trim();
  if (!name) {
    showMessage('Ingresa un nombre de carpeta ❌', 'warning');
    return;
  }

  const newFolder = {
    name: name,
    path: selectedFolder ? `${selectedFolder}\\${name}` : name,
    children: []
  };

  if (selectedFolder) {
    // Buscar la carpeta padre en la estructura
    function findFolder(folders, path) {
      for (const folder of folders) {
        if (folder.path === path) return folder;
        if (folder.children) {
          const found = findFolder(folder.children, path);
          if (found) return found;
        }
      }
      return null;
    }

    const parentFolder = findFolder(folderStructure, selectedFolder);
    if (parentFolder) {
      parentFolder.children.push(newFolder);
    } else {
      folderStructure.push(newFolder);
    }
  } else {
    folderStructure.push(newFolder);
  }

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
  selectedFolder = null;
  selectedFolderDisplay.textContent = 'Ninguna (raíz)';
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

// Ejecutar Boton menu inicio

document.getElementById("Menu").addEventListener("click", function () {
var url = 'https://tools-y72x.onrender.com/';
window.location.href = url; // Redirige a la URL
});

// Inicializar
updateFolderTree();