import { useEffect } from 'react';
import { X } from 'lucide-react';
import TemplatePicker from './TemplatePicker';

import type { TemplateId } from '../types';

export default function NewResumeModal({ onClose, onPick }: { onClose: () => void; onPick: (id: TemplateId) => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="new-resume-backdrop" onClick={onClose}>
      <div className="new-resume-modal" onClick={e => e.stopPropagation()}>
        <button className="new-resume-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <header className="new-resume-header">
          <h2>Pick a template</h2>
          <p>Choose a design. You can switch later.</p>
        </header>
        <TemplatePicker onPick={onPick} gridClassName="template-grid--modal" showDetail={false} />
      </div>
    </div>
  );
}
