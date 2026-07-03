import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { PALETTES } from './index.js';
import { formatDate, formatDateRange } from './shared/formatDate.js';

export const meta = {
  id: 'mercury-flow',
  name: 'Mercury Flow',
  category: 'creative',
  description: 'Elegant minimal with editorial date column',
  fonts: ['Playfair Display', 'Lato'],
  defaultCustomize: {
    colors: {
      scheme: 'border',
      paletteIndex: 1,
      accentApplyTo: { name: true, jobTitle: true, headings: false, headingsLine: false, headerIcons: true, dots: false, dates: true, entrySubtitle: false, linkIcons: true }
    },
    headings: { uppercase: false, underline: false },
    layout: { columns: 'one' },
    entries: { bulletStyle: 'dot' },
    spacing: { lineHeight: 1.4, spaceBetweenElements: 10, leftRightMargin: 14 },
    font: { family: 'default' },
    photo: { size: 'medium', shape: 'circle' },
    links: { showLinkedin: true, showWebsite: true, hyperlink: false },
    header: { showName: true, showTitle: true, showContact: true },
    document: { language: 'English (UK)', dateFormat: 'MMM YYYY', pageFormat: 'A4' },
    fontSize: { base: 10.5, fullName: 17, professionalTitle: 12.5, sectionHeadings: 3, entryHeader: 1 },
  },
  fontFamilies: { heading: "'Playfair Display', serif", body: "'Lato', sans-serif" },
  supports: {
    columns: ['one'],
    photo: true,
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


export default function MercuryFlow({ personal, sections, customize = {} }) {
  const {
    fontSize = {},
    spacing = {},
    colors = {},
    headings: hdg = {},
    entries: ent = {},
    font = {},
    photo: photoSettings = {},
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
  const palette = PALETTES[colors.paletteIndex ?? 1];
  const accent = palette?.accent ?? '#1A6B5F';
  const applyTo = colors.accentApplyTo || {};
  const isUppercase = hdg.uppercase ?? false;
  const hasUnderline = hdg.underline ?? false;
  const BULLETS = { dot: '•', dash: '–', arrow: '→', none: '' };
  const bullet = BULLETS[ent.bulletStyle || 'dot'];
  const headingFont = font.family && font.family !== 'default' ? font.family : meta.fontFamilies.heading;
  const bodyFont = font.family && font.family !== 'default' ? font.family : meta.fontFamilies.body;

  const entryGap = `${spacing.spaceBetweenElements ?? 6}px`;
  const margin = `${spacing.leftRightMargin ?? 14}mm`;
  const lineHeight = spacing.lineHeight ?? 1.4;

  const rootStyle = {
    fontFamily: bodyFont,
    fontSize: `${basePt}pt`,
    lineHeight,
    padding: `48px ${margin}`,
    background: '#fff',
    color: '#1a1a2e',
    minHeight: '100%',
  };

  const nameStyle = {
    fontSize: `${basePt + fontSize.fullName}pt`,
    fontFamily: headingFont,
    fontWeight: 700,
    color: applyTo.name ? accent : '#1a1a2e',
    letterSpacing: '-0.01em',
    lineHeight: 1.1,
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
    fontFamily: headingFont,
    textTransform: isUppercase ? 'uppercase' : 'none',
    letterSpacing: isUppercase ? '0.08em' : '0.02em',
    fontWeight: 700,
    color: applyTo.headings ? accent : '#1a1a2e',
    borderBottom: hasUnderline ? `2px solid ${applyTo.headingsLine ? accent : '#1a1a2e'}` : 'none',
    paddingBottom: hasUnderline ? 4 : 0,
    marginBottom: 12,
    paddingLeft: 0,
  };

  const entryTitleStyle = {
    fontSize: `${basePt + fontSize.entryHeader}pt`,
    fontWeight: 600,
    color: '#1a1a2e',
  };

  const dateColStyle = {
    color: applyTo.dates ? accent : '#888',
    fontSize: `${basePt - 1}pt`,
    minWidth: 80,
    maxWidth: 90,
    paddingTop: 2,
    textAlign: 'right',
    flexShrink: 0,
    lineHeight: 1.3,
  };

  const contactIconColor = applyTo.headerIcons ? accent : '#888';

  // Photo
  const photoSizeMap = { small: 60, medium: 75, large: 90 };
  const photoSize = photoSizeMap[photoSettings.size || 'medium'];
  const photoShapeStyle = photoSettings.shape === 'square'
    ? { borderRadius: 0 }
    : photoSettings.shape === 'rounded'
    ? { borderRadius: 8 }
    : { borderRadius: '50%' };

  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ');
  const initials = [personal.firstName?.[0], personal.lastName?.[0]].filter(Boolean).join('');
  const visibleSections = sections.filter(s => s.visible);

  return (
    <div className="mf-resume" style={rootStyle}>
      {/* Header */}
      <div className="mf-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, borderBottom: `3px solid ${accent}`, paddingBottom: 20 }}>
        <div className="mf-header-left">
          {showName && <div className="mf-name" style={nameStyle}>{fullName || 'Your Name'}</div>}
          {showTitle && personal.title && (
            <div className="mf-job-title" style={titleStyle}>{personal.title}</div>
          )}
          {showContact && <div className="mf-contact-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginTop: 8 }}>
            {personal.email && (
              <span className="mf-contact-item" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: `${basePt - 0.5}pt`, color: '#555' }}>
                <Mail size={11} style={{ color: contactIconColor }} />{personal.email}
              </span>
            )}
            {personal.phone && (
              <span className="mf-contact-item" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: `${basePt - 0.5}pt`, color: '#555' }}>
                <Phone size={11} style={{ color: contactIconColor }} />{personal.phone}
              </span>
            )}
            {personal.location && (
              <span className="mf-contact-item" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: `${basePt - 0.5}pt`, color: '#555' }}>
                <MapPin size={11} style={{ color: contactIconColor }} />{personal.location}
              </span>
            )}
            {personal.linkedin && showLinkedin && (
              <span className="mf-contact-item" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: `${basePt - 0.5}pt`, color: '#555' }}>
                <Linkedin size={11} style={{ color: applyTo.linkIcons ? accent : contactIconColor }} />
                {hyperlink ? <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{personal.linkedin}</a> : personal.linkedin}
              </span>
            )}
            {personal.website && showWebsite && (
              <span className="mf-contact-item" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: `${basePt - 0.5}pt`, color: '#555' }}>
                <Globe size={11} style={{ color: applyTo.linkIcons ? accent : contactIconColor }} />
                {hyperlink ? <a href={personal.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{personal.website}</a> : personal.website}
              </span>
            )}
          </div>}
        </div>

        <div className="mf-photo-circle" style={{
          width: photoSize,
          height: photoSize,
          ...photoShapeStyle,
          overflow: 'hidden',
          background: `${accent}22`,
          border: `2px solid ${accent}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginLeft: 16,
        }}>
          {personal.photo ? (
            <img src={personal.photo} alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span className="mf-photo-placeholder"
              style={{ fontSize: `${basePt + 6}pt`, fontWeight: 700, color: accent, fontFamily: headingFont }}>
              {initials || 'SS'}
            </span>
          )}
        </div>
      </div>

      {/* Sections */}
      {visibleSections.map(section => {
        const visibleEntries = section.entries.filter(e => e.visible);
        if (!visibleEntries.length) return null;

        return (
          <div className="mf-section" key={section.id} style={{ marginBottom: `${(spacing.spaceBetweenElements ?? 6) + 8}px` }}>
            <div className="mf-section-heading" style={sectionHeadingStyle}>
              {section.heading}
            </div>

            {section.type === 'profile' && visibleEntries.map(entry => (
              <p className="mf-profile-text" key={entry.id}
                style={{ fontSize: `${basePt}pt`, lineHeight, color: '#333', marginBottom: entryGap }}>
                {entry.content}
              </p>
            ))}

            {section.type === 'experience' && visibleEntries.map(entry => (
              <div className="mf-entry" key={entry.id}
                style={{ display: 'flex', gap: 16, marginBottom: entryGap }}>
                <div className="mf-entry-date-col" style={dateColStyle}>
                  {formatDateRange(entry.startDate, entry.endDate, entry.current, dateFormat, lang)}
                </div>
                <div className="mf-entry-body" style={{ flex: 1, minWidth: 0 }}>
                  <div className="mf-entry-title" style={entryTitleStyle}>{entry.title}</div>
                  <div className="mf-entry-subtitle"
                    style={{ color: applyTo.entrySubtitle ? accent : '#555', fontSize: `${basePt - 0.5}pt`, marginBottom: 2 }}>
                    {entry.company}
                  </div>
                  {entry.location && (
                    <div className="mf-entry-location"
                      style={{ color: '#888', fontSize: `${basePt - 1}pt`, marginBottom: 4 }}>
                      {entry.location}
                    </div>
                  )}
                  {entry.bullets?.filter(Boolean).length > 0 && (
                    <ul className="mf-bullets" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {entry.bullets.filter(Boolean).map((b, i) => (
                        <li className="mf-bullet" key={i}
                          style={{ fontSize: `${basePt}pt`, lineHeight, marginBottom: 2 }}>
                          {bullet && <span style={{ marginRight: 6, color: applyTo.dots ? accent : '#555' }}>{bullet}</span>}
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}

            {section.type === 'skills' && (
              <div className="mf-skills-list">
                {visibleEntries.map(entry => (
                  <div className="mf-skill-item" key={entry.id}
                    style={{ fontSize: `${basePt}pt`, lineHeight, marginBottom: 4 }}>
                    {entry.category && (
                      <span className="mf-skill-category" style={{ fontWeight: 600, color: '#1a1a2e' }}>{entry.category}: </span>
                    )}
                    <span style={{ color: '#444' }}>{entry.items}</span>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'education' && visibleEntries.map(entry => (
              <div className="mf-entry" key={entry.id}
                style={{ display: 'flex', gap: 16, marginBottom: entryGap }}>
                <div className="mf-entry-date-col" style={dateColStyle}>
                  {formatDateRange(entry.startDate, entry.endDate, false, dateFormat, lang)}
                </div>
                <div className="mf-entry-body" style={{ flex: 1, minWidth: 0 }}>
                  <div className="mf-entry-title" style={entryTitleStyle}>{entry.degree}</div>
                  <div className="mf-entry-subtitle"
                    style={{ color: applyTo.entrySubtitle ? accent : '#555', fontSize: `${basePt - 0.5}pt`, marginBottom: 2 }}>
                    {entry.school}
                  </div>
                  {entry.location && (
                    <div className="mf-entry-location"
                      style={{ color: '#888', fontSize: `${basePt - 1}pt`, marginBottom: 4 }}>
                      {entry.location}
                    </div>
                  )}
                  {entry.bullets?.filter(Boolean).length > 0 && (
                    <ul className="mf-bullets" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {entry.bullets.filter(Boolean).map((b, i) => (
                        <li className="mf-bullet" key={i}
                          style={{ fontSize: `${basePt}pt`, lineHeight, marginBottom: 2 }}>
                          {bullet && <span style={{ marginRight: 6, color: applyTo.dots ? accent : '#555' }}>{bullet}</span>}
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}

            {section.type === 'languages' && (
              <div className="mf-lang-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                {visibleEntries.map(entry => (
                  <div className="mf-lang-item" key={entry.id}>
                    <div className="mf-lang-name"
                      style={{ fontWeight: 600, fontSize: `${basePt}pt`, marginBottom: 4 }}>
                      {entry.language}
                    </div>
                    <div className="mf-lang-dots" style={{ display: 'flex', gap: 3 }}>
                      {[1,2,3,4,5].map(dot => (
                        <div
                          key={dot}
                          className={`mf-lang-dot ${dot <= (entry.level || 3) ? 'filled' : ''}`}
                          style={dot <= (entry.level || 3) && applyTo.dots ? { background: accent } : {}}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'certifications' && visibleEntries.map(entry => (
              <div className="mf-cert-entry" key={entry.id}
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: entryGap }}>
                <div>
                  <div className="mf-cert-name"
                    style={{ fontWeight: 600, fontSize: `${basePt}pt` }}>
                    {entry.name}
                  </div>
                  {entry.issuer && (
                    <div className="mf-cert-issuer"
                      style={{ color: '#555', fontSize: `${basePt - 0.5}pt` }}>
                      {entry.issuer}
                    </div>
                  )}
                </div>
                {entry.date && (
                  <div className="mf-cert-date"
                    style={{ color: applyTo.dates ? accent : '#888', fontSize: `${basePt - 1}pt`, whiteSpace: 'nowrap' }}>
                    {formatDate(entry.date, false, dateFormat, lang)}
                  </div>
                )}
              </div>
            ))}

            {section.type === 'custom' && visibleEntries.map(entry => (
              <p className="mf-profile-text" key={entry.id}
                style={{ fontSize: `${basePt}pt`, lineHeight, color: '#333', marginBottom: entryGap }}>
                {entry.content}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
