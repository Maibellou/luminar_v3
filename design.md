# Project: Luminar - Landing Page
## Stack: Tailwind CSS, GSAP (or Framer Motion for interactions)

### 1. Visual Identity (Dark Mode)
- **Base Background:** `#161616` (Soft Black)
- **Cards/Containers:** `#333333` (Dark Gray for depth)
- **Main Accent:** `#F6BE25` (Ocher) - *Minimalist use: 1px lines or subtle hovers*
- **Secondary/Subtitles:** `#FADC89`
- **Main Text/Borders:** `#FEF9EC`
- **Elevation Borders:** 1px solid `#FEF9EC` at 10% opacity
- **Glow:** Diffused Outer Glow using `#333333`

### 2. Typography & Iconography
- **Headings (H1, H2, H3):** 'Cinzel' (Serif)
- **Body & UI:** 'Jost' (Sans-serif)
- **Restriction:** Default letter-spacing (0) on all elements (strictly no added kerning)
- **Iconography:** Phosphor Icons (Thin/Light weights)

### 3. Navigation & Mobile Aesthetics
- **Desktop Nav:** About Us | Services | Projects | Contact
- **Mobile Menu Icon:** Two horizontal lines (top line short, bottom line long)
- **Mobile Menu Overlay:** Full-screen overlay when opened
- **Logo:** Asset `logo-luminar.png` (Located in `/public/assets/`)

### 4. Section Structure (Sitemap)

| Section | Content / Copy | Visual / Layout |
| :--- | :--- | :--- |
| **01. Hero** | Value Prop: "Glass curtains to solve spaces" | Dark full-width image with centered Cinzel typography |
| **02. Services A** | Glass Curtains (Fixed Panels). Focus: Insulation and transparency | Asymmetrical layout (Portrait image vs Text block) |
| **03. Services B** | **Sticky Section:** 3 completely distinct services (Folding Systems, Glass Partitions, and Pool Enclosures). Each of the 3 services must have its own unique image and a short paragraph below it. | 100vh Pinned. Cross-fade content in-place on scroll |
| **04. About Us** | Professional tone: Technical definition, assembly, and execution | Extremely generous spacing. |
| **05. Projects** | Selection of completed works on balconies and terraces | Asymmetrical Bento Box grid (Corners: 4px border-radius) |
| **06. Contact** | Simple form + WhatsApp Button (Not floating) | Button in white or brand colors (GREEN IS STRICTLY FORBIDDEN) |

### 5. Interaction Rules (UX)
- **8px Base Grid:** All spacing, margins, paddings, and gaps must strictly use multiples of 8px (Tailwind scale: 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, etc.).
- **Reveals:** Slide-up + Fade-in (smooth and slow ease-in-out) upon entering the viewport.
- **Scroll Pinning:** The "Services B" section must block vertical scrolling until the user has seen all 3 sub-services transitioning via cross-fade.
- **Spacing:** "Generous" Padding/Margin to convey breathing room. Minimum section vertical padding: 80px (py-20) to 128px (py-32).