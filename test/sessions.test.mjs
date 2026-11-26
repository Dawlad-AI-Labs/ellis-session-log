import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

test('isolated append/read, summary, restart, validation and synthetic attachment', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ellis-reference-'));
  try {
    await mkdir(join(root, 'src'));
    const modulePath = join(root, 'src/sessions.mjs');
    await copyFile(new URL('../src/sessions.mjs', import.meta.url), modulePath);
    const api = await import(pathToFileURL(modulePath));
    assert.deepEqual(await api.listSessions(), []);
    await assert.rejects(api.appendLines('../escape', []), /Bad session/);
    await assert.rejects(api.getSession('../escape'), /Bad id/);
    await assert.rejects(api.appendLines('test-session', Array(2001).fill({})), /Bad session/);
    await api.appendLines('test-session', [{kind:'start',wall:1000,activity:{title:'Synthetic'}},{kind:'ledger',entry:{kind:'heard',text:'invented'}}]);
    await api.appendLines('test-session', [{kind:'end',wall:3000,durationMs:2000,reason:'complete'}]);
    assert.equal((await api.getSession('test-session')).length,3);
    const summary=(await api.listSessions())[0];
    assert.equal(summary.turns,1); assert.equal(summary.durationMs,2000); assert.equal(summary.ended,'complete');
    const child=execFileSync(process.execPath,['--input-type=module','-e',`const api=await import(${JSON.stringify(pathToFileURL(modulePath).href)}); console.log((await api.getSession('test-session')).length)`],{encoding:'utf8'});
    assert.equal(child.trim(),'3');
    await assert.rejects(api.saveAudio('test-session','audio/webm',Buffer.alloc(10)), /Bad audio/);
    await api.saveAudio('test-session','audio/webm',Buffer.alloc(100));
    assert.equal((await api.getAudio('test-session')).data.length,100);
    if(process.platform!=='win32') assert.equal((await stat(join(api.DIR,'test-session.jsonl'))).mode & 0o777,0o600);
  } finally { await rm(root,{recursive:true,force:true}); }
});
