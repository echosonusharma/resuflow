import React from 'react';
import { useSections } from '../../../hooks/index.js';
import FormGroup from './FormGroup.jsx';
import type { EntryFormProps, CertEntry } from '../../../types';

interface CertLabels {
  name?: string;
  namePlaceholder?: string;
  issuer?: string;
}

interface CertificationsFormProps extends EntryFormProps<CertEntry> {
  labels?: CertLabels;
}

export default function CertificationsForm({ sectionId, entry, labels = {} }: CertificationsFormProps) {
  const { updateEntry } = useSections();
  function update(data: Partial<CertEntry>) {
    updateEntry(sectionId, entry.id, data);
  }
  return (
    <div className="entry-form">
      <div className="entry-form-row single">
        <FormGroup label={labels.name || 'Certificate Name'}>
          <input
            className="form-input"
            value={entry.name}
            onChange={e => update({ name: e.target.value })}
            placeholder={labels.namePlaceholder || 'e.g. AWS Certified Developer'}
          />
        </FormGroup>
      </div>
      <div className="entry-form-row">
        <FormGroup label={labels.issuer || 'Issuing Organization'}>
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
