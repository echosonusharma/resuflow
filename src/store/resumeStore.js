import { create } from 'zustand';
import { putResume, getResume } from '../db/resumesDb.js';
import demoData from '../data/demoData.json';

const HISTORY_LIMIT = 50;
const SAVE_DEBOUNCE_MS = 400;

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function getDefaultEntry(type) {
  switch (type) {
    case 'profile':
      return { id: uid(), visible: true, content: '' };
    case 'experience':
      return {
        id: uid(), visible: true, title: '', company: '',
        startDate: '', endDate: '', current: false, location: '', bullets: [''],
      };
    case 'skills':
      return { id: uid(), visible: true, category: '', items: '' };
    case 'education':
      return {
        id: uid(), visible: true, degree: '', school: '',
        startDate: '', endDate: '', location: '', bullets: [''],
      };
    case 'languages':
      return { id: uid(), visible: true, language: '', level: 3 };
    case 'certifications':
    case 'awards':
    case 'courses':
    case 'publications':
      return { id: uid(), visible: true, name: '', issuer: '', date: '' };
    case 'volunteering':
      return {
        id: uid(), visible: true, title: '', company: '',
        startDate: '', endDate: '', current: false, location: '', bullets: [''],
      };
    case 'projects':
      return {
        id: uid(), visible: true, title: '', link: '',
        startDate: '', endDate: '', bullets: [''],
      };
    case 'interests':
      return { id: uid(), visible: true, category: '', items: '' };
    case 'references':
      return { id: uid(), visible: true, name: '', position: '', contact: '' };
    default:
      return { id: uid(), visible: true, content: '' };
  }
}

function getDefaultSection(type) {
  const map = {
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
  const meta = map[type] || map.custom;
  return {
    id: uid(),
    type,
    heading: meta.heading,
    icon: meta.icon,
    visible: true,
    entries: [getDefaultEntry(type)],
  };
}

const EMPTY_DOC = {
  id: null,
  name: '',
  template: 'classic-clear',
  personal: {},
  sections: [],
  customize: {},
};

let saveTimer = null;
let savePending = false;

async function persistNow(getState) {
  savePending = false;
  const { present, activeResumeId } = getState();
  if (!activeResumeId || !present.id) return;
  try {
    const saved = await putResume(present);
    // update in-memory updatedAt without triggering history commit
    useResumeStore.setState((s) =>
      s.present.id === saved.id ? { present: { ...s.present, updatedAt: saved.updatedAt } } : {}
    );
  } catch (err) {
    console.error('[resumeStore] save failed', err);
  }
}

function scheduleSave(getState) {
  clearTimeout(saveTimer);
  savePending = true;
  saveTimer = setTimeout(() => persistNow(getState), SAVE_DEBOUNCE_MS);
}

// Flush pending edits immediately (leaving editor, tab close).
export function flushSave() {
  if (!savePending) return;
  clearTimeout(saveTimer);
  persistNow(useResumeStore.getState);
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushSave);
}

export const useResumeStore = create((set, get) => ({
  present: EMPTY_DOC,
  past: [],
  future: [],
  activeResumeId: null,
  status: 'idle', // 'idle' | 'loading' | 'ready'

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
    if (!past.length) return;
    set({
      past: past.slice(0, -1),
      present: past[past.length - 1],
      future: [present, ...future],
    });
    scheduleSave(get);
  },
  redo() {
    const { past, present, future } = get();
    if (!future.length) return;
    set({
      past: [...past, present],
      present: future[0],
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
          ? { ...s, entries: [...s.entries, getDefaultEntry(entryType || s.type)] }
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
          ? { ...s, entries: s.entries.map(e => e.id === entryId ? { ...e, ...data } : e) }
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
          ? { ...s, entries: s.entries.filter(e => e.id !== entryId) }
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
          ? { ...s, entries: s.entries.map(e => e.id === entryId ? { ...e, visible: !e.visible } : e) }
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
        const entries = [...s.entries];
        const [removed] = entries.splice(fromIndex, 1);
        entries.splice(toIndex, 0, removed);
        return { ...s, entries };
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
      },
    });
  },
  resetCustomize() {
    const { present, _commit } = get();
    _commit({ ...present, customize: {} });
  },
}));
