import type { ReactNode } from 'react';

interface CardProps {
  id: string;
  title: string;
  children: ReactNode;
}

export default function Card({ id, title, children }: CardProps) {
  return (
    <div className="cz-card" id={`cz-${id}`}>
      <h3 className="cz-card-title">{title}</h3>
      {children}
    </div>
  );
}
