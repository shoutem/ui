import { View } from 'react-native';

import {
  combineMappers,
  mapElementProps,
  renderChildren,
} from '../Html';

export default combineMappers(mapElementProps, renderChildren)(View);
