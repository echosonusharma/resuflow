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

const CERT_LABELS = {
  awards: { name: 'Award Name', namePlaceholder: 'e.g. Employee of the Year', issuer: 'Awarded By' },
  courses: { name: 'Course Name', namePlaceholder: 'e.g. Machine Learning Specialization', issuer: 'Institution' },
  publications: { name: 'Title', namePlaceholder: 'e.g. Scaling Distributed Systems', issuer: 'Publisher' },
};

export default function EntryForm({ sectionId, sectionType, entry }) {
  switch (sectionType) {
    case 'profile': return <ProfileForm sectionId={sectionId} entry={entry} />;
    case 'experience':
    case 'volunteering': return <ExperienceForm sectionId={sectionId} entry={entry} />;
    case 'skills':
    case 'interests': return <SkillsForm sectionId={sectionId} entry={entry} />;
    case 'education': return <EducationForm sectionId={sectionId} entry={entry} />;
    case 'languages': return <LanguagesForm sectionId={sectionId} entry={entry} />;
    case 'certifications':
    case 'awards':
    case 'courses':
    case 'publications':
      return <CertificationsForm sectionId={sectionId} entry={entry} labels={CERT_LABELS[sectionType]} />;
    case 'projects': return <ProjectsForm sectionId={sectionId} entry={entry} />;
    case 'references': return <ReferencesForm sectionId={sectionId} entry={entry} />;
    default: return <CustomForm sectionId={sectionId} entry={entry} />;
  }
}
