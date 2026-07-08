import React from 'react';
import { useSections } from '../../../hooks/index.js';
import FormGroup from './FormGroup.jsx';
import RichTextEditor from './RichTextEditor.jsx';
import type { EntryFormProps, ProfileEntry } from '../../../types';

export default function CustomForm({ sectionId, entry }: EntryFormProps<ProfileEntry>) {
  const { updateEntry } = useSections();
  function update(data: Partial<ProfileEntry>) {
    updateEntry(sectionId, entry.id, data);
  }
  return (
    <div className="entry-form">
      <div className="entry-form-row single">
        <FormGroup label="Content" fullWidth>
          <RichTextEditor
            key={entry.id}
            value={entry.content || ''}
            onChange={content => update({ content })}
            placeholder="Enter your content..."
            minHeight={80}
          />
        </FormGroup>
      </div>
    </div>
  );
}
