import { View } from 'react-native';

import {
  mapComponentProps,
  mapElementProps,
  renderChildren,
} from '../Html';

export default mapComponentProps(mapElementProps, renderChildren)(View);
