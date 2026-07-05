import React from 'react';
import { readCustomize, fullNameOf, visibleSectionsOf } from './shared/common.js';
import SectionBody from './shared/SectionBody.jsx';
import { formatDateRange } from './shared/formatDate.js';
import { getContactFields } from './shared/contactFields.js';

export const meta = {
  id: 'compact-ats',
  name: 'Compact ATS',
  category: 'simple',
  description: 'Dense, machine-readable layout optimized for applicant tracking systems',
  fonts: [],
  defaultCustomize: {
    colors: {
      scheme: 'plain',
      paletteIndex: 3,
      accentApplyTo: { name: false, jobTitle: false, headings: false, headingsLine: false, headerIcons: false, dots: false, dates: false, entrySubtitle: false, linkIcons: false }
    },
    headings: { uppercase: true, underline: true },
    layout: { columns: 'one' },
    entries: { bulletStyle: 'dash' },
    spacing: { lineHeight: 1.3, spaceBetweenElements: 6, leftRightMargin: 13 },
    font: { family: 'default' },
    photo: { size: 'medium', shape: 'circle' },
    links: { showLinkedin: true, showWebsite: true, hyperlink: false },
    header: { showName: true, showTitle: true, showContact: true },
    document: { language: 'English (UK)', dateFormat: 'MM/YYYY', pageFormat: 'A4' },
    fontSize: { base: 10, fullName: 8, professionalTitle: 2, sectionHeadings: 1.5, entryHeader: 0.5 },
  },
  fontFamilies: { heading: "Arial, Helvetica, sans-serif", body: "Arial, Helvetica, sans-serif" },
  supports: {
    columns: ['one'], photo: false, colorScheme: false, colorBackground: false,
    header: true, footer: true, dateFormat: true, fontSize: true, spacing: true,
    entries: true, headings: true, font: true, links: true,
  }
};

export default function CompactAts({ personal, sections, customize = {} }) {
  const c = readCustomize(customize, meta);
  const fullName = fullNameOf(personal);
  const visibleSections = visibleSectionsOf(sections);

  // Plain-text contact line: no icons, ATS parsers prefer raw strings
  const hiddenKeys = [];
  if (!c.showLinkedin) hiddenKeys.push('linkedin');
  if (!c.showWebsite) hiddenKeys.push('website');
  const contactParts = getContactFields(personal, { hiddenKeys })
    .map(({ display, label }) => label ? `${label}: ${display}` : display);

  const headingStyle = {
    fontSize: c.headingSize,
    fontWeight: 700,
    textTransform: c.isUppercase ? 'uppercase' : 'none',
    letterSpacing: '0.04em',
    color: '#000',
    borderBottom: c.hasUnderline ? '1px solid #000' : 'none',
    paddingBottom: c.hasUnderline ? 2 : 0,
    margin: '0 0 6px',
  };

  return (
    <div className="ca-resume" style={{
      fontFamily: c.bodyFont,
      fontSize: c.bodySize,
      lineHeight: c.lineHeight,
      color: '#000',
      background: '#fff',
      padding: `34px ${c.margin}`,
      minHeight: '100%',
    }}>
      <div style={{ marginBottom: 14 }}>
        {c.showName && (
          <div style={{ fontSize: c.nameSize, fontWeight: 700 }}>
            {fullName || 'Your Name'}
          </div>
        )}
        {c.showTitle && personal.title && (
          <div style={{ fontSize: c.titleSize, fontWeight: 400 }}>{personal.title}</div>
        )}
        {c.showContact && contactParts.length > 0 && (
          <div style={{ fontSize: c.smallSize, marginTop: 3, color: '#222' }}>
            {contactParts.join(' | ')}
          </div>
        )}
      </div>

      {visibleSections.map(section => (
        <div key={section.id} style={{ marginBottom: 10 }} data-preview-section="true">
          <div style={headingStyle}>{section.heading}</div>
          {['experience', 'volunteering', 'education'].includes(section.type) ? (
            section.entries.map(entry => {
              const title = section.type === 'education' ? entry.degree : entry.title;
              const org = section.type === 'education' ? entry.school : entry.company;
              const current = section.type === 'education' ? false : entry.current;
              return (
                <div key={entry.id} style={{ marginBottom: c.entryGap }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: c.entryHeaderSize }}>
                      <strong>{title}</strong>{org ? `, ${org}` : ''}{entry.location ? ` - ${entry.location}` : ''}
                    </span>
                    <span style={{ fontSize: c.smallSize, whiteSpace: 'nowrap' }}>
                      {formatDateRange(entry.startDate, entry.endDate, current, c.dateFormat, c.lang)}
                    </span>
                  </div>
                  {entry.bullets?.filter(Boolean).length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: '2px 0 0' }}>
                      {entry.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} style={{ fontSize: c.bodySize, lineHeight: c.lineHeight }}>
                          {c.bullet && <span style={{ marginRight: 5 }}>{c.bullet}</span>}
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          ) : section.type === 'languages' ? (
            <div style={{ fontSize: c.bodySize }}>
              {section.entries.map(e => e.language).filter(Boolean).join(', ')}
            </div>
          ) : (
            <SectionBody section={section} c={c} />
          )}
        </div>
      ))}
    </div>
  );
}
