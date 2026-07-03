function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export const initialState = {
  template: 'classic-clear',
  personal: {
    firstName: 'Sonu',
    lastName: 'Sharma',
    title: 'Software Developer',
    email: 'echosonusharma@gmail.com',
    phone: '+919123858250',
    location: 'Kolkata, India',
    linkedin: 'in/sonusharma007',
    website: 'echosonusharma',
    photo: null
  },
  sections: [
    {
      id: 'section-profile',
      type: 'profile',
      heading: 'Profile',
      icon: 'User',
      visible: true,
      entries: [
        {
          id: 'entry-profile-1',
          visible: true,
          content:
            'Passionate Software Developer with 4+ years of experience building scalable web applications and backend services. Skilled in JavaScript, TypeScript, GoLang, React, and cloud technologies. Driven by clean code, great UX, and delivering impactful products.'
        }
      ]
    },
    {
      id: 'section-experience',
      type: 'experience',
      heading: 'Professional Experience',
      icon: 'Briefcase',
      visible: true,
      entries: [
        {
          id: 'entry-exp-1',
          visible: true,
          title: 'Senior Software Developer',
          company: 'Eclat Engineering',
          startDate: '2022-06',
          endDate: '',
          current: true,
          location: 'Kolkata, India',
          bullets: [
            'Architected and delivered a microservices-based SaaS platform handling 50k+ daily active users.',
            'Led a team of 4 engineers to redesign the core API layer using GoLang, reducing latency by 40%.',
            'Integrated CI/CD pipelines with GitHub Actions and Docker, cutting deployment time from 45 min to 8 min.'
          ]
        },
        {
          id: 'entry-exp-2',
          visible: true,
          title: 'Software Developer',
          company: 'Freelance / Contract',
          startDate: '2020-09',
          endDate: '2022-05',
          current: false,
          location: 'Remote',
          bullets: [
            'Built and shipped 10+ React and Next.js web applications for clients across e-commerce, SaaS, and media sectors.',
            'Developed RESTful APIs with Node.js and PostgreSQL, improving data retrieval speeds by 35%.',
            'Implemented real-time features using WebSockets for a live collaboration tool with 2,000+ users.'
          ]
        },
        {
          id: 'entry-exp-3',
          visible: true,
          title: 'Junior Frontend Developer',
          company: 'TechStart Solutions',
          startDate: '2019-07',
          endDate: '2020-08',
          current: false,
          location: 'Kolkata, India',
          bullets: [
            'Converted Figma mockups to pixel-perfect React components with responsive layouts.',
            'Optimized bundle sizes and loading performance, achieving Lighthouse scores of 95+.',
            'Collaborated with product and design teams in agile sprints to ship bi-weekly releases.'
          ]
        }
      ]
    },
    {
      id: 'section-skills',
      type: 'skills',
      heading: 'Skills',
      icon: 'Brain',
      visible: true,
      entries: [
        {
          id: 'entry-skill-1',
          visible: true,
          category: 'Languages',
          items: 'JavaScript, TypeScript, GoLang, Python, SQL'
        },
        {
          id: 'entry-skill-2',
          visible: true,
          category: 'Frontend',
          items: 'React, Next.js, Vite, Tailwind CSS, SCSS, HTML5, CSS3'
        },
        {
          id: 'entry-skill-3',
          visible: true,
          category: 'Backend & Cloud',
          items: 'Node.js, Express, Go Fiber, PostgreSQL, MongoDB, Redis, AWS, Docker, Kubernetes'
        },
        {
          id: 'entry-skill-4',
          visible: true,
          category: 'Tools',
          items: 'Git, GitHub Actions, Figma, Jira, VS Code, Postman, Linux'
        }
      ]
    },
    {
      id: 'section-education',
      type: 'education',
      heading: 'Education',
      icon: 'GraduationCap',
      visible: true,
      entries: [
        {
          id: 'entry-edu-1',
          visible: true,
          degree: 'B.Tech in Computer Science & Engineering',
          school: 'Heritage Institute of Technology',
          startDate: '2015-07',
          endDate: '2019-06',
          location: 'Kolkata, India',
          bullets: [
            'Graduated with First Class Honours, CGPA 8.4/10.',
            'Final year project: Real-time collaborative code editor using WebSockets and React.'
          ]
        }
      ]
    },
    {
      id: 'section-languages',
      type: 'languages',
      heading: 'Languages',
      icon: 'Globe',
      visible: true,
      entries: [
        { id: 'entry-lang-1', visible: true, language: 'English', level: 5 },
        { id: 'entry-lang-2', visible: true, language: 'Hindi', level: 5 },
        { id: 'entry-lang-3', visible: true, language: 'Bengali', level: 4 }
      ]
    },
    {
      id: 'section-certifications',
      type: 'certifications',
      heading: 'Certifications',
      icon: 'Award',
      visible: true,
      entries: [
        {
          id: 'entry-cert-1',
          visible: true,
          name: 'AWS Certified Developer – Associate',
          issuer: 'Amazon Web Services',
          date: '2023-04'
        },
        {
          id: 'entry-cert-2',
          visible: true,
          name: 'Google Professional Cloud Developer',
          issuer: 'Google Cloud',
          date: '2022-11'
        }
      ]
    }
  ],
  customize: {}
};
