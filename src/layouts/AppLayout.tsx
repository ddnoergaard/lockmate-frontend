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
} from '@tabler/icons-react'
import styles from './AppLayout.module.css'

const navItems = [
  { to: '/app/dashboard',     icon: IconLayoutDashboard, label: 'Dashboard'       },
  { to: '/app/credentials',   icon: IconKey,             label: 'Adgangskoder'    },
  { to: '/app/vault',         icon: IconShieldLock,      label: 'Vault'           },
  { to: '/app/organisation',  icon: IconBuilding,        label: 'Organisation'    },
]

const orgs = [
  { id: 1, name: 'Acme Corp',       initials: 'A'  },
  { id: 2, name: 'Daniel Personal', initials: 'D'  },
  { id: 3, name: 'Side Project',    initials: 'SP' },
]

function ContentTransition() {
  const { pathname } = useLocation()
  return (
    <div key={pathname} className={styles.contentFade}>
      <Outlet />
    </div>
  )
}

function OrgSelector() {
  const [open, setOpen]       = useState(false)
  const [activeId, setActiveId] = useState(1)
  const ref = useRef<HTMLDivElement>(null)

  const active = orgs.find(o => o.id === activeId)!

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
    setOpen(false)
  }

  return (
    <div className={styles.orgSelectorWrap} ref={ref}>
      <button
        className={`${styles.orgSelector} ${open ? styles.orgSelectorOpen : ''}`}
        onClick={() => setOpen(v => !v)}
      >
        <span className={styles.orgAvatar}>{active.initials}</span>
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
              <span className={styles.orgDropdownAvatar}>{o.initials}</span>
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

  function logout() {
    setLoggingOut(true)
    setTimeout(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
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
        <OrgSelector />

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
