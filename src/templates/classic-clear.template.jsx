import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { PALETTES } from './index.js';
import { formatDate, formatDateRange } from './shared/formatDate.js';

export const meta = {
  id: 'classic-clear',
  name: 'Classic Clear',
  category: 'simple',
  description: 'Traditional corporate resume with clean typography',
  fonts: ['Lora', 'Source Sans 3'],
  defaultCustomize: {
    colors: {
      scheme: 'full-page',
      paletteIndex: 0,
      accentApplyTo: { name: false, jobTitle: false, headings: false, headingsLine: true, headerIcons: true, dots: false, dates: false, entrySubtitle: false, linkIcons: true }
    },
    headings: { uppercase: true, underline: true },
    layout: { columns: 'one' },
    entries: { bulletStyle: 'dot' },
    spacing: { lineHeight: 1.4, spaceBetweenElements: 8, leftRightMargin: 14 },
    font: { family: 'default' },
    photo: { size: 'medium', shape: 'circle' },
    links: { showLinkedin: true, showWebsite: true, hyperlink: false },
    header: { showName: true, showTitle: true, showContact: true },
    document: { language: 'English (UK)', dateFormat: 'MMM YYYY', pageFormat: 'A4' },
    fontSize: { base: 10.5, fullName: 17, professionalTitle: 12.5, sectionHeadings: 3, entryHeader: 1 },
  },
  fontFamilies: { heading: "'Lora', serif", body: "'Source Sans 3', sans-serif" },
  supports: {
    columns: ['one'],
    photo: false,
    colorScheme: false,
    colorBackground: false,
    header: true,
    footer: true,
    dateFormat: true,
    fontSize: true,
    spacing: true,
    entries: true,
    headings: true,
    font: true,
    links: true,
  }
};


export default function ClassicClear({ personal, sections, customize = {} }) {
  const {
    fontSize = {},
    spacing = {},
    colors = {},
    headings: hdg = {},
    entries: ent = {},
    font = {},
    links: linkSettings = {},
    header: headerSettings = {},
    document: docSettings = {},
  } = customize;
  const showName = headerSettings.showName !== false;
  const showTitle = headerSettings.showTitle !== false;
  const showContact = headerSettings.showContact !== false;
  const dateFormat = docSettings.dateFormat || 'MMM YYYY';
  const lang = docSettings.language;
  const showLinkedin = linkSettings.showLinkedin !== false;
  const showWebsite = linkSettings.showWebsite !== false;
  const hyperlink = linkSettings.hyperlink === true;

  const basePt = fontSize.base;
  const palette = PALETTES[colors.paletteIndex ?? 0];
  const accent = palette?.accent ?? '#1E3A5F';
  const applyTo = colors.accentApplyTo || {};
  const isUppercase = hdg.uppercase ?? true;
  const hasUnderline = hdg.underline ?? true;
  const BULLETS = { dot: '•', dash: '–', arrow: '→', none: '' };
  const bullet = BULLETS[ent.bulletStyle || 'dot'];
  const fontFamily = font.family && font.family !== 'default' ? font.family : meta.fontFamilies.heading;
  const bodyFont = font.family && font.family !== 'default' ? font.family : meta.fontFamilies.body;

  const nameStyle = {
    fontSize: `${basePt + fontSize.fullName}pt`,
    color: applyTo.name ? accent : '#1a1a2e',
    fontFamily,
    fontWeight: 700,
    letterSpacing: '0.01em',
    marginBottom: 4,
  };
  const titleStyle = {
    fontSize: `${basePt + fontSize.professionalTitle}pt`,
    color: applyTo.jobTitle ? accent : '#555',
    fontStyle: 'italic',
    marginBottom: 8,
  };
  const sectionHeadingStyle = {
    fontSize: `${basePt + fontSize.sectionHeadings}pt`,
    textTransform: isUppercase ? 'uppercase' : 'none',
    borderBottom: hasUnderline ? `2px solid ${applyTo.headingsLine ? accent : '#1a1a2e'}` : 'none',
    color: applyTo.headings ? accent : '#1a1a2e',
    letterSpacing: '0.08em',
    fontWeight: 700,
    paddingBottom: hasUnderline ? 4 : 0,
    marginBottom: 10,
    marginTop: 0,
    fontFamily,
  };
  const entryHeaderStyle = {
    fontSize: `${basePt + fontSize.entryHeader}pt`,
    fontWeight: 600,
  };
  const rootStyle = {
    fontFamily: bodyFont,
    fontSize: `${basePt}pt`,
    lineHeight: spacing.lineHeight ?? 1.4,
    padding: `48px ${spacing.leftRightMargin ?? 14}mm`,
    background: '#fff',
    color: '#1a1a2e',
    minHeight: '100%',
  };
  const dateStyle = {
    color: applyTo.dates ? accent : '#777',
    fontSize: `${basePt - 0.5}pt`,
    whiteSpace: 'nowrap',
  };
  const entryGap = `${spacing.spaceBetweenElements ?? 6}px`;
  const contactIconColor = applyTo.headerIcons ? accent : '#555';

  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ');
  const visibleSections = sections.filter(s => s.visible);

  return (
    <div className="cc-resume" style={rootStyle}>
      {/* Header */}
      <div className="cc-header">
        {showName && <div className="cc-name" style={nameStyle}>{fullName || 'Your Name'}</div>}
        {showTitle && personal.title && (
          <div className="cc-job-title" style={titleStyle}>{personal.title}</div>
        )}

        {showContact && <div className="cc-contact-row">
          {personal.email && (
            <span className="cc-contact-item">
              <Mail size={11} style={{ color: contactIconColor }} />{personal.email}
            </span>
          )}
          {personal.phone && (
            <span className="cc-contact-item">
              <Phone size={11} style={{ color: contactIconColor }} />{personal.phone}
            </span>
          )}
          {personal.location && (
            <span className="cc-contact-item">
              <MapPin size={11} style={{ color: contactIconColor }} />{personal.location}
            </span>
          )}
          {personal.linkedin && showLinkedin && (
            <span className="cc-contact-item">
              <Linkedin size={11} style={{ color: applyTo.linkIcons ? accent : contactIconColor }} />
              {hyperlink ? <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{personal.linkedin}</a> : personal.linkedin}
            </span>
          )}
          {personal.website && showWebsite && (
            <span className="cc-contact-item">
              <Globe size={11} style={{ color: applyTo.linkIcons ? accent : contactIconColor }} />
              {hyperlink ? <a href={personal.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{personal.website}</a> : personal.website}
            </span>
          )}
        </div>}
      </div>

      {/* Sections */}
      {visibleSections.map(section => {
        const visibleEntries = section.entries.filter(e => e.visible);
        if (!visibleEntries.length) return null;

        return (
          <div className="cc-section" key={section.id} style={{ marginBottom: entryGap }}>
            <div className="cc-section-heading" style={sectionHeadingStyle}>
              {section.heading}
            </div>

            {section.type === 'profile' && visibleEntries.map(entry => (
              <p className="cc-profile-text" key={entry.id}
                style={{ fontSize: `${basePt}pt`, lineHeight: spacing.lineHeight ?? 1.4 }}>
                {entry.content}
              </p>
            ))}

            {section.type === 'experience' && visibleEntries.map(entry => (
              <div className="cc-entry" key={entry.id} style={{ marginBottom: entryGap }}>
                <div className="cc-entry-header">
                  <div>
                    <div className="cc-entry-title" style={entryHeaderStyle}>{entry.title}</div>
                    <div className="cc-entry-subtitle"
                      style={{ color: applyTo.entrySubtitle ? accent : '#555', fontSize: `${basePt - 0.5}pt` }}>
                      {[entry.company, entry.location].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <div className="cc-entry-date" style={dateStyle}>
                    {formatDateRange(entry.startDate, entry.endDate, entry.current, dateFormat, lang)}
                  </div>
                </div>
                {entry.bullets?.filter(Boolean).length > 0 && (
                  <ul className="cc-bullets" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {entry.bullets.filter(Boolean).map((b, i) => (
                      <li className="cc-bullet" key={i}
                        style={{ fontSize: `${basePt}pt`, lineHeight: spacing.lineHeight ?? 1.4 }}>
                        {bullet && <span style={{ marginRight: 6, color: applyTo.dots ? accent : 'inherit' }}>{bullet}</span>}
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {section.type === 'skills' && (
              <div className="cc-skills-grid">
                {visibleEntries.map(entry => (
                  <div className="cc-skill-item" key={entry.id}
                    style={{ fontSize: `${basePt}pt`, lineHeight: spacing.lineHeight ?? 1.4 }}>
                    {entry.category && (
                      <span className="cc-skill-category" style={{ fontWeight: 600 }}>{entry.category}: </span>
                    )}
                    <span>{entry.items}</span>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'education' && visibleEntries.map(entry => (
              <div className="cc-entry" key={entry.id} style={{ marginBottom: entryGap }}>
                <div className="cc-entry-header">
                  <div>
                    <div className="cc-entry-title" style={entryHeaderStyle}>{entry.degree}</div>
                    <div className="cc-entry-subtitle"
                      style={{ color: applyTo.entrySubtitle ? accent : '#555', fontSize: `${basePt - 0.5}pt` }}>
                      {[entry.school, entry.location].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <div className="cc-entry-date" style={dateStyle}>
                    {formatDateRange(entry.startDate, entry.endDate, false, dateFormat, lang)}
                  </div>
                </div>
                {entry.bullets?.filter(Boolean).length > 0 && (
                  <ul className="cc-bullets" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {entry.bullets.filter(Boolean).map((b, i) => (
                      <li className="cc-bullet" key={i}
                        style={{ fontSize: `${basePt}pt`, lineHeight: spacing.lineHeight ?? 1.4 }}>
                        {bullet && <span style={{ marginRight: 6, color: applyTo.dots ? accent : 'inherit' }}>{bullet}</span>}
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {section.type === 'languages' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px 0' }}>
                {visibleEntries.map(entry => (
                  <div className="cc-lang-row" key={entry.id}>
                    <span style={{ fontSize: `${basePt}pt` }}>{entry.language}</span>
                    <div className="cc-lang-dots">
                      {[1,2,3,4,5].map(dot => (
                        <div
                          key={dot}
                          className={`cc-lang-dot ${dot <= (entry.level || 3) ? 'filled' : ''}`}
                          style={dot <= (entry.level || 3) && applyTo.dots ? { background: accent, borderColor: accent } : {}}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'certifications' && visibleEntries.map(entry => (
              <div className="cc-cert-entry" key={entry.id} style={{ marginBottom: entryGap }}>
                <div>
                  <div className="cc-cert-name" style={{ fontWeight: 600, fontSize: `${basePt}pt` }}>{entry.name}</div>
                  <div className="cc-cert-issuer" style={{ color: '#555', fontSize: `${basePt - 0.5}pt` }}>{entry.issuer}</div>
                </div>
                <div className="cc-cert-date" style={dateStyle}>{formatDate(entry.date, false, dateFormat, lang)}</div>
              </div>
            ))}

            {section.type === 'custom' && visibleEntries.map(entry => (
              <p className="cc-profile-text" key={entry.id}
                style={{ fontSize: `${basePt}pt`, lineHeight: spacing.lineHeight ?? 1.4 }}>
                {entry.content}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
