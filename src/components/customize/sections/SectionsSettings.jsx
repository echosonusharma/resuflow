import React from 'react';
import {
  User, Briefcase, Brain, GraduationCap, Globe, Award, FileText,
  FolderKanban, HeartHandshake, Trophy, BookOpen, Newspaper, Sparkles, Users
} from 'lucide-react';
import Card from '../ui/Card.jsx';
import { useSections } from '../../../hooks/index.js';

const SECTION_ICONS = {
  User, Briefcase, Brain, GraduationCap, Globe, Award, FileText,
  FolderKanban, HeartHandshake, Trophy, BookOpen, Newspaper, Sparkles, Users
};

export default function SectionsSettings() {
  const { sections, toggleSectionVisible } = useSections();
  return (
    <Card id="sections" title="Sections">
      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
        Toggle section visibility in the resume.
      </p>
      {sections.map(sec => {
        const Icon = SECTION_ICONS[sec.icon] || FileText;
        return (
          <div key={sec.id} className="cz-section-vis-row">
            <Icon size={14} />
            <span>{sec.heading}</span>
            <button
              className={`cz-toggle ${sec.visible ? 'on' : ''}`}
              onClick={() => toggleSectionVisible(sec.id)}
            >
              <span className="cz-toggle-thumb" />
            </button>
          </div>
        );
      })}
    </Card>
  );
}
