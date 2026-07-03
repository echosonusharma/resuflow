import React from 'react';
import { useSections } from '../../../hooks/index.js';
import FormGroup from './FormGroup.jsx';

export default function CertificationsForm({ sectionId, entry }) {
  const { updateEntry } = useSections();
  function update(data) {
    updateEntry(sectionId, entry.id, data);
  }
  return (
    <div className="entry-form">
      <div className="entry-form-row single">
        <FormGroup label="Certificate Name">
          <input
            className="form-input"
            value={entry.name}
            onChange={e => update({ name: e.target.value })}
            placeholder="e.g. AWS Certified Developer"
          />
        </FormGroup>
      </div>
      <div className="entry-form-row">
        <FormGroup label="Issuing Organization">
          <input
            className="form-input"
            value={entry.issuer}
            onChange={e => update({ issuer: e.target.value })}
            placeholder="e.g. Amazon Web Services"
          />
        </FormGroup>
        <FormGroup label="Date">
          <input
            className="form-input"
            type="month"
            value={entry.date}
            onChange={e => update({ date: e.target.value })}
          />
        </FormGroup>
      </div>
    </div>
  );
}
