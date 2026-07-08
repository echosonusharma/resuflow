import React from 'react';
import { X, Plus } from 'lucide-react';
import { useSections } from '../../../hooks/index.js';
import FormGroup from './FormGroup.jsx';
import type { EntryFormProps, EducationEntry } from '../../../types';

export default function EducationForm({ sectionId, entry }: EntryFormProps<EducationEntry>) {
  const { updateEntry } = useSections();
  function update(data: Partial<EducationEntry>) {
    updateEntry(sectionId, entry.id, data);
  }
  function addBullet() {
    update({ bullets: [...(entry.bullets || ['']), ''] });
  }
  function updateBullet(i: number, val: string) {
    const bullets = [...(entry.bullets || [''])];
    bullets[i] = val;
    update({ bullets });
  }
  function removeBullet(i: number) {
    const bullets = (entry.bullets || ['']).filter((_: string, idx: number) => idx !== i);
    update({ bullets: bullets.length ? bullets : [''] });
  }

  return (
    <div className="entry-form">
      <div className="entry-form-row single">
        <FormGroup label="Degree / Qualification">
          <input
            className="form-input"
            value={entry.degree}
            onChange={e => update({ degree: e.target.value })}
            placeholder="e.g. B.Tech in Computer Science"
          />
        </FormGroup>
      </div>
      <div className="entry-form-row single">
        <FormGroup label="School / University">
          <input
            className="form-input"
            value={entry.school}
            onChange={e => update({ school: e.target.value })}
            placeholder="e.g. MIT"
          />
        </FormGroup>
      </div>
      <div className="entry-form-row">
        <FormGroup label="Start Date">
          <input
            className="form-input"
            type="month"
            value={entry.startDate}
            onChange={e => update({ startDate: e.target.value })}
          />
        </FormGroup>
        <FormGroup label="End Date">
          <input
            className="form-input"
            type="month"
            value={entry.endDate}
            onChange={e => update({ endDate: e.target.value })}
          />
        </FormGroup>
      </div>
      <div className="entry-form-row single">
        <FormGroup label="Location">
          <input
            className="form-input"
            value={entry.location}
            onChange={e => update({ location: e.target.value })}
            placeholder="e.g. Cambridge, MA"
          />
        </FormGroup>
      </div>
      <div className="form-group full-width">
        <label className="form-label">Notes / Achievements</label>
        <div className="bullets-container">
          {(entry.bullets || ['']).map((b, i) => (
            <div className="bullet-row" key={i}>
              <textarea
                className="form-textarea"
                value={b}
                onChange={e => updateBullet(i, e.target.value)}
                placeholder={`Note ${i + 1}`}
                rows={2}
              />
              <button
                className="btn-remove-bullet"
                onClick={() => removeBullet(i)}
              >
                <X size={13} />
              </button>
            </div>
          ))}
          <button className="btn-add-bullet" onClick={addBullet}>
            <Plus size={13} />
            Add note
          </button>
        </div>
      </div>
    </div>
  );
}
