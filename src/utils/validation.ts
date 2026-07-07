const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\-\s\d]{7,}$/;
const DOMAIN_RE = /^([\w-]+\.)+[a-z]{2,}(\/[\w\-./?%&=#+]*)?$/i;
const LINKEDIN_URL_RE = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company|pub|school)\/[\w\-À-ÿ%]+\/?$/i;
const LINKEDIN_PATH_RE = /^(in|company|pub|school)\/[\w\-À-ÿ%]{2,}\/?$/i;

export function validateEmail(v: string): string | null {
  if (!v) return null;
  return EMAIL_RE.test(v.trim()) ? null : 'Invalid email address';
}

export function validatePhone(v: string): string | null {
  if (!v) return null;
  const digits = (v.match(/\d/g) || []).length;
  if (digits < 7) return 'Phone number too short';
  if (!PHONE_RE.test(v.trim())) return 'Invalid phone number';
  return null;
}

export function validateWebsite(v: string): string | null {
  if (!v) return null;
  const s = v.trim();
  if (/^https?:\/\//i.test(s)) {
    try {
      const u = new URL(s);
      if (!u.hostname.includes('.')) return 'Invalid website URL';
      return null;
    } catch { return 'Invalid website URL'; }
  }
  return DOMAIN_RE.test(s) ? null : 'Enter a domain like example.com';
}

export function validateLinkedIn(v: string): string | null {
  if (!v) return null;
  const s = v.trim();
  if (LINKEDIN_URL_RE.test(s)) return null;
  if (LINKEDIN_PATH_RE.test(s)) return null;
  return 'Use linkedin.com/in/your-handle or in/your-handle';
}

// Generic URL check (kept for compatibility)
export function validateUrl(v: string): string | null {
  return validateWebsite(v);
}

export function validateNumber(
  v: string | number | null | undefined,
  { min, max, integer = false }: { min?: number; max?: number; integer?: boolean } = {},
): string | null {
  if (v === '' || v == null) return null;
  const n = Number(v);
  if (Number.isNaN(n)) return 'Must be a number';
  if (integer && !Number.isInteger(n)) return 'Must be a whole number';
  if (min != null && n < min) return `Must be ≥ ${min}`;
  if (max != null && n > max) return `Must be ≤ ${max}`;
  return null;
}
