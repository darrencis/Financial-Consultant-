# Design System

## 1. Overview

- **Summary:** A clean, modern, and high-contrast user interface designed for financial and dashboard applications. It features a predominantly light aesthetic with crisp white surfaces, anchored by a bold primary indigo/blue brand color.
- **Design principles:**
  - **Clarity over decoration:** Ample whitespace and clear typographic hierarchy prioritize data readability.
  - **Emphasis on primary actions:** High-contrast brand colors draw attention to interactive elements, charts, and primary calls to action.
  - **Soft geometry:** Rounded corners and subtle drop shadows create a friendly, approachable, yet professional feel.
- **Target use case:** Web application dashboard, specifically tailored for fintech, personal finance management, or banking portals.

---

## 2. Color System

### 2.1 Core Palette

The brand palette is driven by a vibrant indigo/blue used for structural elements (sidebar), primary actions, and key data visualizations.

| Token                 | Hex       | Role / Usage                                      |
|-----------------------|-----------|---------------------------------------------------|
| `color-primary-500`   | `#3B32FF` | Primary buttons, sidebar, active tabs, highlights |
| `color-primary-600`   | `#2C25CC` | Primary button hover states (inferred)            |
| `color-secondary-500` | `#8B98B4` | Secondary text, inactive icons, subtle accents    |
| `color-accent-500`    | `#FF4D6D` | Accent charts (e.g., balance line chart)          |

### 2.2 Neutrals & Backgrounds

A cool-toned neutral scale defines the typography and structure of the application.

| Token                 | Hex       | Role / Usage                                  |
|-----------------------|-----------|-----------------------------------------------|
| `color-neutral-900`   | `#1E1B4B` | Main headings, primary body text, deep labels |
| `color-neutral-700`   | `#475569` | Secondary text, table headers, subtitles      |
| `color-neutral-500`   | `#94A3B8` | Placeholder text, inactive tabs, muted icons  |
| `color-neutral-200`   | `#E2E8F0` | Input borders, dividers, subtle lines         |
| `color-background`    | `#F4F7FE` | Main application page background              |
| `color-surface`       | `#FFFFFF` | Cards, panels, dropdowns, form inputs         |

### 2.3 Semantic Colors

Used strictly for status indicators, verification badges, and systemic feedback.

| Token                 | Hex       | Role / Usage                                      |
|-----------------------|-----------|---------------------------------------------------|
| `color-success-500`   | `#10B981` | "Verified" badges, positive indicators            |
| `color-success-100`   | `#D1FAE5` | Success badge backgrounds (inferred)              |
| `color-warning-500`   | `#F59E0B` | Warnings, alerts (inferred)                       |
| `color-error-500`     | `#EF4444` | "Verification pending", error states, deletions   |
| `color-error-100`     | `#FEE2E2` | Error badge backgrounds (inferred)                |

### 2.4 State & Overlay Colors

| Token                     | Hex                   | Role / Usage                          |
|---------------------------|-----------------------|---------------------------------------|
| `color-state-hover`       | `rgba(59, 50, 255, 0.08)` | Hover states for list items/tabs  |
| `color-focus-ring`        | `rgba(59, 50, 255, 0.4)`  | Input and button focus outlines   |
| `color-overlay-backdrop`  | `rgba(15, 23, 42, 0.5)`   | Modal and drawer backdrops        |

---

## 3. Typography

### 3.1 Font Families

- **Primary font:** `font-family-primary` ("Inter", system-ui, sans-serif)
  - Usage: All UI text, headings, body copy, and data tables. Clean, legible sans-serif for numbers and dense information.

### 3.2 Type Scale & Roles

| Token          | HTML Tag | Size (px) | Weight | Line-height | Usage                               |
|----------------|----------|-----------|--------|-------------|-------------------------------------|
| `font-display` | `h1`     | 24        | 700    | 1.2         | Page titles (e.g., "Balance")       |
| `font-h2`      | `h2`     | 18        | 600    | 1.3         | Card titles, section headers        |
| `font-h3`      | `h3`     | 16        | 600    | 1.3         | Subsection headings, emphasized text|
| `font-body`    | `p`      | 14        | 400    | 1.5         | Standard body copy, list items      |
| `font-small`   | `small`  | 12        | 400    | 1.4         | Helper text, chart axes, timestamps |

### 3.3 Text Styles & Usage Rules

- **Headings:** Use `color-neutral-900` for high contrast.
- **Subtitles/Welcome Text:** Standardized as `font-body` using `color-neutral-700` (e.g., "Welcome Ekash Finance Management").
- **Tabs/Navigation:** Treated as `font-body` with medium weight (500). Active state uses `color-primary-500`, inactive uses `color-neutral-500`.
- **Numbers/Currencies:** Often bolded (`weight 600` or `700`) and sized up to `font-h2` or larger (e.g., "$1458.30") to establish data hierarchy.

---

## 4. Spacing, Sizing & Layout

### 4.1 Spacing Scale

Based on an 8px grid system, with 4px half-steps for micro-adjustments.

| Token        | Value (px) | Typical Usage                                |
|--------------|------------|----------------------------------------------|
| `space-4`    | 4          | Tight gaps (icon to text, list item spacing) |
| `space-8`    | 8          | Small gaps (between tags/badges)             |
| `space-12`   | 12         | Internal padding for smaller inputs/buttons  |
| `space-16`   | 16         | Standard padding, gap between stacked items  |
| `space-24`   | 24         | Standard card padding, grid row/col gap      |
| `space-32`   | 32         | Section separation, page edge margins        |
| `space-48`   | 48         | Major layout segment separation              |

### 4.2 Layout & Grid

- **Page Structure:** Fixed left sidebar (approx. 80px width) with a fluid `calc(100vw - 80px)` main content area.
- **Top Bar:** Height of approx. 80px, containing global search, settings, notifications, and profile.
- **Main Content:** Padded with `space-32` on all sides.
- **Grid:** Uses CSS Grid/Flexbox with standard `space-24` gaps between cards. Cards span columns fluidly based on viewport size.

### 4.3 Corner Radii

| Token        | Value (px) | Usage                                     |
|--------------|------------|-------------------------------------------|
| `radius-sm`  | 6          | Checkboxes, small tags, inner components  |
| `radius-md`  | 8          | Buttons, text inputs, search bar          |
| `radius-lg`  | 12         | Standard cards, dropdown menus, modals    |
| `radius-xl`  | 16         | Large featured illustrations/blocks       |
| `radius-full`| 9999       | User avatars, circular icon buttons       |

### 4.4 Shadows & Elevation

| Token         | CSS-like Description                           | Usage                               |
|---------------|------------------------------------------------|-------------------------------------|
| `shadow-none` | `none`                                         | Flat elements, internal list items  |
| `shadow-sm`   | `0 2px 4px rgba(30, 27, 75, 0.02)`             | Buttons, minor interactive elements |
| `shadow-md`   | `0 4px 20px rgba(30, 27, 75, 0.04)`            | All main layout cards, panels       |
| `shadow-lg`   | `0 10px 30px rgba(30, 27, 75, 0.08)`           | Floating menus, dropdowns, modals   |

---

## 5. Components

### 5.1 Buttons

- **Primary Button:**
  - Background: `color-primary-500`
  - Text: `color-surface` (White), `font-body`, `weight 600`
  - Radius: `radius-md`
  - Padding: `space-12` vertical, `space-24` horizontal.
- **Icon Button:**
  - Background: Transparent or `color-surface`
  - Icon color: `color-neutral-500`
  - Shape: Circular (`radius-full`)
- **State Changes:** Hover dims primary background by 10% (`color-primary-600`). Active state scales down slightly (`0.98`).

### 5.2 Form Inputs

- **Search Bar & Text Fields:**
  - Background: `color-surface`
  - Border: 1px solid `color-neutral-200`
  - Radius: `radius-md`
  - Padding: `space-12` (Left padded further if leading icon is present).
  - Search specifically includes an attached primary button on the right edge.
- **Placeholder:** `color-neutral-500`, `font-body`.

### 5.3 Cards & Panels

- **Anatomy:** White background (`color-surface`), `radius-lg`, `shadow-md`.
- **Padding:** Uniform `space-24` internal padding.
- **Headers:** Typically flexbox with `justify-content: space-between` to hold the title (`font-h2`) and optional actions/filters.

### 5.4 Navigation

- **Sidebar:** Collapsed state (icon-only). Background `color-primary-500`. Icons aligned center vertically. Active icon has a slight background highlight or indicator.
- **Top Navigation:** Breadcrumbs or Sub-navigation (e.g., Home > Profile) using `color-neutral-500` text, separated by `>`.
- **In-page Tabs:** (e.g., Account, General, Profile, Security)
  - Displayed inline.
  - Active: `color-primary-500` with a solid underline (2px) extending the width of the text.
  - Inactive: `color-neutral-500`, no underline. Hover triggers `color-neutral-900`.

### 5.5 Lists (Payment Methods, Verifications)

- **Row Anatomy:** Flex container. Left-aligned icon (often with a light background circle), central text stack (title and subtitle), right-aligned status or action chevron.
- **Dividers:** Optional 1px solid `color-neutral-200` border bottom between items, or relies purely on whitespace (`space-16` gap).

### 5.6 Status Indicators (Verifications)

- **Verified:** Green checkmark circle icon + "Verified" text (`color-success-500`).
- **Pending/Error:** Red 'X' circle icon + "Verification pending" text (`color-error-500`).
- Alignment: Inline with vertical centering (`align-items: center`), typically `space-8` gap between icon and text.

---

## 6. Icons & Illustration

- **Icons:** Line-style icons with rounded caps and joins. 
  - Standard size: `20x20px` or `24x24px`.
  - Stroke width: ~`1.5px`.
- **Illustrations:** Vector-based, flat design utilizing brand colors. E.g., The "Social Security Card" graphic uses monochromatic shades of `color-primary-500` mixed with `color-surface` structural lines.
- **Avatar:** Circular masking (`radius-full`), typically sized `48x48px` or `56x56px`.

---

## 7. Interaction & Motion

- **Hover States:** All clickable elements (buttons, list items, tabs) must have a visual hover state. 
  - Subdued elements transition background to `color-state-hover`.
- **Transitions:** Standardized across the application.
  - Property: `all` or specific target (`background-color`, `border-color`, `box-shadow`).
  - Duration: `200ms`.
  - Easing: `ease-in-out`.
- **Focus Rings:** Ensure accessibility. Keyboard focus applies `color-focus-ring` with a 2px offset.

---

## 8. Accessibility & Usability Considerations

- **Contrast:** Ensure all `color-neutral-500` text on `color-background` or `color-surface` meets WCAG AA (4.5:1) minimum contrast. If it fails, darken to `color-neutral-700`.
- **Tap Targets:** Mobile/tablet views must ensure minimum `40x40px` tap targets for all icon buttons, checkboxes, and list actions.
- **Visual Cues:** Do not rely on color alone to convey state. The "Verified/Pending" states successfully use both color (Green/Red) and distinct icons (Check/Cross).

---

## 9. Implementation Notes & Tokens

The following CSS custom properties (variables) should be added to the global stylesheet or token configuration to bootstrap the design system.

```css
:root {
  /* Colors - Primary */
  --color-primary-500: #3B32FF;
  --color-primary-600: #2C25CC;
  
  /* Colors - Neutrals & Surfaces */
  --color-neutral-900: #1E1B4B;
  --color-neutral-700: #475569;
  --color-neutral-500: #94A3B8;
  --color-neutral-200: #E2E8F0;
  --color-background: #F4F7FE;
  --color-surface: #FFFFFF;

  /* Colors - Semantic */
  --color-success-500: #10B981;
  --color-error-500: #EF4444;

  /* Typography */
  --font-family-primary: "Inter", system-ui, -apple-system, sans-serif;
  --font-display: 24px;
  --font-h2: 18px;
  --font-body: 14px;
  --font-small: 12px;

  /* Spacing */
  --space-4: 4px;
  --space-8: 8px;
  --space-12: 12px;
  --space-16: 16px;
  --space-24: 24px;
  --space-32: 32px;

  /* Radii & Shadows */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  
  --shadow-sm: 0 2px 4px rgba(30, 27, 75, 0.02);
  --shadow-md: 0 4px 20px rgba(30, 27, 75, 0.04);
}