import { DatabaseSync } from 'node:sqlite';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(join(__dirname, 'scores.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export function getTop10() {
  return db.prepare('SELECT name, score, created_at FROM scores ORDER BY score DESC LIMIT 10').all();
}

export function insertScore(name, score) {
  db.prepare('INSERT INTO scores (name, score) VALUES (?, ?)').run(name, score);
  const rank = db.prepare('SELECT COUNT(*) as cnt FROM scores WHERE score > ?').get(score).cnt + 1;
  const total = db.prepare('SELECT COUNT(*) as cnt FROM scores').get().cnt;
  return { rank, total };
}
