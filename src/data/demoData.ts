import type { Customize, PersonalInfo, Section, TemplateId } from '../types';

interface DemoData {
  template: TemplateId;
  personal: PersonalInfo;
  sections: Section[];
  customize: Customize;
}

const demoData: DemoData = {
  "template": "classic-clear",
  "personal": {
    "firstName": "Aria",
    "lastName": "Voss",
    "title": "Senior Software Developer",
    "email": "aria.voss@example.com",
    "phone": "+1 (555) 214-8830",
    "location": "Lisbon, Portugal",
    "linkedin": "in/ariavoss",
    "website": "ariavoss.dev",
    "photo": null
  },
  "sections": [
    {
      "id": "section-profile",
      "type": "profile",
      "heading": "Profile",
      "icon": "User",
      "visible": true,
      "entries": [
        {
          "id": "entry-profile-1",
          "visible": true,
          "content": "Senior Software Developer with 6+ years building resilient web platforms and distributed backend services. Comfortable across TypeScript, Go, and Rust. Loves shipping quietly, mentoring generously, and treating observability as a first-class citizen."
        }
      ]
    },
    {
      "id": "section-experience",
      "type": "experience",
      "heading": "Professional Experience",
      "icon": "Briefcase",
      "visible": true,
      "entries": [
        {
          "id": "entry-exp-1",
          "visible": true,
          "title": "Senior Software Developer",
          "company": "Northwind Labs",
          "startDate": "2023-02",
          "endDate": "",
          "current": true,
          "location": "Lisbon, Portugal",
          "bullets": [
            "Led rewrite of the billing service in Go, reducing p99 latency from 820ms to 140ms.",
            "Introduced feature-flag driven deploys; cut incident-related rollbacks by 70% over two quarters.",
            "Mentored 3 mid-level engineers into senior scope through weekly design reviews and paired debugging."
          ]
        },
        {
          "id": "entry-exp-2",
          "visible": true,
          "title": "Full-Stack Developer",
          "company": "Halcyon Studio",
          "startDate": "2020-08",
          "endDate": "2023-01",
          "current": false,
          "location": "Remote",
          "bullets": [
            "Built the client portal (Next.js + tRPC) serving 12k monthly active B2B users.",
            "Migrated core Postgres schema with zero downtime using dual-write and shadow-read strategies.",
            "Owned the analytics ingestion pipeline processing ~40M events/day on Kafka + ClickHouse."
          ]
        }
      ]
    },
    {
      "id": "section-skills",
      "type": "skills",
      "heading": "Skills",
      "icon": "Brain",
      "visible": true,
      "entries": [
        {
          "id": "entry-skill-1",
          "visible": true,
          "category": "Languages",
          "items": "TypeScript, Go, Rust, Python, SQL"
        },
        {
          "id": "entry-skill-2",
          "visible": true,
          "category": "Frontend",
          "items": "React, Next.js, Vite, Tailwind, Zustand, Playwright"
        },
        {
          "id": "entry-skill-3",
          "visible": true,
          "category": "Backend & Infra",
          "items": "Node.js, Go Fiber, PostgreSQL, Redis, Kafka, ClickHouse, Docker, Kubernetes, AWS"
        },
        {
          "id": "entry-skill-4",
          "visible": true,
          "category": "Practices",
          "items": "System design, observability (OpenTelemetry), TDD, DORA metrics, incident review"
        }
      ]
    },
    {
      "id": "section-education",
      "type": "education",
      "heading": "Education",
      "icon": "GraduationCap",
      "visible": true,
      "entries": [
        {
          "id": "entry-edu-1",
          "visible": true,
          "degree": "B.Sc. in Computer Science",
          "school": "University of Coimbra",
          "startDate": "2014-09",
          "endDate": "2018-06",
          "location": "Coimbra, Portugal",
          "bullets": [
            "Graduated with distinction (16/20).",
            "Thesis: Latency-aware scheduling for edge-deployed WebAssembly workloads."
          ]
        }
      ]
    },
    {
      "id": "section-languages",
      "type": "languages",
      "heading": "Languages",
      "icon": "Globe",
      "visible": true,
      "entries": [
        {
          "id": "entry-lang-1",
          "visible": true,
          "language": "Portuguese",
          "level": 5
        },
        {
          "id": "entry-lang-2",
          "visible": true,
          "language": "English",
          "level": 5
        },
        {
          "id": "entry-lang-3",
          "visible": true,
          "language": "Spanish",
          "level": 3
        }
      ]
    },
    {
      "id": "section-certifications",
      "type": "certifications",
      "heading": "Certifications",
      "icon": "Award",
      "visible": true,
      "entries": [
        {
          "id": "entry-cert-1",
          "visible": true,
          "name": "AWS Certified Solutions Architect – Associate",
          "issuer": "Amazon Web Services",
          "date": "2024-03"
        },
        {
          "id": "entry-cert-2",
          "visible": true,
          "name": "CKA: Certified Kubernetes Administrator",
          "issuer": "CNCF",
          "date": "2023-08"
        }
      ]
    }
  ],
  "customize": {}
};

export default demoData;
