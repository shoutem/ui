---
name: update-playground
description: Update the @shoutem/ui browser playground (playground/, published as a claude.ai artifact) after a component is added, removed or changed (props, theme styles, styleName variants, behavior). Covers the registry entry, regenerating data, local preview, checks, and publishing after the user approves.
---

# Update the @shoutem/ui playground

The playground renders this repo's real components on react-native-web, with the real app theme.
Source: `playground/` (read `playground/README.md` for the layout). Published at
https://claude.ai/artifact/UBNXhNHNGPyzhH9vrBX2ak.

Keep the playground in sync in the same branch as the component change. Never publish before the
user has looked at the change on the local preview and approved it.

## 1. Start (or reuse) the local preview

Check whether it's already running: `lsof -iTCP:4321 -sTCP:LISTEN`. If not, run `npm run playground`
from the repo root in the background. It serves http://localhost:4321, rebuilds on every save in
`playground/` or the library, and reloads the page.

## 2. Work out what changed

| Change in the library | Playground work |
|---|---|
| New exported component | New entry in `playground/src/registry.js`, in the right `group` |
| Component removed or renamed | Remove/rename its entry; fix imports at the top of `registry.js` |
| propTypes added/changed | `node playground/scripts/scan-props.mjs`; add a control to the entry if the prop is worth demoing |
| New theme styles or styleName variants in `theme.js` | Nothing usually: Style and Variants tabs read the live theme. Check the entry's `target` and `defaultStyleName` still make sense |
| Visual or behavior change | Check the demo still shows it; adjust demo content if not |
| Component in `GLASS_COMPONENTS` (`playground/src/glass.js`) changed its theme keys | Update its glass overrides in `getGlassTheme` |

Run `npm --prefix playground run scan` (all scanners) when unsure. Generated files in
`playground/src/data/` are committed; never hand-edit them (except `rn.js`).

## 3. Registry entry format

Copy a similar existing entry. A typical one:

```js
{
  name: 'SearchField',                 // rail label; also the URL hash (#SearchField)
  group: 'Buttons & inputs',           // rail section
  target: 'shoutem.ui.SearchField',    // theme key: drives Style and Variants tabs
  controls: [text('placeholder', 'Search the menu'), bool('loading', false)], // demo content (Props tab top)
  Demo: ({ p, sn, x = {} }) => <View styleName="md-gutter">
    <SearchField styleName={sn} placeholder={p.placeholder} loading={p.loading} onChangeText={() => {}} {...x} />
  </View>,
  code: (p, sn) => `<SearchField${attr('styleName', sn)}\n  placeholder="${p.placeholder}"\n/>`,
},
```

Rules:
- `Demo` gets `p` (control values), `sn` (styleName), `x` (user overrides from the Props/Style tabs)
  and `vars` (theme variables). Put `styleName={sn}` and `{...x}` (spread last) on the main
  component, and merge `x.style` with `ms(base, x.style)` if the demo sets its own `style`.
- Control helpers: `text`, `area`, `num`, `bool`, `select`, `color`, `icon`, `json`.
- Optional: `defaultStyleName`, `styleNameDisabled: true` (no theme variants), `note` (yellow note
  above the device).
- Images: use `photos` / `avatar` from `src/images.js`. Remote URLs are blocked on the artifact host.
- Native-only dependencies need a web stand-in in `playground/stubs/` and an alias in `build.mjs`.
- If the demo's component name differs from what users write (like `Toast` → `BaseToast`), add it
  to `OWNERS` in `src/panels.js` and `compNameFor` in `src/main.js`.

## 4. Check it

```sh
npm --prefix playground run build
npm --prefix playground run check -- <Name> [<Name>…]   # screenshots on Prime and Noir
npm --prefix playground run check                       # every component: render crashes, page errors
```

Look at the screenshots in `playground/dist/shots/` (Read the PNGs). The full check must pass.
Don't change the device frame / page layout (`template.html`, `main.js` shell) without explicit
approval: a "full-height" layout change passed these checks before and still broke the playground
for the user.

## 5. Ask the user to review

Tell them what changed and where to look, e.g. "http://localhost:4321/#SearchField: new `loading`
control, Prime and Noir checked". Wait for approval. Iterate on the preview if they ask for changes.

## 6. Publish (only after approval)

1. `npm run playground:build` from the repo root (the preview server's builds are unminified).
2. In a conversation that hasn't touched the artifact yet, read it first: Artifact tool,
   `action: "read"`, `url` above. Publishing to an existing URL is refused otherwise.
3. Publish `playground/dist/shoutem-ui-playground.html` with that `url` and a short `label`
   (e.g. "SearchField loading prop"). Only the owner or people with edit access can update it; if
   publishing is refused for access, tell the user instead of creating a new artifact.
4. Commit the playground changes with the component change.
