/**
 * Tiny API + static host for the portfolio.
 *
 *   npm run dev    -> API on API_PORT, Vite proxies /api and /uploads to it
 *   npm start      -> serves dist/ AND the API on one port (after `npm run build`)
 *
 * Storage is a JSON file (server/data/projects.json) — no database needed.
 * Auth is a username/password from .env exchanged for a signed bearer token.
 */
import 'dotenv/config'
import express from 'express'
import multer from 'multer'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DATA_FILE = path.join(__dirname, 'data', 'projects.json')
const UPLOAD_DIR = path.join(__dirname, 'uploads')
const DIST_DIR = path.join(ROOT, 'dist')

const PORT = Number(process.env.PORT) || Number(process.env.API_PORT) || 3001
const SERVE_SITE = process.argv.includes('--serve')
const ADMIN_USER = process.env.ADMIN_USER || ''
const ADMIN_PASS = process.env.ADMIN_PASS || ''
const SECRET = process.env.ADMIN_SECRET || crypto.randomBytes(32).toString('hex')
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000

if (!ADMIN_USER || !ADMIN_PASS) {
  console.warn('\n[admin] ADMIN_USER / ADMIN_PASS are not set in .env — the admin page cannot log in.\n')
}
if (!process.env.ADMIN_SECRET) {
  console.warn('[admin] ADMIN_SECRET not set — using a random one; logins reset on restart.')
}

/* ------------------------------ storage ------------------------------ */
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

async function readProjects() {
  if (!fs.existsSync(DATA_FILE)) {
    // First run: seed from the static content file so nothing disappears.
    const mod = await import(pathToFileURL(path.join(ROOT, 'src', 'data', 'content.js')).href)
    writeProjects(mod.projects)
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
}
function writeProjects(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2))
}

/* -------------------------------- auth -------------------------------- */
const b64u = (buf) => Buffer.from(buf).toString('base64url')
const sign = (s) => crypto.createHmac('sha256', SECRET).update(s).digest('base64url')

function issueToken(user) {
  const payload = b64u(JSON.stringify({ u: user, exp: Date.now() + TOKEN_TTL_MS }))
  return `${payload}.${sign(payload)}`
}
function verifyToken(token) {
  if (!token || !token.includes('.')) return false
  const [payload, sig] = token.split('.')
  const good = sign(payload)
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return false
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return Date.now() < exp
  } catch {
    return false
  }
}
function safeEqual(a, b) {
  const x = Buffer.from(String(a))
  const y = Buffer.from(String(b))
  return x.length === y.length && crypto.timingSafeEqual(x, y)
}
function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!verifyToken(token)) return res.status(401).json({ error: 'Not signed in' })
  next()
}

// crude brute-force brake: 5 failures -> 1 minute lockout per IP
const failures = new Map()
function throttled(ip) {
  const f = failures.get(ip)
  return f && f.count >= 5 && Date.now() - f.at < 60_000
}
function noteFailure(ip) {
  const f = failures.get(ip) || { count: 0, at: 0 }
  failures.set(ip, { count: f.count + 1, at: Date.now() })
}

/* ----------------------------- validation ----------------------------- */
const str = (v, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const isUrlish = (v) => v === '' || v === '#' || /^(https?:\/\/|\/)/i.test(v)

function cleanProject(p) {
  const title = str(p.title, 120)
  if (!title) throw new Error('Every project needs a title')
  const live = str(p.live, 500) || '#'
  const code = str(p.code, 500) || '#'
  const src = str(p.src, 1000)
  if (!isUrlish(live) || !isUrlish(code) || !isUrlish(src)) throw new Error(`Bad URL on "${title}"`)
  const tech = Array.isArray(p.tech)
    ? p.tech.map((t) => str(t, 40)).filter(Boolean).slice(0, 15)
    : str(p.tech, 400).split(',').map((t) => t.trim()).filter(Boolean).slice(0, 15)
  return { title, description: str(p.description, 1200), tech, live, code, src, alt: str(p.alt, 200) || title }
}

/**
 * No image but a live URL? Capture a screenshot once and keep it in uploads/,
 * so visitors never hit the screenshot API (free tier is ~50 calls/day).
 */
async function captureScreenshot(url) {
  const api = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`
  const res = await fetch(api, { signal: AbortSignal.timeout(45_000) })
  if (!res.ok || !/^image\//.test(res.headers.get('content-type') || '')) {
    throw new Error(`Could not screenshot ${url} (${res.status}) — upload an image instead`)
  }
  const name = `shot-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.png`
  fs.writeFileSync(path.join(UPLOAD_DIR, name), Buffer.from(await res.arrayBuffer()))
  return `/uploads/${name}`
}

/* -------------------------------- app --------------------------------- */
const app = express()
app.use(express.json({ limit: '1mb' }))

app.post('/api/login', (req, res) => {
  const ip = req.ip
  if (throttled(ip)) return res.status(429).json({ error: 'Too many attempts — wait a minute' })
  const { username = '', password = '' } = req.body || {}
  if (ADMIN_USER && ADMIN_PASS && safeEqual(username, ADMIN_USER) && safeEqual(password, ADMIN_PASS)) {
    failures.delete(ip)
    return res.json({ token: issueToken(username) })
  }
  noteFailure(ip)
  res.status(401).json({ error: 'Wrong name or password' })
})

app.get('/api/session', (req, res) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  res.json({ ok: verifyToken(token) })
})

app.get('/api/projects', async (_req, res) => {
  res.json(await readProjects())
})

// Replace the whole list — simplest way to support add / edit / delete / reorder.
app.put('/api/projects', requireAuth, async (req, res) => {
  try {
    const list = Array.isArray(req.body) ? req.body : null
    if (!list) return res.status(400).json({ error: 'Expected an array' })
    if (list.length > 50) return res.status(400).json({ error: 'Max 50 projects' })
    const cleaned = list.map(cleanProject)
    for (const p of cleaned) {
      if (!p.src && p.live !== '#') p.src = await captureScreenshot(p.live)
    }
    writeProjects(cleaned)
    res.json(cleaned)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => {
      const ext = (path.extname(file.originalname) || '.png').toLowerCase()
      cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`)
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, /^image\/(png|jpe?g|webp|gif|svg\+xml)$/.test(file.mimetype)),
})
app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Upload an image file (png, jpg, webp, gif, svg)' })
  res.json({ src: `/uploads/${req.file.filename}` })
})

app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }))

if (SERVE_SITE) {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('dist/ not found — run `npm run build` first.')
    process.exit(1)
  }
  app.use(express.static(DIST_DIR, { maxAge: '1h' }))
  // SPA fallback so /admin deep-links work
  app.get('*', (_req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')))
}

app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}${SERVE_SITE ? ' (serving dist/)' : ''}`)
})
