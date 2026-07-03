import { useResumeStore } from '../store/resumeStore.js';

export function useSections() {
  const sections = useResumeStore(s => s.present.sections);
  const addSection = useResumeStore(s => s.addSection);
  const removeSection = useResumeStore(s => s.removeSection);
  const updateSectionHeading = useResumeStore(s => s.updateSectionHeading);
  const toggleSectionVisible = useResumeStore(s => s.toggleSectionVisible);
  const reorderSections = useResumeStore(s => s.reorderSections);
  const addEntry = useResumeStore(s => s.addEntry);
  const updateEntry = useResumeStore(s => s.updateEntry);
  const removeEntry = useResumeStore(s => s.removeEntry);
  const toggleEntryVisible = useResumeStore(s => s.toggleEntryVisible);
  const reorderEntries = useResumeStore(s => s.reorderEntries);
  return {
    sections,
    addSection,
    removeSection,
    updateSectionHeading,
    toggleSectionVisible,
    reorderSections,
    addEntry,
    updateEntry,
    removeEntry,
    toggleEntryVisible,
    reorderEntries,
  };
}
