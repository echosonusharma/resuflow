import React, { useRef, useState, useEffect } from 'react';
import { useActiveTemplate, usePersonal, useSections } from '../../hooks/index.js';
import { getPageFormat } from '../../utils/pageFormat.js';

const CONTINUATION_PAD = 32; // top breathing room for page 2+

function computePageSlices(measureEl, pageH) {
  const totalH = measureEl.scrollHeight;
  if (totalH === 0) return [{ start: 0, end: pageH }];

  const sections = [...measureEl.querySelectorAll('[data-preview-section]')];

  // Content budget per page: page 1 gets full pageH, continuation pages lose CONTINUATION_PAD
  function budget(isFirst) { return isFirst ? pageH : pageH - CONTINUATION_PAD; }

  if (!sections.length) {
    const slices = [];
    let s = 0;
    let first = true;
    while (s < totalH) {
      const b = budget(first);
      slices.push({ start: s, end: Math.min(s + b, totalH) });
      s += b;
      first = false;
    }
    return slices;
  }

  const containerTop = measureEl.getBoundingClientRect().top;
  const slices = [];
  let pageStart = 0;
  let first = true;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const sTop = Math.round(rect.top - containerTop);
    const sBot = Math.round(rect.bottom - containerTop);
    const b = budget(first);
    const pageEnd = pageStart + b;

    if (sTop >= pageEnd) {
      slices.push({ start: pageStart, end: pageEnd });
      pageStart += b;
      first = false;
      // Advance through any fully-skipped pages
      while (sTop >= pageStart + budget(false)) {
        const nb = budget(false);
        slices.push({ start: pageStart, end: pageStart + nb });
        pageStart += nb;
      }
    } else if (sBot > pageEnd && sTop > pageStart + 12) {
      // Break before heading
      slices.push({ start: pageStart, end: sTop });
      pageStart = sTop;
      first = false;
    }
  }

  // Fill remaining content
  let s = pageStart;
  let f = first;
  while (s < totalH) {
    const b = budget(f);
    slices.push({ start: s, end: Math.min(s + b, totalH) });
    s += b;
    f = false;
  }

  return slices.length ? slices : [{ start: 0, end: Math.min(pageH, totalH) }];
}

export default function PreviewPanel() {
  const { component: TemplateComponent, customize } = useActiveTemplate();
  const { personal } = usePersonal();
  const { sections } = useSections();
  const pageFormat = getPageFormat(customize);
  const measureRef = useRef(null);
  const [pageSlices, setPageSlices] = useState([{ start: 0, end: 0 }]);

  const pageW = pageFormat.previewWidth;
  const pageH = pageFormat.previewHeight;

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setPageSlices(computePageSlices(el, pageH));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [pageH]);

  const props = { personal, sections, customize };

  return (
    <div className="preview-panel">
      {/* Off-screen render for measurement and section positions */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{ position: 'fixed', left: '-9999px', top: 0, width: pageW, pointerEvents: 'none', visibility: 'hidden' }}
      >
        <TemplateComponent {...props} />
      </div>

      <div className="preview-pages">
        {pageSlices.map(({ start, end }, i) => {
          const clipH = end - start;
          const topPad = i > 0 ? 32 : 0;
          const contentH = Math.max(0, clipH - topPad);
          return (
            <div key={i} className="preview-page-wrap">
              <div
                id={i === 0 ? 'resume-preview-content' : undefined}
                className="preview-page-frame"
                style={{ width: pageW, height: pageH }}
              >
                {topPad > 0 && <div style={{ height: topPad }} />}
                {/* Inner wrapper clips exactly to this page's content slice */}
                <div style={{ position: 'relative', height: contentH, overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0,
                    transform: `translateY(-${start}px)`,
                    width: pageW,
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                  }}>
                    <TemplateComponent {...props} />
                  </div>
                </div>
              </div>
              {pageSlices.length > 1 && (
                <div className="preview-page-label">Page {i + 1} of {pageSlices.length}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
