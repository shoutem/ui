import { setDefaultThemeStyle } from './init';
import getTheme, {
  defaultThemeVariables,
  dimensionRelativeToIphone,
  calculateLineHeight,
} from './theme';

setDefaultThemeStyle();

// Theme
export {
  getTheme,
  defaultThemeVariables,
  dimensionRelativeToIphone,
  calculateLineHeight,
};

// Components
export { ActionSheet } from './components/ActionSheet';
export { View } from './components/View';
export { Screen } from './components/Screen';

export { NavigationBar } from './components/NavigationBar';
export { NavigationBarAnimations } from './components/NavigationBar/NavigationBarAnimations';
export { DropDownMenu, DropDownModal } from './components/DropDownMenu';
export { Overlay } from './components/Overlay';

export { ScrollView } from './components/ScrollView';
export { ListView } from './components/ListView';
export { GridRow } from './components/GridRow';

export { TouchableOpacity } from './components/TouchableOpacity';
export { TouchableNativeFeedback } from './components/TouchableNativeFeedback';
export { Touchable } from './components/Touchable';
export { Button } from './components/Button';
export { Icon, registerIcons } from "./components/Icon";

export { FormGroup } from './components/FormGroup';
export { TextInput } from './components/TextInput';

export { Spinner } from './components/Spinner';
export { Switch } from './components/Switch';

export { Video } from './components/Video';
export { Image } from './components/Image';
export { ImageBackground } from './components/ImageBackground';
export { ImagePreview } from './components/ImagePreview';
export { ImageGallery } from './components/ImageGallery';
export { InlineGallery } from './components/InlineGallery';
export { ImageGalleryOverlay } from './components/ImageGalleryOverlay';
export { HorizontalPager } from './components/HorizontalPager';
export { LoadingIndicator } from './components/LoadingIndicator';
export { PageIndicators } from './components/PageIndicators';
export { Html } from './html';
export { SimpleHtml } from './html';
export { ShareButton } from './components/ShareButton';
export { LinearGradient } from './components/LinearGradient';

export {
  Heading,
  Title,
  Subtitle,
  Text,
  Caption,
} from './components/Text';

export { Divider } from './components/Divider';

export { Card } from './components/Card';
export { Row } from './components/Row';
export { Tile } from './components/Tile';

export { Lightbox } from './components/Lightbox';

export { EmptyStateView } from './components/EmptyStateView';
export { NumberInput } from './components/NumberInput';
export { SearchField } from './components/SearchField';

export { Examples } from './examples/components';

export { Device, Keyboard } from './helpers';

// Constants
export {
  IPHONE_X_HOME_INDICATOR_PADDING,
  IPHONE_X_LONG_SIDE,
  IPHONE_X_NOTCH_PADDING,
  IPHONE_XR_LONG_SIDE,
  IPHONE_XR_NOTCH_PADDING,
  nativeDependencies,
  NAVIGATION_HEADER_HEIGHT,
} from './const';