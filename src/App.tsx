import { useState, useEffect, useCallback, Component, type ReactNode } from 'react';
import Header from './components/Header';
import MyResumes from './components/MyResumes';
import EditorPanel from './components/editor/EditorPanel';
import PreviewPanel from './components/preview/PreviewPanel';
import CustomizePanel from './components/customize/CustomizePanel';
import { useResumeStore } from './store/resumeStore';
import { putResume } from './db/resumesDb';
import { createEmptyResume } from './data/emptyResume';
import type { TemplateId } from './types';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16, fontFamily: 'sans-serif', color: '#333' }}>
          <h2 style={{ margin: 0 }}>Something went wrong</h2>
          <p style={{ margin: 0, color: '#666', maxWidth: 400, textAlign: 'center' }}>{this.state.error.message}</p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.href = '/'; }}
            style={{ padding: '8px 20px', background: '#ff5f6d', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            Go home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Routes: / (list) | /resume/:id/content | /resume/:id/customize
type View = 'content' | 'customize' | 'list';
interface Route { id: string | null; view: View; }
function parsePath(): Route {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (parts[0] === 'resume' && parts[1]) {
    return { id: parts[1], view: parts[2] === 'customize' ? 'customize' : 'content' };
  }
  return { id: null, view: 'list' };
}

function navigate(id: string | null, view?: string) {
  const path = id ? `/resume/${id}/${view}` : '/';
  if (window.location.pathname !== path) {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

function SaveErrorBanner() {
  const saveError = useResumeStore(s => s.saveError);
  if (!saveError) return null;
  return (
    <div style={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: '#c0392b', color: '#fff', padding: '8px 16px', borderRadius: 6, fontSize: 13, zIndex: 9999 }}>
      Save failed. Changes may not be saved. {saveError}
    </div>
  );
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

  useEffect(() => {
    if (!route.id) {
      clearActive();
      return;
    }
    if (useResumeStore.getState().activeResumeId !== route.id) {
      loadResume(route.id).then(doc => {
        if (!doc) navigate(null);
      });
    }
  }, [route.id, loadResume, clearActive]);

  const openResume = useCallback((id: string) => navigate(id, 'content'), []);

  const createResume = useCallback(async (templateId?: TemplateId) => {
    const doc = createEmptyResume({ template: templateId });
    await putResume(doc);
    navigate(doc.id, 'content');
    return doc.id;
  }, []);

  const goList = useCallback(() => navigate(null), []);
  const setView = useCallback((view: string) => navigate(parsePath().id, view), []);

  if (!route.id) {
    return (
      <ErrorBoundary>
        <div className="app-root">
          <MyResumes onOpen={openResume} onCreate={createResume} />
        </div>
      </ErrorBoundary>
    );
  }

  if (status === 'loading') {
    return (
      <div className="app-root">
        <div className="app-loading">Loading…</div>
      </div>
    );
  }

  if (status !== 'ready') {
    return (
      <div className="app-root">
        <div className="app-loading" style={{ flexDirection: 'column', gap: 12 }}>
          <div>Resume not found.</div>
          <button onClick={goList} style={{ padding: '6px 16px', cursor: 'pointer' }}>Back to My Resumes</button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
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
        <SaveErrorBanner />
      </div>
    </ErrorBoundary>
  );
}
