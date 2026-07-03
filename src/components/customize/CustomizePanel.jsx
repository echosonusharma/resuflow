import React, { useState, useRef, useEffect } from 'react';
import { useCustomize, useHistory } from '../../hooks/index.js';
import { RotateCcw } from 'lucide-react';
import DocumentSettings from './sections/DocumentSettings.jsx';
import DesignTemplates from './sections/DesignTemplates.jsx';
import LayoutSettings from './sections/LayoutSettings.jsx';
import FontSizeSettings from './sections/FontSizeSettings.jsx';
import SpacingSettings from './sections/SpacingSettings.jsx';
import EntriesSettings from './sections/EntriesSettings.jsx';
import HeadingsSettings from './sections/HeadingsSettings.jsx';
import FontSettings from './sections/FontSettings.jsx';
import ColorsSettings from './sections/ColorsSettings.jsx';
import HeaderSettings from './sections/HeaderSettings.jsx';
import PhotoSettings from './sections/PhotoSettings.jsx';
import LinksSettings from './sections/LinksSettings.jsx';
import FooterSettings from './sections/FooterSettings.jsx';
import SectionsSettings from './sections/SectionsSettings.jsx';

const SIDEBAR_ITEMS = [
  { id: 'document', label: 'Document' },
  { id: 'templates', label: 'Templates' },
  { id: 'layout', label: 'Layout' },
  { id: 'font-size', label: 'Font Size' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'entries', label: 'Entries' },
  { id: 'headings', label: 'Headings' },
  { id: 'font', label: 'Font' },
  { id: 'colors', label: 'Colors' },
  { id: 'header', label: 'Header' },
  { id: 'photo', label: 'Photo' },
  { id: 'links', label: 'Links' },
  { id: 'footer', label: 'Footer' },
  { id: 'sections', label: 'Sections' },
];

function UndoRedoBar() {
  const { undo, redo, canUndo, canRedo } = useHistory();
  return (
    <div className="cz-undo-bar">
      <button className="cz-undo-btn" title="Undo" onClick={undo} disabled={!canUndo}>↩</button>
      <button className="cz-undo-btn" title="Redo" onClick={redo} disabled={!canRedo}>↪</button>
    </div>
  );
}

export default function CustomizePanel({ setView }) {
  const { customize, updateCustomize, resetCustomize } = useCustomize();
  const [activeSection, setActiveSection] = useState('document');
  const contentRef = useRef(null);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('cz-', '');
            setActiveSection(id);
          }
        });
      },
      { root, threshold: 0.3 }
    );
    SIDEBAR_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(`cz-${id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  function scrollTo(id) {
    const el = document.getElementById(`cz-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  }

  return (
    <div className="customize-panel-wrap">
      <nav className="cz-sidebar">
        {SIDEBAR_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            className={`cz-sidebar-item ${activeSection === id ? 'active' : ''}`}
            onClick={() => scrollTo(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="cz-content" ref={contentRef}>
        <div className="cz-reset-row">
          <button
            className="cz-reset-btn"
            onClick={() => {
              if (window.confirm('Reset all design settings to the template defaults? Your content is not affected.')) {
                resetCustomize();
              }
            }}
          >
            <RotateCcw size={13} />
            Reset to template defaults
          </button>
        </div>
        <DocumentSettings customize={customize} updateCustomize={updateCustomize} />
        <DesignTemplates setView={setView} />
        <LayoutSettings customize={customize} updateCustomize={updateCustomize} />
        <FontSizeSettings customize={customize} updateCustomize={updateCustomize} />
        <SpacingSettings customize={customize} updateCustomize={updateCustomize} />
        <EntriesSettings customize={customize} updateCustomize={updateCustomize} />
        <HeadingsSettings customize={customize} updateCustomize={updateCustomize} />
        <FontSettings customize={customize} updateCustomize={updateCustomize} />
        <ColorsSettings customize={customize} updateCustomize={updateCustomize} />
        <HeaderSettings customize={customize} updateCustomize={updateCustomize} />
        <PhotoSettings customize={customize} updateCustomize={updateCustomize} />
        <LinksSettings customize={customize} updateCustomize={updateCustomize} />
        <FooterSettings customize={customize} updateCustomize={updateCustomize} />
        <SectionsSettings />
      </div>

      <UndoRedoBar />
    </div>
  );
}
