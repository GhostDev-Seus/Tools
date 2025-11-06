function generarComando() {
  // Limpiar resultados anteriores
  const resultado = document.getElementById("resultado");
  const errorDiv = document.getElementById("error");
  resultado.style.display = "none";
  errorDiv.textContent = "";

  // Obtener valores
  const timeInput = document.getElementById("shutdownTime").value;
  const action = document.getElementById("action").value;

  if (!timeInput) {
    errorDiv.textContent = "Por favor, selecciona una hora.";
    return;
  }

  const [horas, minutos] = timeInput.split(":").map(Number);
  const now = new Date();
  let targetDate = new Date();
  targetDate.setHours(horas, minutos, 0, 0);

  // Si ya pasó, programa para mañana
  if (targetDate <= now) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  // Calcular tiempo en segundos
  const diffSeconds = Math.floor((targetDate - now) / 1000);

  // Generar comando según acción
  const actionText = action === 's' ? 'Apagar' : 'Reiniciar';
  const command = `shutdown -${action} -t ${diffSeconds}`;

  // Mostrar resultado
  resultado.innerHTML = `
    <strong>Comando generado (${actionText}):</strong><br>
    <span>${command}</span><br>
    <button class="copy-btn" onclick="copiarComando(this)">📋 Copiar</button>
  `;
  resultado.style.display = "block";
}

// Función para copiar el comando desde el botón
function copiarComando(button) {
  const command = button.parentElement.querySelector("span").textContent;
  navigator.clipboard.writeText(command).then(() => {
    button.textContent = "✅ Copiado";
    setTimeout(() => {
      button.textContent = "📋 Copiar";
    }, 2000);
  }).catch(err => {
    console.error("Error al copiar:", err);
    button.textContent = "❌ Error";
  });
}