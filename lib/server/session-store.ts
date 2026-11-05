import { promises as fs } from 'fs';
import path from 'path';

export interface SavedSession {
  eventId: string;
  eventName: string;
  sessionType: string;
  classification: any[];
  records: any[];
  savedAt: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'saved-sessions.json');

async function ensureFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, '[]', 'utf8');
  }
}

export async function readSavedSessions(): Promise<SavedSession[]> {
  try {
    await ensureFile();
    const raw = await fs.readFile(FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveSession(session: SavedSession): Promise<void> {
  try {
    await ensureFile();
    const existing = await readSavedSessions();
    const filtered = existing.filter(
      (s) => !(s.eventId === session.eventId && s.sessionType === session.sessionType)
    );
    filtered.push(session);
    await fs.writeFile(FILE, JSON.stringify(filtered, null, 2), 'utf8');
  } catch {
    // Fail gracefully (e.g. read-only/serverless filesystem)
  }
}
