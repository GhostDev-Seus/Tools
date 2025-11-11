// Elementos del DOM
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const cleanBtn = document.getElementById('cleanBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const messageEl = document.getElementById('message');
const messageText = document.getElementById('messageText');

// Función para remover caracteres especiales
function removeSpecialChars(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

// Actualizar resultado
function updateOutput() {
  const input = inputText.value;
  if (input) {
    outputText.value = removeSpecialChars(input);
    showMessage('Texto limpio generado ✅', 'info');
  } else {
    outputText.value = '';
  }
}

// Mostrar mensaje
function showMessage(text, type = 'info') {
  messageText.textContent = text;
  messageEl.className = `alert alert-${type} d-block`;
  setTimeout(() => {
    messageEl.classList.add('d-none');
  }, 3000);
}

// Limpiar todos los campos
function clearAll() {
  inputText.value = '';
  outputText.value = '';
  inputText.focus();
  showMessage('Campos limpiados ✨', 'secondary');
}

// Copiar al portapapeles
function copyToClipboard() {
  if (outputText.value) {
    navigator.clipboard.writeText(outputText.value).then(() => {
      showMessage('Copiado al portapapeles ✅', 'success');
    }).catch(() => {
      showMessage('No se pudo copiar ❌', 'danger');
    });
  } else {
    showMessage('No hay texto para copiar ❌', 'warning');
  }
}

// Eventos
cleanBtn.addEventListener('click', updateOutput);
copyBtn.addEventListener('click', copyToClipboard);
clearBtn.addEventListener('click', clearAll);

// Actualizar en tiempo real
inputText.addEventListener('input', updateOutput);

// Atajo de teclado: Ctrl+Enter para limpiar
inputText.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    updateOutput();
  }
});