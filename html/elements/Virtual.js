import {
  mapComponentProps,
  mapElementProps,
  renderChildren,
} from '../Html';
import { View } from 'react-native';

export default mapComponentProps(mapElementProps, renderChildren)(View);
