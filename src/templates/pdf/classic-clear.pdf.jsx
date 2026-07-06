import React from 'react';
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { registerFonts, parseFontFamily } from './shared/pdfFonts.js';
import { readCustomize, fullNameOf, visibleSectionsOf } from '../shared/common.js';
import PdfSectionBody, { PdfContactRow, PdfFooter } from './shared/PdfSectionBody.jsx';
import { getTemplate } from '../index.js';

registerFonts();

const PAGE_SIZE_MAP = { A4: 'A4', Letter: 'LETTER', A5: 'A5' };

function SectionHeading({ heading, c, headingFont }) {
  const headingLineColor = c.applyTo.headingsLine ? c.accent : '#1a1a2e';
  return (
    <View
      minPresenceAhead={40}
      style={{
        marginBottom: 10,
        borderBottomWidth: c.hasUnderline ? 2 : 0,
        borderBottomColor: headingLineColor,
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

export default function ClassicClearPdf({ personal, sections, customize }) {
  const { meta } = getTemplate('classic-clear');
  const c = readCustomize(customize, meta);
  const pageSize = PAGE_SIZE_MAP[customize?.document?.pageFormat] || 'A4';
  const headingFont = parseFontFamily(c.headingFont);
  const bodyFont = parseFontFamily(c.bodyFont);
  const visibleSections = visibleSectionsOf(sections);
  const fullName = fullNameOf(personal);

  const pageStyle = {
    fontFamily: bodyFont,
    fontSize: c.bodySize,
    lineHeight: c.lineHeight,
    paddingTop: 48,
    paddingBottom: 48,
    paddingLeft: c.margin,
    paddingRight: c.margin,
    backgroundColor: '#ffffff',
    color: '#1a1a2e',
  };

  return (
    <Document>
      <Page size={pageSize} style={pageStyle}>
        {/* Header */}
        <View style={{ marginBottom: 16, textAlign: 'center', alignItems: 'center' }}>
          {c.showName && (
            <Text
              style={{
                fontSize: c.nameSize,
                fontFamily: headingFont,
                fontWeight: 700,
                lineHeight: 1.2,
                color: c.applyTo.name ? c.accent : '#1a1a2e',
                marginBottom: 6,
              }}
            >
              {fullName || 'Your Name'}
            </Text>
          )}
          {c.showTitle && personal.title && (
            <Text
              style={{
                fontSize: c.titleSize,
                fontFamily: bodyFont,
                fontStyle: 'italic',
                lineHeight: 1.2,
                color: c.applyTo.jobTitle ? c.accent : '#555',
                marginBottom: 8,
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
              itemStyle={{ textAlign: 'center' }}
              stacked={false}
            />
          )}
        </View>

        {/* Sections */}
        {visibleSections.map(section => (
          <View key={section.id} wrap={false} style={{ marginBottom: c.entryGap }}>
            <SectionHeading heading={section.heading} c={c} headingFont={headingFont} />
            <PdfSectionBody section={section} c={c} />
          </View>
        ))}

        <PdfFooter personal={personal} customize={customize} />
      </Page>
    </Document>
  );
}
