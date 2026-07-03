import React, { useState } from 'react';
import {
  FileText,
  LayoutGrid,
  Pencil,
  Palette,
  Sparkles,
  ChevronDown,
  Download,
  MoreVertical
} from 'lucide-react';
import { usePersonal, useCustomize, useSections, useActiveTemplate } from '../hooks/index.js';
import { exportPdfReact } from '../utils/exportPdfReact.js';

export default function Header({ view, setView }) {
  const { personal } = usePersonal();
  const { customize } = useCustomize();
  const { sections } = useSections();
  const { templateId } = useActiveTemplate();
  const [downloading, setDownloading] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutGrid size={14} /> },
    { id: 'content', label: 'Content', icon: <FileText size={14} /> },
    { id: 'customize', label: 'Customize', icon: <Palette size={14} /> },
    { id: 'ai', label: 'AI Tools', icon: <Sparkles size={14} /> }
  ];

  async function handleDownload() {
    setDownloading(true);
    try {
      await exportPdfReact({ personal, sections, customize, templateId });
    } catch (err) {
      console.error('PDF generation failed', err);
    } finally {
      setDownloading(false);
    }
  }

  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || 'My Resume';

  return (
    <header className="header">
      <div className="header-logo">
        <FileText size={18} />
        ResumeFlow
      </div>

      <nav className="header-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`header-tab ${view === tab.id ? 'active' : ''}`}
            onClick={() => {
              if (tab.id === 'ai') return; // decorative
              setView(tab.id);
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <div className="header-resume-name">
          <FileText size={13} />
          {fullName}
          <ChevronDown size={13} />
        </div>

        <button
          className="btn-download"
          onClick={handleDownload}
          disabled={downloading}
        >
          <Download size={14} />
          {downloading ? 'Generating…' : 'Download'}
        </button>

        <button className="btn-icon-header">
          <MoreVertical size={16} />
        </button>
      </div>
    </header>
  );
}
