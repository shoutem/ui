import React, { Component, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import _ from 'lodash';
import { StyleProvider, Theme } from '@shoutem/theme';
import { defaultThemeVariables, getTheme, Toast, variableResolver } from '@shoutem/ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { extensionThemes } from './data/extensionThemes';
import rubicon from './data/rubicon.json';
import usages from './data/usages.json';
import { registry } from './registry';
import { applyUsage, GlassPanel, PropsPanel, StylePanel, ThemePanel, UsagesPanel } from './panels';
import { GLASS_COMPONENTS, GLASS_VARIANTS, getGlassTheme, glassEnabled, glassVariableDefaults, registerGlassSchema } from './glass';
import { photos } from './images';

registerGlassSchema(rubicon);
const START_GLASS = 'clear';

const SAFE_AREA = { frame: { x: 0, y: 0, width: 375, height: 700 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } };
const SIZES = { sizes: { window: { width: 375, height: 812 } } };
const slug = s => s.replace(/[^A-Za-z0-9]+/g, '-');
const GROUPS = _.uniq(registry.map(r => r.group));
const USAGE_COUNT = _.countBy(usages, 'c');

const defaultsFor = entry => Object.fromEntries(entry.controls.map(c => [c.key, c.default]));
const uiVars = () => _.merge(_.cloneDeep(defaultThemeVariables), glassVariableDefaults, SIZES);
// '@paperColor' / '@text.fontFamily' references in extension defaults point at root variables.
function deref(v, root, depth = 0) {
  if (typeof v === 'string' && v.startsWith('@') && depth < 5) return deref(_.get(root, v.slice(1).split('.')), root, depth + 1);
  if (_.isPlainObject(v)) return _.mapValues(v, x => deref(x, root, depth));
  return v;
}
// App variables = sizes + @shoutem/ui defaults + Rubicon preset + each extension's theme.json defaults.
const presetVars = name => {
  const base = _.merge(_.cloneDeep(defaultThemeVariables), glassVariableDefaults, _.cloneDeep(rubicon.presets[name]), SIZES);
  rubicon.extensions.forEach(e => {
    Object.entries(e.defaults).forEach(([k, v]) => { if (base[k] === undefined && v !== undefined) base[k] = deref(_.cloneDeep(v), base); });
  });
  return base;
};

// Same composition as shoutem.rubicon-theme/app/themes/Rubicon.js.
function buildTheme(vars, mode) {
  variableResolver.setVariables(vars);
  // Proposed library change: getTheme() merges the glass layer itself when liquidGlass !== 'off'.
  const base = _.merge({}, getTheme(), getGlassTheme(vars));
  let style = base;
  const failed = [];
  if (mode === 'app') {
    const ext = {};
    _.forEach(extensionThemes, (m, name) => {
      try { Object.assign(ext, m.default()); } catch (e) { failed.push({ name, message: e.message }); }
    });
    style = _.merge({}, base, ext);
  }
  Theme.setDefaultThemeStyle(style);
  return { style, theme: new Theme(style), failed };
}

function styleNamesFor(theme, target) {
  if (!target) return [];
  try {
    const s = theme.createComponentStyle(target, {});
    return _.uniq(Object.keys(s).filter(k => k.startsWith('.')).flatMap(k => k.slice(1).split('.')).filter(Boolean)).sort();
  } catch (e) {
    return [];
  }
}

function compNameFor(entry, p) {
  if (entry.name === 'Text') return p.variant;
  if (entry.name === 'Touchable') return p.kind;
  if (entry.name === 'Type scale') return 'Text';
  return entry.name;
}

// Insert the user's overrides into the demo's JSX snippet on the main component's tag.
function attrString(x) {
  const out = [];
  Object.entries(_.omit(x, 'style')).forEach(([k, v]) => {
    if (v === true) out.push(k);
    else if (typeof v === 'string') out.push(`${k}="${v}"`);
    else out.push(`${k}={${JSON.stringify(v)}}`);
  });
  if (x.style) out.push(`style={${JSON.stringify(x.style, null, 2).replace(/\n/g, '\n  ')}}`);
  return out;
}
function codeWithOverrides(code, compName, x) {
  const attrs = attrString(x);
  if (!attrs.length) return code;
  const re = new RegExp(`<${compName}(?=[\\s/>])`);
  const m = code.match(re);
  if (!m) return `${code}\n\n// ${compName} overrides\n${attrs.join('\n')}`;
  const insert = attrs.map(a => `\n  ${a}`).join('');
  return code.slice(0, m.index + m[0].length) + insert + code.slice(m.index + m[0].length);
}

class Boundary extends Component {
  constructor(p) { super(p); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="crash">
          <strong>This component failed to render in the browser.</strong>
          <code>{String(this.state.error && this.state.error.message || this.state.error)}</code>
          <span>Try other prop values, or clear your overrides.</span>
        </div>
      );
    }
    return this.props.children;
  }
}

function StyleNamePanel({ names, selected, toggle, extra, setExtra, disabled, target }) {
  const [q, setQ] = useState('');
  if (disabled) return <p className="lede">This component doesn't take a <code>styleName</code> in this demo.</p>;
  const shown = names.filter(n => !q || n.includes(q.toLowerCase()));
  return (
    <div>
      <p className="lede">Variants come from the live theme for <code>{target}</code>, including any the extensions add. Tap one to add it to <code>styleName</code>.</p>
      <input type="search" id="sn-search" placeholder={`Filter ${names.length} variants`} value={q} onChange={e => setQ(e.target.value)} />
      <div className="chips">
        {shown.map(n => (
          <button type="button" key={n} className={`chip ${selected.includes(n) ? 'on' : ''}`} aria-pressed={selected.includes(n)} onClick={() => toggle(n)}>{n}</button>
        ))}
        {!shown.length && <span className="hint">No variant matches “{q}”.</span>}
      </div>
      <div className="field">
        <label htmlFor="sn-extra">Extra styleName <span className="hint">space-separated</span></label>
        <input id="sn-extra" type="text" className="mono" value={extra} onChange={e => setExtra(e.target.value)} placeholder="e.g. md-gutter-top" />
      </div>
    </div>
  );
}

function initialName() {
  const h = decodeURIComponent((location.hash || '').slice(1));
  const hit = registry.find(r => slug(r.name) === h);
  return hit ? hit.name : 'Glass showcase';
}

function App() {
  const [current, setCurrent] = useState(initialName);
  const [filter, setFilter] = useState('');
  const [tab, setTab] = useState('props');
  const [mode, setModeRaw] = useState('app');
  const [preset, setPresetRaw] = useState('Prime');
  const [vars, setVars] = useState(() => ({ ...presetVars('Prime'), liquidGlass: START_GLASS }));
  const [propsMap, setPropsMap] = useState(() => Object.fromEntries(registry.map(r => [r.name, defaultsFor(r)])));
  const [snMap, setSnMap] = useState(() => Object.fromEntries(registry.map(r => [r.name, { chips: (r.defaultStyleName || '').split(' ').filter(Boolean), extra: '' }])));
  const [xMap, setXMap] = useState({});
  const [applied, setApplied] = useState(null);
  const [copied, setCopied] = useState(false);
  const [frameBg, setFrameBg] = useState('photo:0');

  const entry = registry.find(r => r.name === current) || registry[0];
  const p = propsMap[entry.name];
  const compName = compNameFor(entry, p);
  const xKey = `${entry.name}:${compName}`;
  const x = xMap[xKey] || {};
  const setX = useCallback(fn => setXMap(m => ({ ...m, [xKey]: typeof fn === 'function' ? fn(m[xKey] || {}) : fn })), [xKey]);
  const snState = snMap[entry.name];
  const sn = [...snState.chips, ...snState.extra.split(/\s+/)].filter(Boolean).join(' ');

  const baseline = useMemo(() => (mode === 'app' ? presetVars(preset) : uiVars()), [mode, preset]);
  const deferredVars = useDeferredValue(vars);
  const built = useMemo(() => buildTheme(deferredVars, mode), [deferredVars, mode]);
  const version = useMemo(() => _.uniqueId('v'), [built]);
  const target = typeof entry.target === 'function' ? entry.target(p) : entry.target;
  const names = useMemo(() => styleNamesFor(built.theme, target), [built, target]);
  const changedVars = Object.keys(vars).filter(k => !_.isEqual(vars[k], baseline[k]));
  const overrideCount = Object.keys(_.omit(x, 'style')).length + (x.style ? 1 : 0);

  useEffect(() => {
    const onHash = () => setCurrent(initialName());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => { setApplied(null); }, [current]);

  // Glass is a theme variable like any other, but keep it across preset/mode switches so comparisons are easy.
  const keepGlass = (next, old) => ({ ...next, liquidGlass: old.liquidGlass });
  const setMode = m => { setModeRaw(m); setVars(old => keepGlass(m === 'app' ? presetVars(preset) : uiVars(), old)); };
  const setPreset = n => { setPresetRaw(n); setVars(old => keepGlass(presetVars(n), old)); };
  const glassOn = glassEnabled(vars);
  const setGlass = g => {
    setVars(old => ({ ...old, liquidGlass: g }));
    if (g !== 'off' && !frameBg.startsWith('photo')) setFrameBg('photo:0');
  };
  const pick = name => { setCurrent(name); try { history.replaceState(null, '', `#${slug(name)}`); } catch (e) { location.hash = slug(name); } };
  const setProp = (k, v) => setPropsMap(m => ({ ...m, [entry.name]: { ...m[entry.name], [k]: v } }));
  const resetDemo = () => {
    setPropsMap(m => ({ ...m, [entry.name]: defaultsFor(entry) }));
    setSnMap(m => ({ ...m, [entry.name]: { chips: (entry.defaultStyleName || '').split(' ').filter(Boolean), extra: '' } }));
  };
  const toggleChip = n => setSnMap(m => {
    const s = m[entry.name];
    const chips = s.chips.includes(n) ? s.chips.filter(c => c !== n) : [...s.chips, n];
    return { ...m, [entry.name]: { ...s, chips } };
  });
  const setExtra = extra => setSnMap(m => ({ ...m, [entry.name]: { ...m[entry.name], extra } }));
  const setVar = useCallback((path, v) => setVars(old => { const n = _.cloneDeep(old); _.set(n, path, v); return n; }), []);
  const onApply = (u, rs) => {
    const a = applyUsage(u, rs);
    setSnMap(m => ({ ...m, [entry.name]: { chips: a.chips.filter(c => names.includes(c)), extra: a.chips.filter(c => !names.includes(c)).join(' ') } }));
    if (u.ext) setX(a.x);
    setApplied(u.ext
      ? `Applied ${u.file.split('/').pop()}:${u.line}${rs ? `, with style resolved from ${rs.from}` : ''}${u.dynamic.filter(d => d.key !== 'style' || !rs).length ? '. Props computed at runtime were left out.' : '.'}`
      : `Applied styleName “${u.props.styleName}”.`);
  };

  const code = codeWithOverrides(entry.code ? entry.code(p, sn) : '', compName, x);
  const selectCode = () => { const el = document.getElementById('code-block'); if (!el) return; const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
  const copy = () => {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 1400); };
    try { navigator.clipboard.writeText(code).then(done, selectCode); } catch (e) { selectCode(); }
  };

  const visible = registry.filter(r => !filter || r.name.toLowerCase().includes(filter.toLowerCase()));
  const Demo = entry.Demo;
  const tabs = [
    ['props', 'Props', Object.keys(_.omit(x, 'style')).length],
    ['style', 'Style', x.style ? JSON.stringify(x.style).match(/":/g).length : 0],
    ['variants', 'Variants', sn ? sn.split(' ').length : 0],
    ['apps', 'In apps', USAGE_COUNT[compName] || 0],
    ['glass', 'Glass', GLASS_COMPONENTS[compName] && glassOn ? '✓' : 0],
    ['theme', 'Theme', changedVars.length],
  ];

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <span className="mark" aria-hidden="true" />
          <div>
            <h1>@shoutem/ui playground <span className="ver">v3</span></h1>
            <p>Real components · {mode === 'app' ? `Rubicon ${preset} app theme` : '@shoutem/ui default theme'} · liquid glass {glassOn ? vars.liquidGlass : 'off'} · {usages.length.toLocaleString()} usages from mobile-qa</p>
          </div>
        </div>
        <div className="top-meta">
          <div className="glass-switch" role="group" aria-label="Liquid glass (Builder theme option)">
            <span className="glass-label"><span className="glass-dot" aria-hidden="true" />Liquid glass</span>
            <div className="seg">
              {GLASS_VARIANTS.map(g => (
                <button type="button" key={g} className={vars.liquidGlass === g ? 'on' : ''} aria-pressed={vars.liquidGlass === g} onClick={() => setGlass(g)}>{_.capitalize(g)}</button>
              ))}
            </div>
          </div>
          <span className="pill">{registry.length} components</span>
          {changedVars.length > 0 && <button type="button" className="pill pill-warn" onClick={() => setTab('theme')}>{changedVars.length} theme {changedVars.length === 1 ? 'change' : 'changes'}</button>}
        </div>
      </header>

      <nav className="rail" aria-label="Components">
        <input type="search" id="comp-search" placeholder="Find a component" value={filter} onChange={e => setFilter(e.target.value)} />
        <select id="comp-select" className="rail-select" value={entry.name} onChange={e => pick(e.target.value)} aria-label="Component">
          {GROUPS.map(g => <optgroup key={g} label={g}>{registry.filter(r => r.group === g).map(r => <option key={r.name}>{r.name}</option>)}</optgroup>)}
        </select>
        <div className="rail-list">
          {GROUPS.map(g => {
            const items = visible.filter(r => r.group === g);
            if (!items.length) return null;
            return (
              <div key={g} className="rail-group">
                <h3>{g}</h3>
                {items.map(r => {
                  const n = USAGE_COUNT[r.name === 'Type scale' ? 'Text' : r.name === 'Text' ? 'Text' : r.name];
                  const hasX = Object.keys(xMap).some(k => k.startsWith(`${r.name}:`) && !_.isEmpty(xMap[k]));
                  return (
                    <button type="button" key={r.name} className={`rail-item ${r.name === entry.name ? 'on' : ''}`} onClick={() => pick(r.name)} aria-current={r.name === entry.name ? 'page' : undefined}>
                      <span>{r.name}{hasX && <span className="dot" title="Has overrides" />}{GLASS_COMPONENTS[r.name] && <span className={`gtag ${glassOn ? 'on' : ''}`} title="Gets liquid glass from the theme">glass</span>}</span>
                      {n ? <span className="rcount" title={`${n} usages in mobile-qa`}>{n}</span> : null}
                    </button>
                  );
                })}
              </div>
            );
          })}
          {!visible.length && <p className="hint">No component matches “{filter}”.</p>}
        </div>
      </nav>

      <main className="stage">
        <div className="stage-head">
          <div>
            <span className="eyebrow">{entry.group}</span>
            <h2>{entry.name}</h2>
          </div>
          <div className="stage-tools">
            {overrideCount > 0 && <button type="button" className="ghost sm" onClick={() => setX({})}>Clear overrides</button>}
            <label htmlFor="frame-bg" className="hint">Backdrop</label>
            <select id="frame-bg" value={frameBg} onChange={e => setFrameBg(e.target.value)}>
              <option value="paperColor">paperColor</option>
              <option value="backgroundColor">backgroundColor</option>
              {photos.map((ph, i) => <option key={ph.title} value={`photo:${i}`}>Photo: {ph.title}</option>)}
            </select>
          </div>
        </div>
        {entry.note && <p className="note">{entry.note}</p>}
        <div className="device">
          <div className="device-notch" aria-hidden="true" />
          <div className="device-screen" style={frameBg.startsWith('photo')
            ? { backgroundColor: vars.paperColor, backgroundImage: `url(${photos[+frameBg.split(':')[1]].source.uri})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { backgroundColor: vars[frameBg] }}>
            <SafeAreaProvider initialMetrics={SAFE_AREA}>
              <StyleProvider key={version} style={built.style}>
                <Boundary key={`${entry.name}-${version}-${JSON.stringify(x)}`}>
                  <Demo p={p} sn={sn} vars={deferredVars} x={x} />
                </Boundary>
                <Toast.Provider />
              </StyleProvider>
            </SafeAreaProvider>
          </div>
          <div className="device-caption mono">375 pt · {target || 'no theme key'}</div>
        </div>
        <section className="code">
          <div className="code-head">
            <h4>JSX</h4>
            <button type="button" className="ghost" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
          <pre id="code-block" className="mono">{code}</pre>
        </section>
      </main>

      <aside className="inspector" aria-label="Inspector">
        <div className="tabs" role="tablist">
          {tabs.map(([k, l, n]) => (
            <button type="button" role="tab" key={k} aria-selected={tab === k} className={`tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>
              {l}{n ? <span className="tcount">{n}</span> : null}
            </button>
          ))}
        </div>
        <div className="panel">
          {tab === 'props' && <PropsPanel entry={entry} p={p} setProp={setProp} resetDemo={resetDemo} compName={compName} x={x} setX={setX} />}
          {tab === 'style' && <StylePanel theme={built.theme} target={entry.styleNameDisabled && entry.name !== 'Toast' ? null : target} compName={compName} x={x} setX={setX} />}
          {tab === 'variants' && <StyleNamePanel names={names} selected={snState.chips} toggle={toggleChip} extra={snState.extra} setExtra={setExtra} disabled={entry.styleNameDisabled || !target} target={target} />}
          {tab === 'apps' && <UsagesPanel compName={compName} built={built} onApply={onApply} applied={applied} />}
          {tab === 'glass' && <GlassPanel compName={entry.name === 'Glass showcase' ? null : (entry.name === 'Toast' ? 'Toast' : compName)} vars={vars} setGlass={setGlass} pick={pick} openTheme={() => setTab('theme')} />}
          {tab === 'theme' && <ThemePanel mode={mode} setMode={setMode} preset={preset} setPreset={setPreset} vars={vars} setVar={setVar} baseline={baseline} failed={built.failed}
            reset={() => setVars(mode === 'app' ? presetVars(preset) : uiVars())} />}
        </div>
      </aside>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
