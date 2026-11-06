// Shared paths. The playground lives in <ui repo>/playground and reads mobile-qa as a sibling checkout
// (../mobile-qa next to the ui repo). Override with MOBILE_QA_DIR if yours is elsewhere.
import path from 'path';

export const PLAYGROUND = path.dirname(new URL(import.meta.url).pathname);
export const UI = path.resolve(PLAYGROUND, '..');
export const MOBILE_QA = process.env.MOBILE_QA_DIR || path.resolve(UI, '../mobile-qa');
export const EXTENSIONS = path.join(MOBILE_QA, 'extensions');
export const DATA = path.join(PLAYGROUND, 'src/data');
