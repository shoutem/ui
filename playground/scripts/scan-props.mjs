// Extracts propTypes/defaultProps of every @shoutem/ui component into src/data/props.json.
import { parse } from '@babel/parser';
import traverseMod from '@babel/traverse';
import fs from 'fs';
import path from 'path';

const traverse = traverseMod.default || traverseMod;
import { PLAYGROUND as here, UI } from '../paths.mjs';

function files(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files(p, out);
    else if (e.name.endsWith('.js') && !e.name.endsWith('.web.js') && !e.name.includes('test')) out.push(p);
  }
  return out;
}
const all = [...files(path.join(UI, 'components')), path.join(UI, 'html/Html.js'), path.join(UI, 'html/components/SimpleHtml.js'), path.join(UI, 'components/Icon/Icon.web.js')];

function lit(n) {
  if (!n) return undefined;
  if (['StringLiteral', 'NumericLiteral', 'BooleanLiteral'].includes(n.type)) return n.value;
  if (n.type === 'NullLiteral') return null;
  if (n.type === 'UnaryExpression' && n.argument.type === 'NumericLiteral') return -n.argument.value;
  if (n.type === 'ArrayExpression') { const a = n.elements.map(lit); return a.includes(undefined) ? undefined : a; }
  if (n.type === 'ObjectExpression') {
    const o = {};
    for (const p of n.properties) { if (p.type !== 'ObjectProperty') return undefined; const v = lit(p.value); if (v === undefined) return undefined; o[p.key.name || p.key.value] = v; }
    return o;
  }
  return undefined;
}

// PropTypes AST -> { type, options?, required }
function ptype(n, src) {
  let required = false;
  if (n.type === 'MemberExpression' && n.property.name === 'isRequired') { required = true; n = n.object; }
  const text = src.slice(n.start, n.end);
  let t = { type: 'any', raw: text.length > 120 ? text.slice(0, 117) + '…' : text };
  const m = text.match(/^PropTypes\.(\w+)/) || text.match(/^(ViewPropTypes|ImagePropTypes|TextPropTypes)\.(\w+)/);
  const kind = m && (m[1] === 'ViewPropTypes' || m[1] === 'ImagePropTypes' || m[1] === 'TextPropTypes' ? 'style' : m[1]);
  if (kind === 'bool') t.type = 'bool';
  else if (kind === 'string') t.type = 'string';
  else if (kind === 'number') t.type = 'number';
  else if (kind === 'func') t.type = 'func';
  else if (kind === 'node' || kind === 'element' || kind === 'elementType') t.type = 'node';
  else if (kind === 'oneOf') {
    const arg = n.arguments && n.arguments[0];
    const opts = lit(arg);
    if (Array.isArray(opts)) { t.type = 'enum'; t.options = opts; } else t.type = 'string';
  } else if (kind === 'oneOfType') {
    const inner = (n.arguments[0].elements || []).map(e => ptype(e, src).type);
    t.type = inner.includes('number') && inner.includes('string') ? 'string' : inner.includes('number') ? 'number' : inner.includes('string') ? 'string' : inner.includes('bool') ? 'bool' : 'json';
  } else if (['object', 'array', 'arrayOf', 'shape', 'objectOf', 'exact', 'instanceOf', 'any'].includes(kind)) t.type = kind === 'any' ? 'any' : 'json';
  else if (kind === 'style') t.type = 'json';
  else if (/^\w+Shape$|Shape\b/.test(text)) t.type = 'json';
  t.required = required;
  return t;
}

const out = {};
for (const file of all) {
  const src = fs.readFileSync(file, 'utf8');
  if (!/propTypes/.test(src)) continue;
  let ast;
  try { ast = parse(src, { sourceType: 'module', plugins: ['jsx', 'classProperties', 'decorators-legacy', 'optionalChaining'] }); } catch (e) { console.warn('skip', file, e.message); continue; }
  const rel = path.relative(UI, file);
  const record = (owner, kind, obj) => {
    out[owner] = out[owner] || { file: rel, props: {}, inherits: [], defaults: {} };
    for (const p of obj.properties) {
      if (p.type === 'SpreadElement') {
        const s = src.slice(p.argument.start, p.argument.end);
        if (kind === 'propTypes') out[owner].inherits.push(s.length > 80 ? s.slice(0, 77) + '…' : s);
        continue;
      }
      const key = p.key.name || p.key.value;
      if (kind === 'propTypes') {
        const t = ptype(p.value, src);
        const doc = (p.leadingComments || []).map(c => c.value.replace(/^\*+|\n\s*\*\s?/g, ' ').trim()).join(' ').trim();
        if (doc) t.doc = doc;
        out[owner].props[key] = { ...(out[owner].props[key] || {}), ...t };
      } else {
        const v = lit(p.value);
        out[owner].defaults[key] = v === undefined ? src.slice(p.value.start, p.value.end).slice(0, 80) : v;
      }
    }
  };
  traverse(ast, {
    AssignmentExpression(pth) {
      const l = pth.node.left;
      if (l.type === 'MemberExpression' && ['propTypes', 'defaultProps'].includes(l.property.name) && pth.node.right.type === 'ObjectExpression') {
        record(src.slice(l.object.start, l.object.end), l.property.name, pth.node.right);
      }
    },
    ClassProperty(pth) {
      if (pth.node.static && ['propTypes', 'defaultProps'].includes(pth.node.key.name) && pth.node.value && pth.node.value.type === 'ObjectExpression') {
        const cls = pth.findParent(p => p.isClassDeclaration());
        if (cls) record(cls.node.id.name, pth.node.key.name, pth.node.value);
      }
    },
    // Destructured function defaults: function X({ a = 1 }) / const X = ({ a = 1 }) =>
    'FunctionDeclaration|ArrowFunctionExpression'(pth) {
      const param = pth.node.params[0];
      if (!param || param.type !== 'ObjectPattern') return;
      let name = pth.node.id && pth.node.id.name;
      if (!name && pth.parent.type === 'VariableDeclarator') name = pth.parent.id.name;
      if (!name || !/^[A-Z]/.test(name)) return;
      for (const pr of param.properties) {
        if (pr.type === 'ObjectProperty' && pr.value.type === 'AssignmentPattern') {
          const v = lit(pr.value.right);
          out[name] = out[name] || { file: rel, props: {}, inherits: [], defaults: {} };
          out[name].defaults[pr.key.name] = v === undefined ? src.slice(pr.value.right.start, pr.value.right.end).slice(0, 80) : v;
        }
      }
    },
  });
}
fs.writeFileSync(path.join(here, 'src/data/props.json'), JSON.stringify(out, null, 1));
console.log(Object.keys(out).length, 'owners');
for (const k of ['Button', 'NumberInput', 'ImageCarousel', 'DropDownMenu', 'DateTimePicker', 'ProgressRing', 'Html']) console.log(k, JSON.stringify(out[k]).slice(0, 300));
