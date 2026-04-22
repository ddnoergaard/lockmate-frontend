import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Navigate, Link } from 'react-router-dom'
import { IconArrowNarrowRight, IconChevronDown } from '@tabler/icons-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { functionsData } from './functionsData'
import styles from './FunctionPage.module.css'

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`${styles.faqItem} ${open ? styles.faqItemOpen : ''}`}>
      <button className={styles.faqQuestion} onClick={() => setOpen(v => !v)}>
        <span>{q}</span>
        <IconChevronDown size={16} strokeWidth={1.75} className={styles.faqChevron} />
      </button>
      {open && <p className={styles.faqAnswer}>{a}</p>}
    </div>
  )
}

export default function FunctionPage() {
  const { slug } = useParams<{ slug: string }>()
  const fn = functionsData.find(f => f.slug === slug)

  if (!fn) return <Navigate to="/" replace />

  return (
    <div className={styles.page}>
      <Helmet>
        <title>{fn.heading} – Lockmate</title>
        <meta name="description" content={fn.description} />
      </Helmet>
      <div className={styles.navWrap}>
        <Navbar />
      </div>

      {/* ── Hero ── */}
      <div className={styles.heroWrap}>
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <span className={styles.tag}>{fn.tag}</span>
            <h1 className={styles.heading}>{fn.heading}</h1>
            <p className={styles.subheading}>{fn.subheading}</p>
            <div className={styles.heroCtas}>
              <Link to="/register" className={styles.primaryBtn}>
                Kom gratis i gang <IconArrowNarrowRight size={15} strokeWidth={2} />
              </Link>
              <Link to="/pricing" className={styles.ghostBtn}>Se priser</Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroGlow} />
            <span className={styles.heroVisualLabel}>Visual kommer snart</span>
          </div>
        </div>
      </div>

      {/* ── Highlight ── */}
      {fn.highlight && (
        <div className={styles.highlightWrap}>
          <div className={styles.highlightInner}>
            <div className={styles.highlightCard}>
              <div className={styles.highlightGlow} />
              <div className={styles.highlightContent}>
                <h2 className={styles.highlightHeading}>{fn.highlight.heading}</h2>
                <p className={styles.highlightBody}>{fn.highlight.body}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Technical brief ── */}
      <div className={styles.briefWrap}>
        <div className={styles.briefInner}>
          <div className={styles.briefLeft}>
            <span className={styles.sectionLabel}>Sådan virker det</span>
            <p className={styles.briefDesc}>{fn.description}</p>
          </div>
          <div className={styles.featuresGrid}>
            {fn.features.map(f => (
              <div key={f.title} className={styles.featureCard}>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureBody}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className={styles.faqWrap}>
        <div className={styles.faqInner}>
          <div className={styles.faqLeft}>
            <span className={styles.faqEyebrow}>FAQ</span>
            <h2 className={styles.faqTitle}>Hyppige spørgsmål</h2>
            <p className={styles.faqSubtitle}>
              Har du stadig spørgsmål? <a href="mailto:hello@lockhub.io" className={styles.faqContact}>Kontakt os</a>
            </p>
          </div>
          <div className={styles.faqList}>
            {fn.faq.map(item => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
