import esbuild from 'esbuild';
import svgr from 'esbuild-plugin-svgr';
import path from 'path';
import fs from 'fs';
import { EXTENSIONS, PLAYGROUND as here, UI } from './paths.mjs';
const stub = n => path.join(here, 'stubs', n);
const stubs = {
  'react-native': stub('react-native.js'),
  'react-native-linear-gradient': stub('linear-gradient.js'),
  'react-native-haptic-feedback': stub('haptic.js'),
  'react-native-device-info': stub('device-info.js'),
  'lottie-react-native': stub('lottie.js'),
  '@react-native-community/datetimepicker': stub('datetimepicker.js'),
  'react-native-lightbox-v2': stub('lightbox.js'),
  'react-native-toast-message': stub('toast.js'),
  'react-native-actions-sheet': stub('actions-sheet.js'),
  'react-native-modal': stub('modal.js'),
  'react-native-webview': stub('webview.js'),
  'react-native-youtube-iframe': stub('youtube.js'),
  'react-native-vimeo-iframe': stub('vimeo.js'),
  '@react-navigation/native': stub('navigation.js'),
  '@openspacelabs/react-native-zoomable-view': stub('zoomable.js'),
  '@shoutem/ui': UI,
  // One React for everything, even if the ui repo root ever gets its own copy installed.
  react: path.join(here, 'node_modules/react'),
  'react-dom': path.join(here, 'node_modules/react-dom'),
  'shoutem-core': stub('shoutem-core.js'),
};
const dev = process.argv.includes('--dev');
const entry = process.argv.find(a => a.startsWith('--entry='))?.slice(8) || 'src/main.js';
fs.mkdirSync(path.join(here, 'dist'), { recursive: true });
const r = await esbuild.build({
  entryPoints: [path.join(here, entry)],
  outfile: path.join(here, 'dist/bundle.js'),
  bundle: true, minify: !dev, format: 'iife', legalComments: 'none',
  nodePaths: [path.join(here, 'node_modules')],
  loader: { '.js': 'jsx', '.png': 'dataurl', '.jpg': 'dataurl', '.ttf': 'dataurl', '.json': 'json' },
  define: { __DEV__: 'false', 'process.env.NODE_ENV': '"production"', 'process.env.JEST_WORKER_ID': 'null', 'process.env': '{}', global: 'globalThis' },
  resolveExtensions: ['.web.js', '.js', '.jsx', '.json'],
  alias: stubs,
  plugins: [svgr(), {
    name: 'shoutem-extensions',
    setup(b) {
      const EXT = EXTENSIONS;
      // Theme files only need ext() from ../const; full const modules drag in whole extensions.
      b.onResolve({ filter: /^\.\.\/const$/ }, args => {
        const m = args.importer.match(/extensions\/(shoutem\.[^/]+)\/app\/themes\/style\.js$/);
        if (!m) return undefined;
        const real = path.join(EXT, m[1], 'app', 'const.js');
        const imports = (fs.readFileSync(real, 'utf8').match(/^import .*$/gm) || []);
        if (imports.every(l => /package\.json/.test(l))) return { path: real };
        return { path: m[1], namespace: 'ext-const' };
      });
      b.onLoad({ filter: /.*/, namespace: 'ext-const' }, args => ({
        contents: `export function ext(r) { return r ? ${JSON.stringify(args.path + '.')} + r : ${JSON.stringify(args.path)}; }`,
        loader: 'js',
      }));
      b.onResolve({ filter: /^shoutem\.[a-z0-9-]+(\/.*)?$/ }, async args => {
        const [pkg, ...rest] = args.path.split('/');
        const target = path.join(EXT, pkg, 'app', ...rest);
        const r = await b.resolve('./' + path.relative(args.resolveDir || here, target), { resolveDir: args.resolveDir || here, kind: args.kind });
        return r.errors.length ? { path: target } : { path: r.path };
      });
    },
  }, {
    name: 'icon-web-flatten',
    setup(b) {
      b.onLoad({ filter: /components\/Icon\/Icon\.web\.js$/ }, async args => {
        let src = fs.readFileSync(args.path, 'utf8');
        src = src.replace("import { connectStyle } from '@shoutem/theme';", "import { connectStyle } from '@shoutem/theme';\nimport { StyleSheet } from 'react-native';")
          .replace('} = style;', '} = __flattenIconStyle(style);')
          .replace('style={{ ...otherStyle }}', 'style={__cssTransform(otherStyle)}')
          + `
function __flattenIconStyle(style) {
  if (!style) return {};
  const numeric = Object.keys(style).filter(k => /^\\d+$/.test(k)).sort((a, b) => a - b);
  if (!numeric.length) return StyleSheet.flatten(style) || {};
  const rest = {};
  Object.keys(style).forEach(k => { if (!/^\\d+$/.test(k)) rest[k] = style[k]; });
  return StyleSheet.flatten([rest, ...numeric.map(k => style[k])]) || {};
}
function __cssTransform(s) {
  if (!s || !Array.isArray(s.transform)) return { ...s };
  const t = s.transform.map(o => Object.entries(o).map(([k, v]) => k + '(' + (typeof v === 'number' && !/scale/.test(k) ? v + 'px' : v) + ')').join(' ')).join(' ');
  return { ...s, transform: t };
}
`;
        return { contents: src, loader: 'jsx', resolveDir: path.dirname(args.path) };
      });
    },
  }],
  logLevel: 'warning', metafile: true,
});
fs.writeFileSync(path.join(here, 'dist/meta.json'), JSON.stringify(r.metafile));
console.log('ok', (fs.statSync(path.join(here, 'dist/bundle.js')).size/1e6).toFixed(2)+'MB');

// Inline fonts + bundle into a single page.
const FONT_DIR = path.join(UI, 'fonts');
const fonts = ['Regular', 'Light', 'Medium', 'Bold', 'Italic', 'BoldItalic'].map(v => {
  const b64 = fs.readFileSync(path.join(FONT_DIR, `Rubik-${v}.ttf`)).toString('base64');
  return `@font-face{font-family:"Rubik-${v}";src:url(data:font/ttf;base64,${b64}) format("truetype");font-display:block}`;
}).join('\n') + '\n' + [
  // Noir/Rose presets use Noto (normally downloaded by shoutem.fonts at app build). Variable fonts: the
  // declared weight range clamps the rendered weight, so "-Bold" families render bold at fontWeight normal.
  ['NotoSans', 'NotoSans.woff2', 'NotoSans-Italic.woff2'], ['NotoSerif', 'NotoSerif.woff2', 'NotoSerif-Italic.woff2'],
].map(([fam, up, it]) => {
  const d = f => fs.readFileSync(path.join(here, 'fonts', f)).toString('base64');
  const face = (name, file, w, st) => `@font-face{font-family:"${name}";src:url(data:font/woff2;base64,${d(file)}) format("woff2");font-weight:${w} ${w};font-style:${st};font-display:block}`;
  return [face(fam, up, 400, 'normal'), face(`${fam}-Regular`, up, 400, 'normal'), face(`${fam}-Bold`, up, 700, 'normal'), face(`${fam}-Italic`, it, 400, 'italic'), face(`${fam}-BoldItalic`, it, 700, 'italic')].join('\n');
}).join('\n');
const js = fs.readFileSync(path.join(here, 'dist/bundle.js'), 'utf8').replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
const tpl = fs.readFileSync(path.join(here, 'template.html'), 'utf8');
const page = tpl.replace('/*FONTS*/', () => fonts).replace('/*BUNDLE*/', () => js);
fs.writeFileSync(path.join(here, 'dist/shoutem-ui-playground.html'), page);
fs.writeFileSync(path.join(here, 'dist/test.html'), `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>body{margin:0}</style></head><body>${page}</body></html>`);
console.log('page', (Buffer.byteLength(page) / 1e6).toFixed(2) + 'MB');
