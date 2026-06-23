import { useState } from 'react'
import {
  IconPlus,
  IconSearch,
  IconWorld,
  IconServer,
  IconLock,
  IconDots,
  IconChevronDown,
} from '@tabler/icons-react'
import styles from './CredentialsPage.module.css'

const allCredentials = [
  { id: 1,  name: 'GitHub',           username: 'daniel@acme.com',   vault: 'Engineering', type: 'web',    updatedAt: 'Today'      },
  { id: 2,  name: 'AWS Console',      username: 'admin@acme.com',     vault: 'Engineering', type: 'server', updatedAt: '2 days ago' },
  { id: 3,  name: 'Figma',            username: 'design@acme.com',    vault: 'Design',      type: 'web',    updatedAt: '5 days ago' },
  { id: 4,  name: 'Notion',           username: 'team@acme.com',      vault: 'Marketing',   type: 'web',    updatedAt: '1 week ago' },
  { id: 5,  name: 'Stripe',           username: 'finance@acme.com',   vault: 'Finance',     type: 'web',    updatedAt: '1 week ago' },
  { id: 6,  name: 'Vercel',           username: 'deploy@acme.com',    vault: 'Engineering', type: 'web',    updatedAt: '2 weeks ago'},
  { id: 7,  name: 'Linear',           username: 'pm@acme.com',        vault: 'Engineering', type: 'web',    updatedAt: '2 weeks ago'},
  { id: 8,  name: 'Google Analytics', username: 'marketing@acme.com', vault: 'Marketing',   type: 'web',    updatedAt: '3 weeks ago'},
  { id: 9,  name: 'Postgres DB',      username: 'db_admin',           vault: 'Engineering', type: 'server', updatedAt: '3 weeks ago'},
  { id: 10, name: 'Xero',             username: 'accounts@acme.com',  vault: 'Finance',     type: 'web',    updatedAt: '1 month ago'},
  { id: 11, name: 'Slack',            username: 'team@acme.com',      vault: 'Marketing',   type: 'web',    updatedAt: '1 month ago'},
  { id: 12, name: 'Cloudflare',       username: 'ops@acme.com',       vault: 'Engineering', type: 'server', updatedAt: '1 month ago'},
]

const vaults = ['Alle vaults', 'Engineering', 'Design', 'Marketing', 'Finance']

const typeIcon: Record<string, typeof IconWorld> = {
  web: IconWorld, server: IconServer, other: IconLock,
}

export default function CredentialsPage() {
  const [search, setSearch]       = useState('')
  const [activeVault, setVault]   = useState('All vaults')

  const filtered = allCredentials.filter((c) => {
    const matchesVault  = activeVault === 'Alle vaults' || c.vault === activeVault
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.username.toLowerCase().includes(search.toLowerCase())
    return matchesVault && matchesSearch
  })

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Loginoplysninger</h1>
          <p className={styles.pageSubtitle}>Administrér alle dine gemte logins, nøgler og hemmeligheder.</p>
        </div>
        <button className={styles.addBtn}>
          <IconPlus size={15} strokeWidth={2.5} />
          Tilføj loginoplysning
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <IconSearch size={14} className={styles.searchIcon} strokeWidth={2} />
          <input
            className={styles.searchInput}
            placeholder="Søg i loginoplysninger..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          {vaults.map((v) => (
            <button
              key={v}
              className={`${styles.filterBtn} ${activeVault === v ? styles.filterActive : ''}`}
              onClick={() => setVault(v)}
            >
              {v}
              {v !== 'Alle vaults' && (
                <span className={styles.filterCount}>
                  {allCredentials.filter((c) => c.vault === v).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <div className={styles.tableHead}>
          <span>Navn</span>
          <span>Brugernavn</span>
          <span>Vault</span>
          <span>Sidst opdateret <IconChevronDown size={11} strokeWidth={2} /></span>
          <span />
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>Ingen loginoplysninger matcher din søgning.</div>
        ) : (
          filtered.map((cred) => {
            const TypeIcon = typeIcon[cred.type] ?? IconLock
            return (
              <div key={cred.id} className={styles.tableRow}>
                <div className={styles.credName}>
                  <span className={styles.credIconWrap}>
                    <TypeIcon size={13} strokeWidth={1.75} />
                  </span>
                  <span>{cred.name}</span>
                </div>
                <span className={styles.credMeta}>{cred.username}</span>
                <span className={styles.vaultTag}>{cred.vault}</span>
                <span className={styles.credMeta}>{cred.updatedAt}</span>
                <button className={styles.dotsBtn}>
                  <IconDots size={15} strokeWidth={1.75} />
                </button>
              </div>
            )
          })
        )}
      </div>

      <p className={styles.count}>{filtered.length} loginoplysning{filtered.length !== 1 ? 'er' : ''}</p>
    </div>
  )
}
