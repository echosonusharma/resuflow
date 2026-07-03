import { PALETTES } from '../index.js';

export function buildStyles(customize = {}) {
  const {
    fontSize = {}, spacing = {}, colors = {},
    headings: hdg = {}, entries: ent = {}, font = {},
  } = customize;

  const basePt = fontSize.base ?? 10.5;
  const palette = PALETTES[colors.paletteIndex ?? 0];
  const accent = palette?.accent ?? '#1E3A5F';
  const applyTo = colors.accentApplyTo || {};
  const isUppercase = hdg.uppercase ?? true;
  const hasUnderline = hdg.underline ?? true;
  const BULLET_CHARS = { dot: '•', dash: '–', arrow: '→', none: '' };
  const bullet = BULLET_CHARS[ent.bulletStyle || 'dot'];
  const lineHeight = spacing.lineHeight ?? 1.4;
  const margin = `${spacing.leftRightMargin ?? 14}mm`;
  const entryGap = `${spacing.spaceBetweenElements ?? 8}px`;

  const nameSize = `${basePt + (fontSize.fullName ?? 17)}pt`;
  const titleSize = `${basePt + (fontSize.professionalTitle ?? 12.5)}pt`;
  const headingSize = `${basePt + (fontSize.sectionHeadings ?? 3)}pt`;
  const entryHeaderSize = `${basePt + (fontSize.entryHeader ?? 1)}pt`;
  const smallSize = `${basePt - 0.5}pt`;
  const tinySize = `${basePt - 1}pt`;

  return {
    accent, applyTo, isUppercase, hasUnderline, bullet,
    lineHeight, margin, entryGap, basePt,
    nameSize, titleSize, headingSize, entryHeaderSize, smallSize, tinySize,
    font,
  };
}
