import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

/**
 * Renders contact rows/items with icons. `stacked` renders block rows,
 * otherwise inline spans (wrap in a flex container).
 */
export default function ContactItems({ personal, c, iconSize = 11, iconColor = '#555', itemStyle = {}, stacked = false }) {
  const linkColor = c.applyTo.linkIcons ? c.accent : iconColor;

  const link = url =>
    c.hyperlink
      ? <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{url}</a>
      : url;

  const items = [
    personal.email && { icon: Mail, color: iconColor, content: personal.email },
    personal.phone && { icon: Phone, color: iconColor, content: personal.phone },
    personal.location && { icon: MapPin, color: iconColor, content: personal.location },
    personal.linkedin && c.showLinkedin && { icon: Linkedin, color: linkColor, content: link(personal.linkedin) },
    personal.website && c.showWebsite && { icon: Globe, color: linkColor, content: link(personal.website) },
  ].filter(Boolean);

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: c.smallSize,
    ...(stacked ? { marginBottom: 4, wordBreak: 'break-all' } : {}),
    ...itemStyle,
  };

  return items.map(({ icon: Icon, color, content }, i) => (
    <span key={i} style={baseStyle}>
      <Icon size={iconSize} style={{ color, flexShrink: 0 }} />
      {content}
    </span>
  ));
}
