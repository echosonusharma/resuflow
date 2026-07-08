import ClassicClear, { meta as classicClearMeta } from './classic-clear.template';
import SlateSidebar, { meta as slateSidebarMeta } from './slate-sidebar.template';
import CompactAts, { meta as compactAtsMeta } from './compact-ats.template';
import ObsidianEdge, { meta as obsidianEdgeMeta } from './obsidian-edge.template';
import type {
  Customize, Palette, ResolvedCustomize, TemplateDefinition, TemplateId, TemplateMeta,
} from '../types';

export const TEMPLATES = {
  'classic-clear': { component: ClassicClear, meta: classicClearMeta },
  'slate-sidebar': { component: SlateSidebar, meta: slateSidebarMeta },
  'compact-ats': { component: CompactAts, meta: compactAtsMeta },
  'obsidian-edge': { component: ObsidianEdge, meta: obsidianEdgeMeta },
} satisfies Record<TemplateId, TemplateDefinition>;

export function getTemplate(id: string): TemplateDefinition {
  return (id in TEMPLATES ? TEMPLATES[id as TemplateId] : TEMPLATES['classic-clear']);
}

export function getAllTemplates(): TemplateDefinition[] {
  return Object.values(TEMPLATES);
}

// Merge template defaults with user customize - user wins
export function resolveCustomize(templateMeta: TemplateMeta, userCustomize?: Customize): ResolvedCustomize {
  const defaults = templateMeta.defaultCustomize || {};
  return {
    document: { ...defaults.document, ...userCustomize?.document },
    layout: { ...defaults.layout, ...userCustomize?.layout },
    fontSize: { ...defaults.fontSize, ...userCustomize?.fontSize },
    spacing: { ...defaults.spacing, ...userCustomize?.spacing },
    colors: {
      ...defaults.colors,
      ...userCustomize?.colors,
      accentApplyTo: {
        ...(defaults.colors?.accentApplyTo || {}),
        ...(userCustomize?.colors?.accentApplyTo || {}),
      }
    },
    headings: { ...defaults.headings, ...userCustomize?.headings },
    entries: { ...defaults.entries, ...userCustomize?.entries },
    font: { ...defaults.font, ...userCustomize?.font },
    photo: { ...defaults.photo, ...userCustomize?.photo },
    header: { ...defaults.header, ...userCustomize?.header },
    links: { ...defaults.links, ...userCustomize?.links },
    footer: { ...defaults.footer, ...userCustomize?.footer },
  };
}

export const PALETTES: readonly Palette[] = [
  { accent: '#1E3A5F', text: '#1a1a1a', name: 'Navy' },
  { accent: '#1A6B5F', text: '#1a1a1a', name: 'Teal' },
  { accent: '#8B2E2E', text: '#f0e8e8', name: 'Crimson' },
  { accent: '#4A4A5A', text: '#1a1a1a', name: 'Slate' },
  { accent: '#1A3A2A', text: '#2D5A40', name: 'Forest' },
  { accent: '#1E5276', text: '#4A6FA5', name: 'Steel' },
  { accent: '#7A4A1A', text: '#D4956A', name: 'Copper' },
  { accent: '#4A1E5F', text: '#EC4899', name: 'Violet' },
];
