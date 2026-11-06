import React, { useEffect, useState } from 'react';

export const isColor = v => typeof v === 'string' && /^(#|rgb|hsl)/i.test(v.trim());

export function toHex(v) {
  if (!v || typeof v !== 'string') return '#000000';
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  if (/^#[0-9a-f]{8}$/i.test(v)) return v.slice(0, 7);
  if (/^#[0-9a-f]{3}$/i.test(v)) return '#' + v.slice(1).split('').map(x => x + x).join('');
  const m = v.match(/rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/i);
  if (m) return '#' + [m[1], m[2], m[3]].map(n => (+n).toString(16).padStart(2, '0')).join('');
  return '#000000';
}

export function ColorInput({ id, value, onChange, placeholder }) {
  const alphaMatch = typeof value === 'string' && value.match(/rgba\([^)]*,\s*([\d.]+)\s*\)/i);
  const shown = value || placeholder;
  return (
    <div className="color">
      <span className="swatch" style={{ background: isColor(shown) ? shown : 'transparent' }}>
        <input aria-label="Pick color" type="color" value={toHex(shown)}
          onChange={e => {
            const hex = e.target.value;
            if (alphaMatch) {
              const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
              onChange(`rgba(${r}, ${g}, ${b}, ${alphaMatch[1]})`);
            } else onChange(hex);
          }} />
      </span>
      <input id={id} type="text" className="mono" value={value || ''} placeholder={placeholder || ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

export function JsonInput({ id, value, onChange, rows, placeholder }) {
  const fmt = v => (v === undefined ? '' : JSON.stringify(v, null, 2));
  const [draft, setDraft] = useState(() => fmt(value));
  const [err, setErr] = useState(null);
  const [focused, setFocused] = useState(false);
  useEffect(() => { if (!focused) { setDraft(fmt(value)); setErr(null); } }, [value]); // eslint-disable-line
  return (
    <>
      <textarea id={id} className="mono" rows={rows || Math.min(10, Math.max(2, draft.split('\n').length))} value={draft} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onChange={e => {
          const v = e.target.value;
          setDraft(v);
          if (!v.trim()) { onChange(undefined); setErr(null); return; }
          try { onChange(JSON.parse(v)); setErr(null); } catch (x) { setErr('Not valid JSON yet. The preview keeps the last valid value.'); }
        }} />
      {err && <span className="err">{err}</span>}
    </>
  );
}

// Demo controls (always have a value).
export function Field({ c, value, onChange }) {
  const id = `ctl-${c.key}`;
  const label = <label htmlFor={id}>{c.label || c.key}</label>;
  switch (c.type) {
    case 'bool':
      return (
        <div className="field field-bool">
          <input id={id} type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} />
          {label}
        </div>
      );
    case 'number':
      return (
        <div className="field">
          {label}
          <div className="num">
            {c.min !== undefined && c.max !== undefined && (
              <input aria-label={`${c.key} slider`} type="range" min={c.min} max={c.max} step={c.step || 1} value={value} onChange={e => onChange(+e.target.value)} />
            )}
            <input id={id} type="number" min={c.min} max={c.max} step={c.step || 1} value={value} onChange={e => onChange(e.target.value === '' ? 0 : +e.target.value)} />
          </div>
        </div>
      );
    case 'select':
      return (
        <div className="field">
          {label}
          <select id={id} value={value} onChange={e => onChange(e.target.value)}>
            {c.options.map(o => <option key={o} value={o}>{o === '' ? '(none)' : String(o)}</option>)}
          </select>
        </div>
      );
    case 'color':
      return <div className="field">{label}<ColorInput id={id} value={value} onChange={onChange} placeholder="theme default" /></div>;
    case 'textarea':
      return <div className="field">{label}<textarea id={id} rows={4} value={value} onChange={e => onChange(e.target.value)} /></div>;
    case 'json':
      return <div className="field"><label htmlFor={id}>{c.label || c.key} <span className="hint">JSON</span></label><JsonInput id={id} value={value} onChange={v => v !== undefined && onChange(v)} /></div>;
    default:
      return <div className="field">{label}<input id={id} type="text" value={value} onChange={e => onChange(e.target.value)} /></div>;
  }
}

// Optional override: empty means "not passed", so the component's own default applies.
export function OptField({ id, name, meta, value, onChange, placeholder, required }) {
  const set = value !== undefined;
  const clear = set ? <button type="button" className="x" aria-label={`Unset ${name}`} title="Unset" onClick={() => onChange(undefined)}>×</button> : null;
  const head = (
    <div className="opt-head">
      <label htmlFor={id} className={set ? 'is-set' : ''}>{name}{required && <span className="req" title="Required">*</span>}</label>
      <span className="opt-type">{meta.type === 'enum' ? 'enum' : meta.type}</span>
      {clear}
    </div>
  );
  let input;
  switch (meta.type) {
    case 'bool':
      input = (
        <div className="seg" role="group" aria-labelledby={id}>
          {[['unset', undefined], ['true', true], ['false', false]].map(([l, v]) => (
            <button type="button" key={l} id={l === 'unset' ? id : undefined} className={value === v ? 'on' : ''} onClick={() => onChange(v)}>{l === 'unset' ? (placeholder !== undefined ? `default (${placeholder})` : 'unset') : l}</button>
          ))}
        </div>
      );
      break;
    case 'number':
      input = (
        <div className="num">
          {meta.min !== undefined && meta.max !== undefined && (
            <input aria-label={`${name} slider`} type="range" min={meta.min} max={meta.max} step={meta.step || 1} value={set ? value : (typeof placeholder === 'number' ? placeholder : meta.min)} onChange={e => onChange(+e.target.value)} />
          )}
          <input id={id} type="number" step={meta.step || 'any'} value={set ? value : ''} placeholder={placeholder !== undefined ? String(placeholder) : ''} onChange={e => onChange(e.target.value === '' ? undefined : +e.target.value)} />
        </div>
      );
      break;
    case 'enum':
      input = (
        <select id={id} value={set ? JSON.stringify(value) : ''} onChange={e => onChange(e.target.value === '' ? undefined : JSON.parse(e.target.value))}>
          <option value="">{placeholder !== undefined ? `default (${placeholder})` : '(unset)'}</option>
          {meta.options.map(o => <option key={String(o)} value={JSON.stringify(o)}>{String(o)}</option>)}
        </select>
      );
      break;
    case 'color':
      input = <ColorInput id={id} value={value} onChange={v => onChange(v === '' ? undefined : v)} placeholder={placeholder !== undefined ? String(placeholder) : ''} />;
      break;
    case 'json':
      input = <JsonInput id={id} value={value} onChange={onChange} placeholder={placeholder !== undefined ? JSON.stringify(placeholder) : 'JSON'} />;
      break;
    default:
      input = <input id={id} type="text" value={set ? value : ''} placeholder={placeholder !== undefined ? String(placeholder) : ''} onChange={e => onChange(e.target.value === '' ? undefined : e.target.value)} />;
  }
  return (
    <div className={`field opt ${set ? 'set' : ''}`}>
      {head}
      {input}
      {meta.doc && <span className="doc">{meta.doc}</span>}
    </div>
  );
}
