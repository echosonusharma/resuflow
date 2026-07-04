import React from 'react';

export default function ResuflowMark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="rf-mark-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff5f6d" />
          <stop offset="1" stopColor="#ff9966" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="url(#rf-mark-g)" />
      <path
        d="M12 22V10h5a3.5 3.5 0 0 1 0 7h-5m5 0 4.4 5"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
