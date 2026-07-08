import React from 'react';
import { useSections } from '../../../hooks/index.js';
import FormGroup from './FormGroup.jsx';
import type { EntryFormProps, ProfileEntry } from '../../../types';

export default function CustomForm({ sectionId, entry }: EntryFormProps<ProfileEntry>) {
  const { updateEntry } = useSections();
  function update(data: Partial<ProfileEntry>) {
    updateEntry(sectionId, entry.id, data);
  }
  return (
    <div className="entry-form">
      <div className="entry-form-row single">
        <FormGroup label="Content">
          <textarea
            className="form-textarea"
            value={entry.content || ''}
            onChange={e => update({ content: e.target.value })}
            placeholder="Enter your content..."
            rows={4}
          />
        </FormGroup>
      </div>
    </div>
  );
}
