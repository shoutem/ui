# @shoutem/ui

React Native component library for Shoutem apps. Components are in `components/`, the default
theme in `theme.js` (`getTheme()`, `defaultThemeVariables`). Styling goes through
`@shoutem/theme` (`connectStyle`, `styleName` variants).

## Playground

`playground/` is a browser playground of the real components, published as a claude.ai artifact.
Run it with `npm run playground` (http://localhost:4321, live reload).

**Rule:** when you add, remove or change a component (props, theme styles, styleName variants or
behavior), update the playground in the same branch using the `update-playground` skill. Show the
change on the local preview and get the user's approval before publishing the artifact.
