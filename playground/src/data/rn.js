// React Native props each @shoutem/ui component forwards to its underlying RN element,
// plus the RN style-property catalogue used by the Style tab.
const b = (doc) => ({ type: 'bool', doc });
const s = (doc) => ({ type: 'string', doc });
const n = (doc, extra) => ({ type: 'number', doc, ...extra });
const e = (options, doc) => ({ type: 'enum', options, doc });
const j = (doc) => ({ type: 'json', doc });

const VIEW = {
  pointerEvents: e(['auto', 'none', 'box-none', 'box-only'], 'Whether the view can be the target of touch events'),
  hitSlop: j('Extends the touch area, e.g. {"top":10,"bottom":10,"left":10,"right":10}'),
  accessible: b('Marks the view as an accessibility element'),
  accessibilityLabel: s('Text read by screen readers'),
  accessibilityRole: e(['none', 'button', 'link', 'header', 'image', 'text', 'search', 'summary', 'adjustable'], 'Role announced by screen readers'),
  testID: s('Used to locate the view in end-to-end tests'),
  nativeID: s('Used to locate the view from native code'),
  collapsable: b('Android: allow the view to be removed from the native hierarchy'),
  removeClippedSubviews: b('Unmount offscreen children (performance)'),
};
const TEXT = {
  numberOfLines: n('Truncate text after this many lines (0 = no limit)', { min: 0, max: 10 }),
  ellipsizeMode: e(['head', 'middle', 'tail', 'clip'], 'Where the ellipsis goes when text is truncated'),
  selectable: b('Allow the user to select and copy the text'),
  allowFontScaling: b('Respect the OS text-size setting'),
  maxFontSizeMultiplier: n('Upper bound for OS font scaling', { min: 0, max: 4, step: 0.1 }),
  adjustsFontSizeToFit: b('iOS: shrink the font to fit the box'),
  minimumFontScale: n('iOS: smallest scale for adjustsFontSizeToFit', { min: 0, max: 1, step: 0.05 }),
  textBreakStrategy: e(['simple', 'highQuality', 'balanced'], 'Android line-breaking strategy'),
  accessibilityLabel: s('Text read by screen readers'),
  accessibilityRole: e(['text', 'header', 'link', 'button', 'none'], 'Role announced by screen readers'),
  testID: s('Test locator'),
};
const TOUCHABLE = {
  disabled: b('Disable all interactions'),
  activeOpacity: n('Opacity while pressed', { min: 0, max: 1, step: 0.05 }),
  delayPressIn: n('ms before onPressIn fires', { min: 0, max: 1000, step: 10 }),
  delayPressOut: n('ms before onPressOut fires', { min: 0, max: 1000, step: 10 }),
  delayLongPress: n('ms before onLongPress fires', { min: 0, max: 2000, step: 50 }),
  hitSlop: j('Extends the touch area, e.g. {"top":10,"bottom":10,"left":10,"right":10}'),
  accessibilityLabel: s('Text read by screen readers'),
  accessibilityRole: e(['button', 'link', 'none'], 'Role announced by screen readers'),
  testID: s('Test locator'),
};
const IMAGE = {
  resizeMode: e(['cover', 'contain', 'stretch', 'repeat', 'center'], 'How the image fits its box'),
  blurRadius: n('Blur applied to the image', { min: 0, max: 40 }),
  fadeDuration: n('Android: fade-in duration in ms', { min: 0, max: 1000, step: 50 }),
  progressiveRenderingEnabled: b('Android: progressive JPEG rendering'),
  tintColor: { type: 'color', doc: 'Recolors all non-transparent pixels' },
  accessibilityLabel: s('Text read by screen readers'),
  testID: s('Test locator'),
};
const TEXT_INPUT = {
  placeholder: s('Hint shown while empty'),
  placeholderTextColor: { type: 'color', doc: 'Color of the placeholder' },
  editable: b('Allow editing'),
  multiline: b('Allow multiple lines'),
  numberOfLines: n('Rows for multiline inputs', { min: 1, max: 10 }),
  maxLength: n('Maximum characters', { min: 0, max: 500 }),
  secureTextEntry: b('Obscure text (passwords)'),
  keyboardType: e(['default', 'email-address', 'numeric', 'phone-pad', 'number-pad', 'decimal-pad', 'url'], 'Keyboard layout'),
  autoCapitalize: e(['none', 'sentences', 'words', 'characters'], 'Automatic capitalization'),
  autoCorrect: b('Enable autocorrect'),
  autoFocus: b('Focus on mount'),
  returnKeyType: e(['done', 'go', 'next', 'search', 'send'], 'Return key label'),
  selectionColor: { type: 'color', doc: 'Highlight and cursor color' },
  textAlign: e(['left', 'center', 'right'], 'Text alignment'),
  textContentType: e(['none', 'emailAddress', 'password', 'name', 'telephoneNumber', 'oneTimeCode'], 'iOS autofill hint'),
  testID: s('Test locator'),
};
const SCROLL = {
  horizontal: b('Scroll horizontally'),
  bounces: b('iOS: bounce at the edges'),
  showsVerticalScrollIndicator: b('Show vertical scroll bar'),
  showsHorizontalScrollIndicator: b('Show horizontal scroll bar'),
  pagingEnabled: b('Snap to multiples of the view size'),
  scrollEnabled: b('Allow scrolling'),
  keyboardShouldPersistTaps: e(['never', 'always', 'handled'], 'Whether taps dismiss the keyboard'),
  keyboardDismissMode: e(['none', 'on-drag', 'interactive'], 'Dismiss keyboard on drag'),
  decelerationRate: e(['normal', 'fast'], 'Scroll deceleration'),
  contentContainerStyle: j('Style for the inner content container'),
  testID: s('Test locator'),
};
const FLATLIST = {
  ...SCROLL,
  initialNumToRender: n('Items rendered in the first batch', { min: 1, max: 50 }),
  numColumns: n('Grid columns (vertical lists only)', { min: 1, max: 4 }),
  inverted: b('Reverse the scroll direction'),
  ListHeaderComponentStyle: j('Style for the header wrapper'),
};
const SWITCH = {
  disabled: b('Disable toggling'),
  trackColor: j('{"false": color, "true": color}'),
  thumbColor: { type: 'color', doc: 'Knob color' },
  ios_backgroundColor: { type: 'color', doc: 'iOS: background when off' },
};
const SPINNER = {
  size: e(['small', 'large'], 'Indicator size'),
  color: { type: 'color', doc: 'Indicator color' },
  animating: b('Show and animate the indicator'),
  hidesWhenStopped: b('iOS: hide when not animating'),
};

export const RN_PROPS = { View: VIEW, Text: TEXT, Touchable: TOUCHABLE, TouchableOpacity: TOUCHABLE, Image: IMAGE, TextInput: TEXT_INPUT, ScrollView: SCROLL, FlatList: FLATLIST, Switch: SWITCH, ActivityIndicator: SPINNER };

// Which RN element each component forwards unknown props to (read from the component source).
export const BASE = {
  View: 'View', Row: 'View', Card: 'View', Tile: 'View', Overlay: 'View', Divider: 'View', Screen: 'View', FormGroup: 'View', GridRow: 'View', EmptyStateView: 'View', LinearGradient: 'View',
  Text: 'Text', Heading: 'Text', Title: 'Text', Subtitle: 'Text', Caption: 'Text',
  Button: 'TouchableOpacity', TouchableOpacity: 'TouchableOpacity', ShareButton: 'TouchableOpacity', Touchable: 'Touchable', TouchableNativeFeedback: 'Touchable',
  Image: 'Image', ImageBackground: 'Image',
  TextInput: 'TextInput', SearchField: 'TextInput',
  ScrollView: 'ScrollView', ListView: 'FlatList',
  Switch: 'Switch', Spinner: 'ActivityIndicator',
};

// RN style properties grouped for the Style tab's "add property" menu.
const C = 'color';
const N = 'number';
export const STYLE_PROPS = {
  Layout: {
    flex: N, flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'], flexWrap: ['wrap', 'nowrap'], flexGrow: N, flexShrink: N, flexBasis: N,
    alignItems: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'], alignSelf: ['auto', 'flex-start', 'center', 'flex-end', 'stretch'],
    justifyContent: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'], alignContent: ['flex-start', 'center', 'flex-end', 'stretch', 'space-between', 'space-around'],
    gap: N, rowGap: N, columnGap: N,
    width: N, height: N, minWidth: N, maxWidth: N, minHeight: N, maxHeight: N, aspectRatio: N,
    position: ['relative', 'absolute'], top: N, right: N, bottom: N, left: N, zIndex: N, overflow: ['visible', 'hidden', 'scroll'], display: ['flex', 'none'],
  },
  Spacing: {
    margin: N, marginTop: N, marginRight: N, marginBottom: N, marginLeft: N, marginHorizontal: N, marginVertical: N,
    padding: N, paddingTop: N, paddingRight: N, paddingBottom: N, paddingLeft: N, paddingHorizontal: N, paddingVertical: N,
  },
  Background: { backgroundColor: C, opacity: N },
  Border: {
    borderWidth: N, borderTopWidth: N, borderRightWidth: N, borderBottomWidth: N, borderLeftWidth: N,
    borderColor: C, borderTopColor: C, borderRightColor: C, borderBottomColor: C, borderLeftColor: C,
    borderRadius: N, borderTopLeftRadius: N, borderTopRightRadius: N, borderBottomLeftRadius: N, borderBottomRightRadius: N,
    borderStyle: ['solid', 'dotted', 'dashed'],
  },
  Shadow: { shadowColor: C, shadowOpacity: N, shadowRadius: N, shadowOffset: 'json', elevation: N },
  Text: {
    color: C, fontFamily: ['Rubik-Regular', 'Rubik-Light', 'Rubik-Medium', 'Rubik-Bold', 'Rubik-Italic', 'Rubik-BoldItalic'], fontSize: N,
    fontWeight: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'], fontStyle: ['normal', 'italic'],
    lineHeight: N, letterSpacing: N, textAlign: ['auto', 'left', 'right', 'center', 'justify'], textAlignVertical: ['auto', 'top', 'bottom', 'center'],
    textDecorationLine: ['none', 'underline', 'line-through', 'underline line-through'], textTransform: ['none', 'uppercase', 'lowercase', 'capitalize'],
    includeFontPadding: 'bool',
  },
  Image: { resizeMode: ['cover', 'contain', 'stretch', 'repeat', 'center'], tintColor: C },
  Transform: { transform: 'json' },
};

export const STYLE_TYPE = {};
Object.values(STYLE_PROPS).forEach(g => Object.entries(g).forEach(([k, t]) => { STYLE_TYPE[k] = t; }));
