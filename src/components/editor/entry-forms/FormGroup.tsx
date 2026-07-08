import React, { ReactNode } from 'react';

interface FormGroupProps {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
}

export default function FormGroup({ label, children, fullWidth }: FormGroupProps) {
  return (
    <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}
