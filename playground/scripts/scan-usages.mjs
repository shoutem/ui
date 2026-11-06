// Scans mobile-qa extensions for JSX usages of @shoutem/ui components and writes src/data/usages.json.
import { parse } from '@babel/parser';
import traverseMod from '@babel/traverse';
import fs from 'fs';
import path from 'path';

const traverse = traverseMod.default || traverseMod;
import { EXTENSIONS as ROOT, PLAYGROUND as here } from '../paths.mjs';

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.') || e.name === 'build' || e.name === 'server' || e.name === '__tests__') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(js|jsx|ts|tsx)$/.test(e.name) && !/\.(test|spec)\./.test(e.name)) out.push(p);
  }
  return out;
}

// Evaluate a literal-ish AST node into JSON; return undefined when not static.
function lit(node, src) {
  if (!node) return undefined;
  switch (node.type) {
    case 'StringLiteral': case 'NumericLiteral': case 'BooleanLiteral': return node.value;
    case 'NullLiteral': return null;
    case 'TemplateLiteral': return node.expressions.length ? undefined : node.quasis.map(q => q.value.cooked).join('');
    case 'UnaryExpression': if (node.operator === '-' && node.argument.type === 'NumericLiteral') return -node.argument.value; return undefined;
    case 'ArrayExpression': {
      const a = node.elements.map(e => lit(e, src));
      return a.some(x => x === undefined) ? undefined : a;
    }
    case 'ObjectExpression': {
      const o = {};
      for (const pr of node.properties) {
        if (pr.type !== 'ObjectProperty' || pr.computed) return undefined;
        const k = pr.key.type === 'Identifier' ? pr.key.name : pr.key.value;
        const v = lit(pr.value, src);
        if (v === undefined) return undefined;
        o[k] = v;
      }
      return o;
    }
    default: return undefined;
  }
}

const usages = [];
const files = walk(ROOT).filter(f => f.includes(`${path.sep}app${path.sep}`));
let parsed = 0;
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  if (!src.includes('@shoutem/ui')) continue;
  let ast;
  try {
    ast = parse(src, { sourceType: 'module', plugins: ['jsx', 'classProperties', 'decorators-legacy', 'optionalChaining', 'objectRestSpread', 'typescript'], errorRecovery: true });
  } catch (e) { continue; }
  parsed++;
  const local = {}; // local name -> exported name
  for (const n of ast.program.body) {
    if (n.type === 'ImportDeclaration' && n.source.value === '@shoutem/ui') {
      for (const s of n.specifiers) if (s.type === 'ImportSpecifier') local[s.local.name] = s.imported.name || s.imported.value;
    }
  }
  if (!Object.keys(local).length) continue;
  const rel = path.relative(ROOT, file);
  const ext = rel.split(path.sep)[0];
  traverse(ast, {
    JSXOpeningElement(p) {
      const n = p.node.name;
      if (n.type !== 'JSXIdentifier' || !local[n.name]) return;
      const props = {};
      const dynamic = [];
      let spread = false;
      for (const a of p.node.attributes) {
        if (a.type === 'JSXSpreadAttribute') { spread = true; continue; }
        const key = a.name.name;
        if (a.value == null) { props[key] = true; continue; }
        const v = a.value.type === 'JSXExpressionContainer' ? lit(a.value.expression, src) : lit(a.value, src);
        if (v === undefined) {
          const expr = a.value.type === 'JSXExpressionContainer' ? src.slice(a.value.expression.start, a.value.expression.end) : '';
          dynamic.push({ key, expr: expr.length > 140 ? expr.slice(0, 137) + '…' : expr });
        } else props[key] = v;
      }
      usages.push({ c: local[n.name], ext, file: rel, line: p.node.loc.start.line, props, dynamic, spread });
    },
  });
}

fs.mkdirSync(path.join(here, 'src/data'), { recursive: true });
fs.writeFileSync(path.join(here, 'src/data/usages.json'), JSON.stringify(usages));
const byC = {};
usages.forEach(u => { byC[u.c] = (byC[u.c] || 0) + 1; });
console.log('files', files.length, 'parsed', parsed, 'usages', usages.length);
console.log(Object.entries(byC).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join(' '));
