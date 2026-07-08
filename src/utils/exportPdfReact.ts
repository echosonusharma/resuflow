import React from 'react';
import { pdf, type DocumentProps } from '@react-pdf/renderer';
import { registerFonts } from '../templates/pdf/shared/pdfFonts.js';

import ClassicClearPdf from '../templates/pdf/classic-clear.pdf.jsx';
import SlateSidebarPdf from '../templates/pdf/slate-sidebar.pdf.jsx';
import CompactAtsPdf from '../templates/pdf/compact-ats.pdf.jsx';
import ObsidianEdgePdf from '../templates/pdf/obsidian-edge.pdf.jsx';
import type { PersonalInfo, Section, Customize, TemplateId } from '../types';

const PDF_TEMPLATES: Record<TemplateId, React.ComponentType<{ personal: PersonalInfo; sections: Section[]; customize?: Customize }>> = {
  'classic-clear': ClassicClearPdf,
  'slate-sidebar': SlateSidebarPdf,
  'compact-ats':   CompactAtsPdf,
  'obsidian-edge': ObsidianEdgePdf,
};

export async function exportPdfReact({ personal, sections, customize, templateId }: {
  personal: PersonalInfo;
  sections: Section[];
  customize?: Customize;
  templateId: TemplateId;
}) {
  registerFonts();

  const PdfTemplate = PDF_TEMPLATES[templateId] ?? PDF_TEMPLATES['classic-clear'];

  const blob = await pdf(
    React.createElement(PdfTemplate, { personal, sections, customize }) as React.ReactElement<DocumentProps>
  ).toBlob();

  const nameParts = [personal.firstName, personal.lastName].filter(Boolean);
  const rawName = nameParts.length ? nameParts.join('_') : 'Resume';
  const safeName = rawName.replace(/[^a-z0-9_\-]/gi, '_');
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const fileName = `${safeName}_Resuflow_${date}.pdf`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer revoke so browser has time to initiate download
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
