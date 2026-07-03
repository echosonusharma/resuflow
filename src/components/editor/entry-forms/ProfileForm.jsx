import React from 'react';
import { useSections } from '../../../hooks/index.js';
import FormGroup from './FormGroup.jsx';

export default function ProfileForm({ sectionId, entry }) {
  const { updateEntry } = useSections();
  function update(data) {
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
