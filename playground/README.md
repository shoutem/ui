# @shoutem/ui playground

A browser playground for `@shoutem/ui`. It renders the real components from this repo on
react-native-web, with the real theme: `getTheme()` merged with every mobile-qa extension's
`app/themes/style.js` and the Rubicon presets (Prime, Bleu, Noir, Rose). Not part of the
published npm package.

Published version: https://claude.ai/artifact/UBNXhNHNGPyzhH9vrBX2ak (v3, private to its owner
until shared).

## Run it

From the repo root:

```sh
npm run playground          # installs playground deps, then serves http://localhost:4321
npm run playground:build    # one-off build into playground/dist/
```

The preview rebuilds (about 1 s) and reloads the tab whenever you save a file in `playground/` or
in the library (`components/`, `theme.js`, `html/`, `helpers/`, `services/`, `index.js`). The
`#Component` part of the URL is kept, so you stay on the same component. Build errors show in the
page.

Needs the mobile-qa repo checked out next to this one (`../mobile-qa`). If it's somewhere else,
set `MOBILE_QA_DIR`.

## Layout

| Path | What it is |
|---|---|
| `src/registry.js` | One entry per component: demo, controls, JSX snippet. **Edit this when a component is added or changes.** |
| `src/main.js` | App shell: theme composition, header, rail, device frame, inspector tabs |
| `src/panels.js` | Inspector tabs: Props, Style, Variants, In apps, Glass, Theme |
| `src/glass.js` | Liquid glass prototype (theme layer behind the "Liquid glass" option). Not in the library yet. |
| `src/images.js` | Sample photos drawn on canvas (the artifact host blocks remote images) |
| `src/data/` | Generated data, see below. `rn.js` is hand-written (RN base props) |
| `stubs/` | Web stand-ins for native modules (modal, action sheet, webview, haptics…) |
| `template.html` | Page shell and CSS |
| `build.mjs` | esbuild bundle + fonts inlined into one HTML page |
| `serve.mjs` | Local preview server with live reload |
| `scripts/check.mjs` | Headless smoke test and screenshots |
| `scripts/scan-*.mjs` | Regenerate `src/data/` |

## Generated data

`npm --prefix playground run scan` regenerates all of it:

| File | Script | Source |
|---|---|---|
| `props.json` | `scan-props.mjs` | propTypes/defaultProps of every component in this repo (Props tab) |
| `usages.json` | `scan-usages.mjs` | JSX usages in mobile-qa extensions (In apps tab, rail counts) |
| `rubicon.json` | `scan-presets.mjs` | Rubicon presets and the Builder's theme-variable schema (Theme tab) |
| `extensionThemes.js` | `scan-themes.mjs` | Every extension theme that is merged into the app theme |

Run it after changing a component's propTypes, and now and then to pick up mobile-qa changes.

## Checking changes

```sh
npm --prefix playground run build
npm --prefix playground run check                  # every component, fails on render crashes or page errors
npm --prefix playground run check -- Button TabMenu  # these only, screenshots on Prime and Noir in dist/shots/
```

`check` finds Chromium in the Playwright cache, or set `CHROMIUM_PATH`, or it uses an installed
Google Chrome.

## Publishing

`npm run playground` builds unminified. Before publishing run `npm run playground:build`, then
publish `playground/dist/shoutem-ui-playground.html` to the artifact URL above (with Claude Code:
the Artifact tool, passing that URL). Only the artifact's owner, or people given edit access, can
update it.
