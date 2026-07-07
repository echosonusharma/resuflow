import type { ComponentType } from 'react';
import type { Customize } from './customize';
import type { PersonalInfo, Section, TemplateId } from './resume';

export interface TemplateProps {
  personal: PersonalInfo;
  sections: Section[];
  customize?: Customize;
}

export interface TemplateSupports {
  columns: Array<'one' | 'two'>;
  photo: boolean;
  colorScheme: boolean;
  colorBackground: boolean;
  header: boolean;
  footer: boolean;
  dateFormat: boolean;
  fontSize: boolean;
  spacing: boolean;
  entries: boolean;
  headings: boolean;
  font: boolean;
  links: boolean;
}

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  category: string;
  description: string;
  /** fontsource families to load */
  fonts: string[];
  fontFamilies: { heading: string; body: string };
  defaultCustomize: Customize;
  supports: TemplateSupports;
}

export interface TemplateDefinition {
  component: ComponentType<TemplateProps>;
  meta: TemplateMeta;
}
