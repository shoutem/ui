import {defaultConfig} from '../assets';
let Icons= {};
registerIcons(defaultConfig);

export function registerIcons(config){
  config.forEach(element => {
    Icons[element.name] = element.icon;
  });
}

export function resolveIcon(name){
return Icons[name]
};
