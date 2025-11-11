// script.js

// Elementos del DOM
const inputSQL = document.getElementById('inputSQL');
const outputSQL = document.getElementById('outputSQL');
const formatBtn = document.getElementById('formatBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const messageEl = document.getElementById('message');
const messageText = document.getElementById('messageText');

// Palabras clave de SQL Server (en mayúsculas para detectar)
const sqlKeywords = [
  'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'JOIN', 'INNER JOIN', 'LEFT JOIN',
  'RIGHT JOIN', 'FULL OUTER JOIN', 'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE',
  'DISTINCT', 'TOP', 'UNION', 'UNION ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'AS',
  'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'VIEW', 'PROCEDURE',
  'FUNCTION', 'TRIGGER', 'DATABASE', 'USE', 'SET', 'INTO', 'VALUES', 'EXEC', 'EXECUTE'
];

// Formatear consulta SQL
function formatSQL(query) {
  if (!query.trim()) return '';

  // Convertir a mayúsculas para detectar keywords
  let formatted = query
    .replace(/\s+/g, ' ') // Unificar espacios
    .trim();

  // Separar por palabras clave y añadir saltos de línea
  sqlKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    formatted = formatted.replace(regex, `\n${keyword}`);
  });

  // Alinear cada línea con sangría
  const lines = formatted.split('\n');
  let indentLevel = 0;
  const result = [];

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    // Ajustar sangría
    if (line.includes('SELECT')) {
      indentLevel = 0;
    } else if (line.includes('FROM') || line.includes('WHERE') || line.includes('ORDER BY') || line.includes('GROUP BY')) {
      indentLevel = 1;
    }

    const indent = '  '.repeat(indentLevel);
    result.push(indent + line);
  });

  return result.join('\n').trim();
}

// Actualizar salida
function updateOutput() {
  const input = inputSQL.value;
  if (input) {
    const formatted = formatSQL(input);
    outputSQL.textContent = formatted;
    showMessage('Consulta formateada ✅', 'info');
  } else {
    outputSQL.textContent = '';
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

// Copiar al portapapeles
function copyToClipboard() {
  if (outputSQL.textContent) {
    navigator.clipboard.writeText(outputSQL.textContent).then(() => {
      showMessage('Copiado al portapapeles ✅', 'success');
    }).catch(() => {
      showMessage('No se pudo copiar ❌', 'danger');
    });
  } else {
    showMessage('No hay texto para copiar ❌', 'warning');
  }
}

// Limpiar campos
function clearAll() {
  inputSQL.value = '';
  outputSQL.textContent = '';
  inputSQL.focus();
  showMessage('Campos limpiados ✨', 'secondary');
}

// Eventos
formatBtn.addEventListener('click', updateOutput);
copyBtn.addEventListener('click', copyToClipboard);
clearBtn.addEventListener('click', clearAll);

// Atajo de teclado: Ctrl+Enter para formatear
inputSQL.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    updateOutput();
  }
});