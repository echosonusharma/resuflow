import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.jsx';
import MyResumes from './components/MyResumes.jsx';
import EditorPanel from './components/editor/EditorPanel.jsx';
import PreviewPanel from './components/preview/PreviewPanel.jsx';
import CustomizePanel from './components/customize/CustomizePanel.jsx';
import { useResumeStore } from './store/resumeStore.js';
import { putResume } from './db/resumesDb.js';
import { createEmptyResume } from './data/emptyResume.js';

// Routes: / (list) | /resume/:id/content | /resume/:id/customize
function parsePath() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (parts[0] === 'resume' && parts[1]) {
    return { id: parts[1], view: parts[2] === 'customize' ? 'customize' : 'content' };
  }
  return { id: null, view: 'list' };
}

function navigate(id, view) {
  const path = id ? `/resume/${id}/${view}` : '/';
  if (window.location.pathname !== path) {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

export default function App() {
  const [route, setRoute] = useState(parsePath);
  const loadResume = useResumeStore(s => s.loadResume);
  const clearActive = useResumeStore(s => s.clearActive);
  const status = useResumeStore(s => s.status);

  useEffect(() => {
    const onPop = () => setRoute(parsePath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Keep store in sync with the URL (also handles back/forward + deep links)
  useEffect(() => {
    if (!route.id) {
      clearActive();
      return;
    }
    if (useResumeStore.getState().activeResumeId !== route.id) {
      loadResume(route.id).then(doc => {
        if (!doc) navigate(null); // unknown id → back to list
      });
    }
  }, [route.id, loadResume, clearActive]);

  const openResume = useCallback((id) => navigate(id, 'content'), []);

  const createResume = useCallback(async (templateId) => {
    const doc = createEmptyResume({ template: templateId });
    await putResume(doc);
    navigate(doc.id, 'content');
    return doc.id;
  }, []);

  const goList = useCallback(() => navigate(null), []);
  const setView = useCallback((view) => navigate(parsePath().id, view), []);

  if (!route.id) {
    return (
      <div className="app-root">
        <MyResumes onOpen={openResume} onCreate={createResume} />
      </div>
    );
  }

  if (status !== 'ready') {
    return (
      <div className="app-root">
        <div className="app-loading">Loading…</div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <Header view={route.view} setView={setView} onExit={goList} />
      <div className="editor-layout">
        {route.view === 'customize' ? (
          <CustomizePanel setView={setView} />
        ) : (
          <EditorPanel />
        )}
        <PreviewPanel />
      </div>
    </div>
  );
}
