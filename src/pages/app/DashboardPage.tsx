import {
  IconKey,
  IconShieldLock,
  IconUsers,
  IconAlertTriangle,
  IconPlus,
  IconWorld,
  IconServer,
  IconLock,
  IconArrowUp,
  IconArrowDown,
  IconMinus,
} from '@tabler/icons-react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import styles from './DashboardPage.module.css'

/* ── Placeholder data ── */

const stats = [
  { label: 'Loginoplysninger i alt', value: '24', icon: IconKey,           },
  { label: 'Aktive vaults',          value: '6',  icon: IconShieldLock,    },
  { label: 'Teammedlemmer',          value: '8',  icon: IconUsers,         },
  { label: 'Svage adgangskoder',     value: '3',  icon: IconAlertTriangle, warn: true },
]

const strengthData = [
  { name: 'Stærke',   value: 14, color: '#8BBF75' },
  { name: 'Middel',   value: 7,  color: '#d4a847' },
  { name: 'Svage',    value: 3,  color: '#e05c5c' },
]
const totalPasswords = strengthData.reduce((s, d) => s + d.value, 0)
const strongPct = Math.round((strengthData[0].value / totalPasswords) * 100)

const vaultDistribution = [
  { name: 'Engineering', value: 9,  color: '#8BBF75' },
  { name: 'Design',      value: 5,  color: '#4A8A40' },
  { name: 'Marketing',   value: 4,  color: '#3D7034' },
  { name: 'Finance',     value: 4,  color: '#2d5426' },
  { name: 'HR',          value: 2,  color: '#1e3a1a' },
]

const passwordAgeData = [
  { month: 'Nov', count: 3 },
  { month: 'Dec', count: 5 },
  { month: 'Jan', count: 8 },
  { month: 'Feb', count: 6 },
  { month: 'Mar', count: 11 },
  { month: 'Apr', count: 9 },
]

const topCredentials = [
  { name: 'GitHub',       vault: 'Engineering', accesses: 142, trend: 'up'   },
  { name: 'AWS Console',  vault: 'Engineering', accesses: 98,  trend: 'up'   },
  { name: 'Figma',        vault: 'Design',      accesses: 76,  trend: 'flat' },
  { name: 'Notion',       vault: 'Marketing',   accesses: 54,  trend: 'down' },
  { name: 'Stripe',       vault: 'Finance',     accesses: 41,  trend: 'up'   },
]

const topVaults = [
  { name: 'Engineering', credentials: 9,  members: 4 },
  { name: 'Design',      credentials: 5,  members: 3 },
  { name: 'Marketing',   credentials: 4,  members: 2 },
  { name: 'Finance',     credentials: 4,  members: 2 },
  { name: 'HR',          credentials: 2,  members: 1 },
]

const typeIcon: Record<string, typeof IconWorld> = {
  web: IconWorld, server: IconServer, other: IconLock,
}

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'up')   return <IconArrowUp   size={12} strokeWidth={2.5} className={styles.trendUp}   />
  if (trend === 'down') return <IconArrowDown size={12} strokeWidth={2.5} className={styles.trendDown} />
  return <IconMinus size={12} strokeWidth={2} className={styles.trendFlat} />
}

/* ── Custom tooltip ── */
const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipLabel}>{payload[0].name}</span>
      <span className={styles.tooltipValue}>{payload[0].value}</span>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Velkommen tilbage. Her er et overblik over din organisation.</p>
        </div>
        <button className={styles.addBtn}>
          <IconPlus size={15} strokeWidth={2.5} />
          Tilføj loginoplysning
        </button>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsRow}>
        {stats.map(({ label, value, icon: Icon, warn }) => (
          <div key={label} className={`${styles.statCard} ${warn ? styles.statCardWarn : ''}`}>
            <div className={`${styles.statIcon} ${warn ? styles.statIconWarn : ''}`}>
              <Icon size={15} strokeWidth={1.75} />
            </div>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Top 5 tables ── */}
      <div className={styles.tablesRow}>

        {/* Top credentials */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardEyebrow}>Brug</p>
              <h2 className={styles.cardTitle}>Mest brugte loginoplysninger</h2>
            </div>
          </div>
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <span>Navn</span>
              <span>Vault</span>
              <span style={{ textAlign: 'right' }}>Adgange</span>
            </div>
            {topCredentials.map((cred, i) => (
              <div key={cred.name} className={styles.tableRow}>
                <div className={styles.credName}>
                  <span className={styles.rankNum}>{i + 1}</span>
                  {cred.name}
                </div>
                <span className={styles.vaultTag}>{cred.vault}</span>
                <div className={styles.accessCell}>
                  <TrendIcon trend={cred.trend} />
                  <span>{cred.accesses}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top vaults */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardEyebrow}>Popularitet</p>
              <h2 className={styles.cardTitle}>Mest brugte vaults</h2>
            </div>
          </div>
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <span>Vault</span>
              <span style={{ textAlign: 'right' }}>Loginoplysninger</span>
              <span style={{ textAlign: 'right' }}>Medlemmer</span>
            </div>
            {topVaults.map((vault, i) => (
              <div key={vault.name} className={styles.tableRow}>
                <div className={styles.credName}>
                  <span className={styles.rankNum}>{i + 1}</span>
                  <span className={styles.vaultDot} style={{ background: vaultDistribution[i]?.color }} />
                  {vault.name}
                </div>
                <span className={styles.numCell}>{vault.credentials}</span>
                <span className={styles.numCell}>{vault.members}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Hurtige handlinger</h2>
        </div>
        <div className={styles.actions}>
          <button className={styles.actionCard}>
            <IconKey size={18} strokeWidth={1.5} className={styles.actionIcon} />
            <span className={styles.actionLabel}>Tilføj loginoplysning</span>
            <span className={styles.actionDesc}>Gem et nyt login, nøgle eller hemmelighed</span>
          </button>
          <button className={styles.actionCard}>
            <IconShieldLock size={18} strokeWidth={1.5} className={styles.actionIcon} />
            <span className={styles.actionLabel}>Opret vault</span>
            <span className={styles.actionDesc}>Gruppér loginoplysninger efter team eller projekt</span>
          </button>
          <button className={styles.actionCard}>
            <IconUsers size={18} strokeWidth={1.5} className={styles.actionIcon} />
            <span className={styles.actionLabel}>Invitér medlem</span>
            <span className={styles.actionDesc}>Bring dit team ind i organisationen</span>
          </button>
        </div>
      </div>

    </div>
  )
}
