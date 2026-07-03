import React, { useRef, useState, useEffect } from 'react';
import { Printer } from 'lucide-react';
import { useActiveTemplate } from '../../hooks/index.js';
import { usePersonal } from '../../hooks/index.js';
import { useSections } from '../../hooks/index.js';
import { PALETTES } from '../../templates/index.js';
import { getPageFormat } from '../../utils/exportPdf.js';
import { exportPdfReact } from '../../utils/exportPdfReact.js';

export default function PreviewPanel() {
  const { component: TemplateComponent, customize, templateId } = useActiveTemplate();
  const { personal } = usePersonal();
  const { sections } = useSections();
  const pageFormat = getPageFormat(customize);
  const sheetRef = useRef(null);
  const [pageCount, setPageCount] = useState(1);

  const pageH = pageFormat.previewHeight;

  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setPageCount(Math.max(1, Math.ceil(el.scrollHeight / pageH)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [pageH]);

  const cssVars = {
    '--cv-accent': PALETTES[customize.colors?.paletteIndex ?? 0]?.accent || '#1E3A5F',
    width: pageFormat.previewWidth,
    minHeight: pageH,
  };

  async function handlePrint() {
    try {
      await exportPdfReact({ personal, sections, customize, templateId });
    } catch (err) {
      console.error('Print failed', err);
    }
  }

  return (
    <div className="preview-panel">
      <div className="preview-panel-toolbar">
        <button className="btn-print-preview" onClick={handlePrint} title="Download as PDF">
          <Printer size={14} />
          Export PDF
        </button>
      </div>

      <div className="preview-scale-wrapper">
        <div
          id="resume-preview-content"
          className="preview-resume-sheet"
          style={cssVars}
          ref={sheetRef}
        >
          <TemplateComponent
            personal={personal}
            sections={sections}
            customize={customize}
          />
          {/* page-break dividers — visual only, don't affect layout */}
          {Array.from({ length: pageCount - 1 }, (_, i) => (
            <div
              key={i}
              className="preview-page-break"
              style={{ top: pageH * (i + 1) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
