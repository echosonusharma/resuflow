import ClassicClear, { meta as classicClearMeta } from './classic-clear.template.jsx';
import AtlanticBlue, { meta as atlanticBlueMeta } from './atlantic-blue.template.jsx';
import MercuryFlow, { meta as mercuryFlowMeta } from './mercury-flow.template.jsx';
import IvoryProfessional, { meta as ivoryProfessionalMeta } from './ivory-professional.template.jsx';
import SlateSidebar, { meta as slateSidebarMeta } from './slate-sidebar.template.jsx';
import NordicMinimal, { meta as nordicMinimalMeta } from './nordic-minimal.template.jsx';
import TimelinePro, { meta as timelineProMeta } from './timeline-pro.template.jsx';
import BoldBanner, { meta as boldBannerMeta } from './bold-banner.template.jsx';
import CompactAts, { meta as compactAtsMeta } from './compact-ats.template.jsx';
import DuoTone, { meta as duoToneMeta } from './duo-tone.template.jsx';

export const TEMPLATES = {
  'classic-clear': { component: ClassicClear, meta: classicClearMeta },
  'atlantic-blue': { component: AtlanticBlue, meta: atlanticBlueMeta },
  'mercury-flow': { component: MercuryFlow, meta: mercuryFlowMeta },
  'ivory-professional': { component: IvoryProfessional, meta: ivoryProfessionalMeta },
  'slate-sidebar': { component: SlateSidebar, meta: slateSidebarMeta },
  'nordic-minimal': { component: NordicMinimal, meta: nordicMinimalMeta },
  'timeline-pro': { component: TimelinePro, meta: timelineProMeta },
  'bold-banner': { component: BoldBanner, meta: boldBannerMeta },
  'compact-ats': { component: CompactAts, meta: compactAtsMeta },
  'duo-tone': { component: DuoTone, meta: duoToneMeta },
};

export function getTemplate(id) {
  return TEMPLATES[id] || TEMPLATES['classic-clear'];
}

export function getAllTemplates() {
  return Object.values(TEMPLATES);
}

// Merge template defaults with user customize — user wins
export function resolveCustomize(templateMeta, userCustomize) {
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

export const PALETTES = [
  { accent: '#1E3A5F', text: '#1a1a1a', name: 'Navy' },
  { accent: '#1A6B5F', text: '#1a1a1a', name: 'Teal' },
  { accent: '#8B2E2E', text: '#f0e8e8', name: 'Crimson' },
  { accent: '#4A4A5A', text: '#1a1a1a', name: 'Slate' },
  { accent: '#1A3A2A', text: '#2D5A40', name: 'Forest' },
  { accent: '#1E5276', text: '#4A6FA5', name: 'Steel' },
  { accent: '#7A4A1A', text: '#D4956A', name: 'Copper' },
  { accent: '#4A1E5F', text: '#EC4899', name: 'Violet' },
];
