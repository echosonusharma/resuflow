const SCHEMA_VERSION = 1;
const KNOWN_TEMPLATES = ['classic-clear', 'slate-sidebar', 'compact-ats', 'obsidian-edge'];

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function regenIds(doc) {
  const now = Date.now();
  return {
    ...doc,
    id: uid(),
    createdAt: now,
    updatedAt: now,
    sections: (doc.sections || []).map(section => ({
      visible: true,
      ...section,
      id: uid(),
      entries: (section.entries || []).map(entry => ({
        visible: true,
        ...entry,
        id: uid(),
      })),
    })),
  };
}

function validate(obj) {
  if (!obj || typeof obj !== 'object') throw new Error('Invalid JSON: not an object');
  if (typeof obj.name !== 'string') throw new Error('Invalid JSON: missing "name"');
  if (!Array.isArray(obj.sections)) throw new Error('Invalid JSON: "sections" must be an array');
  if (typeof obj.personal !== 'object') throw new Error('Invalid JSON: missing "personal"');
}

export function parseResumeJson(text) {
  const raw = JSON.parse(text); // throws SyntaxError on bad JSON
  validate(raw);
  if (!KNOWN_TEMPLATES.includes(raw.template)) raw.template = 'classic-clear';
  const { _schemaVersion, ...docFields } = raw;
  return regenIds(docFields);
}

export function exportResume(doc) {
  const { id, createdAt, updatedAt, ...rest } = doc;
  const exportDoc = {
    _schemaVersion: SCHEMA_VERSION,
    ...rest,
    sections: (rest.sections || []).map(({ id: _sid, ...s }) => ({
      ...s,
      entries: (s.entries || []).map(({ id: _eid, ...e }) => e),
    })),
  };
  const json = JSON.stringify(exportDoc, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (doc.name || 'Resume').replace(/[^a-z0-9_\-]/gi, '_');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `${safeName}_Resuflow_${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function importResumeFromFile() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) { resolve(null); return; }
      const reader = new FileReader();
      reader.onload = (e) => {
        try { resolve(parseResumeJson(e.target.result)); }
        catch (err) { reject(err); }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    };
    input.oncancel = () => resolve(null);
    document.body.appendChild(input);
    input.click();
    setTimeout(() => document.body.removeChild(input), 60_000);
  });
}
