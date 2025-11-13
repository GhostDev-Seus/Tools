// script.js

// Animar tarjetas al hacer scroll
const toolCards = document.querySelectorAll('.tool-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1
});

toolCards.forEach(card => {
  observer.observe(card);
});

// Detectar si el sistema está en modo oscuro
function isDarkMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Crear partículas flotantes adaptativas
function createParticles() {
  // Crear contenedor de partículas si no existe
  let container = document.querySelector('.particles');
  if (!container) {
    container = document.createElement('div');
    container.className = 'particles';
    document.body.appendChild(container);
  }

  // Determinar color base según el modo
  const isDark = isDarkMode();
  const baseColor = isDark ? [106, 90, 205] : [52, 152, 219]; // Morado neón o azul

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    particle.style.animationDuration = `${5 + Math.random() * 5}s`;

    // Variar ligeramente el color
    const variation = 30;
    const r = baseColor[0] + Math.floor(Math.random() * variation) - variation / 2;
    const g = baseColor[1] + Math.floor(Math.random() * variation) - variation / 2;
    const b = baseColor[2] + Math.floor(Math.random() * variation) - variation / 2;

    particle.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${isDark ? 0.4 : 0.3})`;
    container.appendChild(particle);
  }
}

// Escuchar cambios de tema del sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  // Eliminar partículas existentes
  const existingParticles = document.querySelector('.particles');
  if (existingParticles) {
    existingParticles.remove();
  }
  // Crear nuevas partículas con el nuevo color
  createParticles();
});

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
});