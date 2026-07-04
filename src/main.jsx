import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { DialogHost } from './components/ui/dialog.jsx';
import { useResumeStore } from './store/resumeStore.js';
import './styles/index.css';

// Global keyboard shortcuts
document.addEventListener('keydown', (e) => {
  const tag = document.activeElement?.tagName;
  const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable;
  if (isInput) return;

  const meta = e.ctrlKey || e.metaKey;
  if (!meta) return;

  if (e.key === 'z' && !e.shiftKey) {
    e.preventDefault();
    useResumeStore.getState().undo();
  } else if (e.key === 'z' && e.shiftKey) {
    e.preventDefault();
    useResumeStore.getState().redo();
  } else if (e.key === 'y') {
    e.preventDefault();
    useResumeStore.getState().redo();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <DialogHost />
  </React.StrictMode>
);
