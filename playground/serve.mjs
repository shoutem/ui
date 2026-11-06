// Local preview: rebuilds the playground on change and live-reloads the browser.
// Usage: npm run playground (from the ui repo root), or node serve.mjs [--port=4321] here; then open http://localhost:4321
// Watches the playground (src/, stubs/, template.html, build.mjs) and the @shoutem/ui source
// (components/, theme.js, html/, helpers/, services/, index.js) so library edits show up too.
import { spawn } from 'child_process';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { PLAYGROUND as here, UI } from './paths.mjs';
const PORT = +(process.argv.find(a => a.startsWith('--port='))?.slice(7) || process.env.PORT || 4321);
const PAGE = path.join(here, 'dist/test.html');

const WATCH = [
  path.join(here, 'src'), path.join(here, 'stubs'), path.join(here, 'template.html'), path.join(here, 'build.mjs'),
  ...['components', 'theme.js', 'html', 'helpers', 'services', 'index.js'].map(p => path.join(UI, p)),
].filter(p => fs.existsSync(p));

const clients = new Set();
let building = false;
let queued = false;
let lastError = null;
let lastBuilt = null;

function build() {
  if (building) { queued = true; return; }
  building = true;
  const started = Date.now();
  const out = [];
  const p = spawn(process.execPath, [path.join(here, 'build.mjs'), '--dev'], { cwd: here });
  p.stdout.on('data', d => out.push(d));
  p.stderr.on('data', d => out.push(d));
  p.on('close', code => {
    building = false;
    const log = Buffer.concat(out).toString();
    if (code === 0) {
      lastError = null;
      lastBuilt = new Date();
      console.log(`[preview] built in ${((Date.now() - started) / 1000).toFixed(1)}s`);
    } else {
      lastError = log;
      console.log('[preview] build failed:\n' + log);
    }
    clients.forEach(res => res.write('data: reload\n\n'));
    if (queued) { queued = false; build(); }
  });
}

let timer = null;
const onChange = (_e, file) => {
  if (file && /(^|\/)(node_modules|dist)(\/|$)|\.DS_Store$/.test(file)) return;
  clearTimeout(timer);
  timer = setTimeout(build, 250);
};
WATCH.forEach(p => fs.watch(p, { recursive: fs.statSync(p).isDirectory() }, onChange));

const RELOAD = `<script>(()=>{const es=new EventSource('/__reload');es.onmessage=()=>location.reload();})();</script>`;
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write(': connected\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  if (url.pathname !== '/') { res.writeHead(404); res.end('Not found'); return; }
  if (lastError) {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!doctype html><meta charset="utf-8"><title>Build failed</title><body style="font:13px ui-monospace,monospace;padding:20px;background:#1b1214;color:#ffd7d7"><h2>Playground build failed</h2><p>Fix the error and save; this page reloads on its own.</p><pre style="white-space:pre-wrap">${esc(lastError)}</pre>${RELOAD}</body>`);
    return;
  }
  if (!fs.existsSync(PAGE)) {
    res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!doctype html><meta charset="utf-8"><body style="font:14px system-ui;padding:20px">Building the playground…${RELOAD}</body>`);
    return;
  }
  const html = fs.readFileSync(PAGE, 'utf8').replace(/<\/body>(?![\s\S]*<\/body>)/, `${RELOAD}</body>`);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Built-At': String(lastBuilt) });
  res.end(html);
});
server.on('error', e => {
  if (e.code === 'EADDRINUSE') {
    console.error(`[preview] Port ${PORT} is already in use (another preview running?). Stop it, or run with --port=<n>.`);
    process.exit(1);
  }
  throw e;
});
server.listen(PORT, '127.0.0.1', () => {
  console.log(`[preview] http://localhost:${PORT}  (watching ${WATCH.length} paths)`);
  build();
});
