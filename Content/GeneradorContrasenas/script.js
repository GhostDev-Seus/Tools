// Elementos del DOM
const passwordOutput = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const checkboxes = {
  lowercase: document.getElementById('lowercase'),
  uppercase: document.getElementById('uppercase'),
  numbers: document.getElementById('numbers'),
  symbols: document.getElementById('symbols')
};
const messageEl = document.getElementById('message');

// Caracteres disponibles
const chars = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Actualizar valor de longitud mostrado
lengthSlider.addEventListener('input', () => {
  lengthValue.textContent = lengthSlider.value;
});

// Mostrar mensaje temporal
function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.className = `message mt-4 text-center min-h-6 ${
    isError ? 'text-red-600' : 'text-green-600'
  }`;
  if (!isError) {
    setTimeout(() => {
      if (messageEl.textContent === text) messageEl.textContent = '';
    }, 3000);
  }
}

// Generar contraseña segura
function generatePassword() {
  const length = parseInt(lengthSlider.value, 10);
  let charset = '';
  const mustInclude = [];

  // Validar al menos una opción seleccionada
  const anyChecked = Object.values(checkboxes).some(cb => cb.checked);
  if (!anyChecked) {
    showMessage('Selecciona al menos un tipo de carácter.', true);
    return;
  }

  // Construir charset y garantizar al menos un carácter de cada tipo
  if (checkboxes.lowercase.checked) {
    charset += chars.lowercase;
    mustInclude.push(chars.lowercase);
  }
  if (checkboxes.uppercase.checked) {
    charset += chars.uppercase;
    mustInclude.push(chars.uppercase);
  }
  if (checkboxes.numbers.checked) {
    charset += chars.numbers;
    mustInclude.push(chars.numbers);
  }
  if (checkboxes.symbols.checked) {
    charset += chars.symbols;
    mustInclude.push(chars.symbols);
  }

  // Generar valores aleatorios criptográficamente seguros
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  let password = '';

  // Asegurar al menos un carácter de cada grupo requerido
  for (let i = 0; i < mustInclude.length; i++) {
    const group = mustInclude[i];
    password += group[array[i] % group.length];
  }

  // Rellenar el resto
  for (let i = mustInclude.length; i < length; i++) {
    password += charset[array[i] % charset.length];
  }

  // Mezclar para evitar patrones
  password = password
    .split('')
    .sort(() => 0.5 - crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32)
    .join('');

  passwordOutput.value = password;
  showMessage('Contraseña generada ✅');
}

// Copiar al portapapeles
copyBtn.addEventListener('click', () => {
  if (passwordOutput.value) {
    navigator.clipboard.writeText(passwordOutput.value).then(() => {
      showMessage('Copiada al portapapeles ✅');
      copyBtn.innerHTML = '<i class="fas fa-check text-green-600"></i>';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fas fa-copy text-gray-600"></i>';
      }, 2000);
    });
  }
});

   // Ejecutar Boton menu inicio
    
    document.getElementById("Menu").addEventListener("click", function () {
    var url = 'https://tools-y72x.onrender.com/';
    window.location.href = url; // Redirige a la URL
    });

// Eventos
generateBtn.addEventListener('click', generatePassword);

// Generar contraseña inicial al cargar
document.addEventListener('DOMContentLoaded', generatePassword);