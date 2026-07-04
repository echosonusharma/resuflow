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
    });
  }
  return dbPromise;
}

export async function listResumes() {
  const db = await getDb();
  const all = await db.getAll(STORE);
  return all.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export async function getResume(id) {
  const db = await getDb();
  return db.get(STORE, id);
}

export async function putResume(doc) {
  const db = await getDb();
  const next = { ...doc, updatedAt: Date.now() };
  await db.put(STORE, next);
  return next;
}

export async function deleteResume(id) {
  const db = await getDb();
  await db.delete(STORE, id);
}

export async function count() {
  const db = await getDb();
  return db.count(STORE);
}
