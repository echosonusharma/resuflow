import type { Customize } from './customize';

export interface EntryBase {
  id: string;
  visible: boolean;
}

export interface ProfileEntry extends EntryBase {
  content: string;
}

export interface ExperienceEntry extends EntryBase {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  bullets: string[];
}

export interface SkillsEntry extends EntryBase {
  category: string;
  items: string;
}

export interface EducationEntry extends EntryBase {
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  location: string;
  bullets: string[];
}

export interface LanguageEntry extends EntryBase {
  language: string;
  /** 1–5 proficiency */
  level: number;
}

export interface CertEntry extends EntryBase {
  name: string;
  issuer: string;
  date: string;
}

export interface ProjectEntry extends EntryBase {
  title: string;
  link: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface ReferenceEntry extends EntryBase {
  name: string;
  position: string;
  contact: string;
}

export type EntryMap = {
  profile: ProfileEntry;
  custom: ProfileEntry;
  experience: ExperienceEntry;
  volunteering: ExperienceEntry;
  skills: SkillsEntry;
  interests: SkillsEntry;
  education: EducationEntry;
  languages: LanguageEntry;
  certifications: CertEntry;
  awards: CertEntry;
  courses: CertEntry;
  publications: CertEntry;
  projects: ProjectEntry;
  references: ReferenceEntry;
};

export type SectionType = keyof EntryMap;

export type Entry = EntryMap[SectionType];

export interface SectionOf<T extends SectionType> {
  id: string;
  type: T;
  heading: string;
  /** Lucide icon name */
  icon: string;
  visible: boolean;
  entries: EntryMap[T][];
}

/** Discriminated union on `.type` — narrowing a Section narrows its entries. */
export type Section = { [K in SectionType]: SectionOf<K> }[SectionType];

export interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  github?: string;
  nationality?: string;
  dateOfBirth?: string;
  visa?: string;
  passportId?: string;
  availability?: string;
  /** data URL */
  photo?: string | null;
  /** contact field display order */
  _fieldOrder?: string[];
}

export type TemplateId = 'classic-clear' | 'slate-sidebar' | 'compact-ats' | 'obsidian-edge';

export interface Resume {
  /** null only in the store's EMPTY_DOC placeholder before a resume is loaded */
  id: string | null;
  name: string;
  template: TemplateId;
  personal: PersonalInfo;
  sections: Section[];
  customize: Customize;
  createdAt?: number;
  updatedAt?: number;
}

/** A resume persisted in IndexedDB always has an id. */
export type SavedResume = Resume & { id: string };
