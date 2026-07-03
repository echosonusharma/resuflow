import React from 'react';
import Card from '../ui/Card.jsx';
import SelectInput from '../ui/SelectInput.jsx';

export default function FooterSettings({ customize, updateCustomize }) {
  const footer = customize.footer || {};
  return (
    <Card id="footer" title="Footer">
      <p style={{ color: '#999', fontSize: 12, margin: '0 0 12px' }}>
        Applied to every page of the exported PDF.
      </p>
      <div className="cz-toggle-row">
        <span>Show Page Numbers</span>
        <button className={`cz-toggle ${footer.pageNumbers ? 'on' : ''}`}
          onClick={() => updateCustomize('footer', { pageNumbers: !footer.pageNumbers })}>
          <span className="cz-toggle-thumb" />
        </button>
      </div>
      <SelectInput
        label="Footer Text"
        value={footer.text || 'none'}
        options={[
          { value: 'none', label: 'None' },
          { value: 'name', label: 'Full Name' },
          { value: 'email', label: 'Email' },
          { value: 'custom', label: 'Custom' },
        ]}
        onChange={v => updateCustomize('footer', { text: v })}
      />
      {footer.text === 'custom' && (
        <div className="cz-form-group" style={{ marginTop: 10 }}>
          <label className="cz-form-label">Custom Text</label>
          <input
            className="cz-text-input"
            type="text"
            value={footer.customText || ''}
            placeholder="e.g. References available on request"
            onChange={e => updateCustomize('footer', { customText: e.target.value })}
          />
        </div>
      )}
    </Card>
  );
}
