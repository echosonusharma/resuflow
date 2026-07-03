import React, { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { useActiveTemplate } from '../hooks/index.js';
import { getAllTemplates } from '../templates/index.js';

const allTemplates = getAllTemplates();

const TABS = ['All', 'simple', 'modern', 'creative'];
const TAB_LABELS = { All: 'All', simple: 'Simple', modern: 'Modern', creative: 'Creative' };

function MiniClassicClear() {
  return (
    <div className="mini-preview mini-preview-classic" style={{ padding: '14px 12px' }}>
      <div className="mp-name">Sonu Sharma</div>
      <div className="mp-title">Software Developer</div>
      <div className="mp-contact">email • phone • location</div>
      <div className="mp-section-heading">Professional Experience</div>
      <div className="mp-entry-title">Senior Developer — Eclat Eng</div>
      <div className="mp-line w80" />
      <div className="mp-line w60" />
      <div className="mp-line w70" />
      <div className="mp-section-heading">Skills</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 8px' }}>
        <div className="mp-line w80" />
        <div className="mp-line w70" />
        <div className="mp-line w60" />
        <div className="mp-line w80" />
      </div>
      <div className="mp-section-heading">Education</div>
      <div className="mp-entry-title">B.Tech in CS</div>
      <div className="mp-line w60" />
    </div>
  );
}

function MiniAtlanticBlue() {
  return (
    <div className="mini-preview mini-preview-atlantic">
      <div className="mp-sidebar">
        <div className="mp-name">Sonu</div>
        <div style={{ fontSize: 5, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Sharma</div>
        <div style={{ fontSize: 5.5, color: 'rgba(255,255,255,0.6)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contact</div>
        <div className="mp-line" />
        <div className="mp-line" />
        <div className="mp-line" />
        <div style={{ fontSize: 5.5, color: 'rgba(255,255,255,0.6)', marginTop: 6, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Languages</div>
        <div className="mp-line" style={{ width: '70%' }} />
        <div className="mp-line" style={{ width: '60%' }} />
      </div>
      <div className="mp-main">
        <div className="mp-section-heading">Experience</div>
        <div className="mp-entry-title">Senior Developer</div>
        <div className="mp-line" />
        <div className="mp-line" style={{ width: '70%' }} />
        <div className="mp-line" style={{ width: '80%' }} />
        <div className="mp-section-heading">Education</div>
        <div className="mp-entry-title">B.Tech CS</div>
        <div className="mp-line" style={{ width: '60%' }} />
        <div className="mp-section-heading">Skills</div>
        <div className="mp-line" />
        <div className="mp-line" style={{ width: '80%' }} />
      </div>
    </div>
  );
}

function MiniMercuryFlow() {
  return (
    <div className="mini-preview mini-preview-mercury" style={{ padding: '14px 12px' }}>
      <div className="mp-header">
        <div>
          <div className="mp-name">Sonu Sharma</div>
          <div className="mp-title">Software Developer</div>
        </div>
        <div className="mp-photo" />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
        <div style={{ height: '2px', width: '40px', background: '#e5e5e5', borderRadius: '2px' }} />
        <div style={{ height: '2px', width: '30px', background: '#e5e5e5', borderRadius: '2px' }} />
        <div style={{ height: '2px', width: '35px', background: '#e5e5e5', borderRadius: '2px' }} />
      </div>
      <div className="mp-section-heading">Professional Experience</div>
      <div className="mp-entry-title">Senior Developer</div>
      <div className="mp-line" />
      <div className="mp-line" style={{ width: '75%' }} />
      <div className="mp-line" style={{ width: '85%' }} />
      <div className="mp-section-heading">Skills</div>
      <div className="mp-line" />
      <div className="mp-line" style={{ width: '80%' }} />
      <div className="mp-section-heading">Education</div>
      <div className="mp-entry-title">B.Tech CS</div>
      <div className="mp-line" style={{ width: '60%' }} />
    </div>
  );
}

function MiniIvoryProfessional() {
  return (
    <div className="mini-preview mini-preview-classic" style={{ padding: '14px 12px', textAlign: 'center' }}>
      <div className="mp-name" style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>Sonu Sharma</div>
      <div className="mp-title" style={{ letterSpacing: '0.15em', textTransform: 'uppercase' }}>Software Developer</div>
      <div style={{ width: 24, height: 2, background: '#4A4A5A', margin: '6px auto' }} />
      <div className="mp-contact">email • phone • location</div>
      <div className="mp-section-heading" style={{ textAlign: 'center' }}>Experience</div>
      <div style={{ textAlign: 'left' }}>
        <div className="mp-entry-title">Senior Developer — Eclat Eng</div>
        <div className="mp-line w80" />
        <div className="mp-line w70" />
      </div>
      <div className="mp-section-heading" style={{ textAlign: 'center' }}>Education</div>
      <div style={{ textAlign: 'left' }}>
        <div className="mp-entry-title">B.Tech in CS</div>
        <div className="mp-line w60" />
      </div>
    </div>
  );
}

function MiniSlateSidebar() {
  return (
    <div className="mini-preview" style={{ display: 'flex' }}>
      <div style={{ width: '34%', background: '#f0f0ee', padding: '10px 8px' }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#d5d5d3', margin: '0 auto 8px' }} />
        <div style={{ fontSize: 5, fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: 3 }}>Contact</div>
        <div className="mp-line" style={{ background: '#dcdcda' }} />
        <div className="mp-line" style={{ background: '#dcdcda', width: '80%' }} />
        <div style={{ fontSize: 5, fontWeight: 700, color: '#666', textTransform: 'uppercase', margin: '6px 0 3px' }}>Skills</div>
        <div className="mp-line" style={{ background: '#dcdcda' }} />
        <div className="mp-line" style={{ background: '#dcdcda', width: '70%' }} />
      </div>
      <div style={{ flex: 1, padding: '10px 9px' }}>
        <div className="mp-name">Sonu Sharma</div>
        <div className="mp-title">Software Developer</div>
        <div className="mp-section-heading">Experience</div>
        <div className="mp-entry-title">Senior Developer</div>
        <div className="mp-line" />
        <div className="mp-line" style={{ width: '75%' }} />
        <div className="mp-section-heading">Education</div>
        <div className="mp-entry-title">B.Tech CS</div>
        <div className="mp-line" style={{ width: '60%' }} />
      </div>
    </div>
  );
}

function MiniNordicMinimal() {
  return (
    <div className="mini-preview" style={{ padding: '16px 14px', background: '#fff' }}>
      <div style={{ fontSize: 11, fontWeight: 300, color: '#111' }}>Sonu Sharma</div>
      <div style={{ fontSize: 6, color: '#4A6FA5', marginTop: 2 }}>Software Developer</div>
      <div style={{ borderTop: '1px solid #e5e5e5', margin: '8px 0' }} />
      {['Experience', 'Skills', 'Education'].map(h => (
        <div key={h} style={{ display: 'flex', gap: 8, borderTop: '1px solid #eee', padding: '5px 0' }}>
          <div style={{ width: '26%', fontSize: 4.5, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</div>
          <div style={{ flex: 1 }}>
            <div className="mp-line" />
            <div className="mp-line" style={{ width: '70%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniTimelinePro() {
  return (
    <div className="mini-preview" style={{ padding: '12px 11px', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1A6B5F', paddingBottom: 6, marginBottom: 6 }}>
        <div>
          <div className="mp-name">Sonu Sharma</div>
          <div className="mp-title" style={{ color: '#1A6B5F' }}>Software Developer</div>
        </div>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#e8e8e8' }} />
      </div>
      <div className="mp-section-heading" style={{ color: '#1A6B5F' }}>Experience</div>
      {[1, 2].map(i => (
        <div key={i} style={{ display: 'flex', gap: 5, marginBottom: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', border: '1.5px solid #1A6B5F', marginTop: 1 }} />
            <div style={{ width: 1, flex: 1, background: '#e2e2e2' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="mp-entry-title">Senior Developer</div>
            <div className="mp-line" />
            <div className="mp-line" style={{ width: '70%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniBoldBanner() {
  return (
    <div className="mini-preview" style={{ background: '#fff' }}>
      <div style={{ background: '#1E3A5F', padding: '10px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 7.5, fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>Sonu Sharma</div>
          <div style={{ fontSize: 5, color: 'rgba(255,255,255,0.75)' }}>Software Developer</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '8px 10px' }}>
        <div style={{ flex: 1.8 }}>
          <div className="mp-section-heading" style={{ color: '#1E3A5F' }}>Experience</div>
          <div className="mp-entry-title">Senior Developer</div>
          <div className="mp-line" />
          <div className="mp-line" style={{ width: '80%' }} />
          <div className="mp-line" style={{ width: '65%' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="mp-section-heading" style={{ color: '#1E3A5F' }}>Skills</div>
          <div className="mp-line" />
          <div className="mp-line" style={{ width: '75%' }} />
        </div>
      </div>
    </div>
  );
}

function MiniCompactAts() {
  return (
    <div className="mini-preview" style={{ padding: '12px 11px', background: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ fontSize: 8, fontWeight: 700, color: '#000' }}>Sonu Sharma</div>
      <div style={{ fontSize: 5, color: '#333' }}>Software Developer</div>
      <div style={{ fontSize: 4.5, color: '#555', marginBottom: 5 }}>email | phone | location</div>
      {['Experience', 'Skills', 'Education'].map(h => (
        <div key={h} style={{ marginBottom: 4 }}>
          <div style={{ fontSize: 5.5, fontWeight: 700, textTransform: 'uppercase', borderBottom: '0.5px solid #000', color: '#000', marginBottom: 2 }}>{h}</div>
          <div className="mp-line" />
          <div className="mp-line" style={{ width: '80%' }} />
        </div>
      ))}
    </div>
  );
}

function MiniDuoTone() {
  return (
    <div className="mini-preview" style={{ background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 10px 6px', borderBottom: '1.5px solid #7A4A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="mp-name" style={{ color: '#7A4A1A', fontStyle: 'italic' }}>Sonu Sharma</div>
          <div style={{ fontSize: 4.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Software Developer</div>
        </div>
        <div style={{ width: 16, height: 16, borderRadius: 3, background: '#7A4A1A22' }} />
      </div>
      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ flex: 2, padding: '6px 8px' }}>
          <div className="mp-section-heading" style={{ color: '#7A4A1A', fontStyle: 'italic' }}>◆ Experience</div>
          <div className="mp-entry-title">Senior Developer</div>
          <div className="mp-line" />
          <div className="mp-line" style={{ width: '75%' }} />
        </div>
        <div style={{ flex: 1, padding: '6px 8px', background: '#7A4A1A15' }}>
          <div className="mp-section-heading" style={{ color: '#7A4A1A', fontStyle: 'italic' }}>◆ Skills</div>
          <div className="mp-line" />
          <div className="mp-line" style={{ width: '70%' }} />
        </div>
      </div>
    </div>
  );
}

const MINI_PREVIEWS = {
  'classic-clear': <MiniClassicClear />,
  'atlantic-blue': <MiniAtlanticBlue />,
  'mercury-flow': <MiniMercuryFlow />,
  'ivory-professional': <MiniIvoryProfessional />,
  'slate-sidebar': <MiniSlateSidebar />,
  'nordic-minimal': <MiniNordicMinimal />,
  'timeline-pro': <MiniTimelinePro />,
  'bold-banner': <MiniBoldBanner />,
  'compact-ats': <MiniCompactAts />,
  'duo-tone': <MiniDuoTone />
};

export default function TemplateSelector({ setView }) {
  const { templateId, setTemplate } = useActiveTemplate();
  const [activeTab, setActiveTab] = useState('All');

  const filtered = allTemplates.filter(t =>
    activeTab === 'All' || t.meta.category === activeTab
  );

  function selectTemplate(id) {
    setTemplate(id);
  }

  function useTemplate(id) {
    setTemplate(id);
    setView('content');
  }

  return (
    <div className="template-selector">
      <div className="template-selector-hero">
        <div className="template-selector-top">
          <div>
            <h1>Start building your resume</h1>
            <p className="template-selector-subtitle">
              Choose a design you like. You can customize or switch it later.
            </p>
          </div>
          <button className="btn-import">
            <Upload size={14} />
            Import existing resume
          </button>
        </div>

        <div className="template-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`template-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'All' ? 'All Templates' : TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        <div className="template-grid">
          {filtered.map(({ meta }) => (
            <div
              key={meta.id}
              className={`template-card ${templateId === meta.id ? 'selected' : ''}`}
              onClick={() => selectTemplate(meta.id)}
            >
              <div className="template-card-preview">
                {MINI_PREVIEWS[meta.id]}
              </div>
              <div className="template-card-footer">
                <div>
                  <div className="template-card-name">{meta.name}</div>
                  <div className="template-card-category">{TAB_LABELS[meta.category] || meta.category}</div>
                </div>
                {templateId === meta.id && (
                  <CheckCircle size={16} style={{ color: 'var(--color-primary)' }} />
                )}
              </div>
              <button
                className="template-card-use-btn"
                onClick={e => { e.stopPropagation(); useTemplate(meta.id); }}
              >
                Use this template →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
