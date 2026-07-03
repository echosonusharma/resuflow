import React, { useState, useRef } from 'react';
import {
  ChevronDown, Eye, EyeOff, X, Plus, Trash2,
  User, Briefcase, Brain, GraduationCap, Globe, Award, FileText
} from 'lucide-react';
import { useSections } from '../../hooks/index.js';
import EntryForm from './entry-forms/index.jsx';

const ICON_MAP = {
  User: <User size={14} />,
  Briefcase: <Briefcase size={14} />,
  Brain: <Brain size={14} />,
  GraduationCap: <GraduationCap size={14} />,
  Globe: <Globe size={14} />,
  Award: <Award size={14} />,
  FileText: <FileText size={14} />
};

function getEntrySummary(type, entry) {
  switch (type) {
    case 'profile':
      return entry.content ? entry.content.slice(0, 60) + (entry.content.length > 60 ? '…' : '') : 'Profile summary';
    case 'experience':
      return [entry.title, entry.company].filter(Boolean).join(', ') || 'New experience';
    case 'skills':
      return entry.category || 'Skills category';
    case 'education':
      return [entry.degree, entry.school].filter(Boolean).join(', ') || 'New education';
    case 'languages':
      return entry.language || 'Language';
    case 'certifications':
      return entry.name || 'New certification';
    default:
      return entry.content ? entry.content.slice(0, 50) : 'Entry';
  }
}

export default function SectionCard({ section }) {
  const { updateSectionHeading, toggleEntryVisible, removeEntry: removeEntryHook, addEntry, removeSection, reorderEntries } = useSections();
  const [expanded, setExpanded] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [editingHeading, setEditingHeading] = useState(false);
  const [headingValue, setHeadingValue] = useState(section.heading);
  const headingInputRef = useRef(null);
  const dragItem = useRef(null);
  const dragOver = useRef(null);

  function handleDragStart(i) { dragItem.current = i; }
  function handleDragEnter(i) { dragOver.current = i; }
  function handleDragEnd() {
    if (dragItem.current === null || dragOver.current === null) return;
    if (dragItem.current !== dragOver.current) {
      reorderEntries(section.id, dragItem.current, dragOver.current);
    }
    dragItem.current = null;
    dragOver.current = null;
  }

  function toggleSection(e) {
    // Don't toggle if clicking inside header controls
    if (e.target.closest('.section-edit-heading-btn') ||
        e.target.closest('.section-heading-input')) return;
    setExpanded(prev => !prev);
  }

  function startEditHeading(e) {
    e.stopPropagation();
    setEditingHeading(true);
    setHeadingValue(section.heading);
    setTimeout(() => headingInputRef.current?.focus(), 10);
  }

  function commitHeading() {
    updateSectionHeading(section.id, headingValue || section.heading);
    setEditingHeading(false);
  }

  function handleHeadingKey(e) {
    if (e.key === 'Enter') commitHeading();
    if (e.key === 'Escape') { setHeadingValue(section.heading); setEditingHeading(false); }
  }

  function toggleEntry(entryId) {
    setExpandedEntry(prev => prev === entryId ? null : entryId);
  }

  function handleToggleEntryVisible(e, entryId) {
    e.stopPropagation();
    toggleEntryVisible(section.id, entryId);
  }

  function handleRemoveEntry(e, entryId) {
    e.stopPropagation();
    removeEntryHook(section.id, entryId);
    if (expandedEntry === entryId) setExpandedEntry(null);
  }

  function handleAddEntry() {
    addEntry(section.id, section.type);
  }

  function deleteSection() {
    if (window.confirm(`Delete the "${section.heading}" section and all its entries?`)) {
      removeSection(section.id);
    }
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
