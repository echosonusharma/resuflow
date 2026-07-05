import React, { useState } from 'react';
import { FileText, Palette, Download, ArrowLeft, Sparkles } from 'lucide-react';
import { usePersonal, useCustomize, useSections, useActiveTemplate } from '../hooks/index.js';
import { useResumeStore } from '../store/resumeStore.js';
import { exportPdfReact } from '../utils/exportPdfReact.js';
import { alertDialog, confirmDialog } from './ui/dialog.jsx';
import ResuflowMark from './ResuflowMark.jsx';

export default function Header({ view, setView, onExit }) {
  const { personal } = usePersonal();
  const { customize } = useCustomize();
  const { sections } = useSections();
  const { templateId } = useActiveTemplate();
  const [downloading, setDownloading] = useState(false);

  const tabs = [
    { id: 'content', label: 'Content', icon: <FileText size={14} /> },
    { id: 'customize', label: 'Customize', icon: <Palette size={14} /> }
  ];

  async function handleDownload() {
    setDownloading(true);
    try {
      await exportPdfReact({ personal, sections, customize, templateId });
    } catch (err) {
      console.error('PDF generation failed', err);
      alertDialog(`PDF generation failed: ${err?.message || 'Unknown error'}`, { title: 'Download failed' });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <header className="header">
      <button className="header-logo header-logo--btn" onClick={onExit} title="My Resumes">
        <ArrowLeft size={16} />
        <ResuflowMark />
        Resuflow
      </button>

      <nav className="header-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`header-tab ${view === tab.id ? 'active' : ''}`}
            onClick={() => setView(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <button
          className="btn-fill-demo"
          onClick={async () => {
            const ok = await confirmDialog(
              'This will overwrite all current content with demo data. This cannot be undone.',
              { title: 'Fill with demo data?', confirmLabel: 'Fill demo', danger: true }
            );
            if (ok) useResumeStore.getState().fillDemoData();
          }}
        >
          <Sparkles size={14} />
          Fill demo
        </button>
        <button
          className="btn-download"
          onClick={handleDownload}
          disabled={downloading}
        >
          <Download size={14} />
          {downloading ? 'Generating…' : 'Download'}
        </button>
      </div>
    </header>
  );
}
