import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { formatDate, formatDateRange } from '../../shared/formatDate.js';

/**
 * PdfContactRow — renders contact items separated by bullet dividers.
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

  const items = [];
  if (personal.email) items.push(personal.email);
  if (personal.phone) items.push(personal.phone);
  if (personal.location) items.push(personal.location);
  if (personal.linkedin && c.showLinkedin !== false) items.push(personal.linkedin);
  if (personal.website && c.showWebsite !== false) items.push(personal.website);

  if (!items.length) return null;

  return (
    <View style={containerStyle}>
      {items.map((value, i) => (
        <React.Fragment key={i}>
          {i > 0 && !stacked && (
            <Text style={{ ...baseItemStyle, color: iconColor || '#555', marginHorizontal: 6 }}>•</Text>
          )}
          <Text style={baseItemStyle}>{value}</Text>
        </React.Fragment>
      ))}
    </View>
  );
}

/**
 * PdfSectionBody — renders one section's entries.
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

  switch (section.type) {
    case 'profile':
    case 'custom':
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
