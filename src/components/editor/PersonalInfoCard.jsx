import React, { useState, useRef, useMemo } from 'react';
import { Camera, User, Link as LinkIcon, ArrowUpDown, Plus, X } from 'lucide-react';
import { usePersonal } from '../../hooks/index.js';
import { validateEmail, validatePhone, validateLinkedIn, validateWebsite } from '../../utils/validation.js';
import { alertDialog } from '../ui/dialog.jsx';

const FIELDS = {
  title:       { label: 'Professional Title', placeholder: 'e.g. Software Developer' },
  email:       { label: 'Email', type: 'email', placeholder: 'you@email.com', validate: validateEmail },
  phone:       { label: 'Phone', type: 'tel', placeholder: '+1 234 567 8900', validate: validatePhone },
  location:    { label: 'Location', placeholder: 'City, Country' },
  linkedin:    { label: 'LinkedIn', placeholder: 'in/yourprofile', validate: validateLinkedIn, linkChip: true },
  website:     { label: 'Website', placeholder: 'yoursite.com', validate: validateWebsite, linkChip: true },
  github:      { label: 'GitHub', placeholder: 'yourhandle', linkChip: true },
  nationality: { label: 'Nationality', placeholder: 'e.g. Indian' },
  dateOfBirth: { label: 'Date of Birth', type: 'date' },
  visa:        { label: 'Visa', placeholder: 'e.g. H1-B' },
  passportId:  { label: 'Passport / ID', placeholder: 'Passport number' },
  availability:{ label: 'Availability', placeholder: 'e.g. Immediate' },
};

const DEFAULT_ORDER = ['title', 'email', 'phone', 'location', 'linkedin'];
const REMOVABLE = new Set(['github', 'nationality', 'dateOfBirth', 'visa', 'passportId', 'availability', 'website']);

export default function PersonalInfoCard() {
  const { personal, updatePersonal } = usePersonal();
  const [touched, setTouched] = useState({});
  const fileInputRef = useRef(null);

  // Store is the source of truth: stays in sync with undo/redo and demo fill.
  const order = useMemo(() => {
    const stored = Array.isArray(personal._fieldOrder) && personal._fieldOrder.length
      ? personal._fieldOrder.filter(k => FIELDS[k])
      : [...DEFAULT_ORDER];
    Object.keys(FIELDS).forEach(k => {
      if (!stored.includes(k) && personal[k] != null && personal[k] !== '') stored.push(k);
    });
    return stored;
  }, [personal]);

  function setOrder(next) {
    updatePersonal({ _fieldOrder: typeof next === 'function' ? next(order) : next });
  }

  const [dragKey, setDragKey] = useState(null);
  const [overKey, setOverKey] = useState(null);

  function set(field, value) {
    updatePersonal({ [field]: value });
  }
  function touch(field) {
    setTouched(t => ({ ...t, [field]: true }));
  }
  function addField(key) {
    updatePersonal({
      _fieldOrder: order.includes(key) ? order : [...order, key],
      ...(personal[key] == null ? { [key]: '' } : {}),
    });
  }
  function removeField(key) {
    updatePersonal({ _fieldOrder: order.filter(k => k !== key), [key]: '' });
  }

  function onDragStart(key) { setDragKey(key); }
  function onDragOver(e, key) {
    e.preventDefault();
    if (key !== overKey) setOverKey(key);
  }
  function onDrop(e, targetKey) {
    e.preventDefault();
    if (!dragKey || dragKey === targetKey) { setDragKey(null); setOverKey(null); return; }
    setOrder(o => {
      const next = o.filter(k => k !== dragKey);
      const idx = next.indexOf(targetKey);
      next.splice(idx, 0, dragKey);
      return next;
    });
    setDragKey(null);
    setOverKey(null);
  }
  function onDragEnd() { setDragKey(null); setOverKey(null); }

  function handlePhotoClick() { fileInputRef.current?.click(); }

  const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) {
      alertDialog('Please choose a JPG, PNG, or WebP image.', { title: 'Invalid image' });
      return;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      alertDialog('Image is too large. Maximum size is 5 MB.', { title: 'Image too large' });
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      // verify it actually decodes as an image before saving
      const img = new Image();
      img.onload = () => set('photo', dataUrl);
      img.onerror = () => alertDialog('That file could not be read as an image.', { title: 'Invalid image' });
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  const availableOptional = Object.keys(FIELDS).filter(k => !order.includes(k));

  const displayName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || 'Your Name';
  const displayTitle = personal.title || 'Your Title';

  return (
    <div className="personal-card">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={handlePhotoChange}
      />

      <div className="personal-card-header">
        <div className="personal-photo-circle" onClick={handlePhotoClick} title="Click to upload photo">
          {personal.photo ? (
            <img src={personal.photo} alt="Profile" />
          ) : (
            <User size={22} style={{ color: 'var(--color-primary)' }} />
          )}
          <div className="personal-photo-overlay">
            <Camera size={16} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="personal-card-name">{displayName}</div>
          <div className="personal-card-title">{displayTitle}</div>
        </div>
      </div>

      <div className="pi-form">
        <div className="pi-half-row">
          <div className="pi-field">
            <label className="pi-label">First Name</label>
            <input
              className="form-input pi-input"
              value={personal.firstName || ''}
              onChange={e => set('firstName', e.target.value)}
              placeholder="First name"
            />
          </div>
          <div className="pi-field">
            <label className="pi-label">Last Name</label>
            <input
              className="form-input pi-input"
              value={personal.lastName || ''}
              onChange={e => set('lastName', e.target.value)}
              placeholder="Last name"
            />
          </div>
        </div>

        {order.map(key => {
          const f = FIELDS[key];
          if (!f) return null;
          const err = touched[key] && f.validate ? f.validate(personal[key]) : null;
          const isDragging = dragKey === key;
          const isOver = overKey === key && dragKey && dragKey !== key;
          return (
            <div
              key={key}
              className={`pi-field-row ${isDragging ? 'dragging' : ''} ${isOver ? 'drag-over' : ''}`}
              onDragOver={e => onDragOver(e, key)}
              onDrop={e => onDrop(e, key)}
            >
              <div className="pi-field">
                <label className="pi-label">{f.label}</label>
                <div className="pi-input-wrap">
                  <input
                    className={`form-input pi-input ${err ? 'has-error' : ''}`}
                    type={f.type || 'text'}
                    value={personal[key] || ''}
                    onChange={e => set(key, e.target.value)}
                    onBlur={() => touch(key)}
                    placeholder={f.placeholder}
                  />
                  {f.linkChip && personal[key] && (
                    <button type="button" className="pi-link-chip" tabIndex={-1}>
                      <LinkIcon size={12} /> Link
                    </button>
                  )}
                </div>
                {err && <div className="form-error">{err}</div>}
              </div>
              <button
                type="button"
                className="pi-reorder-handle"
                title="Drag to reorder"
                draggable
                onDragStart={() => onDragStart(key)}
                onDragEnd={onDragEnd}
              >
                <ArrowUpDown size={16} />
              </button>
              {REMOVABLE.has(key) && (
                <button
                  type="button"
                  className="pi-remove-btn"
                  title="Remove field"
                  onClick={() => removeField(key)}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          );
        })}

        {availableOptional.length > 0 && (
          <div className="pi-add-details">
            <div className="pi-add-details-label">Add details</div>
            <div className="pi-add-details-chips">
              {availableOptional.map(k => (
                <button
                  key={k}
                  type="button"
                  className="pi-chip"
                  onClick={() => addField(k)}
                >
                  <Plus size={12} /> {FIELDS[k].label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
