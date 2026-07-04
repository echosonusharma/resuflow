import React from 'react';
import { useSections } from '../../../hooks/index.js';
import FormGroup from './FormGroup.jsx';

export default function LanguagesForm({ sectionId, entry }) {
  const { updateEntry } = useSections();
  function update(data) {
    updateEntry(sectionId, entry.id, data);
  }

  const levelLabels = ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Native'];

  return (
    <div className="entry-form">
      <div className="entry-form-row single">
        <FormGroup label="Language">
          <input
            className="form-input"
            value={entry.language}
            onChange={e => update({ language: e.target.value })}
            placeholder="e.g. English"
          />
        </FormGroup>
      </div>
      <div className="form-group">
        <label className="form-label">
          Proficiency Level: {levelLabels[(entry.level || 3) - 1]}
        </label>
        <div className="lang-dots">
          {[1, 2, 3, 4, 5].map(dot => (
            <button
              key={dot}
              className={`lang-dot ${dot <= (entry.level || 3) ? 'filled' : ''}`}
              onClick={() => update({ level: dot })}
              title={levelLabels[dot - 1]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
