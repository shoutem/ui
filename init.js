import { Theme } from '@shoutem/theme';
import { defaultResolver as variableResolver } from './services';
import getThemeStyle, { defaultThemeVariables } from './theme';

function setDefaultThemeStyle() {
  variableResolver.setVariables(defaultThemeVariables)

  const theme = getThemeStyle();

  Theme.setDefaultThemeStyle(theme);
}

export { setDefaultThemeStyle };
