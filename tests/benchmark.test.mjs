import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';
import {build, renderWorkspace} from '../scripts/build.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const workspace = JSON.parse(await readFile(resolve(root, 'workspace.json'), 'utf8'));

test('Performance: renderWorkspace latency is acceptable', () => {
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    renderWorkspace(workspace);
  }
  const end = performance.now();
  const duration = end - start;
  assert.ok(duration < 250, `renderWorkspace x1000 is too slow: ${duration.toFixed(2)}ms (expected < 250ms)`);
});

test('Performance: build operation parallelization reduces latency', async () => {
  const start = performance.now();
  const sha = '0123456789012345678901234567890123456789';
  for (let i = 0; i < 50; i++) {
    await build(root, sha);
  }
  const end = performance.now();
  const duration = end - start;
  assert.ok(duration < 1500, `build x50 is too slow: ${duration.toFixed(2)}ms (expected < 1500ms)`);
});
