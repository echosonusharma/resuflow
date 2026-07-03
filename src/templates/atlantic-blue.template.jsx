import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, User } from 'lucide-react';
import { PALETTES } from './index.js';
import { formatDate, formatDateRange } from './shared/formatDate.js';

export const meta = {
  id: 'atlantic-blue',
  name: 'Atlantic Blue',
  category: 'modern',
  description: 'Bold two-column with dark navy sidebar',
  fonts: ['Raleway', 'Open Sans'],
  defaultCustomize: {
    colors: {
      scheme: 'header',
      paletteIndex: 0,
      accentApplyTo: { name: false, jobTitle: false, headings: false, headingsLine: false, headerIcons: false, dots: false, dates: true, entrySubtitle: false, linkIcons: false }
    },
    headings: { uppercase: true, underline: false },
    layout: { columns: 'two' },
    entries: { bulletStyle: 'dot' },
    spacing: { lineHeight: 1.4, spaceBetweenElements: 8, leftRightMargin: 14 },
    font: { family: 'default' },
    photo: { size: 'medium', shape: 'circle' },
    links: { showLinkedin: true, showWebsite: true, hyperlink: false },
    header: { showName: true, showTitle: true, showContact: true },
    document: { language: 'English (UK)', dateFormat: 'MMM YYYY', pageFormat: 'A4' },
    fontSize: { base: 10.5, fullName: 17, professionalTitle: 12.5, sectionHeadings: 3, entryHeader: 1 },
  },
  fontFamilies: { heading: "'Raleway', sans-serif", body: "'Open Sans', sans-serif" },
  supports: {
    columns: ['two'],
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


export default function AtlanticBlue({ personal, sections, customize = {} }) {
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
  const palette = PALETTES[colors.paletteIndex ?? 0];
  const accent = palette?.accent ?? '#1E3A5F';
  const applyTo = colors.accentApplyTo || {};
  const isUppercase = hdg.uppercase ?? true;
  const hasUnderline = hdg.underline ?? false;
  const BULLETS = { dot: '•', dash: '–', arrow: '→', none: '' };
  const bullet = BULLETS[ent.bulletStyle || 'dot'];
  const headingFont = font.family && font.family !== 'default' ? font.family : meta.fontFamilies.heading;
  const bodyFont = font.family && font.family !== 'default' ? font.family : meta.fontFamilies.body;

  const entryGap = `${spacing.spaceBetweenElements ?? 6}px`;
  const margin = `${spacing.leftRightMargin ?? 14}mm`;
  const lineHeight = spacing.lineHeight ?? 1.4;

  const sidebarStyle = {
    background: accent,
    color: '#fff',
    padding: `32px ${margin}`,
    minWidth: 0,
    fontFamily: bodyFont,
    fontSize: `${basePt}pt`,
    lineHeight,
  };

  const sidebarHeadingStyle = {
    fontSize: `${basePt + fontSize.sectionHeadings}pt`,
    textTransform: isUppercase ? 'uppercase' : 'none',
    letterSpacing: '0.08em',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.85)',
    borderBottom: hasUnderline ? '1px solid rgba(255,255,255,0.3)' : 'none',
    paddingBottom: hasUnderline ? 4 : 0,
    marginBottom: 8,
    marginTop: 16,
    fontFamily: headingFont,
  };

  const mainStyle = {
    flex: 1,
    padding: `32px ${margin}`,
    fontFamily: bodyFont,
    fontSize: `${basePt}pt`,
    lineHeight,
    color: '#1a1a2e',
    background: '#fff',
    minWidth: 0,
  };

  const mainHeadingStyle = {
    fontSize: `${basePt + fontSize.sectionHeadings}pt`,
    textTransform: isUppercase ? 'uppercase' : 'none',
    letterSpacing: '0.08em',
    fontWeight: 700,
    color: applyTo.headings ? accent : '#1a1a2e',
    borderBottom: hasUnderline ? `2px solid ${applyTo.headingsLine ? accent : '#1a1a2e'}` : 'none',
    paddingBottom: hasUnderline ? 4 : 0,
    marginBottom: 10,
    marginTop: 16,
    fontFamily: headingFont,
  };

  const nameStyle = {
    fontSize: `${basePt + fontSize.fullName}pt`,
    fontWeight: 800,
    color: '#fff',
    fontFamily: headingFont,
    lineHeight: 1.1,
    marginBottom: 4,
    wordBreak: 'break-word',
  };

  const titleStyle = {
    fontSize: `${basePt + fontSize.professionalTitle}pt`,
    color: 'rgba(255,255,255,0.75)',
    fontStyle: 'italic',
    marginBottom: 16,
  };

  const entryTitleStyle = {
    fontSize: `${basePt + fontSize.entryHeader}pt`,
    fontWeight: 600,
    color: '#1a1a2e',
  };

  const dateStyle = {
    color: applyTo.dates ? accent : '#777',
    fontSize: `${basePt - 0.5}pt`,
    whiteSpace: 'nowrap',
  };

  // Photo size
  const photoSizeMap = { small: 64, medium: 80, large: 96 };
  const photoSize = photoSizeMap[photoSettings.size || 'medium'];
  const photoShapeStyle = photoSettings.shape === 'square'
    ? { borderRadius: 0 }
    : photoSettings.shape === 'rounded'
    ? { borderRadius: 8 }
    : { borderRadius: '50%' };

  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ');
  const visibleSections = sections.filter(s => s.visible);

  const sidebarTypes = ['profile', 'languages', 'certifications'];
  const mainTypes = ['experience', 'education', 'skills'];

  const sidebarSections = visibleSections.filter(s => sidebarTypes.includes(s.type));
  const mainSections = visibleSections.filter(s => mainTypes.includes(s.type) || !sidebarTypes.includes(s.type));

  const contactIconColor = 'rgba(255,255,255,0.7)';

  return (
    <div className="ab-resume" style={{ fontFamily: bodyFont, lineHeight }}>
      {/* Sidebar */}
      <div className="ab-sidebar" style={sidebarStyle}>
        {/* Photo */}
        <div className="ab-photo-circle" style={{
          width: photoSize,
          height: photoSize,
          ...photoShapeStyle,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          {personal.photo ? (
            <img src={personal.photo} alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User size={32} style={{ color: 'rgba(255,255,255,0.5)' }} />
          )}
        </div>

        {showName && <div className="ab-name" style={nameStyle}>{fullName || 'Your Name'}</div>}
        {showTitle && personal.title && (
          <div className="ab-job-title" style={titleStyle}>{personal.title}</div>
        )}

        {/* Contact */}
        {showContact && <div className="ab-sidebar-section">
          <div className="ab-sidebar-heading" style={sidebarHeadingStyle}>Contact</div>
          {personal.email && (
            <div className="ab-contact-item" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontSize: `${basePt - 0.5}pt`, color: 'rgba(255,255,255,0.85)', wordBreak: 'break-all' }}>
              <Mail size={11} style={{ color: contactIconColor, flexShrink: 0 }} />{personal.email}
            </div>
          )}
          {personal.phone && (
            <div className="ab-contact-item" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontSize: `${basePt - 0.5}pt`, color: 'rgba(255,255,255,0.85)' }}>
              <Phone size={11} style={{ color: contactIconColor, flexShrink: 0 }} />{personal.phone}
            </div>
          )}
          {personal.location && (
            <div className="ab-contact-item" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontSize: `${basePt - 0.5}pt`, color: 'rgba(255,255,255,0.85)' }}>
              <MapPin size={11} style={{ color: contactIconColor, flexShrink: 0 }} />{personal.location}
            </div>
          )}
          {personal.linkedin && showLinkedin && (
            <div className="ab-contact-item" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontSize: `${basePt - 0.5}pt`, color: 'rgba(255,255,255,0.85)', wordBreak: 'break-all' }}>
              <Linkedin size={11} style={{ color: contactIconColor, flexShrink: 0 }} />
              {hyperlink ? <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{personal.linkedin}</a> : personal.linkedin}
            </div>
          )}
          {personal.website && showWebsite && (
            <div className="ab-contact-item" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontSize: `${basePt - 0.5}pt`, color: 'rgba(255,255,255,0.85)', wordBreak: 'break-all' }}>
              <Globe size={11} style={{ color: contactIconColor, flexShrink: 0 }} />
              {hyperlink ? <a href={personal.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{personal.website}</a> : personal.website}
            </div>
          )}
        </div>}

        {/* Sidebar sections */}
        {sidebarSections.map(section => {
          const visibleEntries = section.entries.filter(e => e.visible);
          if (!visibleEntries.length) return null;

          return (
            <div className="ab-sidebar-section" key={section.id}>
              <div className="ab-sidebar-heading" style={sidebarHeadingStyle}>{section.heading}</div>

              {section.type === 'profile' && visibleEntries.map(entry => (
                <p className="ab-profile-text" key={entry.id}
                  style={{ fontSize: `${basePt}pt`, color: 'rgba(255,255,255,0.85)', lineHeight, marginBottom: entryGap }}>
                  {entry.content}
                </p>
              ))}

              {section.type === 'languages' && visibleEntries.map(entry => (
                <div className="ab-lang-row" key={entry.id}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span className="ab-lang-name"
                    style={{ fontSize: `${basePt}pt`, color: 'rgba(255,255,255,0.9)' }}>
                    {entry.language}
                  </span>
                  <div className="ab-lang-dots" style={{ display: 'flex', gap: 3 }}>
                    {[1,2,3,4,5].map(dot => (
                      <div
                        key={dot}
                        className={`ab-lang-dot ${dot <= (entry.level || 3) ? 'filled' : ''}`}
                        style={dot <= (entry.level || 3)
                          ? { background: 'rgba(255,255,255,0.9)' }
                          : { background: 'rgba(255,255,255,0.25)' }}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {section.type === 'certifications' && visibleEntries.map(entry => (
                <div className="ab-cert-item" key={entry.id} style={{ marginBottom: entryGap }}>
                  <div className="ab-cert-name"
                    style={{ fontWeight: 600, fontSize: `${basePt}pt`, color: 'rgba(255,255,255,0.9)' }}>
                    {entry.name}
                  </div>
                  {entry.issuer && (
                    <div className="ab-cert-issuer"
                      style={{ fontSize: `${basePt - 0.5}pt`, color: 'rgba(255,255,255,0.65)' }}>
                      {entry.issuer}
                    </div>
                  )}
                  {entry.date && (
                    <div className="ab-cert-date"
                      style={{ fontSize: `${basePt - 1}pt`, color: 'rgba(255,255,255,0.6)' }}>
                      {formatDate(entry.date, false, dateFormat, lang)}
                    </div>
                  )}
                </div>
              ))}

              {section.type === 'custom' && visibleEntries.map(entry => (
                <p className="ab-profile-text" key={entry.id}
                  style={{ fontSize: `${basePt}pt`, color: 'rgba(255,255,255,0.85)', lineHeight, marginBottom: entryGap }}>
                  {entry.content}
                </p>
              ))}
            </div>
          );
        })}
      </div>

      {/* Main column */}
      <div className="ab-main" style={mainStyle}>
        {mainSections.map((section, idx) => {
          const visibleEntries = section.entries.filter(e => e.visible);
          if (!visibleEntries.length) return null;

          return (
            <div key={section.id}>
              <div
                className={`ab-section-heading ${idx === 0 ? 'first-of-type' : ''}`}
                style={{ ...mainHeadingStyle, marginTop: idx === 0 ? 0 : 16 }}
              >
                {section.heading}
              </div>

              {section.type === 'experience' && visibleEntries.map(entry => (
                <div className="ab-entry" key={entry.id} style={{ marginBottom: entryGap }}>
                  <div className="ab-entry-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div className="ab-entry-title" style={entryTitleStyle}>{entry.title}</div>
                      <div className="ab-entry-company"
                        style={{ color: applyTo.entrySubtitle ? accent : '#444', fontSize: `${basePt - 0.5}pt` }}>
                        {entry.company}
                      </div>
                      {entry.location && (
                        <div className="ab-entry-location"
                          style={{ color: '#666', fontSize: `${basePt - 1}pt` }}>
                          {entry.location}
                        </div>
                      )}
                    </div>
                    <div className="ab-entry-date" style={dateStyle}>
                      {formatDateRange(entry.startDate, entry.endDate, entry.current, dateFormat, lang)}
                    </div>
                  </div>
                  {entry.bullets?.filter(Boolean).length > 0 && (
                    <ul className="ab-bullets" style={{ listStyle: 'none', padding: 0, margin: '4px 0 0' }}>
                      {entry.bullets.filter(Boolean).map((b, i) => (
                        <li className="ab-bullet" key={i}
                          style={{ fontSize: `${basePt}pt`, lineHeight, marginBottom: 2 }}>
                          {bullet && <span style={{ marginRight: 6, color: applyTo.dots ? accent : '#444' }}>{bullet}</span>}
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {section.type === 'education' && visibleEntries.map(entry => (
                <div className="ab-entry" key={entry.id} style={{ marginBottom: entryGap }}>
                  <div className="ab-entry-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div className="ab-entry-title" style={entryTitleStyle}>{entry.degree}</div>
                      <div className="ab-entry-company"
                        style={{ color: applyTo.entrySubtitle ? accent : '#444', fontSize: `${basePt - 0.5}pt` }}>
                        {entry.school}
                      </div>
                      {entry.location && (
                        <div className="ab-entry-location"
                          style={{ color: '#666', fontSize: `${basePt - 1}pt` }}>
                          {entry.location}
                        </div>
                      )}
                    </div>
                    <div className="ab-entry-date" style={dateStyle}>
                      {formatDateRange(entry.startDate, entry.endDate, false, dateFormat, lang)}
                    </div>
                  </div>
                  {entry.bullets?.filter(Boolean).length > 0 && (
                    <ul className="ab-bullets" style={{ listStyle: 'none', padding: 0, margin: '4px 0 0' }}>
                      {entry.bullets.filter(Boolean).map((b, i) => (
                        <li className="ab-bullet" key={i}
                          style={{ fontSize: `${basePt}pt`, lineHeight, marginBottom: 2 }}>
                          {bullet && <span style={{ marginRight: 6, color: applyTo.dots ? accent : '#444' }}>{bullet}</span>}
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {section.type === 'skills' && (
                <div className="ab-skills-section" style={{ marginBottom: entryGap }}>
                  {visibleEntries.map(entry => (
                    <div className="ab-skill-item" key={entry.id}
                      style={{ fontSize: `${basePt}pt`, lineHeight, marginBottom: 4 }}>
                      {entry.category && (
                        <span className="ab-skill-category" style={{ fontWeight: 600, color: '#1a1a2e' }}>{entry.category}: </span>
                      )}
                      <span style={{ color: '#444' }}>{entry.items}</span>
                    </div>
                  ))}
                </div>
              )}

              {section.type === 'custom' && visibleEntries.map(entry => (
                <p key={entry.id}
                  style={{ fontSize: `${basePt}pt`, lineHeight, color: '#444', marginBottom: entryGap }}>
                  {entry.content}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
