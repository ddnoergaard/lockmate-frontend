import { useState } from 'react'
import {
  IconPlus,
  IconSearch,
  IconWorld,
  IconServer,
  IconLock,
  IconDots,
  IconShieldLock,
  IconChevronDown,
  IconChevronRight,
} from '@tabler/icons-react'
import styles from './VaultPage.module.css'

const vaultData = [
  {
    name: 'Engineering',
    members: 4,
    credentials: [
      { id: 1,  name: 'GitHub',       username: 'daniel@acme.com',  type: 'web',    updatedAt: 'Today'       },
      { id: 2,  name: 'AWS Console',  username: 'admin@acme.com',   type: 'server', updatedAt: '2 days ago'  },
      { id: 6,  name: 'Vercel',       username: 'deploy@acme.com',  type: 'web',    updatedAt: '2 weeks ago' },
      { id: 7,  name: 'Linear',       username: 'pm@acme.com',      type: 'web',    updatedAt: '2 weeks ago' },
      { id: 9,  name: 'Postgres DB',  username: 'db_admin',         type: 'server', updatedAt: '3 weeks ago' },
      { id: 12, name: 'Cloudflare',   username: 'ops@acme.com',     type: 'server', updatedAt: '1 month ago' },
    ],
  },
  {
    name: 'Design',
    members: 3,
    credentials: [
      { id: 3,  name: 'Figma',        username: 'design@acme.com',  type: 'web',    updatedAt: '5 days ago'  },
    ],
  },
  {
    name: 'Marketing',
    members: 2,
    credentials: [
      { id: 4,  name: 'Notion',           username: 'team@acme.com',       type: 'web', updatedAt: '1 week ago'  },
      { id: 8,  name: 'Google Analytics', username: 'marketing@acme.com',  type: 'web', updatedAt: '3 weeks ago' },
      { id: 11, name: 'Slack',            username: 'team@acme.com',        type: 'web', updatedAt: '1 month ago' },
    ],
  },
  {
    name: 'Finance',
    members: 2,
    credentials: [
      { id: 5,  name: 'Stripe',  username: 'finance@acme.com',  type: 'web', updatedAt: '1 week ago'  },
      { id: 10, name: 'Xero',    username: 'accounts@acme.com', type: 'web', updatedAt: '1 month ago' },
    ],
  },
  {
    name: 'HR',
    members: 1,
    credentials: [],
  },
]

const typeIcon: Record<string, typeof IconWorld> = {
  web: IconWorld, server: IconServer, other: IconLock,
}

function VaultSection({ vault, search }: { vault: typeof vaultData[0]; search: string }) {
  const [collapsed, setCollapsed] = useState(false)

  const filtered = vault.credentials.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase())
  )

  if (search && filtered.length === 0) return null

  return (
    <div className={styles.vaultSection}>
      <button className={styles.vaultHeader} onClick={() => setCollapsed((c) => !c)}>
        <div className={styles.vaultHeaderLeft}>
          {collapsed
            ? <IconChevronRight size={14} strokeWidth={2} className={styles.chevron} />
            : <IconChevronDown  size={14} strokeWidth={2} className={styles.chevron} />
          }
          <IconShieldLock size={15} strokeWidth={1.75} className={styles.vaultIcon} />
          <span className={styles.vaultName}>{vault.name}</span>
          <span className={styles.vaultMeta}>{vault.credentials.length} loginoplysning{vault.credentials.length !== 1 ? 'er' : ''}</span>
          <span className={styles.vaultMeta}>{vault.members} medlem{vault.members !== 1 ? 'mer' : ''}</span>
        </div>
        <button className={styles.addVaultBtn} onClick={(e) => e.stopPropagation()}>
          <IconPlus size={13} strokeWidth={2.5} />
          Tilføj
        </button>
      </button>

      {!collapsed && (
        <div className={styles.credList}>
          {filtered.length === 0 ? (
            <div className={styles.emptyVault}>Ingen loginoplysninger i denne vault endnu.</div>
          ) : (
            filtered.map((cred) => {
              const TypeIcon = typeIcon[cred.type] ?? IconLock
              return (
                <div key={cred.id} className={styles.credRow}>
                  <div className={styles.credName}>
                    <span className={styles.credIconWrap}>
                      <TypeIcon size={13} strokeWidth={1.75} />
                    </span>
                    <span>{cred.name}</span>
                  </div>
                  <span className={styles.credMeta}>{cred.username}</span>
                  <span className={styles.credMeta}>{cred.updatedAt}</span>
                  <button className={styles.dotsBtn}>
                    <IconDots size={15} strokeWidth={1.75} />
                  </button>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

export default function VaultPage() {
  const [search, setSearch] = useState('')

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Vault</h1>
          <p className={styles.pageSubtitle}>Loginoplysninger organiseret efter team og projekt.</p>
        </div>
        <button className={styles.addBtn}>
          <IconPlus size={15} strokeWidth={2.5} />
          Opret vault
        </button>
      </div>

      {/* ── Search ── */}
      <div className={styles.searchWrap}>
        <IconSearch size={14} className={styles.searchIcon} strokeWidth={2} />
        <input
          className={styles.searchInput}
          placeholder="Søg på tværs af alle vaults..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Vault sections ── */}
      <div className={styles.vaults}>
        {vaultData.map((vault) => (
          <VaultSection key={vault.name} vault={vault} search={search} />
        ))}
      </div>
    </div>
  )
}
