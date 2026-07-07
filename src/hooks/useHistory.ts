import { useResumeStore } from '../store/resumeStore';

export function useHistory() {
  const undo = useResumeStore(s => s.undo);
  const redo = useResumeStore(s => s.redo);
  const canUndo = useResumeStore(s => s.past.length > 0);
  const canRedo = useResumeStore(s => s.future.length > 0);
  return { undo, redo, canUndo, canRedo };
}
