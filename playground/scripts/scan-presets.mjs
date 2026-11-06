// Turns rubicon-theme variable schemas (Prime/Bleu/Noir/Rose) into resolved presets + editor schema.
import fs from 'fs';
import path from 'path';
import { EXTENSIONS, PLAYGROUND as here } from '../paths.mjs';
const DIR = path.join(EXTENSIONS, 'shoutem.rubicon-theme/server');
const files = { Prime: 'primeThemeVariables.json', Bleu: 'bleuThemeVariables.json', Noir: 'noirThemeVariables.json', Rose: 'roseThemeVariables.json' };
const out = { presets: {}, schema: null };
for (const [name, f] of Object.entries(files)) {
  const d = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  const values = {};
  const props = {};
  for (const [k, def] of Object.entries(d.properties)) {
    const fmt = def.format && d.formats[def.format];
    let v = def.default;
    if (fmt && fmt.default && typeof fmt.default === 'object') v = { ...fmt.default, ...(v || {}) };
    else if (v === undefined && fmt) v = fmt.default;
    if (def.format === 'dropdown' && v && typeof v === 'object' && 'dropdownValue' in v) v = v.dropdownValue;
    values[k] = v;
    const constraints = { ...(fmt && fmt.constraints), ...(def.constraints || {}) };
    if (def.format === 'font' && fmt) Object.keys(fmt.constraints).forEach(c => { constraints[c] = { ...fmt.constraints[c], ...((def.constraints || {})[c] || {}) }; });
    props[k] = { title: def.title, type: def.type, format: def.format || null, constraints, enum: def.enum };
  }
  out.presets[name] = values;
  if (!out.schema) out.schema = { sections: d.layout.sections, properties: props };
}
// Extension theme variables (server/themes/theme.json): defaults may reference root vars with '@'.
const EXT = EXTENSIONS;
out.extensions = [];
for (const ext of fs.readdirSync(EXT).sort()) {
  const f = path.join(EXT, ext, 'server/themes/theme.json');
  if (!fs.existsSync(f)) continue;
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  const properties = {};
  const defaults = {};
  for (const [k, def] of Object.entries(d.properties || {})) {
    properties[k] = { title: def.title, type: def.type, format: def.format || null, constraints: def.constraints || {}, enum: def.enum };
    defaults[k] = def.default;
  }
  const sections = ((d.layout && d.layout.sections) || []).map(sec => ({ title: sec.title, properties: (sec.properties || []).map(pp => (typeof pp === 'string' ? pp : pp.name)).filter(Boolean) }));
  out.extensions.push({ ext, title: d.title || ext, sections, properties, defaults });
}
fs.writeFileSync(path.join(here, 'src/data/rubicon.json'), JSON.stringify(out));
console.log('extension schemas', out.extensions.map(e => `${e.ext}(${Object.keys(e.defaults).length})`).join(' '));
const ui = Object.keys((await import('fs')).readFileSync ? {} : {});
console.log('sections', out.schema.sections.map(s => `${s.title}(${s.properties.length})`).join(', '));
console.log('sample Bleu', JSON.stringify(out.presets.Bleu).slice(0, 400));
