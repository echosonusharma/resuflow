import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { registerFonts } from '../templates/pdf/shared/pdfFonts.js';

import ClassicClearPdf from '../templates/pdf/classic-clear.pdf.jsx';
import SlateSidebarPdf from '../templates/pdf/slate-sidebar.pdf.jsx';
import CompactAtsPdf from '../templates/pdf/compact-ats.pdf.jsx';
import ObsidianEdgePdf from '../templates/pdf/obsidian-edge.pdf.jsx';

const PDF_TEMPLATES = {
  'classic-clear': ClassicClearPdf,
  'slate-sidebar': SlateSidebarPdf,
  'compact-ats':   CompactAtsPdf,
  'obsidian-edge': ObsidianEdgePdf,
};

export async function exportPdfReact({ personal, sections, customize, templateId }) {
  registerFonts();

  const PdfTemplate = PDF_TEMPLATES[templateId] ?? PDF_TEMPLATES['classic-clear'];

  const blob = await pdf(
    React.createElement(PdfTemplate, { personal, sections, customize })
  ).toBlob();

  const nameParts = [personal.firstName, personal.lastName].filter(Boolean);
  const fileName = nameParts.length ? `${nameParts.join('_')}_resume.pdf` : 'resume.pdf';

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
