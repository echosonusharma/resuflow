import React, { useState } from 'react';
import Header from './components/Header.jsx';
import TemplateSelector from './components/TemplateSelector.jsx';
import EditorPanel from './components/editor/EditorPanel.jsx';
import PreviewPanel from './components/preview/PreviewPanel.jsx';
import CustomizePanel from './components/customize/CustomizePanel.jsx';

export default function App() {
  const [view, setView] = useState('overview'); // 'overview' | 'content' | 'customize'

  return (
    <div className="app-root">
      <Header view={view} setView={setView} />
      {view === 'overview' ? (
        <TemplateSelector setView={setView} />
      ) : (
        <div className="editor-layout">
          {view === 'customize' ? (
            <CustomizePanel setView={setView} />
          ) : (
            <EditorPanel />
          )}
          <PreviewPanel />
        </div>
      )}
    </div>
  );
}
