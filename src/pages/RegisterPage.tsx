import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconMail, IconLock, IconEye, IconEyeOff, IconUser, IconArrowNarrowRight, IconArrowNarrowLeft } from '@tabler/icons-react'
import logoSrc from '../assets/logo.png'
import styles from './RegisterPage.module.css'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)

  return (
    <div className={styles.page}>

      {/* ── Left — form ── */}
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h1 className={styles.title}>Create an account</h1>
            <p className={styles.subtitle}>Secure your team's credentials from day one</p>
          </div>

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="firstName">First name</label>
                <div className={styles.inputWrap}>
                  <IconUser size={16} className={styles.inputIcon} strokeWidth={1.75} />
                  <input id="firstName" type="text" className={styles.input} placeholder="Peter" autoComplete="given-name" />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="lastName">Last name</label>
                <div className={styles.inputWrap}>
                  <IconUser size={16} className={styles.inputIcon} strokeWidth={1.75} />
                  <input id="lastName" type="text" className={styles.input} placeholder="Hansen" autoComplete="family-name" />
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Work email</label>
              <div className={styles.inputWrap}>
                <IconMail size={16} className={styles.inputIcon} strokeWidth={1.75} />
                <input id="email" type="email" className={styles.input} placeholder="you@company.com" autoComplete="email" />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">Password</label>
              <div className={styles.inputWrap}>
                <IconLock size={16} className={styles.inputIcon} strokeWidth={1.75} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${styles.inputWithToggle}`}
                  placeholder="Min. 12 characters"
                  autoComplete="new-password"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password visibility">
                  {showPassword ? <IconEyeOff size={15} strokeWidth={1.75} /> : <IconEye size={15} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="confirm">Confirm password</label>
              <div className={styles.inputWrap}>
                <IconLock size={16} className={styles.inputIcon} strokeWidth={1.75} />
                <input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  className={`${styles.input} ${styles.inputWithToggle}`}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm((v) => !v)} aria-label="Toggle confirm visibility">
                  {showConfirm ? <IconEyeOff size={15} strokeWidth={1.75} /> : <IconEye size={15} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Create account <IconArrowNarrowRight size={16} strokeWidth={2} />
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.switchLink} viewTransition>Sign in</Link>
          </p>
        </div>
      </div>

      {/* ── Right — green panel ── */}
      <div className={styles.right}>
        <Link to="/" className={styles.logo}>
          <img src={logoSrc} alt="Lockmate" className={styles.logoImg} />
        </Link>

        <div className={styles.rightBody}>
          <h2 className={styles.rightHeading}>Up and running in under 5 minutes</h2>
          <p className={styles.rightSub}>
            Set up your organisation, create a vault, and invite your team. No IT ticket required.
          </p>
        </div>

        <Link to="/" className={styles.backLink}>
          <IconArrowNarrowLeft size={14} strokeWidth={2} />
          Back to site
        </Link>
      </div>

    </div>
  )
}
