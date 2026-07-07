import { useResumeStore } from '../store/resumeStore';
import { getTemplate, resolveCustomize } from '../templates/index';

export function useActiveTemplate() {
  const templateId = useResumeStore(s => s.present.template);
  const rawCustomize = useResumeStore(s => s.present.customize);
  const setTemplate = useResumeStore(s => s.setTemplate);
  const { component, meta } = getTemplate(templateId);
  const customize = resolveCustomize(meta, rawCustomize || {});
  return { templateId, component, meta, customize, setTemplate };
}
