import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialState } from '../data/sampleData.js';

const HISTORY_LIMIT = 50;

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
      return { id: uid(), visible: true, name: '', issuer: '', date: '' };
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

export const useResumeStore = create(
  persist(
    (set, get) => ({
      present: initialState,
      past: [],
      future: [],

      // ── history internals ────────────────────────────────────────
      _commit(next) {
        const { present, past } = get();
        if (next === present) return;
        set({
          past: [...past.slice(-(HISTORY_LIMIT - 1)), present],
          present: next,
          future: [],
        });
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
      },
      redo() {
        const { past, present, future } = get();
        if (!future.length) return;
        set({
          past: [...past, present],
          present: future[0],
          future: future.slice(1),
        });
      },

      // ── personal ─────────────────────────────────────────────────
      updatePersonal(data) {
        const { present, _commit } = get();
        _commit({ ...present, personal: { ...present.personal, ...data } });
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
    }),
    {
      name: 'resume-builder-state',
      // only persist present state, not undo/redo history
      partialize: (state) => ({ present: state.present }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const c = state.present?.customize;
        // reset stale pre-filled customize objects from old localStorage format
        if (c && typeof c.fontSize?.base === 'number' && Object.keys(c).length > 3) {
          state.present = { ...state.present, customize: {} };
        }
      },
    }
  )
);
