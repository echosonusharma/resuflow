import { Font } from '@react-pdf/renderer';

// Local font files via Vite ?url imports — no CDN dependency
import LatoR   from '@fontsource/lato/files/lato-latin-400-normal.woff?url';
import LatoB   from '@fontsource/lato/files/lato-latin-700-normal.woff?url';
import LatoI   from '@fontsource/lato/files/lato-latin-400-italic.woff?url';
import LatoBI  from '@fontsource/lato/files/lato-latin-700-italic.woff?url';

import InterR  from '@fontsource/inter/files/inter-latin-400-normal.woff?url';
import InterB  from '@fontsource/inter/files/inter-latin-700-normal.woff?url';

import MontR   from '@fontsource/montserrat/files/montserrat-latin-400-normal.woff?url';
import MontB   from '@fontsource/montserrat/files/montserrat-latin-700-normal.woff?url';
import MontI   from '@fontsource/montserrat/files/montserrat-latin-400-italic.woff?url';

import LoraR   from '@fontsource/lora/files/lora-latin-400-normal.woff?url';
import LoraB   from '@fontsource/lora/files/lora-latin-700-normal.woff?url';
import LoraI   from '@fontsource/lora/files/lora-latin-400-italic.woff?url';

import SS3R    from '@fontsource/source-sans-3/files/source-sans-3-latin-400-normal.woff?url';
import SS3B    from '@fontsource/source-sans-3/files/source-sans-3-latin-700-normal.woff?url';
import SS3I    from '@fontsource/source-sans-3/files/source-sans-3-latin-400-italic.woff?url';

import RalR    from '@fontsource/raleway/files/raleway-latin-400-normal.woff?url';
import RalB    from '@fontsource/raleway/files/raleway-latin-700-normal.woff?url';
import RalI    from '@fontsource/raleway/files/raleway-latin-400-italic.woff?url';

import OsanR   from '@fontsource/open-sans/files/open-sans-latin-400-normal.woff?url';
import OsanB   from '@fontsource/open-sans/files/open-sans-latin-700-normal.woff?url';

import PlayR   from '@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff?url';
import PlayB   from '@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff?url';
import PlayI   from '@fontsource/playfair-display/files/playfair-display-latin-400-italic.woff?url';
import PlayBI  from '@fontsource/playfair-display/files/playfair-display-latin-700-italic.woff?url';

import MerrR   from '@fontsource/merriweather/files/merriweather-latin-400-normal.woff?url';
import MerrB   from '@fontsource/merriweather/files/merriweather-latin-700-normal.woff?url';
import MerrI   from '@fontsource/merriweather/files/merriweather-latin-400-italic.woff?url';

const GENERIC_MAP = {
  serif: 'Times-Roman',
  'sans-serif': 'Helvetica',
  monospace: 'Courier',
};

export function parseFontFamily(cssFontStack) {
  if (!cssFontStack) return 'Helvetica';
  const first = cssFontStack.split(',')[0].trim().replace(/['"]/g, '');
  return GENERIC_MAP[first] || first;
}

export function registerFonts() {
  // Disable word hyphenation — names/titles must never break as "Shar-ma".
  // Overflowing words wrap whole instead.
  Font.registerHyphenationCallback(word => [word]);

  // Check against live FontStore — guards against HMR resetting the store
  // while the module-level flag survives in the old module instance.
  if (Font.getRegisteredFontFamilies().includes('Lato')) return;

  Font.register({ family: 'Lato', fonts: [
    { src: LatoR,  fontWeight: 400, fontStyle: 'normal' },
    { src: LatoB,  fontWeight: 700, fontStyle: 'normal' },
    { src: LatoI,  fontWeight: 400, fontStyle: 'italic' },
    { src: LatoBI, fontWeight: 700, fontStyle: 'italic' },
  ]});

  Font.register({ family: 'Inter', fonts: [
    { src: InterR, fontWeight: 400, fontStyle: 'normal' },
    { src: InterB, fontWeight: 700, fontStyle: 'normal' },
  ]});

  Font.register({ family: 'Montserrat', fonts: [
    { src: MontR, fontWeight: 400, fontStyle: 'normal' },
    { src: MontB, fontWeight: 700, fontStyle: 'normal' },
    { src: MontI, fontWeight: 400, fontStyle: 'italic' },
  ]});

  Font.register({ family: 'Lora', fonts: [
    { src: LoraR, fontWeight: 400, fontStyle: 'normal' },
    { src: LoraB, fontWeight: 700, fontStyle: 'normal' },
    { src: LoraI, fontWeight: 400, fontStyle: 'italic' },
  ]});

  Font.register({ family: 'Source Sans 3', fonts: [
    { src: SS3R, fontWeight: 400, fontStyle: 'normal' },
    { src: SS3B, fontWeight: 700, fontStyle: 'normal' },
    { src: SS3I, fontWeight: 400, fontStyle: 'italic' },
  ]});

  Font.register({ family: 'Raleway', fonts: [
    { src: RalR, fontWeight: 400, fontStyle: 'normal' },
    { src: RalB, fontWeight: 700, fontStyle: 'normal' },
    { src: RalI, fontWeight: 400, fontStyle: 'italic' },
  ]});

  Font.register({ family: 'Open Sans', fonts: [
    { src: OsanR, fontWeight: 400, fontStyle: 'normal' },
    { src: OsanB, fontWeight: 700, fontStyle: 'normal' },
  ]});

  Font.register({ family: 'Playfair Display', fonts: [
    { src: PlayR,  fontWeight: 400, fontStyle: 'normal' },
    { src: PlayB,  fontWeight: 700, fontStyle: 'normal' },
    { src: PlayI,  fontWeight: 400, fontStyle: 'italic' },
    { src: PlayBI, fontWeight: 700, fontStyle: 'italic' },
  ]});

  Font.register({ family: 'Merriweather', fonts: [
    { src: MerrR, fontWeight: 400, fontStyle: 'normal' },
    { src: MerrB, fontWeight: 700, fontStyle: 'normal' },
    { src: MerrI, fontWeight: 400, fontStyle: 'italic' },
  ]});
}
