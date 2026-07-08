import { useEffect, useState, useRef } from 'react';
import { Plus, MoreVertical, Trash2, Copy, Pencil, Download, Upload, Sparkles } from 'lucide-react';
import { listResumes, deleteResume, putResume } from '../db/resumesDb';
import { getTemplate } from '../templates/index';
import TemplatePreview from './TemplatePreview';
import TemplatePicker from './TemplatePicker';
import NewResumeModal from './NewResumeModal';
import { alertDialog, confirmDialog, promptDialog } from './ui/dialog';
import { exportResume } from '../utils/importExport';
import AiBuilderModal from './AiBuilderModal';
import ImportModal from './ImportModal';
import ResuflowMark from './ResuflowMark';
import type { SavedResume, TemplateId } from '../types';

function uid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function makeCopyName(baseName: string, existingNames: Set<string>): string {
  const base = baseName || 'Untitled resume';
  // Strip trailing " (copy N)" or " (copy)"
  const stripped = base.replace(/\s+\(copy(?:\s+\d+)?\)$/, '');
  if (!existingNames.has(`${stripped} (copy)`)) return `${stripped} (copy)`;
  let n = 2;
  while (existingNames.has(`${stripped} (copy ${n})`)) n++;
  return `${stripped} (copy ${n})`;
}

function formatRelative(ts?: number): string {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const min = 60_000, hr = 3_600_000, day = 86_400_000;
  if (diff < hr) return `edited ${Math.max(1, Math.round(diff / min))} min ago`;
  if (diff < day) return `edited ${Math.round(diff / hr)} hr ago`;
  return `edited ${Math.round(diff / day)} days ago`;
}

interface ResumeCardProps {
  doc: SavedResume;
  onOpen: (id: string) => void;
  onRename: (doc: SavedResume) => void;
  onDuplicate: (doc: SavedResume) => void;
  onExport: (doc: SavedResume) => void;
  onDelete: (doc: SavedResume) => void;
}

function ResumeCard({ doc, onOpen, onRename, onDuplicate, onExport, onDelete }: ResumeCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  const tpl = getTemplate(doc.template);
  if (!tpl) return null;

  return (
    <div className="resume-card">
      <button className="resume-card-preview" onClick={() => onOpen(doc.id)}>
        <TemplatePreview
          meta={tpl.meta}
          component={tpl.component}
          personal={doc.personal}
          sections={doc.sections}
          customize={doc.customize}
        />
      </button>
      <div className="resume-card-footer">
        <div className="resume-card-meta">
          <div className="resume-card-name">{doc.name || 'Untitled resume'}</div>
          <div className="resume-card-sub">{formatRelative(doc.updatedAt)} • {doc.customize?.document?.pageFormat || 'A4'}</div>
        </div>
        <div className="resume-card-menu-wrap" ref={menuRef}>
          <button
            className="resume-card-menu-btn"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Resume actions"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="resume-card-menu">
              <button onClick={() => { setMenuOpen(false); onRename(doc); }}>
                <Pencil size={14} /> Rename
              </button>
              <button onClick={() => { setMenuOpen(false); onDuplicate(doc); }}>
                <Copy size={14} /> Duplicate
              </button>
              <button onClick={() => { setMenuOpen(false); onExport(doc); }}>
                <Download size={14} /> Export JSON
              </button>
              <button className="danger" onClick={() => { setMenuOpen(false); onDelete(doc); }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="landing-sidebar">
      <div className="landing-logo">
        <ResuflowMark size={28} />
        <span className="landing-logo-text">Resuflow</span>
      </div>
      <nav className="landing-nav">
        <button className="landing-nav-item active">Resume</button>
      </nav>
    </aside>
  );
}

interface MyResumesProps {
  onOpen: (id: string) => void;
  onCreate: (templateId?: TemplateId) => Promise<string | undefined>;
}

export default function MyResumes({ onOpen, onCreate }: MyResumesProps) {
  const [resumes, setResumes] = useState<SavedResume[] | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showAiBuilder, setShowAiBuilder] = useState(false);
  const [showImport, setShowImport] = useState(false);

  async function refresh() {
    try {
      setResumes(await listResumes());
    } catch (err) {
      console.error('[MyResumes] listResumes failed', err);
      setResumes([]);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function handleRename(doc: SavedResume) {
    const name = await promptDialog('', {
      title: 'Rename resume',
      defaultValue: doc.name || 'Untitled resume',
      confirmLabel: 'Rename',
    });
    if (name == null) return;
    try {
      await putResume({ ...doc, name: name.trim() || 'Untitled resume' });
      refresh();
    } catch (err) {
      alertDialog('Failed to rename resume.', { title: 'Error' });
    }
  }

  async function handleDuplicate(doc: SavedResume) {
    const existingNames = new Set((resumes || []).map(r => r.name));
    const copy = {
      ...doc,
      id: uid(),
      name: makeCopyName(doc.name, existingNames),
      createdAt: Date.now(),
    };
    try {
      await putResume(copy);
      refresh();
    } catch (err) {
      alertDialog('Failed to duplicate resume. Storage may be full.', { title: 'Error' });
    }
  }

  async function handleDelete(doc: SavedResume) {
    const ok = await confirmDialog(
      `Delete "${doc.name || 'Untitled resume'}"? This cannot be undone.`,
      { title: 'Delete resume', confirmLabel: 'Delete', danger: true }
    );
    if (!ok) return;
    try {
      await deleteResume(doc.id);
      refresh();
    } catch (err) {
      alertDialog('Failed to delete resume.', { title: 'Error' });
    }
  }

  function handleExport(doc: SavedResume) {
    exportResume(doc);
  }

  async function handlePickTemplate(templateId: TemplateId) {
    setShowNew(false);
    const id = await onCreate(templateId);
    if (id) refresh();
  }

  if (resumes === null) {
    return (
      <div className="landing">
        <Sidebar />
        <main className="landing-main" />
      </div>
    );
  }

  const isEmpty = resumes.length === 0;

  return (
    <div className="landing">
      <Sidebar />

      <main className="landing-main">
        {isEmpty ? (
          <>
            <header className="landing-header">
              <div className="landing-header-row">
                <div>
                  <h1>Start building your resume</h1>
                  <p className="landing-subtitle">
                    Choose a design you like. You can customize or switch it later.
                  </p>
                </div>
                <div className="landing-header-actions">
                  <button className="btn-ai-builder" onClick={() => setShowAiBuilder(true)}>
                    <Sparkles size={14} />
                    Build with AI
                  </button>
                  <button className="btn-import" onClick={() => setShowImport(true)}>
                    <Upload size={14} />
                    Import JSON
                  </button>
                </div>
              </div>
            </header>
            <TemplatePicker onPick={handlePickTemplate} />
          </>
        ) : (
          <>
            <header className="landing-header">
              <div className="landing-header-row">
                <div>
                  <h1>My Resumes</h1>
                  <p className="landing-subtitle">All data stays in your browser.</p>
                </div>
                <div className="landing-header-actions">
                  <button className="btn-ai-builder" onClick={() => setShowAiBuilder(true)}>
                    <Sparkles size={14} />
                    Build with AI
                  </button>
                  <button className="btn-import" onClick={() => setShowImport(true)}>
                    <Upload size={14} />
                    Import JSON
                  </button>
                </div>
              </div>
            </header>
            <div className="resume-grid">
              <div className="resume-card">
                <button className="resume-card-preview resume-card-preview--new" onClick={() => setShowNew(true)}>
                  <Plus size={32} />
                  <span>New resume</span>
                </button>
                <div className="resume-card-footer resume-card-footer--placeholder" aria-hidden="true" />
              </div>
              {resumes.map(doc => (
                <ResumeCard
                  key={doc.id}
                  doc={doc}
                  onOpen={onOpen}
                  onRename={handleRename}
                  onDuplicate={handleDuplicate}
                  onExport={handleExport}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {showNew && (
        <NewResumeModal
          onClose={() => setShowNew(false)}
          onPick={handlePickTemplate}
        />
      )}

      {showAiBuilder && (
        <AiBuilderModal onClose={() => setShowAiBuilder(false)} />
      )}

      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onImported={refresh}
        />
      )}
    </div>
  );
}
