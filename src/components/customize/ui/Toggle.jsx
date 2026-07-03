import React from 'react';

export default function Toggle({ on, onClick }) {
  return (
    <button className={`cz-toggle ${on ? 'on' : ''}`} onClick={onClick}>
      <span className="cz-toggle-thumb" />
    </button>
  );
}
