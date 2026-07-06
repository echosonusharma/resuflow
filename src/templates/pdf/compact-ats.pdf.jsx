import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { readCustomize, fullNameOf, visibleSectionsOf } from '../shared/common.js';
import { formatDateRange } from '../shared/formatDate.js';
import PdfSectionBody, { PdfFooter } from './shared/PdfSectionBody.jsx';
import { getContactFields } from '../shared/contactFields.js';
import { getTemplate } from '../index.js';

const PAGE_SIZE_MAP = { A4: 'A4', Letter: 'LETTER', A5: 'A5' };

export default function CompactAtsPdf({ personal, sections, customize }) {
  const { meta } = getTemplate('compact-ats');
  const c = readCustomize(customize, meta);
  const pageSize = PAGE_SIZE_MAP[customize?.document?.pageFormat] || 'A4';
  const visibleSections = visibleSectionsOf(sections);
  const fullName = fullNameOf(personal);

  const hiddenKeys = [];
  if (c.showLinkedin === false) hiddenKeys.push('linkedin');
  if (c.showWebsite === false) hiddenKeys.push('website');
  const contactParts = getContactFields(personal, { hiddenKeys })
    .map(({ display, label }) => (label ? `${label}: ${display}` : display));

  const headingStyle = {
    fontSize: c.headingSize,
    fontWeight: 700,
    textTransform: c.isUppercase ? 'uppercase' : 'none',
    letterSpacing: 0.5,
    color: '#000',
  };

  return (
    <Document>
      <Page
        size={pageSize}
        style={{
          fontFamily: 'Helvetica',
          fontSize: c.bodySize,
          lineHeight: c.lineHeight,
          paddingTop: 34,
          paddingBottom: 34,
          paddingLeft: c.margin,
          paddingRight: c.margin,
          backgroundColor: '#ffffff',
          color: '#000',
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: 14 }}>
          {c.showName && (
            <Text style={{ fontSize: c.nameSize, fontWeight: 700, lineHeight: 1.2 }}>
              {fullName || 'Your Name'}
            </Text>
          )}
          {c.showTitle && personal.title && (
            <Text style={{ fontSize: c.titleSize, lineHeight: 1.2 }}>{personal.title}</Text>
          )}
          {c.showContact && contactParts.length > 0 && (
            <Text style={{ fontSize: c.smallSize, marginTop: 3, color: '#222' }}>
              {contactParts.join(' | ')}
            </Text>
          )}
        </View>

        {/* Sections */}
        {visibleSections.map(section => (
          <View key={section.id} wrap={false} style={{ marginBottom: 10 }}>
            {/* Heading */}
            <View
              minPresenceAhead={40}
              style={{
                borderBottomWidth: c.hasUnderline ? 1 : 0,
                borderBottomColor: '#000',
                borderBottomStyle: 'solid',
                paddingBottom: c.hasUnderline ? 2 : 0,
                marginBottom: 6,
              }}
            >
              <Text style={headingStyle}>{section.heading}</Text>
            </View>

            {/* Experience / Education: compact inline format */}
            {['experience', 'volunteering', 'education'].includes(section.type) ? (
              <View>
                {section.entries.map(entry => {
                  const title = section.type === 'education' ? entry.degree : entry.title;
                  const org = section.type === 'education' ? entry.school : entry.company;
                  const current = section.type === 'education' ? false : entry.current;
                  const parts = [title, org && `${org}`, entry.location && `${entry.location}`].filter(Boolean);
                  return (
                    <View key={entry.id} wrap={false} style={{ marginBottom: c.entryGap }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: c.entryHeaderSize, fontWeight: 700, flex: 1, marginRight: 8 }}>
                          {parts.join(', ')}
                        </Text>
                        <Text style={{ fontSize: c.smallSize }}>
                          {formatDateRange(entry.startDate, entry.endDate, current, c.dateFormat, c.lang)}
                        </Text>
                      </View>
                      {entry.bullets?.filter(Boolean).length > 0 && (
                        <View style={{ marginTop: 2 }}>
                          {entry.bullets.filter(Boolean).map((b, i) => (
                            <View key={i} style={{ flexDirection: 'row', marginBottom: 1 }}>
                              {c.bullet ? (
                                <Text style={{ fontSize: c.bodySize, marginRight: 5, width: 10 }}>{c.bullet}</Text>
                              ) : null}
                              <Text style={{ fontSize: c.bodySize, lineHeight: c.lineHeight, flex: 1 }}>{b}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            ) : section.type === 'languages' ? (
              <Text style={{ fontSize: c.bodySize }}>
                {section.entries.map(e => e.language).filter(Boolean).join(', ')}
              </Text>
            ) : (
              <PdfSectionBody section={section} c={c} />
            )}
          </View>
        ))}

        <PdfFooter personal={personal} customize={customize} />
      </Page>
    </Document>
  );
}
