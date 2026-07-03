import React from 'react';
import { User } from 'lucide-react';
import { readCustomize, fullNameOf, visibleSectionsOf } from './shared/common.js';
import SectionBody from './shared/SectionBody.jsx';
import ContactItems from './shared/ContactItems.jsx';
import { formatDateRange } from './shared/formatDate.js';

export const meta = {
  id: 'timeline-pro',
  name: 'Timeline Pro',
  category: 'modern',
  description: 'Career story told on a vertical accent timeline',
  fonts: ['Lato'],
  defaultCustomize: {
    colors: {
      scheme: 'accents',
      paletteIndex: 1,
      accentApplyTo: { name: false, jobTitle: true, headings: true, headingsLine: true, headerIcons: true, dots: true, dates: true, entrySubtitle: false, linkIcons: true }
    },
    headings: { uppercase: true, underline: false },
    layout: { columns: 'one' },
    entries: { bulletStyle: 'dot' },
    spacing: { lineHeight: 1.4, spaceBetweenElements: 10, leftRightMargin: 15 },
    font: { family: 'default' },
    photo: { size: 'medium', shape: 'circle' },
    links: { showLinkedin: true, showWebsite: true, hyperlink: false },
    header: { showName: true, showTitle: true, showContact: true },
    document: { language: 'English (UK)', dateFormat: 'MMM YYYY', pageFormat: 'A4' },
    fontSize: { base: 10.5, fullName: 16, professionalTitle: 3.5, sectionHeadings: 2.5, entryHeader: 1 },
  },
  fontFamilies: { heading: "'Lato', sans-serif", body: "'Lato', sans-serif" },
  supports: {
    columns: ['one'], photo: true, colorScheme: false, colorBackground: false,
    header: true, footer: true, dateFormat: true, fontSize: true, spacing: true,
    entries: true, headings: true, font: true, links: true,
  }
};

export default function TimelinePro({ personal, sections, customize = {} }) {
  const c = readCustomize(customize, meta);
  const fullName = fullNameOf(personal);
  const visibleSections = visibleSectionsOf(sections);

  const headingStyle = {
    fontSize: c.headingSize,
    fontFamily: c.headingFont,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: c.isUppercase ? 'uppercase' : 'none',
    color: c.applyTo.headings ? c.accent : '#222',
    margin: '0 0 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const headingRule = (
    <span style={{ flex: 1, height: c.hasUnderline ? 2 : 1, background: c.applyTo.headingsLine ? c.accent : '#ddd' }} />
  );

  const timelineEntry = (entry, title, subtitle, current, isLast) => (
    <div key={entry.id} style={{ display: 'flex', gap: 14 }}>
      {/* Rail */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 12, flexShrink: 0 }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%', marginTop: 4,
          background: '#fff', border: `2.5px solid ${c.accent}`, flexShrink: 0,
        }} />
        {!isLast && <div style={{ width: 2, flex: 1, background: '#e2e2e2', marginTop: 2 }} />}
      </div>
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, paddingBottom: isLast ? 0 : parseInt(c.entryGap, 10) + 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: c.entryHeaderSize, fontWeight: 700 }}>{title}</div>
            <div style={{ fontSize: c.smallSize, color: c.applyTo.entrySubtitle ? c.accent : '#555' }}>
              {subtitle.filter(Boolean).join(' · ')}
            </div>
          </div>
          <div style={{ fontSize: c.smallSize, color: c.applyTo.dates ? c.accent : '#777', whiteSpace: 'nowrap' }}>
            {formatDateRange(entry.startDate, entry.endDate, current, c.dateFormat, c.lang)}
          </div>
        </div>
        {entry.bullets?.filter(Boolean).length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 0' }}>
            {entry.bullets.filter(Boolean).map((b, i) => (
              <li key={i} style={{ fontSize: c.bodySize, lineHeight: c.lineHeight, marginBottom: 2 }}>
                {c.bullet && <span style={{ marginRight: 6, color: c.applyTo.dots ? c.accent : 'inherit' }}>{c.bullet}</span>}
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <div className="tp-resume" style={{
      fontFamily: c.bodyFont,
      fontSize: c.bodySize,
      lineHeight: c.lineHeight,
      color: '#222',
      background: '#fff',
      padding: `40px ${c.margin}`,
      minHeight: '100%',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 22, paddingBottom: 16, borderBottom: `3px solid ${c.accent}` }}>
        <div style={{ flex: 1 }}>
          {c.showName && (
            <div style={{
              fontSize: c.nameSize, fontWeight: 800, lineHeight: 1.1,
              color: c.applyTo.name ? c.accent : '#1a1a1a', fontFamily: c.headingFont,
            }}>
              {fullName || 'Your Name'}
            </div>
          )}
          {c.showTitle && personal.title && (
            <div style={{
              fontSize: c.titleSize, fontWeight: 400, marginTop: 2,
              color: c.applyTo.jobTitle ? c.accent : '#666',
            }}>
              {personal.title}
            </div>
          )}
          {c.showContact && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', marginTop: 10 }}>
              <ContactItems personal={personal} c={c}
                iconColor={c.applyTo.headerIcons ? c.accent : '#777'} />
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
            background: '#f0f0f0', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}>
            <User size={28} style={{ color: '#bbb' }} />
          </div>
        )}
      </div>

      {visibleSections.map(section => {
        const timeline = section.type === 'experience' || section.type === 'education';
        return (
          <div key={section.id} style={{ marginBottom: 18 }}>
            <div style={headingStyle}>{section.heading}{headingRule}</div>
            {timeline
              ? section.entries.map((entry, i) =>
                  timelineEntry(
                    entry,
                    section.type === 'experience' ? entry.title : entry.degree,
                    section.type === 'experience' ? [entry.company, entry.location] : [entry.school, entry.location],
                    section.type === 'experience' ? entry.current : false,
                    i === section.entries.length - 1
                  ))
              : <SectionBody section={section} c={c} />}
          </div>
        );
      })}
    </div>
  );
}
