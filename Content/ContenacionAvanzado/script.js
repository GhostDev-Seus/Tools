document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const elements = {
        prefix: document.getElementById('prefix'),
        suffix: document.getElementById('suffix'),
        inputText: document.getElementById('input-text'),
        resultText: document.getElementById('result-text'),
        concatenateBtn: document.getElementById('concatenate-button'),
        clearBtn: document.getElementById('clear-button'),
        copyBtn: document.getElementById('copy-button'),
        horizontalRadio: document.getElementById('horizontal'),
        separatorSelect: document.getElementById('separator'),
        quoteType: document.getElementById('quote-type'),
        addFinalSep: document.getElementById('add-final-separator'),
        themeToggle: document.getElementById('theme-toggle'),
        inputLines: document.getElementById('input-lines'),
        inputChars: document.getElementById('input-chars'),
        resultLines: document.getElementById('result-lines'),
        resultChars: document.getElementById('result-chars'),
        body: document.body
    };

    // --- CONFIGURACIÓN BASE PARA SWEETALERT2 ---
    const swalOptions = {
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            timerProgressBar: 'custom-swal-progress-bar',
        },
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    };

    // --- LÓGICA DE TEMAS (CLARO/OSCURO) ---
    /**
     * Aplica el tema seleccionado y lo persiste.
     * @param {string} theme - 'dark' o 'light'.
     */
    function applyTheme(theme) {
        elements.body.classList.toggle('dark-theme', theme === 'dark');
        elements.themeToggle.checked = theme === 'dark';
        localStorage.setItem('theme', theme);
    }

    // --- FUNCIONES AUXILIARES ---
    /**
     * Actualiza el estado del botón de copiar.
     */
    function updateCopyButtonState() {
        elements.copyBtn.disabled = !elements.resultText.value.trim();
    }

    /**
     * Calcula y actualiza contadores de líneas y caracteres, con resaltado si cerca del límite.
     * @param {HTMLTextAreaElement} textarea - Textarea a analizar.
     * @param {HTMLElement} linesEl - Elemento para mostrar líneas.
     * @param {HTMLElement} charsEl - Elemento para mostrar caracteres.
     * @param {HTMLElement} counterEl - Contenedor del contador.
     * @returns {Object} - { lines, chars }
     */
    function updateCounter(textarea, linesEl, charsEl, counterEl) {
        const text = textarea.value;
        const lines = text ? text.split('\n').length : 0;
        const chars = text.length;
        linesEl.textContent = `Líneas: ${lines}`;
        charsEl.textContent = `Caracteres: ${chars}`;
        // Resaltar si cerca del límite (9000 líneas)
        const isInputText = textarea.id === 'input-text';
        const shouldWarn = isInputText && lines > 9000;
        counterEl.classList.toggle('warning', shouldWarn);
        textarea.classList.toggle('warning', shouldWarn);
        return { lines, chars };
    }

    // Debounce para optimizar input events
    function debounce(fn, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), wait);
        };
    }

    // Actualizar contadores con debounce
    const updateInputCounter = debounce(() => {
        const counterEl = elements.inputLines.parentElement;
        const { lines } = updateCounter(elements.inputText, elements.inputLines, elements.inputChars, counterEl);
        if (lines > 10000) {
            Swal.fire({ ...swalOptions, icon: 'warning', title: 'Texto Demasiado Grande', text: 'Límite: 10k líneas.' });
        }
    }, 300);

    const updateResultCounter = debounce(() => {
        const counterEl = elements.resultLines.parentElement;
        updateCounter(elements.resultText, elements.resultLines, elements.resultChars, counterEl);
    }, 300);

    // --- FUNCIONES PRINCIPALES ---
    /**
     * Concatena el texto con opciones avanzadas.
     */
    function concatenateText() {
        const { prefix, suffix, inputText, resultText, horizontalRadio, separatorSelect, quoteType, addFinalSep } = elements;
        let userSuffix = suffix.value.trim();
        const text = inputText.value;
        const isHorizontal = horizontalRadio.checked;
        const separator = separatorSelect.value;
        const quote = quoteType.value;
        const addFinal = addFinalSep.checked;

        // Validación
        if (!text.trim()) {
            Swal.fire({ ...swalOptions, icon: 'warning', title: 'Entrada Vacía' });
            resultText.value = '';
            updateCopyButtonState();
            updateResultCounter();
            return;
        }

        // Evitar separador duplicado en sufijo
        if (userSuffix.endsWith(separator)) {
            userSuffix = userSuffix.slice(0, -separator.length);
        }

        // Procesar líneas
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length === 0) {
            resultText.value = '';
            updateCopyButtonState();
            updateResultCounter();
            return;
        }

        if (lines.length > 10000) {
            Swal.fire({ ...swalOptions, icon: 'warning', title: 'Texto Demasiado Grande', text: 'Límite: 10k líneas.' });
            return;
        }

        const processed = lines.map(line => {
            let processedLine = `${prefix.value}${line.trim()}${userSuffix}`;
            if (quote === 'single') processedLine = `'${processedLine}'`;
            else if (quote === 'double') processedLine = `"${processedLine}"`;
            return processedLine;
        });

        let result = processed.join(isHorizontal ? separator : `${separator}\n`);
        if (addFinal && separator !== '\n') result += separator;

        resultText.value = result;
        updateCopyButtonState();
        updateResultCounter();

        Swal.fire({ ...swalOptions, icon: 'success', title: '¡Concatenado!' });

        // Persistir inputs
        localStorage.setItem('concatenatorInputs', JSON.stringify({
            prefix: prefix.value,
            suffix: suffix.value,
            inputText: text,
            separator: separator,
            quoteType: quote,
            addFinal: addFinal,
            isHorizontal
        }));
    }

    /**
     * Limpia todos los campos y storage.
     */
    function clearData() {
        Object.values(elements).forEach(el => {
            if (el.tagName === 'INPUT' && el.type === 'text') el.value = '';
            if (el.tagName === 'TEXTAREA') el.value = '';
            if (el.tagName === 'SELECT') el.value = el.id === 'separator' ? ',' : 'none';
            if (el.id === 'horizontal') el.checked = true;
            if (el.type === 'checkbox') el.checked = false;
            if (el.tagName === 'TEXTAREA') el.classList.remove('warning');
        });
        updateCopyButtonState();
        updateInputCounter();
        updateResultCounter();
        localStorage.removeItem('concatenatorInputs');
        Swal.fire({ ...swalOptions, icon: 'info', title: '¡Limpiado!' });
    }

    /**
     * Copia el resultado al clipboard.
     */
    async function copyResult() {
        const text = elements.resultText.value;
        if (!text) return;

        try {
            await navigator.clipboard.writeText(text);
            Swal.fire({ ...swalOptions, icon: 'success', title: '¡Copiado!' });
        } catch (err) {
            console.error('Error al copiar:', err);
            Swal.fire({ ...swalOptions, icon: 'error', title: 'Error al Copiar' });
        }
    }

    // --- EVENT LISTENERS ---
    elements.concatenateBtn.addEventListener('click', concatenateText);
    elements.clearBtn.addEventListener('click', clearData);
    elements.copyBtn.addEventListener('click', copyResult);
    elements.resultText.addEventListener('input', () => {
        updateCopyButtonState();
        updateResultCounter();
    });
    elements.inputText.addEventListener('input', updateInputCounter);
    elements.themeToggle.addEventListener('change', () => applyTheme(elements.themeToggle.checked ? 'dark' : 'light'));

    document.addEventListener('keydown', (event) => {
        if (!event.ctrlKey && !event.metaKey) return;
        const key = event.key.toLowerCase();
        if (key === 'q') { event.preventDefault(); concatenateText(); }
        if (key === 'z') { event.preventDefault(); clearData(); }
        if (key === 'x') { event.preventDefault(); copyResult(); }
    });

    // --- INICIALIZACIÓN ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    const savedInputs = JSON.parse(localStorage.getItem('concatenatorInputs'));
    if (savedInputs) {
        elements.prefix.value = savedInputs.prefix || '';
        elements.suffix.value = savedInputs.suffix || '';
        elements.inputText.value = savedInputs.inputText || '';
        elements.separatorSelect.value = savedInputs.separator || ',';
        elements.quoteType.value = savedInputs.quoteType || 'none';
        elements.addFinalSep.checked = savedInputs.addFinal || false;
        elements.horizontalRadio.checked = savedInputs.isHorizontal ?? true;
        elements.horizontalRadio.nextElementSibling.nextElementSibling.checked = !savedInputs.isHorizontal;
    }

    updateCopyButtonState();
    updateInputCounter();
    updateResultCounter();
});