import {
  Dimensions,
  StyleSheet,
  NavigationExperimental,
} from 'react-native';

import { INCLUDE, createVariations, createSharedStyle } from '@shoutem/theme';

const window = Dimensions.get('window');

const GALLERY_DOT_SIZE = 8;

const Colors = {
  DARK: '#333333',
  DARKER: '#222222',
  LIGHT_GRAY: '#f2f2f2',
  LIGHT: '#ffffff',
  BACKGROUND: '#ffffff',
  SCREEN_BACKGROUND: '#f2f2f2',
  SHADOW: '#000000',
  CLEAR: 'rgba(0, 0, 0, 0)',
  OVERLAY: 'rgba(0, 0, 0, 0.2)',
  OVERLAY_DARK: 'rgba(0, 0, 0, 0.4)',
  BUTTON_UNDERLAY: '#cccccc',
  BORDER: '#cccccc',
  SPINNER: '#cccccc',
  DIVIDER_LINE: '#eeeeee',
  DIVIDER_BORDER: 'rgba(51, 51, 51, 0.1)',
  NAVIGATION_TINT: '#333333',
  NAVIGATION_BAR_BACKGROUND: '#ffffff',
  NAVIGATION_BAR_BORDER: 'rgba(20, 20, 20, 0.2)',
  NAVIGATION_BAR_TEXT: 'black',
  IMAGE_PREVIEW_BACKGROUND: '#000000',

  TEXT: '#666666',
  TITLE: '#222222',
  CAPTION: '#555555',

  INPUT_PLACEHOLDER: '#a7a7a7',
};

const SMALL_GUTTER = 5;
const MEDIUM_GUTTER = 15;
const LARGE_GUTTER = 30;
const EXTRA_LARGE_GUTTER = 45;

const NAVIGATION_BAR_HEIGHT = NavigationExperimental.Header.HEIGHT;
const RICH_MEDIA_IMAGE_HEIGHT = 200;
const RICH_MEDIA_VIDEO_HEIGHT = 200;

const sizeVariants = ['', 'left', 'right', 'top', 'bottom', 'horizontal', 'vertical'];
const textComponents = [
  'shoutem.ui.Heading',
  'shoutem.ui.Title',
  'shoutem.ui.Subtitle',
  'shoutem.ui.Text',
  'shoutem.ui.Caption',
];

export default () => ({
  //
  // Common
  //
  guttersPadding: {
    ...createVariations('.sm-gutter', sizeVariants, 'padding', SMALL_GUTTER),
    ...createVariations('.md-gutter', sizeVariants, 'padding', MEDIUM_GUTTER),
    ...createVariations('.lg-gutter', sizeVariants, 'padding', LARGE_GUTTER),
    ...createVariations('.xl-gutter', sizeVariants, 'padding', EXTRA_LARGE_GUTTER),
  },

  guttersMargin: {
    ...createVariations('.sm-gutter', sizeVariants, 'margin', SMALL_GUTTER),
    ...createVariations('.md-gutter', sizeVariants, 'margin', MEDIUM_GUTTER),
    ...createVariations('.lg-gutter', sizeVariants, 'margin', LARGE_GUTTER),
    ...createVariations('.xl-gutter', sizeVariants, 'margin', EXTRA_LARGE_GUTTER),
  },

  commonVariants: {
    '.rounded-corners': {
      borderRadius: 2,
      borderWidth: 0,
      borderColor: 'rgba(0, 0, 0, 0)',
    },

    '.flexible': {
      flex: 1,
    },

    '.inflexible': {
      flex: 0,
    },

    '.collapsible': {
      flex: -1,
    },

    '.stretch': {
      alignSelf: 'stretch',
    },
  },

  fillParent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  //
  // Text
  //
  defaultFont: {
    fontFamily: 'Rubik-Regular',
  },

  boldTextStyle: {
    fontWeight: '500',
  },

  italicTextStyle: {
    fontStyle: 'italic',
  },

  codeTextStyle: {
    fontFamily: 'Menlo',
  },

  multilineTextStyle: {
    '.v-center': {
      // Compensate for lineHeight, because
      // textAlignVertical is not supported on iOS
      marginTop: -4,
      marginBottom: 4,
    },

    lineHeight: 26,
  },

  'shoutem.ui.Text': {
    [INCLUDE]: ['commonVariants', 'defaultFont', 'guttersMargin'],

    '.line-through': {
      textDecorationLine: 'line-through',
    },

    '.h-center': {
      textAlign: 'center',
    },

    '.bright': {
      color: Colors.LIGHT,
    },

    '.bold': {
      [INCLUDE]: ['boldTextStyle'],
    },

    '.multiline': {
      [INCLUDE]: ['multilineTextStyle'],
    },

    backgroundColor: Colors.CLEAR,
    color: Colors.TEXT,
    fontSize: 15,
  },

  'shoutem.ui.Heading': {
    [INCLUDE]: ['shoutem.ui.Text'],

    color: Colors.TITLE,
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: 1,
  },

  'shoutem.ui.Title': {
    [INCLUDE]: ['shoutem.ui.Text'],

    color: Colors.TITLE,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 1,
  },

  'shoutem.ui.Subtitle': {
    [INCLUDE]: ['shoutem.ui.Text'],

    color: Colors.TITLE,
    lineHeight: 18,
  },

  'shoutem.ui.Caption': {
    [INCLUDE]: ['shoutem.ui.Text'],

    color: Colors.CAPTION,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },

  //
  // Images
  //
  imageSizes: {
    '.small-avatar': {
      width: 25,
      height: 25,
      borderRadius: 12.5,
      borderWidth: 0,
      resizeMode: 'cover',
    },

    '.small': {
      width: 65,
      height: 65,
    },

    '.medium-avatar': {
      width: 145,
      height: 145,
      borderRadius: 72.5,
      borderWidth: 0,
      resizeMode: 'cover',
    },

    '.medium': {
      width: 145,
      height: 92,
    },

    '.medium-wide': {
      width: (180 / 375) * window.width,
      height: 85,
    },

    '.medium-square': {
      width: 145,
      height: 145,
    },

    // NOTE: Image resizing doesn't work correctly if both
    // dimensions are not explicitly defined, so we can't
    // use flex: 1, or alignSelf: 'stretch' here...
    '.featured': {
      width: (365 / 375) * window.width,
      height: (345 / 375) * window.width,
    },

    '.large': {
      width: window.width,
      height: (280 / 375) * window.width,
    },

    '.large-portrait': {
      width: window.width,
      height: (518 / 375) * window.width,
    },

    '.large-banner': {
      width: window.width,
      height: (200 / 375) * window.width,
    },

    '.large-square': {
      width: window.width,
      height: window.width,
    },

    '.large-wide': {
      width: window.width,
      height: (238 / 375) * window.width,
    },

    '.large-ultra-wide': {
      width: window.width,
      height: (130 / 375) * window.width,
    },

    '.preview': {
      flex: 1,
      backgroundColor: 'transparent',
      resizeMode: 'contain',
    },
  },
  'shoutem.ui.Image': {
    [INCLUDE]: ['commonVariants', 'imageSizes'],

    'shoutem.ui.Tile': {
      [INCLUDE]: ['textCentricTile', 'fillParent'],
      'shoutem.ui.View': {
        '.actions': {
          'shoutem.ui.Button': {
            'shoutem.ui.Icon': {
              color: Colors.LIGHT,
            },
          },
        },
      },

      ...createSharedStyle(textComponents, {
        color: Colors.LIGHT,
      }),

      backgroundColor: Colors.OVERLAY,
    },

    heroAnimation(driver, { layout }) {
      return {
        transform: [
          {
            scale: driver.value.interpolate({
              inputRange: [-0.9 * layout.height, 0],
              outputRange: [3, 1],
              extrapolateRight: 'clamp',
            }),
          }, {
            translateY: driver.value.interpolate({
              inputRange: [-100, 100],
              outputRange: [-50, 50],
              extrapolateLeft: 'clamp',
            }),
          },
        ],
      };
    },

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'cover',
    backgroundColor: Colors.BACKGROUND,
  },

  //
  // Containers
  //
  'shoutem.ui.View': {
    [INCLUDE]: ['commonVariants', 'guttersPadding'],

    '.horizontal': {
      '.h-center': {
        justifyContent: 'center',
      },

      '.h-start': {
        justifyContent: 'flex-start',
      },

      '.h-end': {
        justifyContent: 'flex-end',
      },

      '.v-center': {
        alignItems: 'center',
      },

      '.v-start': {
        alignItems: 'flex-start',
      },

      '.v-end': {
        alignItems: 'flex-end',
      },

      flexDirection: 'row',
      alignItems: 'flex-end',
    },

    '.vertical': {
      '.h-center': {
        alignItems: 'center',
      },

      '.h-start': {
        alignItems: 'flex-start',
      },

      '.h-end': {
        alignItems: 'flex-end',
      },

      '.v-center': {
        justifyContent: 'center',
      },

      '.v-start': {
        justifyContent: 'flex-start',
      },

      '.v-end': {
        justifyContent: 'flex-end',
      },

      flexDirection: 'column',
    },

    '.fill-parent': {
      [INCLUDE]: ['fillParent'],
    },

    '.overlay': {
      backgroundColor: Colors.OVERLAY,
    },

    '.wrap': {
      flexWrap: 'wrap',
    },

    '.space-between': {
      justifyContent: 'space-between',
    },
  },

  'shoutem.ui.Screen': {
    '.full-screen': {
      marginTop: -NAVIGATION_BAR_HEIGHT,
    },

    '.paper': {
      backgroundColor: Colors.LIGHT,
    },

    backgroundColor: Colors.SCREEN_BACKGROUND,
    flex: 1,
  },

  'shoutem.ui.Row': {
    ...createSharedStyle(textComponents, { flex: 1 }),

    'shoutem.ui.Image': {
      marginRight: MEDIUM_GUTTER,
    },

    'shoutem.ui.Icon': {
      '.disclosure': {
        opacity: 0.5,
        marginRight: -7,
        marginLeft: 4,
      },

      marginRight: MEDIUM_GUTTER,
    },

    'shoutem.ui.Button': {
      '.right-icon': {
        [INCLUDE]: ['tightButton', 'clearButton'],
        marginLeft: MEDIUM_GUTTER,
      },
    },

    'shoutem.ui.View': {
      '.notification-dot': {
        alignSelf: 'center',
        flex: 0,
        width: 6,
        height: 6,
        borderRadius: 3,
        borderColor: Colors.DARK,
        backgroundColor: Colors.DARK,
        marginLeft: -10,
        marginRight: 4,
      },

      '.vertical': {
        '*': {
          // Add a small gutter below each view
          marginBottom: SMALL_GUTTER,
        },

        // Compensate for the last view
        marginBottom: -SMALL_GUTTER,
      },

      flex: 1,
    },

    '*.top': {
      alignSelf: 'flex-start',
    },

    '.small': {
      height: 65,
      paddingVertical: 0,
    },

    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.BACKGROUND,
    paddingHorizontal: MEDIUM_GUTTER,
    paddingVertical: MEDIUM_GUTTER,
  },

  textCentricTile: {
    'shoutem.ui.View': {
      '.actions': {
        position: 'absolute',
        top: MEDIUM_GUTTER,
        right: MEDIUM_GUTTER,
      },
    },

    '*': {
      marginBottom: SMALL_GUTTER,
    },

    ...createSharedStyle(textComponents, {
      textAlign: 'center',
    }),

    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingTop: EXTRA_LARGE_GUTTER,
    paddingBottom: EXTRA_LARGE_GUTTER - SMALL_GUTTER,
  },

  'shoutem.ui.Tile': {
    [INCLUDE]: ['commonVariants', 'guttersPadding'],

    'shoutem.ui.View': {
      '.content': {
        '*': {
          marginBottom: MEDIUM_GUTTER - SMALL_GUTTER,
        },

        alignSelf: 'stretch',
        paddingTop: MEDIUM_GUTTER,
        paddingBottom: SMALL_GUTTER,
        paddingHorizontal: MEDIUM_GUTTER,
      },
    },

    '.clear': {
      backgroundColor: Colors.CLEAR,
    },

    '.small': {
      'shoutem.ui.View': {
        '.content': {
          '*': {
            marginBottom: SMALL_GUTTER,
          },

          alignSelf: 'stretch',
          paddingTop: MEDIUM_GUTTER,
          paddingBottom: 0,
          paddingHorizontal: 0,
          marginBottom: -SMALL_GUTTER,
        },
      },

      width: 145,
    },

    '.text-centric': {
      [INCLUDE]: ['textCentricTile'],
    },

    heroAnimation(driver, { layout }) {
      return {
        opacity: driver.value.interpolate({
          inputRange: [-0.2 * layout.height, 0, layout.height],
          outputRange: [0, 1, 0],
        }),
        transform: [
          {
            translateY: driver.value.interpolate({
              inputRange: [-100, 100],
              outputRange: [20, -20],
            }),
          },
        ],
      };
    },

    flex: -1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: Colors.BACKGROUND,
  },

  'shoutem.ui.Card': {
    [INCLUDE]: ['commonVariants'],

    'shoutem.ui.View.content': {
      'shoutem.ui.Subtitle': {
        marginBottom: MEDIUM_GUTTER,
      },

      flex: 1,
      alignSelf: 'stretch',
      padding: 10,
    },

    width: (180 / 375) * window.width,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 2,
    shadowColor: Colors.SHADOW,
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
  },

  'shoutem.ui.Overlay': {
    [INCLUDE]: ['guttersPadding'],

    '.solid-bright': {
      ...createSharedStyle([...textComponents, 'shoutem.ui.Icon'], {
        color: Colors.DARKER,
      }),

      backgroundColor: Colors.BACKGROUND,
    },

    '.solid-dark': {
      backgroundColor: Colors.DARKER,
    },

    '.rounded-small': {
      width: 38,
      height: 38,
      borderRadius: 19,
      padding: 0,
    },

    '.fill-parent': {
      [INCLUDE]: ['fillParent'],
    },

    ...createSharedStyle(textComponents, {
      color: Colors.LIGHT,
      textAlign: 'center',
    }),

    'shoutem.ui.Icon': {
      color: Colors.LIGHT,
    },

    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2 * SMALL_GUTTER,
    paddingBottom: 2 * SMALL_GUTTER,
    paddingHorizontal: MEDIUM_GUTTER,
    backgroundColor: Colors.OVERLAY_DARK,
  },

  //
  // Buttons
  //
  'shoutem.ui.TouchableOpacity': {
    activeOpacity: 0.8,
  },

  tightButton: {
    'shoutem.ui.Icon': {
      marginRight: 0,
    },

    'shoutem.ui.Text': {
      marginRight: 0,
    },

    paddingLeft: 0,
    paddingRight: 0,
  },

  clearButton: {
    backgroundColor: Colors.CLEAR,
    borderWidth: 0,
    borderRadius: 0,
  },

  actionButton: {
    'shoutem.ui.Text': {
      [INCLUDE]: ['defaultFont'],
      fontSize: 15,
    },
  },
  'shoutem.ui.Button': {
    [INCLUDE]: ['commonVariants', 'guttersMargin'],

    '.tight': {
      [INCLUDE]: ['tightButton'],
    },

    '.clear': {
      [INCLUDE]: ['clearButton'],
    },

    '.dark': {
      'shoutem.ui.Icon': {
        color: Colors.LIGHT,
      },

      'shoutem.ui.Text': {
        color: Colors.LIGHT,
      },

      backgroundColor: Colors.DARKER,
      borderColor: Colors.DARKER,
    },

    '.muted': {
      'shoutem.ui.Icon': {
        opacity: 0.5,
      },

      'shoutem.ui.Text': {
        opacity: 0.5,
      },
    },

    '.action': {
      [INCLUDE]: ['actionButton'],
    },

    // Buttons at the bottom of dialogs, widgets, etc.,
    // usually Cancel/Confirm, No/Yes, etc.
    '.confirmation': {
      // Show the border around light buttons
      borderColor: Colors.BORDER,

      // Medium gutter on both sides, 25 between buttons
      flex: 1,
      marginHorizontal: MEDIUM_GUTTER,
    },

    '.full-width': {
      'shoutem.ui.Icon': {
        fontSize: 16,
      },

      flex: 1,
      alignSelf: 'stretch',
      borderRadius: 0,
      borderWidth: 0,
      height: 55,
    },

    '.border': {
      borderColor: Colors.BORDER,
    },

    // Vertically stacked icon and text
    '.stacked': {
      'shoutem.ui.Icon': {
        marginVertical: MEDIUM_GUTTER,
        marginRight: 0,
      },

      'shoutem.ui.Text': {
        textAlign: 'center',
        marginVertical: 0,
        marginRight: 0,
      },

      width: 125,
      height: 82,
      flexDirection: 'column',
    },

    'shoutem.ui.Text': {
      fontFamily: 'Rubik-Medium',
      fontSize: 12,
      color: Colors.DARKER,
      letterSpacing: 1,
      lineHeight: null,
      marginVertical: 12,
      marginRight: 10,
    },

    'shoutem.ui.Icon': {
      color: Colors.DARKER,
      fontSize: 24,
      marginRight: 10,
    },

    underlayColor: Colors.BUTTON_UNDERLAY,

    backgroundColor: Colors.BACKGROUND,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.BACKGROUND,
    paddingLeft: MEDIUM_GUTTER,
    paddingRight: SMALL_GUTTER,
  },

  //
  // Media
  //
  'shoutem.ui.Icon': {
    '.bright': {
      color: Colors.LIGHT,
    },

    '.dark': {
      color: Colors.DARKER,
    },

    '.scroll-indicator': {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: MEDIUM_GUTTER,
      color: Colors.LIGHT,
    },

    backgroundColor: Colors.CLEAR,
    color: Colors.DARKER,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 24,
  },

  'shoutem.ui.RichMedia': {
    b: {
      [INCLUDE]: ['boldTextStyle'],
    },
    strong: {
      [INCLUDE]: ['boldTextStyle'],
    },
    i: {
      [INCLUDE]: ['italicTextStyle'],
    },
    em: {
      [INCLUDE]: ['italicTextStyle'],
    },
    pre: {
      [INCLUDE]: ['codeTextStyle'],
    },
    code: {
      [INCLUDE]: ['codeTextStyle'],
    },
    a: {
      fontWeight: '500',
      color: 'blue',
    },
    h1: {
      color: '#000',
      fontSize: 28,
    },
    h2: {
      color: '#000',
      fontSize: 24,
    },
    h3: {
      fontWeight: '900',
      color: '#000',
      fontSize: 18,
    },
    h4: {
      fontWeight: '700',
      color: '#000',
      fontSize: 16,
    },
    h5: {
      fontWeight: '500',
      color: '#000',
      fontSize: 14,
    },
    video: {
      height: RICH_MEDIA_VIDEO_HEIGHT,
    },
    img: {
      height: RICH_MEDIA_IMAGE_HEIGHT,
    },
    p: {
      [INCLUDE]: ['shoutem.ui.Text'],
    },
    div: {
      [INCLUDE]: ['shoutem.ui.Text'],
    },
    container: {
      margin: MEDIUM_GUTTER,
    },
  },

  'shoutem.ui.Spinner': {
    [INCLUDE]: ['guttersMargin'],
    color: Colors.SPINNER,
  },

  //
  // Collections
  //
  'shoutem.ui.ListView': {
    'shoutem.ui.Divider': {
      [INCLUDE]: ['sectionHeaderDivider'],

      backgroundColor: Colors.LIGHT,
      borderTopWidth: 0,
    },

    listContent: {
      paddingBottom: SMALL_GUTTER,
    },

    refreshControl: {
      tintColor: Colors.SPINNER,
    },

    loadMoreSpinner: {
      paddingVertical: 25,
    },
  },

  'shoutem.ui.GridRow': {
    '*': {
      flex: 1,
      alignSelf: 'stretch',
      marginLeft: SMALL_GUTTER,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 0,
    },

    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingRight: SMALL_GUTTER,
    paddingTop: SMALL_GUTTER,
    backgroundColor: Colors.BACKGROUND,
  },

  //
  // Other
  //
  hoverNavigationBar: {
    navigationHeader: {
      paddingTop: 0,
    },
  },
  clearNavigationBar: {
    ...createSharedStyle([...textComponents, 'shoutem.ui.Icon'], {
      color: Colors.LIGHT,
    }),
    'shoutem.ui.Title': {
      color: Colors.CLEAR,
    },
    'shoutem.ui.Button': {
      [INCLUDE]: ['clearButton'],
      'shoutem.ui.Icon': {
        color: Colors.LIGHT,
      },
      'shoutem.ui.Text': {
        color: Colors.LIGHT,
      },
    },
    container: {
      backgroundColor: 'transparent',
      borderBottomColor: 'transparent',
    },
  },
  navigationBarTextAnimations: {
    solidifyAnimation(driver) {
      return {
        color: driver.value.interpolate({
          inputRange: [250, 300],
          outputRange: [Colors.LIGHT, Colors.NAVIGATION_BAR_TEXT],
          extrapolate: 'clamp',
        }),
      };
    },
  },
  'shoutem.ui.NavigationBar': {
    '.clear': {
      [INCLUDE]: ['clearNavigationBar'],
    },

    '.no-border': {
      container: {
        borderBottomWidth: 0,
      },
    },

    '.inline': {
      container: {
        width: window.width,
        position: 'relative',
      },
    },

    'shoutem.ui.Title': {
      solidifyAnimation(driver) {
        return {
          color: driver.value.interpolate({
            inputRange: [250, 300],
            outputRange: [Colors.CLEAR, Colors.NAVIGATION_BAR_TEXT],
            extrapolate: 'clamp',
          }),
        };
      },
      fontSize: 15,
      lineHeight: 18,
    },

    'shoutem.ui.Icon': {
      [INCLUDE]: ['navigationBarTextAnimations'],
      color: Colors.NAVIGATION_BAR_TEXT,
      fontSize: 24,
    },

    'shoutem.ui.Text': {
      [INCLUDE]: ['navigationBarTextAnimations'],
      color: Colors.NAVIGATION_BAR_TEXT,
      fontSize: 15,
    },

    'shoutem.ui.Button': {
      [INCLUDE]: ['clearButton', 'tightButton', 'actionButton'],
      'shoutem.ui.Icon': {
        [INCLUDE]: ['navigationBarTextAnimations'],
        marginVertical: 9,
      },
      'shoutem.ui.Text': {
        [INCLUDE]: ['navigationBarTextAnimations'],
      },
    },

    solidifyAnimation(driver) {
      return {
        container: {
          backgroundColor: driver.value.interpolate({
            inputRange: [250, 300],
            outputRange: [Colors.CLEAR, Colors.BACKGROUND],
            extrapolate: 'clamp',
          }),
          borderBottomColor: driver.value.interpolate({
            inputRange: [250, 300],
            outputRange: [Colors.CLEAR, Colors.NAVIGATION_BAR_BORDER],
            extrapolate: 'clamp',
          }),
        },
      };
    },

    container: {
      [INCLUDE]: ['fillParent'],
      height: 70,
      backgroundColor: Colors.NAVIGATION_BAR_BACKGROUND,
      borderBottomColor: Colors.NAVIGATION_BAR_BORDER,
      borderBottomWidth: 1,
      padding: 15,
    },

    componentsContainer: {
      flex: 1,
      alignItems: 'flex-end',
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: 'transparent',
    },

    component: {
      height: 24,
      marginBottom: -8,
      alignSelf: 'flex-end',
      flex: 1,
    },

    leftComponent: {
      alignItems: 'flex-start',
      flex: 1,
    },

    centerComponent: {
      alignSelf: 'center',
      alignItems: 'center',
      flex: 1,
    },

    rightComponent: {
      alignItems: 'flex-end',
      flex: 1,
    },
  },
  'shoutem.ui.navigation.NavigationBar': {
    '.hover': {
      [INCLUDE]: ['hoverNavigationBar'],
    },

    '.clear': {
      [INCLUDE]: ['clearNavigationBar', 'hoverNavigationBar'],
    },

    '.no-border': {
      container: {
        borderBottomWidth: 0,
      },
    },

    '.fade': {
      gradient: {
        [INCLUDE]: ['fillParent'],
        colors: [Colors.CLEAR, 'rgba(0, 0, 0, 0.15)', Colors.CLEAR],
        locations: [0.0, 0.25, 1.0],
        solidifyAnimation(driver) {
          return {
            opacity: driver.value.interpolate({
              inputRange: [250, 300],
              outputRange: [1, 0],
            }),
          };
        },
      },
    },

    'shoutem.ui.View': {
      '.container': {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 9,
      },
    },

    'shoutem.ui.Title': {
      solidifyAnimation(driver) {
        return {
          color: driver.value.interpolate({
            inputRange: [250, 300],
            outputRange: [Colors.CLEAR, Colors.NAVIGATION_BAR_TEXT],
            extrapolate: 'clamp',
          }),
        };
      },

      flex: 1,
      textAlign: 'center',
      fontSize: 15,
      lineHeight: 18,
    },

    'shoutem.ui.Icon': {
      [INCLUDE]: ['navigationBarTextAnimations'],
      color: Colors.NAVIGATION_BAR_TEXT,
      fontSize: 24,
    },

    'shoutem.ui.Text': {
      [INCLUDE]: ['navigationBarTextAnimations'],
      color: Colors.NAVIGATION_BAR_TEXT,
      fontSize: 15,
    },

    'shoutem.ui.Button': {
      [INCLUDE]: ['clearButton', 'tightButton', 'actionButton'],
      'shoutem.ui.Icon': {
        [INCLUDE]: ['navigationBarTextAnimations'],
        marginVertical: 9,
      },
      'shoutem.ui.Text': {
        [INCLUDE]: ['navigationBarTextAnimations'],
      },
    },

    solidifyAnimation(driver) {
      return {
        container: {
          backgroundColor: driver.value.interpolate({
            inputRange: [250, 300],
            outputRange: [Colors.CLEAR, Colors.BACKGROUND],
            extrapolate: 'clamp',
          }),
          borderBottomColor: driver.value.interpolate({
            inputRange: [250, 300],
            outputRange: [Colors.CLEAR, Colors.NAVIGATION_BAR_BORDER],
            extrapolate: 'clamp',
          }),
        },
      };
    },

    navigationHeader: {
      paddingTop: 0,
    },

    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: NAVIGATION_BAR_HEIGHT,
      backgroundColor: Colors.NAVIGATION_BAR_BACKGROUND,
      borderBottomColor: Colors.NAVIGATION_BAR_BORDER,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },

    statusBar: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      transluscent: true,
    },
  },
  'shoutem.ui.navigation.CardStack': {
    '.without-transitions': {
      interpolateCardStyle(props) {
        const {
          navigationState,
          scene,
        } = props;

        const focused = navigationState.index === scene.index;
        const opacity = focused ? 1 : 0;
        const translate = focused ? 0 : 1000000;
        return {
          opacity,
          transform: [
            { translateX: translate },
            { translateY: translate },
          ],
        };
      },
    },

    '.root': {
      'shoutem.ui.navigation.NavigationBar': {
        navigationHeader: {
          marginTop: 0,
        },
      },
    },

    'shoutem.ui.navigation.NavigationBar': {
      '.clear': {
        navigationHeader: {
          marginTop: 0,
        },
        container: {
          position: 'absolute',
          top: NAVIGATION_BAR_HEIGHT,
          left: 0,
          right: 0,
          height: NAVIGATION_BAR_HEIGHT,
        },
      },

      navigationHeader: {
        marginTop: NAVIGATION_BAR_HEIGHT,
      },
    },

    cardStack: {},
    card: {},
  },

  sectionHeaderDivider: {
    'shoutem.ui.Caption': {
      marginTop: -1,
      marginBottom: SMALL_GUTTER,
      marginHorizontal: MEDIUM_GUTTER,
    },

    paddingTop: 23,
    backgroundColor: Colors.LIGHT_GRAY,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.DIVIDER_BORDER,
  },
  'shoutem.ui.Divider': {
    '.line': {
      '.small': {
        width: 55,
      },
      '.center': {
        alignSelf: 'center',
      },
      paddingTop: 0,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.DIVIDER_LINE,
    },

    '.section-header': {
      [INCLUDE]: ['sectionHeaderDivider'],
    },

    alignSelf: 'stretch',
    backgroundColor: Colors.LIGHT,
    paddingTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  //
  // Form components
  //
  'shoutem.ui.FormGroup': {
    'shoutem.ui.View': {
      'shoutem.ui.Caption': {
        backgroundColor: Colors.LIGHT,
        paddingHorizontal: MEDIUM_GUTTER,
        paddingTop: 12,
      },

      'shoutem.ui.TextInput': {
        height: 39,
        paddingVertical: 9,
      },
    },
  },

  'shoutem.ui.TextInput': {
    [INCLUDE]: ['commonVariants', 'guttersMargin'],
    selectionColor: Colors.TEXT,
    placeholderTextColor: Colors.INPUT_PLACEHOLDER,
    backgroundColor: Colors.LIGHT,
    height: 55,
    paddingHorizontal: MEDIUM_GUTTER,
    paddingVertical: 18,
    fontSize: 15,
    fontFamily: 'Rubik',
    color: Colors.TEXT,
  },

  'shoutem.ui.Switch': {
    container: {
      backgroundColor: Colors.DARK,
      borderRadius: 15,
      height: 18,
      marginVertical: 7,
      paddingHorizontal: 2,
      paddingVertical: 2,
      width: 32,

      muteAnimation(driver) {
        return {
          backgroundColor: driver.value.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 1)'],
          }),
        };
      },
    },

    thumb: {
      backgroundColor: Colors.LIGHT,
      borderRadius: 7,
      height: 14,
      width: 14,

      turnAnimation(driver, { layout, animationOptions }) {
        const { x, width } = layout;
        return {
          transform: [
            {
              translateX: driver.value.interpolate({
                inputRange: [0, 1],
                outputRange: [0, animationOptions.containerWidth - width - 2 * x],
              }),
            },
          ],
        };
      },
    },
  },

  'shoutem.ui.DropDownMenu': {
    '.horizontal': {
      horizontalContainer: {
        height: 40,
        justifyContent: 'center',
        backgroundColor: Colors.LIGHT_GRAY,
        width: window.width,
        marginTop: 0,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.NAVIGATION_BAR_BORDER,
      },
    },

    visibleOptions: 8,

    selectedOption: {
      // Button
      [INCLUDE]: ['actionButton', 'tightButton', 'clearButton'],
    },

    modal: {
      'shoutem.ui.Button.close': {
        'shoutem.ui.Icon': {
          color: 'black',
          fontSize: 24,
        },

        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
      },

      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      backgroundColor: 'rgba(242, 242, 242, 0.97)',
    },

    modalItem: {
      'shoutem.ui.Text': {
        textAlign: 'center',
        flex: 1,
        width: window.width,
        paddingHorizontal: 20,
        paddingVertical: 23,
        alignSelf: 'stretch',
      },

      flex: 1,
    },
  },

  //
  // Media
  //

  //
  // HorizontalPager
  //

  'shoutem.ui.HorizontalPager': {
    container: {
      flexGrow: 1,
    },
    scrollView: {
      flexGrow: 1,
      backgroundColor: 'transparent',
      overflow: 'scroll',
    },
    page: {
      flexGrow: 1,
      backgroundColor: 'transparent',
    },
    nextPageInsetSize: 20,
  },

  //
  // PageIndicators
  //

  'shoutem.ui.PageIndicators': {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 10,
    },
    indicatorContainer: {
      alignItems: 'center',
      'shoutem.ui.View': {
        width: GALLERY_DOT_SIZE,
        height: GALLERY_DOT_SIZE,
        borderRadius: GALLERY_DOT_SIZE / 2,
        backgroundColor: Colors.BUTTON_UNDERLAY,
        marginLeft: GALLERY_DOT_SIZE / 2,
        marginRight: GALLERY_DOT_SIZE / 2,
        '.selected': {
          backgroundColor: Colors.DARK,
        },
      },
    },
  },

  //
  // InlineGallery
  //
  'shoutem.ui.InlineGallery': {
    '.large-wide': {
      container: {
        height: (238 / 375) * window.width,
      },
    },

    '.large-ultra-wide': {
      container: {
        height: (130 / 375) * window.width,
      },
    },

    container: {
      height: (345 / 375) * window.width,
    },

    imageContainer: {

    },

    image: {

    },

    pager: {
      pageMargin: 20,
    },
  },

  //
  // ImageGallery
  //
  'shoutem.ui.ImageGallery': {
    [INCLUDE]: ['guttersPadding'],
    pageMargin: 20,
    container: {
      flexGrow: 1,
      backgroundColor: Colors.IMAGE_PREVIEW_BACKGROUND,
    },
    page: {
      flexGrow: 1,
      justifyContent: 'center',
      overflow: 'hidden',
    },
  },

  'shoutem.ui.ImageGalleryOverlay': {
    '.full-screen': {
      title: {
        container: {
          // We want the title background gradient to be
          // visible underneath the navigation bar, but the
          // title text should be rendered below the
          // navigation bar.
          paddingTop: 70 + MEDIUM_GUTTER,
        },
      },
    },

    container: {
      [INCLUDE]: ['fillParent'],
    },
    title: {
      container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: MEDIUM_GUTTER,
        paddingHorizontal: MEDIUM_GUTTER,

        backgroundGradient: {
          colors: ['rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.0)'],
          locations: [0.17, 1.0],
        },
      },
      text: {
        color: Colors.LIGHT,
        textAlign: 'center',
      },
    },
    description: {
      container: {
        '.expanded': {
          paddingTop: EXTRA_LARGE_GUTTER,

          backgroundGradient: {
            colors: ['rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 0.8)'],
            locations: [0.36, 1.0],
          },
        },
        '.collapsed': {
          paddingTop: MEDIUM_GUTTER,

          backgroundGradient: {
            colors: ['rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 0.6)'],
            locations: [0.02, 1.0],
          },
        },

        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      },

      scroll: {
        maxHeight: 200,
        padding: MEDIUM_GUTTER,
      },
      text: {
        color: Colors.LIGHT,
        textAlign: 'center',
      },
    },
  },

  'shoutem.ui.LinearGradient': {
    '.fill-parent': {
      [INCLUDE]: ['fillParent'],
    },
  },

  'shoutem.ui.Lightbox': {
    'shoutem.ui.Image': {
      '.preview': {
        flex: 1,
        resizeMode: 'contain',
      },
    },
  },
});
