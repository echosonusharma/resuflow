import { create } from 'zustand';
import { putResume, getResume } from '../db/resumesDb';
import demoData from '../data/demoData';
import type {
  Customize, Entry, EntryMap, PersonalInfo, Resume,
  SavedResume, Section, SectionOf, SectionType, TemplateId,
} from '../types';

const HISTORY_LIMIT = 50;
const SAVE_DEBOUNCE_MS = 400;

function uid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const ENTRY_FACTORIES: { [K in SectionType]: () => EntryMap[K] } = {
  profile: () => ({ id: uid(), visible: true, content: '' }),
  custom: () => ({ id: uid(), visible: true, content: '' }),
  experience: () => ({
    id: uid(), visible: true, title: '', company: '',
    startDate: '', endDate: '', current: false, location: '', bullets: [''],
  }),
  volunteering: () => ({
    id: uid(), visible: true, title: '', company: '',
    startDate: '', endDate: '', current: false, location: '', bullets: [''],
  }),
  skills: () => ({ id: uid(), visible: true, category: '', items: '' }),
  interests: () => ({ id: uid(), visible: true, category: '', items: '' }),
  education: () => ({
    id: uid(), visible: true, degree: '', school: '',
    startDate: '', endDate: '', location: '', bullets: [''],
  }),
  languages: () => ({ id: uid(), visible: true, language: '', level: 3 }),
  certifications: () => ({ id: uid(), visible: true, name: '', issuer: '', date: '' }),
  awards: () => ({ id: uid(), visible: true, name: '', issuer: '', date: '' }),
  courses: () => ({ id: uid(), visible: true, name: '', issuer: '', date: '' }),
  publications: () => ({ id: uid(), visible: true, name: '', issuer: '', date: '' }),
  projects: () => ({
    id: uid(), visible: true, title: '', link: '',
    startDate: '', endDate: '', bullets: [''],
  }),
  references: () => ({ id: uid(), visible: true, name: '', position: '', contact: '' }),
};

function getDefaultEntry<T extends SectionType>(type: T): EntryMap[T] {
  return ENTRY_FACTORIES[type]();
}

const SECTION_META: Record<SectionType, { heading: string; icon: string }> = {
  profile:        { heading: 'Profile',                 icon: 'User' },
  experience:     { heading: 'Professional Experience', icon: 'Briefcase' },
  skills:         { heading: 'Skills',                  icon: 'Brain' },
  education:      { heading: 'Education',               icon: 'GraduationCap' },
  languages:      { heading: 'Languages',               icon: 'Globe' },
  certifications: { heading: 'Certifications',          icon: 'Award' },
  projects:       { heading: 'Projects',                icon: 'FolderKanban' },
  volunteering:   { heading: 'Volunteering',            icon: 'HeartHandshake' },
  awards:         { heading: 'Awards',                  icon: 'Trophy' },
  courses:        { heading: 'Courses',                 icon: 'BookOpen' },
  publications:   { heading: 'Publications',            icon: 'Newspaper' },
  interests:      { heading: 'Interests',               icon: 'Sparkles' },
  references:     { heading: 'References',              icon: 'Users' },
  custom:         { heading: 'Custom Section',          icon: 'FileText' },
};

function getDefaultSection(type: SectionType): Section {
  const meta = SECTION_META[type] ?? SECTION_META.custom;
  // SectionOf<union> does not distribute to the Section union by itself.
  return {
    id: uid(),
    type,
    heading: meta.heading,
    icon: meta.icon,
    visible: true,
    entries: [getDefaultEntry(type)],
  } as Section;
}

// Rebuilding { ...s, entries } over the Section union loses the correlation
// between s.type and its entry type, so the cast is centralized here.
function withEntries<S extends Section>(s: S, fn: (entries: S['entries']) => S['entries']): S {
  return { ...s, entries: fn(s.entries) } as S;
}

const EMPTY_DOC: Resume = {
  id: null,
  name: '',
  template: 'classic-clear',
  personal: {},
  sections: [],
  customize: {},
};

interface ResumeStore {
  present: Resume;
  past: Resume[];
  future: Resume[];
  activeResumeId: string | null;
  status: 'idle' | 'loading' | 'ready';
  saveError: string | null;

  loadResume(id: string): Promise<Resume | null>;
  clearActive(): void;
  renameResume(name: string): void;
  _commit(next: Resume): void;
  undo(): void;
  redo(): void;
  updatePersonal(data: Partial<PersonalInfo>): void;
  fillDemoData(): void;
  setTemplate(id: TemplateId): void;
  addSection(type: SectionType): void;
  removeSection(id: string): void;
  updateSectionHeading(id: string, heading: string): void;
  toggleSectionVisible(id: string): void;
  reorderSections(fromIndex: number, toIndex: number): void;
  addEntry(sectionId: string, entryType?: SectionType): void;
  updateEntry(sectionId: string, entryId: string, data: Partial<Entry>): void;
  removeEntry(sectionId: string, entryId: string): void;
  toggleEntryVisible(sectionId: string, entryId: string): void;
  reorderEntries(sectionId: string, fromIndex: number, toIndex: number): void;
  updateCustomize<K extends keyof Customize>(section: K, data: Partial<NonNullable<Customize[K]>>): void;
  resetCustomize(): void;
}

let saveTimer: ReturnType<typeof setTimeout> | undefined;
let savePending = false;

async function persistNow(state: ResumeStore): Promise<void> {
  savePending = false;
  const { present, activeResumeId } = state;
  if (!activeResumeId || !present.id) return;
  try {
    const saved = await putResume(present as SavedResume);
    useResumeStore.setState((s) =>
      s.present.id === saved.id
        ? { present: { ...s.present, updatedAt: saved.updatedAt }, saveError: null }
        : {}
    );
  } catch (err) {
    console.error('[resumeStore] save failed', err);
    useResumeStore.setState({ saveError: err instanceof Error ? err.message : 'Save failed' });
  }
}

function scheduleSave(getState: () => ResumeStore): void {
  clearTimeout(saveTimer);
  savePending = true;
  saveTimer = setTimeout(() => persistNow(getState()), SAVE_DEBOUNCE_MS);
}

// Flush pending edits immediately (leaving editor, tab close).
export function flushSave(): void {
  if (!savePending) return;
  clearTimeout(saveTimer);
  persistNow(useResumeStore.getState());
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushSave);
}

export const useResumeStore = create<ResumeStore>()((set, get) => ({
  present: EMPTY_DOC,
  past: [],
  future: [],
  activeResumeId: null,
  status: 'idle',
  saveError: null,

  // ── lifecycle ────────────────────────────────────────────────
  async loadResume(id) {
    set({ status: 'loading' });
    const doc = await getResume(id);
    if (!doc) {
      set({ status: 'idle', activeResumeId: null });
      return null;
    }
    set({
      present: doc,
      past: [],
      future: [],
      activeResumeId: id,
      status: 'ready',
    });
    return doc;
  },
  clearActive() {
    flushSave();
    set({
      present: EMPTY_DOC,
      past: [],
      future: [],
      activeResumeId: null,
      status: 'idle',
    });
  },
  renameResume(name) {
    const { present, _commit } = get();
    _commit({ ...present, name });
  },

  // ── history internals ────────────────────────────────────────
  _commit(next) {
    const { present, past } = get();
    if (next === present) return;
    set({
      past: [...past.slice(-(HISTORY_LIMIT - 1)), present],
      present: next,
      future: [],
    });
    scheduleSave(get);
  },

  // ── undo / redo ──────────────────────────────────────────────
  undo() {
    const { past, present, future } = get();
    const prev = past.at(-1);
    if (!prev) return;
    set({
      past: past.slice(0, -1),
      present: prev,
      future: [present, ...future],
    });
    scheduleSave(get);
  },
  redo() {
    const { past, present, future } = get();
    const next = future[0];
    if (!next) return;
    set({
      past: [...past, present],
      present: next,
      future: future.slice(1),
    });
    scheduleSave(get);
  },

  // ── personal ─────────────────────────────────────────────────
  updatePersonal(data) {
    const { present, _commit } = get();
    _commit({ ...present, personal: { ...present.personal, ...data } });
  },

  fillDemoData() {
    const { present, _commit } = get();
    const demo = structuredClone(demoData);
    _commit({ ...present, personal: demo.personal, sections: demo.sections });
  },

  // ── template ─────────────────────────────────────────────────
  setTemplate(id) {
    const { present, _commit } = get();
    _commit({ ...present, template: id });
  },

  // ── sections ─────────────────────────────────────────────────
  addSection(type) {
    const { present, _commit } = get();
    _commit({ ...present, sections: [...present.sections, getDefaultSection(type)] });
  },
  removeSection(id) {
    const { present, _commit } = get();
    _commit({ ...present, sections: present.sections.filter(s => s.id !== id) });
  },
  updateSectionHeading(id, heading) {
    const { present, _commit } = get();
    _commit({
      ...present,
      sections: present.sections.map(s => s.id === id ? { ...s, heading } : s),
    });
  },
  toggleSectionVisible(id) {
    const { present, _commit } = get();
    _commit({
      ...present,
      sections: present.sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s),
    });
  },
  reorderSections(fromIndex, toIndex) {
    const { present, _commit } = get();
    const sections = [...present.sections];
    const [removed] = sections.splice(fromIndex, 1);
    if (!removed) return;
    sections.splice(toIndex, 0, removed);
    _commit({ ...present, sections });
  },

  // ── entries ──────────────────────────────────────────────────
  addEntry(sectionId, entryType) {
    const { present, _commit } = get();
    _commit({
      ...present,
      sections: present.sections.map(s =>
        s.id === sectionId
          ? withEntries(s, entries =>
              [...entries, getDefaultEntry(entryType || s.type)] as typeof entries)
          : s
      ),
    });
  },
  updateEntry(sectionId, entryId, data) {
    const { present, _commit } = get();
    _commit({
      ...present,
      sections: present.sections.map(s =>
        s.id === sectionId
          ? withEntries(s, entries =>
              // data is Partial<Entry>: the store cannot statically know the
              // section type behind a runtime sectionId.
              entries.map(e => e.id === entryId ? { ...e, ...data } as typeof e : e) as typeof entries)
          : s
      ),
    });
  },
  removeEntry(sectionId, entryId) {
    const { present, _commit } = get();
    _commit({
      ...present,
      sections: present.sections.map(s =>
        s.id === sectionId
          ? withEntries(s, entries => entries.filter(e => e.id !== entryId) as typeof entries)
          : s
      ),
    });
  },
  toggleEntryVisible(sectionId, entryId) {
    const { present, _commit } = get();
    _commit({
      ...present,
      sections: present.sections.map(s =>
        s.id === sectionId
          ? withEntries(s, entries =>
              entries.map(e => e.id === entryId ? { ...e, visible: !e.visible } : e) as typeof entries)
          : s
      ),
    });
  },
  reorderEntries(sectionId, fromIndex, toIndex) {
    const { present, _commit } = get();
    _commit({
      ...present,
      sections: present.sections.map(s => {
        if (s.id !== sectionId) return s;
        return withEntries(s, prev => {
          const entries = [...prev];
          const [removed] = entries.splice(fromIndex, 1);
          if (!removed) return prev;
          entries.splice(toIndex, 0, removed);
          return entries as typeof prev;
        });
      }),
    });
  },

  // ── customize ────────────────────────────────────────────────
  updateCustomize(section, data) {
    const { present, _commit } = get();
    _commit({
      ...present,
      customize: {
        ...present.customize,
        [section]: { ...present.customize?.[section], ...data },
      } as Customize, // computed key widens the object literal
    });
  },
  resetCustomize() {
    const { present, _commit } = get();
    _commit({ ...present, customize: {} });
  },
}));
