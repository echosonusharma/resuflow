import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { initialState } from '../data/sampleData.js';

const ResumeContext = createContext(null);

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
        startDate: '', endDate: '', current: false, location: '', bullets: ['']
      };
    case 'skills':
      return { id: uid(), visible: true, category: '', items: '' };
    case 'education':
      return {
        id: uid(), visible: true, degree: '', school: '',
        startDate: '', endDate: '', location: '', bullets: ['']
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
    profile: { heading: 'Profile', icon: 'User' },
    experience: { heading: 'Professional Experience', icon: 'Briefcase' },
    skills: { heading: 'Skills', icon: 'Brain' },
    education: { heading: 'Education', icon: 'GraduationCap' },
    languages: { heading: 'Languages', icon: 'Globe' },
    certifications: { heading: 'Certifications', icon: 'Award' },
    custom: { heading: 'Custom Section', icon: 'FileText' }
  };
  const meta = map[type] || map.custom;
  return {
    id: uid(),
    type,
    heading: meta.heading,
    icon: meta.icon,
    visible: true,
    entries: [getDefaultEntry(type)]
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'UPDATE_PERSONAL':
      return { ...state, personal: { ...state.personal, ...action.payload } };

    case 'SET_TEMPLATE':
      return { ...state, template: action.payload };

    case 'ADD_SECTION': {
      const newSection = getDefaultSection(action.payload);
      return { ...state, sections: [...state.sections, newSection] };
    }

    case 'REMOVE_SECTION':
      return { ...state, sections: state.sections.filter(s => s.id !== action.payload) };

    case 'UPDATE_SECTION_HEADING':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === action.payload.id ? { ...s, heading: action.payload.heading } : s
        )
      };

    case 'TOGGLE_SECTION_VISIBLE':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === action.payload ? { ...s, visible: !s.visible } : s
        )
      };

    case 'REORDER_SECTIONS': {
      const { fromIndex, toIndex } = action.payload;
      const sections = [...state.sections];
      const [removed] = sections.splice(fromIndex, 1);
      sections.splice(toIndex, 0, removed);
      return { ...state, sections };
    }

    case 'ADD_ENTRY': {
      const { sectionId, entryType } = action.payload;
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === sectionId
            ? { ...s, entries: [...s.entries, getDefaultEntry(entryType || s.type)] }
            : s
        )
      };
    }

    case 'UPDATE_ENTRY': {
      const { sectionId, entryId, data } = action.payload;
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === sectionId
            ? {
                ...s,
                entries: s.entries.map(e =>
                  e.id === entryId ? { ...e, ...data } : e
                )
              }
            : s
        )
      };
    }

    case 'REMOVE_ENTRY': {
      const { sectionId, entryId } = action.payload;
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === sectionId
            ? { ...s, entries: s.entries.filter(e => e.id !== entryId) }
            : s
        )
      };
    }

    case 'TOGGLE_ENTRY_VISIBLE': {
      const { sectionId, entryId } = action.payload;
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === sectionId
            ? {
                ...s,
                entries: s.entries.map(e =>
                  e.id === entryId ? { ...e, visible: !e.visible } : e
                )
              }
            : s
        )
      };
    }

    case 'REORDER_ENTRIES': {
      const { sectionId, fromIndex, toIndex } = action.payload;
      return {
        ...state,
        sections: state.sections.map(s => {
          if (s.id !== sectionId) return s;
          const entries = [...s.entries];
          const [removed] = entries.splice(fromIndex, 1);
          entries.splice(toIndex, 0, removed);
          return { ...s, entries };
        })
      };
    }

    case 'UPDATE_CUSTOMIZE': {
      const { section, data } = action.payload;
      return {
        ...state,
        customize: {
          ...state.customize,
          [section]: { ...state.customize?.[section], ...data }
        }
      };
    }

    case 'RESET_CUSTOMIZE':
      return { ...state, customize: {} };

    default:
      return state;
  }
}

const HISTORY_LIMIT = 50;

function historyReducer(hist, action) {
  const { past, present, future } = hist;
  if (action.type === 'UNDO') {
    if (!past.length) return hist;
    return {
      past: past.slice(0, -1),
      present: past[past.length - 1],
      future: [present, ...future],
    };
  }
  if (action.type === 'REDO') {
    if (!future.length) return hist;
    return {
      past: [...past, present],
      present: future[0],
      future: future.slice(1),
    };
  }
  const next = reducer(present, action);
  if (next === present) return hist;
  if (action.type === 'LOAD_STATE') return { past: [], present: next, future: [] };
  return {
    past: [...past.slice(-(HISTORY_LIMIT - 1)), present],
    present: next,
    future: [],
  };
}

export function ResumeProvider({ children }) {
  const [hist, dispatch] = useReducer(historyReducer, { past: [], present: initialState, future: [] });
  const state = hist.present;

  // Load from localStorage on mount — clear if state version mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem('resume-builder-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Reset customize if it still has old pre-filled structure (has fontSize.base at top level)
        if (parsed.customize && typeof parsed.customize.fontSize?.base === 'number' && Object.keys(parsed.customize).length > 3) {
          parsed.customize = {};
        }
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
  }, []);

  // Save to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem('resume-builder-state', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [state]);

  return (
    <ResumeContext.Provider value={{
      state,
      dispatch,
      canUndo: hist.past.length > 0,
      canRedo: hist.future.length > 0,
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used inside ResumeProvider');
  return ctx;
}
