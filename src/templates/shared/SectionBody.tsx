import { type CSSProperties, type ReactNode } from 'react';
import { formatDate, formatDateRange } from './formatDate';
import { displayValue } from './contactFields';
import type { ReadCustomize, Section } from '../../types';

export interface SectionBodyStyles {
  text?: CSSProperties;
  title?: CSSProperties;
  subtitle?: CSSProperties;
  date?: CSSProperties;
  skillCategory?: CSSProperties;
  dotFilled?: CSSProperties;
  dotEmpty?: CSSProperties;
  langColumns?: string;
}

interface SectionBodyProps {
  section: Section;
  c: ReadCustomize;
  styles?: SectionBodyStyles;
}

interface DatedEntry {
  id: string;
  startDate: string;
  endDate: string;
  bullets?: string[];
}

/**
 * Renders the entries of one section by type, using values derived by
 * readCustomize (`c`). Templates override any style via `styles`.
 */
export default function SectionBody({ section, c, styles = {} }: SectionBodyProps): ReactNode {
  const st = {
    text: { fontSize: c.bodySize, lineHeight: c.lineHeight, margin: 0, ...styles.text },
    title: { fontSize: c.entryHeaderSize, fontWeight: 600, ...styles.title },
    subtitle: {
      fontSize: c.smallSize,
      color: c.applyTo.entrySubtitle ? c.accent : '#555',
      ...styles.subtitle,
    },
    date: {
      fontSize: c.smallSize,
      color: c.applyTo.dates ? c.accent : '#777',
      whiteSpace: 'nowrap',
      ...styles.date,
    },
    skillCategory: { fontWeight: 600, ...styles.skillCategory },
    dotFilled: { background: c.applyTo.dots ? c.accent : '#333', ...styles.dotFilled },
    dotEmpty: { background: '#d5d5d5', ...styles.dotEmpty },
  } satisfies Record<string, CSSProperties>;

  const bulletColor = c.applyTo.dots ? c.accent : 'inherit';

  const renderBullets = (entry: DatedEntry) =>
    (entry.bullets?.filter(Boolean).length ?? 0) > 0 && (
      <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 0' }}>
        {entry.bullets?.filter(Boolean).map((b, i) => (
          <li key={i} style={{ ...st.text, marginBottom: 2 }}>
            {c.bullet && <span style={{ marginRight: 6, color: bulletColor }}>{c.bullet}</span>}
            {b}
          </li>
        ))}
      </ul>
    );

  const renderDatedEntry = (
    entry: DatedEntry,
    title: string,
    subtitleParts: Array<string | undefined>,
    current: boolean,
  ) => (
    <div key={entry.id} style={{ marginBottom: c.entryGap }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={st.title}>{title}</div>
          <div style={st.subtitle}>{subtitleParts.filter(Boolean).join(' · ')}</div>
        </div>
        <div style={st.date}>
          {formatDateRange(entry.startDate, entry.endDate, current, c.dateFormat, c.lang)}
        </div>
      </div>
      {renderBullets(entry)}
    </div>
  );

  // Grouped case labels mirror the SECTION_KIND aliases in common.ts so the
  // discriminated union narrows section.entries per branch.
  switch (section.type) {
    case 'profile':
    case 'custom':
      return section.entries.map(entry => (
        <p key={entry.id} style={{ ...st.text, marginBottom: c.entryGap }}>{entry.content}</p>
      ));

    case 'experience':
    case 'volunteering':
      return section.entries.map(entry =>
        renderDatedEntry(entry, entry.title, [entry.company, entry.location], entry.current)
      );

    case 'education':
      return section.entries.map(entry =>
        renderDatedEntry(entry, entry.degree, [entry.school, entry.location], false)
      );

    case 'projects':
      return section.entries.map(entry =>
        renderDatedEntry(entry, entry.title, [entry.link ? displayValue('website', entry.link) : ''], false)
      );

    case 'references':
      return section.entries.map(entry => (
        <div key={entry.id} style={{ marginBottom: c.entryGap }}>
          <div style={{ ...st.text, fontWeight: 600 }}>{entry.name}</div>
          {entry.position && <div style={st.subtitle}>{entry.position}</div>}
          {entry.contact && <div style={st.text}>{entry.contact}</div>}
        </div>
      ));

    case 'skills':
    case 'interests':
      return section.entries.map(entry => (
        <div key={entry.id} style={{ ...st.text, marginBottom: 4 }}>
          {entry.category && <span style={st.skillCategory}>{entry.category}: </span>}
          <span>{entry.items}</span>
        </div>
      ));

    case 'languages':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: styles.langColumns || 'repeat(2, 1fr)', gap: '6px 16px' }}>
          {section.entries.map(entry => (
            <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={st.text}>{entry.language}</span>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1, 2, 3, 4, 5].map(dot => (
                  <div
                    key={dot}
                    style={{
                      width: 7, height: 7, borderRadius: '50%',
                      ...(dot <= (entry.level || 3) ? st.dotFilled : st.dotEmpty),
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      );

    case 'certifications':
    case 'awards':
    case 'courses':
    case 'publications':
      return section.entries.map(entry => (
        <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: c.entryGap }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...st.text, fontWeight: 600 }}>{entry.name}</div>
            {entry.issuer && <div style={st.subtitle}>{entry.issuer}</div>}
          </div>
          {entry.date && <div style={st.date}>{formatDate(entry.date, false, c.dateFormat, c.lang)}</div>}
        </div>
      ));

    default:
      return null;
  }
}
