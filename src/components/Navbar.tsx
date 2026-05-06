import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { IconChevronDown, IconMenu2, IconX } from '@tabler/icons-react'
import logoSrc from '../assets/logo.svg'
import styles from './Navbar.module.css'

const functions = [
  { slug: 'encryption',         name: 'Kryptering',               desc: 'Militærkvalitets AES-256 og zero-knowledge'     },
  { slug: 'cross-platform',     name: 'Tværplatform',              desc: 'Synkronisér på tværs af enheder øjeblikkeligt'  },
  { slug: 'autofill',           name: 'Autofill',                  desc: 'Login med ét klik på alle hjemmesider'          },
  { slug: 'password-generator', name: 'Adgangskodegenerator',      desc: 'Ubrydelige adgangskoder på bestilling'          },
  { slug: 'breach-monitoring',  name: 'Brud-overvågning',          desc: 'Advarsler når dine oplysninger er lækket'       },
]

function FeaturesDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <li ref={ref} className={styles.dropdownWrap}>
      <button
        className={`${styles.link} ${open ? styles.linkActive : ''}`}
        onClick={() => setOpen(v => !v)}
      >
        Features
        <IconChevronDown
          size={13}
          strokeWidth={2}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
        />
      </button>

      {open && (
        <div className={styles.dropdown}>
          {functions.map(({ slug, name, desc }) => (
            <Link
              key={slug}
              to={`/features/${slug}`}
              className={styles.dropdownItem}
              onClick={() => setOpen(false)}
            >
              <span className={styles.dropdownName}>{name}</span>
              <span className={styles.dropdownDesc}>{desc}</span>
            </Link>
          ))}
        </div>
      )}
    </li>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 40) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const bar = (
    <div className={`${styles.wrap} ${scrolled ? styles.wrapScrolled : ''}`}>
      <div className={styles.wrapInner}>
        <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
          <Link to="/" className={styles.logo}>
            <img src={logoSrc} alt="Lockmate" className={`${styles.logoImg} ${scrolled ? styles.logoScrolled : ''}`} />
          </Link>

          <ul className={styles.navLinks}>
            <li><Link to="/" className={styles.link}>Hjem</Link></li>
            <FeaturesDropdown />
            <li><Link to="/pricing" className={styles.link}>Priser</Link></li>
            <li><Link to="/about" className={styles.link}>Om os</Link></li>
            <li><Link to="/contact" className={styles.link}>Kontakt</Link></li>
          </ul>

          <div className={styles.actions}>
            <Link to="/login" className={styles.loginBtn}>Log ind</Link>
            <Link to="/register" className={styles.ctaBtn}>Kom i gang</Link>
          </div>

          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <IconX size={20} strokeWidth={2} /> : <IconMenu2 size={20} strokeWidth={2} />}
          </button>

          {menuOpen && (
            <div className={styles.mobileMenu}>
              <ul className={styles.mobileLinks}>
                <li><Link to="/" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Hjem</Link></li>
                <li>
                  <p className={styles.mobileSectionLabel}>Funktioner</p>
                  {functions.map(({ slug, name }) => (
                    <Link
                      key={slug}
                      to={`/features/${slug}`}
                      className={styles.mobileLink}
                      style={{ paddingLeft: 20 }}
                      onClick={() => setMenuOpen(false)}
                    >
                      {name}
                    </Link>
                  ))}
                </li>
                <li><Link to="/pricing" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Priser</Link></li>
                <li><Link to="/about" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Om os</Link></li>
                <li><Link to="/contact" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Kontakt</Link></li>
              </ul>
              <div className={styles.mobileActions}>
                <Link to="/login" className={styles.loginBtn} onClick={() => setMenuOpen(false)}>Log ind</Link>
                <Link to="/register" className={styles.ctaBtn} onClick={() => setMenuOpen(false)}>Kom i gang</Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  )

  return (
    <>
      {createPortal(bar, document.body)}
      <div className={styles.spacer} aria-hidden="true" />
    </>
  )
}
