import React from 'react';
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { registerFonts, parseFontFamily } from './shared/pdfFonts.js';
import { readCustomize, fullNameOf, visibleSectionsOf } from '../shared/common.js';
import PdfSectionBody, { PdfContactRow } from './shared/PdfSectionBody.jsx';
import { getTemplate } from '../index.js';

registerFonts();

const PAGE_SIZE_MAP = { A4: 'A4', Letter: 'LETTER', A5: 'A5' };

const SIDEBAR_SECTION_TYPES = ['skills', 'languages', 'certifications'];

export default function SlateSidebarPdf({ personal, sections, customize }) {
  const { meta } = getTemplate('slate-sidebar');
  const c = readCustomize(customize, meta);
  const pageSize = PAGE_SIZE_MAP[customize?.document?.pageFormat] || 'A4';
  const headingFont = parseFontFamily(c.headingFont);
  const bodyFont = parseFontFamily(c.bodyFont);
  const visibleSections = visibleSectionsOf(sections);
  const fullName = fullNameOf(personal);

  const sidebarSections = visibleSections.filter(s => SIDEBAR_SECTION_TYPES.includes(s.type));
  const mainSections = visibleSections.filter(s => !SIDEBAR_SECTION_TYPES.includes(s.type));

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
            color: '#333',
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

  return (
    <Document>
      <Page
        size={pageSize}
        style={{
          flexDirection: 'row',
          fontFamily: bodyFont,
          fontSize: c.bodySize,
          lineHeight: c.lineHeight,
          backgroundColor: '#ffffff',
        }}
      >
        {/* Sidebar */}
        <View
          style={{
            width: '32%',
            backgroundColor: '#f0f0ee',
            paddingTop: 40,
            paddingBottom: 40,
            paddingLeft: 14,
            paddingRight: 14,
          }}
        >
          {/* Photo */}
          {personal.photo && (
            <View style={{ alignItems: 'center', marginBottom: 14 }}>
              <Image
                src={personal.photo}
                style={{ width: 90, height: 90, borderRadius: 45 }}
              />
            </View>
          )}

          {/* Contact */}
          {c.showContact && (
            <View style={{ marginBottom: 14 }}>
              <PdfContactRow
                personal={personal}
                c={c}
                iconColor={c.applyTo.headerIcons ? c.accent : '#555'}
                itemStyle={{ fontSize: c.smallSize, color: '#444' }}
                stacked={true}
              />
            </View>
          )}

          {/* Sidebar sections */}
          {sidebarSections.map(section => (
            <View key={section.id} style={{ marginBottom: 14 }}>
              <SidebarHeading heading={section.heading} />
              <PdfSectionBody section={section} c={c} twoColLang={true} />
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
          {/* Name & Title */}
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
                marginBottom: 16,
              }}
            >
              {personal.title}
            </Text>
          )}

          {/* Main sections */}
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
