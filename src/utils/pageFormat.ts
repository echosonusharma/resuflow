import type { Customize } from '../types';

export interface PageFormatSize {
  previewWidth: number;
  previewHeight: number;
}

const A4: PageFormatSize = { previewWidth: 794, previewHeight: 1122 };

const PAGE_FORMATS: Record<string, PageFormatSize> = {
  A4,
  Letter: { previewWidth: 816, previewHeight: 1056 },
  A5: { previewWidth: 559, previewHeight: 794 },
};

export function getPageFormat(customize?: Customize): PageFormatSize {
  const key = customize?.document?.pageFormat;
  return (key && PAGE_FORMATS[key]) || A4;
}
