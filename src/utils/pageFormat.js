const PAGE_FORMATS = {
  A4: { previewWidth: 794, previewHeight: 1122 },
  Letter: { previewWidth: 816, previewHeight: 1056 },
  A5: { previewWidth: 559, previewHeight: 794 },
};

export function getPageFormat(customize) {
  return PAGE_FORMATS[customize?.document?.pageFormat] || PAGE_FORMATS.A4;
}
