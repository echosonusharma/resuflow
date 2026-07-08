import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import type { PageSize } from '@react-pdf/types';
import { registerFonts, parseFontFamily } from './shared/pdfFonts.js';
import { readCustomize, fullNameOf, visibleSectionsOf, sectionKind } from '../shared/common.js';
import PdfSectionBody, { PdfFooter } from './shared/PdfSectionBody.jsx';
import { getContactFields } from '../shared/contactFields.js';
import { formatDateRange } from '../shared/formatDate.js';
import { stripHtml } from '../../utils/stripHtml.js';
import { getTemplate } from '../index.js';
import type { TemplateProps, Section, ExperienceEntry, EducationEntry, SkillsEntry, LanguageEntry, CertEntry, ReadCustomize } from '../../types';

registerFonts();

const PAGE_SIZE_MAP = { A4: 'A4', Letter: 'LETTER', A5: 'A5' };
const LIST_TYPES = new Set(['skills', 'interests', 'languages', 'certifications', 'awards', 'courses', 'publications']);

function listItemsOf(section: Section): string[] {
  switch (sectionKind(section.type)) {
    case 'skills':
      return (section.entries as SkillsEntry[]).flatMap(e =>
        (e.items || '').split(',').map((s: string) => s.trim()).filter(Boolean)
      );
    case 'languages':
      return (section.entries as LanguageEntry[]).map(e => e.language).filter(Boolean);
    case 'certifications':
      return (section.entries as CertEntry[]).map(e => e.name).filter(Boolean);
    default:
      return [];
  }
}

export default function ObsidianEdgePdf({ personal, sections, customize }: TemplateProps) {
  const { meta } = getTemplate('obsidian-edge');
  const c = readCustomize(customize, meta);
  const pageSize = (PAGE_SIZE_MAP[(customize?.document?.pageFormat ?? '') as keyof typeof PAGE_SIZE_MAP] || 'A4') as PageSize;
  const headingFont = parseFontFamily(c.headingFont);
  const bodyFont = parseFontFamily(c.bodyFont);
  const visibleSections = visibleSectionsOf(sections);
  const fullName = fullNameOf(personal);
  const ink = '#111111';

  const hiddenKeys = [];
  if (!c.showLinkedin) hiddenKeys.push('linkedin');
  if (!c.showWebsite) hiddenKeys.push('website');
  const contactFields = getContactFields(personal, { hiddenKeys });

  const headingStyle = {
    fontSize: c.headingSize,
    fontFamily: headingFont,
    fontWeight: 700,
    textTransform: (c.isUppercase ? 'uppercase' : 'none') as 'uppercase' | 'none',
    color: c.applyTo.headings ? c.accent : ink,
  };

  const renderDated = (entry: ExperienceEntry | EducationEntry, title: string, org: string, current: boolean) => (
    <View key={entry.id} wrap={false} style={{ marginBottom: c.entryGap }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text style={{ fontSize: c.entryHeaderSize, flex: 1, marginRight: 8, lineHeight: 1.3 }}>
          <Text style={{ fontWeight: 700 }}>{title}</Text>
          {org ? <Text style={{ color: c.applyTo.entrySubtitle ? c.accent : '#333333' }}>, {org}</Text> : null}
        </Text>
        <Text style={{ fontSize: c.smallSize, color: c.applyTo.dates ? c.accent : '#444444' }}>
          {formatDateRange(entry.startDate, entry.endDate, current, c.dateFormat, c.lang)}
          {entry.location ? `  |  ${entry.location}` : ''}
        </Text>
      </View>
      {entry.bullets?.map(b => stripHtml(b)).filter(Boolean).length > 0 && (
        <View style={{ marginTop: 2 }}>
          {entry.bullets!.map(stripHtml).filter(Boolean).map((b: string, i: number) => (
            <View key={i} style={{ flexDirection: 'row', marginBottom: 1 }}>
              {c.bullet ? <Text style={{ fontSize: c.bodySize, marginRight: 5, width: 9 }}>{c.bullet}</Text> : null}
              <Text style={{ fontSize: c.bodySize, lineHeight: c.lineHeight, flex: 1 }}>{b}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderList = (section: Section) => {
    const items = listItemsOf(section);
    const cols = 3;
    const rows: string[][] = [];
    for (let i = 0; i < items.length; i += cols) rows.push(items.slice(i, i + cols));
    return (
      <View>
        {rows.map((row, ri) => (
          <View key={ri} style={{ flexDirection: 'row', marginBottom: 2 }}>
            {row.map((item: string, i: number) => (
              <View key={i} style={{ flex: 1, flexDirection: 'row', marginRight: 10 }}>
                {c.bullet ? <Text style={{ fontSize: c.bodySize, marginRight: 5 }}>{c.bullet}</Text> : null}
                <Text style={{ fontSize: c.bodySize, flex: 1 }}>{item}</Text>
              </View>
            ))}
            {row.length < cols &&
              Array.from({ length: cols - row.length }, (_, i) => <View key={`f${i}`} style={{ flex: 1 }} />)}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Document>
      <Page
        size={pageSize}
        style={{
          fontFamily: bodyFont,
          fontSize: c.bodySize,
          lineHeight: c.lineHeight,
          backgroundColor: '#ffffff',
          color: ink,
          paddingBottom: 34,
        }}
      >
        {/* Black header band */}
        <View style={{
          backgroundColor: c.applyTo.name ? c.accent : '#0d0d0d',
          paddingTop: 24,
          paddingBottom: 18,
          paddingLeft: c.margin,
          paddingRight: c.margin,
        }}>
          {c.showName && (
            <Text style={{ fontSize: c.nameSize, fontWeight: 700, fontFamily: headingFont, lineHeight: 1.2, color: '#ffffff' }}>
              {fullName || 'Your Name'}
            </Text>
          )}
          {c.showTitle && personal.title && (
            <Text style={{ fontSize: c.titleSize, lineHeight: 1.2, color: '#d5d5d5', marginTop: 2 }}>
              {personal.title}
            </Text>
          )}
          {c.showContact && contactFields.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
              {contactFields.map(({ key, label, display }) => (
                <Text key={key} style={{ fontSize: c.smallSize, color: '#ffffff', width: '50%', marginBottom: 3 }}>
                  {label ? `${label}: ${display}` : display}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Body */}
        <View style={{ paddingTop: 16, paddingLeft: c.margin, paddingRight: c.margin }}>
          {visibleSections.map(section => {
            const kind = sectionKind(section.type);
            const isList = LIST_TYPES.has(section.type);
            return (
              <View key={section.id} wrap={false} style={{ marginBottom: 12 }}>
                <View style={{ marginBottom: 6 }} minPresenceAhead={40}>
                  <Text style={headingStyle}>{section.heading}</Text>
                </View>
                {kind === 'experience' && (section.entries as ExperienceEntry[]).map(entry =>
                  renderDated(entry, entry.title, entry.company, entry.current)
                )}
                {kind === 'education' && (section.entries as EducationEntry[]).map(entry =>
                  renderDated(entry, entry.degree, entry.school, false)
                )}
                {isList && renderList(section)}
                {!isList && !['experience', 'education'].includes(kind) && (
                  <PdfSectionBody section={section} c={c} />
                )}
              </View>
            );
          })}
        </View>

        <PdfFooter personal={personal} customize={customize} />
      </Page>
    </Document>
  );
}
