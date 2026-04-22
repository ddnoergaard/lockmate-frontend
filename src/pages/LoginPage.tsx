import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconMail, IconLock, IconEye, IconEyeOff, IconArrowNarrowRight, IconArrowNarrowLeft } from '@tabler/icons-react'
import logoSrc from '../assets/logo.png'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={styles.page}>

      {/* ── Left — green panel ── */}
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          <img src={logoSrc} alt="Lockmate" className={styles.logoImg} />
        </Link>

        <div className={styles.leftBody}>
          <h2 className={styles.leftHeading}>Secure your team's credentials</h2>
          <p className={styles.leftSub}>
            One place for passwords, access keys, and sensitive data. Built for teams who take security seriously.
          </p>
        </div>

        <Link to="/" className={styles.backLink}>
          <IconArrowNarrowLeft size={14} strokeWidth={2} />
          Back to site
        </Link>
      </div>

      {/* ── Right — form ── */}
      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>Sign in to your organisation vault</p>
          </div>

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email address</label>
              <div className={styles.inputWrap}>
                <IconMail size={16} className={styles.inputIcon} strokeWidth={1.75} />
                <input id="email" type="email" className={styles.input} placeholder="you@company.com" autoComplete="email" />
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="password">Password</label>
                <a href="#" className={styles.forgotLink}>Forgot password?</a>
              </div>
              <div className={styles.inputWrap}>
                <IconLock size={16} className={styles.inputIcon} strokeWidth={1.75} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${styles.inputWithToggle}`}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password visibility">
                  {showPassword ? <IconEyeOff size={15} strokeWidth={1.75} /> : <IconEye size={15} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Sign in <IconArrowNarrowRight size={16} strokeWidth={2} />
            </button>
          </form>

          <p className={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.switchLink} viewTransition>Create one</Link>
          </p>
        </div>
      </div>

    </div>
  )
}
