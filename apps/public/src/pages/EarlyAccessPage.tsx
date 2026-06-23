import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { IconArrowNarrowRight, IconCheck } from '@tabler/icons-react'
import logoSrc from '../assets/logo.svg'
import logoLightSrc from '../assets/logo-light.svg'
import styles from './EarlyAccessPage.module.css'
import { API_BASE } from '../config'
import { useTheme } from '@lockmate/ui'

export default function EarlyAccessPage() {
  const { theme } = useTheme()
  const [email,          setEmail]          = useState('')
  const [consent,        setConsent]        = useState(false)
  const [consentTouched, setConsentTouched] = useState(false)
  const [loading,        setLoading]        = useState(false)
  const [submitted,      setSubmitted]      = useState(false)
  const [error,          setError]          = useState('')

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setError('')

    const trimmed = email.trim()
    if (!trimmed || !trimmed.includes('@')) {
      setError('Indtast venligst en gyldig e-mailadresse.')
      return
    }
    if (!consent) {
      setConsentTouched(true)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/user/early_access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, consent: true }),
      })

      if (!res.ok) {
        const text = await res.text()
        setError(text || 'Noget gik galt. Prøv igen.')
        return
      }

      setSubmitted(true)
    } catch {
      setError('Kunne ikke forbinde til serveren. Tjek din forbindelse.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page} data-theme="dark">
      <Helmet>
        <title>Early Access – Lockmate</title>
        <meta name="description" content="Skriv dig op til Lockmates early access og vær den første til at vide, hvornår vi går live." />
      </Helmet>

      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <img src={theme === 'light' ? logoLightSrc : logoSrc} alt="Lockmate" className={styles.logoImg} />
        </Link>

        {submitted ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <IconCheck size={22} strokeWidth={2.5} />
            </div>
            <h1 className={styles.successTitle}>Du er på listen.</h1>
            <p className={styles.successSub}>
              Vi giver dig besked på <strong>{email.trim()}</strong> når Lockmate er klar.
            </p>
            <Link to="/" className={styles.backLink}>
              Tilbage til forsiden <IconArrowNarrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.copy}>
              <span className={styles.eyebrow}>Early Access</span>
              <h1 className={styles.title}>Vær klar fra dag ét.</h1>
              <p className={styles.sub}>
                Lockmate er snart klar. Skriv dig op og vær den første til at vide det — ingen spam, kun én besked.
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.inputWrap}>
                <input
                  type="email"
                  placeholder="din@email.dk"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={styles.input}
                  autoFocus
                  autoComplete="email"
                />
                <button
                  type="submit"
                  className={styles.btn}
                  disabled={loading}
                >
                  {loading ? 'Sender…' : 'Skriv mig op'}
                </button>
              </div>

              <label className={`${styles.consentLabel} ${consentTouched && !consent ? styles.consentLabelError : ''}`}>
                <input
                  type="checkbox"
                  className={`${styles.consentCheckbox} ${consentTouched && !consent ? styles.consentCheckboxError : ''}`}
                  checked={consent}
                  onChange={e => { setConsent(e.target.checked); if (e.target.checked) setConsentTouched(false) }}
                />
                <span className={styles.consentText}>
                  Jeg giver samtykke til at modtage én e-mail fra Lockmate når vi går live. Ingen spam.
                </span>
              </label>

              {error && <p className={styles.error}>{error}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  )
}
