import type { EntryMap, SavedResume, SectionOf, SectionType, TemplateId } from '../types';

function uid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function emptyEntry<T extends SectionType>(type: T): EntryMap[T] {
  switch (type) {
    case 'profile':
      return { id: uid(), visible: true, content: '' } as EntryMap[T];
    case 'experience':
      return {
        id: uid(), visible: true, title: '', company: '',
        startDate: '', endDate: '', current: false, location: '', bullets: [''],
      } as EntryMap[T];
    case 'skills':
      return { id: uid(), visible: true, category: '', items: '' } as EntryMap[T];
    case 'education':
      return {
        id: uid(), visible: true, degree: '', school: '',
        startDate: '', endDate: '', location: '', bullets: [''],
      } as EntryMap[T];
    case 'languages':
      return { id: uid(), visible: true, language: '', level: 3 } as EntryMap[T];
    case 'certifications':
      return { id: uid(), visible: true, name: '', issuer: '', date: '' } as EntryMap[T];
    default:
      return { id: uid(), visible: true, content: '' } as EntryMap[T];
  }
}

function section<T extends SectionType>(type: T, heading: string, icon: string): SectionOf<T> {
  return {
    id: uid(),
    type,
    heading,
    icon,
    visible: true,
    entries: [emptyEntry(type)],
  };
}

export function createEmptyResume(
  { name = 'Untitled resume', template = 'classic-clear' }: { name?: string; template?: TemplateId } = {},
): SavedResume {
  const now = Date.now();
  return {
    id: uid(),
    name,
    template,
    personal: {
      firstName: '', lastName: '', title: '', email: '',
      phone: '', location: '', linkedin: '', website: '', photo: null,
    },
    sections: [
      section('profile', 'Profile', 'User'),
      section('experience', 'Professional Experience', 'Briefcase'),
      section('skills', 'Skills', 'Brain'),
      section('education', 'Education', 'GraduationCap'),
    ],
    customize: {},
    createdAt: now,
    updatedAt: now,
  };
}
