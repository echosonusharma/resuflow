import React from 'react';
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { registerFonts, parseFontFamily } from './shared/pdfFonts.js';
import { readCustomize, fullNameOf, visibleSectionsOf } from '../shared/common.js';
import PdfSectionBody, { PdfContactRow } from './shared/PdfSectionBody.jsx';
import { getTemplate } from '../index.js';

registerFonts();

const PAGE_SIZE_MAP = { A4: 'A4', Letter: 'LETTER', A5: 'A5' };
const RAIL_TYPES = ['skills', 'languages', 'certifications'];

function hexTint(hex) {
  return `${hex}1f`;
}

function SectionHeading({ heading, c, headingFont }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <View style={{
        width: 8, height: 8,
        backgroundColor: c.applyTo.headingsLine ? c.accent : '#333',
        marginRight: 8,
        flexShrink: 0,
      }} />
      <Text style={{
        fontSize: c.headingSize,
        fontFamily: headingFont,
        fontWeight: 700,
        fontStyle: 'italic',
        textTransform: c.isUppercase ? 'uppercase' : 'none',
        color: c.applyTo.headings ? c.accent : '#222',
      }}>
        {heading}
      </Text>
    </View>
  );
}

export default function DuoTonePdf({ personal, sections, customize }) {
  const { meta } = getTemplate('duo-tone');
  const c = readCustomize(customize, meta);
  const pageSize = PAGE_SIZE_MAP[customize?.document?.pageFormat] || 'A4';
  const headingFont = parseFontFamily(c.headingFont);
  const bodyFont = parseFontFamily(c.bodyFont);
  const visibleSections = visibleSectionsOf(sections);
  const fullName = fullNameOf(personal);
  const twoCol = c.columns === 'two';
  const railSections = twoCol ? visibleSections.filter(s => RAIL_TYPES.includes(s.type)) : [];
  const mainSections = twoCol ? visibleSections.filter(s => !RAIL_TYPES.includes(s.type)) : visibleSections;

  const renderSection = (section) => (
    <View key={section.id} wrap={false} style={{ marginBottom: 18 }}>
      <SectionHeading heading={section.heading} c={c} headingFont={headingFont} />
      <PdfSectionBody section={section} c={c} twoColLang={twoCol} />
    </View>
  );

  return (
    <Document>
      <Page
        size={pageSize}
        style={{
          fontFamily: bodyFont,
          fontSize: c.bodySize,
          lineHeight: c.lineHeight,
          backgroundColor: '#ffffff',
          color: '#2a2a2a',
        }}
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 36,
          paddingBottom: 22,
          paddingLeft: c.margin,
          paddingRight: c.margin,
          borderBottomWidth: 2,
          borderBottomColor: c.accent,
          borderBottomStyle: 'solid',
          marginBottom: 0,
        }}>
          <View style={{ flex: 1, marginRight: personal.photo ? 20 : 0 }}>
            {c.showName && (
              <Text style={{
                fontSize: c.nameSize,
                fontFamily: headingFont,
                fontWeight: 700,
                fontStyle: 'italic',
                lineHeight: 1.1,
                color: c.applyTo.name ? c.accent : '#1c1c1c',
                marginBottom: 4,
              }}>
                {fullName || 'Your Name'}
              </Text>
            )}
            {c.showTitle && personal.title && (
              <Text style={{
                fontSize: c.titleSize,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginTop: 6,
                color: c.applyTo.jobTitle ? c.accent : '#777',
              }}>
                {personal.title}
              </Text>
            )}
            {c.showContact && (
              <PdfContactRow
                personal={personal}
                c={c}
                iconColor={c.applyTo.headerIcons ? c.accent : '#888'}
                itemStyle={{ marginTop: 12 }}
              />
            )}
          </View>
          {personal.photo && (
            <Image
              src={personal.photo}
              style={{
                width: c.photoSize,
                height: c.photoSize,
                borderRadius: c.photoShape?.borderRadius ?? (c.photoShape?.borderRadius === 0 ? 0 : c.photoSize / 2),
                flexShrink: 0,
              }}
            />
          )}
        </View>

        {/* Body */}
        {twoCol ? (
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ flex: 2, paddingTop: 24, paddingBottom: 24, paddingLeft: c.margin, paddingRight: 12 }}>
              {mainSections.map(renderSection)}
            </View>
            <View style={{
              flex: 1,
              paddingTop: 24,
              paddingBottom: 24,
              paddingLeft: 12,
              paddingRight: c.margin,
              backgroundColor: hexTint(c.accent),
            }}>
              {railSections.map(renderSection)}
            </View>
          </View>
        ) : (
          <View style={{ paddingTop: 24, paddingBottom: 24, paddingLeft: c.margin, paddingRight: c.margin }}>
            {mainSections.map(renderSection)}
          </View>
        )}
      </Page>
    </Document>
  );
}
