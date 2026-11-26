// Voice-session logs on disk: one JSONL file per call (everything the engine saw and did) plus its audio.
// Folder: .local/voice-sessions/ (git-ignored; holds people's voices, so it stays on this machine).
import { mkdir, appendFile, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DIR = join(dirname(fileURLToPath(import.meta.url)), '../.local/voice-sessions');
const okId = (id) => typeof id === 'string' && /^[A-Za-z0-9_-]{4,64}$/.test(id);

export async function appendLines(id, lines) {
  if (!okId(id) || !Array.isArray(lines) || lines.length > 2000) throw Object.assign(new Error('Bad session log.'), { status: 400 });
  await mkdir(DIR, { recursive: true, mode: 0o700 });
  const body = lines.map((l) => JSON.stringify(l).replace(/\n/g, ' ')).join('\n') + '\n';
  await appendFile(join(DIR, `${id}.jsonl`), body, { mode: 0o600 });
  return { ok: true };
}

export async function saveAudio(id, type, data) {
  if (!okId(id) || data.length < 100) throw Object.assign(new Error('Bad audio.'), { status: 400 });
  await mkdir(DIR, { recursive: true, mode: 0o700 });
  const ext = /mp4/.test(type) ? 'm4a' : 'webm';
  await writeFile(join(DIR, `${id}.${ext}`), data, { mode: 0o600 });
  return { ok: true, file: `${id}.${ext}` };
}

const read = async (id) => (await readFile(join(DIR, `${id}.jsonl`), 'utf8')).split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return { kind: 'unreadable', raw: l }; } });

export async function listSessions() {
  let files = [];
  try { files = await readdir(DIR); } catch { return []; }
  const ids = files.filter((f) => f.endsWith('.jsonl')).map((f) => f.slice(0, -6));
  const out = await Promise.all(ids.map(async (id) => {
    const lines = await read(id);
    const start = lines.find((l) => l.kind === 'start') ?? {};
    const end = lines.find((l) => l.kind === 'end');
    const closed = lines.find((l) => l.kind === 'page_closed');
    const crashes = lines.filter((l) => l.kind === 'crash').length;
    const failed = lines.find((l) => l.kind === 'connect_failed' || (l.kind === 'ledger' && l.entry?.kind === 'error'));
    const audio = files.find((f) => f.startsWith(id + '.') && !f.endsWith('.jsonl'));
    const said = lines.filter((l) => l.kind === 'ledger' && (l.entry?.kind === 'said' || l.entry?.kind === 'heard')).length;
    const lastWall = lines[lines.length - 1]?.wall;
    return { id, at: start.wall ?? (await stat(join(DIR, `${id}.jsonl`))).mtimeMs, mode: start.mode, voice: start.voice, who: start.who?.name, title: start.activity?.title, durationMs: end?.durationMs ?? (lastWall && start.wall ? lastWall - start.wall : undefined), ended: end?.reason ?? (closed ? 'tab closed mid-call' : undefined), crashes, problem: failed ? (failed.error ?? failed.entry?.text) : undefined, turns: said, audio };
  }));
  return out.sort((a, b) => b.at - a.at);
}

export async function getSession(id) {
  if (!okId(id)) throw Object.assign(new Error('Bad id.'), { status: 400 });
  return read(id);
}

export async function getAudio(id) {
  if (!okId(id)) return undefined;
  const files = await readdir(DIR).catch(() => []);
  const f = files.find((x) => x.startsWith(id + '.') && !x.endsWith('.jsonl'));
  return f ? { data: await readFile(join(DIR, f)), type: f.endsWith('m4a') ? 'audio/mp4' : 'audio/webm' } : undefined;
}
