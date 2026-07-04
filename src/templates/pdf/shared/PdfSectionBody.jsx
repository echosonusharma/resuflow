import React from 'react';
import { View, Text, Image, Link } from '@react-pdf/renderer';
import { formatDate, formatDateRange } from '../../shared/formatDate.js';
import { getContactFields, displayValue } from '../../shared/contactFields.js';
import { sectionKind } from '../../shared/common.js';

/**
 * PdfContactRow - renders contact items separated by bullet dividers.
 * Unicode dingbat icons are avoided: they're outside the latin subset of
 * the embedded fonts and render as broken glyphs in the PDF.
 * stacked=true → column, stacked=false → row with wrap
 */
export function PdfContactRow({ personal, c, iconColor, itemStyle = {}, stacked = false }) {
  const containerStyle = {
    flexDirection: stacked ? 'column' : 'row',
    flexWrap: stacked ? 'nowrap' : 'wrap',
    justifyContent: stacked ? 'flex-start' : 'center',
    marginTop: 4,
  };

  const baseItemStyle = {
    fontSize: c.smallSize,
    color: '#555',
    marginBottom: stacked ? 3 : 2,
    ...itemStyle,
  };

  const hiddenKeys = [];
  if (c.showLinkedin === false) hiddenKeys.push('linkedin');
  if (c.showWebsite === false) hiddenKeys.push('website');
  const items = getContactFields(personal, { hiddenKeys });

  if (!items.length) return null;

  return (
    <View style={containerStyle}>
      {items.map(({ key, label, display, href }, i) => {
        const text = label ? `${label}: ${display}` : display;
        return (
          <React.Fragment key={key}>
            {i > 0 && !stacked && (
              <Text style={{ ...baseItemStyle, color: iconColor || '#555', marginHorizontal: 6 }}>•</Text>
            )}
            {c.hyperlink && href
              ? <Link src={href} style={{ ...baseItemStyle, color: baseItemStyle.color, textDecoration: 'underline' }}>{text}</Link>
              : <Text style={baseItemStyle}>{text}</Text>}
          </React.Fragment>
        );
      })}
    </View>
  );
}

/**
 * PdfFooter - fixed footer on every page: optional text + page numbers.
 */
export function PdfFooter({ personal, customize }) {
  const f = customize?.footer || {};
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ');
  const text =
    f.text === 'name' ? fullName :
    f.text === 'email' ? (personal.email || '') :
    f.text === 'custom' ? (f.customText || '') : '';
  if (!text && !f.pageNumbers) return null;
  return (
    <View
      fixed
      style={{
        position: 'absolute',
        bottom: 14,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: text ? 'space-between' : 'flex-end',
      }}
    >
      {text ? <Text style={{ fontSize: 8, color: '#888' }}>{text}</Text> : null}
      {f.pageNumbers && (
        <Text
          style={{ fontSize: 8, color: '#888' }}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      )}
    </View>
  );
}

/**
 * PdfSectionBody - renders one section's entries.
 * Props: { section, c, twoColLang }
 */
export default function PdfSectionBody({ section, c, twoColLang = false }) {
  // c.textColor / c.subTextColor let templates override defaults, e.g. white
  // text on dark accent sidebars.
  const baseColor = c.textColor || '#333';
  const subColor = c.subTextColor || '#555';
  const bulletColor = c.applyTo.dots ? c.accent : baseColor;

  const textStyle = {
    fontSize: c.bodySize,
    lineHeight: c.lineHeight,
    color: baseColor,
  };

  const titleStyle = {
    fontSize: c.entryHeaderSize,
    fontWeight: 700,
    color: c.textColor || '#1a1a1a',
  };

  const subtitleStyle = {
    fontSize: c.smallSize,
    color: c.applyTo.entrySubtitle ? c.accent : subColor,
    marginTop: 1,
  };

  const dateStyle = {
    fontSize: c.smallSize,
    color: c.applyTo.dates ? c.accent : (c.subTextColor || '#777'),
    textAlign: 'right',
  };

  const renderBullets = (entry) => {
    if (!entry.bullets || !entry.bullets.filter(Boolean).length) return null;
    return (
      <View style={{ marginTop: 3 }}>
        {entry.bullets.filter(Boolean).map((b, i) => (
          <View key={i} style={{ flexDirection: 'row', marginBottom: 2 }}>
            {c.bullet ? (
              <Text style={{ fontSize: c.bodySize, color: bulletColor, marginRight: 5, width: 10 }}>
                {c.bullet}
              </Text>
            ) : null}
            <Text style={{ ...textStyle, flex: 1 }}>{b}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderDatedEntry = (entry, title, subtitleParts, current) => (
    <View key={entry.id} wrap={false} style={{ marginBottom: c.entryGap }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={titleStyle}>{title}</Text>
          {subtitleParts.filter(Boolean).length > 0 && (
            <Text style={subtitleStyle}>{subtitleParts.filter(Boolean).join(' · ')}</Text>
          )}
        </View>
        <Text style={dateStyle}>
          {formatDateRange(entry.startDate, entry.endDate, current, c.dateFormat, c.lang)}
        </Text>
      </View>
      {renderBullets(entry)}
    </View>
  );

  switch (sectionKind(section.type)) {
    case 'profile':
      return (
        <View>
          {section.entries.map(entry => (
            <Text key={entry.id} style={{ ...textStyle, marginBottom: c.entryGap }}>
              {entry.content}
            </Text>
          ))}
        </View>
      );

    case 'experience':
      return (
        <View>
          {section.entries.map(entry =>
            renderDatedEntry(entry, entry.title, [entry.company, entry.location], entry.current)
          )}
        </View>
      );

    case 'education':
      return (
        <View>
          {section.entries.map(entry =>
            renderDatedEntry(entry, entry.degree, [entry.school, entry.location], false)
          )}
        </View>
      );

    case 'projects':
      return (
        <View>
          {section.entries.map(entry =>
            renderDatedEntry(entry, entry.title, [entry.link ? displayValue('website', entry.link) : ''], false)
          )}
        </View>
      );

    case 'references':
      return (
        <View>
          {section.entries.map(entry => (
            <View key={entry.id} wrap={false} style={{ marginBottom: c.entryGap }}>
              <Text style={{ ...textStyle, fontWeight: 700 }}>{entry.name}</Text>
              {entry.position ? <Text style={subtitleStyle}>{entry.position}</Text> : null}
              {entry.contact ? <Text style={textStyle}>{entry.contact}</Text> : null}
            </View>
          ))}
        </View>
      );

    case 'skills':
      return (
        <View>
          {section.entries.map(entry => (
            <View key={entry.id} style={{ flexDirection: 'row', marginBottom: 4, flexWrap: 'wrap' }}>
              {entry.category ? (
                <Text style={{ ...textStyle, fontWeight: 700 }}>{entry.category}: </Text>
              ) : null}
              <Text style={textStyle}>{entry.items}</Text>
            </View>
          ))}
        </View>
      );

    case 'languages': {
      const cols = twoColLang ? 1 : 2;
      // Build rows of `cols` items
      const entries = section.entries;
      const rows = [];
      for (let i = 0; i < entries.length; i += cols) {
        rows.push(entries.slice(i, i + cols));
      }
      return (
        <View>
          {rows.map((row, ri) => (
            <View key={ri} style={{ flexDirection: 'row', marginBottom: 4 }}>
              {row.map(entry => (
                <View key={entry.id} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginRight: 8 }}>
                  <Text style={textStyle}>{entry.language}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    {[1, 2, 3, 4, 5].map(dot => (
                      <View
                        key={dot}
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: 3.5,
                          marginRight: 2,
                          backgroundColor: dot <= (entry.level || 3)
                            ? (c.applyTo.dots ? c.accent : baseColor)
                            : (c.textColor ? 'rgba(255,255,255,0.35)' : '#d5d5d5'),
                        }}
                      />
                    ))}
                  </View>
                </View>
              ))}
              {/* Fill empty cells so flex layout stays consistent */}
              {row.length < cols && <View style={{ flex: 1 }} />}
            </View>
          ))}
        </View>
      );
    }

    case 'certifications':
      return (
        <View>
          {section.entries.map(entry => (
            <View key={entry.id} wrap={false} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: c.entryGap }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ ...textStyle, fontWeight: 700 }}>{entry.name}</Text>
                {entry.issuer ? (
                  <Text style={subtitleStyle}>{entry.issuer}</Text>
                ) : null}
              </View>
              {entry.date ? (
                <Text style={dateStyle}>{formatDate(entry.date, false, c.dateFormat, c.lang)}</Text>
              ) : null}
            </View>
          ))}
        </View>
      );

    default:
      return null;
  }
}
