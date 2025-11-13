// ===== UTILIDADES =====
const sanitize = (str) => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

const escapeHTML = (str) => str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

// ===== ALGORITMO DE DIFF (LCS) =====
function computeDiff(oldLines, newLines) {
  const m = oldLines.length;
  const n = newLines.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

  // Construir tabla DP
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const diff = [];
  let i = m, j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      diff.push({ type: 'equal', old: oldLines[i - 1], new: newLines[j - 1] });
      i--; j--;
    } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j])) {
      diff.push({ type: 'removed', old: oldLines[i - 1] });
      i--;
    } else if (j > 0 && (i === 0 || dp[i][j] === dp[i][j - 1])) {
      diff.push({ type: 'added', new: newLines[j - 1] });
      j--;
    } else {
      diff.push({ type: 'modified', old: oldLines[i - 1], new: newLines[j - 1] });
      i--; j--;
    }
  }

  return diff.reverse();
}

// ===== RENDERIZAR LÍNEAS =====
function renderSide(container, lineNumbersEl, lines, side) {
  container.innerHTML = '';
  lineNumbersEl.innerHTML = '';

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Número de línea
    const numSpan = document.createElement('div');
    numSpan.textContent = lineNum;
    lineNumbersEl.appendChild(numSpan);

    // Línea de código
    const lineEl = document.createElement('div');
    lineEl.className = `line ${line.type || 'equal'}`;
    
    let content = '';
    if (line.type === 'removed' && side === 'left') {
      content = escapeHTML(line.old || '');
    } else if (line.type === 'added' && side === 'right') {
      content = escapeHTML(line.new || '');
    } else if (line.type === 'modified') {
      content = escapeHTML(side === 'left' ? line.old : line.new);
    } else if (line.type === 'equal') {
      content = escapeHTML(line[side === 'left' ? 'old' : 'new'] || '');
    }

    lineEl.innerHTML = content || '&nbsp;';
    container.appendChild(lineEl);
  });
}

// ===== SINCRONIZAR SCROLL =====
function syncScroll(source, target) {
  const ratio = source.scrollTop / (source.scrollHeight - source.clientHeight);
  target.scrollTop = ratio * (target.scrollHeight - target.clientHeight);
}

// ===== ELEMENTOS DOM =====
const leftInput = document.getElementById('leftInput');
const rightInput = document.getElementById('rightInput');
const leftCode = document.getElementById('leftCode');
const rightCode = document.getElementById('rightCode');
const leftLineNumbers = document.getElementById('leftLineNumbers');
const rightLineNumbers = document.getElementById('rightLineNumbers');

// ===== ACTUALIZAR DIFF =====
function updateDiff() {
  const oldCode = leftInput.value;
  const newCode = rightInput.value;

  const oldLines = oldCode.split('\n');
  const newLines = newCode.split('\n');

  const diff = computeDiff(oldLines, newLines);

  // Preparar líneas para cada lado (ocultar opuestas)
  const leftLines = diff.map(d => ({ 
    ...d, 
    type: d.type === 'added' ? 'equal' : d.type 
  }));
  const rightLines = diff.map(d => ({ 
    ...d, 
    type: d.type === 'removed' ? 'equal' : d.type 
  }));

  renderSide(leftCode, leftLineNumbers, leftLines, 'left');
  renderSide(rightCode, rightLineNumbers, rightLines, 'right');
}

// ===== EVENTOS =====
leftCode.addEventListener('scroll', () => syncScroll(leftCode, rightCode));
rightCode.addEventListener('scroll', () => syncScroll(rightCode, leftCode));

let timeout;
[leftInput, rightInput].forEach(input => {
  input.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(updateDiff, 300); // Debounce
  });
});

// ===== INICIALIZACIÓN =====
window.addEventListener('load', () => {
  leftInput.value = `function greet(name) {\n  console.log("Hello, " + name);\n}\n\ngreet("World");`;
  rightInput.value = `function greet(name) {\n  return "Hello, " + name + "!";\n}\n\nconsole.log(greet("World"));`;
  updateDiff();
});