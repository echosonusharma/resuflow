import React, { useState, useEffect, useRef } from 'react';

let showDialog = null;

function open(config) {
  return new Promise(resolve => {
    if (!showDialog) {
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
  const dialogRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    showDialog = (config) => {
      setValue(config.defaultValue || '');
      setDlg(config);
    };
    return () => { showDialog = null; };
  }, []);

  // Focus trap
  useEffect(() => {
    if (!dlg || !dialogRef.current) return;
    const el = dialogRef.current;
    const focusable = el.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function trapTab(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }

    el.addEventListener('keydown', trapTab);
    if (dlg.kind === 'prompt') {
      inputRef.current?.select();
    } else {
      first?.focus();
    }
    return () => el.removeEventListener('keydown', trapTab);
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
    if (e.key === 'Escape') { e.stopPropagation(); cancel(); }
    if (e.key === 'Enter' && dlg.kind !== 'prompt') { e.stopPropagation(); confirm(); }
  }

  const titleId = 'dialog-title';
  const msgId = 'dialog-msg';

  return (
    <div
      className="app-dialog-overlay"
      onMouseDown={e => { if (e.target === e.currentTarget) cancel(); }}
      aria-hidden="false"
    >
      <div
        ref={dialogRef}
        className="app-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={dlg.message ? msgId : undefined}
        onKeyDown={onKeyDown}
      >
        <div id={titleId} className="app-dialog-title">{dlg.title}</div>
        {dlg.message && <div id={msgId} className="app-dialog-message">{dlg.message}</div>}
        {dlg.kind === 'prompt' && (
          <input
            ref={inputRef}
            className="app-dialog-input"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.stopPropagation(); confirm(); } }}
            autoFocus
          />
        )}
        <div className="app-dialog-actions">
          {dlg.kind !== 'alert' && (
            <button className="app-dialog-btn" onClick={cancel}>Cancel</button>
          )}
          <button
            className={`app-dialog-btn app-dialog-btn--primary${dlg.danger ? ' app-dialog-btn--danger' : ''}`}
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
