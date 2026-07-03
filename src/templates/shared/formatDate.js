const LOCALES = {
  'English (UK)': 'en-GB',
  'English (US)': 'en-US',
  'Spanish': 'es',
  'French': 'fr',
  'German': 'de',
};

const PRESENT = {
  'es': 'Actualidad',
  'fr': 'Présent',
  'de': 'Heute',
};

const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function formatDate(dateStr, current, fmt = 'MMM YYYY', language) {
  const locale = LOCALES[language] || 'en-GB';
  if (current) return PRESENT[locale] || 'Present';
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!month) return year;
  const m = parseInt(month, 10);
  let monthShort = MONTHS_EN[m - 1];
  if (locale !== 'en-GB' && locale !== 'en-US') {
    try {
      monthShort = new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(+year, m - 1, 1));
    } catch { /* keep English fallback */ }
  }
  const monthNum = month.padStart(2, '0');
  if (fmt === 'MM/YYYY') return `${monthNum}/${year}`;
  if (fmt === 'YYYY-MM') return `${year}-${monthNum}`;
  if (fmt === 'DD MMM YYYY') return `01 ${monthShort} ${year}`;
  return `${monthShort} ${year}`;
}

export function formatDateRange(start, end, current, fmt, language) {
  const s = formatDate(start, false, fmt, language);
  const e = formatDate(end, current, fmt, language);
  if (!s && !e) return '';
  if (!e) return s;
  return `${s} – ${e}`;
}
