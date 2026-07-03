import React from 'react';
import Card from '../ui/Card.jsx';

export default function HeaderSettings({ customize, updateCustomize }) {
  const header = customize.header || {};
  return (
    <Card id="header" title="Header">
      <div className="cz-toggle-row">
        <span>Show Name</span>
        <button className={`cz-toggle ${header.showName !== false ? 'on' : ''}`}
          onClick={() => updateCustomize('header', { showName: header.showName === false })}>
          <span className="cz-toggle-thumb" />
        </button>
      </div>
      <div className="cz-toggle-row">
        <span>Show Job Title</span>
        <button className={`cz-toggle ${header.showTitle !== false ? 'on' : ''}`}
          onClick={() => updateCustomize('header', { showTitle: header.showTitle === false })}>
          <span className="cz-toggle-thumb" />
        </button>
      </div>
      <div className="cz-toggle-row">
        <span>Show Contact Row</span>
        <button className={`cz-toggle ${header.showContact !== false ? 'on' : ''}`}
          onClick={() => updateCustomize('header', { showContact: header.showContact === false })}>
          <span className="cz-toggle-thumb" />
        </button>
      </div>
    </Card>
  );
}
