// ALGORITMO DE COMPARACIÓN
// =========================================
function compareCode() {
    const lines1 = AppState.code1.split('\n');
    const lines2 = AppState.code2.split('\n');
    
    // Resetear contadores
    AppState.differences = { added: 0, removed: 0, modified: 0 };
    
    // Algoritmo de diff simple (línea por línea)
    const maxLines = Math.max(lines1.length, lines2.length);
    const result1 = [];
    const result2 = [];
    
    for (let i = 0; i < maxLines; i++) {
        const line1 = lines1[i] !== undefined ? lines1[i] : '';
        const line2 = lines2[i] !== undefined ? lines2[i] : '';
        
        if (line1 === line2) {
            // Líneas idénticas
            result1.push({ content: line1, type: 'unchanged' });
            result2.push({ content: line2, type: 'unchanged' });
        } else if (line1 && !line2) {
            // Línea eliminada
            result1.push({ content: line1, type: 'removed' });
            result2.push({ content: '', type: 'empty' });
            AppState.differences.removed++;
        } else if (!line1 && line2) {
            // Línea añadida
            result1.push({ content: '', type: 'empty' });
            result2.push({ content: line2, type: 'added' });
            AppState.differences.added++;
        } else {
            // Línea modificada
            result1.push({ content: line1, type: 'modified' });
            result2.push({ content: line2, type: 'modified' });
            AppState.differences.modified++;
        }
    }
    
    return { result1, result2 };
}

// =========================================
// RENDERIZADO DE CÓDIGO
// =========================================
function renderComparison(result1, result2) {
    // Preparar el código con etiquetas de diferencia
    const code1HTML = result1.map(line => {
        if (line.type === 'unchanged') {
            return escapeHtml(line.content);
        } else if (line.type === 'removed') {
            return `<span class="line-removed">${escapeHtml(line.content)}</span>`;
        } else if (line.type === 'modified') {
            return `<span class="line-modified">${escapeHtml(line.content)}</span>`;
        } else {
            return ''; // Línea vacía
        }
    }).join('\n');
    
    const code2HTML = result2.map(line => {
        if (line.type === 'unchanged') {
            return escapeHtml(line.content);
        } else if (line.type === 'added') {
            return `<span class="line-added">${escapeHtml(line.content)}</span>`;
        } else if (line.type === 'modified') {
            return `<span class="line-modified">${escapeHtml(line.content)}</span>`;
        } else {
            return ''; // Línea vacía
        }
    }).join('\n');
    
    // Actualizar el DOM
    DOM.leftCode.textContent = AppState.code1;
    DOM.rightCode.textContent = AppState.code2;
    
    // Aplicar clase de lenguaje
    DOM.leftCode.className = `language-${AppState.language}`;
    DOM.rightCode.className = `language-${AppState.language}`;
    
    // Aplicar syntax highlighting con Prism
    Prism.highlightElement(DOM.leftCode);
    Prism.highlightElement(DOM.rightCode);
    
    // Después del highlighting, aplicar los estilos de diferencias
    setTimeout(() => {
        applyDiffStyles(result1, result2);
    }, 50);
}

// =========================================
// APLICAR ESTILOS DE DIFERENCIAS
// =========================================
function applyDiffStyles(result1, result2) {
    // Esta función añade clases CSS a las líneas después del highlighting de Prism
    const leftLines = DOM.leftCode.parentElement.querySelectorAll('.line-numbers-rows > span');
    const rightLines = DOM.rightCode.parentElement.querySelectorAll('.line-numbers-rows > span');
    
    // Añadir indicadores visuales en los números de línea
    result1.forEach((line, index) => {
        if (leftLines[index]) {
            if (line.type === 'removed') {
                leftLines[index].style.background = 'var(--diff-removed-bg)';
                leftLines[index].style.borderLeft = '3px solid var(--diff-removed-border)';
            } else if (line.type === 'modified') {
                leftLines[index].style.background = 'var(--diff-modified-bg)';
                leftLines[index].style.borderLeft = '3px solid var(--diff-modified-border)';
            }
        }
    });
    
    result2.forEach((line, index) => {
        if (rightLines[index]) {
            if (line.type === 'added') {
                rightLines[index].style.background = 'var(--diff-added-bg)';
                rightLines[index].style.borderLeft = '3px solid var(--diff-added-border)';
            } else if (line.type === 'modified') {
                rightLines[index].style.background = 'var(--diff-modified-bg)';
                rightLines[index].style.borderLeft = '3px solid var(--diff-modified-border)';
            }
        }
    });
}

// =========================================
// ACTUALIZAR ESTADÍSTICAS
// =========================================
function updateStats() {
    DOM.addedLines.textContent = AppState.differences.added;
    DOM.removedLines.textContent = AppState.differences.removed;
    DOM.modifiedLines.textContent = AppState.differences.modified;
    
    // Mostrar sección de stats
    DOM.stats.style.display = 'grid';
}

// =========================================
// HANDLERS DE EVENTOS
// =========================================
function handleCompare() {
    // Validar que ambos campos tengan contenido
    if (!AppState.code1.trim() && !AppState.code2.trim()) {
        showToast('Por favor, ingresa código en ambos campos', 'error');
        return;
    }
    
    // Realizar comparación
    const { result1, result2 } = compareCode();
    
    // Renderizar resultados
    renderComparison(result1, result2);
    
    // Actualizar estadísticas
    updateStats();
    
    // Mostrar resultado
    DOM.comparisonResult.style.display = 'block';
    
    // Scroll suave al resultado
    setTimeout(() => {
        DOM.comparisonResult.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 100);
    
    showToast('Comparación completada exitosamente', 'success');
}

function handleClear() {
    // Limpiar campos
    DOM.code1.value = '';
    DOM.code2.value = '';
    AppState.code1 = '';
    AppState.code2 = '';
    
    // Ocultar resultados
    DOM.comparisonResult.style.display = 'none';
    DOM.stats.style.display = 'none';
    
    // Resetear diferencias
    AppState.differences = { added: 0, removed: 0, modified: 0 };
    
    showToast('Campos limpiados', 'success');
}

function handleExport() {
    // Generar diff en formato texto
    const lines1 = AppState.code1.split('\n');
    const lines2 = AppState.code2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    
    let diffText = '=== COMPARACIÓN DE CÓDIGO ===\n\n';
    diffText += `Lenguaje: ${AppState.language}\n`;
    diffText += `Fecha: ${new Date().toLocaleString()}\n\n`;
    diffText += `Estadísticas:\n`;
    diffText += `- Líneas agregadas: ${AppState.differences.added}\n`;
    diffText += `- Líneas eliminadas: ${AppState.differences.removed}\n`;
    diffText += `- Líneas modificadas: ${AppState.differences.modified}\n\n`;
    diffText += '='.repeat(50) + '\n\n';
    
    for (let i = 0; i < maxLines; i++) {
        const line1 = lines1[i] !== undefined ? lines1[i] : '';
        const line2 = lines2[i] !== undefined ? lines2[i] : '';
        
        if (line1 === line2) {
            diffText += `  ${i + 1}: ${line1}\n`;
        } else if (line1 && !line2) {
            diffText += `- ${i + 1}: ${line1}\n`;
        } else if (!line1 && line2) {
            diffText += `+ ${i + 1}: ${line2}\n`;
        } else {
            diffText += `- ${i + 1}: ${line1}\n`;
            diffText += `+ ${i + 1}: ${line2}\n`;
        }
    }
    
    // Descargar como archivo
    downloadFile(diffText, `diff-${Date.now()}.txt`);
    
    showToast('Diff exportado correctamente', 'success');
}

function handleCopy(e) {
    const targetId = e.currentTarget.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement && targetElement.value) {
        copyToClipboard(targetElement.value);
        showToast('Código copiado al portapapeles', 'success');
    } else {
        showToast('No hay código para copiar', 'error');
    }
}

// =========================================
// UTILIDADES
// =========================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback para navegadores antiguos
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function showToast(message, type = 'info') {
    DOM.toast.textContent = message;
    DOM.toast.className = `toast ${type}`;
    
    // Mostrar toast
    setTimeout(() => {
        DOM.toast.classList.add('show');
    }, 10);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        DOM.toast.classList.remove('show');
    }, 3000);
}

// =========================================
// CÓDIGO DE EJEMPLO (OPCIONAL)
// =========================================
function loadExampleCode() {
    // Puedes comentar esta función si no quieres código de ejemplo
    const example1 = `function calculateSum(a, b) {
    return a + b;
}

const result = calculateSum(5, 10);
console.log(result);`;

    const example2 = `function calculateSum(a, b) {
    // Validación añadida
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('Los parámetros deben ser números');
    }
    return a + b;
}

const result = calculateSum(5, 10);
console.log('Resultado:', result);

// Nueva funcionalidad
function calculateProduct(a, b) {
    return a * b;
}`;

    // Descomentar para cargar ejemplos al inicio
    // DOM.code1.value = example1;
    // DOM.code2.value = example2;
    // AppState.code1 = example1;
    // AppState.code2 = example2;
}

// =========================================
// ALGORITMO DE DIFF AVANZADO (OPCIONAL)
// =========================================
/**
 * Implementación de algoritmo Longest Common Subsequence (LCS)
 * para una comparación más precisa
 */
function advancedDiff(text1, text2) {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    
    // Matriz LCS
    const m = lines1.length;
    const n = lines2.length;
    const lcs = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Construir matriz LCS
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (lines1[i - 1] === lines2[j - 1]) {
                lcs[i][j] = lcs[i - 1][j - 1] + 1;
            } else {
                lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
            }
        }
    }
    
    // Reconstruir diferencias
    const diff = [];
    let i = m, j = n;
    
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
            diff.unshift({ type: 'unchanged', line1: lines1[i - 1], line2: lines2[j - 1] });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
            diff.unshift({ type: 'added', line2: lines2[j - 1] });
            j--;
        } else if (i > 0 && (j === 0 || lcs[i][j - 1] < lcs[i - 1][j])) {
            diff.unshift({ type: 'removed', line1: lines1[i - 1] });
            i--;
        }
    }
    
    return diff;
}

// =========================================
// KEYBOARD SHORTCUTS
// =========================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter para comparar
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleCompare();
    }
    
    // Ctrl/Cmd + K para limpiar
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleClear();
    }
    
    // Ctrl/Cmd + S para exportar
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (DOM.comparisonResult.style.display !== 'none') {
            handleExport();
        }
    }
});

// =========================================
// INICIAR APLICACIÓN
// =========================================
document.addEventListener('DOMContentLoaded', init);

console.log('%c🚀 Comparador de Código Inicializado', 'color: #007bff; font-size: 16px; font-weight: bold;');
console.log('%cAtajos de teclado:', 'color: #6c757d; font-weight: bold;');
console.log('  • Ctrl/Cmd + Enter: Comparar código');
console.log('  • Ctrl/Cmd + K: Limpiar campos');
console.log('  • Ctrl/Cmd + S: Exportar diferencias');
```

---

## 📚 DOCUMENTACIÓN Y USO

### Estructura de archivos:
```
