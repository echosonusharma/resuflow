import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { registerFonts } from '../templates/pdf/shared/pdfFonts.js';

import ClassicClearPdf from '../templates/pdf/classic-clear.pdf.jsx';
import AtlanticBluePdf from '../templates/pdf/atlantic-blue.pdf.jsx';
import MercuryFlowPdf from '../templates/pdf/mercury-flow.pdf.jsx';
import IvoryProfessionalPdf from '../templates/pdf/ivory-professional.pdf.jsx';
import SlateSidebarPdf from '../templates/pdf/slate-sidebar.pdf.jsx';
import NordicMinimalPdf from '../templates/pdf/nordic-minimal.pdf.jsx';
import TimelineProPdf from '../templates/pdf/timeline-pro.pdf.jsx';
import BoldBannerPdf from '../templates/pdf/bold-banner.pdf.jsx';
import CompactAtsPdf from '../templates/pdf/compact-ats.pdf.jsx';
import DuoTonePdf from '../templates/pdf/duo-tone.pdf.jsx';

const PDF_TEMPLATES = {
  'classic-clear':       ClassicClearPdf,
  'atlantic-blue':       AtlanticBluePdf,
  'mercury-flow':        MercuryFlowPdf,
  'ivory-professional':  IvoryProfessionalPdf,
  'slate-sidebar':       SlateSidebarPdf,
  'nordic-minimal':      NordicMinimalPdf,
  'timeline-pro':        TimelineProPdf,
  'bold-banner':         BoldBannerPdf,
  'compact-ats':         CompactAtsPdf,
  'duo-tone':            DuoTonePdf,
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
