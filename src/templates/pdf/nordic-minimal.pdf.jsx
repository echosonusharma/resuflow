import React from 'react';
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { registerFonts, parseFontFamily } from './shared/pdfFonts.js';
import { readCustomize, fullNameOf, visibleSectionsOf } from '../shared/common.js';
import PdfSectionBody, { PdfContactRow } from './shared/PdfSectionBody.jsx';
import { getTemplate } from '../index.js';

registerFonts();

const PAGE_SIZE_MAP = { A4: 'A4', Letter: 'LETTER', A5: 'A5' };

export default function NordicMinimalPdf({ personal, sections, customize }) {
  const { meta } = getTemplate('nordic-minimal');
  const c = readCustomize(customize, meta);
  const pageSize = PAGE_SIZE_MAP[customize?.document?.pageFormat] || 'A4';
  const headingFont = parseFontFamily(c.headingFont);
  const bodyFont = parseFontFamily(c.bodyFont);
  const visibleSections = visibleSectionsOf(sections);
  const fullName = fullNameOf(personal);

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
          color: '#1a1a1a',
        }}
      >
        {/* Header with top hairline */}
        <View
          style={{
            borderTopWidth: 2,
            borderTopColor: c.accent,
            borderTopStyle: 'solid',
            paddingTop: 16,
            marginBottom: 24,
          }}
        >
          {c.showName && (
            <Text
              style={{
                fontSize: c.nameSize,
                fontFamily: headingFont,
                fontWeight: 300,
                letterSpacing: 2,
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
                color: c.applyTo.jobTitle ? c.accent : '#777',
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
              iconColor={c.applyTo.headerIcons ? c.accent : '#888'}
              itemStyle={{ color: '#777', fontSize: c.smallSize }}
              stacked={false}
            />
          )}
        </View>

        {/* Sections: label col 22% + content col */}
        {visibleSections.map(section => (
          <View key={section.id} style={{ flexDirection: 'row', marginBottom: 20 }}>
            {/* Label column */}
            <View style={{ width: '22%', paddingRight: 12 }}>
              <Text
                style={{
                  fontSize: c.smallSize,
                  fontFamily: headingFont,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  color: '#999',
                  marginTop: 2,
                }}
              >
                {section.heading}
              </Text>
            </View>
            {/* Content column */}
            <View style={{ flex: 1 }}>
              <PdfSectionBody section={section} c={c} />
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
