import {
  mapComponentProps,
  mapElementProps,
  renderChildren,
} from '../components/RichMedia';
import { View } from 'react-native';

export default mapComponentProps(mapElementProps, renderChildren)(View);
