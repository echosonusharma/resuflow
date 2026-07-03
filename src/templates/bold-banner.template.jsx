import React from 'react';
import { User } from 'lucide-react';
import { readCustomize, fullNameOf, visibleSectionsOf } from './shared/common.js';
import SectionBody from './shared/SectionBody.jsx';
import ContactItems from './shared/ContactItems.jsx';

export const meta = {
  id: 'bold-banner',
  name: 'Bold Banner',
  category: 'creative',
  description: 'Full-width color banner header with flexible column body',
  fonts: ['Montserrat'],
  defaultCustomize: {
    colors: {
      scheme: 'header',
      paletteIndex: 0,
      accentApplyTo: { name: false, jobTitle: false, headings: true, headingsLine: true, headerIcons: false, dots: true, dates: false, entrySubtitle: true, linkIcons: false }
    },
    headings: { uppercase: true, underline: true },
    layout: { columns: 'two' },
    entries: { bulletStyle: 'arrow' },
    spacing: { lineHeight: 1.4, spaceBetweenElements: 9, leftRightMargin: 13 },
    font: { family: 'default' },
    photo: { size: 'large', shape: 'circle' },
    links: { showLinkedin: true, showWebsite: true, hyperlink: false },
    header: { showName: true, showTitle: true, showContact: true },
    document: { language: 'English (UK)', dateFormat: 'MMM YYYY', pageFormat: 'A4' },
    fontSize: { base: 10, fullName: 16, professionalTitle: 3.5, sectionHeadings: 2, entryHeader: 1 },
  },
  fontFamilies: { heading: "'Montserrat', sans-serif", body: "'Montserrat', sans-serif" },
  supports: {
    columns: ['one', 'two'], photo: true, colorScheme: false, colorBackground: false,
    header: true, footer: true, dateFormat: true, fontSize: true, spacing: true,
    entries: true, headings: true, font: true, links: true,
  }
};

const SIDE_TYPES = ['skills', 'languages', 'certifications'];

export default function BoldBanner({ personal, sections, customize = {} }) {
  const c = readCustomize(customize, meta);
  const fullName = fullNameOf(personal);
  const visibleSections = visibleSectionsOf(sections);
  const twoCol = c.columns === 'two';
  const sideSections = twoCol ? visibleSections.filter(s => SIDE_TYPES.includes(s.type)) : [];
  const mainSections = twoCol ? visibleSections.filter(s => !SIDE_TYPES.includes(s.type)) : visibleSections;

  const headingStyle = {
    fontSize: c.headingSize,
    fontFamily: c.headingFont,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: c.isUppercase ? 'uppercase' : 'none',
    color: c.applyTo.headings ? c.accent : '#222',
    borderBottom: c.hasUnderline ? `2px solid ${c.applyTo.headingsLine ? c.accent : '#222'}` : 'none',
    paddingBottom: c.hasUnderline ? 4 : 0,
    margin: '0 0 10px',
  };

  const renderSection = section => (
    <div key={section.id} style={{ marginBottom: 16 }}>
      <div style={headingStyle}>{section.heading}</div>
      <SectionBody section={section} c={c} styles={twoCol ? { langColumns: '1fr' } : {}} />
    </div>
  );

  return (
    <div className="bb-resume" style={{
      fontFamily: c.bodyFont,
      fontSize: c.bodySize,
      lineHeight: c.lineHeight,
      color: '#222',
      background: '#fff',
      minHeight: '100%',
    }}>
      {/* Banner */}
      <div className="bb-banner" style={{
        background: c.accent,
        color: '#fff',
        padding: `30px ${c.margin}`,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
      }}>
        {personal.photo ? (
          <img src={personal.photo} alt="Profile" style={{
            width: c.photoSize, height: c.photoSize, ...c.photoShape,
            objectFit: 'cover', border: '3px solid rgba(255,255,255,0.4)', flexShrink: 0,
          }} />
        ) : (
          <div style={{
            width: c.photoSize, height: c.photoSize, ...c.photoShape,
            background: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <User size={30} style={{ color: 'rgba(255,255,255,0.6)' }} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          {c.showName && (
            <div style={{
              fontSize: c.nameSize, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.1,
              fontFamily: c.headingFont,
            }}>
              {fullName || 'Your Name'}
            </div>
          )}
          {c.showTitle && personal.title && (
            <div style={{ fontSize: c.titleSize, fontWeight: 400, opacity: 0.85, marginTop: 4 }}>
              {personal.title}
            </div>
          )}
          {c.showContact && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginTop: 10 }}>
              <ContactItems personal={personal} c={c}
                iconColor="rgba(255,255,255,0.75)"
                itemStyle={{ color: 'rgba(255,255,255,0.92)' }} />
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      {twoCol ? (
        <div style={{ display: 'flex', gap: 26, padding: `26px ${c.margin}` }}>
          <div style={{ flex: 1.9, minWidth: 0 }}>{mainSections.map(renderSection)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>{sideSections.map(renderSection)}</div>
        </div>
      ) : (
        <div style={{ padding: `26px ${c.margin}` }}>{mainSections.map(renderSection)}</div>
      )}
    </div>
  );
}
