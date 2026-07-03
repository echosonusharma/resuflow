import React from 'react';
import { useSections } from '../../../hooks/index.js';
import FormGroup from './FormGroup.jsx';

export default function SkillsForm({ sectionId, entry }) {
  const { updateEntry } = useSections();
  function update(data) {
    updateEntry(sectionId, entry.id, data);
  }
  return (
    <div className="entry-form">
      <div className="entry-form-row single">
        <FormGroup label="Category">
          <input
            className="form-input"
            value={entry.category}
            onChange={e => update({ category: e.target.value })}
            placeholder="e.g. Languages, Frontend, Tools"
          />
        </FormGroup>
      </div>
      <div className="entry-form-row single">
        <FormGroup label="Skills (comma-separated)">
          <textarea
            className="form-textarea"
            value={entry.items}
            onChange={e => update({ items: e.target.value })}
            placeholder="e.g. JavaScript, TypeScript, React"
            rows={3}
          />
        </FormGroup>
      </div>
    </div>
  );
}
