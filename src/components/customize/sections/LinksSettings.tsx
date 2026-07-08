import React from 'react';
import Card from '../ui/Card.jsx';
import type { CustomizeSectionProps } from '../../../types';

export default function LinksSettings({ customize, updateCustomize }: CustomizeSectionProps) {
  const links = customize.links || {};
  return (
    <Card id="links" title="Links">
      <div className="cz-toggle-row">
        <span>Show LinkedIn</span>
        <button className={`cz-toggle ${links.showLinkedin !== false ? 'on' : ''}`}
          onClick={() => updateCustomize('links', { showLinkedin: links.showLinkedin === false })}>
          <span className="cz-toggle-thumb" />
        </button>
      </div>
      <div className="cz-toggle-row">
        <span>Show Website</span>
        <button className={`cz-toggle ${links.showWebsite !== false ? 'on' : ''}`}
          onClick={() => updateCustomize('links', { showWebsite: links.showWebsite === false })}>
          <span className="cz-toggle-thumb" />
        </button>
      </div>
      <div className="cz-toggle-row">
        <span>Hyperlink Text</span>
        <button className={`cz-toggle ${links.hyperlink ? 'on' : ''}`}
          onClick={() => updateCustomize('links', { hyperlink: !links.hyperlink })}>
          <span className="cz-toggle-thumb" />
        </button>
      </div>
    </Card>
  );
}
