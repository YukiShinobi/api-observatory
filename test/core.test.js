import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeTiming, compareResponses, sanitizeHeaders } from '../src/core.js';

test('summarizes request timing', () => {
  assert.deepEqual(summarizeTiming([100, 200, 300]), { count: 3, min: 100, max: 300, avg: 200, p95: 300 });
});

test('redacts sensitive headers', () => {
  assert.equal(sanitizeHeaders({ authorization: 'secret' }).authorization, '[redacted]');
});

test('compares response changes', () => {
  assert.equal(compareResponses({ status: 200 }, { status: 500 }).statusChanged, true);
});
