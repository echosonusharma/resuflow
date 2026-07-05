import React, { useEffect, useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import schemaRaw from '../../RESUME_SCHEMA.md?raw';

export default function AiBuilderModal({ onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  async function handleCopy() {
    await navigator.clipboard.writeText(schemaRaw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="new-resume-backdrop" onClick={onClose}>
      <div className="ai-builder-modal" onClick={e => e.stopPropagation()}>
        <button className="new-resume-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <header className="new-resume-header">
          <h2>Build resume with AI</h2>
          <p>
            Copy the schema below and paste it into any AI assistant - Claude, ChatGPT, Gemini, or any other.
            Tell it your experience, education, skills, and personal details.
            Ask it to generate a resume JSON following this schema.
            Then import the result using the "Import JSON" button.
          </p>
          <p>
            You can also drop your existing resume (PDF or text) into the chat and ask the AI to extract your data from it.
            This is a great way to quickly create multiple tailored versions - one optimized for a specific role,
            another for a different industry, or a shorter one for a referral. Instead of editing a single resume
            every time, let the AI rewrite the emphasis and bullet points to match the job, then import each version separately.
          </p>
          <div className="ai-builder-tips">
            <div className="ai-builder-tip"><span>1</span>Paste this schema + your background into the AI</div>
            <div className="ai-builder-tip"><span>2</span>Ask it to tailor the resume to a specific role or JD</div>
            <div className="ai-builder-tip"><span>3</span>Copy the JSON output, save as <code>.json</code>, import here</div>
          </div>
        </header>

        <div className="ai-builder-schema-wrap">
          <div className="ai-builder-schema-toolbar">
            <span className="ai-builder-schema-label">RESUME_SCHEMA.md</span>
            <button className="ai-builder-copy-btn" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy schema'}
            </button>
          </div>
          <pre className="ai-builder-schema-body">{schemaRaw}</pre>
        </div>
      </div>
    </div>
  );
}
