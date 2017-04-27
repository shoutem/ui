import {
  mapComponentProps,
  mapElementProps,
  renderChildren,
} from '../RichMedia';
import { View } from 'react-native';

export default mapComponentProps(mapElementProps, renderChildren)(View);
