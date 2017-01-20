import defaultConfig from './config.json';
import _ from 'lodash';

export default function (fontFamily) {
  const config = { ...defaultConfig };
  _.set(config, 'metadata.name', fontFamily);
  _.set(config, 'preferences.metadata.fontFamily', fontFamily);
  return config;
}
