import React from 'react';
import Card from '../ui/Card.jsx';
import RangeSlider from '../ui/RangeSlider.jsx';
import type { CustomizeSectionProps, SpacingSettings as SpacingSettingsType } from '../../../types';

export default function SpacingSettings({ customize, updateCustomize }: CustomizeSectionProps) {
  const sp = customize.spacing || {};
  const upd = (key: keyof SpacingSettingsType, val: number) => updateCustomize('spacing', { [key]: val });

  const spaceLabel = (v: number) => {
    const steps = ['−−−−−−−−−', '−−−−−−−−', '−−−−−−−', '−−−−−−', '−−−−−', '−−−−', '−−−', '−−', '−', ''];
    const idx = Math.min(Math.floor(v / 2), steps.length - 1);
    return `[${steps[Math.max(0, steps.length - 1 - idx)]}]`;
  };

  return (
    <Card id="spacing" title="Spacing">
      <RangeSlider label="Line Height" value={sp.lineHeight ?? 1.2} min={0.8} max={2.0} step={0.1} unit=""
        onChange={v => upd('lineHeight', v)} />
      <div className="cz-range-row">
        <div className="cz-range-header">
          <span className="cz-range-label">Space Between Elements</span>
          <span className="cz-range-value">{spaceLabel(sp.spaceBetweenElements ?? 6)}</span>
        </div>
        <div className="cz-range-controls">
          <input type="range" min={0} max={20} step={1} value={sp.spaceBetweenElements ?? 6}
            onChange={e => upd('spaceBetweenElements', +e.target.value)} className="cz-range-input" />
          <button className="cz-range-btn" onClick={() => upd('spaceBetweenElements', Math.max(0, (sp.spaceBetweenElements ?? 6) - 1))}>−</button>
          <button className="cz-range-btn" onClick={() => upd('spaceBetweenElements', Math.min(20, (sp.spaceBetweenElements ?? 6) + 1))}>+</button>
        </div>
      </div>
      <RangeSlider label="Left & Right Margin" value={sp.leftRightMargin ?? 14} min={4} max={30} step={1} unit="mm"
        onChange={v => upd('leftRightMargin', v)} />
    </Card>
  );
}
