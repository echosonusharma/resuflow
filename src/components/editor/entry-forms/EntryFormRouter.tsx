import React from 'react';
import ProfileForm from './ProfileForm.jsx';
import ExperienceForm from './ExperienceForm.jsx';
import SkillsForm from './SkillsForm.jsx';
import EducationForm from './EducationForm.jsx';
import LanguagesForm from './LanguagesForm.jsx';
import CertificationsForm from './CertificationsForm.jsx';
import ProjectsForm from './ProjectsForm.jsx';
import ReferencesForm from './ReferencesForm.jsx';
import CustomForm from './CustomForm.jsx';
import type { SectionType, Entry, ProfileEntry, ExperienceEntry, SkillsEntry, EducationEntry, LanguageEntry, CertEntry, ProjectEntry, ReferenceEntry } from '../../../types';

type CertLabelKey = 'awards' | 'courses' | 'publications';

const CERT_LABELS: Record<CertLabelKey, { name: string; namePlaceholder: string; issuer: string }> = {
  awards: { name: 'Award Name', namePlaceholder: 'e.g. Employee of the Year', issuer: 'Awarded By' },
  courses: { name: 'Course Name', namePlaceholder: 'e.g. Machine Learning Specialization', issuer: 'Institution' },
  publications: { name: 'Title', namePlaceholder: 'e.g. Scaling Distributed Systems', issuer: 'Publisher' },
};

interface EntryFormRouterProps {
  sectionId: string;
  sectionType: SectionType;
  entry: Entry;
}

export default function EntryForm({ sectionId, sectionType, entry }: EntryFormRouterProps) {
  switch (sectionType) {
    case 'profile': return <ProfileForm sectionId={sectionId} entry={entry as ProfileEntry} />;
    case 'experience':
    case 'volunteering': return <ExperienceForm sectionId={sectionId} entry={entry as ExperienceEntry} />;
    case 'skills':
    case 'interests': return <SkillsForm sectionId={sectionId} entry={entry as SkillsEntry} />;
    case 'education': return <EducationForm sectionId={sectionId} entry={entry as EducationEntry} />;
    case 'languages': return <LanguagesForm sectionId={sectionId} entry={entry as LanguageEntry} />;
    case 'certifications':
    case 'awards':
    case 'courses':
    case 'publications':
      return <CertificationsForm sectionId={sectionId} entry={entry as CertEntry} labels={CERT_LABELS[sectionType as CertLabelKey]} />;
    case 'projects': return <ProjectsForm sectionId={sectionId} entry={entry as ProjectEntry} />;
    case 'references': return <ReferencesForm sectionId={sectionId} entry={entry as ReferenceEntry} />;
    default: return <CustomForm sectionId={sectionId} entry={entry as ProfileEntry} />;
  }
}
