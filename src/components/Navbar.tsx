import { useState, useRef, useEffect } from 'react'
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

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <img src={logoSrc} alt="Lockmate" className={styles.logoImg} />
      </Link>

      {/* Desktop links */}
      <ul className={styles.navLinks}>
        <li><Link to="/" className={styles.link}>Hjem</Link></li>
        <FeaturesDropdown />
        <li><Link to="/pricing" className={styles.link}>Priser</Link></li>
        <li><Link to="/about" className={styles.link}>Om os</Link></li>
      </ul>

      {/* Desktop actions */}
      <div className={styles.actions}>
        <Link to="/login" className={styles.loginBtn}>Log ind</Link>
        <Link to="/register" className={styles.ctaBtn}>Kom i gang</Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <IconX size={20} strokeWidth={2} /> : <IconMenu2 size={20} strokeWidth={2} />}
      </button>

      {/* Mobile menu */}
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
          </ul>
          <div className={styles.mobileActions}>
            <Link to="/login" className={styles.loginBtn} onClick={() => setMenuOpen(false)}>Log ind</Link>
            <Link to="/register" className={styles.ctaBtn} onClick={() => setMenuOpen(false)}>Kom i gang</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
