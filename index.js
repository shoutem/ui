import { setDefaultThemeStyle } from './init';

setDefaultThemeStyle();

// Theme
export {
  calculateLineHeight,
  defaultThemeVariables,
  dimensionRelativeToIphone,
  default as getTheme,
  resolveFontFamily,
  resolveFontStyle,
  resolveFontWeight,
  responsiveHeight,
  responsiveWidth,
} from './theme';

// Services
export {
  createScopedResolver,
  resolveVariable,
  ThemeVariableResolver,
  defaultResolver as variableResolver,
} from './services';

// Components
export { ActionSheet } from './components/ActionSheet';
export { Button } from './components/Button';
export { Card } from './components/Card';
export { CategoryPicker } from './components/CategoryPicker';
export { DateTimePicker } from './components/DateTimePicker';
export { Divider } from './components/Divider';
export { DropDownMenu, DropDownModal } from './components/DropDownMenu';
export { EmptyListImage } from './components/EmptyListImage';
export { EmptyStateView } from './components/EmptyStateView';
export { FormGroup } from './components/FormGroup';
export { GridRow } from './components/GridRow';
export { HorizontalPager } from './components/HorizontalPager';
export { Icon, registerIcons } from './components/Icon';
export { Image } from './components/Image';
export { ImageBackground } from './components/ImageBackground';
export { ImageGallery } from './components/ImageGallery';
export { ImageGalleryOverlay } from './components/ImageGalleryOverlay';
export { ImagePreview } from './components/ImagePreview';
export { InlineDropDownMenu } from './components/InlineDropDownMenu';
export { InlineGallery } from './components/InlineGallery';
export { Lightbox } from './components/Lightbox';
export { LinearGradient } from './components/LinearGradient';
export { ListView } from './components/ListView';
export { LoadingContainer } from './components/LoadingContainer';
export { LoadingIndicator } from './components/LoadingIndicator';
export { NavigationBar } from './components/NavigationBar';
export { NavigationBarAnimations } from './components/NavigationBar/NavigationBarAnimations';
export { NumberInput } from './components/NumberInput';
export { Overlay } from './components/Overlay';
export { PageIndicators } from './components/PageIndicators';
export { Row } from './components/Row';
export { Screen } from './components/Screen';
export { ScrollView } from './components/ScrollView';
export { SearchField } from './components/SearchField';
export { ShareButton } from './components/ShareButton';
export { Spinner } from './components/Spinner';
export { Switch } from './components/Switch';
export { TabMenu } from './components/TabMenu';
export { Caption, Heading, Subtitle, Text, Title } from './components/Text';
export { TextInput } from './components/TextInput';
export { Tile } from './components/Tile';
export { Touchable } from './components/Touchable';
export { TouchableNativeFeedback } from './components/TouchableNativeFeedback';
export { TouchableOpacity } from './components/TouchableOpacity';
export { Video } from './components/Video';
export { View } from './components/View';
export { YearRangePicker } from './components/YearRangePicker';

// Examples
export { Examples } from './examples/components';

// Helpers
export { calculateKeyboardOffset, Device, Keyboard } from './helpers';

// HTML
export { Html } from './html';
export { SimpleHtml } from './html';

// Constants
export {
  IPHONE_X_HOME_INDICATOR_PADDING,
  IPHONE_X_LONG_SIDE,
  IPHONE_X_NOTCH_PADDING,
  IPHONE_XR_LONG_SIDE,
  IPHONE_XR_NOTCH_PADDING,
  nativeDependencies,
  NAVIGATION_BAR_HEIGHT,
  NAVIGATION_HEADER_HEIGHT,
  STATUS_BAR_OFFSET,
} from './const';
