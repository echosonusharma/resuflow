import React, { useState, useEffect, useRef } from 'react';

let showDialog = null;

function open(config) {
  return new Promise(resolve => {
    if (!showDialog) {
      // host not mounted yet — fail safe
      resolve(config.kind === 'prompt' ? null : false);
      return;
    }
    showDialog({ ...config, resolve });
  });
}

export function alertDialog(message, { title = 'Notice' } = {}) {
  return open({ kind: 'alert', title, message });
}

export function confirmDialog(message, { title = 'Are you sure?', confirmLabel = 'Confirm', danger = false } = {}) {
  return open({ kind: 'confirm', title, message, confirmLabel, danger });
}

export function promptDialog(message, { title = 'Enter a value', defaultValue = '', confirmLabel = 'Save' } = {}) {
  return open({ kind: 'prompt', title, message, defaultValue, confirmLabel });
}

export function DialogHost() {
  const [dlg, setDlg] = useState(null);
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    showDialog = (config) => {
      setValue(config.defaultValue || '');
      setDlg(config);
    };
    return () => { showDialog = null; };
  }, []);

  useEffect(() => {
    if (dlg?.kind === 'prompt') setTimeout(() => inputRef.current?.select(), 10);
  }, [dlg]);

  if (!dlg) return null;

  function close(result) {
    dlg.resolve(result);
    setDlg(null);
  }
  function cancel() {
    close(dlg.kind === 'prompt' ? null : dlg.kind === 'alert' ? true : false);
  }
  function confirm() {
    close(dlg.kind === 'prompt' ? value : true);
  }
  function onKeyDown(e) {
    if (e.key === 'Escape') cancel();
    if (e.key === 'Enter') confirm();
  }

  return (
    <div className="app-dialog-overlay" onMouseDown={e => { if (e.target === e.currentTarget) cancel(); }} onKeyDown={onKeyDown}>
      <div className="app-dialog" role="dialog" aria-modal="true">
        <div className="app-dialog-title">{dlg.title}</div>
        {dlg.message && <div className="app-dialog-message">{dlg.message}</div>}
        {dlg.kind === 'prompt' && (
          <input
            ref={inputRef}
            className="app-dialog-input"
            value={value}
            onChange={e => setValue(e.target.value)}
            autoFocus
          />
        )}
        <div className="app-dialog-actions">
          {dlg.kind !== 'alert' && (
            <button className="app-dialog-btn" onClick={cancel}>Cancel</button>
          )}
          <button
            className={`app-dialog-btn app-dialog-btn--primary ${dlg.danger ? 'app-dialog-btn--danger' : ''}`}
            onClick={confirm}
            autoFocus={dlg.kind !== 'prompt'}
          >
            {dlg.kind === 'alert' ? 'OK' : dlg.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
