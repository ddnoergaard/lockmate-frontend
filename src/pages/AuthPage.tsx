import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  IconMail, IconLock, IconEye, IconEyeOff,
  IconUser, IconArrowNarrowRight, IconArrowNarrowLeft,
} from '@tabler/icons-react'
import logoSrc from '../assets/logo.svg'
import styles from './AuthPage.module.css'

type Mode = 'login' | 'register'

interface Props { mode: Mode }

export default function AuthPage({ mode }: Props) {
  const [current, setCurrent] = useState<Mode>(mode)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)

  const isLogin = current === 'login'

  function switchMode(next: Mode) {
    setShowPassword(false)
    setShowConfirm(false)
    setCurrent(next)
  }

  const greenPanel = (
    <div className={`${styles.green} ${isLogin ? styles.greenLeft : styles.greenRight}`}>
      <Link to="/" className={styles.logo}>
        <img src={logoSrc} alt="Lockmate" className={styles.logoImg} />
      </Link>
      <div className={styles.greenBody}>
        <h2 className={styles.greenHeading}>
          {isLogin ? 'Sikr dit teams loginoplysninger' : 'Kørende på under 5 minutter'}
        </h2>
        <p className={styles.greenSub}>
          {isLogin
            ? 'Ét sted til adgangskoder, adgangsnøgler og følsomme data. Bygget til teams der tager sikkerhed seriøst.'
            : 'Opret din organisation, lav en vault og invitér dit team. Ingen IT-sag krævet.'}
        </p>
      </div>
      <Link to="/" className={styles.backLink}>
        <IconArrowNarrowLeft size={14} strokeWidth={2} />
        Tilbage til siden
      </Link>
    </div>
  )

  const formPanel = (
    <div className={styles.form}>
      <div key={current} className={styles.card}>
        <div className={styles.cardHead}>
          <h1 className={styles.title}>{isLogin ? 'Velkommen tilbage' : 'Opret en konto'}</h1>
          <p className={styles.subtitle}>
            {isLogin ? 'Log ind på din organisations vault' : 'Sikr dit teams loginoplysninger fra dag ét'}
          </p>
        </div>

        <form className={styles.fields} onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="firstName">Fornavn</label>
                <div className={styles.inputWrap}>
                  <IconUser size={16} className={styles.inputIcon} strokeWidth={1.75} />
                  <input id="firstName" type="text" className={styles.input} placeholder="Peter" autoComplete="given-name" />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="lastName">Efternavn</label>
                <div className={styles.inputWrap}>
                  <IconUser size={16} className={styles.inputIcon} strokeWidth={1.75} />
                  <input id="lastName" type="text" className={styles.input} placeholder="Hansen" autoComplete="family-name" />
                </div>
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              {isLogin ? 'E-mailadresse' : 'Arbejds-email'}
            </label>
            <div className={styles.inputWrap}>
              <IconMail size={16} className={styles.inputIcon} strokeWidth={1.75} />
              <input id="email" type="email" className={styles.input} placeholder="you@company.com" autoComplete="email" />
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="password">Adgangskode</label>
              {isLogin && <a href="#" className={styles.forgotLink}>Glemt adgangskode?</a>}
            </div>
            <div className={styles.inputWrap}>
              <IconLock size={16} className={styles.inputIcon} strokeWidth={1.75} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`${styles.input} ${styles.inputWithToggle}`}
                placeholder={isLogin ? '••••••••••••' : 'Min. 12 tegn'}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(v => !v)}>
                {showPassword ? <IconEyeOff size={15} strokeWidth={1.75} /> : <IconEye size={15} strokeWidth={1.75} />}
              </button>
            </div>
          </div>

          {!isLogin && (
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
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm ? <IconEyeOff size={15} strokeWidth={1.75} /> : <IconEye size={15} strokeWidth={1.75} />}
                </button>
              </div>
            </div>
          )}

          <button type="submit" className={styles.submitBtn}>
            {isLogin ? 'Log ind' : 'Opret konto'}
            <IconArrowNarrowRight size={16} strokeWidth={2} />
          </button>
        </form>

        <p className={styles.switchText}>
          {isLogin ? 'Har du ikke en konto? ' : 'Har du allerede en konto? '}
          <button className={styles.switchLink} onClick={() => switchMode(isLogin ? 'register' : 'login')}>
            {isLogin ? 'Opret en' : 'Log ind'}
          </button>
        </p>
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      <Helmet>
        {isLogin
          ? <><title>Log ind – Lockmate</title><meta name="description" content="Log ind på din Lockmate organisations vault og få adgang til dit teams loginoplysninger." /></>
          : <><title>Opret konto – Lockmate</title><meta name="description" content="Opret din Lockmate konto og begynd at beskytte dit teams loginoplysninger på under 5 minutter." /></>
        }
      </Helmet>
      {isLogin ? <>{greenPanel}{formPanel}</> : <>{formPanel}{greenPanel}</>}
    </div>
  )
}
