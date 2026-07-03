import React from 'react';
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { registerFonts, parseFontFamily } from './shared/pdfFonts.js';
import { readCustomize, fullNameOf, visibleSectionsOf } from '../shared/common.js';
import PdfSectionBody, { PdfContactRow } from './shared/PdfSectionBody.jsx';
import { getTemplate } from '../index.js';

registerFonts();

const PAGE_SIZE_MAP = { A4: 'A4', Letter: 'LETTER', A5: 'A5' };
const SIDE_SECTION_TYPES = ['skills', 'languages', 'certifications'];

export default function BoldBannerPdf({ personal, sections, customize }) {
  const { meta } = getTemplate('bold-banner');
  const c = readCustomize(customize, meta);
  const pageSize = PAGE_SIZE_MAP[customize?.document?.pageFormat] || 'A4';
  const headingFont = parseFontFamily(c.headingFont);
  const bodyFont = parseFontFamily(c.bodyFont);
  const visibleSections = visibleSectionsOf(sections);
  const fullName = fullNameOf(personal);
  const isTwoCol = c.columns === 'two';

  const mainSections = isTwoCol
    ? visibleSections.filter(s => !SIDE_SECTION_TYPES.includes(s.type))
    : visibleSections;
  const sideSections = isTwoCol
    ? visibleSections.filter(s => SIDE_SECTION_TYPES.includes(s.type))
    : [];

  function SectionHeading({ heading, color = '#1a1a2e' }) {
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
            color: c.applyTo.headings ? c.accent : color,
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
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
        }}
      >
        {/* Banner header */}
        <View
          style={{
            backgroundColor: c.accent,
            paddingTop: 24,
            paddingBottom: 24,
            paddingLeft: c.margin,
            paddingRight: c.margin,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {personal.photo && (
            <Image
              src={personal.photo}
              style={{ width: 70, height: 70, borderRadius: 35, marginRight: 16 }}
            />
          )}
          <View style={{ flex: 1 }}>
            {c.showName && (
              <Text
                style={{
                  fontSize: c.nameSize,
                  fontFamily: headingFont,
                  fontWeight: 700,
                  color: '#ffffff',
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
                  color: 'rgba(255,255,255,0.85)',
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
                iconColor="rgba(255,255,255,0.8)"
                itemStyle={{ color: 'rgba(255,255,255,0.9)', fontSize: c.smallSize }}
                stacked={false}
              />
            )}
          </View>
        </View>

        {/* Body */}
        {isTwoCol ? (
          <View style={{ flexDirection: 'row', paddingLeft: c.margin, paddingRight: c.margin, paddingTop: 20, paddingBottom: 20 }}>
            {/* Main col */}
            <View style={{ flex: 1.9, marginRight: 16 }}>
              {mainSections.map(section => (
                <View key={section.id} style={{ marginBottom: c.entryGap }}>
                  <SectionHeading heading={section.heading} />
                  <PdfSectionBody section={section} c={c} />
                </View>
              ))}
            </View>
            {/* Side col */}
            <View style={{ flex: 1 }}>
              {sideSections.map(section => (
                <View key={section.id} style={{ marginBottom: c.entryGap }}>
                  <SectionHeading heading={section.heading} />
                  <PdfSectionBody section={section} c={c} twoColLang={true} />
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={{ paddingLeft: c.margin, paddingRight: c.margin, paddingTop: 20, paddingBottom: 20 }}>
            {mainSections.map(section => (
              <View key={section.id} style={{ marginBottom: c.entryGap }}>
                <SectionHeading heading={section.heading} />
                <PdfSectionBody section={section} c={c} />
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
