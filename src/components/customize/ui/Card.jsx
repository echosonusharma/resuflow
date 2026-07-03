import React from 'react';

export default function Card({ id, title, children }) {
  return (
    <div className="cz-card" id={`cz-${id}`}>
      <h3 className="cz-card-title">{title}</h3>
      {children}
    </div>
  );
}
