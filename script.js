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

// Crear partículas flotantes
function createParticles() {
  // Crear contenedor de partículas si no existe
  let container = document.querySelector('.particles');
  if (!container) {
    container = document.createElement('div');
    container.className = 'particles';
    document.body.appendChild(container);
  }

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    particle.style.animationDuration = `${5 + Math.random() * 5}s`;
    particle.style.backgroundColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.3)`;
    container.appendChild(particle);
  }
}

// Ejecutar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
});