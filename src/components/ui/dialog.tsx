import { useState, useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';

type DialogKind = 'alert' | 'confirm' | 'prompt';

/** alert → true, confirm → boolean, prompt → string | null (null = cancelled) */
type DialogResult = string | boolean | null;

interface DialogConfig {
  kind: DialogKind;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  defaultValue?: string;
}

interface ActiveDialog extends DialogConfig {
  resolve: (result: DialogResult) => void;
}

let showDialog: ((config: ActiveDialog) => void) | null = null;

function open<T extends DialogResult>(config: DialogConfig): Promise<T> {
  return new Promise<T>(resolve => {
    if (!showDialog) {
      // no host mounted: cancel-equivalent result for the given kind
      resolve((config.kind === 'prompt' ? null : false) as T);
      return;
    }
    // the host resolves with the result matching this config's kind
    showDialog({ ...config, resolve: resolve as (result: DialogResult) => void });
  });
}

export function alertDialog(message: string, { title = 'Notice' }: { title?: string } = {}): Promise<boolean> {
  return open<boolean>({ kind: 'alert', title, message });
}

export function confirmDialog(
  message: string,
  { title = 'Are you sure?', confirmLabel = 'Confirm', danger = false }: { title?: string; confirmLabel?: string; danger?: boolean } = {},
): Promise<boolean> {
  return open<boolean>({ kind: 'confirm', title, message, confirmLabel, danger });
}

export function promptDialog(
  message: string,
  { title = 'Enter a value', defaultValue = '', confirmLabel = 'Save' }: { title?: string; defaultValue?: string; confirmLabel?: string } = {},
): Promise<string | null> {
  return open<string | null>({ kind: 'prompt', title, message, defaultValue, confirmLabel });
}

export function DialogHost() {
  const [dlg, setDlg] = useState<ActiveDialog | null>(null);
  const [value, setValue] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    const focusable = el.querySelectorAll<HTMLElement>('button, input, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function trapTab(e: KeyboardEvent) {
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

  function close(result: DialogResult) {
    // dlg is non-null here: these handlers only exist while the dialog renders
    dlg?.resolve(result);
    setDlg(null);
  }
  function cancel() {
    close(dlg?.kind === 'prompt' ? null : dlg?.kind === 'alert' ? true : false);
  }
  function confirm() {
    close(dlg?.kind === 'prompt' ? value : true);
  }
  function onKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') { e.stopPropagation(); cancel(); }
    if (e.key === 'Enter' && dlg?.kind !== 'prompt') { e.stopPropagation(); confirm(); }
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
