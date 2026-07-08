import type { CSSProperties, ReactNode } from 'react';
import { getContactFields } from './contactFields';
import type { PersonalInfo, ReadCustomize } from '../../types';

const LINK_KEYS = new Set(['linkedin', 'website', 'github']);

interface ContactItemsProps {
  personal: PersonalInfo;
  c: ReadCustomize;
  iconSize?: number;
  iconColor?: string;
  itemStyle?: CSSProperties;
  stacked?: boolean;
}

/**
 * Renders contact rows/items with icons. `stacked` renders block rows,
 * otherwise inline spans (wrap in a flex container).
 */
export default function ContactItems({ personal, c, iconSize = 11, iconColor = '#555', itemStyle = {}, stacked = false }: ContactItemsProps): ReactNode {
  const linkColor = c.applyTo?.linkIcons ? c.accent : iconColor;

  const hiddenKeys: string[] = [];
  if (!c.showLinkedin) hiddenKeys.push('linkedin');
  if (!c.showWebsite) hiddenKeys.push('website');

  const fields = getContactFields(personal, { hiddenKeys });

  const baseStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 6,
    fontSize: c.smallSize,
    ...(stacked ? { marginBottom: 4 } : {}),
    ...itemStyle,
  };

  const textStyle: CSSProperties = {
    overflowWrap: 'anywhere',
    minWidth: 0,
    lineHeight: 1.3,
  };

  const link = (url: string, display: string): ReactNode =>
    c.hyperlink
      ? <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{display}</a>
      : display;

  return fields.map(({ key, icon: Icon, label, href, display }) => {
    const color = LINK_KEYS.has(key) ? linkColor : iconColor;
    const text = label ? `${label}: ${display}` : display;
    return (
      <span key={key} style={baseStyle}>
        <Icon size={iconSize} style={{ color, flexShrink: 0, marginTop: 2 }} />
        <span style={textStyle}>{href ? link(href, text) : text}</span>
      </span>
    );
  });
}
