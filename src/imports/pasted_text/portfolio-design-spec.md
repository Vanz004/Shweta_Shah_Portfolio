Design a modern academic portfolio website inspired by minimal developer portfolios, with both LIGHT and DARK mode, a fixed sidebar, vertical scroll layout, and a fully editable admin dashboard.

Focus on layout precision, typography hierarchy, spacing system, responsiveness, and component-based design.

---

🌗 THEME SYSTEM (LIGHT + DARK MODE)

Create two themes with identical layout:

DARK MODE (default):

* Background: #0B0B0C
* Primary text: #E5E7EB
* Secondary text: #9CA3AF
* Divider: #1F2937
* Accent: #8B5CF6

LIGHT MODE:

* Background: #FFFFFF
* Primary text: #0F172A
* Secondary text: #6B7280
* Divider: #E5E7EB
* Accent: #8B5CF6

Theme toggle:

* Top-right toggle switch
* Smooth transition (300ms ease)
* Persist state (remember user preference)

---

🧱 OVERALL LAYOUT

Use a two-column layout:

LEFT SIDEBAR:

* Fixed
* Width: 240–260px
* Height: 100vh
* Padding: 24px
* Does not scroll

RIGHT CONTENT:

* Scrollable vertically
* Max width: 1100px
* Center aligned
* Padding:

  * Desktop: 64px
  * Tablet: 32px
  * Mobile: 20px

---

📌 SIDEBAR STRUCTURE

TOP:

* Profile image (72px circle)
* Name (medium weight)
* Role (small, muted)

MIDDLE (NAVIGATION):

* Vertical list
* Item height: 40–48px
* Spacing: 8px

Menu items:
HOME
ABOUT
TIMELINE
RESEARCH
PUBLICATIONS
PROJECTS
STUDENTS
AWARDS
PATENTS
TALKS
CONTACT
DOWNLOAD CV

BOTTOM:

* Social icons (LinkedIn, GitHub, Mail)

---

📌 SIDEBAR INTERACTIONS

Hover:

* Subtle underline or opacity change
* Transition: 200ms ease

Active:

* Highlight current section
* Accent color text OR side indicator

---

📜 SCROLL BEHAVIOR

* Smooth scrolling (scroll-behavior: smooth)
* Sidebar navigation scrolls to section anchors
* Active section updates in sidebar (scroll spy behavior)

---

🧩 MAIN CONTENT FLOW

Sections stacked vertically with LARGE spacing:

* Section gap: 96–120px
* Internal spacing: 24–32px

---

🧠 HERO SECTION

Layout:

* Left aligned text
* Large whitespace

Content:

* Name (48–64px, bold)
* Title (18–20px)
* Tags (small text)
* Optional short line

Animation:

* Fade-in + slight upward motion (duration 500ms)

---

🧠 ABOUT SECTION

Layout:

* Right-aligned content block OR centered narrow width (700px max)

Elements:

* Section title
* Divider line
* Paragraph text

---

🧠 TIMELINE SECTION (CORE)

Layout:

* Vertical timeline (left aligned)

Design:

* Line: 2px thin divider color
* Nodes: small circles (10px)

Each item:

* Year (small text)
* Title (medium bold)
* Description (short)

Spacing:

* 40px between items

Animation:

* Each item fades in as user scrolls

---

🧠 PUBLICATIONS SECTION

Layout:

* Clean vertical list

Each item:

* Index number
* Title
* Metadata (journal, year)

Interaction:

* Hover highlight
* Optional expand for details

---

🧠 PROJECTS SECTION

Layout:

* Alternating rows:

Row 1:
[ IMAGE LEFT ] [ TEXT RIGHT ]

Row 2:
[ TEXT LEFT ] [ IMAGE RIGHT ]

Image:

* Uploadable (from dashboard)
* Rounded corners (12px)

---

🧠 OTHER SECTIONS

Students / Awards / Patents / Talks:

* Clean structured lists
* Minimal UI
* Divider-based separation

---

🎯 MICROINTERACTIONS

* Hover on links → underline animation
* Cards/images → slight scale (1.02)
* Timeline nodes → scale on hover
* Theme toggle → smooth color transition

---

📏 SPACING SYSTEM

Use 8px grid:

* 8 / 16 / 24 / 32 / 48 / 64 / 96

Maintain consistent spacing everywhere.

---

📱 RESPONSIVENESS

Desktop:

* Sidebar fixed

Tablet:

* Sidebar collapses (icons only)

Mobile:

* Sidebar becomes hamburger menu
* Full-width sections
* Timeline becomes single column

---

⚙️ ADMIN DASHBOARD (/dashboard)

Create a separate dashboard with SAME design system.

---

🔐 LOGIN PAGE

* Centered login card
* Fields:
  Username: user
  Password: 12345
* Button: Login

---

📊 DASHBOARD LAYOUT

* Sidebar (same as website)
* Main panel = editable content

---

🧩 EDITABLE MODULES

Each section is editable:

PROFILE:

* Name, image upload, role

ABOUT:

* Editable text

TIMELINE:

* Add / edit / delete entries

PUBLICATIONS:

* Add title, year, link

PROJECTS:

* Upload image (from system)
* Title, description

STUDENTS / AWARDS / etc:

* Add / edit / delete entries

---

📂 IMAGE HANDLING

* Upload images from local system (file explorer)
* Preview before saving
* Replace/delete images

---

💾 AUTO SAVE SYSTEM

* Changes auto-save on edit (no manual save needed)
* Show "Saved" indicator
* Optional undo support

---

🎛️ ADVANCED FEATURES

* Toggle visibility of sections
* Reorder sections (drag & drop)
* Live preview mode

---

🧱 COMPONENT SYSTEM

Create reusable components:

* Sidebar item
* Timeline item
* Section block
* List item
* Image block
* Button
* Toggle switch

Use auto layout for all components.

---

🎯 FINAL GOAL

Create a clean, minimal, highly structured academic portfolio with:

* Light/dark mode
* Timeline storytelling
* Smooth scrolling navigation
* Fully editable backend dashboard
* Scalable and reusable design system
