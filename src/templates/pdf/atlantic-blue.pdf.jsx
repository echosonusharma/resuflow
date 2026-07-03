import React from 'react';
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { registerFonts, parseFontFamily } from './shared/pdfFonts.js';
import { readCustomize, fullNameOf, visibleSectionsOf } from '../shared/common.js';
import PdfSectionBody, { PdfContactRow } from './shared/PdfSectionBody.jsx';
import { getTemplate } from '../index.js';

registerFonts();

const PAGE_SIZE_MAP = { A4: 'A4', Letter: 'LETTER', A5: 'A5' };

const SIDEBAR_SECTION_TYPES = ['profile', 'languages', 'certifications'];
const MAIN_SECTION_TYPES = ['experience', 'education', 'skills', 'custom'];

export default function AtlanticBluePdf({ personal, sections, customize }) {
  const { meta } = getTemplate('atlantic-blue');
  const c = readCustomize(customize, meta);
  const pageSize = PAGE_SIZE_MAP[customize?.document?.pageFormat] || 'A4';
  const headingFont = parseFontFamily(c.headingFont);
  const bodyFont = parseFontFamily(c.bodyFont);
  const visibleSections = visibleSectionsOf(sections);
  const fullName = fullNameOf(personal);

  const sidebarSections = visibleSections.filter(s => SIDEBAR_SECTION_TYPES.includes(s.type));
  const mainSections = visibleSections.filter(s => !SIDEBAR_SECTION_TYPES.includes(s.type) || MAIN_SECTION_TYPES.includes(s.type));

  function SidebarHeading({ heading }) {
    return (
      <View style={{ marginBottom: 8 }}>
        <Text
          style={{
            fontSize: c.headingSize,
            fontFamily: headingFont,
            fontWeight: 700,
            textTransform: c.isUppercase ? 'uppercase' : 'none',
            letterSpacing: 1,
            color: '#ffffff',
          }}
        >
          {heading}
        </Text>
      </View>
    );
  }

  function MainHeading({ heading }) {
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

  // Override c for sidebar (white text)
  const cSidebar = { ...c, applyTo: { ...c.applyTo }, accent: '#ffffff', textColor: 'rgba(255,255,255,0.92)', subTextColor: 'rgba(255,255,255,0.75)' };

  return (
    <Document>
      <Page size={pageSize} style={{ flexDirection: 'row', fontFamily: bodyFont, fontSize: c.bodySize, lineHeight: c.lineHeight, backgroundColor: '#ffffff' }}>
        {/* Sidebar */}
        <View
          style={{
            width: '32%',
            backgroundColor: c.accent,
            paddingTop: 40,
            paddingBottom: 40,
            paddingLeft: 14,
            paddingRight: 14,
            color: '#ffffff',
          }}
        >
          {/* Photo */}
          {personal.photo && (
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Image
                src={personal.photo}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
            </View>
          )}

          {/* Name & Title */}
          {c.showName && (
            <Text
              style={{
                fontSize: c.nameSize,
                fontFamily: headingFont,
                fontWeight: 700,
                lineHeight: 1.15,
                color: '#ffffff',
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
                lineHeight: 1.2,
                color: 'rgba(255,255,255,0.85)',
                marginBottom: 12,
                textAlign: 'center',
              }}
            >
              {personal.title}
            </Text>
          )}

          {/* Contact stacked */}
          {c.showContact && (
            <PdfContactRow
              personal={personal}
              c={c}
              iconColor="rgba(255,255,255,0.85)"
              itemStyle={{ color: 'rgba(255,255,255,0.9)', fontSize: c.smallSize }}
              stacked={true}
            />
          )}

          {/* Sidebar sections */}
          {sidebarSections.map(section => (
            <View key={section.id} style={{ marginTop: 16 }}>
              <SidebarHeading heading={section.heading} />
              <PdfSectionBody section={section} c={cSidebar} twoColLang={true} />
            </View>
          ))}
        </View>

        {/* Main */}
        <View
          style={{
            flex: 1,
            paddingTop: 40,
            paddingBottom: 40,
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: '#ffffff',
          }}
        >
          {mainSections.map(section => (
            <View key={section.id} style={{ marginBottom: c.entryGap }}>
              <MainHeading heading={section.heading} />
              <PdfSectionBody section={section} c={c} />
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
