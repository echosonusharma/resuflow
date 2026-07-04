import React from 'react';
import { X, Plus } from 'lucide-react';
import { useSections } from '../../../hooks/index.js';
import FormGroup from './FormGroup.jsx';

export default function ProjectsForm({ sectionId, entry }) {
  const { updateEntry } = useSections();
  function update(data) {
    updateEntry(sectionId, entry.id, data);
  }
  function addBullet() {
    update({ bullets: [...(entry.bullets || ['']), ''] });
  }
  function updateBullet(i, val) {
    const bullets = [...(entry.bullets || [''])];
    bullets[i] = val;
    update({ bullets });
  }
  function removeBullet(i) {
    const bullets = (entry.bullets || ['']).filter((_, idx) => idx !== i);
    update({ bullets: bullets.length ? bullets : [''] });
  }

  return (
    <div className="entry-form">
      <div className="entry-form-row">
        <FormGroup label="Project Name">
          <input
            className="form-input"
            value={entry.title}
            onChange={e => update({ title: e.target.value })}
            placeholder="e.g. Open-source CLI tool"
          />
        </FormGroup>
        <FormGroup label="Link">
          <input
            className="form-input"
            value={entry.link || ''}
            onChange={e => update({ link: e.target.value })}
            placeholder="e.g. github.com/user/project"
          />
        </FormGroup>
      </div>
      <div className="entry-form-row">
        <FormGroup label="Start Date">
          <input
            className="form-input"
            type="month"
            value={entry.startDate || ''}
            onChange={e => update({ startDate: e.target.value })}
          />
        </FormGroup>
        <FormGroup label="End Date">
          <input
            className="form-input"
            type="month"
            value={entry.endDate || ''}
            onChange={e => update({ endDate: e.target.value })}
          />
        </FormGroup>
      </div>
      <div className="form-group full-width">
        <label className="form-label">Bullet Points</label>
        <div className="bullets-container">
          {(entry.bullets || ['']).map((b, i) => (
            <div className="bullet-row" key={i}>
              <textarea
                className="form-textarea"
                value={b}
                onChange={e => updateBullet(i, e.target.value)}
                placeholder="Describe the challenge, your role, and the impact"
                rows={2}
              />
              <button
                className="btn-remove-bullet"
                onClick={() => removeBullet(i)}
                title="Remove bullet"
              >
                <X size={13} />
              </button>
            </div>
          ))}
          <button className="btn-add-bullet" onClick={addBullet}>
            <Plus size={13} />
            Add bullet
          </button>
        </div>
      </div>
    </div>
  );
}
