import React from 'react';
import {
  User, Briefcase, Brain, GraduationCap, Globe, Award, FileText,
  FolderKanban, HeartHandshake, Trophy, BookOpen, Newspaper, Sparkles, Users
} from 'lucide-react';
import { readCustomize, fullNameOf, visibleSectionsOf, sectionKind } from './shared/common.js';
import SectionBody from './shared/SectionBody.jsx';
import { getContactFields } from './shared/contactFields.js';
import { formatDateRange } from './shared/formatDate.js';

export const meta = {
  id: 'obsidian-edge',
  name: 'Obsidian Edge',
  category: 'modern',
  description: 'Bold black header band with icon-led sections and dense columns',
  fonts: ['Inter'],
  defaultCustomize: {
    colors: {
      scheme: 'header',
      paletteIndex: 3,
      accentApplyTo: { name: false, jobTitle: false, headings: false, headingsLine: false, headerIcons: false, dots: false, dates: false, entrySubtitle: false, linkIcons: false }
    },
    headings: { uppercase: false, underline: false },
    layout: { columns: 'one' },
    entries: { bulletStyle: 'dot' },
    spacing: { lineHeight: 1.35, spaceBetweenElements: 8, leftRightMargin: 12 },
    font: { family: 'default' },
    photo: { size: 'medium', shape: 'circle' },
    links: { showLinkedin: true, showWebsite: true, hyperlink: false },
    header: { showName: true, showTitle: true, showContact: true },
    document: { language: 'English (UK)', dateFormat: 'MM/YYYY', pageFormat: 'A4' },
    fontSize: { base: 10, fullName: 9, professionalTitle: 2, sectionHeadings: 2.5, entryHeader: 0.5 },
  },
  fontFamilies: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
  supports: {
    columns: ['one'], photo: false, colorScheme: false, colorBackground: false,
    header: true, footer: true, dateFormat: true, fontSize: true, spacing: true,
    entries: true, headings: true, font: true, links: true,
  }
};

const SECTION_ICONS = {
  User, Briefcase, Brain, GraduationCap, Globe, Award, FileText,
  FolderKanban, HeartHandshake, Trophy, BookOpen, Newspaper, Sparkles, Users
};

// Sections rendered as compact multi-column bullet lists
const LIST_TYPES = new Set(['skills', 'interests', 'languages', 'certifications', 'awards', 'courses', 'publications']);

function listItemsOf(section) {
  switch (sectionKind(section.type)) {
    case 'skills':
      return section.entries.flatMap(e =>
        (e.items || '').split(',').map(s => s.trim()).filter(Boolean)
      );
    case 'languages':
      return section.entries.map(e => e.language).filter(Boolean);
    case 'certifications':
      return section.entries.map(e => e.name).filter(Boolean);
    default:
      return [];
  }
}

export default function ObsidianEdge({ personal, sections, customize = {} }) {
  const c = readCustomize(customize, meta);
  const fullName = fullNameOf(personal);
  const visibleSections = visibleSectionsOf(sections);
  const ink = '#111';

  const hiddenKeys = [];
  if (!c.showLinkedin) hiddenKeys.push('linkedin');
  if (!c.showWebsite) hiddenKeys.push('website');
  const contactFields = getContactFields(personal, { hiddenKeys });

  const headingStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: c.headingSize,
    fontFamily: c.headingFont,
    fontWeight: 800,
    textTransform: c.isUppercase ? 'uppercase' : 'none',
    color: c.applyTo.headings ? c.accent : ink,
    borderBottom: c.hasUnderline ? `2px solid ${c.applyTo.headingsLine ? c.accent : ink}` : 'none',
    paddingBottom: c.hasUnderline ? 4 : 0,
    marginBottom: 8,
  };

  const dateLocStyle = {
    fontSize: c.smallSize,
    color: c.applyTo.dates ? c.accent : '#444',
    whiteSpace: 'nowrap',
    marginLeft: 12,
  };

  const renderDated = (entry, title, org, current) => (
    <div key={entry.id} style={{ marginBottom: c.entryGap }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: c.entryHeaderSize, minWidth: 0 }}>
          <span style={{ fontWeight: 700 }}>{title}</span>
          {org && <span style={{ color: c.applyTo.entrySubtitle ? c.accent : '#333' }}>, {org}</span>}
        </div>
        <div style={dateLocStyle}>
          {formatDateRange(entry.startDate, entry.endDate, current, c.dateFormat, c.lang)}
          {entry.location ? <span style={{ color: '#888' }}>  |  {entry.location}</span> : null}
        </div>
      </div>
      {entry.bullets?.filter(Boolean).length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '3px 0 0' }}>
          {entry.bullets.filter(Boolean).map((b, i) => (
            <li key={i} style={{ fontSize: c.bodySize, lineHeight: c.lineHeight, marginBottom: 2 }}>
              {c.bullet && <span style={{ marginRight: 6, color: c.applyTo.dots ? c.accent : 'inherit' }}>{c.bullet}</span>}
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="oe-resume" style={{
      fontFamily: c.bodyFont,
      fontSize: c.bodySize,
      lineHeight: c.lineHeight,
      color: ink,
      background: '#fff',
      minHeight: '100%',
    }}>
      {/* Black header band */}
      <div style={{
        background: c.applyTo.name ? c.accent : '#0d0d0d',
        color: '#fff',
        padding: `26px ${c.margin} 20px`,
      }}>
        {c.showName && (
          <div style={{ fontSize: c.nameSize, fontWeight: 800, fontFamily: c.headingFont, lineHeight: 1.15 }}>
            {fullName || 'Your Name'}
          </div>
        )}
        {c.showTitle && personal.title && (
          <div style={{ fontSize: c.titleSize, color: '#d5d5d5', marginTop: 2 }}>
            {personal.title}
          </div>
        )}
        {c.showContact && contactFields.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '5px 24px',
            marginTop: 12,
            fontSize: c.smallSize,
          }}>
            {contactFields.map(({ key, icon: Icon, label, href, display }) => {
              const text = label ? `${label}: ${display}` : display;
              return (
                <span key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, minWidth: 0 }}>
                  <Icon size={11} style={{ color: '#fff', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ overflowWrap: 'anywhere', minWidth: 0 }}>
                    {c.hyperlink && href
                      ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{text}</a>
                      : text}
                  </span>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: `20px ${c.margin} 32px` }}>
        {visibleSections.map(section => {
          const Icon = SECTION_ICONS[section.icon] || FileText;
          const kind = sectionKind(section.type);
          const isList = LIST_TYPES.has(section.type);

          return (
            <div key={section.id} style={{ marginBottom: 14 }} data-preview-section="true">
              <div style={headingStyle}>
                <Icon size={13} style={{ flexShrink: 0 }} />
                {section.heading}
              </div>

              {kind === 'experience' && section.entries.map(entry =>
                renderDated(entry, entry.title, entry.company, entry.current)
              )}

              {kind === 'education' && section.entries.map(entry =>
                renderDated(entry, entry.degree, entry.school, false)
              )}

              {isList && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '4px 20px',
                }}>
                  {listItemsOf(section).map((item, i) => (
                    <div key={i} style={{ fontSize: c.bodySize, minWidth: 0 }}>
                      {c.bullet && <span style={{ marginRight: 6, color: c.applyTo.dots ? c.accent : 'inherit' }}>{c.bullet}</span>}
                      {item}
                    </div>
                  ))}
                </div>
              )}

              {!isList && !['experience', 'education'].includes(kind) && (
                <SectionBody section={section} c={c} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
