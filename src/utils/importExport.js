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
      ...section,
      id: uid(),
      entries: (section.entries || []).map(entry => ({ ...entry, id: uid() })),
    })),
  };
}

function validate(obj) {
  if (!obj || typeof obj !== 'object') throw new Error('Invalid file: not an object');
  if (typeof obj.name !== 'string') throw new Error('Invalid file: missing name');
  if (!Array.isArray(obj.sections)) throw new Error('Invalid file: sections must be an array');
  if (typeof obj.personal !== 'object') throw new Error('Invalid file: missing personal');
  return true;
}

export function exportResume(doc) {
  const exportDoc = {
    _schemaVersion: SCHEMA_VERSION,
    ...doc,
  };
  const json = JSON.stringify(exportDoc, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (doc.name || 'resume').replace(/[^a-z0-9_\-]/gi, '_');
  a.href = url;
  a.download = `${safeName}.json`;
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
        try {
          const raw = JSON.parse(e.target.result);
          validate(raw);
          // Normalize template to known value
          if (!KNOWN_TEMPLATES.includes(raw.template)) raw.template = 'classic-clear';
          // Strip schema meta, regen IDs to avoid collisions
          const { _schemaVersion, ...docFields } = raw;
          const doc = regenIds(docFields);
          resolve(doc);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    };
    input.oncancel = () => resolve(null);
    // Some browsers don't fire oncancel — clean up after short delay
    document.body.appendChild(input);
    input.click();
    setTimeout(() => document.body.removeChild(input), 60_000);
  });
}
