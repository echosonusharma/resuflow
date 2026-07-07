import { useResumeStore } from '../store/resumeStore';

export function usePersonal() {
  const personal = useResumeStore(s => s.present.personal);
  const updatePersonal = useResumeStore(s => s.updatePersonal);
  return { personal, updatePersonal };
}
