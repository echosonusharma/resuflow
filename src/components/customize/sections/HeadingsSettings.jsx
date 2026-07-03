import React from 'react';
import Card from '../ui/Card.jsx';

export default function HeadingsSettings({ customize, updateCustomize }) {
  const headings = customize.headings || {};
  return (
    <Card id="headings" title="Headings">
      <div className="cz-toggle-row">
        <span>Uppercase</span>
        <button
          className={`cz-toggle ${headings.uppercase ? 'on' : ''}`}
          onClick={() => updateCustomize('headings', { uppercase: !headings.uppercase })}
        >
          <span className="cz-toggle-thumb" />
        </button>
      </div>
      <div className="cz-toggle-row">
        <span>Underline / Border</span>
        <button
          className={`cz-toggle ${headings.underline ? 'on' : ''}`}
          onClick={() => updateCustomize('headings', { underline: !headings.underline })}
        >
          <span className="cz-toggle-thumb" />
        </button>
      </div>
    </Card>
  );
}
