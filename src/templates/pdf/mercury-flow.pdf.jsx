import React from 'react';
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { registerFonts, parseFontFamily } from './shared/pdfFonts.js';
import { readCustomize, fullNameOf, visibleSectionsOf } from '../shared/common.js';
import PdfSectionBody, { PdfContactRow } from './shared/PdfSectionBody.jsx';
import { formatDateRange, formatDate } from '../shared/formatDate.js';
import { getTemplate } from '../index.js';

registerFonts();

const PAGE_SIZE_MAP = { A4: 'A4', Letter: 'LETTER', A5: 'A5' };

export default function MercuryFlowPdf({ personal, sections, customize }) {
  const { meta } = getTemplate('mercury-flow');
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

  // Custom dated entry with date-left layout
  function MercuryDatedEntry({ entry, title, subtitleParts, current, bullets }) {
    const bulletColor = c.applyTo.dots ? c.accent : '#333';
    return (
      <View wrap={false} style={{ flexDirection: 'row', marginBottom: c.entryGap }}>
        {/* Date column — 80pt wide, right-aligned */}
        <Text
          style={{
            width: 80,
            fontSize: c.smallSize,
            color: c.applyTo.dates ? c.accent : '#777',
            textAlign: 'right',
            paddingRight: 10,
            paddingTop: 2,
          }}
        >
          {formatDateRange(entry.startDate, entry.endDate, current, c.dateFormat, c.lang)}
        </Text>
        {/* Body column */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: c.entryHeaderSize, fontWeight: 700, color: '#1a1a1a' }}>{title}</Text>
          {subtitleParts.filter(Boolean).length > 0 && (
            <Text style={{ fontSize: c.smallSize, color: c.applyTo.entrySubtitle ? c.accent : '#555', marginTop: 1 }}>
              {subtitleParts.filter(Boolean).join(' · ')}
            </Text>
          )}
          {bullets && bullets.filter(Boolean).length > 0 && (
            <View style={{ marginTop: 3 }}>
              {bullets.filter(Boolean).map((b, i) => (
                <View key={i} style={{ flexDirection: 'row', marginBottom: 2 }}>
                  {c.bullet ? (
                    <Text style={{ fontSize: c.bodySize, color: bulletColor, marginRight: 5, width: 10 }}>
                      {c.bullet}
                    </Text>
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
        <MercuryDatedEntry
          key={entry.id}
          entry={entry}
          title={entry.title}
          subtitleParts={[entry.company, entry.location]}
          current={entry.current}
          bullets={entry.bullets}
        />
      ));
    }
    if (section.type === 'education') {
      return section.entries.map(entry => (
        <MercuryDatedEntry
          key={entry.id}
          entry={entry}
          title={entry.degree}
          subtitleParts={[entry.school, entry.location]}
          current={false}
          bullets={entry.bullets}
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
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 20,
            borderBottomWidth: 2,
            borderBottomColor: c.accent,
            borderBottomStyle: 'solid',
            paddingBottom: 16,
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
              style={{ width: 70, height: 70, borderRadius: 35, marginLeft: 16 }}
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
