/**
 * ============================================================================
 *  ALL EDITABLE CONTENT LIVES HERE.
 *  Sourced from KesavanH_2026Resume.pdf. Swap anything below and the whole
 *  site updates — no component file needs to change.
 * ============================================================================
 */

export const person = {
  firstName: 'Kesavan',
  lastName: 'Haridoss', // resume reads "Kesavan H"; surname taken from the GitHub handle
  initials: 'K',
  role: 'Python & Backend Developer',
  email: 'hkesavan2004@gmail.com',
  phone: '+91 93612 45055',
  location: 'Ambattur, Chennai, India',
  responseTime: '~ 24h',
  available: true,
  // Hero paragraph. `strong` segments render brighter than the rest.
  tagline: [
    { text: 'I design scalable backend systems and REST APIs with ' },
    { text: 'Django and FastAPI', strong: true },
    { text: ' — and ship the front-end to match. Clean, reusable code with ' },
    { text: 'end-to-end ownership.', strong: true },
  ],
  // Shown to search engines / screen readers only.
  seoSummary:
    'Kesavan Haridoss is a Python developer in Chennai specialising in Django, FastAPI and REST API design, with production-style full-stack projects covering ML-driven case classification, async diagnostic pipelines and React dashboards. Open to backend and full-stack developer roles.',
}

export const socials = [
  { label: 'GitHub', href: 'https://github.com/Keshavan04', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kesavan-haridoss-9b6067255', icon: 'linkedin' },
]

/** Scrolling tech strip under the hero. */
export const marqueeItems = [
  'PYTHON',
  'DJANGO',
  'FASTAPI',
  'REACT',
  'MYSQL',
  'POSTGRESQL',
  'PYTORCH',
  'GIT',
]

/**
 * About section copy.
 * Inline markers inside paragraphs:
 *   **bold**  -> brighter white, medium weight
 *   ==text==  -> accent colour
 */
export const about = {
  paragraphs: [
    "I'm a Python developer from Chennai with hands-on experience designing scalable backend systems and REST APIs. I like owning a product end to end — from the data model to the dashboard that consumes it.",
    "I've shipped two full-stack, production-style systems solo: a role-based **Django + MySQL** cybercrime management portal with ML-driven case classification, and an async **FastAPI** diagnostic system with a **React** dashboard. Along the way I've worked with Django REST Framework, MySQL/PostgreSQL, PyTorch and LLM APIs.",
    'Currently completing a BE in Computer Science & Engineering at GKM College of Engineering & Technology (Anna University), CGPA 8.2. I interned as a Development Intern at Unlimited Innovations India, turning product requirements into clear technical specs and building the reports that informed team decisions.',
    'Placed 3rd at an inter-college project expo. Certified in IBM Journey to Cloud and The Complete Python Developer Course. ==Clean, reusable code — that is the bias.==',
  ],
  footnote: {
    lead: 'Curious?',
    leadStrong: 'Scroll down.',
    tail: 'Want to work together?',
    tailStrong: 'Contact form is below — or find me on GitHub and LinkedIn.',
  },
  portraitAlt: 'Kesavan Haridoss at his desk',
  portrait: '/kesavan.png',
  // Where the 3:4 crop centres on the landscape photo (face sits ~60% across).
  portraitPosition: '60% 40%',
}

/** Hero portrait (bleeds from the right edge, like the reference). */
export const heroPortrait = {
  src: '/kesavan.png',
  alt: 'Kesavan Haridoss — Python & backend developer',
}

/**
 * Selected work. The 3D carousel sizes itself to this array —
 * add or remove entries freely.
 */
export const projects = [
  {
    src: '/projects/01.svg',
    alt: 'AI-powered histopathology diagnosis system with real-time clinical decision support',
    title: 'AI Histopathology Diagnosis System',
    description:
      'FastAPI REST API with async handling and Celery + Redis task queuing for concurrent diagnostic inference. Multi-model deep-learning pipeline (ResNet18, MobileNetV2) with Grad-CAM explainability, Gemini AI generating structured clinical reports, and a React + Tailwind dashboard for real-time case tracking. Final-year project, 2025–2026.',
    tech: ['Python', 'FastAPI', 'PyTorch', 'React', 'Tailwind', 'Celery', 'Redis', 'Gemini AI', 'OpenCV'],
    live: '#',
    code: 'https://github.com/Kesavanharidoss',
  },
  {
    src: '/projects/02.svg',
    alt: 'Integrated cybercrime management portal with role-based access',
    title: 'Cybercrime Management Portal',
    description:
      'Role-based Django portal (Citizen / Officer / Admin) with a custom user model, MySQL, and DRF REST APIs for complaint submission and case management. TF-IDF + Naive Bayes auto-classifies complaints to speed up triage; SHA-256 evidence integrity checks, ReportLab PDF case summaries, a rule-based FAQ chatbot and Chart.js analytics dashboards. May 2026.',
    tech: ['Python', 'Django', 'MySQL', 'DRF', 'scikit-learn', 'ReportLab', 'Bootstrap 5', 'Chart.js'],
    live: '#',
    code: 'https://github.com/Kesavanharidoss',
  },
]

export const contact = {
  eyebrow: '[04] — Contact',
  headlineTop: 'Looking to hire?',
  headlineBottom: "Let's work",
  headlineAccent: 'together',
  seoSummary:
    'Contact Kesavan Haridoss for backend and full-stack development roles — Django, FastAPI, REST APIs, MySQL/PostgreSQL and React. Based in Chennai, open to full-time roles and remote work.',
  formNote: 'Your info is only used to reply. No spam, ever.',
  submitLabel: 'Send message',
  // Optional: paste a Formspree / Getform endpoint to receive real submissions.
  // Leave empty to run in demo mode (shows the success state without sending).
  endpoint: 'https://formspree.io/f/myezgela',
}

export const footer = {
  headline: 'Have an opportunity?',
  headlineItalic: "Let's talk",
  blurb:
    'Building scalable backend systems and REST APIs with Django and FastAPI, plus the React front-ends that use them. Based in Chennai, open to backend and full-stack roles.',
  builtWith: 'Built with React · Tailwind',
}
export const experiences = [
  {
    role: 'Development Intern',
    company: 'Unlimited Innovations India Pvt. Ltd.',
    period: 'Aug 2025 – Nov 2025',
    location: 'Chennai, TN',
    type: 'Internship',
    bullets: [
      'Translated product and engineering requirements into clear technical specifications, working directly with cross-functional teams to close ambiguity before development began.',
      'Built pivot-table-driven reports and dashboards in Excel/Google Sheets to surface trends in business data, directly informing team decision-making.',
    ],
    tech: ['Technical Specifications', 'Requirements Analysis', 'Business Data Analytics', 'Dashboards & Reporting'],
  },
]

export const skillCategories = [
  {
    category: 'Backend Frameworks',
    skills: ['FastAPI', 'Django', 'REST API', 'API Integration'],
  },
  {
    category: 'Languages',
    skills: ['Python', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    category: 'AI / ML',
    skills: ['PyTorch', 'ResNet18', 'MobileNetV2', 'Grad-CAM', 'LLM API (Gemini)'],
  },
  {
    category: 'Databases',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'],
  },
  {
    category: 'Web & Front-end',
    skills: ['React.js', 'Bootstrap 5', 'Tailwind CSS', 'Chart.js'],
  },
  {
    category: 'Core Concepts & Tools',
    skills: ['OOP', 'JSON', 'Debugging', 'Testing', 'Git', 'GitHub'],
  },
]

export const navLinks = [
  { label: 'About', to: 'Aboutme' },
  { label: 'Skills', to: 'Skills' },
  { label: 'Experience', to: 'Experience' },
  { label: 'Projects', to: 'Projects' },
  { label: 'Contact', to: 'Contact' },
]

export const footerNavLinks = [
  { label: 'Home', to: 'Home' },
  { label: 'About Me', to: 'Aboutme' },
  { label: 'Skills', to: 'Skills' },
  { label: 'Experience', to: 'Experience' },
  { label: 'Projects', to: 'Projects' },
  { label: 'Contact', to: 'Contact' },
]
