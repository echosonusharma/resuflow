import React from 'react';

export default function FormGroup({ label, children, fullWidth }) {
  return (
    <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}
