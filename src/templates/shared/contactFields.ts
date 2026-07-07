import {
  Mail, Phone, MapPin, Linkedin, Globe, Github,
  Flag, Calendar, FileText, CreditCard, Clock,
  type LucideIcon,
} from 'lucide-react';
import type { PersonalInfo } from '../../types';

interface ContactMeta {
  icon: LucideIcon;
  label?: string;
  linkify?: (v: string) => string;
}

export const CONTACT_META = {
  email:        { icon: Mail,     linkify: v => `mailto:${v}` },
  phone:        { icon: Phone,    linkify: v => `tel:${v.replace(/[^\d+]/g, '')}` },
  location:     { icon: MapPin },
  linkedin:     { icon: Linkedin, linkify: v => normalizeLinkedIn(v) },
  website:      { icon: Globe,    linkify: v => normalizeUrl(v) },
  github:       { icon: Github,   linkify: v => v.startsWith('http') ? v : `https://github.com/${v.replace(/^@/, '')}` },
  nationality:  { icon: Flag },
  dateOfBirth:  { icon: Calendar, label: 'DOB' },
  visa:         { icon: FileText, label: 'Visa' },
  passportId:   { icon: CreditCard, label: 'ID' },
  availability: { icon: Clock },
} satisfies Record<string, ContactMeta>;

export type ContactKey = keyof typeof CONTACT_META;

function isContactKey(k: string): k is ContactKey {
  return k in CONTACT_META;
}

const DEFAULT_ORDER: ContactKey[] = ['email', 'phone', 'location', 'linkedin', 'website'];

function normalizeUrl(v: string): string {
  const s = v.trim();
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

function normalizeLinkedIn(v: string): string {
  const s = v.trim();
  if (/^https?:\/\//i.test(s)) return s;
  if (/^linkedin\.com\//i.test(s)) return `https://${s}`;
  if (/^(in|company|pub|school)\//i.test(s)) return `https://linkedin.com/${s}`;
  return `https://linkedin.com/in/${s}`;
}

const URL_KEYS = new Set<string>(['linkedin', 'website', 'github']);

function stripUrlChrome(v: string): string {
  return String(v).trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '');
}

export function displayValue(key: string, value: string): string {
  if (URL_KEYS.has(key)) return stripUrlChrome(value);
  return value;
}

export interface ContactField {
  key: ContactKey;
  value: string;
  display: string;
  icon: LucideIcon;
  label?: string;
  href: string | null;
}

export function getContactFields(
  personal: PersonalInfo,
  { hiddenKeys = [] }: { hiddenKeys?: string[] } = {},
): ContactField[] {
  const orderStored = Array.isArray(personal._fieldOrder) ? personal._fieldOrder : null;
  const order: string[] = orderStored && orderStored.length ? orderStored : DEFAULT_ORDER;
  const seen = new Set<string>();
  const combined = [
    ...order.filter(isContactKey),
    ...(Object.keys(CONTACT_META) as ContactKey[]).filter(k => !order.includes(k)),
  ];
  const hidden = new Set(hiddenKeys);
  const out: ContactField[] = [];
  for (const key of combined) {
    if (seen.has(key)) continue;
    seen.add(key);
    if (hidden.has(key)) continue;
    const value = personal[key];
    if (value == null || value === '') continue;
    const meta: ContactMeta = CONTACT_META[key];
    out.push({
      key,
      value,
      display: displayValue(key, value),
      icon: meta.icon,
      label: meta.label,
      href: meta.linkify ? meta.linkify(value) : null,
    });
  }
  return out;
}
