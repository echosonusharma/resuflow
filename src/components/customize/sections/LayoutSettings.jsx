import React, { useRef } from 'react';
import { GripVertical, User, Briefcase, Brain, GraduationCap, Globe, Award, FileText, AlignJustify } from 'lucide-react';
import Card from '../ui/Card.jsx';
import { useSections, useActiveTemplate } from '../../../hooks/index.js';

const SECTION_ICONS = {
  User, Briefcase, Brain, GraduationCap, Globe, Award, FileText
};

export default function LayoutSettings({ customize, updateCustomize }) {
  const { sections, reorderSections } = useSections();
  const { meta } = useActiveTemplate();
  const layout = customize.layout || {};
  const supportedColumns = meta?.supports?.columns || ['one'];
  const dragItem = useRef(null);
  const dragOver = useRef(null);

  function handleDragStart(i) { dragItem.current = i; }
  function handleDragEnter(i) { dragOver.current = i; }
  function handleDragEnd() {
    if (dragItem.current === null || dragOver.current === null) return;
    if (dragItem.current !== dragOver.current) {
      reorderSections(dragItem.current, dragOver.current);
    }
    dragItem.current = null;
    dragOver.current = null;
  }

  const allColumns = [
    { id: 'one', label: 'One', bars: [1] },
    { id: 'two', label: 'Two', bars: [0.45, 0.45] },
    { id: 'mix', label: 'Mix', bars: [0.3, 0.6] },
  ];
  const columns = allColumns.filter(c => supportedColumns.includes(c.id));

  return (
    <Card id="layout" title="Layout">
      {columns.length > 1 && (
        <>
          <p className="cz-form-label" style={{ marginBottom: 10 }}>Columns</p>
          <div className="cz-columns-picker">
            {columns.map(col => (
              <button
                key={col.id}
                className={`cz-col-option ${(layout.columns || 'one') === col.id ? 'active' : ''}`}
                onClick={() => updateCustomize('layout', { columns: col.id })}
              >
                <div className="cz-col-icon">
                  {col.bars.map((w, i) => (
                    <div key={i} className="cz-col-bar" style={{ flex: w }} />
                  ))}
                </div>
                <span>{col.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <p className="cz-form-label" style={{ marginBottom: 10 }}>Change Section Layout</p>
      <div className="cz-section-order">
        <div className="cz-section-order-item cz-section-order-personal">
          <User size={15} />
          <span>Personal Details</span>
        </div>
        {sections.map((sec, i) => {
          const Icon = SECTION_ICONS[sec.icon] || FileText;
          return (
            <div
              key={sec.id}
              className="cz-section-order-item"
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={e => e.preventDefault()}
            >
              <GripVertical size={14} className="cz-drag-handle" />
              <Icon size={15} />
              <span>{sec.heading}</span>
            </div>
          );
        })}
        <div className="cz-section-order-item cz-section-order-pagebreak" style={{ borderStyle: 'dashed' }}>
          <AlignJustify size={15} />
          <span>Page break</span>
        </div>
      </div>
    </Card>
  );
}
