import { setDefaultThemeStyle } from './init';
import getTheme from './theme';

setDefaultThemeStyle();

// Theme
export { getTheme };

// Components
export { View } from './components/View';
export { Screen } from './components/Screen';

export { NavigationBar } from './components/NavigationBar';
export { NavigationBarAnimations } from './components/NavigationBar/NavigationBarAnimations';
export { DropDownMenu } from './components/DropDownMenu';
export { Overlay } from './components/Overlay';

export { ScrollView } from './components/ScrollView';
export { ListView } from './components/ListView';
export { GridRow } from './components/GridRow';

export { TouchableOpacity } from './components/TouchableOpacity';
export { Button } from './components/Button';
export { Icon } from './components/Icon';

export { TextInput } from './components/TextInput';

export { Spinner } from './components/Spinner';

export { Video } from './components/Video';
export { Image } from './components/Image';
export { ImagePreview } from './components/ImagePreview';
export { ImageGallery } from './components/ImageGallery';
export { RichMedia } from './components/RichMedia';
export { MapView, InlineMap } from './components/Map/';

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

export { Examples } from './examples/components';
