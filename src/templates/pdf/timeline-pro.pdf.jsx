import React from 'react';
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { registerFonts, parseFontFamily } from './shared/pdfFonts.js';
import { readCustomize, fullNameOf, visibleSectionsOf } from '../shared/common.js';
import PdfSectionBody, { PdfContactRow } from './shared/PdfSectionBody.jsx';
import { formatDateRange } from '../shared/formatDate.js';
import { getTemplate } from '../index.js';

registerFonts();

const PAGE_SIZE_MAP = { A4: 'A4', Letter: 'LETTER', A5: 'A5' };
const TIMELINE_SECTION_TYPES = ['experience', 'education'];

export default function TimelineProPdf({ personal, sections, customize }) {
  const { meta } = getTemplate('timeline-pro');
  const c = readCustomize(customize, meta);
  const pageSize = PAGE_SIZE_MAP[customize?.document?.pageFormat] || 'A4';
  const headingFont = parseFontFamily(c.headingFont);
  const bodyFont = parseFontFamily(c.bodyFont);
  const visibleSections = visibleSectionsOf(sections);
  const fullName = fullNameOf(personal);

  function SectionHeading({ heading }) {
    return (
      <View
        style={{
          marginBottom: 10,
          borderBottomWidth: c.hasUnderline ? 1 : 0,
          borderBottomColor: c.applyTo.headingsLine ? c.accent : '#1a1a2e',
          borderBottomStyle: 'solid',
          paddingBottom: c.hasUnderline ? 4 : 0,
        }}
      >
        <Text
          style={{
            fontSize: c.headingSize,
            fontFamily: headingFont,
            fontWeight: 700,
            textTransform: c.isUppercase ? 'uppercase' : 'none',
            letterSpacing: 1,
            color: c.applyTo.headings ? c.accent : '#1a1a2e',
          }}
        >
          {heading}
        </Text>
      </View>
    );
  }

  function TimelineEntry({ entry, title, subtitleParts, current }) {
    const bulletColor = c.applyTo.dots ? c.accent : '#333';
    return (
      <View wrap={false} style={{ flexDirection: 'row', marginBottom: c.entryGap }}>
        {/* Timeline rail */}
        <View style={{ width: 20, alignItems: 'center', paddingTop: 3 }}>
          {/* Dot */}
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: c.accent,
              marginBottom: 2,
            }}
          />
          {/* Vertical line */}
          <View
            style={{
              flex: 1,
              width: 1,
              backgroundColor: '#ddd',
              minHeight: 20,
            }}
          />
        </View>

        {/* Content */}
        <View style={{ flex: 1, paddingLeft: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ fontSize: c.entryHeaderSize, fontWeight: 700, color: '#1a1a1a' }}>{title}</Text>
              {subtitleParts.filter(Boolean).length > 0 && (
                <Text style={{ fontSize: c.smallSize, color: c.applyTo.entrySubtitle ? c.accent : '#555', marginTop: 1 }}>
                  {subtitleParts.filter(Boolean).join(' · ')}
                </Text>
              )}
            </View>
            <Text style={{ fontSize: c.smallSize, color: c.applyTo.dates ? c.accent : '#777', textAlign: 'right' }}>
              {formatDateRange(entry.startDate, entry.endDate, current, c.dateFormat, c.lang)}
            </Text>
          </View>
          {entry.bullets && entry.bullets.filter(Boolean).length > 0 && (
            <View style={{ marginTop: 3 }}>
              {entry.bullets.filter(Boolean).map((b, i) => (
                <View key={i} style={{ flexDirection: 'row', marginBottom: 2 }}>
                  {c.bullet ? (
                    <Text style={{ fontSize: c.bodySize, color: bulletColor, marginRight: 5, width: 10 }}>{c.bullet}</Text>
                  ) : null}
                  <Text style={{ fontSize: c.bodySize, lineHeight: c.lineHeight, flex: 1 }}>{b}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }

  function renderSection(section) {
    if (section.type === 'experience') {
      return section.entries.map(entry => (
        <TimelineEntry
          key={entry.id}
          entry={entry}
          title={entry.title}
          subtitleParts={[entry.company, entry.location]}
          current={entry.current}
        />
      ));
    }
    if (section.type === 'education') {
      return section.entries.map(entry => (
        <TimelineEntry
          key={entry.id}
          entry={entry}
          title={entry.degree}
          subtitleParts={[entry.school, entry.location]}
          current={false}
        />
      ));
    }
    return <PdfSectionBody section={section} c={c} />;
  }

  return (
    <Document>
      <Page
        size={pageSize}
        style={{
          fontFamily: bodyFont,
          fontSize: c.bodySize,
          lineHeight: c.lineHeight,
          paddingTop: 40,
          paddingBottom: 40,
          paddingLeft: c.margin,
          paddingRight: c.margin,
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
        }}
      >
        {/* Header */}
        <View
          style={{
            marginBottom: 20,
            borderBottomWidth: 2,
            borderBottomColor: c.accent,
            borderBottomStyle: 'solid',
            paddingBottom: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <View style={{ flex: 1 }}>
            {c.showName && (
              <Text
                style={{
                  fontSize: c.nameSize,
                  fontFamily: headingFont,
                  fontWeight: 700,
                  color: c.applyTo.name ? c.accent : '#1a1a2e',
                  marginBottom: 4,
                }}
              >
                {fullName || 'Your Name'}
              </Text>
            )}
            {c.showTitle && personal.title && (
              <Text
                style={{
                  fontSize: c.titleSize,
                  color: c.applyTo.jobTitle ? c.accent : '#555',
                  marginBottom: 6,
                }}
              >
                {personal.title}
              </Text>
            )}
            {c.showContact && (
              <PdfContactRow
                personal={personal}
                c={c}
                iconColor={c.applyTo.headerIcons ? c.accent : '#555'}
                stacked={false}
              />
            )}
          </View>
          {personal.photo && (
            <Image
              src={personal.photo}
              style={{ width: c.photoSize, height: c.photoSize, borderRadius: c.photoSize / 2, marginLeft: 16 }}
            />
          )}
        </View>

        {/* Sections */}
        {visibleSections.map(section => (
          <View key={section.id} style={{ marginBottom: c.entryGap }}>
            <SectionHeading heading={section.heading} />
            {renderSection(section)}
          </View>
        ))}
      </Page>
    </Document>
  );
}
