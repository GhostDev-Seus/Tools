// Mapeo moneda → código de país
const currencyToCountry = {
  AED: 'ae', AFN: 'af', ALL: 'al', AMD: 'am', ANG: 'nl', AOA: 'ao',
  ARS: 'ar', AUD: 'au', AWG: 'aw', AZN: 'az', BAM: 'ba', BBD: 'bb',
  BDT: 'bd', BGN: 'bg', BHD: 'bh', BIF: 'bi', BMD: 'bm', BND: 'bn',
  BOB: 'bo', BRL: 'br', BSD: 'bs', BTN: 'bt', BWP: 'bw', BYN: 'by',
  BZD: 'bz', CAD: 'ca', CDF: 'cd', CHF: 'ch', CLP: 'cl', CNY: 'cn',
  COP: 'co', CRC: 'cr', CUP: 'cu', CVE: 'cv', CZK: 'cz', DJF: 'dj',
  DKK: 'dk', DOP: 'do', DZD: 'dz', EGP: 'eg', ERN: 'er', ETB: 'et',
  EUR: 'eu', FJD: 'fj', FKP: 'fk', GBP: 'gb', GEL: 'ge', GGP: 'gg',
  GHS: 'gh', GIP: 'gi', GMD: 'gm', GNF: 'gn', GTQ: 'gt', GYD: 'gy',
  HKD: 'hk', HNL: 'hn', HRK: 'hr', HTG: 'ht', HUF: 'hu', IDR: 'id',
  ILS: 'il', IMP: 'im', INR: 'in', IQD: 'iq', IRR: 'ir', ISK: 'is',
  JEP: 'je', JMD: 'jm', JOD: 'jo', JPY: 'jp', KES: 'ke', KGS: 'kg',
  KHR: 'kh', KMF: 'km', KPW: 'kp', KRW: 'kr', KWD: 'kw', KYD: 'ky',
  KZT: 'kz', LAK: 'la', LBP: 'lb', LKR: 'lk', LRD: 'lr', LSL: 'ls',
  LYD: 'ly', MAD: 'ma', MDL: 'md', MGA: 'mg', MKD: 'mk', MMK: 'mm',
  MNT: 'mn', MOP: 'mo', MRU: 'mr', MUR: 'mu', MVR: 'mv', MWK: 'mw',
  MXN: 'mx', MYR: 'my', MZN: 'mz', NAD: 'na', NGN: 'ng', NIO: 'ni',
  NOK: 'no', NPR: 'np', NZD: 'nz', OMR: 'om', PAB: 'pa', PEN: 'pe',
  PGK: 'pg', PHP: 'ph', PKR: 'pk', PLN: 'pl', PYG: 'py', QAR: 'qa',
  RON: 'ro', RSD: 'rs', RUB: 'ru', RWF: 'rw', SAR: 'sa', SBD: 'sb',
  SCR: 'sc', SDG: 'sd', SEK: 'se', SGD: 'sg', SHP: 'sh', SLL: 'sl',
  SOS: 'so', SRD: 'sr', SSP: 'ss', STN: 'st', SVC: 'sv', SYP: 'sy',
  SZL: 'sz', THB: 'th', TJS: 'tj', TMT: 'tm', TND: 'tn', TOP: 'to',
  TRY: 'tr', TTD: 'tt', TWD: 'tw', TZS: 'tz', UAH: 'ua', UGX: 'ug',
  USD: 'us', UYU: 'uy', UZS: 'uz', VES: 've', VND: 'vn', VUV: 'vu',
  WST: 'ws', XAF: 'cm', XCD: 'kn', XOF: 'ne', XPF: 'pf', YER: 'ye',
  ZAR: 'za', ZMW: 'zm', ZWL: 'zw'
};

function getFlagCode(currency) {
  return currencyToCountry[currency] || 'un';
}

// Elementos
const themeToggle = document.getElementById('theme-toggle');
const amountInput = document.getElementById('amount');
const resultInput = document.getElementById('result');
const rateInfo = document.getElementById('rate-info');
const swapBtn = document.getElementById('swap-btn');
const fromSelected = document.getElementById('from-selected');
const toSelected = document.getElementById('to-selected');
const fromOptionsList = document.getElementById('from-options');
const toOptionsList = document.getElementById('to-options');

let fromCurrency = 'USD';
let toCurrency = 'COP';

// --- Modo claro/oscuro ---
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

// Inicializar tema
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// --- Cargar monedas ---
async function loadCurrencies() {
  try {
    rateInfo.textContent = 'Cargando monedas...';
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await res.json();
    const currencies = Object.keys(data.rates).sort();

    const renderList = (container, onSelect) => {
      container.innerHTML = '';
      currencies.forEach(code => {
        const flag = getFlagCode(code);
        const li = document.createElement('li');
        li.innerHTML = `<span class="fi fi-${flag}"></span> ${code}`;
        li.addEventListener('click', () => {
          onSelect(code);
          container.classList.remove('show');
        });
        container.appendChild(li);
      });
    };

    renderList(fromOptionsList, (code) => {
      fromCurrency = code;
      updateSelected(fromSelected, code);
      convertCurrency();
    });

    renderList(toOptionsList, (code) => {
      toCurrency = code;
      updateSelected(toSelected, code);
      convertCurrency();
    });

    updateSelected(fromSelected, fromCurrency);
    updateSelected(toSelected, toCurrency);
    convertCurrency();
  } catch (err) {
    rateInfo.textContent = '❌ Error al cargar monedas.';
  }
}

function updateSelected(el, currency) {
  const flag = getFlagCode(currency);
  el.innerHTML = `<span class="fi fi-${flag}"></span> <span>${currency}</span>`;
}

// --- Conversión ---
async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount <= 0) {
    resultInput.value = '0.00';
    return;
  }

  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const data = await res.json();
    const rate = data.rates[toCurrency];
    if (rate === undefined) throw new Error('Moneda no soportada');

    const result = (amount * rate).toFixed(2);
    resultInput.value = result;
    rateInfo.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
  } catch (err) {
    resultInput.value = 'Error';
    rateInfo.textContent = '❌ No se pudo obtener la tasa.';
  }
}

// --- Intercambio CORREGIDO ---
swapBtn.addEventListener('click', async () => {
  const currentAmount = parseFloat(amountInput.value);
  if (isNaN(currentAmount) || currentAmount <= 0) return;

  // Intercambiar monedas
  [fromCurrency, toCurrency] = [toCurrency, fromCurrency];
  updateSelected(fromSelected, fromCurrency);
  updateSelected(toSelected, toCurrency);

  // Recalcular el valor de entrada con la cantidad equivalente
  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${toCurrency}`);
    const data = await res.json();
    const inverseRate = data.rates[fromCurrency];
    if (inverseRate !== undefined) {
      const newAmount = (currentAmount * inverseRate).toFixed(2);
      amountInput.value = newAmount;
    }
  } catch (e) {
    console.warn('No se pudo actualizar el valor de entrada');
  }

  convertCurrency();
});

// --- Eventos ---
amountInput.addEventListener('input', convertCurrency);

fromSelected.addEventListener('click', () => {
  fromOptionsList.classList.toggle('show');
  toOptionsList.classList.remove('show');
});

toSelected.addEventListener('click', () => {
  toOptionsList.classList.toggle('show');
  fromOptionsList.classList.remove('show');
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.custom-select')) {
    fromOptionsList.classList.remove('show');
    toOptionsList.classList.remove('show');
  }
});

  // Ejecutar Boton menu inicio
    
    document.getElementById("Menu").addEventListener("click", function () {
    var url = 'https://tools-y72x.onrender.com/';
    window.location.href = url; // Redirige a la URL
    });

// Iniciar app
loadCurrencies();