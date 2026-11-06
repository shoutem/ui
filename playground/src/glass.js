// Prototype of the proposed `@shoutem/ui` glass layer (would live in theme/glass.js).
//
// - One new theme variable, shown in the Builder as a "Liquid glass" section:
//     liquidGlass: 'off' | 'regular' | 'clear'   (dropdown, default 'off')
//   No new colors: each surface is tinted with the color it already has (primaryButtonBackgroundColor,
//   tagOverlayColor, toastBackgroundColor...), made translucent. Text colors stay as the theme set them.
// - getGlassTheme(vars) returns style overrides for a handful of components. getTheme() merges them
//   over its base styles only when liquidGlass !== 'off', so apps that never enable glass get
//   exactly the theme they have today. Extension themes still merge on top and win.
// - Every glass surface carries a `glass` style key ({ variant, tint }). On native, components
//   pass it to a shared <GlassSurface>, which picks the platform material. On web (this
//   playground) the same surface is plain CSS: translucent fill + backdrop-filter.
import tinycolor from 'tinycolor2';

export const GLASS_VARIANTS = ['off', 'regular', 'clear'];

export const glassVariableDefaults = {
  liquidGlass: 'off',
};

// Builder schema additions (same shape as rubicon-theme's server/*ThemeVariables.json).
export const glassSchema = {
  section: { title: 'Liquid glass', properties: ['liquidGlass'] },
  properties: {
    liquidGlass: {
      type: 'object',
      format: 'dropdown',
      title: 'Liquid glass - translucent material for buttons, search, tabs, sheets and toasts',
      default: { dropdownValue: 'off' },
      constraints: { dropdownValue: { enum: GLASS_VARIANTS } },
    },
  },
};

export function registerGlassSchema(rubicon) {
  const s = rubicon.schema;
  if (s.properties.liquidGlass) return;
  Object.assign(s.properties, glassSchema.properties);
  s.sections.splice(1, 0, glassSchema.section);
}

export const glassEnabled = vars => !!vars && vars.liquidGlass && vars.liquidGlass !== 'off';

// Components that get glass, and the theme keys each one touches.
export const GLASS_COMPONENTS = {
  Button: ['shoutem.ui.Button'],
  SearchField: ['shoutem.ui.SearchField'],
  TabMenu: ['shoutem.ui.TabMenu', 'shoutem.ui.TabMenuItem'],
  ActionSheet: ['shoutem.ui.ActionSheet', 'shoutem.ui.ActionSheetOption'],
  Toast: ['shoutem.ui.BaseToast', 'shoutem.ui.SuccessToast', 'shoutem.ui.ErrorToast'],
  Overlay: ['shoutem.ui.Overlay'],
};

const PARAMS = {
  regular: { fill: 0.5, darkFill: 0.58, blur: 22, saturate: 180, edge: 0.28, darkEdge: 0.12, shadow: 0.16 },
  clear: { fill: 0.16, darkFill: 0.26, blur: 7, saturate: 140, edge: 0.32, darkEdge: 0.16, shadow: 0.1 },
};

const alpha = (c, a) => tinycolor(c).setAlpha(a).toRgbString();

// One material, in RN style keys. `backdropFilter` is web-only; native reads `glass`.
export function glassMaterial(vars, { tint, variant, radius, fillScale = 1, platform = 'web' } = {}) {
  const v = variant || vars.liquidGlass;
  const p = PARAMS[v] || PARAMS.regular;
  const base = tint || vars.paperColor || '#ffffff';
  const dark = tinycolor(base).isDark();
  const fill = (dark ? p.darkFill : p.fill) * fillScale;
  const out = {
    backgroundColor: alpha(base, Math.min(fill, 0.92)),
    borderWidth: 1,
    borderColor: `rgba(255, 255, 255, ${dark ? p.darkEdge : p.edge})`,
    ...(radius !== undefined ? { borderRadius: radius } : {}),
  };
  if (platform === 'native') return { glass: { variant: v, tint: base }, ...out };
  return {
    ...out,
    backdropFilter: `blur(${p.blur}px) saturate(${p.saturate}%)`,
    // Soft rim light around the whole edge (no hard top line), plus a gentle drop shadow.
    boxShadow: `inset 0 0 6px rgba(255, 255, 255, ${dark ? 0.06 : 0.18}), 0 8px 24px rgba(0, 0, 0, ${p.shadow})`,
  };
}

const noGlass = platform => (platform === 'native' ? { glass: null } : { backdropFilter: 'none', boxShadow: 'none' });

export function getGlassTheme(vars, platform = 'web') {
  if (!glassEnabled(vars)) return {};
  const m = opts => glassMaterial(vars, { ...opts, platform });
  const NO_GLASS = noGlass(platform);
  const secondaryTint = vars.secondaryButtonBackgroundColor || vars.featuredColor;
  return {
    'shoutem.ui.Button': {
      ...m({ tint: vars.primaryButtonBackgroundColor, radius: 999 }),
      paddingLeft: 18,
      paddingRight: 12,
      // Tinted glass keeps the brand color, still see-through.
      '.secondary': { ...m({ tint: secondaryTint, fillScale: 1.5 }) },
      // Text-only and borderless buttons stay flat (nav bars, inline actions, SearchField clear).
      '.clear': { ...NO_GLASS },
      '.textual': { ...NO_GLASS },
      '.full-width': { borderRadius: 0 },
    },

    'shoutem.ui.SearchField': {
      container: { ...m({ tint: vars.searchInputBackgroundColor || vars.paperColor, radius: 999 }), height: 40 },
      input: { backgroundColor: 'transparent', height: 40, color: vars.text?.color },
    },

    'shoutem.ui.TabMenu': {
      container: { ...m({ tint: vars.backgroundColor, radius: 999 }), marginHorizontal: 12, marginVertical: 8, paddingHorizontal: 6 },
      list: { backgroundColor: 'transparent' },
    },
    'shoutem.ui.TabMenuItem': {
      text: { marginTop: 10, marginBottom: 10, opacity: 0.45 },
      selectedText: { marginBottom: 2, opacity: 1 },
      tabulator: { height: 3, borderRadius: 2, marginBottom: 6 },
    },

    'shoutem.ui.ActionSheet': {
      segmentContainer: { ...m({ tint: vars.primaryButtonBackgroundColor, radius: 24 }) },
    },
    'shoutem.ui.ActionSheetOption': {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderRadius: 0,
        borderBottomWidth: 1,
        borderColor: 'rgba(127, 127, 127, 0.18)',
      },
    },

    'shoutem.ui.BaseToast': {
      container: { ...m({ tint: vars.toastBackgroundColor, radius: 22 }), shadowOpacity: 0 },
    },
    'shoutem.ui.SuccessToast': {
      container: { ...m({ tint: vars.toastSuccessBackgroundColor, fillScale: 1.6, radius: 22 }) },
    },
    'shoutem.ui.ErrorToast': {
      container: { ...m({ tint: vars.toastErrorBackgroundColor, fillScale: 1.6, radius: 22 }) },
    },

    // Tag-style overlays (price chips, badges) become dark glass. Full-bleed scrims stay as they are.
    'shoutem.ui.Overlay': {
      ...m({ tint: vars.tagOverlayColor, fillScale: 0.9, radius: 14 }),
      '.image-overlay': { ...NO_GLASS, borderWidth: 0, borderRadius: 0 },
      '.fill-parent': { ...NO_GLASS, borderWidth: 0, borderRadius: 0 },
    },
  };
}

// The overrides as the library would ship them (native shape), for the inspector's Glass tab.
export function glassOverridesFor(vars, compName) {
  const keys = GLASS_COMPONENTS[compName];
  if (!keys) return null;
  const t = getGlassTheme({ ...vars, liquidGlass: glassEnabled(vars) ? vars.liquidGlass : 'regular' }, 'native');
  return Object.fromEntries(keys.map(k => [k, t[k]]));
}
