import { IconDots } from '@tabler/icons-react'
import styles from './VaultMockup.module.css'

const credentials = [
  { letter: 'G', name: 'Google Workspace', sub: 'admin@company.com',     color: '#2B6CB0' },
  { letter: 'A', name: 'AWS Console',       sub: 'Production keys',       color: '#B7791F' },
  { letter: 'G', name: 'GitHub',            sub: '@engineering',          color: '#2D3748' },
  { letter: 'S', name: 'Stripe',            sub: 'API keys · Production', color: '#553C9A' },
  { letter: 'N', name: 'Notion',            sub: 'team@company.com',      color: '#3D5A80' },
]

export default function VaultMockup() {
  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.vaultLabel}>VAULT</span>
        <span className={styles.secureBadge}>
          <span className={styles.dot} />
          Secure
        </span>
      </div>

      {/* Credential rows */}
      <div className={styles.list}>
        {credentials.map((cred, i) => (
          <div key={i} className={styles.row}>
            <div className={styles.avatar} style={{ background: cred.color }}>
              {cred.letter}
            </div>
            <div className={styles.info}>
              <span className={styles.credName}>{cred.name}</span>
              <span className={styles.credSub}>{cred.sub}</span>
            </div>
            <IconDots size={14} className={styles.dots} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.footerMeta}>5 items · AES-256</span>
        <span className={styles.syncedBadge}>
          <span className={styles.dotGreen} />
          All synced
        </span>
      </div>
    </div>
  )
}
