import React from 'react';
import { readCustomize, fullNameOf, visibleSectionsOf } from './shared/common.js';
import SectionBody from './shared/SectionBody.jsx';
import ContactItems from './shared/ContactItems.jsx';

export const meta = {
  id: 'nordic-minimal',
  name: 'Nordic Minimal',
  category: 'simple',
  description: 'Ultra-clean single column with hairline rules and generous whitespace',
  fonts: ['Inter'],
  defaultCustomize: {
    colors: {
      scheme: 'minimal',
      paletteIndex: 5,
      accentApplyTo: { name: false, jobTitle: true, headings: false, headingsLine: false, headerIcons: false, dots: true, dates: false, entrySubtitle: false, linkIcons: false }
    },
    headings: { uppercase: true, underline: false },
    layout: { columns: 'one' },
    entries: { bulletStyle: 'none' },
    spacing: { lineHeight: 1.55, spaceBetweenElements: 12, leftRightMargin: 18 },
    font: { family: 'default' },
    photo: { size: 'medium', shape: 'circle' },
    links: { showLinkedin: true, showWebsite: true, hyperlink: false },
    header: { showName: true, showTitle: true, showContact: true },
    document: { language: 'English (UK)', dateFormat: 'MMM YYYY', pageFormat: 'A4' },
    fontSize: { base: 10, fullName: 20, professionalTitle: 3, sectionHeadings: 0.5, entryHeader: 1 },
  },
  fontFamilies: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
  supports: {
    columns: ['one'], photo: false, colorScheme: false, colorBackground: false,
    header: true, footer: true, dateFormat: true, fontSize: true, spacing: true,
    entries: true, headings: true, font: true, links: true,
  }
};

export default function NordicMinimal({ personal, sections, customize = {} }) {
  const c = readCustomize(customize, meta);
  const fullName = fullNameOf(personal);
  const visibleSections = visibleSectionsOf(sections);

  return (
    <div className="nm-resume" style={{
      fontFamily: c.bodyFont,
      fontSize: c.bodySize,
      lineHeight: c.lineHeight,
      color: '#222',
      background: '#fff',
      padding: `52px ${c.margin}`,
      minHeight: '100%',
    }}>
      <div style={{ marginBottom: 28 }}>
        {c.showName && (
          <div style={{
            fontSize: c.nameSize,
            fontWeight: 300,
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
            color: c.applyTo.name ? c.accent : '#111',
            fontFamily: c.headingFont,
          }}>
            {fullName || 'Your Name'}
          </div>
        )}
        {c.showTitle && personal.title && (
          <div style={{
            fontSize: c.titleSize,
            fontWeight: 500,
            marginTop: 6,
            color: c.applyTo.jobTitle ? c.accent : '#888',
          }}>
            {personal.title}
          </div>
        )}
        {c.showContact && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '4px 18px',
            marginTop: 14, paddingTop: 12, borderTop: '1px solid #e5e5e5',
          }}>
            <ContactItems personal={personal} c={c}
              iconColor={c.applyTo.headerIcons ? c.accent : '#999'} />
          </div>
        )}
      </div>

      {visibleSections.map(section => (
        <div key={section.id} style={{
          display: 'flex', gap: 24, marginBottom: 18,
          paddingTop: 14, borderTop: '1px solid #e5e5e5',
        }}>
          <div style={{
            width: '22%', flexShrink: 0,
            fontSize: c.headingSize,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: c.isUppercase ? 'uppercase' : 'none',
            color: c.applyTo.headings ? c.accent : '#999',
          }}>
            {section.heading}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionBody section={section} c={c} />
          </div>
        </div>
      ))}
    </div>
  );
}
