import React from 'react';
import { readCustomize, fullNameOf, visibleSectionsOf } from './shared/common.js';
import SectionBody from './shared/SectionBody.jsx';
import ContactItems from './shared/ContactItems.jsx';

export const meta = {
  id: 'ivory-professional',
  name: 'Ivory Professional',
  category: 'simple',
  description: 'Executive serif resume with centered header and refined rules',
  fonts: ['Merriweather', 'Source Sans 3'],
  defaultCustomize: {
    colors: {
      scheme: 'full-page',
      paletteIndex: 3,
      accentApplyTo: { name: false, jobTitle: false, headings: true, headingsLine: true, headerIcons: false, dots: true, dates: false, entrySubtitle: false, linkIcons: false }
    },
    headings: { uppercase: true, underline: true },
    layout: { columns: 'one' },
    entries: { bulletStyle: 'dash' },
    spacing: { lineHeight: 1.45, spaceBetweenElements: 10, leftRightMargin: 16 },
    font: { family: 'default' },
    photo: { size: 'medium', shape: 'circle' },
    links: { showLinkedin: true, showWebsite: true, hyperlink: false },
    header: { showName: true, showTitle: true, showContact: true },
    document: { language: 'English (UK)', dateFormat: 'MMM YYYY', pageFormat: 'A4' },
    fontSize: { base: 10.5, fullName: 15, professionalTitle: 3, sectionHeadings: 2, entryHeader: 1 },
  },
  fontFamilies: { heading: "'Merriweather', serif", body: "'Source Sans 3', sans-serif" },
  supports: {
    columns: ['one'], photo: false, colorScheme: false, colorBackground: false,
    header: true, footer: true, dateFormat: true, fontSize: true, spacing: true,
    entries: true, headings: true, font: true, links: true,
  }
};

export default function IvoryProfessional({ personal, sections, customize = {} }) {
  const c = readCustomize(customize, meta);
  const fullName = fullNameOf(personal);
  const visibleSections = visibleSectionsOf(sections);

  const headingStyle = {
    fontSize: c.headingSize,
    fontFamily: c.headingFont,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: c.isUppercase ? 'uppercase' : 'none',
    color: c.applyTo.headings ? c.accent : '#2b2b2b',
    borderBottom: c.hasUnderline ? `1px solid ${c.applyTo.headingsLine ? c.accent : '#2b2b2b'}` : 'none',
    paddingBottom: c.hasUnderline ? 5 : 0,
    margin: '0 0 10px',
    textAlign: 'center',
  };

  return (
    <div className="ip-resume" style={{
      fontFamily: c.bodyFont,
      fontSize: c.bodySize,
      lineHeight: c.lineHeight,
      color: '#2b2b2b',
      background: '#fff',
      padding: `44px ${c.margin}`,
      minHeight: '100%',
    }}>
      <div className="ip-header" style={{ textAlign: 'center', marginBottom: 22 }}>
        {c.showName && (
          <div style={{
            fontSize: c.nameSize,
            fontFamily: c.headingFont,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: c.applyTo.name ? c.accent : '#1f1f1f',
          }}>
            {fullName || 'Your Name'}
          </div>
        )}
        {c.showTitle && personal.title && (
          <div style={{
            fontSize: c.titleSize,
            color: c.applyTo.jobTitle ? c.accent : '#666',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginTop: 4,
          }}>
            {personal.title}
          </div>
        )}
        <div style={{
          width: 60, height: 2, margin: '12px auto',
          background: c.applyTo.headingsLine ? c.accent : '#2b2b2b',
        }} />
        {c.showContact && (
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 16px' }}>
            <ContactItems personal={personal} c={c}
              iconColor={c.applyTo.headerIcons ? c.accent : '#888'} />
          </div>
        )}
      </div>

      {visibleSections.map(section => (
        <div key={section.id} style={{ marginBottom: 16 }}>
          <div style={headingStyle}>{section.heading}</div>
          <SectionBody section={section} c={c} />
        </div>
      ))}
    </div>
  );
}
