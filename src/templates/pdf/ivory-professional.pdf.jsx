import React from 'react';
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { registerFonts, parseFontFamily } from './shared/pdfFonts.js';
import { readCustomize, fullNameOf, visibleSectionsOf } from '../shared/common.js';
import PdfSectionBody, { PdfContactRow } from './shared/PdfSectionBody.jsx';
import { getTemplate } from '../index.js';

registerFonts();

const PAGE_SIZE_MAP = { A4: 'A4', Letter: 'LETTER', A5: 'A5' };

export default function IvoryProfessionalPdf({ personal, sections, customize }) {
  const { meta } = getTemplate('ivory-professional');
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
          alignItems: 'center',
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
            letterSpacing: 2,
            color: c.applyTo.headings ? c.accent : '#1a1a2e',
            textAlign: 'center',
          }}
        >
          {heading}
        </Text>
      </View>
    );
  }

  return (
    <Document>
      <Page
        size={pageSize}
        style={{
          fontFamily: bodyFont,
          fontSize: c.bodySize,
          lineHeight: c.lineHeight,
          paddingTop: 48,
          paddingBottom: 48,
          paddingLeft: c.margin,
          paddingRight: c.margin,
          backgroundColor: '#ffffff',
          color: '#1a1a2e',
        }}
      >
        {/* Centered Header */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          {c.showName && (
            <Text
              style={{
                fontSize: c.nameSize,
                fontFamily: headingFont,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 3,
                color: c.applyTo.name ? c.accent : '#1a1a2e',
                marginBottom: 4,
                textAlign: 'center',
              }}
            >
              {fullName || 'Your Name'}
            </Text>
          )}
          {c.showTitle && personal.title && (
            <Text
              style={{
                fontSize: c.titleSize,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: c.applyTo.jobTitle ? c.accent : '#555',
                marginBottom: 8,
                textAlign: 'center',
              }}
            >
              {personal.title}
            </Text>
          )}

          {/* Horizontal rule */}
          <View
            style={{
              width: '60%',
              borderBottomWidth: 1,
              borderBottomColor: c.accent,
              borderBottomStyle: 'solid',
              marginBottom: 8,
            }}
          />

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
          <View key={section.id} style={{ marginBottom: c.entryGap }}>
            <SectionHeading heading={section.heading} />
            <PdfSectionBody section={section} c={c} />
          </View>
        ))}
      </Page>
    </Document>
  );
}
