import React, { useRef, useState, useEffect } from 'react';
import { useActiveTemplate } from '../../hooks/index.js';
import { usePersonal } from '../../hooks/index.js';
import { useSections } from '../../hooks/index.js';
import { getPageFormat } from '../../utils/pageFormat.js';

export default function PreviewPanel() {
  const { component: TemplateComponent, customize } = useActiveTemplate();
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

  const sheetStyle = {
    width: pageFormat.previewWidth,
    minHeight: pageH,
  };

  return (
    <div className="preview-panel">
      <div className="preview-scale-wrapper">
        <div
          id="resume-preview-content"
          className="preview-resume-sheet"
          style={sheetStyle}
          ref={sheetRef}
        >
          <TemplateComponent
            personal={personal}
            sections={sections}
            customize={customize}
          />
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
