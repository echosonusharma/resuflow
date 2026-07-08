import React, { useState } from 'react';
import {
  Plus, User, Briefcase, Brain, GraduationCap, Globe, Award, FileText, X,
  FolderKanban, HeartHandshake, Trophy, BookOpen, Newspaper, Sparkles, Users
} from 'lucide-react';
import { useSections } from '../../hooks/index.js';
import PersonalInfoCard from './PersonalInfoCard.jsx';
import SectionCard from './SectionCard.jsx';
import type { SectionType } from '../../types';

const SECTION_TYPES: { type: SectionType; label: string; icon: React.ReactElement }[] = [
  { type: 'experience', label: 'Experience', icon: <Briefcase size={20} /> },
  { type: 'education', label: 'Education', icon: <GraduationCap size={20} /> },
  { type: 'skills', label: 'Skills', icon: <Brain size={20} /> },
  { type: 'languages', label: 'Languages', icon: <Globe size={20} /> },
  { type: 'certifications', label: 'Certifications', icon: <Award size={20} /> },
  { type: 'projects', label: 'Projects', icon: <FolderKanban size={20} /> },
  { type: 'volunteering', label: 'Volunteering', icon: <HeartHandshake size={20} /> },
  { type: 'awards', label: 'Awards', icon: <Trophy size={20} /> },
  { type: 'courses', label: 'Courses', icon: <BookOpen size={20} /> },
  { type: 'publications', label: 'Publications', icon: <Newspaper size={20} /> },
  { type: 'interests', label: 'Interests', icon: <Sparkles size={20} /> },
  { type: 'references', label: 'References', icon: <Users size={20} /> },
  { type: 'custom', label: 'Custom', icon: <FileText size={20} /> }
];

export default function EditorPanel() {
  const { sections, addSection: addSectionHook } = useSections();
  const [pickerOpen, setPickerOpen] = useState(false);

  function addSection(type: SectionType) {
    addSectionHook(type);
    setPickerOpen(false);
  }

  return (
    <div className="editor-panel">
      <div className="editor-panel-inner">
        <PersonalInfoCard />

        {sections.map(section => (
          <SectionCard key={section.id} section={section} />
        ))}

        {/* Add Content area */}
        <div className="add-content-container">
          {pickerOpen && (
            <div className="add-content-picker">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 0' }}>
                <div className="add-content-picker-title" style={{ padding: 0 }}>
                  Add a section
                </div>
                <button
                  onClick={() => setPickerOpen(false)}
                  style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}
                >
                  <X size={15} />
                </button>
              </div>
              <div className="add-content-picker-grid" style={{ margin: '8px 0 0' }}>
                {SECTION_TYPES.map(item => (
                  <button
                    key={item.type}
                    className="add-content-picker-item"
                    onClick={() => addSection(item.type)}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            className="btn-add-content"
            onClick={() => setPickerOpen(prev => !prev)}
          >
            <Plus size={16} />
            Add Content
          </button>
        </div>
      </div>
    </div>
  );
}
