import { useResumeStore } from '../store/resumeStore';
import { getTemplate, resolveCustomize } from '../templates/index';

export function useCustomize() {
  const templateId = useResumeStore(s => s.present.template);
  const rawCustomize = useResumeStore(s => s.present.customize);
  const updateCustomize = useResumeStore(s => s.updateCustomize);
  const resetCustomize = useResumeStore(s => s.resetCustomize);
  const { meta } = getTemplate(templateId);
  const customize = resolveCustomize(meta, rawCustomize || {});
  return { customize, updateCustomize, resetCustomize };
}
