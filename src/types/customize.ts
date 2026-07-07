export interface DocumentSettings {
  language?: string;
  dateFormat?: string;
  pageFormat?: string;
}

export interface LayoutSettings {
  columns?: 'one' | 'two';
}

export interface FontSizeSettings {
  base?: number;
  /** offsets added to base */
  fullName?: number;
  professionalTitle?: number;
  sectionHeadings?: number;
  entryHeader?: number;
}

export interface SpacingSettings {
  lineHeight?: number;
  spaceBetweenElements?: number;
  leftRightMargin?: number;
}

export interface AccentApplyTo {
  name?: boolean;
  jobTitle?: boolean;
  headings?: boolean;
  headingsLine?: boolean;
  headerIcons?: boolean;
  dots?: boolean;
  dates?: boolean;
  entrySubtitle?: boolean;
  linkIcons?: boolean;
}

export interface ColorsSettings {
  /** how the template applies color: 'full-page' | 'header' | 'sidebar' | 'plain' */
  scheme?: string;
  paletteIndex?: number;
  customAccent?: string | null;
  accentApplyTo?: AccentApplyTo;
}

export interface HeadingsSettings {
  uppercase?: boolean;
  underline?: boolean;
}

export type BulletStyle = 'dot' | 'dash' | 'arrow' | 'none';

export interface EntriesSettings {
  bulletStyle?: BulletStyle;
}

export interface FontSettings {
  /** 'default' uses the template's fontFamilies */
  family?: string;
}

export interface PhotoSettings {
  size?: 'small' | 'medium' | 'large';
  shape?: 'circle' | 'square' | 'rounded';
}

export interface LinksSettings {
  showLinkedin?: boolean;
  showWebsite?: boolean;
  hyperlink?: boolean;
}

export interface HeaderSettings {
  showName?: boolean;
  showTitle?: boolean;
  showContact?: boolean;
}

export interface FooterSettings {
  text?: string;
  customText?: string;
  pageNumbers?: boolean;
}

export interface Customize {
  document?: DocumentSettings;
  layout?: LayoutSettings;
  fontSize?: FontSizeSettings;
  spacing?: SpacingSettings;
  colors?: ColorsSettings;
  headings?: HeadingsSettings;
  entries?: EntriesSettings;
  font?: FontSettings;
  photo?: PhotoSettings;
  links?: LinksSettings;
  header?: HeaderSettings;
  footer?: FooterSettings;
}

/** Output of resolveCustomize: every group present (fields still optional). */
export type ResolvedCustomize = Required<Customize>;

export interface Palette {
  accent: string;
  text: string;
  name: string;
}

/** Derived values returned by readCustomize — what templates actually consume. */
export interface ReadCustomize {
  basePt: number;
  accent: string;
  palette: Palette | undefined;
  applyTo: AccentApplyTo;
  isUppercase: boolean;
  hasUnderline: boolean;
  bullet: string;
  lineHeight: number;
  margin: string;
  entryGap: string;
  nameSize: string;
  titleSize: string;
  headingSize: string;
  entryHeaderSize: string;
  bodySize: string;
  smallSize: string;
  tinySize: string;
  headingFont: string | undefined;
  bodyFont: string | undefined;
  dateFormat: string;
  lang: string | undefined;
  showName: boolean;
  showTitle: boolean;
  showContact: boolean;
  showLinkedin: boolean;
  showWebsite: boolean;
  hyperlink: boolean;
  photoSize: number;
  photoShape: { borderRadius: number | string };
  columns: 'one' | 'two';
}
