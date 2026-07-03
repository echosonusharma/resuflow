import React, { useState, useRef } from 'react';
import {
  Mail, Phone, MapPin, Linkedin, Globe, Pencil, Camera, User, Check
} from 'lucide-react';
import { usePersonal } from '../../hooks/index.js';

export default function PersonalInfoCard() {
  const { personal, updatePersonal } = usePersonal();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...personal });
  const fileInputRef = useRef(null);

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function save() {
    updatePersonal(form);
    setEditing(false);
  }

  function cancel() {
    setForm({ ...personal });
    setEditing(false);
  }

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const photoData = ev.target.result;
      setForm(prev => ({ ...prev, photo: photoData }));
      if (!editing) {
        updatePersonal({ photo: photoData });
      }
    };
    reader.readAsDataURL(file);
  }

  const photoSrc = editing ? form.photo : personal.photo;
  const displayName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || 'Your Name';
  const displayTitle = personal.title || 'Your Title';

  return (
    <div className="personal-card">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handlePhotoChange}
      />

      <div className="personal-card-header">
        {/* Photo */}
        <div className="personal-photo-circle" onClick={handlePhotoClick} title="Click to upload photo">
          {photoSrc ? (
            <img src={photoSrc} alt="Profile" />
          ) : (
            <User size={22} style={{ color: 'var(--color-primary)' }} />
          )}
          <div className="personal-photo-overlay">
            <Camera size={16} />
          </div>
        </div>

        {/* Name & title */}
        <div style={{ flex: 1 }}>
          <div className="personal-card-name">{displayName}</div>
          <div className="personal-card-title">{displayTitle}</div>
        </div>

        {/* Edit / Save button */}
        {editing ? (
          <div style={{ display: 'flex', gap: 6, position: 'absolute', top: 12, right: 12 }}>
            <button
              className="personal-card-edit-btn"
              onClick={save}
              style={{ background: '#dcfce7', color: '#16a34a' }}
            >
              <Check size={12} />
              Save
            </button>
            <button
              className="personal-card-edit-btn"
              onClick={cancel}
              style={{ background: '#f3f4f6', color: '#6b7280' }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button className="personal-card-edit-btn" onClick={() => setEditing(true)}>
            <Pencil size={12} />
            Edit
          </button>
        )}
      </div>

      {/* Info rows (view mode) */}
      {!editing && (
        <div className="personal-card-info">
          {personal.email && (
            <div className="personal-info-row">
              <Mail size={12} />{personal.email}
            </div>
          )}
          {personal.phone && (
            <div className="personal-info-row">
              <Phone size={12} />{personal.phone}
            </div>
          )}
          {personal.location && (
            <div className="personal-info-row">
              <MapPin size={12} />{personal.location}
            </div>
          )}
          {personal.linkedin && (
            <div className="personal-info-row">
              <Linkedin size={12} />{personal.linkedin}
            </div>
          )}
          {personal.website && (
            <div className="personal-info-row">
              <Globe size={12} />{personal.website}
            </div>
          )}
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="personal-edit-form">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              className="form-input"
              value={form.firstName}
              onChange={e => update('firstName', e.target.value)}
              placeholder="First name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              className="form-input"
              value={form.lastName}
              onChange={e => update('lastName', e.target.value)}
              placeholder="Last name"
            />
          </div>
          <div className="form-group full-width">
            <label className="form-label">Professional Title</label>
            <input
              className="form-input"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              placeholder="e.g. Software Developer"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="you@email.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              className="form-input"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              placeholder="+1 234 567 8900"
            />
          </div>
          <div className="form-group full-width">
            <label className="form-label">Location</label>
            <input
              className="form-input"
              value={form.location}
              onChange={e => update('location', e.target.value)}
              placeholder="City, Country"
            />
          </div>
          <div className="form-group">
            <label className="form-label">LinkedIn</label>
            <input
              className="form-input"
              value={form.linkedin}
              onChange={e => update('linkedin', e.target.value)}
              placeholder="in/yourprofile"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Website</label>
            <input
              className="form-input"
              value={form.website}
              onChange={e => update('website', e.target.value)}
              placeholder="yoursite.com"
            />
          </div>
        </div>
      )}
    </div>
  );
}
