import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import {
  IconMail, IconLock, IconEye, IconEyeOff,
  IconArrowNarrowRight, IconArrowNarrowLeft,
} from '@tabler/icons-react'
import logoSrc from '../assets/logo.svg'
import styles from './AuthPage.module.css'
import { API_BASE } from '../config'

export default function AuthPage() {
  const navigate = useNavigate()
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Udfyld venligst email og adgangskode.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const text = await res.text()
        setError(text || 'Forkert email eller adgangskode.')
        return
      }

      const { token } = await res.json()
      localStorage.setItem('token', token)
      navigate('/app/dashboard')
    } catch {
      setError('Kunne ikke forbinde til serveren. Tjek din forbindelse.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Log ind – Lockmate</title>
        <meta name="description" content="Log ind på din Lockmate organisations vault og få adgang til dit teams loginoplysninger." />
      </Helmet>

      {/* Green panel */}
      <div className={`${styles.green} ${styles.greenLeft}`}>
        <Link to="/" className={styles.logo}>
          <img src={logoSrc} alt="Lockmate" className={styles.logoImg} />
        </Link>
        <div className={styles.greenBody}>
          <h2 className={styles.greenHeading}>Sikr dit teams loginoplysninger</h2>
          <p className={styles.greenSub}>
            Ét sted til adgangskoder, adgangsnøgler og følsomme data. Bygget til teams der tager sikkerhed seriøst.
          </p>
        </div>
        <Link to="/" className={styles.backLink}>
          <IconArrowNarrowLeft size={14} strokeWidth={2} />
          Tilbage til siden
        </Link>
      </div>

      {/* Form panel */}
      <div className={styles.form}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h1 className={styles.title}>Velkommen tilbage</h1>
            <p className={styles.subtitle}>Log ind på din organisations vault</p>
          </div>

          <form className={styles.fields} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">E-mailadresse</label>
              <div className={styles.inputWrap}>
                <IconMail size={16} className={styles.inputIcon} strokeWidth={1.75} />
                <input
                  id="email" type="email" className={styles.input}
                  placeholder="you@company.com" autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="password">Adgangskode</label>
                <a href="#" className={styles.forgotLink}>Glemt adgangskode?</a>
              </div>
              <div className={styles.inputWrap}>
                <IconLock size={16} className={styles.inputIcon} strokeWidth={1.75} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${styles.inputWithToggle}`}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <IconEyeOff size={15} strokeWidth={1.75} /> : <IconEye size={15} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Logger ind...' : 'Log ind'}
              {!loading && <IconArrowNarrowRight size={16} strokeWidth={2} />}
            </button>
          </form>

          <p className={styles.switchText}>
            Har du ikke en konto?{' '}
            <Link to="/register" className={styles.switchLink}>Opret en</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
