import React, { useState, useRef } from 'react';
import {
  ChevronDown, Eye, EyeOff, X, Plus, Trash2,
  User, Briefcase, Brain, GraduationCap, Globe, Award, FileText,
  FolderKanban, HeartHandshake, Trophy, BookOpen, Newspaper, Sparkles, Users
} from 'lucide-react';
import { useSections } from '../../hooks/index.js';
import EntryForm from './entry-forms/index.jsx';
import { confirmDialog } from '../ui/dialog.jsx';
import type { Section, Entry, SectionType, ExperienceEntry, EducationEntry, SkillsEntry, LanguageEntry, CertEntry, ProjectEntry, ReferenceEntry, ProfileEntry } from '../../types';

const ICON_MAP: Record<string, React.ReactElement> = {
  User: <User size={14} />,
  Briefcase: <Briefcase size={14} />,
  Brain: <Brain size={14} />,
  GraduationCap: <GraduationCap size={14} />,
  Globe: <Globe size={14} />,
  Award: <Award size={14} />,
  FileText: <FileText size={14} />,
  FolderKanban: <FolderKanban size={14} />,
  HeartHandshake: <HeartHandshake size={14} />,
  Trophy: <Trophy size={14} />,
  BookOpen: <BookOpen size={14} />,
  Newspaper: <Newspaper size={14} />,
  Sparkles: <Sparkles size={14} />,
  Users: <Users size={14} />
};

function getEntrySummary(type: SectionType, entry: Entry): string {
  switch (type) {
    case 'profile':
    case 'custom': {
      const e = entry as ProfileEntry;
      return e.content ? e.content.slice(0, 60) + (e.content.length > 60 ? '…' : '') : 'Profile summary';
    }
    case 'experience':
    case 'volunteering': {
      const e = entry as ExperienceEntry;
      return [e.title, e.company].filter(Boolean).join(', ') || 'New experience';
    }
    case 'skills': {
      const e = entry as SkillsEntry;
      return e.category || 'Skills category';
    }
    case 'education': {
      const e = entry as EducationEntry;
      return [e.degree, e.school].filter(Boolean).join(', ') || 'New education';
    }
    case 'languages': {
      const e = entry as LanguageEntry;
      return e.language || 'Language';
    }
    case 'certifications':
      return (entry as CertEntry).name || 'New certification';
    case 'awards':
      return (entry as CertEntry).name || 'New award';
    case 'courses':
      return (entry as CertEntry).name || 'New course';
    case 'publications':
      return (entry as CertEntry).name || 'New publication';
    case 'projects':
      return (entry as ProjectEntry).title || 'New project';
    case 'interests': {
      const e = entry as SkillsEntry;
      return e.category || e.items || 'Interests';
    }
    case 'references':
      return (entry as ReferenceEntry).name || 'New reference';
    default:
      return 'Entry';
  }
}

export default function SectionCard({ section }: { section: Section }) {
  const { updateSectionHeading, toggleEntryVisible, removeEntry: removeEntryHook, addEntry, removeSection, reorderEntries } = useSections();
  const [expanded, setExpanded] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [editingHeading, setEditingHeading] = useState(false);
  const [headingValue, setHeadingValue] = useState(section.heading);
  const headingInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  function handleDragStart(i: number) { dragItem.current = i; }
  function handleDragEnter(i: number) { dragOver.current = i; }
  function handleDragEnd() {
    if (dragItem.current === null || dragOver.current === null) return;
    if (dragItem.current !== dragOver.current) {
      reorderEntries(section.id, dragItem.current, dragOver.current);
    }
    dragItem.current = null;
    dragOver.current = null;
  }

  function toggleSection(e: React.MouseEvent<HTMLDivElement>) {
    // Don't toggle if clicking inside header controls
    const target = e.target as HTMLElement;
    if (target.closest('.section-edit-heading-btn') ||
        target.closest('.section-heading-input')) return;
    setExpanded(prev => !prev);
  }

  function startEditHeading(e: React.MouseEvent) {
    e.stopPropagation();
    setEditingHeading(true);
    setHeadingValue(section.heading);
    setTimeout(() => headingInputRef.current?.focus(), 10);
  }

  function commitHeading() {
    updateSectionHeading(section.id, headingValue || section.heading);
    setEditingHeading(false);
  }

  function handleHeadingKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitHeading();
    if (e.key === 'Escape') { setHeadingValue(section.heading); setEditingHeading(false); }
  }

  function toggleEntry(entryId: string) {
    setExpandedEntry(prev => prev === entryId ? null : entryId);
  }

  function handleToggleEntryVisible(e: React.MouseEvent, entryId: string) {
    e.stopPropagation();
    toggleEntryVisible(section.id, entryId);
  }

  function handleRemoveEntry(e: React.MouseEvent, entryId: string) {
    e.stopPropagation();
    removeEntryHook(section.id, entryId);
    if (expandedEntry === entryId) setExpandedEntry(null);
  }

  function handleAddEntry() {
    addEntry(section.id, section.type);
  }

  async function deleteSection() {
    const ok = await confirmDialog(
      `Delete the "${section.heading}" section and all its entries?`,
      { title: 'Delete section', confirmLabel: 'Delete', danger: true }
    );
    if (ok) removeSection(section.id);
  }

  return (
    <div className="section-card">
      {/* Header */}
      <div className="section-card-header" onClick={toggleSection}>
        <div className="section-card-icon">
          {ICON_MAP[section.icon] || <FileText size={14} />}
        </div>

        {editingHeading ? (
          <input
            ref={headingInputRef}
            className="section-heading-input"
            value={headingValue}
            onChange={e => setHeadingValue(e.target.value)}
            onBlur={commitHeading}
            onKeyDown={handleHeadingKey}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className="section-card-heading">{section.heading}</span>
        )}

        {expanded && !editingHeading && (
          <button
            className="section-edit-heading-btn"
            onClick={startEditHeading}
          >
            Edit
          </button>
        )}

        <ChevronDown
          size={15}
          className={`section-chevron ${expanded ? 'open' : ''}`}
        />
      </div>

      {/* Body */}
      {expanded && (
        <div className="section-card-body">
          {section.entries.map((entry, i) => (
            <React.Fragment key={entry.id}>
              {/* Entry row */}
              <div
                className={`entry-row ${expandedEntry === entry.id ? 'expanded' : ''} ${!entry.visible ? 'invisible' : ''}`}
                onClick={() => toggleEntry(entry.id)}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragEnter={() => handleDragEnter(i)}
                onDragEnd={handleDragEnd}
                onDragOver={e => e.preventDefault()}
              >
                <span className="entry-drag-handle" title="Drag to reorder">⠿</span>
                <span className="entry-summary">
                  {getEntrySummary(section.type, entry)}
                </span>
                <div className="entry-row-actions">
                  <button
                    className="entry-action-btn"
                    onClick={e => handleToggleEntryVisible(e, entry.id)}
                    title={entry.visible ? 'Hide from resume' : 'Show in resume'}
                  >
                    {entry.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button
                    className="entry-action-btn danger"
                    onClick={e => handleRemoveEntry(e, entry.id)}
                    title="Delete entry"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Inline entry form */}
              <div className={`entry-form-wrapper ${expandedEntry === entry.id ? 'open' : ''}`}>
                {expandedEntry === entry.id && (
                  <EntryForm
                    sectionId={section.id}
                    sectionType={section.type}
                    entry={entry}
                  />
                )}
              </div>
            </React.Fragment>
          ))}

          {/* Section footer */}
          <div className="section-card-footer">
            <button className="btn-add-entry" onClick={handleAddEntry}>
              <Plus size={13} />
              Add Entry
            </button>
            <button className="btn-delete-section" onClick={deleteSection}>
              <Trash2 size={12} />
              Delete Section
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
