import React from 'react';
import Card from '../ui/Card.jsx';

export default function DesignTemplates({ onBrowse }: { onBrowse: () => void }) {
  return (
    <Card id="templates" title="Design Templates">
      <p className="cz-subtitle">Update your entire resume design with one click ✦</p>
      <div className="cz-template-browse">
        <div className="cz-template-thumb-row">
          {['classic-clear', 'slate-sidebar', 'compact-ats'].map(t => (
            <div key={t} className={`cz-template-thumb cz-thumb-${t}`} />
          ))}
        </div>
        <button className="cz-browse-btn" onClick={onBrowse}>
          Browse templates
        </button>
      </div>
    </Card>
  );
}
