import React from 'react';
import Card from '../ui/Card.jsx';
import SelectInput from '../ui/SelectInput.jsx';
import type { CustomizeSectionProps } from '../../../types';

export default function FontSettings({ customize, updateCustomize }: CustomizeSectionProps) {
  const font = customize.font || {};
  const FONTS = [
    { value: 'default', label: 'Default (Template Font)' },
    { value: 'Lora', label: 'Lora (Serif)' },
    { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
    { value: 'Raleway', label: 'Raleway (Sans)' },
    { value: 'Inter', label: 'Inter (Sans)' },
    { value: 'Merriweather', label: 'Merriweather (Serif)' },
    { value: 'Source Sans 3', label: 'Source Sans 3 (Sans)' },
  ];
  return (
    <Card id="font" title="Font">
      <SelectInput
        label="Font Family"
        value={font.family || 'default'}
        options={FONTS}
        onChange={v => updateCustomize('font', { family: v })}
      />
      <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8 }}>
        Override applies across all resume text. Some templates may have specific pairings.
      </p>
    </Card>
  );
}
