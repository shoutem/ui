import React, { useMemo, useState } from 'react';
import _ from 'lodash';
import { defaultThemeVariables } from '@shoutem/ui';
import propsMeta from './data/props.json';
import rubicon from './data/rubicon.json';
import usages from './data/usages.json';
import { BASE, RN_PROPS, STYLE_PROPS, STYLE_TYPE } from './data/rn';
import { ColorInput, Field, isColor, OptField } from './controls';
import { GLASS_COMPONENTS as GLASS_KEYS, glassOverridesFor } from './glass';

// ───────────────── prop schema per component
const OWNERS = {
  DropDownMenu: ['DropDownMenu', 'DropDownModal'],
  Heading: ['Text'], Title: ['Text'], Subtitle: ['Text'], Caption: ['Text'],
  Toast: ['BaseToast'],
};
const EXTRA_BASE = { NumberInput: 'TextInput' };
const HIDDEN = new Set(['style', 'children', 'key', 'ref']);

export function propSchema(compName) {
  const owners = OWNERS[compName] || [compName];
  const own = {};
  const defaults = {};
  owners.forEach(o => {
    const m = propsMeta[o];
    if (!m) return;
    Object.assign(own, m.props);
    Object.entries(m.defaults).forEach(([k, v]) => { if (v !== 'undefined' && v !== 'null' && v !== null && v !== undefined) defaults[k] = v; });
  });
  const base = BASE[compName] || EXTRA_BASE[compName];
  const inherited = base ? _.omit(RN_PROPS[base] || {}, Object.keys(own)) : {};
  const editable = {};
  const callbacks = [];
  Object.entries(own).forEach(([k, m]) => {
    if (HIDDEN.has(k)) return;
    if (m.type === 'func' || m.type === 'node') callbacks.push({ key: k, ...m });
    else editable[k] = { ...m, type: m.type === 'string' ? 'string' : m.type === 'any' ? 'json' : m.type };
  });
  return { own: editable, callbacks, inherited, base, defaults };
}

// ───────────────── Props
export function PropsPanel({ entry, p, setProp, resetDemo, compName, x, setX }) {
  const schema = useMemo(() => propSchema(compName), [compName]);
  const [q, setQ] = useState('');
  const match = k => !q || k.toLowerCase().includes(q.toLowerCase());
  const setCount = Object.keys(_.omit(x, 'style')).length;
  const setOne = (k, v) => setX(old => {
    const n = { ...old };
    if (v === undefined) delete n[k]; else n[k] = v;
    return n;
  });
  const ownKeys = Object.keys(schema.own).filter(match);
  const inhKeys = Object.keys(schema.inherited).filter(match);
  return (
    <div className="props">
      <section className="psec">
        <h4>Demo content</h4>
        <p className="lede">Sample content for the preview. These aren't the component's props.</p>
        {entry.controls.length === 0 && <p className="hint">This demo has no content controls.</p>}
        {entry.controls.map(c => <Field key={`${entry.name}-${c.key}`} c={c} value={p[c.key]} onChange={v => setProp(c.key, v)} />)}
        <button type="button" className="ghost wide" onClick={resetDemo}>Reset demo content</button>
      </section>

      <section className="psec">
        <div className="psec-head">
          <h4>{compName} props</h4>
          {setCount > 0 && <button type="button" className="ghost sm" onClick={() => setX(old => _.pick(old, 'style'))}>Clear {setCount}</button>}
        </div>
        <p className="lede">Every prop the component accepts, read from its propTypes. Values you set here are passed as real props and override the demo's values. An empty field means the prop isn't passed.</p>
        <input type="search" id="prop-search" placeholder="Filter props" value={q} onChange={e => setQ(e.target.value)} />
        {ownKeys.length === 0 && Object.keys(schema.own).length === 0 && <p className="hint">{compName} declares no editable propTypes of its own.</p>}
        {ownKeys.map(k => (
          <OptField key={`${compName}-${k}`} id={`op-${k}`} name={k} meta={schema.own[k]} value={x[k]} onChange={v => setOne(k, v)} placeholder={schema.defaults[k]} required={schema.own[k].required} />
        ))}
        {schema.callbacks.length > 0 && (
          <div className="callbacks">
            <span className="hint">Callbacks and render props are wired by the demo:</span>
            <div className="chips tight">{schema.callbacks.map(c => <code key={c.key} title={c.doc || c.raw}>{c.key}</code>)}</div>
          </div>
        )}
      </section>

      {schema.base && (
        <section className="psec">
          <h4>Inherited from React Native {schema.base}</h4>
          <p className="lede">{compName} passes these on to the underlying <code>{schema.base}</code>.</p>
          {inhKeys.map(k => (
            <OptField key={`${compName}-rn-${k}`} id={`rp-${k}`} name={k} meta={schema.inherited[k]} value={x[k]} onChange={v => setOne(k, v)} />
          ))}
        </section>
      )}
    </div>
  );
}

// ───────────────── Style
const isStyleProp = k => k in STYLE_TYPE;
const isChildComponent = k => /^shoutem\./.test(k) || /^[a-z]+\.[a-z]/i.test(k);

function typeFor(key, value) {
  const t = STYLE_TYPE[key];
  if (Array.isArray(t)) return { type: 'enum', options: t };
  if (t === 'color') return { type: 'color' };
  if (t === 'number') return { type: 'number' };
  if (t === 'bool') return { type: 'bool' };
  if (t === 'json') return { type: 'json' };
  if (typeof value === 'number') return { type: 'number' };
  if (isColor(value)) return { type: 'color' };
  if (typeof value === 'boolean') return { type: 'bool' };
  if (value && typeof value === 'object') return { type: 'json' };
  return { type: 'string' };
}

function splitStyle(obj) {
  const props = {};
  const parts = {};
  const children = {};
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (k.startsWith('.') || typeof v === 'function' || typeof k === 'symbol') return;
    if (isChildComponent(k)) children[k] = v;
    else if (_.isPlainObject(v) && !isStyleProp(k)) parts[k] = v;
    else props[k] = v;
  });
  return { props, parts, children };
}

function StyleGroup({ title, kind, path, themeObj, overObj, setAt, depth, defaultOpen }) {
  const t = splitStyle(themeObj);
  const o = splitStyle(overObj);
  const propKeys = _.uniq([...Object.keys(t.props), ...Object.keys(o.props)]);
  const partKeys = _.uniq([...Object.keys(t.parts), ...Object.keys(o.parts)]);
  const childKeys = _.uniq([...Object.keys(t.children), ...Object.keys(o.children)]);
  const overrides = overObj ? JSON.stringify(overObj).match(/":/g)?.length || 0 : 0;
  const pathId = path.join('-') || 'root';
  const add = e => {
    const k = e.target.value;
    if (!k) return;
    const tv = t.props[k];
    const meta = typeFor(k, tv);
    setAt([...path, k], tv !== undefined ? tv : meta.type === 'number' ? 0 : meta.type === 'color' ? '#659CEC' : meta.type === 'enum' ? meta.options[0] : meta.type === 'bool' ? true : meta.type === 'json' ? {} : '');
    e.target.value = '';
  };
  return (
    <details className={`sgroup sg-${kind} ${overrides ? 'dirty' : ''}`} open={defaultOpen}>
      <summary>
        <span className="sg-kind">{kind}</span>
        <span className="mono sg-title">{title}</span>
        <span className="sg-count">{propKeys.length + partKeys.length + childKeys.length}{overrides ? ` · ${overrides} set` : ''}</span>
      </summary>
      <div className="sg-body">
        {propKeys.map(k => (
          <OptField key={k} id={`st-${pathId}-${k}`} name={k} meta={typeFor(k, t.props[k] !== undefined ? t.props[k] : o.props[k])}
            value={o.props[k]} placeholder={t.props[k] !== undefined ? (typeof t.props[k] === 'object' ? JSON.stringify(t.props[k]) : t.props[k]) : undefined}
            onChange={v => setAt([...path, k], v)} />
        ))}
        <select className="add-prop" aria-label={`Add style property to ${title}`} defaultValue="" onChange={add}>
          <option value="">+ Add style property…</option>
          {Object.entries(STYLE_PROPS).map(([g, ps]) => (
            <optgroup key={g} label={g}>{Object.keys(ps).filter(k => !propKeys.includes(k)).map(k => <option key={k}>{k}</option>)}</optgroup>
          ))}
        </select>
        {depth < 4 && partKeys.map(k => (
          <StyleGroup key={k} title={k} kind="part" path={[...path, k]} themeObj={t.parts[k]} overObj={o.parts[k]} setAt={setAt} depth={depth + 1} />
        ))}
        {depth < 4 && childKeys.map(k => (
          <StyleGroup key={k} title={k.replace(/^shoutem\.ui\./, '')} kind="child" path={[...path, k]} themeObj={t.children[k]} overObj={o.children[k]} setAt={setAt} depth={depth + 1} />
        ))}
      </div>
    </details>
  );
}

export function StylePanel({ theme, target, compName, x, setX }) {
  const resolved = useMemo(() => {
    if (!target) return {};
    try { return theme.createComponentStyle(target, {}); } catch (e) { return {}; }
  }, [theme, target]);
  const over = x.style || {};
  const setAt = (path, v) => setX(old => {
    const n = _.cloneDeep(old);
    if (v === undefined) {
      _.unset(n, ['style', ...path]);
      for (let i = path.length - 1; i >= 0; i--) {
        const parent = _.get(n, ['style', ...path.slice(0, i)]);
        if (parent && _.isEmpty(parent)) _.unset(n, ['style', ...path.slice(0, i)]);
      }
      if (n.style && _.isEmpty(n.style)) delete n.style;
    } else _.set(n, ['style', ...path], v);
    return n;
  });
  if (!target) return <p className="lede">This entry has no themed component to style.</p>;
  const { parts, children } = splitStyle(resolved);
  return (
    <div>
      <div className="psec-head">
        <p className="lede">The <code>style</code> prop for <code>{compName}</code>, merged over the theme's <code>{target}</code> style like <code>connectStyle</code> does. Grey placeholders show the current theme values. Set a value to override it.</p>
      </div>
      {x.style && <button type="button" className="ghost wide" onClick={() => setX(old => _.omit(old, 'style'))}>Clear style overrides</button>}
      <div className="sg-legend"><span className="sg-kind">root</span> the component itself · <span className="sg-kind">part</span> named sub-element (e.g. container, icon) · <span className="sg-kind">child</span> nested component style passed down</div>
      <StyleGroup title={target.replace(/^shoutem\.ui\./, '')} kind="root" path={[]} themeObj={resolved} overObj={over} setAt={setAt} depth={0} defaultOpen />
      {Object.keys(parts).length + Object.keys(children).length === 0 && <p className="hint">The theme defines no parts or child styles for this component. You can still add root style properties above.</p>}
    </div>
  );
}

// ───────────────── In apps (usages from mobile-qa)
const IGNORE_APPLY = new Set(['styleName', 'children', 'key', 'ref']);

export function resolveUsageStyle(u, built) {
  const d = u.dynamic.find(dd => dd.key === 'style');
  if (!d) return null;
  const m = d.expr.match(/^(?:this\.props\.|props\.)?styles?\.([\w.]+)$/);
  if (!m) return null;
  const path = m[1].split('.');
  const candidates = Object.keys(built.style).filter(k => k.startsWith(`${u.ext}.`));
  for (const key of candidates) {
    let comp;
    try { comp = built.theme.createComponentStyle(key, {}); } catch (e) { continue; }
    const v = _.get(comp, path);
    if (_.isPlainObject(v)) {
      const clean = JSON.parse(JSON.stringify(_.omitBy(v, (vv, kk) => kk.startsWith('.'))));
      return { from: `${key} → ${m[1]}`, style: clean };
    }
  }
  return null;
}

export function UsagesPanel({ compName, built, onApply, applied }) {
  const list = useMemo(() => usages.filter(u => u.c === compName), [compName]);
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(40);
  const stats = useMemo(() => {
    const sn = {};
    const pk = {};
    list.forEach(u => {
      if (typeof u.props.styleName === 'string' && u.props.styleName.trim()) sn[u.props.styleName.trim()] = (sn[u.props.styleName.trim()] || 0) + 1;
      [...Object.keys(u.props), ...u.dynamic.map(d => d.key)].forEach(k => { pk[k] = (pk[k] || 0) + 1; });
    });
    return {
      sn: Object.entries(sn).sort((a, b) => b[1] - a[1]).slice(0, 14),
      pk: Object.entries(pk).sort((a, b) => b[1] - a[1]).slice(0, 14),
      exts: _.uniq(list.map(u => u.ext)).length,
    };
  }, [list]);
  if (!list.length) {
    return <p className="lede">No JSX usages of <code>{compName}</code> were found in the mobile-qa extensions.</p>;
  }
  const filtered = list.filter(u => !q || `${u.ext} ${u.file} ${JSON.stringify(u.props)} ${u.dynamic.map(d => d.key + d.expr).join(' ')}`.toLowerCase().includes(q.toLowerCase()));
  const groups = _.groupBy(filtered.slice(0, limit), 'ext');
  const maxP = stats.pk.length ? stats.pk[0][1] : 1;
  return (
    <div>
      <p className="lede"><strong>{list.length}</strong> usages of <code>{compName}</code> in <strong>{stats.exts}</strong> mobile-qa extensions. <strong>Apply</strong> loads a usage's styleName and literal props into the playground. When its <code>style</code> is a theme reference like <code>style.button</code>, it's looked up in the app theme.</p>
      {applied && <p className="applied">{applied}</p>}
      {stats.sn.length > 0 && (
        <section className="psec">
          <h4>Most used styleNames</h4>
          <div className="chips tight">
            {stats.sn.map(([s, c]) => <button type="button" key={s} className="chip" onClick={() => onApply({ props: { styleName: s }, dynamic: [] }, null)}>{s} <span className="cnt">{c}</span></button>)}
          </div>
        </section>
      )}
      <section className="psec">
        <h4>Props passed in apps</h4>
        <div className="bars">
          {stats.pk.map(([k, c]) => (
            <div key={k} className="bar"><span className="mono">{k}</span><span className="track"><span style={{ width: `${(c / maxP) * 100}%` }} /></span><span className="cnt">{c}</span></div>
          ))}
        </div>
      </section>
      <section className="psec">
        <h4>Usages</h4>
        <input type="search" id="usage-search" placeholder="Filter by extension, file, prop or value" value={q} onChange={e => setQ(e.target.value)} />
        {Object.entries(groups).map(([ext, us]) => (
          <details key={ext} className="ugroup" open={Object.keys(groups).length <= 3}>
            <summary><span className="mono">{ext}</span><span className="sg-count">{us.length}</span></summary>
            {us.map((u, i) => {
              const rs = resolveUsageStyle(u, built);
              return (
                <div key={i} className="usage">
                  <div className="usage-head">
                    <span className="mono path" title={u.file}>{u.file.split('/').slice(-2).join('/')}:{u.line}</span>
                    <button type="button" className="ghost sm" onClick={() => onApply(u, rs)}>Apply</button>
                  </div>
                  <pre className="mono usage-code">{usageCode(u, rs)}</pre>
                </div>
              );
            })}
          </details>
        ))}
        {filtered.length > limit && <button type="button" className="ghost wide" onClick={() => setLimit(limit + 80)}>Show more ({filtered.length - limit} left)</button>}
        {!filtered.length && <p className="hint">No usage matches “{q}”.</p>}
      </section>
    </div>
  );
}

function usageCode(u, rs) {
  const parts = Object.entries(u.props).map(([k, v]) => (v === true ? k : typeof v === 'string' ? `${k}="${v}"` : `${k}={${JSON.stringify(v)}}`));
  u.dynamic.forEach(d => parts.push(`${d.key}={${d.expr}}${d.key === 'style' && rs ? '  ✓' : ''}`));
  if (u.spread) parts.push('{...spread}');
  return `<${u.c}${parts.length ? ' ' + parts.join(' ') : ''} />`;
}

export function applyUsage(u, rs) {
  const sn = typeof u.props.styleName === 'string' ? u.props.styleName : '';
  const x = _.omitBy(u.props, (v, k) => IGNORE_APPLY.has(k));
  if (rs) x.style = rs.style;
  return { chips: sn.split(/\s+/).filter(Boolean), x };
}

// ───────────────── Theme
const FONT_FAMILIES = ['Rubik-Regular', 'Rubik-Light', 'Rubik-Medium', 'Rubik-Bold', 'Rubik-Italic', 'Rubik-BoldItalic', 'NotoSans', 'NotoSerif'];
const FONT_WEIGHTS = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
const SKIP_VARS = new Set(['sizes']);

function FontEditor({ k, v, setVar, constraints, title, dirty, open }) {
  const fs = (constraints && constraints.fontSize) || {};
  return (
    <details className={`tobj ${dirty ? 'dirty' : ''}`} open={open}>
      <summary>
        <span><span className="tlabel">{title || k}</span>{title && <span className="mono tkey">{k}</span>}</span>
        <span className="tprev" style={{ fontFamily: v.fontFamily, color: v.color, fontSize: Math.min(v.fontSize || 14, 18) }}>Aa {v.fontSize}</span>
      </summary>
      <div className="tobj-body">
        <div className="field"><label htmlFor={`tv-${k}-fs`}>fontSize{fs.minimum !== undefined && <span className="hint"> {fs.minimum}–{fs.maximum}</span>}</label><input id={`tv-${k}-fs`} type="number" min={fs.minimum} max={fs.maximum} value={v.fontSize} onChange={e => setVar([k, 'fontSize'], +e.target.value)} /></div>
        <div className="field"><label htmlFor={`tv-${k}-fw`}>fontWeight</label><select id={`tv-${k}-fw`} value={v.fontWeight} onChange={e => setVar([k, 'fontWeight'], e.target.value)}>{FONT_WEIGHTS.map(o => <option key={o}>{o}</option>)}</select></div>
        <div className="field"><label htmlFor={`tv-${k}-fst`}>fontStyle</label><select id={`tv-${k}-fst`} value={v.fontStyle} onChange={e => setVar([k, 'fontStyle'], e.target.value)}><option>normal</option><option>italic</option></select></div>
        <div className="field"><label htmlFor={`tv-${k}-ff`}>fontFamily</label><select id={`tv-${k}-ff`} value={v.fontFamily} onChange={e => setVar([k, 'fontFamily'], e.target.value)}>{_.uniq([v.fontFamily, ...FONT_FAMILIES]).map(o => <option key={o}>{o}</option>)}</select></div>
        <div className="field"><label htmlFor={`tv-${k}-c`}>color</label><ColorInput id={`tv-${k}-c`} value={v.color} onChange={val => setVar([k, 'color'], val)} /></div>
      </div>
    </details>
  );
}

function VarRow({ k, v, setVar, title, dirty, enumOpts }) {
  return (
    <div className={`trow ${dirty ? 'dirty' : ''}`}>
      <label htmlFor={`tv-${k}`}><span className="tlabel">{title || k}</span>{title && <span className="mono tkey">{k}</span>}</label>
      {enumOpts
        ? <select id={`tv-${k}`} value={v} onChange={e => setVar([k], e.target.value)}>{enumOpts.map(o => <option key={o}>{o}</option>)}</select>
        : isColor(v) || (typeof v === 'string' && v === '')
          ? <ColorInput id={`tv-${k}`} value={v} onChange={val => setVar([k], val)} />
          : typeof v === 'number'
            ? <input id={`tv-${k}`} type="number" value={v} onChange={e => setVar([k], +e.target.value)} />
            : <input id={`tv-${k}`} type="text" value={v ?? ''} onChange={e => setVar([k], e.target.value)} />}
    </div>
  );
}

export function ThemePanel({ mode, setMode, preset, setPreset, vars, setVar, baseline, reset, failed }) {
  const [q, setQ] = useState('');
  const changed = Object.keys(vars).filter(k => !_.isEqual(vars[k], baseline[k]));
  const match = (k, title) => !q || k.toLowerCase().includes(q.toLowerCase()) || (title || '').toLowerCase().includes(q.toLowerCase());
  const schema = rubicon.schema;
  const renderVar = (k, title) => {
    const v = vars[k];
    if (v === undefined || SKIP_VARS.has(k)) return null;
    const meta = schema.properties[k] || {};
    if (_.isPlainObject(v)) return <FontEditor key={k} k={k} v={v} setVar={setVar} constraints={meta.constraints} title={title} dirty={changed.includes(k)} open={!!q} />;
    const enumOpts = meta.format === 'dropdown' ? (meta.constraints?.dropdownValue?.enum || ['light', 'dark']) : null;
    return <VarRow key={k} k={k} v={v} setVar={setVar} title={title} dirty={changed.includes(k)} enumOpts={enumOpts} />;
  };
  let sections;
  if (mode === 'app') {
    const inSchema = new Set(Object.keys(schema.properties));
    sections = schema.sections.map(s => [s.title, s.properties.filter(k => match(k, schema.properties[k]?.title)).map(k => renderVar(k, schema.properties[k]?.title))]);
    rubicon.extensions.forEach(e => {
      const keys = Object.keys(e.defaults).filter(k => !inSchema.has(k) && match(k, e.properties[k]?.title));
      keys.forEach(k => inSchema.add(k));
      sections.push([`${e.ext.replace('shoutem.', '')} extension`, keys.map(k => renderVar(k, e.properties[k]?.title))]);
    });
    const others = Object.keys(vars).filter(k => !inSchema.has(k) && !SKIP_VARS.has(k) && match(k));
    sections.push(['Other @shoutem/ui variables', others.map(k => renderVar(k))]);
  } else {
    const keys = Object.keys(defaultThemeVariables).filter(k => match(k));
    sections = [
      ['Colors', keys.filter(k => isColor(defaultThemeVariables[k])).map(k => renderVar(k))],
      ['Typography', keys.filter(k => _.isPlainObject(defaultThemeVariables[k])).map(k => renderVar(k))],
      ['Spacing', keys.filter(k => typeof defaultThemeVariables[k] === 'number').map(k => renderVar(k))],
      ['Other', keys.filter(k => typeof defaultThemeVariables[k] === 'string' && !isColor(defaultThemeVariables[k])).map(k => renderVar(k))],
    ];
  }
  return (
    <div className="theme-ed">
      <div className="seg seg-wide" role="group" aria-label="Theme source">
        <button type="button" className={mode === 'app' ? 'on' : ''} onClick={() => setMode('app')}>App theme (Rubicon)</button>
        <button type="button" className={mode === 'ui' ? 'on' : ''} onClick={() => setMode('ui')}>@shoutem/ui defaults</button>
      </div>
      {mode === 'app' ? (
        <>
          <div className="field">
            <label htmlFor="preset">Rubicon preset</label>
            <select id="preset" value={preset} onChange={e => setPreset(e.target.value)}>
              {Object.keys(rubicon.presets).map(n => <option key={n}>{n}</option>)}
            </select>
          </div>
          <p className="lede">This is the theme a real app uses: <code>getTheme()</code> merged with every extension's <code>app/themes/style.js</code> ({Object.keys(rubicon.presets).length} presets, the same sections and labels as the Builder's theme settings).{failed.length > 0 && <> Skipped: {failed.map(f => <code key={f.name} title={f.message}>{f.name}</code>)}.</>}</p>
        </>
      ) : (
        <p className="lede">Plain <code>@shoutem/ui</code>: <code>defaultThemeVariables</code> and <code>getTheme()</code>, with no extension styles.</p>
      )}
      <div className="theme-bar">
        <input type="search" id="theme-search" placeholder="Filter variables, e.g. button" value={q} onChange={e => setQ(e.target.value)} />
        <button type="button" className="ghost" onClick={reset} disabled={!changed.length}>Reset{changed.length ? ` (${changed.length})` : ''}</button>
      </div>
      {sections.map(([title, items]) => items.filter(Boolean).length > 0 && (
        <section key={title} className="tgroup">
          <h4>{title}</h4>
          {items}
        </section>
      ))}
    </div>
  );
}

// ───────────────── Liquid glass
const NOT_YET = {
  Card: 'Content surface. Glass is for controls that float above content, not the content itself.',
  Tile: 'Content surface, same reason as Card.',
  Row: 'List content. Glass rows would blur each other and hurt readability.',
  ListView: 'Content, not a control.',
  Switch: 'Good candidate for a second pass. Needs a custom thumb, not just theme styles.',
  DropDownMenu: 'Good candidate for a second pass (the modal list). It renders full-screen, so it needs layout work first.',
  CategoryPicker: 'Good candidate for a second pass, as a capsule row like TabMenu.',
  PageIndicators: 'Good candidate for a second pass: dots inside a small glass capsule.',
  ImageGalleryOverlay: 'Good candidate for a second pass (gallery header and footer).',
};
const PLATFORM_ROWS = [
  ['iOS 26+', 'Native Liquid Glass (UIGlassEffect) through expo-glass-effect or @callstack/liquid-glass'],
  ['iOS < 26', 'UIBlurEffect (systemMaterial) plus the tint fill'],
  ['Android', 'Blur view on API 31+, plain translucent tint below that'],
  ['Web', 'CSS: translucent fill + backdrop-filter (what you see here)'],
];

export function GlassPanel({ compName, vars, setGlass, pick, openTheme }) {
  const on = vars.liquidGlass && vars.liquidGlass !== 'off';
  const supported = compName && GLASS_KEYS[compName];
  const overrides = supported ? glassOverridesFor(vars, compName) : null;
  return (
    <div className="glass-panel">
      <div className={`gstatus ${on ? 'on' : ''}`}>
        <strong>{on ? `Glass is on (${vars.liquidGlass})` : 'Glass is off'}</strong>
        <span>{on ? 'Builder default is Off. Every app that never sets it keeps today’s look.' : 'This is the Builder default. The theme is exactly what apps get today.'}</span>
        <div className="seg">
          {['off', 'regular', 'clear'].map(g => <button type="button" key={g} className={vars.liquidGlass === g ? 'on' : ''} onClick={() => setGlass(g)}>{_.capitalize(g)}</button>)}
        </div>
      </div>

      {compName && (supported ? (
        <section className="psec">
          <h4>{compName} with glass</h4>
          <p className="lede">When the option is on, <code>getTheme()</code> merges these over its base styles. Variants you set (<code>styleName</code>) and extension themes still apply on top. The <code>glass</code> key tells the component to draw the platform material behind its content.</p>
          <pre className="mono gcode">{JSON.stringify(overrides, null, 2)}</pre>
        </section>
      ) : (
        <section className="psec">
          <h4>{compName} has no glass yet</h4>
          <p className="lede">{NOT_YET[compName] || 'Not part of the first pass. It renders exactly as it does without glass.'}</p>
        </section>
      ))}

      <section className="psec">
        <h4>First pass: {Object.keys(GLASS_KEYS).length} components</h4>
        <div className="chips">
          {['Glass showcase', ...Object.keys(GLASS_KEYS)].map(n => <button type="button" key={n} className={`chip ${n === compName ? 'on' : ''}`} onClick={() => pick(n)}>{n}</button>)}
        </div>
      </section>

      <section className="psec">
        <h4>How it renders per platform</h4>
        <table className="gtable"><tbody>
          {PLATFORM_ROWS.map(([a, b]) => <tr key={a}><th scope="row">{a}</th><td>{b}</td></tr>)}
        </tbody></table>
      </section>

      <section className="psec">
        <h4>Builder option</h4>
        <p className="lede">One new theme variable, <code>liquidGlass</code> (dropdown: off, regular, clear), in a new <strong>Liquid glass</strong> section of the theme settings. No new colors: each surface is tinted with the color it already has, so text contrast stays what the theme designer chose. <button type="button" className="linkish" onClick={openTheme}>See it in the Theme tab</button>.</p>
      </section>
    </div>
  );
}
