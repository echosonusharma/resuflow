# ResumeFlow - Project Documentation

## Overview

Browser-based resume builder. Users pick a template, fill in content sections, fine-tune visual settings, and download a PDF. All state lives in the browser (localStorage). No backend.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | React 18 |
| Build | Vite 5 |
| Icons | lucide-react |
| PDF export | html2canvas + jsPDF |
| State | useReducer + Context |
| Persistence | localStorage |
| Styling | Plain CSS (split by feature) |

---

## Architecture

### Layer diagram

```
┌─────────────────────────────────────────────┐
│                  App.jsx                    │  ← view routing only
└──────────┬───────────┬──────────────────────┘
           │           │
    ┌──────▼──────┐  ┌─▼──────────────────────┐
    │  components/│  │      templates/         │
    │  (UI only)  │  │  (pure render, no store)│
    └──────┬──────┘  └─────────────────────────┘
           │
    ┌──────▼──────┐
    │   hooks/    │  ← public API between store and UI
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │   context/  │  ← private store (only hooks import this)
    └─────────────┘
```

### Key rule
`context/ResumeContext.jsx` is **internal**. Nothing outside `hooks/` imports it directly. Components talk to the store only through named hook functions.

---

## Directory structure

```
src/
├── App.jsx                         View router (overview / content / customize)
├── main.jsx                        Entry point
│
├── context/
│   └── ResumeContext.jsx           useReducer store + localStorage sync
│
├── hooks/                          Public API - components use these, not context
│   ├── index.js                    Barrel export
│   ├── usePersonal.js              { personal, updatePersonal }
│   ├── useSections.js              { sections, addSection, updateEntry, ... }
│   ├── useCustomize.js             { customize, updateCustomize }
│   └── useActiveTemplate.js        { templateId, component, meta, customize, setTemplate }
│
├── data/
│   ├── sampleData.js               Initial state (re-exports demoData)
│   └── demoData.json               Aria Voss fictional demo persona
│
├── utils/
│   └── exportPdf.js                exportPdf() - multi-page PDF slicing, footer text/page numbers, getPageFormat()
│
├── templates/                      Self-contained template system
│   ├── index.js                    Registry: getTemplate(), getAllTemplates(), resolveCustomize(), PALETTES
│   ├── shared/
│   │   ├── formatDate.js           formatDate(), formatDateRange() - locale-aware via document.language
│   │   ├── buildStyles.js          buildStyles(customize) → computed style objects
│   │   ├── common.js               readCustomize(), fullNameOf(), visibleSectionsOf()
│   │   ├── SectionBody.jsx         Shared per-type entry renderer (used by newer templates)
│   │   └── ContactItems.jsx        Shared contact icon rows
│   ├── classic-clear.template.jsx  export meta + default component
│   ├── atlantic-blue.template.jsx
│   ├── mercury-flow.template.jsx
│   ├── ivory-professional.template.jsx   Executive serif, centered header (simple)
│   ├── slate-sidebar.template.jsx        Grey sidebar + photo (modern)
│   ├── nordic-minimal.template.jsx       Hairline rules, label column (simple)
│   ├── timeline-pro.template.jsx         Vertical accent timeline (modern)
│   ├── bold-banner.template.jsx          Color banner header, 1/2 columns (creative)
│   ├── compact-ats.template.jsx          Dense, plain, ATS-friendly (simple)
│   └── duo-tone.template.jsx             Serif headings + tinted rail, 1/2 columns (creative)
│
├── components/
│   ├── Header.jsx                  Nav tabs, resume name, download button
│   ├── TemplateSelector.jsx        Overview screen - template grid + category filter
│   │
│   ├── editor/
│   │   ├── EditorPanel.jsx         Left panel shell + Add Content picker
│   │   ├── PersonalInfoCard.jsx    Name, title, contact, photo upload
│   │   ├── SectionCard.jsx         Collapsible section + entry list
│   │   └── entry-forms/
│   │       ├── index.jsx           Barrel + EntryFormRouter default export
│   │       ├── EntryFormRouter.jsx Routes to correct form by section type
│   │       ├── FormGroup.jsx       Shared label+input wrapper
│   │       ├── ProfileForm.jsx
│   │       ├── ExperienceForm.jsx
│   │       ├── SkillsForm.jsx
│   │       ├── EducationForm.jsx
│   │       ├── LanguagesForm.jsx
│   │       ├── CertificationsForm.jsx
│   │       └── CustomForm.jsx
│   │
│   ├── preview/
│   │   └── PreviewPanel.jsx        Live preview + Export PDF
│   │
│   └── customize/
│       ├── CustomizePanel.jsx      Shell: sidebar nav + IntersectionObserver
│       ├── ui/
│       │   ├── Card.jsx
│       │   ├── RangeSlider.jsx
│       │   ├── SelectInput.jsx
│       │   └── Toggle.jsx
│       └── sections/               One file per customize sidebar item
│           ├── DocumentSettings.jsx
│           ├── DesignTemplates.jsx
│           ├── LayoutSettings.jsx
│           ├── FontSizeSettings.jsx
│           ├── SpacingSettings.jsx
│           ├── EntriesSettings.jsx
│           ├── HeadingsSettings.jsx
│           ├── FontSettings.jsx
│           ├── ColorsSettings.jsx
│           ├── HeaderSettings.jsx
│           ├── PhotoSettings.jsx
│           ├── LinksSettings.jsx
│           ├── FooterSettings.jsx
│           └── SectionsSettings.jsx
│
└── styles/
    ├── index.css                   @import barrel only
    ├── base.css                    CSS vars, reset, html/body
    ├── layout.css                  app-root, editor-layout
    ├── header.css
    ├── editor.css
    ├── preview.css
    ├── customize.css
    └── templates/
        ├── classic-clear.css       .cc-* classes
        ├── atlantic-blue.css       .ab-* classes
        └── mercury-flow.css        .mf-* classes
```

---

## State shape

```js
{
  template: 'classic-clear',   // active template ID

  personal: {
    firstName, lastName, title,
    email, phone, location,
    linkedin, website,
    photo,                     // base64 string or null
  },

  sections: [
    {
      id,
      type,                    // 'profile' | 'experience' | 'skills' |
                               // 'education' | 'languages' | 'certifications' | 'custom'
      heading,                 // user-editable label
      icon,                    // lucide icon name string
      visible,                 // shown in preview
      entries: [
        // shape varies by type - see entry shapes below
      ]
    }
  ],

  customize: {}                // user overrides only (sparse)
                               // resolved via resolveCustomize(templateMeta, customize)
}
```

### Entry shapes

| Type | Fields |
|---|---|
| profile | `{ id, visible, content }` |
| experience | `{ id, visible, title, company, startDate, endDate, current, location, bullets[] }` |
| skills | `{ id, visible, category, items }` |
| education | `{ id, visible, degree, school, startDate, endDate, location, bullets[] }` |
| languages | `{ id, visible, language, level }` (level 1–5) |
| certifications | `{ id, visible, name, issuer, date }` |
| custom | `{ id, visible, content }` |

### Customize shape (resolved)

```js
{
  document:  { language, dateFormat, pageFormat },
  layout:    { columns },                          // 'one' | 'two' | 'mix'
  fontSize:  { base, fullName, professionalTitle, sectionHeadings, entryHeader },
  spacing:   { lineHeight, spaceBetweenElements, leftRightMargin },
  colors:    { scheme, paletteIndex, background, accentApplyTo: { name, jobTitle, headings, headingsLine, headerIcons, dots, dates, entrySubtitle, linkIcons } },
  headings:  { uppercase, underline },
  entries:   { bulletStyle },                      // 'dot' | 'dash' | 'arrow' | 'none'
  font:      { family },
  photo:     { size, shape },
  header:    { showName, showTitle, showContact },
  links:     { showLinkedin, showWebsite, hyperlink },
  footer:    { pageNumbers, text, customText },       // rendered into exported PDF pages
}
```

`customize` in state is **sparse** - only user-changed keys. `resolveCustomize(templateMeta, state.customize)` merges template defaults + user overrides to produce the full resolved object. Templates always receive the resolved object.

---

## Template system

### Adding a template

1. Create `src/templates/my-template.template.jsx`
2. Export `meta` (named) and the component (default)
3. Register in `src/templates/index.js`

### Template file contract

```js
export const meta = {
  id: 'my-template',
  name: 'My Template',
  category: 'simple',               // 'simple' | 'modern' | 'creative'
  description: '...',
  fonts: ['FontName'],
  defaultCustomize: {               // template's own style defaults
    colors: { scheme, paletteIndex, accentApplyTo: { ... } },
    headings: { uppercase, underline },
    layout: { columns },
    entries: { bulletStyle },
    spacing: { lineHeight, spaceBetweenElements, leftRightMargin },
    font: { family: 'default' },
    photo: { size, shape },
  },
  supports: {
    columns: ['one'],               // which column layouts work
    photo: true,
    sidebar: false,
  }
};

export default function MyTemplate({ personal, sections, customize }) {
  // customize is always the resolved object - all keys present
  // use inline styles for customize-driven properties
  // use CSS classes (my-*) for fixed structural styles
}
```

### Color palettes

Defined once in `src/templates/index.js` as `PALETTES` array. Imported by templates and the customize panel. `colors.paletteIndex` selects the active palette.

---

## Hooks API

### `usePersonal()`
```js
const { personal, updatePersonal } = usePersonal();
updatePersonal({ firstName: 'Jane' });  // partial update
```

### `useSections()`
```js
const {
  sections,
  addSection(type),
  removeSection(id),
  updateSectionHeading(id, heading),
  toggleSectionVisible(id),
  reorderSections(fromIndex, toIndex),
  addEntry(sectionId, entryType),
  updateEntry(sectionId, entryId, data),
  removeEntry(sectionId, entryId),
  toggleEntryVisible(sectionId, entryId),
} = useSections();
```

### `useCustomize()`
```js
const { customize, updateCustomize } = useCustomize();
// customize is already resolved (template defaults + user overrides)
updateCustomize('fontSize', { base: 11 });  // writes to user overrides only
```

### `useActiveTemplate()`
```js
const {
  templateId,    // 'classic-clear'
  component,     // React component
  meta,          // template metadata
  customize,     // resolved customize
  setTemplate,   // (id) => void
} = useActiveTemplate();
```

---

## Reducer actions

| Action | Payload |
|---|---|
| `LOAD_STATE` | full state object |
| `UPDATE_PERSONAL` | partial personal object |
| `SET_TEMPLATE` | template id string |
| `ADD_SECTION` | section type string |
| `REMOVE_SECTION` | section id |
| `UPDATE_SECTION_HEADING` | `{ id, heading }` |
| `TOGGLE_SECTION_VISIBLE` | section id |
| `REORDER_SECTIONS` | `{ fromIndex, toIndex }` |
| `ADD_ENTRY` | `{ sectionId, entryType }` |
| `UPDATE_ENTRY` | `{ sectionId, entryId, data }` |
| `REMOVE_ENTRY` | `{ sectionId, entryId }` |
| `TOGGLE_ENTRY_VISIBLE` | `{ sectionId, entryId }` |
| `REORDER_ENTRIES` | `{ sectionId, fromIndex, toIndex }` |
| `UPDATE_CUSTOMIZE` | `{ section, data }` |
| `RESET_CUSTOMIZE` | - (clears all user overrides) |
| `UNDO` / `REDO` | - (history kept in provider, cap 50 states) |

---

## Views

| View | Component | Trigger |
|---|---|---|
| `overview` | `TemplateSelector` | Overview tab or "Browse templates" |
| `content` | `EditorPanel` + `PreviewPanel` | Content tab |
| `customize` | `CustomizePanel` + `PreviewPanel` | Customize tab |

`PreviewPanel` is always visible in `content` and `customize` views (right half of split layout).

---

## PDF export

`src/utils/exportPdf.js` - shared by the Header Download button and PreviewPanel Export PDF button. `html2canvas` captures `#resume-preview-content` at 2× scale, the canvas is sliced into page-height chunks, and each slice becomes a PDF page (`jsPDF`). Handles:

- **Multi-page**: content taller than one page is split across pages
- **Page format**: A4 / Letter / A5 from `customize.document.pageFormat` (also resizes the preview sheet)
- **Footer**: `customize.footer` - page numbers (bottom-right) and footer text (name / email / custom, bottom-center) drawn on every page

---

## Dev

```bash
npm run dev      # localhost:3000
npm run build    # production build to dist/
npm run preview  # preview production build
```
