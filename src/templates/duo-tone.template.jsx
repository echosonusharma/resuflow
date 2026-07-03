import React from 'react';
import { User } from 'lucide-react';
import { readCustomize, fullNameOf, visibleSectionsOf } from './shared/common.js';
import SectionBody from './shared/SectionBody.jsx';
import ContactItems from './shared/ContactItems.jsx';

export const meta = {
  id: 'duo-tone',
  name: 'Duo Tone',
  category: 'creative',
  description: 'Editorial serif headings with a tinted accent rail',
  fonts: ['Playfair Display', 'Lato'],
  defaultCustomize: {
    colors: {
      scheme: 'rail',
      paletteIndex: 6,
      accentApplyTo: { name: true, jobTitle: false, headings: true, headingsLine: true, headerIcons: true, dots: true, dates: true, entrySubtitle: false, linkIcons: true }
    },
    headings: { uppercase: false, underline: false },
    layout: { columns: 'two' },
    entries: { bulletStyle: 'dot' },
    spacing: { lineHeight: 1.45, spaceBetweenElements: 10, leftRightMargin: 12 },
    font: { family: 'default' },
    photo: { size: 'medium', shape: 'rounded' },
    links: { showLinkedin: true, showWebsite: true, hyperlink: false },
    header: { showName: true, showTitle: true, showContact: true },
    document: { language: 'English (UK)', dateFormat: 'MMM YYYY', pageFormat: 'A4' },
    fontSize: { base: 10, fullName: 18, professionalTitle: 3, sectionHeadings: 3.5, entryHeader: 1 },
  },
  fontFamilies: { heading: "'Playfair Display', serif", body: "'Lato', sans-serif" },
  supports: {
    columns: ['one', 'two'], photo: true, colorScheme: false, colorBackground: false,
    header: true, footer: true, dateFormat: true, fontSize: true, spacing: true,
    entries: true, headings: true, font: true, links: true,
  }
};

const RAIL_TYPES = ['skills', 'languages', 'certifications'];

// 12% opacity tint of accent for the rail background
function tint(hex) {
  return `${hex}1f`;
}

export default function DuoTone({ personal, sections, customize = {} }) {
  const c = readCustomize(customize, meta);
  const fullName = fullNameOf(personal);
  const visibleSections = visibleSectionsOf(sections);
  const twoCol = c.columns === 'two';
  const railSections = twoCol ? visibleSections.filter(s => RAIL_TYPES.includes(s.type)) : [];
  const mainSections = twoCol ? visibleSections.filter(s => !RAIL_TYPES.includes(s.type)) : visibleSections;

  const headingStyle = {
    fontSize: c.headingSize,
    fontFamily: c.headingFont,
    fontWeight: 700,
    fontStyle: 'italic',
    textTransform: c.isUppercase ? 'uppercase' : 'none',
    color: c.applyTo.headings ? c.accent : '#222',
    margin: '0 0 10px',
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
  };

  const headingMark = (
    <span style={{
      width: 10, height: 10, flexShrink: 0, alignSelf: 'center',
      background: c.applyTo.headingsLine ? c.accent : '#222',
      transform: 'rotate(45deg)',
    }} />
  );

  const renderSection = section => (
    <div key={section.id} style={{ marginBottom: 18 }}>
      <div style={headingStyle}>{headingMark}{section.heading}</div>
      <SectionBody section={section} c={c} styles={twoCol ? { langColumns: '1fr' } : {}} />
    </div>
  );

  return (
    <div className="dt-resume" style={{
      fontFamily: c.bodyFont,
      fontSize: c.bodySize,
      lineHeight: c.lineHeight,
      color: '#2a2a2a',
      background: '#fff',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: `36px ${c.margin} 22px`,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        borderBottom: `2px solid ${c.accent}`,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {c.showName && (
            <div style={{
              fontSize: c.nameSize, fontFamily: c.headingFont, fontWeight: 700,
              lineHeight: 1.1, color: c.applyTo.name ? c.accent : '#1c1c1c',
            }}>
              {fullName || 'Your Name'}
            </div>
          )}
          {c.showTitle && personal.title && (
            <div style={{
              fontSize: c.titleSize, letterSpacing: '0.14em', textTransform: 'uppercase',
              marginTop: 6, color: c.applyTo.jobTitle ? c.accent : '#777',
            }}>
              {personal.title}
            </div>
          )}
          {c.showContact && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginTop: 12 }}>
              <ContactItems personal={personal} c={c}
                iconColor={c.applyTo.headerIcons ? c.accent : '#888'} />
            </div>
          )}
        </div>
        {personal.photo ? (
          <img src={personal.photo} alt="Profile" style={{
            width: c.photoSize, height: c.photoSize, ...c.photoShape,
            objectFit: 'cover', flexShrink: 0,
          }} />
        ) : (
          <div style={{
            width: c.photoSize, height: c.photoSize, ...c.photoShape,
            background: tint(c.accent), display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}>
            <User size={26} style={{ color: c.accent }} />
          </div>
        )}
      </div>

      {/* Body */}
      {twoCol ? (
        <div style={{ display: 'flex', flex: 1, alignItems: 'stretch' }}>
          <div style={{ flex: 2, minWidth: 0, padding: `24px ${c.margin}` }}>
            {mainSections.map(renderSection)}
          </div>
          <div style={{ flex: 1, minWidth: 0, padding: `24px ${c.margin}`, background: tint(c.accent) }}>
            {railSections.map(renderSection)}
          </div>
        </div>
      ) : (
        <div style={{ padding: `24px ${c.margin}` }}>{mainSections.map(renderSection)}</div>
      )}
    </div>
  );
}
