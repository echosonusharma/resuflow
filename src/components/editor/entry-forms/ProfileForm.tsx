import React from 'react';
import { useSections } from '../../../hooks/index.js';
import FormGroup from './FormGroup.jsx';
import type { EntryFormProps, ProfileEntry } from '../../../types';

export default function ProfileForm({ sectionId, entry }: EntryFormProps<ProfileEntry>) {
  const { updateEntry } = useSections();
  function update(data: Partial<ProfileEntry>) {
    updateEntry(sectionId, entry.id, data);
  }
  return (
    <div className="entry-form">
      <div className="entry-form-row single">
        <FormGroup label="Profile Summary" fullWidth>
          <textarea
            className="form-textarea"
            value={entry.content}
            onChange={e => update({ content: e.target.value })}
            placeholder="Write a short professional summary about yourself..."
            rows={5}
          />
        </FormGroup>
      </div>
    </div>
  );
}
