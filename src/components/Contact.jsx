import { useEffect, useRef, useState } from 'react'
import useReveal from '../hooks/useReveal'
import SocialIcon from './ui/SocialIcon'
import { contact, person, socials } from '../data/content'

const EASE = 'cubic-bezier(0.22,0.61,0.36,1)'

/** opacity + lift, staggered by `delay` ms. */
const rise = (shown, delay = 0) => ({
  opacity: shown ? 1 : 0,
  transform: shown ? 'translateY(0)' : 'translateY(32px)',
  transition: `opacity 700ms ${delay}ms, transform 700ms ${EASE} ${delay}ms`,
})

function Field({ id, label, value, onChange, error, textarea, ...rest }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <div className="relative space-y-2">
      <label htmlFor={id} className="text-[10px] font-mono uppercase tracking-[0.25em] text-txt/50 block">
        {label}
      </label>
      <div className="relative">
        <Tag
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={`peer w-full px-0 py-3 bg-transparent text-txt ${
            textarea ? 'text-base resize-none' : 'text-lg'
          } placeholder-txt/20 outline-none`}
          {...rest}
        />
        <span className="absolute bottom-0 left-0 h-px w-full transition-opacity duration-300 peer-focus:opacity-0 bg-txt/15" />
        <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 ease-out bg-accent" />
      </div>
      {error && <p className="text-xs font-mono text-red-400/80 pt-1">{error}</p>}
    </div>
  )
}

export default function Contact() {
  const [ref, shown] = useReveal(0.1)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const orbA = useRef(null)
  const orbB = useRef(null)

  /* pointer-tracked glow orbs */
  useEffect(() => {
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      if (orbA.current) orbA.current.style.transform = `translate3d(${x * 40}px, ${y * 40}px, 0)`
      if (orbB.current) orbB.current.style.transform = `translate3d(${x * -30}px, ${y * -30}px, 0)`
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((err) => ({ ...err, [key]: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Please add your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'That email does not look right.'
    if (form.message.trim().length < 10) next.message = 'A little more detail helps — 10 characters minimum.'
    setErrors(next)
    if (Object.keys(next).length) return

    setSending(true)
    try {
      if (contact.endpoint) {
        await fetch(contact.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form),
        })
      }
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  const reset = () => {
    setForm({ name: '', email: '', message: '' })
    setErrors({})
    setSent(false)
  }

  return (
    <section
      id="Contact"
      ref={ref}
      className="relative w-full overflow-hidden py-28 md:py-36"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #020815 40%, #050a30 80%, #020815 100%)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(#6cbafa 1px, transparent 1px), linear-gradient(90deg, #6cbafa 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          ref={orbA}
          className="absolute top-40 left-[8%] w-[500px] h-[500px] bg-accent/[0.06] rounded-full blur-3xl"
          style={{ transition: `transform 0.6s ${EASE}` }}
        />
        <div
          ref={orbB}
          className="absolute bottom-40 right-[5%] w-96 h-96 bg-secondary/[0.05] rounded-full blur-3xl"
          style={{ transition: `transform 0.7s ${EASE}` }}
        />
      </div>

      {sent ? (
        /* ---------------------- success state ---------------------- */
        <div className="relative z-10 max-w-[1528px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="text-center space-y-8 py-20">
            <div className="w-20 h-20 mx-auto rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center">
              <svg className="w-9 h-9 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-4">
              <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-accent/70">
                ◆ Message received
              </p>
              <h2
                className="font-black leading-[0.9] tracking-tight text-txt"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              >
                Talk soon
                <span className="italic font-light text-txt/30" style={{ fontFamily: "'Times New Roman', serif" }}>
                  .
                </span>
              </h2>
              <p className="text-txt/55 max-w-md mx-auto">
                Thanks for reaching out. I typically reply within 24 hours.
              </p>
            </div>
            <button
              onClick={reset}
              className="inline-flex items-center gap-3 px-7 py-4 rounded-full border border-txt/15 text-txt hover:border-accent/60 hover:text-accent transition-all duration-300 text-sm tracking-wide"
            >
              ← Back to contact
            </button>
          </div>
        </div>
      ) : (
        <div className="relative z-10 max-w-[1528px] mx-auto px-6 md:px-12 lg:px-16 space-y-20">
          {/* ---------------------- headline ---------------------- */}
          <header className="border-b border-accent/10 pb-10" style={rise(shown)}>
            <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-accent/70 mb-6">
              {contact.eyebrow}
            </p>
            <h2 className="font-black leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(2.5rem, 7vw, 6.5rem)' }}>
              <span
                className="block text-txt"
                style={{
                  clipPath: shown ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
                  transition: `clip-path 800ms ${EASE} 100ms`,
                }}
              >
                {contact.headlineTop}
              </span>
              <span
                className="block"
                style={{
                  clipPath: shown ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
                  transition: `clip-path 800ms ${EASE} 250ms`,
                }}
              >
                <span className="text-txt">{contact.headlineBottom} </span>
                <span className="text-accent">{contact.headlineAccent}</span>
              </span>
              <span className="sr-only">
                {' '}
                — Contact {person.firstName} {person.lastName} for freelance web development
              </span>
            </h2>
          </header>

          <p className="sr-only">{contact.seoSummary}</p>

          {/* ---------------------- bento grid ---------------------- */}
          <div className="grid grid-cols-12 gap-4 md:gap-5 auto-rows-[minmax(140px,auto)]">
            <div className="col-span-12 lg:col-span-4 space-y-5">
              {/* email */}
              <a
                href={`mailto:${person.email}`}
                className="group block relative overflow-hidden rounded-2xl border border-accent/15 bg-gradient-to-br from-dark/80 to-dark/40 backdrop-blur-sm p-7 hover:border-accent/40 transition-all duration-500"
                style={rise(shown, 200)}
              >
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent/60">◆ Email</p>
                  <span className="text-accent/40 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500">
                    ↗
                  </span>
                </div>
                <p className="text-txt font-medium text-base md:text-lg break-all">{person.email}</p>
                {person.phone && <p className="text-txt/60 text-sm mt-1 font-mono">{person.phone}</p>}
                <p className="text-txt/40 text-xs mt-2 font-mono">Prefer email? Reach out</p>
              </a>

              {/* status */}
              <div
                className="relative overflow-hidden rounded-2xl border border-accent/15 bg-gradient-to-br from-accent/[0.04] to-transparent backdrop-blur-sm p-7"
                style={rise(shown, 350)}
              >
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent/60 mb-5">◆ Status</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80]" />
                    <span className="text-txt text-sm font-medium">
                      {person.available ? 'Open for new projects' : 'Currently booked'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-txt/45 font-mono pt-2 border-t border-txt/5">
                    <span>Response time</span>
                    <span className="text-accent/80">{person.responseTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-txt/45 font-mono">
                    <span>Working remotely</span>
                    <span className="text-accent/80">{person.location}</span>
                  </div>
                </div>
              </div>

              {/* socials */}
              <div
                className="relative overflow-hidden rounded-2xl border border-accent/15 bg-dark/50 backdrop-blur-sm p-7"
                style={rise(shown, 500)}
              >
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent/60 mb-5">◆ Elsewhere</p>
                <div className="flex flex-wrap gap-3">
                  {socials.map((s, i) => (
                    <div key={s.label} className="social-wave-btn" style={rise(shown, 550 + i * 100)}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="relative z-10 w-12 h-12 rounded-xl border border-accent/20 bg-accent/5 flex items-center justify-center text-accent cursor-pointer transition-colors duration-300"
                      >
                        <SocialIcon icon={s.icon} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ---------------------- form ---------------------- */}
            <div className="col-span-12 lg:col-span-8" style={rise(shown, 300)}>
              <form
                onSubmit={submit}
                noValidate
                className="relative overflow-hidden rounded-2xl border border-accent/15 bg-gradient-to-br from-dark/80 via-primary/15 to-dark/60 backdrop-blur-sm p-8 md:p-12 space-y-8"
              >
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-accent/[0.08] rounded-full blur-3xl pointer-events-none" />

                <div className="relative space-y-2">
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent/60">
                    ◆ Send a message
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-txt">
                    Tell me about your{' '}
                    <span className="italic font-light text-accent/80" style={{ fontFamily: "'Times New Roman', serif" }}>
                      project
                    </span>
                  </h3>
                </div>

                <Field
                  id="name"
                  label="Your name *"
                  value={form.name}
                  onChange={set('name')}
                  error={errors.name}
                  placeholder="Jane Doe"
                  autoComplete="name"
                />
                <Field
                  id="email"
                  label="Your email *"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  error={errors.email}
                  placeholder="jane@company.com"
                  autoComplete="email"
                />
                <Field
                  id="message"
                  label="Your message *"
                  textarea
                  rows={5}
                  value={form.message}
                  onChange={set('message')}
                  error={errors.message}
                  placeholder="What are you building?"
                />

                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-txt/5">
                  <p className="text-xs font-mono text-txt/35">{contact.formNote}</p>
                  <button
                    type="submit"
                    disabled={sending}
                    data-dark-cursor
                    className="group relative inline-flex self-start items-center gap-3 px-8 py-4 rounded-full bg-accent text-dark font-medium text-sm tracking-wide overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(108,186,250,0.4)] disabled:opacity-60"
                  >
                    <span
                      className="absolute inset-0 z-[1] -translate-x-full skew-x-[-20deg] opacity-0 group-hover:translate-x-[200%] group-hover:opacity-100 transition-all duration-700 ease-out pointer-events-none"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                        width: '40%',
                        borderRadius: 'inherit',
                      }}
                    />
                    <span className="relative z-10 flex items-center gap-3">
                      {sending ? 'Sending…' : contact.submitLabel}
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="border-t border-accent/10 pt-8 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-accent/50">
            <span>End of page · Thanks for visiting ✦</span>
          </div>
        </div>
      )}
    </section>
  )
}
