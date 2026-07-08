import React from 'react';
import Card from '../ui/Card.jsx';
import type { CustomizeSectionProps, BulletStyle } from '../../../types';

export default function EntriesSettings({ customize, updateCustomize }: CustomizeSectionProps) {
  const entries = customize.entries || {};
  return (
    <Card id="entries" title="Entries">
      <p className="cz-form-label" style={{ marginBottom: 10 }}>Bullet Style</p>
      <div className="cz-radio-group">
        {([{ value: 'dot', label: '• Dot' }, { value: 'dash', label: '– Dash' }, { value: 'arrow', label: '→ Arrow' }, { value: 'none', label: 'None' }] as { value: BulletStyle; label: string }[]).map(opt => (
          <label key={opt.value} className="cz-radio-label">
            <input type="radio" name="bulletStyle" value={opt.value}
              checked={(entries.bulletStyle || 'dot') === opt.value}
              onChange={() => updateCustomize('entries', { bulletStyle: opt.value })} />
            {opt.label}
          </label>
        ))}
      </div>
    </Card>
  );
}
