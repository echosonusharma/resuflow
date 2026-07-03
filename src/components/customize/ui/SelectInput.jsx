import React from 'react';

export default function SelectInput({ label, value, options, onChange }) {
  return (
    <div className="cz-form-group">
      <label className="cz-form-label">{label}</label>
      <div className="cz-select-wrap">
        <select className="cz-select" value={value} onChange={e => onChange(e.target.value)}>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="cz-select-arrow">▾</span>
      </div>
    </div>
  );
}
