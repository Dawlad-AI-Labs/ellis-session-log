import { appendLines, getSession, listSessions, DIR } from '../src/sessions.mjs';
const id = 'synthetic-practice';
await appendLines(id, [
  { kind: 'start', wall: 1000, mode: 'practice', activity: { title: 'Synthetic concept explanation' } },
  { kind: 'ledger', wall: 2000, entry: { kind: 'heard', text: 'Explain a concept with an example.' } },
  { kind: 'ledger', wall: 3000, entry: { kind: 'said', text: 'This is invented fixture text, not student work.' } },
  { kind: 'end', wall: 4000, durationMs: 3000, reason: 'synthetic example complete' },
]);
const lines = await getSession(id);
const summary = (await listSessions()).find(s => s.id === id);
console.log(JSON.stringify({ directory: DIR, lines: lines.length, turns: summary.turns, ended: summary.ended }, null, 2));
