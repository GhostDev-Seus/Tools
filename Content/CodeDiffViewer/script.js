// =============================
// Funciones auxiliares
// =============================

function highlightCode(code, language = 'javascript') {
  if (language === 'javascript' || language === 'js') {
    return code
      .replace(/(function|const|let|var|if|else|for|while|return|class|import|export|async|await)/g, '<span class="token keyword">$1</span>')
      .replace(/(".*?"|'.*?')/g, '<span class="token string">$1</span>')
      .replace(/(\d+)/g, '<span class="token number">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="token comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="token comment">$1</span>');
  }
  return code;
}

function simulateDiff(left, right) {
  const leftLines = left.split('\n');
  const rightLines = right.split('\n');
  const diff = [];

  let i = 0, j = 0;

  while (i < leftLines.length && j < rightLines.length) {
    if (leftLines[i] === rightLines[j]) {
      diff.push({ type: 'eq', value: leftLines[i] });
      i++;
      j++;
    } else {
      // Buscar coincidencia hacia adelante en derecha
      let foundMatch = false;
      for (let k = j + 1; k < rightLines.length; k++) {
        if (leftLines[i] === rightLines[k]) {
          // Añadir líneas eliminadas
          for (let l = j; l < k; l++) {
            diff.push({ type: 'del', value: rightLines[l] });
          }
          j = k;
          foundMatch = true;
          break;
        }
      }

      if (!foundMatch) {
        diff.push({ type: 'del', value: leftLines[i] });
        i++;
      } else {
        // Ya avanzamos j, así que no incrementamos aquí
      }
    }
  }

  // Añadir restantes
  while (i < leftLines.length) {
    diff.push({ type: 'del', value: leftLines[i] });
    i++;
  }
  while (j < rightLines.length) {
    diff.push({ type: 'add', value: rightLines[j] });
    j++;
  }

  return diff;
}

// =============================
// Inicialización
// =============================

const leftCode = document.getElementById('left-code');
const rightCode = document.getElementById('right-code');
const leftOutput = document.querySelector('#left-output code');
const rightOutput = document.querySelector('#right-output code');
const diffOutput = document.getElementById('diff-output');
const compareBtn = document.getElementById('compare-btn');
const inlineToggle = document.getElementById('inline-toggle');

function toggleEditors() {
  const isInline = inlineToggle.checked;
  const textareas = document.querySelectorAll('textarea');
  const outputs = document.querySelectorAll('.output');

  if (isInline) {
    textareas.forEach(ta => ta.style.display = 'none');
    outputs.forEach(out => out.parentElement.style.display = 'block');
  } else {
    textareas.forEach(ta => ta.style.display = 'block');
    outputs.forEach(out => out.parentElement.style.display = 'none');
  }
}

inlineToggle.addEventListener('change', toggleEditors);

function updateOutputs() {
  const leftText = leftCode.value;
  const rightText = rightCode.value;

  leftOutput.innerHTML = highlightCode(leftText);
  rightOutput.innerHTML = highlightCode(rightText);

  // Actualizar vista de diff
  const diff = simulateDiff(leftText, rightText);
  let html = '';
  diff.forEach(part => {
    const cls = part.type === 'add' ? 'add' : part.type === 'del' ? 'del' : 'eq';
    html += `<div class="diff-line ${cls}">${part.type === 'add' ? '+' : part.type === 'del' ? '-' : ' '} ${part.value}</div>`;
  });
  diffOutput.innerHTML = html;
}

compareBtn.addEventListener('click', updateOutputs);

// Inicializar
toggleEditors();

// Ejemplo inicial
leftCode.value = `function suma(a, b) {
  return a + b;
}`;

rightCode.value = `function suma(a, b) {
  // Mejora: validación
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Ambos parámetros deben ser números');
  }
  return a + b;
}`;

updateOutputs();