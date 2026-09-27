export function summarizeTiming(samples = []) {
  const values = samples.filter(Number.isFinite).sort((a, b) => a - b);
  if (!values.length) return { count: 0, min: null, max: null, avg: null, p95: null };
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  const p95Index = Math.min(values.length - 1, Math.ceil(values.length * 0.95) - 1);
  return {
    count: values.length,
    min: values[0],
    max: values.at(-1),
    avg: Number(avg.toFixed(2)),
    p95: values[p95Index]
  };
}

export function compareResponses(a = {}, b = {}) {
  return {
    statusChanged: a.status !== b.status,
    headersChanged: JSON.stringify(a.headers ?? {}) !== JSON.stringify(b.headers ?? {}),
    bodyChanged: JSON.stringify(a.body ?? null) !== JSON.stringify(b.body ?? null),
    durationDeltaMs: Number(((b.durationMs ?? 0) - (a.durationMs ?? 0)).toFixed(2))
  };
}

export function sanitizeHeaders(headers = {}) {
  const hidden = new Set(['authorization', 'cookie', 'set-cookie', 'x-api-key']);
  return Object.fromEntries(Object.entries(headers).map(([key, value]) => [key, hidden.has(key.toLowerCase()) ? '[redacted]' : value]));
}
