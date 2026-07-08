import { useRef, useState, useLayoutEffect, type ComponentType } from 'react';
import { resolveCustomize } from '../templates/index';

const SHEET_W = 794;
const SHEET_H = 1122;

import type { Customize, PersonalInfo, Section, TemplateMeta, TemplateProps } from '../types';

interface TemplatePreviewProps {
  meta: TemplateMeta;
  component: ComponentType<TemplateProps>;
  personal: PersonalInfo;
  sections: Section[];
  customize?: Customize;
  mode?: 'card' | 'scroll';
}

export default function TemplatePreview({
  meta,
  component: Comp,
  personal,
  sections,
  customize: customizeOverride,
  mode = 'card',
}: TemplatePreviewProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  const [innerH, setInnerH] = useState(SHEET_H);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setScale(el.clientWidth / SHEET_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (mode !== 'scroll') return;
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setInnerH(el.scrollHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode]);

  const customize = resolveCustomize(meta, customizeOverride || {});
  const sheetHeight = mode === 'scroll' ? Math.max(innerH, SHEET_H) : SHEET_H;
  const frameHeight = mode === 'scroll' ? sheetHeight * scale : undefined;

  return (
    <div
      className={`tpl-preview-frame ${mode === 'scroll' ? 'tpl-preview-frame--scroll' : ''}`}
      ref={wrapRef}
      style={frameHeight ? { height: frameHeight } : undefined}
    >
      <div
        className="tpl-preview-sheet"
        ref={innerRef}
        style={{
          width: SHEET_W,
          height: sheetHeight,
          transform: `scale(${scale})`,
        }}
      >
        <Comp personal={personal} sections={sections} customize={customize} />
      </div>
    </div>
  );
}

export { SHEET_W, SHEET_H };
