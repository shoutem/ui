import _ from "lodash";
import { defaultConfig } from "../assets";
let Icons = {};

registerIcons(defaultConfig);

export function registerIcons(config) {
  const isArray = _.isArray(config);
  const isObject = _.isObject(config);

  if (!isObject) {
    return console.warn(
      "Icon config must be an object or an array of objects."
    );
  }

  if (isArray) {
    return _.forEach(config, function (element) {
      addNewIcon(element);
    });
  } else {
    addNewIcon(config);
  }
}

function addNewIcon(config) {
  const hasName = _.has(config, "name");
  const hasIcon = _.has(config, "icon");

  if (!hasName || !hasIcon) {
    return console.warn(`"name" and "icon" keys are required in icon config.`);
  }

  const { name, icon } = config;

  if (_.hasIn(Icons, name)) {
    return console.warn(`Icon with name "${name}" already exists. Please try using another name.`);
  }

  if (!_.isString(name)) {
    return console.warn(`Icon name must be string.`);
  }

  if (!_.isFunction(icon)) {
    return console.warn(`Icon must be an SVG file imported as a React component.`);
  }

  try {
    Icons[name] = icon;
  } catch (error) {
    console.warn(`Icon "${name}" could not be added: ${error.message}`);
  }
}

export function resolveIcon(name) {
  return Icons[name];
}
