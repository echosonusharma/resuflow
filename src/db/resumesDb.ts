import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { SavedResume } from '../types';

const DB_NAME = 'resuflow';
const DB_VERSION = 1;
const STORE = 'resumes';

interface ResuflowDB extends DBSchema {
  resumes: {
    key: string;
    value: SavedResume;
    indexes: { updatedAt: number };
  };
}

let dbPromise: Promise<IDBPDatabase<ResuflowDB>> | null = null;

function getDb(): Promise<IDBPDatabase<ResuflowDB>> {
  if (!dbPromise) {
    dbPromise = openDB<ResuflowDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt');
        }
      },
    }).catch(err => {
      dbPromise = null; // allow retry
      throw err;
    });
  }
  return dbPromise;
}

export async function listResumes(): Promise<SavedResume[]> {
  try {
    const db = await getDb();
    const all = await db.getAll(STORE);
    return all.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  } catch (err) {
    console.error('[db] listResumes failed', err);
    return [];
  }
}

export async function getResume(id: string): Promise<SavedResume | undefined> {
  try {
    const db = await getDb();
    return await db.get(STORE, id);
  } catch (err) {
    console.error('[db] getResume failed', err);
    return undefined;
  }
}

export async function putResume(doc: SavedResume): Promise<SavedResume> {
  const db = await getDb(); // intentionally let throw - callers handle
  const next = { ...doc, updatedAt: Date.now() };
  await db.put(STORE, next);
  return next;
}

export async function deleteResume(id: string): Promise<void> {
  try {
    const db = await getDb();
    await db.delete(STORE, id);
  } catch (err) {
    console.error('[db] deleteResume failed', err);
    throw err; // re-throw so caller can show error
  }
}

export async function count(): Promise<number> {
  try {
    const db = await getDb();
    return await db.count(STORE);
  } catch {
    return 0;
  }
}
