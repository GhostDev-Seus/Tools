// script.js

// Elementos del DOM
const leftCodeInput = document.getElementById('leftCode');
const rightCodeInput = document.getElementById('rightCode');
const leftOutput = document.getElementById('leftOutput');
const rightOutput = document.getElementById('rightOutput');
const languageSelect = document.getElementById('language');
const swapBtn = document.getElementById('swapBtn');
const clearBtn = document.getElementById('clearBtn');
const copyLeftBtn = document.getElementById('copyLeftBtn');
const copyRightBtn = document.getElementById('copyRightBtn');

// Actualizar salida de código con Prism.js
function updateCodeOutput() {
  const language = languageSelect.value;
  const leftCode = leftCodeInput.value;
  const rightCode = rightCodeInput.value;

  leftOutput.className = `language-${language}`;
  leftOutput.textContent = leftCode;
  Prism.highlightElement(leftOutput);

  rightOutput.className = `language-${language}`;
  rightOutput.textContent = rightCode;
  Prism.highlightElement(rightOutput);
}

// Intercambiar código entre paneles
swapBtn.addEventListener('click', () => {
  const leftValue = leftCodeInput.value;
  leftCodeInput.value = rightCodeInput.value;
  rightCodeInput.value = leftValue;
  updateCodeOutput();
});

// Limpiar todos los campos
clearBtn.addEventListener('click', () => {
  leftCodeInput.value = '';
  rightCodeInput.value = '';
  updateCodeOutput();
});

// Copiar código del panel izquierdo
copyLeftBtn.addEventListener('click', () => {
  if (leftCodeInput.value) {
    navigator.clipboard.writeText(leftCodeInput.value).then(() => {
      showMessage('Código izquierdo copiado ✅', 'success');
    });
  }
});

// Copiar código del panel derecho
copyRightBtn.addEventListener('click', () => {
  if (rightCodeInput.value) {
    navigator.clipboard.writeText(rightCodeInput.value).then(() => {
      showMessage('Código derecho copiado ✅', 'success');
    });
  }
});

// Cambiar lenguaje
languageSelect.addEventListener('change', updateCodeOutput);

// Actualizar código al escribir
leftCodeInput.addEventListener('input', updateCodeOutput);
rightCodeInput.addEventListener('input', updateCodeOutput);

// Mensajes
function showMessage(text, type = 'info') {
  const message = document.createElement('div');
  message.className = `alert alert-${type}`;
  message.textContent = text;
  message.style.position = 'fixed';
  message.style.top = '20px';
  message.style.right = '20px';
  message.style.padding = '12px 16px';
  message.style.borderRadius = '8px';
  message.style.backgroundColor = type === 'success' ? '#2ecc71' : '#e74c3c';
  message.style.color = 'white';
  message.style.zIndex = '1000';
  message.style.fontWeight = '600';
  message.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
}

// Inicializar
updateCodeOutput();