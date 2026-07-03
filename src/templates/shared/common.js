import { PALETTES } from '../index.js';

const BULLET_CHARS = { dot: '•', dash: '–', arrow: '→', none: '' };
const PHOTO_SIZES = { small: 64, medium: 80, large: 96 };

// Derives every commonly-needed value from a resolved customize object.
export function readCustomize(customize = {}, meta) {
  const {
    fontSize = {}, spacing = {}, colors = {},
    headings: hdg = {}, entries: ent = {}, font = {},
    photo: photoSettings = {}, links: linkSettings = {},
    header: headerSettings = {}, document: docSettings = {},
  } = customize;

  const basePt = fontSize.base ?? 10.5;
  const palette = PALETTES[colors.paletteIndex ?? 0];
  const accent = palette?.accent ?? '#1E3A5F';

  const photoShape = photoSettings.shape === 'square'
    ? { borderRadius: 0 }
    : photoSettings.shape === 'rounded'
    ? { borderRadius: 8 }
    : { borderRadius: '50%' };

  return {
    basePt,
    accent,
    palette,
    applyTo: colors.accentApplyTo || {},
    isUppercase: hdg.uppercase ?? true,
    hasUnderline: hdg.underline ?? false,
    bullet: BULLET_CHARS[ent.bulletStyle || 'dot'],
    lineHeight: spacing.lineHeight ?? 1.4,
    margin: `${spacing.leftRightMargin ?? 14}mm`,
    entryGap: `${spacing.spaceBetweenElements ?? 8}px`,
    nameSize: `${basePt + (fontSize.fullName ?? 17)}pt`,
    titleSize: `${basePt + (fontSize.professionalTitle ?? 12.5)}pt`,
    headingSize: `${basePt + (fontSize.sectionHeadings ?? 3)}pt`,
    entryHeaderSize: `${basePt + (fontSize.entryHeader ?? 1)}pt`,
    bodySize: `${basePt}pt`,
    smallSize: `${basePt - 0.5}pt`,
    tinySize: `${basePt - 1}pt`,
    headingFont: font.family && font.family !== 'default' ? font.family : meta.fontFamilies.heading,
    bodyFont: font.family && font.family !== 'default' ? font.family : meta.fontFamilies.body,
    dateFormat: docSettings.dateFormat || 'MMM YYYY',
    lang: docSettings.language,
    showName: headerSettings.showName !== false,
    showTitle: headerSettings.showTitle !== false,
    showContact: headerSettings.showContact !== false,
    showLinkedin: linkSettings.showLinkedin !== false,
    showWebsite: linkSettings.showWebsite !== false,
    hyperlink: linkSettings.hyperlink === true,
    photoSize: PHOTO_SIZES[photoSettings.size || 'medium'],
    photoShape,
    columns: customize.layout?.columns || 'one',
  };
}

export function fullNameOf(personal) {
  return [personal.firstName, personal.lastName].filter(Boolean).join(' ');
}

export function visibleSectionsOf(sections) {
  return sections
    .filter(s => s.visible)
    .map(s => ({ ...s, entries: s.entries.filter(e => e.visible) }))
    .filter(s => s.entries.length > 0);
}
