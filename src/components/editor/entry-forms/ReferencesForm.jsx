import React from 'react';
import { useSections } from '../../../hooks/index.js';
import FormGroup from './FormGroup.jsx';

export default function ReferencesForm({ sectionId, entry }) {
  const { updateEntry } = useSections();
  function update(data) {
    updateEntry(sectionId, entry.id, data);
  }
  return (
    <div className="entry-form">
      <div className="entry-form-row single">
        <FormGroup label="Name">
          <input
            className="form-input"
            value={entry.name}
            onChange={e => update({ name: e.target.value })}
            placeholder="e.g. Jordan Smith"
          />
        </FormGroup>
      </div>
      <div className="entry-form-row">
        <FormGroup label="Position / Company">
          <input
            className="form-input"
            value={entry.position || ''}
            onChange={e => update({ position: e.target.value })}
            placeholder="e.g. Engineering Manager, Acme Corp"
          />
        </FormGroup>
        <FormGroup label="Contact">
          <input
            className="form-input"
            value={entry.contact || ''}
            onChange={e => update({ contact: e.target.value })}
            placeholder="e.g. jordan@acme.com · +1 555 000 0000"
          />
        </FormGroup>
      </div>
    </div>
  );
}
