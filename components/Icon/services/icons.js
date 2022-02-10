import _ from 'lodash';
import { defaultConfig } from '../assets';

const Icons = {};

function addNewIcon(config) {
  const hasName = _.has(config, 'name');
  const hasIcon = _.has(config, 'icon');

  if (!hasName || !hasIcon) {
    // eslint-disable-next-line no-console
    console.warn(`"name" and "icon" keys are required in icon config.`);
    return;
  }

  const { name, icon } = config;

  if (_.hasIn(Icons, name)) {
    // eslint-disable-next-line no-console
    console.warn(
      `Icon with name "${name}" already exists. Please try using another name.`,
    );
    return;
  }

  if (!_.isString(name)) {
    // eslint-disable-next-line no-console
    console.warn(`Icon name must be a string.`);
    return;
  }

  if (!_.isFunction(icon)) {
    // eslint-disable-next-line no-console
    console.warn(`Icon must be an SVG file imported as a React component.`);
    return;
  }

  try {
    Icons[name] = icon;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Icon "${name}" could not be added: ${error.message}`);
  }
}

export function registerIcons(config) {
  const isArray = _.isArray(config);
  const isObject = _.isObject(config);

  if (!isObject) {
    // eslint-disable-next-line no-console
    console.warn('Icon config must be an object or an array of objects.');
    return;
  }

  if (isArray) {
    _.forEach(config, element => {
      addNewIcon(element);
    });
  } else {
    addNewIcon(config);
  }
}

registerIcons(defaultConfig);

export function getIcon(name) {
  return Icons[name];
}
