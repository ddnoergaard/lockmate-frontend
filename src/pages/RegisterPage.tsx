import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import {
  IconMail, IconLock, IconEye, IconEyeOff,
  IconUser, IconPhone, IconArrowNarrowRight, IconArrowNarrowLeft,
} from '@tabler/icons-react'
import logoSrc from '../assets/logo.svg'
import styles from './RegisterPage.module.css'

const months = [
  'Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'December',
]
const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1929 }, (_, i) => currentYear - i)

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm] = useState({
    firstName:       '',
    lastName:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
    phone:           '',
    birthDay:        '',
    birthMonth:      '',
    birthYear:       '',
  })

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Adgangskoderne stemmer ikke overens.')
      return
    }
    if (form.phone.length > 8) {
      setError('Telefonnummer må højst være 8 tegn.')
      return
    }
    if (!form.birthDay || !form.birthMonth || !form.birthYear) {
      setError('Vælg venligst din fødselsdato.')
      return
    }

    const birthDate = new Date(
      parseInt(form.birthYear),
      parseInt(form.birthMonth) - 1,
      parseInt(form.birthDay),
    ).toISOString()

    setLoading(true)
    try {
      const res = await fetch('https://localhost:7014/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName:  form.lastName,
          email:     form.email,
          password:  form.password,
          phone:     form.phone,
          birthDate,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        setError(text || `Fejl ${res.status}. Prøv igen.`)
        return
      }

      localStorage.setItem('user', JSON.stringify({
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
      }))

      navigate('/onboarding')
    } catch {
      setError('Kunne ikke forbinde til serveren. Tjek din forbindelse.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Opret konto – Lockmate</title>
        <meta name="description" content="Opret din Lockmate konto og begynd at beskytte dit teams loginoplysninger på under 5 minutter." />
      </Helmet>

      {/* ── Left — form ── */}
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h1 className={styles.title}>Opret en konto</h1>
            <p className={styles.subtitle}>Sikr dit teams loginoplysninger fra dag ét</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>

            {/* Name */}
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="firstName">Fornavn</label>
                <div className={styles.inputWrap}>
                  <IconUser size={16} className={styles.inputIcon} strokeWidth={1.75} />
                  <input id="firstName" type="text" className={styles.input} placeholder="Peter"
                    autoComplete="given-name" value={form.firstName} onChange={field('firstName')} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="lastName">Efternavn</label>
                <div className={styles.inputWrap}>
                  <IconUser size={16} className={styles.inputIcon} strokeWidth={1.75} />
                  <input id="lastName" type="text" className={styles.input} placeholder="Hansen"
                    autoComplete="family-name" value={form.lastName} onChange={field('lastName')} />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Arbejds-email</label>
              <div className={styles.inputWrap}>
                <IconMail size={16} className={styles.inputIcon} strokeWidth={1.75} />
                <input id="email" type="email" className={styles.input} placeholder="dig@virksomhed.dk"
                  autoComplete="email" value={form.email} onChange={field('email')} />
              </div>
            </div>

            {/* Phone */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="phone">
                Telefon <span className={styles.optional}>(valgfrit)</span>
              </label>
              <div className={styles.inputWrap}>
                <IconPhone size={16} className={styles.inputIcon} strokeWidth={1.75} />
                <input id="phone" type="tel" className={styles.input} placeholder="12345678"
                  autoComplete="tel" value={form.phone} maxLength={9}
                  onChange={field('phone')} />
              </div>
              {form.phone.length > 8 && (
                <p className={styles.fieldError}>Telefonnummer må højst være 8 tegn.</p>
              )}
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">Adgangskode</label>
              <div className={styles.inputWrap}>
                <IconLock size={16} className={styles.inputIcon} strokeWidth={1.75} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${styles.inputWithToggle}`}
                  placeholder="Min. 12 tegn"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={field('password')}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <IconEyeOff size={15} strokeWidth={1.75} /> : <IconEye size={15} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="confirm">Bekræft adgangskode</label>
              <div className={styles.inputWrap}>
                <IconLock size={16} className={styles.inputIcon} strokeWidth={1.75} />
                <input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  className={`${styles.input} ${styles.inputWithToggle}`}
                  placeholder="Gentag din adgangskode"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={field('confirmPassword')}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm ? <IconEyeOff size={15} strokeWidth={1.75} /> : <IconEye size={15} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            {/* Birthdate */}
            <div className={styles.field}>
              <label className={styles.label}>Fødselsdato</label>
              <div className={styles.dateRow}>
                <select className={styles.select} value={form.birthDay} onChange={field('birthDay')}>
                  <option value="">Dag</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select className={styles.select} value={form.birthMonth} onChange={field('birthMonth')}>
                  <option value="">Måned</option>
                  {months.map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
                <select className={styles.select} value={form.birthYear} onChange={field('birthYear')}>
                  <option value="">År</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Opretter konto...' : 'Opret konto'}
              {!loading && <IconArrowNarrowRight size={16} strokeWidth={2} />}
            </button>
          </form>

          <p className={styles.switchText}>
            Har du allerede en konto?{' '}
            <Link to="/login" className={styles.switchLink}>Log ind</Link>
          </p>
        </div>
      </div>

      {/* ── Right — green panel ── */}
      <div className={styles.right}>
        <Link to="/" className={styles.logo}>
          <img src={logoSrc} alt="Lockmate" className={styles.logoImg} />
        </Link>

        <div className={styles.rightBody}>
          <h2 className={styles.rightHeading}>Kørende på under 5 minutter</h2>
          <p className={styles.rightSub}>
            Opret din organisation, lav en vault og invitér dit team. Ingen IT-sag krævet.
          </p>
        </div>

        <Link to="/" className={styles.backLink}>
          <IconArrowNarrowLeft size={14} strokeWidth={2} />
          Tilbage til siden
        </Link>
      </div>

    </div>
  )
}
