import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CustomCursor from '../components/CustomCursor'
import Logo from '../components/ui/Logo'
import { api, getToken, setToken } from '../lib/api'

const EMPTY = { title: '', live: '', code: '', description: '', tech: '', src: '', alt: '' }

const label = 'text-[10px] font-mono uppercase tracking-[0.25em] text-txt/50 block'
const card =
  'relative overflow-hidden rounded-2xl border border-accent/15 bg-gradient-to-br from-dark/80 to-dark/40 backdrop-blur-sm'
const primaryBtn =
  'inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-dark font-medium text-sm tracking-wide hover:shadow-[0_0_30px_rgba(108,186,250,0.4)] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed'
const ghostBtn =
  'inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-txt/15 text-txt/70 text-sm hover:border-accent/60 hover:text-accent transition-all duration-300 disabled:opacity-40'
const iconBtn =
  'w-8 h-8 rounded-full border border-txt/10 flex items-center justify-center text-txt/50 hover:text-accent hover:border-accent/50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed'

/* ------------------------------ field ------------------------------ */
function Field({ id, label: text, textarea, hint, ...rest }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={label}>
        {text}
      </label>
      <div className="relative">
        <Tag
          id={id}
          className={`peer w-full px-0 py-2.5 bg-transparent text-txt ${
            textarea ? 'text-sm resize-none leading-relaxed' : 'text-base'
          } placeholder-txt/20 outline-none`}
          {...rest}
        />
        <span className="absolute bottom-0 left-0 h-px w-full transition-opacity duration-300 peer-focus:opacity-0 bg-txt/15" />
        <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 ease-out bg-accent" />
      </div>
      {hint && <p className="text-[11px] font-mono text-txt/30">{hint}</p>}
    </div>
  )
}

/* ------------------------------ shell ------------------------------ */
function Shell({ children, right }) {
  return (
    <div
      className="min-h-screen text-txt"
      style={{
        background: 'radial-gradient(at 65% 0%, rgba(108,186,250,0.09) 0%, #050a30 35%, #020815 65%, #000 100%)',
      }}
    >
      <CustomCursor />
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(#6cbafa 1px, transparent 1px), linear-gradient(90deg, #6cbafa 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <header className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full border border-accent/20 bg-dark/80 flex items-center justify-center">
            <Logo size={26} className="group-hover:scale-110 transition-transform duration-500" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent/60">← Back to site</span>
        </Link>
        {right}
      </header>
      <main className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-12 pb-24">{children}</main>
    </div>
  )
}

/* ------------------------------ login ------------------------------ */
function Login({ onDone }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { token } = await api.login(username, password)
      setToken(token)
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Shell>
      <div className="min-h-[70vh] flex items-center justify-center">
        <form onSubmit={submit} className={`${card} w-full max-w-md p-8 md:p-10 space-y-7`}>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/[0.08] rounded-full blur-3xl pointer-events-none" />
          <div className="relative space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent/60">◆ Admin</p>
            <h1 className="text-2xl md:text-3xl font-bold">
              Sign{' '}
              <span className="italic font-light text-accent/80" style={{ fontFamily: "'Times New Roman', serif" }}>
                in
              </span>
            </h1>
          </div>
          <Field id="u" label="Name" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus />
          <Field id="p" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          {error && <p className="text-xs font-mono text-red-400/80">{error}</p>}
          <button type="submit" disabled={busy || !username || !password} className={primaryBtn} data-dark-cursor>
            {busy ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </Shell>
  )
}

/* ---------------------------- editor form ---------------------------- */
function ProjectForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial)
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState('')
  const fileRef = useRef(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const pick = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadErr('')
    try {
      const { src } = await api.upload(file)
      setForm((f) => ({ ...f, src }))
    } catch (err) {
      setUploadErr(err.message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const preview = form.src
  const willAutoShot = !form.src && /^https?:\/\//i.test(form.live || '')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave(form)
      }}
      className={`${card} p-7 md:p-10 space-y-7`}
    >
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-accent/[0.08] rounded-full blur-3xl pointer-events-none" />
      <div className="relative grid md:grid-cols-2 gap-x-10 gap-y-7">
        <div className="space-y-7">
          <Field id="title" label="Project title *" value={form.title} onChange={set('title')} placeholder="Cybercrime Management Portal" required />
          <Field id="live" label="Live URL" value={form.live} onChange={set('live')} placeholder="https://…" hint="Leave the image blank and a screenshot of this URL is captured on save." />
          <Field id="code" label="Source code URL" value={form.code} onChange={set('code')} placeholder="https://github.com/…" />
          <Field id="tech" label="Tech stack" value={form.tech} onChange={set('tech')} placeholder="Python, Django, MySQL" hint="Comma-separated." />
        </div>
        <div className="space-y-7">
          <Field id="desc" label="Description" textarea rows={6} value={form.description} onChange={set('description')} placeholder="What it does, what you built, what it's made of." />
          <Field id="src" label="Image URL" value={form.src} onChange={set('src')} placeholder="https://… or /uploads/…" />
          <div className="flex flex-wrap items-center gap-3">
            <label className={`${ghostBtn} cursor-pointer`}>
              {uploading ? 'Uploading…' : 'Upload image'}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pick} disabled={uploading} />
            </label>
            {form.src && (
              <button type="button" className={ghostBtn} onClick={() => setForm((f) => ({ ...f, src: '' }))}>
                Clear image
              </button>
            )}
            {uploadErr && <span className="text-xs font-mono text-red-400/80">{uploadErr}</span>}
          </div>
          {preview && (
            <div className="rounded-xl overflow-hidden border border-white/[0.06] bg-black/30">
              <img src={preview} alt="" className="w-full aspect-video object-cover" />
            </div>
          )}
          {willAutoShot && (
            <p className="text-[11px] font-mono text-txt/35 leading-relaxed">
              No image yet — a screenshot of the live URL will be captured when you save (takes ~10 s).
            </p>
          )}
        </div>
      </div>
      <div className="relative flex flex-wrap items-center gap-3 pt-4 border-t border-txt/5">
        <button type="submit" disabled={saving || !form.title.trim()} className={primaryBtn} data-dark-cursor>
          {saving ? 'Saving… (capturing screenshot if needed)' : 'Save project'}
        </button>
        <button type="button" onClick={onCancel} className={ghostBtn}>
          Cancel
        </button>
      </div>
    </form>
  )
}

/* ------------------------------ dashboard ------------------------------ */
function Dashboard({ onLogout }) {
  const [list, setList] = useState(null)
  const [editing, setEditing] = useState(null) // null | 'new' | index
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    api.projects().then(setList).catch((e) => setErr(e.message))
  }, [])

  const flash = (text) => {
    setMsg(text)
    setTimeout(() => setMsg(''), 2500)
  }

  const persist = useCallback(
    async (next) => {
      setSaving(true)
      setErr('')
      try {
        const saved = await api.saveProjects(next)
        setList(saved)
        return true
      } catch (e) {
        setErr(e.message)
        if (/signed in/i.test(e.message)) onLogout()
        return false
      } finally {
        setSaving(false)
      }
    },
    [onLogout]
  )

  const toForm = (p) => ({ ...EMPTY, ...p, tech: (p.tech || []).join(', '), live: p.live === '#' ? '' : p.live, code: p.code === '#' ? '' : p.code })

  const save = async (form) => {
    const next = [...list]
    if (editing === 'new') next.push(form)
    else next[editing] = form
    if (await persist(next)) {
      setEditing(null)
      flash(editing === 'new' ? 'Project added' : 'Project updated')
    }
  }
  const remove = async (i) => {
    if (!window.confirm(`Delete "${list[i].title}"?`)) return
    const next = list.filter((_, k) => k !== i)
    if (await persist(next)) flash('Project deleted')
  }
  const move = async (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= list.length) return
    const next = [...list]
    ;[next[i], next[j]] = [next[j], next[i]]
    await persist(next)
  }

  return (
    <Shell
      right={
        <div className="flex items-center gap-3">
          <Link to="/#Projects" className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.25em] text-txt/40 hover:text-accent transition-colors">
            View work page ↗
          </Link>
          <button onClick={onLogout} className={ghostBtn}>
            Sign out
          </button>
        </div>
      }
    >
      <div className="border-b border-accent/10 pb-8 mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-accent/70 mb-4">◆ Admin — Projects</p>
          <h1 className="font-black leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            Things you&apos;ve{' '}
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">shipped</span>
            <span className="italic font-light text-txt/30" style={{ fontFamily: "'Times New Roman', serif" }}>
              .
            </span>
          </h1>
        </div>
        {editing === null && (
          <button onClick={() => setEditing('new')} className={primaryBtn} data-dark-cursor>
            + Add project
          </button>
        )}
      </div>

      {(msg || err) && (
        <p className={`mb-6 text-xs font-mono ${err ? 'text-red-400/80' : 'text-accent/80'}`}>{err || msg}</p>
      )}

      {editing !== null && (
        <div className="mb-10">
          <ProjectForm
            key={editing}
            initial={editing === 'new' ? EMPTY : toForm(list[editing])}
            onSave={save}
            onCancel={() => setEditing(null)}
            saving={saving}
          />
        </div>
      )}

      {list === null ? (
        <p className="text-sm font-mono text-txt/40">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-sm font-mono text-txt/40">No projects yet — add the first one.</p>
      ) : (
        <ul className="space-y-4">
          {list.map((p, i) => (
            <li key={`${p.title}-${i}`} className={`${card} p-4 md:p-5 flex flex-col sm:flex-row gap-5 sm:items-center`}>
              <div className="w-full sm:w-44 flex-shrink-0 rounded-lg overflow-hidden bg-black/40 border border-white/[0.05]">
                {p.src ? (
                  <img src={p.src} alt="" className="w-full aspect-video object-cover" loading="lazy" />
                ) : (
                  <div className="w-full aspect-video flex items-center justify-center text-[10px] font-mono text-txt/30">no image</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-accent/50 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="font-bold text-txt truncate">{p.title}</h2>
                </div>
                <p className="text-xs text-txt/45 mt-1 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 text-[10px] font-mono rounded-full border border-accent/20 text-accent/70">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className={iconBtn} onClick={() => move(i, -1)} disabled={i === 0 || saving} aria-label="Move up">↑</button>
                <button className={iconBtn} onClick={() => move(i, 1)} disabled={i === list.length - 1 || saving} aria-label="Move down">↓</button>
                <button className={ghostBtn} onClick={() => setEditing(i)} disabled={saving}>Edit</button>
                <button className={`${ghostBtn} hover:border-red-400/60 hover:text-red-400`} onClick={() => remove(i)} disabled={saving}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  )
}

/* ------------------------------- page ------------------------------- */
export default function Admin() {
  const [authed, setAuthed] = useState(null) // null = checking

  useEffect(() => {
    document.title = 'Admin — Projects'
    if (!getToken()) return setAuthed(false)
    api.session().then((r) => setAuthed(!!r.ok)).catch(() => setAuthed(false))
  }, [])

  const logout = () => {
    setToken('')
    setAuthed(false)
  }

  if (authed === null) return <Shell><p className="text-sm font-mono text-txt/40">…</p></Shell>
  return authed ? <Dashboard onLogout={logout} /> : <Login onDone={() => setAuthed(true)} />
}
