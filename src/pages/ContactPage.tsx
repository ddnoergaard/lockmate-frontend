import { useState } from 'react'
import { API_BASE } from '../config'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  IconMail, IconMapPin, IconPhone, IconArrowNarrowRight,
  IconShieldLock, IconUsers, IconKey, IconChevronDown,
} from '@tabler/icons-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from './ContactPage.module.css'

const channels = [
  {
    icon: IconMail,
    label: 'E-mail',
    value: 'info@lockmate.dk',
    href: 'mailto:info@lockmate.dk',
  },
  {
    icon: IconPhone,
    label: 'Telefon',
    value: '+45 XX XX XX XX',
    href: 'tel:+45XXXXXXXX',
  },
  {
    icon: IconMapPin,
    label: 'Adresse',
    value: 'København, Danmark',
    href: null,
  },
]

const subjects = [
  'Generel henvendelse',
  'Priser og abonnement',
  'Teknisk support',
  'Sikkerhed og privatliv',
  'Salg og partnerskab',
  'Andet',
]

const faqs = [
  {
    q: 'Hvad er Lockmate?',
    a: 'Lockmate er en adgangskodemanager bygget til teams. Du kan gemme, dele og autofylde adgangskoder og adgangsnøgler sikkert på tværs af hele organisationen.',
  },
  {
    q: 'Er mine data sikre?',
    a: 'Ja. Lockmate bruger zero-knowledge kryptering, hvilket betyder at dine data krypteres på din enhed inden de sendes til vores servere. Vi kan aldrig se dine adgangskoder.',
  },
  {
    q: 'Hvad koster Lockmate?',
    a: 'Vi tilbyder en gratis plan til personlig brug samt betalte planer til teams og organisationer. Se vores prisside for en fuld oversigt.',
  },
  {
    q: 'Kan jeg invitere mit team?',
    a: 'Ja. Du opretter en organisation, genererer et invitationslink og deler det med dit team. Hvert medlem får adgang til de vaults du tildeler dem.',
  },
  {
    q: 'Understøtter Lockmate adgangsnøgler?',
    a: 'Ja. Lockmate understøtter moderne adgangsnøgler (passkeys), som giver hurtigere og sikrere login uden behov for et traditionelt kodeord.',
  },
  {
    q: 'Hvad sker der hvis jeg glemmer min adgangskode?',
    a: 'På grund af zero-knowledge arkitekturen kan vi ikke gendanne din adgangskode på dine vegne. Vi anbefaler at du opbevarer en nødgendannelseskode et sikkert sted.',
  },
]

const features = [
  {
    icon: IconUsers,
    title: 'Bygget til teams',
    body: 'Del adgangskoder og adgangsnøgler sikkert på tværs af dit team. Styr hvem der har adgang til hvad.',
  },
  {
    icon: IconShieldLock,
    title: 'Zero-knowledge',
    body: 'Dine data krypteres på din enhed, før de forlader den. Vi kan aldrig se dine adgangskoder.',
  },
  {
    icon: IconKey,
    title: 'Adgangsnøgler',
    body: 'Understøt moderne passwordless login med adgangsnøgler. Hurtigere og sikrere end et kodeord.',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/contact/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName:  form.name,
          senderEmail: form.email,
          topic:       form.subject,
          emailBody:   form.message,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        setError(text || `Fejl ${res.status}. Prøv igen.`)
        return
      }

      setSent(true)
    } catch {
      setError('Kunne ikke forbinde til serveren. Tjek din forbindelse.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Kontakt – Lockmate</title>
        <meta name="description" content="Tag kontakt til Lockmate. Vi svarer hurtigt på spørgsmål om produktet, priser og sikkerhed." />
      </Helmet>

      <div className={styles.container}>
        <header className={styles.header}>
          <Navbar />
        </header>
      </div>

      <section className={styles.hero}>
        <div className={styles.inner}>
          <span className={styles.label}>Kontakt</span>
          <h1 className={styles.heading}>Vi hører gerne fra dig</h1>
          <p className={styles.sub}>
            Spørgsmål om produktet, priser eller sikkerhed? Skriv til os, vi svarer inden for én hverdag.
          </p>
        </div>
      </section>

      {/* ── Contact form + details ── */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.grid}>

            <div className={styles.formWrap}>
              {sent ? (
                <div className={styles.sent}>
                  <h2 className={styles.sentHeading}>Besked modtaget.</h2>
                  <p className={styles.sentSub}>Vi vender tilbage inden for én hverdag. Tjek din indbakke.</p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="name">Navn</label>
                      <input
                        id="name" type="text" className={styles.input}
                        placeholder="Peter Hansen"
                        value={form.name} onChange={field('name')} required
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="email">E-mail</label>
                      <input
                        id="email" type="email" className={styles.input}
                        placeholder="peter@virksomhed.dk"
                        value={form.email} onChange={field('email')} required
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="subject">Hvad handler din henvendelse om?</label>
                    <select
                      id="subject" className={styles.select}
                      value={form.subject} onChange={field('subject')} required
                    >
                      <option value="" disabled>Vælg emne...</option>
                      {subjects.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="message">Besked</label>
                    <textarea
                      id="message" className={styles.textarea}
                      placeholder="Fortæl os hvad du har brug for..."
                      rows={5}
                      value={form.message} onChange={field('message')} required
                    />
                  </div>

                  {error && <p className={styles.errorMsg}>{error}</p>}

                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? 'Sender...' : 'Send besked'}
                    {!loading && <IconArrowNarrowRight size={16} strokeWidth={2} />}
                  </button>
                </form>
              )}
            </div>

            <div className={styles.details}>
              <h2 className={styles.detailsHeading}>Find os her</h2>
              <div className={styles.channels}>
                {channels.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className={styles.channel}>
                    <div className={styles.channelIcon}>
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className={styles.channelLabel}>{label}</p>
                      {href
                        ? <a href={href} className={styles.channelValue}>{value}</a>
                        : <p className={styles.channelValue}>{value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Interested section ── */}
      <section className={styles.interestSection}>
        <div className={styles.inner}>
          <div className={styles.interestHead}>
            <span className={styles.label}>Hvorfor Lockmate?</span>
            <h2 className={styles.interestHeading}>Klar til at beskytte dit team?</h2>
            <p className={styles.interestSub}>
              Lockmate er bygget til teams der vil have kontrol over deres adgangskoder uden at gå på kompromis med sikkerheden.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureBody}>{body}</p>
              </div>
            ))}
          </div>

          <div className={styles.cta}>
            <Link to="/register" className={styles.ctaBtn}>
              Kom i gang gratis
              <IconArrowNarrowRight size={16} strokeWidth={2} />
            </Link>
            <Link to="/pricing" className={styles.ctaSecondary}>Se priser</Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.faqSection}>
        <div className={styles.inner}>
          <span className={styles.label}>FAQ</span>
          <h2 className={styles.faqHeading}>Ofte stillede spørgsmål</h2>

          <div className={styles.faqList}>
            {faqs.map((item, i) => (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.q}</span>
                  <IconChevronDown
                    size={16}
                    strokeWidth={2}
                    className={`${styles.faqChevron} ${openFaq === i ? styles.faqChevronOpen : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <p className={styles.faqAnswer}>{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
