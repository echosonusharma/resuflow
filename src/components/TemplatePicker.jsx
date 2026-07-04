import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getAllTemplates } from '../templates/index.js';
import demoData from '../data/demoData.json';
import TemplatePreview from './TemplatePreview.jsx';

const allTemplates = getAllTemplates();

function DetailModal({ entry, onClose, onUse }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="tpl-modal-backdrop" onClick={onClose}>
      <div className="tpl-modal" onClick={e => e.stopPropagation()}>
        <button className="tpl-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div className="tpl-modal-preview">
          <TemplatePreview
            meta={entry.meta}
            component={entry.component}
            personal={demoData.personal}
            sections={demoData.sections}
            mode="scroll"
          />
        </div>
        <div className="tpl-modal-info">
          <h2 className="tpl-modal-name">{entry.meta.name}</h2>
          <div className="tpl-modal-divider" />
          <p className="tpl-modal-desc">
            Each template crafted with care to make designing your resume an absolute breeze.
          </p>
          <ul className="tpl-modal-features">
            <li>A4 / US-Letter Size</li>
            <li>Editable Text</li>
            <li>Fully customizable</li>
            <li>Print ready format</li>
            <li>Online resume with shareable link</li>
          </ul>
          <button className="tpl-modal-use" onClick={() => onUse(entry.meta.id)}>
            Use this template
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TemplatePicker({ onPick, gridClassName = '', showDetail = true }) {
  const [detailId, setDetailId] = useState(null);
  const detail = detailId ? allTemplates.find(t => t.meta.id === detailId) : null;

  function handleCardClick(id) {
    if (showDetail) setDetailId(id);
    else onPick(id);
  }

  return (
    <>
      <div className={`template-grid ${gridClassName}`}>
        {allTemplates.map(({ meta, component }) => (
          <div
            key={meta.id}
            className="template-card"
            onClick={() => handleCardClick(meta.id)}
          >
            <div className="template-card-preview">
              <TemplatePreview
                meta={meta}
                component={component}
                personal={demoData.personal}
                sections={demoData.sections}
              />
            </div>
            <div className="template-card-footer">
              <div>
                <div className="template-card-name">{meta.name}</div>
                <div className="template-card-category">{meta.category}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDetail && detail && (
        <DetailModal
          entry={detail}
          onClose={() => setDetailId(null)}
          onUse={(id) => { setDetailId(null); onPick(id); }}
        />
      )}
    </>
  );
}
