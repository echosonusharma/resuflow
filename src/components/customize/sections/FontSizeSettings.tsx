import React from 'react';
import Card from '../ui/Card.jsx';
import RangeSlider from '../ui/RangeSlider.jsx';
import type { CustomizeSectionProps, FontSizeSettings as FontSizeSettingsType } from '../../../types';

export default function FontSizeSettings({ customize, updateCustomize }: CustomizeSectionProps) {
  const fs = customize.fontSize || {};
  const upd = (key: keyof FontSizeSettingsType, val: number) => updateCustomize('fontSize', { [key]: val });

  return (
    <Card id="font-size" title="Font Size">
      <RangeSlider label="Base Font Size" value={fs.base ?? 10.5} min={8} max={14} step={0.5} unit="pt"
        onChange={v => upd('base', v)} />
      <RangeSlider label="Full Name" value={fs.fullName ?? 17} min={0} max={30} step={0.5} unit="pt"
        onChange={v => upd('fullName', v)}
        presets={[3, 6, 9, 12, 15]} />
      <RangeSlider label="Professional Title" value={fs.professionalTitle ?? 12.5} min={0} max={20} step={0.5} unit="pt"
        onChange={v => upd('professionalTitle', v)} />
      <RangeSlider label="Section Headings" value={fs.sectionHeadings ?? 3} min={0} max={12} step={0.5} unit="pt"
        onChange={v => upd('sectionHeadings', v)} />
      <RangeSlider label="Entry Header" value={fs.entryHeader ?? 1} min={0} max={8} step={0.5} unit="pt"
        onChange={v => upd('entryHeader', v)} />
    </Card>
  );
}
