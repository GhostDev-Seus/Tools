const leftCode = document.getElementById('left-code');
const rightCode = document.getElementById('right-code');
const leftOutput = document.querySelector('#left-output code');
const rightOutput = document.querySelector('#right-output code');
const diffOutput = document.getElementById('diff-output');
const compareBtn = document.getElementById('compare-btn');
const inlineToggle = document.getElementById('inline-toggle');

// Alternar entre vista de editor y vista de salida
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

function highlightSyntax() {
  Prism.highlightElement(leftOutput);
  Prism.highlightElement(rightOutput);
}

function computeDiff() {
  const left = leftCode.value;
  const right = rightCode.value;

  // Usaremos una librería de diff como `diff` (importar con CDN o npm)
  // Aquí simularemos el proceso con un ejemplo básico
  const diff = window.diff ? window.diff.diffLines(left, right) : simulateDiff(left, right);

  let output = '';
  diff.forEach(part => {
    const lines = part.value.split('\n').filter(l => l !== '');
    if (part.added) {
      lines.forEach(line => {
        output += `<div class="diff-line add">+ ${line}</div>`;
      });
    } else if (part.removed) {
      lines.forEach(line => {
        output += `<div class="diff-line del">- ${line}</div>`;
      });
    } else {
      lines.forEach(line => {
        output += `<div>${line}</div>`;
      });
    }
  });

  diffOutput.innerHTML = output;
}

// Simulación de diff si no se usa librería externa
function simulateDiff(left, right) {
  return [
    { value: left, removed: true },
    { value: right, added: true }
  ];
}

compareBtn.addEventListener('click', () => {
  leftOutput.textContent = leftCode.value;
  rightOutput.textContent = rightCode.value;
  highlightSyntax();
  computeDiff();
});

// Inicializar
toggleEditors();