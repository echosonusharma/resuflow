import React from 'react';
import { useSections } from '../../../hooks/index.js';
import FormGroup from './FormGroup.jsx';
import RichTextEditor from './RichTextEditor.jsx';
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
          <RichTextEditor
            key={entry.id}
            value={entry.content}
            onChange={content => update({ content })}
            placeholder="Write a short professional summary about yourself..."
            minHeight={100}
          />
        </FormGroup>
      </div>
    </div>
  );
}
