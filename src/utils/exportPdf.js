import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PAGE_FORMATS = {
  A4: { jspdf: 'a4', previewWidth: 794, previewHeight: 1122 },
  Letter: { jspdf: 'letter', previewWidth: 816, previewHeight: 1056 },
  A5: { jspdf: 'a5', previewWidth: 559, previewHeight: 794 },
};

export function getPageFormat(customize) {
  return PAGE_FORMATS[customize?.document?.pageFormat] || PAGE_FORMATS.A4;
}

export async function exportPdf({ personal, customize }) {
  const el = document.getElementById('resume-preview-content');
  if (!el) return;

  const fmt = getPageFormat(customize);
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: fmt.jspdf });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const pxPerMm = canvas.width / pageW;
  const pageHpx = Math.floor(pageH * pxPerMm);
  const pageCount = Math.max(1, Math.ceil(canvas.height / pageHpx));

  const footer = customize?.footer || {};
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || 'Resume';
  const footerText =
    footer.text === 'name' ? fullName
    : footer.text === 'email' ? (personal.email || '')
    : footer.text === 'custom' ? (footer.customText || '')
    : '';

  for (let page = 0; page < pageCount; page++) {
    if (page > 0) pdf.addPage();
    const sliceH = Math.min(pageHpx, canvas.height - page * pageHpx);
    const slice = document.createElement('canvas');
    slice.width = canvas.width;
    slice.height = sliceH;
    slice.getContext('2d').drawImage(
      canvas, 0, page * pageHpx, canvas.width, sliceH,
      0, 0, canvas.width, sliceH
    );
    pdf.addImage(slice.toDataURL('image/png'), 'PNG', 0, 0, pageW, sliceH / pxPerMm);

    if (footerText || footer.pageNumbers) {
      pdf.setFontSize(8);
      pdf.setTextColor(120);
      if (footerText) pdf.text(footerText, pageW / 2, pageH - 5, { align: 'center' });
      if (footer.pageNumbers) pdf.text(`Page ${page + 1} of ${pageCount}`, pageW - 10, pageH - 5, { align: 'right' });
    }
  }

  pdf.save(`${fullName}-Resume.pdf`);
}
