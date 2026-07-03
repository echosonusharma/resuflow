import React from 'react';
import ProfileForm from './ProfileForm.jsx';
import ExperienceForm from './ExperienceForm.jsx';
import SkillsForm from './SkillsForm.jsx';
import EducationForm from './EducationForm.jsx';
import LanguagesForm from './LanguagesForm.jsx';
import CertificationsForm from './CertificationsForm.jsx';
import CustomForm from './CustomForm.jsx';

export default function EntryForm({ sectionId, sectionType, entry }) {
  switch (sectionType) {
    case 'profile': return <ProfileForm sectionId={sectionId} entry={entry} />;
    case 'experience': return <ExperienceForm sectionId={sectionId} entry={entry} />;
    case 'skills': return <SkillsForm sectionId={sectionId} entry={entry} />;
    case 'education': return <EducationForm sectionId={sectionId} entry={entry} />;
    case 'languages': return <LanguagesForm sectionId={sectionId} entry={entry} />;
    case 'certifications': return <CertificationsForm sectionId={sectionId} entry={entry} />;
    default: return <CustomForm sectionId={sectionId} entry={entry} />;
  }
}
