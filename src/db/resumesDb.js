import { openDB } from 'idb';

const DB_NAME = 'resuflow';
const DB_VERSION = 1;
const STORE = 'resumes';

let dbPromise;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
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

export async function listResumes() {
  try {
    const db = await getDb();
    const all = await db.getAll(STORE);
    return all.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  } catch (err) {
    console.error('[db] listResumes failed', err);
    return [];
  }
}

export async function getResume(id) {
  try {
    const db = await getDb();
    return await db.get(STORE, id);
  } catch (err) {
    console.error('[db] getResume failed', err);
    return undefined;
  }
}

export async function putResume(doc) {
  const db = await getDb(); // intentionally let throw — callers handle
  const next = { ...doc, updatedAt: Date.now() };
  await db.put(STORE, next);
  return next;
}

export async function deleteResume(id) {
  try {
    const db = await getDb();
    await db.delete(STORE, id);
  } catch (err) {
    console.error('[db] deleteResume failed', err);
    throw err; // re-throw so caller can show error
  }
}

export async function count() {
  try {
    const db = await getDb();
    return await db.count(STORE);
  } catch {
    return 0;
  }
}
