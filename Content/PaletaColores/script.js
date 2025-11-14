// script.js

const baseColorInput = document.getElementById('baseColor');
const baseColorValue = document.getElementById('baseColorValue');
const colorName = document.getElementById('colorName');
const colorWheel = document.getElementById('colorWheel');
const hslCircle = document.getElementById('hslCircle');
const hslValue = document.getElementById('hslValue');
const generateBtn = document.getElementById('generateBtn');
const copyAllBtn = document.getElementById('copyAllBtn');
const saveBtn = document.getElementById('saveBtn');
const messageEl = document.getElementById('message');
const messageText = document.getElementById('messageText');
const colorCards = document.querySelector('.color-cards');

// Colores predefinidos por nombre
const colorNames = [
  { hex: '#3498db', name: 'Azul Cerúleo' },
  { hex: '#e74c3c', name: 'Rojo Coral' },
  { hex: '#2ecc71', name: 'Verde Esmeralda' },
  { hex: '#f39c12', name: 'Naranja Dorado' },
  { hex: '#9b59b6', name: 'Morado Amatista' },
  { hex: '#1abc9c', name: 'Turquesa Profundo' },
  { hex: '#d35400', name: 'Naranja Tostado' },
  { hex: '#c0392b', name: 'Granate' },
  { hex: '#7f8c8d', name: 'Gris Plata' },
  { hex: '#2c3e50', name: 'Azul Noche' },
];

// Función para encontrar nombre de color
function findColorName(hex) {
  const match = colorNames.find(c => c.hex.toLowerCase() === hex.toLowerCase());
  return match ? match.name : 'Color Personalizado';
}

// Convertir HEX a RGB
function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

// Convertir RGB a HSL
function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  } else {
    h = s = 0;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Generar paleta de 5 colores (base + 4 derivados)
function generatePalette(baseHex) {
  const rgb = hexToRgb(baseHex);
  if (!rgb) return [];

  const { r, g, b } = rgb;

  const palette = [baseHex];

  // 1. Complementario (180°)
  const comp = rgbToHex(255 - r, 255 - g, 255 - b);
  palette.push(comp);

  // 2. Análogo 1 (+30°)
  const hsl = rgbToHsl(r, g, b);
  const h1 = (hsl.h + 30) % 360;
  const analog1 = hslToRgb(h1, hsl.s, hsl.l);
  palette.push(analog1);

  // 3. Análogo 2 (-30°)
  const h2 = (hsl.h - 30 + 360) % 360;
  const analog2 = hslToRgb(h2, hsl.s, hsl.l);
  palette.push(analog2);

  // 4. Triádico (120°)
  const h3 = (hsl.h + 120) % 360;
  const triadic = hslToRgb(h3, hsl.s, hsl.l);
  palette.push(triadic);

  return palette.slice(0, 5);
}

// Convertir HSL a HEX
function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}

// Convertir RGB a HEX
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Renderizar paleta en la rueda
function renderColorWheel(colors) {
  colorWheel.innerHTML = '';
  const angleStep = 360 / colors.length;

  colors.forEach((color, index) => {
    const segment = document.createElement('div');
    segment.className = 'color-segment';
    segment.style.backgroundColor = color;
    segment.style.transform = `rotate(${index * angleStep}deg)`;
    segment.style.clipPath = `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((index * angleStep) * Math.PI / 180)}% ${50 - 50 * Math.sin((index * angleStep) * Math.PI / 180)}%)`;

    const colorCode = document.createElement('span');
    colorCode.className = 'color-code';
    colorCode.textContent = color.toUpperCase();
    segment.appendChild(colorCode);

    segment.addEventListener('click', () => {
      copyToClipboard(color);
      createParticleEffect(event.clientX, event.clientY, color);
    });

    colorWheel.appendChild(segment);
  });
}

// Renderizar tarjetas de colores
function renderColorCards(colors) {
  colorCards.innerHTML = '';
  colors.forEach(color => {
    const card = document.createElement('div');
    card.className = 'color-card';
    card.style.backgroundColor = color;
    card.innerHTML = `
      <div class="color-code">${color.toUpperCase()}</div>
    `;
    card.addEventListener('click', () => {
      copyToClipboard(color);
      createParticleEffect(event.clientX, event.clientY, color);
    });
    colorCards.appendChild(card);
  });
}

// Crear efecto de partículas al copiar
function createParticleEffect(x, y, color) {
  const container = document.createElement('div');
  container.className = 'particle-effect';
  container.style.position = 'fixed';
  container.style.pointerEvents = 'none';
  container.style.left = `${x}px`;
  container.style.top = `${y}px`;
  document.body.appendChild(container);

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('span');
    particle.style.backgroundColor = color;
    particle.style.left = '0';
    particle.style.top = '0';
    particle.style.setProperty('--x', `${Math.random() * 100 - 50}px`);
    particle.style.setProperty('--y', `${Math.random() * 100 - 50}px`);
    container.appendChild(particle);
  }

  setTimeout(() => container.remove(), 1000);
}

// Copiar al portapapeles
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showMessage(`Copiado: ${text} ✅`, 'success');
  });
}

// Mostrar mensaje
function showMessage(text, type = 'info') {
  messageText.textContent = text;
  messageEl.className = `alert alert-${type} d-block`;
  setTimeout(() => messageEl.classList.add('d-none'), 3000);
}

// Actualizar HSL
function updateHSL(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hslValue.textContent = `H: ${hsl.h}°, S: ${hsl.s}%, L: ${hsl.l}%`;
  hslCircle.style.background = `conic-gradient(from ${hsl.h}deg, ${hex}, ${hex})`;
}

// Generar nueva paleta
function generateNewPalette() {
  const baseHex = baseColorInput.value;
  const palette = generatePalette(baseHex);
  const colorNameText = findColorName(baseHex);

  renderColorWheel(palette);
  renderColorCards(palette);
  baseColorValue.textContent = baseHex.toUpperCase();
  colorName.textContent = colorNameText;
  updateHSL(baseHex);

  showMessage('Nueva paleta generada ✅', 'success');
}

// Eventos
baseColorInput.addEventListener('input', () => {
  generateNewPalette();
});

generateBtn.addEventListener('click', generateNewPalette);

copyAllBtn.addEventListener('click', () => {
  const palette = generatePalette(baseColorInput.value);
  navigator.clipboard.writeText(palette.join('\n')).then(() => {
    showMessage('Paleta copiada ✅', 'success');
  });
});

saveBtn.addEventListener('click', () => {
  const baseHex = baseColorInput.value;
  const name = findColorName(baseHex);
  localStorage.setItem('chromaFlow_favorite', JSON.stringify({ hex: baseHex, name }));
  showMessage(`Favorito guardado: ${name} ✅`, 'success');
});

// Cargar favorito guardado
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('chromaFlow_favorite');
  if (saved) {
    const { hex, name } = JSON.parse(saved);
    baseColorInput.value = hex;
    colorName.textContent = name;
    baseColorValue.textContent = hex.toUpperCase();
  }
  generateNewPalette();
});

// Crear partículas flotantes al cargar
function createFloatingParticles() {
  const container = document.querySelector('.particles');
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 70%)`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    particle.style.animationDuration = `${5 + Math.random() * 5}s`;
    container.appendChild(particle);
  }
}

 
    // Ejecutar Boton menu inicio
    
    document.getElementById("Menu").addEventListener("click", function () {
    var url = 'https://tools-y72x.onrender.com/';
    window.location.href = url; // Redirige a la URL
    });

createFloatingParticles();