import { useState, useRef, useEffect } from 'react'
import {
  IconBuilding,
  IconKey,
  IconShieldLock,
  IconUsers,
  IconCreditCard,
  IconCalendar,
  IconArrowRight,
  IconCheck,
  IconRefresh,
  IconCrown,
  IconUser,
  IconDotsVertical,
  IconPencil,
  IconUserX,
  IconMail,
  IconPhone,
  IconReceiptTax,
  IconCopy,
  IconX,
} from '@tabler/icons-react'
import styles from './OrganisationPage.module.css'
import { Link } from 'react-router-dom'
import { useOrgStats } from '../../contexts/OrgStatsContext'
import { getTokenPayload } from '../../utils/fetchOrgId'
import { API_BASE } from '../../config'

const org = {
  name: 'Acme Corp',
  slug: 'acme-corp',
  email: 'admin@acme.com',
  phone: '+45 12 34 56 78',
  vatNumber: 'DK12345678',
  isPersonal: false,
  invitationCode: 'LH-ACME-7X4K2',
  createdAt: '12. januar 2025',
  plan: 'Vækst',
  billingCycle: 'Månedlig',
  nextRenewal: '13. maj 2025',
  cycleReset: '13. maj 2025',
  pricePerMonth: '129 kr',
  seats: { used: 8, limit: 10 },
  credentials: { used: 24, limit: 1000 },
  vaults: { used: 6, limit: null },
}

const planFeatures: Record<string, string[]> = {
  Starter: [
    'Op til 5 brugere',
    'Ubegrænsede loginoplysninger',
    'Ubegrænsede enheder',
    'AES-256 kryptering',
    'Adgangskodegenerator',
    'Sikker deling',
    'Browserudvidelse',
  ],
  Growth: [
    'Op til 15 brugere',
    'Ubegrænsede loginoplysninger',
    'Alt i Starter',
    'Brud-overvågning',
    'Prioriteret support',
  ],
  Scale: [
    'Op til 50 brugere',
    'Ubegrænsede loginoplysninger',
    'Alt i Growth',
    'Revisionslogge',
    'Dedikeret support',
  ],
}

const initialRequests: { name: string; email: string; requestedAt: string }[] = []

interface Member {
  userId: number
  name:   string
  email:  string
  role:   string
  joined: string
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function UsageBar({ used, limit, label, unit = '' }: { used: number; limit: number | null; label: string; unit?: string }) {
  const pct = limit ? Math.round((used / limit) * 100) : 0
  const warn = pct >= 80

  return (
    <div className={styles.usageRow}>
      <div className={styles.usageLabel}>
        <span className={styles.usageName}>{label}</span>
        <span className={styles.usageCount}>
          {used}{unit}{limit ? ` / ${limit}${unit}` : ' (ubegrænset)'}
        </span>
      </div>
      {limit && (
        <div className={styles.usageTrack}>
          <div
            className={`${styles.usageFill} ${warn ? styles.usageFillWarn : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  )
}

function AccessRequests() {
  const [requests, setRequests] = useState(initialRequests)

  function approve(email: string) {
    setRequests(r => r.filter(x => x.email !== email))
  }

  function deny(email: string) {
    setRequests(r => r.filter(x => x.email !== email))
  }

  return (
    <div className={styles.requestsCard}>
      <div className={styles.membersHeader}>
        <div>
          <p className={styles.cardEyebrow}>Afventer</p>
          <h2 className={styles.cardTitle}>Adgangsanmodninger</h2>
        </div>
        {requests.length > 0 && <span className={styles.requestsBadge}>{requests.length}</span>}
      </div>

      {requests.length === 0 ? (
        <p className={styles.emptyTableText}>Ingen nye anmodninger</p>
      ) : (
      <div className={styles.memberTable}>
        <div className={styles.requestTableHead}>
          <span>Anmoder</span>
          <span>Anmodet</span>
          <span />
        </div>
        {requests.map((r) => (
          <div key={r.email} className={styles.requestRow}>
            <div className={styles.memberInfo}>
              <div className={styles.memberAvatar}>{initials(r.name)}</div>
              <div className={styles.memberMeta}>
                <span className={styles.memberName}>{r.name}</span>
                <span className={styles.memberEmail}>{r.email}</span>
              </div>
            </div>
            <span className={styles.requestedAt}>{r.requestedAt}</span>
            <div className={styles.requestActions}>
              <button className={styles.approveBtn} onClick={() => approve(r.email)}>
                <IconCheck size={13} strokeWidth={2.5} />
                Godkend
              </button>
              <button className={styles.denyBtn} onClick={() => deny(r.email)}>
                <IconX size={13} strokeWidth={2.5} />
                Afvis
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}

function InviteCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.inviteCard}>
      <div>
        <p className={styles.cardEyebrow}>Invitér</p>
        <h2 className={styles.cardTitle}>Invitationskode</h2>
        <p className={styles.inviteDesc}>Del denne kode med folk du ønsker skal tilmelde sig din organisation.</p>
      </div>
      <div className={styles.inviteRow}>
        <div className={styles.inviteCodeBox}>
          <span className={styles.inviteCode}>{code}</span>
        </div>
        <button className={styles.inviteCopyBtn} onClick={copy}>
          {copied
            ? <><IconCheck size={14} strokeWidth={2.5} /> Kopieret</>
            : <><IconCopy size={14} strokeWidth={1.75} /> Kopiér</>
          }
        </button>
      </div>
    </div>
  )
}

function MemberMenu({ isSelf }: { isSelf: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  if (isSelf) return null

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div className={styles.memberMenuWrap} ref={ref}>
      <button
        className={`${styles.memberMenuBtn} ${open ? styles.memberMenuBtnActive : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-label="Member actions"
      >
        <IconDotsVertical size={15} strokeWidth={1.75} />
      </button>
      {open && (
        <div className={styles.memberDropdown}>
          <button className={styles.memberDropdownItem} onClick={() => setOpen(false)}>
            <IconPencil size={13} strokeWidth={1.75} />
            Rediger rolle
          </button>
          <div className={styles.memberDropdownDivider} />
          <button className={`${styles.memberDropdownItem} ${styles.memberDropdownItemDanger}`} onClick={() => setOpen(false)}>
            <IconUserX size={13} strokeWidth={1.75} />
            Fjern medlem
          </button>
        </div>
      )}
    </div>
  )
}

interface OrgData {
  name:           string
  vatNumber:      string | null
  email:          string | null
  phone:          string | null
  createdAt:      string
  invitationCode: string
  subscriptionId: number
}

interface SubInfo {
  name:         string
  price:        number
  userCapacity: number
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function OrganisationPage() {
  const { credentialCount, vaultCount, memberCount, orgId } = useOrgStats()
  const hasOrg = !!orgId
  const payload = getTokenPayload()
  const role = payload.role
  const currentUserId = payload.userId ? Number(payload.userId) : null
  const canManageRequests = role === 'Admin' || role === 'Owner'
  const [orgData, setOrgData] = useState<OrgData | null>(null)
  const [subInfo, setSubInfo] = useState<SubInfo | null>(null)
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    if (!hasOrg) return
    const token = localStorage.getItem('token') ?? ''
    fetch(`${API_BASE}/api/organisation/get-org-members-for-table`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then((data: Member[]) => setMembers(data))
      .catch(() => {})
  }, [hasOrg])

  useEffect(() => {
    if (!hasOrg) return
    const token = localStorage.getItem('token') ?? ''
    fetch(`${API_BASE}/api/organisation/current-org-data`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then((data: OrgData | null) => {
        if (!data) return
        setOrgData(data)
        return fetch(`${API_BASE}/api/subscription/sub-info?subId=${data.subscriptionId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
      })
      .then(r => r && r.ok ? r.json() : null)
      .then((data: SubInfo | null) => { if (data) setSubInfo(data) })
      .catch(() => {})
  }, [hasOrg])

  if (!hasOrg) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Organisation</h1>
            <p className={styles.pageSubtitle}>Oversigt over din organisation, plan og forbrug.</p>
          </div>
        </div>
        <div className={styles.emptyState}>
          <IconBuilding size={32} strokeWidth={1.25} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>Ingen organisation endnu</h2>
          <p className={styles.emptyDesc}>
            Du er ikke tilknyttet nogen organisation. Opret en ny eller tilslut dig en eksisterende for at komme i gang.
          </p>
          <Link to="/app/organisation/setup" className={styles.emptyBtn}>
            Opret organisation
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Organisation</h1>
          <p className={styles.pageSubtitle}>Oversigt over din organisation, plan og forbrug.</p>
        </div>
      </div>

      {/* ── Org identity ── */}
      <div className={styles.orgCard}>
        <div className={styles.orgCardTop}>
          <div className={styles.orgAvatar}>
            <IconBuilding size={22} strokeWidth={1.5} />
          </div>
          <div className={styles.orgInfo}>
            <div className={styles.orgNameRow}>
              <h2 className={styles.orgName}>{orgData?.name ?? org.name}</h2>
            </div>
          </div>
        </div>
        <div className={styles.orgMetas}>
          <div className={styles.orgMetaItem}>
            <IconCalendar size={13} strokeWidth={1.75} className={styles.orgMetaIcon} />
            Oprettet {orgData ? formatDate(orgData.createdAt) : org.createdAt}
          </div>
          <div className={styles.orgMetaItem}>
            <IconMail size={13} strokeWidth={1.75} className={styles.orgMetaIcon} />
            {orgData ? (orgData.email ?? 'N/A') : org.email}
          </div>
          <div className={styles.orgMetaItem}>
            <IconReceiptTax size={13} strokeWidth={1.75} className={styles.orgMetaIcon} />
            {orgData ? (orgData.vatNumber ?? 'N/A') : org.vatNumber}
          </div>
          <div className={styles.orgMetaItem}>
            <IconPhone size={13} strokeWidth={1.75} className={styles.orgMetaIcon} />
            {orgData ? (orgData.phone ?? 'N/A') : org.phone}
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className={styles.statsRow}>
        {[
          { icon: IconKey,        label: 'Loginoplysninger', value: credentialCount ?? org.credentials.used },
          { icon: IconShieldLock, label: 'Vaults',           value: vaultCount      ?? org.vaults.used      },
          { icon: IconUsers,      label: 'Medlemmer',        value: memberCount     ?? org.seats.used       },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className={styles.statCard}>
            <div className={styles.statIcon}><Icon size={15} strokeWidth={1.75} /></div>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      <div className={styles.bottomGrid}>

        {/* ── Subscription ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardEyebrow}>Fakturering</p>
              <h2 className={styles.cardTitle}>Nuværende plan</h2>
            </div>
            <span className={styles.planBadge}>{subInfo?.name ?? org.plan}</span>
          </div>

          <div className={styles.planDetails}>
            <div className={styles.planPrice}>
              <span className={styles.planAmount}>{subInfo ? `${subInfo.price} kr` : org.pricePerMonth}</span>
              <span className={styles.planPer}> / md.</span>
            </div>
            <div className={styles.planMeta}>
              <div className={styles.planMetaRow}>
                <IconCreditCard size={13} strokeWidth={1.75} className={styles.planMetaIcon} />
                {org.billingCycle} fakturering
              </div>
              <div className={styles.planMetaRow}>
                <IconCalendar size={13} strokeWidth={1.75} className={styles.planMetaIcon} />
                Fornyes {org.nextRenewal}
              </div>
            </div>
          </div>

          <div className={styles.planFeatures}>
            {(planFeatures[subInfo?.name ?? ''] ?? []).map((f) => (
              <div key={f} className={styles.planFeatureRow}>
                <IconCheck size={13} strokeWidth={2.5} className={styles.planCheck} />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <div className={styles.planActions}>
            <button className={styles.upgradeBtn}>
              Opgrader plan <IconArrowRight size={14} strokeWidth={2} />
            </button>
            <button className={styles.manageBtn}>Administrer fakturering</button>
          </div>
        </div>

        {/* ── Usage ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardEyebrow}>Grænser</p>
              <h2 className={styles.cardTitle}>Planforbrug</h2>
            </div>
          </div>

          <div className={styles.usageList}>
            <UsageBar label="Pladser"          used={memberCount ?? org.seats.used} limit={subInfo?.userCapacity ?? org.seats.limit} />
            <UsageBar label="Loginoplysninger" used={org.credentials.used} limit={org.credentials.limit} />
            <UsageBar label="Vaults"           used={org.vaults.used}      limit={org.vaults.limit}      />
          </div>

          <div className={styles.usageCycle}>
            <div className={styles.usageCycleRow}>
              <IconRefresh size={13} strokeWidth={1.75} className={styles.usageCycleIcon} />
              <span>Forbrug nulstilles den <strong>{org.cycleReset}</strong></span>
            </div>
          </div>

          <div className={styles.usageNote}>
            <span className={styles.usageNoteText}>
              {((subInfo?.userCapacity ?? org.seats.limit) - (memberCount ?? org.seats.used))} plads{((subInfo?.userCapacity ?? org.seats.limit) - (memberCount ?? org.seats.used)) !== 1 ? 'er' : ''} tilbage på din nuværende plan.
            </span>
          </div>

          <div className={styles.planActions}>
            <button className={styles.manageBtn}>Se alle grænser</button>
          </div>
        </div>

      </div>

      {/* ── Invite code ── */}
      <InviteCode code={orgData?.invitationCode ?? org.invitationCode} />

      {/* ── Access requests ── */}
      {canManageRequests && <AccessRequests />}

      {/* ── Members ── */}
      <div className={styles.membersCard}>
        <div className={styles.membersHeader}>
          <div>
            <p className={styles.cardEyebrow}>Team</p>
            <h2 className={styles.cardTitle}>Medlemmer</h2>
          </div>
        </div>

        <div className={styles.memberTable}>
          <div className={styles.memberTableHead}>
            <span>Medlem</span>
            <span>Rolle</span>
            <span>Tilmeldt</span>
            {canManageRequests && <span />}
          </div>
          {members.map((m) => (
            <div key={m.email} className={styles.memberRow}>
              <div className={styles.memberInfo}>
                <div className={styles.memberAvatar}>{initials(m.name)}</div>
                <div className={styles.memberMeta}>
                  <span className={styles.memberName}>{m.name}</span>
                  <span className={styles.memberEmail}>{m.email}</span>
                </div>
              </div>
              <div className={`${styles.memberRole} ${m.role === 'Admin' ? styles.memberRoleAdmin : ''}`}>
                {m.role === 'Admin'
                  ? <IconCrown size={11} strokeWidth={2} />
                  : <IconUser  size={11} strokeWidth={1.75} />
                }
                {m.role}
              </div>
              <span className={styles.memberJoined}>{formatDate(m.joined)}</span>
              {canManageRequests && <MemberMenu isSelf={m.userId === currentUserId} />}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
