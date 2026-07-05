import React from 'react';
import { User } from 'lucide-react';
import { readCustomize, fullNameOf, visibleSectionsOf } from './shared/common.js';
import SectionBody from './shared/SectionBody.jsx';
import ContactItems from './shared/ContactItems.jsx';

export const meta = {
  id: 'slate-sidebar',
  name: 'Slate Sidebar',
  category: 'modern',
  description: 'Two-column layout with soft grey sidebar and photo',
  fonts: ['Inter'],
  defaultCustomize: {
    colors: {
      scheme: 'sidebar',
      paletteIndex: 3,
      accentApplyTo: { name: true, jobTitle: false, headings: true, headingsLine: true, headerIcons: true, dots: true, dates: false, entrySubtitle: true, linkIcons: true }
    },
    headings: { uppercase: true, underline: true },
    layout: { columns: 'two' },
    entries: { bulletStyle: 'dot' },
    spacing: { lineHeight: 1.4, spaceBetweenElements: 9, leftRightMargin: 10 },
    font: { family: 'default' },
    photo: { size: 'large', shape: 'circle' },
    links: { showLinkedin: true, showWebsite: true, hyperlink: false },
    header: { showName: true, showTitle: true, showContact: true },
    document: { language: 'English (UK)', dateFormat: 'MMM YYYY', pageFormat: 'A4' },
    fontSize: { base: 10, fullName: 14, professionalTitle: 3, sectionHeadings: 2, entryHeader: 1 },
  },
  fontFamilies: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
  supports: {
    columns: ['two'], photo: true, colorScheme: false, colorBackground: false,
    header: true, footer: true, dateFormat: true, fontSize: true, spacing: true,
    entries: true, headings: true, font: true, links: true,
  }
};

const SIDEBAR_TYPES = ['skills', 'languages', 'certifications'];

export default function SlateSidebar({ personal, sections, customize = {} }) {
  const c = readCustomize(customize, meta);
  const fullName = fullNameOf(personal);
  const visibleSections = visibleSectionsOf(sections);
  const sidebarSections = visibleSections.filter(s => SIDEBAR_TYPES.includes(s.type));
  const mainSections = visibleSections.filter(s => !SIDEBAR_TYPES.includes(s.type));

  const headingBase = {
    fontSize: c.headingSize,
    fontFamily: c.headingFont,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: c.isUppercase ? 'uppercase' : 'none',
    color: c.applyTo.headings ? c.accent : '#333',
    borderBottom: c.hasUnderline ? `2px solid ${c.applyTo.headingsLine ? c.accent : '#ccc'}` : 'none',
    paddingBottom: c.hasUnderline ? 4 : 0,
    margin: '0 0 10px',
  };

  return (
    <div className="ss-resume" style={{
      display: 'flex',
      fontFamily: c.bodyFont,
      fontSize: c.bodySize,
      lineHeight: c.lineHeight,
      color: '#333',
      minHeight: '100%',
      background: '#fff',
    }}>
      {/* Sidebar */}
      <div className="ss-sidebar" style={{
        width: '32%',
        flexShrink: 0,
        background: '#f0f0ee',
        padding: `36px ${c.margin}`,
        minWidth: 0,
      }}>
        <div style={{
          width: c.photoSize, height: c.photoSize, ...c.photoShape,
          overflow: 'hidden', background: '#ddd', margin: '0 auto 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {personal.photo
            ? <img src={personal.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <User size={30} style={{ color: '#aaa' }} />}
        </div>

        {c.showContact && (
          <div style={{ marginBottom: 18 }}>
            <div style={headingBase}>Contact</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <ContactItems personal={personal} c={c} stacked
                iconColor={c.applyTo.headerIcons ? c.accent : '#777'} />
            </div>
          </div>
        )}

        {sidebarSections.map(section => (
          <div key={section.id} style={{ marginBottom: 18 }} data-preview-section="true">
            <div style={headingBase}>{section.heading}</div>
            <SectionBody section={section} c={c} styles={{ langColumns: '1fr' }} />
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="ss-main" style={{ flex: 1, padding: `36px ${c.margin}`, minWidth: 0 }}>
        <div style={{ marginBottom: 20 }}>
          {c.showName && (
            <div style={{
              fontSize: c.nameSize, fontWeight: 800, lineHeight: 1.15,
              color: c.applyTo.name ? c.accent : '#1f1f1f', fontFamily: c.headingFont,
            }}>
              {fullName || 'Your Name'}
            </div>
          )}
          {c.showTitle && personal.title && (
            <div style={{
              fontSize: c.titleSize, fontWeight: 500, marginTop: 2,
              color: c.applyTo.jobTitle ? c.accent : '#666',
            }}>
              {personal.title}
            </div>
          )}
        </div>

        {mainSections.map(section => (
          <div key={section.id} style={{ marginBottom: 16 }} data-preview-section="true">
            <div style={headingBase}>{section.heading}</div>
            <SectionBody section={section} c={c} />
          </div>
        ))}
      </div>
    </div>
  );
}
