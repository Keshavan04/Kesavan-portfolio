# Kesavan — Portfolio

A single-page portfolio built to match the design language and motion system of
[ilijakorodic.com](https://ilijakorodic.com): same palette, typography, layout
grid, easing curves and interaction set, written from scratch as original code.

Content is sourced from `KesavanH_2026Resume.pdf`. Everything you need to change lives in one file.

---

## Run it

```bash
npm install
```

Copy `.env.example` to `.env` and set your admin name, password, and a long
random `ADMIN_SECRET`. Then:

```bash
npm run dev
```

That starts the API (port 3001) and Vite (<http://localhost:5173>) together.
The admin panel is at <http://localhost:5173/admin>.

### Production

```bash
npm run build
```

```bash
npm start
```

`npm start` serves `dist/` **and** the API from one Node process on `API_PORT`.
Deploy to any Node host (Render, Railway, Fly, a VPS). Persist `server/data/`
and `server/uploads/` between deploys — that's where projects and images live.
A static-only host (Netlify, GitHub Pages) will show the site but the admin
panel won't work there, and the Work section will fall back to `content.js`.

---

## Admin panel — `/admin`

Sign in with the name/password from `.env`. From there you can add, edit,
reorder, and delete projects; they appear in the Work carousel immediately with
the same animation.

Per project: title, live URL, source URL, description, comma-separated tech,
and an image. The image can be uploaded, pasted as a URL, or left blank — in
which case the server captures a screenshot of the live URL when you save
(via microlink.io, free tier, captured once and stored locally in
`server/uploads/`).

Storage is `server/data/projects.json`. On first run it's seeded from
`content.js`; after that the JSON file is the source of truth for projects.

Security notes: login is rate-limited (5 failures → 1 min lockout), sessions
are HMAC-signed tokens that expire after 12 h, and every write requires one.
Run it behind HTTPS in production.

## Changing the content

Open **`src/data/content.js`** for everything *except* projects — name, role,
bio, socials, contact details. (Projects live in the admin panel once the API
has run once.)

| Key | What it drives |
| --- | --- |
| `person` | Name, role, email, availability, hero paragraph |
| `socials` | Social links (also used in the mobile menu, contact card, footer) |
| `marqueeItems` | Scrolling tech strip under the hero |
| `about` | About paragraphs + portrait |
| `heroPortrait` | Hero image |
| `projects` | Seed data for the carousel on first run — manage via `/admin` afterwards |
| `contact` | Contact headline, form note, optional form endpoint |
| `footer` | Footer headline and blurb |
| `navLinks` / `footerNavLinks` | Navigation labels |

Two inline markers work inside `about.paragraphs`:

- `**text**` renders brighter white
- `==text==` renders in the accent blue

### Images

Drop real files into `public/` and point `content.js` at them:

- `public/kesavan.png` → the transparent cutout used in the hero (bottom-right bleed) and About (3:4 crop, position set by `about.portraitPosition`)
- `public/projects/01.svg`, `02.svg` → placeholder thumbnails for the two seeded projects — replace them from `/admin` (Edit → Upload image)
- `public/logo.svg` → favicon

`.jpg` / `.png` / `.webp` all work — just update the paths.

### Contact form

By default the form validates and shows the success state without sending
anything. To receive real submissions, paste a [Formspree](https://formspree.io)
or [Getform](https://getform.io) endpoint into `contact.endpoint`.

---

## Design tokens

Defined in `tailwind.config.js`:

| Token | Value | Role |
| --- | --- | --- |
| `accent` | `#6cbafa` | Highlights, links, glows |
| `dark` | `#020815` | Page base |
| `txt` | `#f4f6fc` | Body text |
| `primary` | `#050a30` | Deep navy band between sections |
| `secondary` | `#ffffff` | Gradient terminator |

Typeface is **Montserrat** (100–900), loaded from Google Fonts in `index.html`.

---

## Motion system

Hand-rolled — no GSAP, Lenis, or Framer Motion, matching the reference build.

| Effect | Where | How |
| --- | --- | --- |
| Logo draw + curtain | `Preloader.jsx` | Staggered SVG keyframes, curtain slides up |
| Canvas cursor | `CustomCursor.jsx` | Exact dot + lagging ring, grows on interactives |
| Particle field | `ParticleCanvas.jsx` | 160 nodes, proximity lines, pointer repulsion |
| Per-letter nav roll | `ui/RollText.jsx` | 30 ms stagger, `cubic-bezier(.76,0,.24,1)` |
| Sliding nav pill | `Header.jsx` | Measured from the active link's box |
| Clip-path reveals | `ui/Reveal.jsx` + `useReveal` | `cubic-bezier(.16,1,.3,1)`, IntersectionObserver |
| Portrait tilt + parallax | `ui/TiltCard.jsx`, `useParallax` | ±3° pointer tilt, scroll-linked drift |
| RGB glitch | `ui/GlitchText.jsx` | 10% chance per 100 ms, banded channel offsets |
| **3D carousel** | `Projects.jsx` | See below |
| Button sweep / circle fill | `ui/CtaButton.jsx` | Skewed gradient sweep; 1.6 s expanding circle |

### The carousel

Cards sit on a vertical cylinder (radius 700 px desktop / 400 px mobile) inside a
pinned section that grows 25 vh per card (nine cards = 300 vh, like the
reference). Cards are 40° apart; scroll maps to `(n−1) × 40°` of ring rotation.

Only the arc on the **far** side is rendered — each card carries a trailing
`rotateY(180deg)` so it faces the camera from back there. That keeps visible
cards at a natural depth instead of exploding through the near plane. Cards fade
in from 120° of angular distance and reach full opacity at 180°, so three are on
screen at once.

Clicking a card pushes it to the Z depth where it renders exactly `detailW` wide,
fades the ring out, and slides the detail text up underneath. Arrow keys step
between projects; `Esc` closes.

Adding or removing entries in `projects` re-derives the whole geometry — nothing
else to change.

---

## Accessibility

- Every project also exists as crawlable/screen-reader text (the 3D stage is not readable).
- Carousel cards are focusable buttons; the overlay is keyboard-driven.
- The URL hash tracks the section in view.
- `prefers-reduced-motion` collapses every animation and transition.

---

## Stack

React 18 · Vite 5 · Tailwind CSS 3 · react-router · react-scroll · Express 4
