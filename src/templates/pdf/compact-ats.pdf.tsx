import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import type { PageSize } from '@react-pdf/types';
import { readCustomize, fullNameOf, visibleSectionsOf } from '../shared/common.js';
import { formatDateRange } from '../shared/formatDate.js';
import PdfSectionBody, { PdfFooter } from './shared/PdfSectionBody.jsx';
import { getContactFields } from '../shared/contactFields.js';
import { getTemplate } from '../index.js';
import type { TemplateProps, ExperienceEntry, EducationEntry } from '../../types';

const PAGE_SIZE_MAP = { A4: 'A4', Letter: 'LETTER', A5: 'A5' };

export default function CompactAtsPdf({ personal, sections, customize }: TemplateProps) {
  const { meta } = getTemplate('compact-ats');
  const c = readCustomize(customize, meta);
  const pageSize = (PAGE_SIZE_MAP[(customize?.document?.pageFormat ?? '') as keyof typeof PAGE_SIZE_MAP] || 'A4') as PageSize;
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
    textTransform: (c.isUppercase ? 'uppercase' : 'none') as 'uppercase' | 'none',
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
                {(section.entries as (ExperienceEntry | EducationEntry)[]).map(entry => {
                  const isEdu = section.type === 'education';
                  const title = isEdu ? (entry as EducationEntry).degree : (entry as ExperienceEntry).title;
                  const org = isEdu ? (entry as EducationEntry).school : (entry as ExperienceEntry).company;
                  const current = isEdu ? false : (entry as ExperienceEntry).current;
                  const location = (entry as ExperienceEntry).location;
                  const parts = [title, org && `${org}`, location && `${location}`].filter(Boolean);
                  const startDate = (entry as ExperienceEntry).startDate;
                  const endDate = (entry as ExperienceEntry).endDate;
                  const bullets = (entry as ExperienceEntry).bullets;
                  return (
                    <View key={entry.id} wrap={false} style={{ marginBottom: c.entryGap }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: c.entryHeaderSize, fontWeight: 700, flex: 1, marginRight: 8 }}>
                          {parts.join(', ')}
                        </Text>
                        <Text style={{ fontSize: c.smallSize }}>
                          {formatDateRange(startDate, endDate, current, c.dateFormat, c.lang)}
                        </Text>
                      </View>
                      {bullets?.filter(Boolean).length > 0 && (
                        <View style={{ marginTop: 2 }}>
                          {bullets!.filter(Boolean).map((b: string, i: number) => (
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
                {(section.entries as import('../../types').LanguageEntry[]).map(e => e.language).filter(Boolean).join(', ')}
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
