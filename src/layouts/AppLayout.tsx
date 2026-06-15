import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  IconLayoutDashboard,
  IconKey,
  IconShieldLock,
  IconBuilding,
  IconSettings,
  IconLogout,
  IconSelector,
  IconUserCircle,
  IconCheck,
  IconPlus,
} from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import styles from './AppLayout.module.css'
import { API_BASE } from '../config'

interface UserOrg { id: number; name: string }

const navItems = [
  { to: '/app/dashboard',     icon: IconLayoutDashboard, label: 'Dashboard'       },
  { to: '/app/credentials',   icon: IconKey,             label: 'Adgangskoder'    },
  { to: '/app/vault',         icon: IconShieldLock,      label: 'Vault'           },
  { to: '/app/organisation',  icon: IconBuilding,        label: 'Organisation'    },
]

function initials(name: string): string {
  const words = name.trim().split(/\s+/)
  return words.length === 1
    ? words[0].slice(0, 2).toUpperCase()
    : words.slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function ContentTransition() {
  const { pathname } = useLocation()
  return (
    <div key={pathname} className={styles.contentFade}>
      <Outlet />
    </div>
  )
}

function OrgSelector({ orgs }: { orgs: UserOrg[] }) {
  const storedId = Number(localStorage.getItem('orgId') ?? 0)
  const [open, setOpen]       = useState(false)
  const [activeId, setActiveId] = useState(storedId)
  const ref = useRef<HTMLDivElement>(null)

  const active = orgs.find(o => o.id === activeId) ?? orgs[0]

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  function select(id: number) {
    setActiveId(id)
    localStorage.setItem('orgId', String(id))
    setOpen(false)
  }

  // No orgs
  if (orgs.length === 0) {
    return (
      <div className={styles.orgSelectorWrap}>
        <div className={`${styles.orgSelector} ${styles.orgSelectorEmpty}`}>
          <span className={styles.orgAvatarEmpty} />
          <span className={styles.orgNameEmpty}>Ingen organisation</span>
        </div>
      </div>
    )
  }

  // Single org — just display, no dropdown
  if (orgs.length === 1) {
    return (
      <div className={styles.orgSelectorWrap}>
        <div className={styles.orgSelector}>
          <span className={styles.orgAvatar}>{initials(active.name)}</span>
          <span className={styles.orgName}>{active.name}</span>
        </div>
      </div>
    )
  }

  // Multiple orgs — full selector
  return (
    <div className={styles.orgSelectorWrap} ref={ref}>
      <button
        className={`${styles.orgSelector} ${open ? styles.orgSelectorOpen : ''}`}
        onClick={() => setOpen(v => !v)}
      >
        <span className={styles.orgAvatar}>{initials(active.name)}</span>
        <span className={styles.orgName}>{active.name}</span>
        <IconSelector size={14} className={styles.orgChevron} />
      </button>

      {open && (
        <div className={styles.orgDropdown}>
          <p className={styles.orgDropdownLabel}>Dine organisationer</p>
          {orgs.map(o => (
            <button
              key={o.id}
              className={`${styles.orgDropdownItem} ${o.id === activeId ? styles.orgDropdownItemActive : ''}`}
              onClick={() => select(o.id)}
            >
              <span className={styles.orgDropdownAvatar}>{initials(o.name)}</span>
              <span className={styles.orgDropdownName}>{o.name}</span>
              {o.id === activeId && <IconCheck size={13} strokeWidth={2.5} className={styles.orgDropdownCheck} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AppLayout() {
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [orgs, setOrgs] = useState<UserOrg[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token') ?? ''
    fetch(`${API_BASE}/api/organisation/user-orgs`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : [])
      .then((data: UserOrg[]) => setOrgs(data))
      .catch(() => {})
  }, [])

  function logout() {
    setLoggingOut(true)
    setTimeout(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('orgId')
      navigate('/')
    }, 750)
  }

  return (
    <div className={styles.layout}>
      {loggingOut && (
        <div className={styles.logoutOverlay}>
          <p className={styles.logoutText}>Logger ud...</p>
        </div>
      )}
      <aside className={styles.sidebar}>

        {/* Org selector */}
        <div className={styles.orgSelectorRow}>
          <OrgSelector orgs={orgs} />
          <Link
            to="/app/organisation/setup"
            className={styles.addOrgBtn}
            title="Opret ny organisation"
          >
            <IconPlus size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Main nav */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                  }
                >
                  <Icon size={16} strokeWidth={1.75} />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom nav */}
        <div className={styles.bottomNav}>
          <NavLink
            to="/app/account"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <IconUserCircle size={16} strokeWidth={1.75} />
            <span>Konto</span>
          </NavLink>

          <NavLink
            to="/app/settings"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <IconSettings size={16} strokeWidth={1.75} />
            <span>Indstillinger</span>
          </NavLink>

          <button className={styles.navItem} onClick={logout}>
            <IconLogout size={16} strokeWidth={1.75} />
            <span>Log ud</span>
          </button>
        </div>
      </aside>

      <main className={styles.content}>
        <ContentTransition />
      </main>
    </div>
  )
}
