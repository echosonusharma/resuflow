import React from 'react';
import Card from '../ui/Card.jsx';
import { PALETTES } from '../../../templates/index.js';
import type { CustomizeSectionProps, AccentApplyTo } from '../../../types';

export default function ColorsSettings({ customize, updateCustomize }: CustomizeSectionProps) {
  const colors = customize.colors || {};
  const accentApplyTo = colors.accentApplyTo || {};
  const paletteIndex = colors.paletteIndex ?? 0;

  const accentKeys: { key: keyof AccentApplyTo; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'dots', label: 'Dots/bars/bubbles' },
    { key: 'jobTitle', label: 'Job title' },
    { key: 'dates', label: 'Dates' },
    { key: 'headings', label: 'Headings' },
    { key: 'entrySubtitle', label: 'Entry subtitle' },
    { key: 'headingsLine', label: 'Headings line' },
    { key: 'linkIcons', label: 'Link icons' },
    { key: 'headerIcons', label: 'Header icons' },
  ];

  return (
    <Card id="colors" title="Colors">
      <p className="cz-form-label" style={{ marginBottom: 10 }}>Color Palette</p>
      <div className="cz-palette-grid">
        {PALETTES.map((pal, i) => (
          <div key={i} className={`cz-palette-item ${!colors.customAccent && paletteIndex === i ? 'active' : ''}`}
            onClick={() => updateCustomize('colors', { paletteIndex: i, customAccent: null })}>
            <span className="cz-palette-t1" style={{ color: pal.accent }}>T</span>
            <span className="cz-palette-t2" style={{ color: pal.text === '#f0e8e8' ? '#666' : pal.text }}>T</span>
          </div>
        ))}
        <label className={`cz-palette-item cz-palette-custom ${colors.customAccent ? 'active' : ''}`}>
          {colors.customAccent && (
            <span className="cz-palette-t1" style={{ color: colors.customAccent }}>T</span>
          )}
          <span style={{ fontSize: 12 }}>Custom</span>
          <input
            type="color"
            value={colors.customAccent || '#1E3A5F'}
            onChange={e => updateCustomize('colors', { customAccent: e.target.value })}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
          />
        </label>
      </div>

      <p className="cz-form-label" style={{ marginBottom: 10 }}>Apply Accent Color</p>
      <div className="cz-accent-grid">
        {accentKeys.map(({ key, label }) => (
          <label key={key} className="cz-accent-check">
            <input
              type="checkbox"
              checked={accentApplyTo[key] ?? false}
              onChange={e => updateCustomize('colors', {
                accentApplyTo: { ...accentApplyTo, [key]: e.target.checked }
              })}
            />
            {label}
          </label>
        ))}
      </div>
    </Card>
  );
}
