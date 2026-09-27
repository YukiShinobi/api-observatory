import http from 'node:http';
import { performance } from 'node:perf_hooks';
import { sanitizeHeaders, summarizeTiming } from './core.js';

const PORT = Number(process.env.PORT ?? 8088);
const history = [];

async function probe(url, options = {}) {
  const started = performance.now();
  const response = await fetch(url, { method: options.method ?? 'GET', headers: options.headers ?? {} });
  const text = await response.text();
  const durationMs = Number((performance.now() - started).toFixed(2));
  let body = text;
  try { body = JSON.parse(text); } catch {}

  const result = {
    id: crypto.randomUUID(),
    url,
    method: options.method ?? 'GET',
    status: response.status,
    durationMs,
    headers: sanitizeHeaders(Object.fromEntries(response.headers.entries())),
    body,
    at: new Date().toISOString()
  };
  history.unshift(result);
  history.splice(50);
  return result;
}

function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(value));
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') return json(res, 200, { ok: true, savedRequests: history.length });
  if (req.method === 'GET' && req.url === '/api/history') return json(res, 200, history);
  if (req.method === 'GET' && req.url === '/api/summary') return json(res, 200, summarizeTiming(history.map(item => item.durationMs)));

  if (req.method === 'POST' && req.url === '/api/probe') {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    try {
      const input = JSON.parse(raw || '{}');
      if (!input.url || !/^https?:\/\//i.test(input.url)) return json(res, 400, { error: 'A valid http(s) URL is required' });
      const result = await probe(input.url, { method: input.method, headers: input.headers });
      return json(res, 200, result);
    } catch (error) {
      return json(res, 502, { error: error.message });
    }
  }

  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>API Observatory</title><style>body{font-family:Inter,system-ui;background:#070707;color:#f4f4f5;margin:0}.wrap{max-width:900px;margin:auto;padding:48px 20px}.tag{color:#fca5a5}.panel{background:#111;border:1px solid #2a2a2a;border-radius:16px;padding:18px;margin-top:18px}input,button{padding:12px;border-radius:10px;border:1px solid #333;background:#0d0d0d;color:#fff}input{width:70%}button{background:#6f1d1b;cursor:pointer}pre{white-space:pre-wrap;color:#d4d4d8}</style></head><body><main class="wrap"><div class="tag">YukiShinobi / developer tooling</div><h1>API Observatory</h1><p>Probe an endpoint, inspect response timing, status and redacted headers, then keep a short comparison history.</p><div class="panel"><input id="url" value="https://example.com"><button id="go">Probe</button></div><div class="panel"><pre id="out">waiting…</pre></div></main><script>go.onclick=async()=>{out.textContent='probing…';const r=await fetch('/api/probe',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({url:url.value})});out.textContent=JSON.stringify(await r.json(),null,2)}</script></body></html>`);
});

if (process.env.NODE_ENV !== 'test') server.listen(PORT, () => console.log(`API Observatory: http://localhost:${PORT}`));

export { probe, server };
