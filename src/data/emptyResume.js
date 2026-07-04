function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function emptyEntry(type) {
  switch (type) {
    case 'profile':
      return { id: uid(), visible: true, content: '' };
    case 'experience':
      return {
        id: uid(), visible: true, title: '', company: '',
        startDate: '', endDate: '', current: false, location: '', bullets: [''],
      };
    case 'skills':
      return { id: uid(), visible: true, category: '', items: '' };
    case 'education':
      return {
        id: uid(), visible: true, degree: '', school: '',
        startDate: '', endDate: '', location: '', bullets: [''],
      };
    case 'languages':
      return { id: uid(), visible: true, language: '', level: 3 };
    case 'certifications':
      return { id: uid(), visible: true, name: '', issuer: '', date: '' };
    default:
      return { id: uid(), visible: true, content: '' };
  }
}

function section(type, heading, icon) {
  return {
    id: uid(),
    type,
    heading,
    icon,
    visible: true,
    entries: [emptyEntry(type)],
  };
}

export function createEmptyResume({ name = 'Untitled resume', template = 'classic-clear' } = {}) {
  const now = Date.now();
  return {
    id: uid(),
    name,
    template,
    personal: {
      firstName: '', lastName: '', title: '', email: '',
      phone: '', location: '', linkedin: '', website: '', photo: null,
    },
    sections: [
      section('profile', 'Profile', 'User'),
      section('experience', 'Professional Experience', 'Briefcase'),
      section('skills', 'Skills', 'Brain'),
      section('education', 'Education', 'GraduationCap'),
    ],
    customize: {},
    createdAt: now,
    updatedAt: now,
  };
}
