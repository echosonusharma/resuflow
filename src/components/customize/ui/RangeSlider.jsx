import React from 'react';

export default function RangeSlider({ label, value, min, max, step = 0.5, unit = 'pt', onChange, presets }) {
  return (
    <div className="cz-range-row">
      <div className="cz-range-header">
        <span className="cz-range-label">{label}</span>
        <span className="cz-range-value">{value}{unit}</span>
      </div>
      <div className="cz-range-controls">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="cz-range-input"
        />
        <button className="cz-range-btn" onClick={() => onChange(Math.max(min, parseFloat((value - step).toFixed(2))))}>−</button>
        <button className="cz-range-btn" onClick={() => onChange(Math.min(max, parseFloat((value + step).toFixed(2))))}>+</button>
      </div>
      {presets && (
        <div className="cz-range-presets">
          {presets.map(p => (
            <button key={p} className="cz-preset-btn" onClick={() => onChange(p)}>+{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
