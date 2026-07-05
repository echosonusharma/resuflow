# Resuflow Resume Schema

Generate a resume as a JSON object matching this schema. Return only valid JSON, no markdown fences, no explanation.

---

## Top-Level Structure

```json
{
  "name": "My Resume",
  "template": "classic-clear",
  "personal": { ... },
  "sections": [ ... ],
  "customize": {}
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | yes | Display name shown on the resume card. |
| `template` | string | yes | See [Templates](#templates). |
| `personal` | object | yes | See [Personal Info](#personal-info). |
| `sections` | array | yes | See [Sections](#sections). |
| `customize` | object | no | Leave `{}` for template defaults. |


---

## Templates

| Value | Description |
|-------|-------------|
| `classic-clear` | Clean single-column, traditional layout |
| `slate-sidebar` | Two-column with colored sidebar |
| `compact-ats` | ATS-optimized minimal layout |
| `obsidian-edge` | Bold dark header, modern |

---

## Personal Info

```json
"personal": {
  "firstName": "Aria",
  "lastName": "Voss",
  "title": "Senior Software Developer",
  "email": "aria.voss@example.com",
  "phone": "+1 (555) 214-8830",
  "location": "Lisbon, Portugal",
  "linkedin": "in/ariavoss",
  "website": "ariavoss.dev",
  "github": "ariavoss",
  "nationality": "Portuguese",
  "dateOfBirth": "1996-04-12",
  "visa": "EU Citizen",
  "passportId": "AB123456",
  "availability": "2 weeks notice",
  "photo": null
}
```

| Field | Type | Notes |
|-------|------|-------|
| `firstName` | string | |
| `lastName` | string | |
| `title` | string | Job title shown under the name |
| `email` | string | Rendered as `mailto:` link |
| `phone` | string | Rendered as `tel:` link |
| `location` | string | City, Country |
| `linkedin` | string | Any format: `in/handle`, `linkedin.com/in/handle`, or full URL |
| `website` | string | Any format: `domain.com` or full URL |
| `github` | string | Handle, `@handle`, or full URL |
| `nationality` | string | Optional |
| `dateOfBirth` | string | Optional, format `YYYY-MM-DD` |
| `visa` | string | Optional |
| `passportId` | string | Optional |
| `availability` | string | Optional, e.g. `Immediately`, `2 weeks notice` |
| `photo` | string\|null | Base64 data URL or `null`. Omit for text-only. |
| `_fieldOrder` | string[] | Optional. Controls contact field display order. Array of field keys. |

> Only `email`, `phone`, `location`, `linkedin`, `website` are shown by default. Other fields only appear if `_fieldOrder` includes them or the user adds them manually.

---

## Sections

Each item in `sections` follows this structure:

```json
{
  "type": "experience",
  "heading": "Professional Experience",
  "icon": "Briefcase",
  "visible": true,
  "entries": [ ... ]
}
```

| Field | Type | Notes |
|-------|------|-------|
| `type` | string | See [Section Types](#section-types). |
| `heading` | string | Displayed as section title. Customizable. |
| `icon` | string | Lucide icon name. See [Icons](#icons). |
| `visible` | boolean | `false` hides the section without deleting. |
| `entries` | array | List of entries. Schema depends on `type`. |

---

## Section Types

### `profile`
Free-text bio or summary.

```json
{
  "visible": true,
  "content": "Software developer with 6 years experience..."
}
```

| Field | Type | Notes |
|-------|------|-------|
| `content` | string | Plain text. No markdown. |

---

### `experience` / `volunteering`
Work history or volunteer roles. Both share identical entry structure.

```json
{
  "visible": true,
  "title": "Senior Software Developer",
  "company": "Northwind Labs",
  "startDate": "2023-02",
  "endDate": "",
  "current": true,
  "location": "Lisbon, Portugal",
  "bullets": [
    "Led rewrite of billing service in Go, reducing p99 latency by 83%.",
    "Mentored 3 mid-level engineers."
  ]
}
```

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Job title or role |
| `company` | string | Employer or organization name |
| `startDate` | string | Format `YYYY-MM` |
| `endDate` | string | Format `YYYY-MM`. Empty string if current. |
| `current` | boolean | `true` renders "Present" instead of endDate |
| `location` | string | City, Country or "Remote" |
| `bullets` | string[] | Achievement bullets. Each string is one bullet. |

---

### `education`

```json
{
  "visible": true,
  "degree": "B.Sc. in Computer Science",
  "school": "University of Coimbra",
  "startDate": "2014-09",
  "endDate": "2018-06",
  "location": "Coimbra, Portugal",
  "bullets": [
    "Graduated with distinction.",
    "Thesis: Latency-aware scheduling for WebAssembly workloads."
  ]
}
```

| Field | Type | Notes |
|-------|------|-------|
| `degree` | string | Degree name or field of study |
| `school` | string | Institution name |
| `startDate` | string | Format `YYYY-MM` |
| `endDate` | string | Format `YYYY-MM` |
| `location` | string | |
| `bullets` | string[] | Optional honors, thesis, activities |

---

### `skills` / `interests`
Category + comma-separated items. Both share identical entry structure.

```json
{
  "visible": true,
  "category": "Frontend",
  "items": "React, TypeScript, Vite, Tailwind"
}
```

| Field | Type | Notes |
|-------|------|-------|
| `category` | string | Group label e.g. "Languages", "Tools" |
| `items` | string | Comma-separated values |

---

### `languages`

```json
{
  "visible": true,
  "language": "English",
  "level": 5
}
```

| Field | Type | Notes |
|-------|------|-------|
| `language` | string | Language name |
| `level` | number | 1-5. 1=Beginner, 2=Elementary, 3=Intermediate, 4=Advanced, 5=Native |

---

### `certifications` / `awards` / `courses` / `publications`
All four share identical entry structure.

```json
{
  "visible": true,
  "name": "AWS Certified Solutions Architect",
  "issuer": "Amazon Web Services",
  "date": "2024-03"
}
```

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Certificate, award, course, or publication title |
| `issuer` | string | Issuing organization or publisher |
| `date` | string | Format `YYYY-MM` |

---

### `projects`

```json
{
  "visible": true,
  "title": "Resuflow",
  "link": "https://github.com/user/resuflow",
  "startDate": "2024-01",
  "endDate": "",
  "bullets": [
    "Browser-based resume builder with PDF export.",
    "React 18, Vite, Zustand, IndexedDB."
  ]
}
```

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Project name |
| `link` | string | URL to project or repo |
| `startDate` | string | Format `YYYY-MM`. Optional. |
| `endDate` | string | Format `YYYY-MM`. Empty = ongoing. |
| `bullets` | string[] | Description bullets |

---

### `references`

```json
{
  "visible": true,
  "name": "Jane Smith",
  "position": "Engineering Manager at Northwind Labs",
  "contact": "jane.smith@example.com"
}
```

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Full name |
| `position` | string | Title and company |
| `contact` | string | Email or phone |

---

### `custom`
Free-text section for anything else.

```json
{
  "visible": true,
  "content": "Open source contributor. Conference speaker. Hackathon winner."
}
```

| Field | Type | Notes |
|-------|------|-------|
| `content` | string | Plain text |

---

## Icons

Valid `icon` values (Lucide icon names):

| Section type | Default icon |
|---|---|
| profile | `User` |
| experience | `Briefcase` |
| skills | `Brain` |
| education | `GraduationCap` |
| languages | `Globe` |
| certifications | `Award` |
| projects | `FolderKanban` |
| volunteering | `HeartHandshake` |
| awards | `Trophy` |
| courses | `BookOpen` |
| publications | `Newspaper` |
| interests | `Sparkles` |
| references | `Users` |
| custom | `FileText` |

Any valid Lucide icon name is accepted.

---

## Minimal Valid Example

```json
{
  "name": "Jane Doe",
  "template": "classic-clear",
  "personal": {
    "firstName": "Jane",
    "lastName": "Doe",
    "title": "Product Designer",
    "email": "jane@example.com",
    "phone": "+1 555 000 1234",
    "location": "New York, NY"
  },
  "sections": [
    {
      "type": "profile",
      "heading": "Profile",
      "icon": "User",
      "visible": true,
      "entries": [
        { "visible": true, "content": "Product designer focused on developer tooling." }
      ]
    },
    {
      "type": "experience",
      "heading": "Experience",
      "icon": "Briefcase",
      "visible": true,
      "entries": [
        {
          "visible": true,
          "title": "Senior Designer",
          "company": "Acme Corp",
          "startDate": "2022-01",
          "endDate": "",
          "current": true,
          "location": "New York, NY",
          "bullets": ["Led redesign of core product, increasing retention by 22%."]
        }
      ]
    }
  ],
  "customize": {}
}
```

---

## Notes for LLMs

- Generate realistic bullet points using strong action verbs and metrics.
- `startDate` / `endDate` must be `YYYY-MM` or empty string. Never `null`.
- `bullets` must be a non-empty array. Minimum one entry per section.
- `level` for languages is 1-5 integer only.
- `photo` should always be `null` unless base64 image data is explicitly provided.
- `customize` can always be `{}`. Templates apply their own defaults.
- Do not invent new section `type` values. Use only the types listed above.
- Sections render in the order they appear in the `sections` array.
