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
  IconUser,
  IconDotsVertical,
  IconPencil,
  IconUserX,
  IconMail,
  IconPhone,
  IconReceiptTax,
  IconCopy,
  IconX,
  IconArrowsExchange,
  IconSearch,
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

interface AccessRequest {
  id:          number
  fullname:    string
  email:       string
  requestedAt: string
}

interface Member {
  id:        number
  fullname:  string | null
  email:     string
  role:      string
  createdAt: string
}

function initials(name: string | null | undefined) {
  if (!name) return '?'
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

function ConfirmApproveModal({ request, onConfirm, onCancel }: { request: AccessRequest; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalIcon} style={{ background: 'var(--accent-subtle)', borderColor: 'var(--accent-border)', color: 'var(--accent-light)' }}>
          <IconCheck size={20} strokeWidth={2} />
        </div>
        <h2 className={styles.modalTitle}>Godkend {request.fullname}?</h2>
        <p className={styles.modalDesc}>
          {request.fullname} får adgang til organisationen og dens vaults.
        </p>
        <div className={styles.modalActions}>
          <button className={styles.modalCancelBtn} onClick={onCancel}>Annuller</button>
          <button className={styles.modalConfirmBtn} style={{ background: 'var(--accent)' }} onClick={onConfirm}>
            <IconCheck size={14} strokeWidth={2.5} />
            Godkend
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfirmDenyModal({ request, onConfirm, onCancel }: { request: AccessRequest; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalIcon}>
          <IconX size={20} strokeWidth={2} />
        </div>
        <h2 className={styles.modalTitle}>Afvis {request.fullname}?</h2>
        <p className={styles.modalDesc}>
          {request.fullname} vil ikke få adgang til organisationen.
        </p>
        <div className={styles.modalActions}>
          <button className={styles.modalCancelBtn} onClick={onCancel}>Annuller</button>
          <button className={styles.modalConfirmBtn} onClick={onConfirm}>
            <IconX size={14} strokeWidth={2} />
            Afvis
          </button>
        </div>
      </div>
    </div>
  )
}

function AccessRequests({ canManage }: { canManage: boolean }) {
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingApprove, setPendingApprove] = useState<AccessRequest | null>(null)
  const [pendingDeny, setPendingDeny] = useState<AccessRequest | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token') ?? ''
    fetch(`${API_BASE}/api/organisation/get-user-access-request`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then((data: AccessRequest[]) => setRequests(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleRequest(userId: number, grantedAccess: boolean) {
    const token = localStorage.getItem('token') ?? ''
    fetch(`${API_BASE}/api/organisation/handle-access-request`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, grantedAccess }),
    })
      .then(r => { if (r.ok) setRequests(prev => prev.filter(r => r.id !== userId)) })
      .catch(() => {})
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

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skel h={13} />
          <Skel w="60%" h={13} />
        </div>
      ) : requests.length === 0 ? (
        <p className={styles.emptyTableText}>Ingen nye anmodninger</p>
      ) : (
        <div className={styles.memberTable}>
          <div className={styles.requestTableHead}>
            <span>Anmoder</span>
            <span>Anmodet</span>
            {canManage && <span />}
          </div>
          {requests.map(r => (
            <div key={r.id} className={canManage ? styles.requestRow : styles.requestRowReadOnly}>
              <div className={styles.memberInfo}>
                <div className={styles.memberAvatar}>{initials(r.fullname)}</div>
                <div className={styles.memberMeta}>
                  <span className={styles.memberName}>{r.fullname}</span>
                  <span className={styles.memberEmail}>{r.email}</span>
                </div>
              </div>
              <span className={styles.requestedAt}>{formatDate(r.requestedAt)}</span>
              {canManage && (
                <div className={styles.requestActions}>
                  <button className={styles.approveBtn} onClick={() => setPendingApprove(r)}>
                    <IconCheck size={13} strokeWidth={2.5} />
                    Godkend
                  </button>
                  <button className={styles.denyBtn} onClick={() => setPendingDeny(r)}>
                    <IconX size={13} strokeWidth={2.5} />
                    Afvis
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {pendingApprove && (
        <ConfirmApproveModal
          request={pendingApprove}
          onConfirm={() => { handleRequest(pendingApprove.id, true); setPendingApprove(null) }}
          onCancel={() => setPendingApprove(null)}
        />
      )}
      {pendingDeny && (
        <ConfirmDenyModal
          request={pendingDeny}
          onConfirm={() => { handleRequest(pendingDeny.id, false); setPendingDeny(null) }}
          onCancel={() => setPendingDeny(null)}
        />
      )}
    </div>
  )
}

function InviteCode({ code, onRegenerate }: { code: string; onRegenerate?: () => Promise<() => void> }) {
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [cooldown, setCooldown] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function regen() {
    if (!onRegenerate || regenerating || cooldown) return
    setRegenerating(true)
    const commit = await onRegenerate()
    setRegenerating(false)
    setCooldown(true)
    setTimeout(() => {
      commit()
      setCooldown(false)
    }, 1000)
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
        <button className={styles.inviteCopyBtn} onClick={copy} disabled={regenerating}>
          {copied
            ? <><IconCheck size={14} strokeWidth={2.5} /> Kopieret</>
            : <><IconCopy size={14} strokeWidth={1.75} /> Kopiér</>
          }
        </button>
        {onRegenerate && (
          <button className={styles.inviteRegenBtn} onClick={regen} disabled={regenerating || cooldown}>
            <IconRefresh size={14} strokeWidth={1.75} className={(regenerating || cooldown) ? styles.spinning : undefined} />
            {(regenerating || cooldown) ? 'Genererer...' : 'Ny kode'}
          </button>
        )}
      </div>
    </div>
  )
}

function MemberMenu({ isSelf, role, onRemove, onChangeRole }: { isSelf: boolean; role: string; onRemove: () => void; onChangeRole: () => void }) {
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
          <button className={styles.memberDropdownItem} onClick={() => { setOpen(false); onChangeRole() }}>
            <IconPencil size={13} strokeWidth={1.75} />
            {role === 'Admin' ? 'Gør til Medlem' : 'Gør til Admin'}
          </button>
          <div className={styles.memberDropdownDivider} />
          <button
            className={`${styles.memberDropdownItem} ${styles.memberDropdownItemDanger}`}
            onClick={() => { setOpen(false); onRemove() }}
          >
            <IconUserX size={13} strokeWidth={1.75} />
            Fjern medlem
          </button>
        </div>
      )}
    </div>
  )
}

function ConfirmRemoveModal({ member, onConfirm, onCancel }: { member: Member; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalIcon}>
          <IconUserX size={20} strokeWidth={1.75} />
        </div>
        <h2 className={styles.modalTitle}>Fjern {member.fullname ?? member.email} fra organisationen?</h2>
        <p className={styles.modalDesc}>
          {member.fullname ?? member.email} vil miste adgang til alle vaults og loginoplysninger i organisationen. Denne handling kan ikke fortrydes.
        </p>
        <div className={styles.modalActions}>
          <button className={styles.modalCancelBtn} onClick={onCancel}>Annuller</button>
          <button className={styles.modalConfirmBtn} onClick={onConfirm}>
            <IconUserX size={14} strokeWidth={2} />
            Fjern medlem
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfirmRoleModal({ member, onConfirm, onCancel }: { member: Member; onConfirm: () => void; onCancel: () => void }) {
  const newRole = member.role === 'Admin' ? 'Medlem' : 'Admin'
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalIcon} style={{ background: 'var(--accent-subtle)', borderColor: 'var(--accent-border)', color: 'var(--accent-light)' }}>
          <IconPencil size={20} strokeWidth={1.75} />
        </div>
        <h2 className={styles.modalTitle}>Gør {member.fullname ?? member.email} til {newRole}?</h2>
        <p className={styles.modalDesc}>
          Dette ændrer {member.fullname ?? member.email}s adgangsniveau i organisationen.
        </p>
        <div className={styles.modalActions}>
          <button className={styles.modalCancelBtn} onClick={onCancel}>Annuller</button>
          <button className={styles.modalConfirmBtn} style={{ background: 'var(--accent)' }} onClick={onConfirm}>
            Bekræft
          </button>
        </div>
      </div>
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

function Skel({ w, h = 14, r = 5 }: { w?: number | string; h?: number; r?: number }) {
  return <div className={styles.skel} style={{ width: w, height: h, borderRadius: r }} />
}

function PageSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skel w={160} h={24} r={6} />
          <Skel w={280} h={14} />
        </div>
      </div>

      <div className={styles.orgCard}>
        <div className={styles.orgCardTop}>
          <Skel w={44} h={44} r={10} />
          <Skel w={150} h={16} />
        </div>
        <div className={styles.orgMetas}>
          {[140, 160, 120, 150].map((w, i) => <Skel key={i} w={w} h={13} />)}
        </div>
      </div>

      <div className={styles.statsRow}>
        {[0, 1, 2].map(i => (
          <div key={i} className={styles.statCard}>
            <Skel w={30} h={30} r={8} />
            <Skel w={50} h={28} r={6} />
            <Skel w={90} h={12} />
          </div>
        ))}
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Skel w={70} h={11} />
              <Skel w={120} h={14} />
            </div>
            <Skel w={60} h={22} r={6} />
          </div>
          <Skel w={110} h={36} r={6} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[0, 1, 2, 3].map(i => <Skel key={i} h={13} />)}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Skel w={120} h={34} r={8} />
            <Skel w={160} h={34} r={8} />
          </div>
        </div>
        <div className={styles.card}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skel w={70} h={11} />
            <Skel w={100} h={14} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skel w={60} h={13} /><Skel w={50} h={13} />
            </div>
            <Skel h={5} r={3} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skel h={13} /><Skel h={13} />
          </div>
          <Skel h={40} r={8} />
        </div>
      </div>

      <div className={styles.membersCard}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skel w={50} h={11} />
          <Skel w={100} h={14} />
        </div>
        <div className={styles.memberTable}>
          {[0, 1, 2].map(i => (
            <div key={i} className={styles.memberRow}>
              <div className={styles.memberInfo}>
                <Skel w={32} h={32} r={8} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <Skel w={130} h={13} />
                  <Skel w={170} h={11} />
                </div>
              </div>
              <Skel w={60} h={13} />
              <Skel w={90} h={13} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.inviteCard}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skel w={50} h={11} />
            <Skel w={120} h={14} />
            <Skel w={240} h={12} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <Skel w={160} h={36} r={8} />
            <Skel w={80} h={36} r={8} />
          </div>
        </div>
        <div className={styles.requestsCard}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skel w={60} h={11} />
            <Skel w={160} h={14} />
          </div>
          <Skel w={160} h={13} />
        </div>
      </div>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })
}

function TransferOwnership({ members, currentUserId }: { members: Member[]; currentUserId: number | null }) {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const eligible = members.filter(m => m.id !== currentUserId)

  return (
    <div className={styles.transferCard}>
      <div>
        <p className={styles.cardEyebrow}>Ejerskab</p>
        <h2 className={styles.cardTitle}>Overfør ejerskab</h2>
      </div>
      <p className={styles.transferDesc}>
        Overdrag ejerskabet af organisationen til et andet medlem. Du mister adgang til denne sektion og kan ikke fortryde handlingen.
      </p>
      <div className={styles.transferRow}>
        <select
          className={styles.transferSelect}
          value={selectedId ?? ''}
          onChange={e => setSelectedId(Number(e.target.value) || null)}
        >
          <option value="">Vælg nyt ejer...</option>
          {eligible.map(m => (
            <option key={m.id} value={m.id}>{m.fullname ?? m.email}</option>
          ))}
        </select>
        <button className={styles.transferBtn} disabled={!selectedId}>
          <IconArrowsExchange size={14} strokeWidth={2} />
          Overfør ejerskab
        </button>
      </div>
    </div>
  )
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
  const [loading, setLoading] = useState(true)
  const [pendingRemove, setPendingRemove] = useState<Member | null>(null)
  const [pendingRoleChange, setPendingRoleChange] = useState<Member | null>(null)
  const [memberSearch, setMemberSearch] = useState('')
  const [memberRoleFilter, setMemberRoleFilter] = useState('')

  async function handleRegenerate(): Promise<() => void> {
    const token = localStorage.getItem('token') ?? ''
    const res = await fetch(`${API_BASE}/api/organisation/update-invitecode`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (!res.ok) return () => {}
    const data: OrgData | null = await fetch(`${API_BASE}/api/organisation/current-org-data`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(r => r.ok ? r.json() : null)
    return () => { if (data) setOrgData(data) }
  }

  const filteredMembers = [...members]
    .sort((a, b) => {
      const order: Record<string, number> = { Owner: 0, Admin: 1 }
      return (order[a.role] ?? 2) - (order[b.role] ?? 2)
    })
    .filter(m => {
      const q = memberSearch.toLowerCase()
      const matchesSearch = !q ||
        (m.fullname?.toLowerCase().includes(q) ?? false) ||
        m.email.toLowerCase().includes(q)
      const matchesRole = !memberRoleFilter || m.role === memberRoleFilter
      return matchesSearch && matchesRole
    })

  useEffect(() => {
    if (!hasOrg) { setLoading(false); return }
    const token = localStorage.getItem('token') ?? ''

    const membersPromise = fetch(`${API_BASE}/api/organisation/get-org-members-for-table`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then((data: Member[]) => setMembers(data))

    const orgPromise = fetch(`${API_BASE}/api/organisation/current-org-data`, {
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

    Promise.all([membersPromise, orgPromise])
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [hasOrg])

  if (loading) return <PageSkeleton />

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
            Du er ikke tilknyttet nogen organisation. Opret en ny eller tilslut dig en eksisterende for at komme i gang
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
            <UsageBar label="Pladser" used={memberCount ?? org.seats.used} limit={subInfo?.userCapacity ?? org.seats.limit} />
          </div>
          <div className={styles.unlimitedList}>
            <div className={styles.unlimitedItem}>
              <IconCheck size={13} strokeWidth={2.5} className={styles.planCheck} />
              Ubegrænsede loginoplysninger
            </div>
            <div className={styles.unlimitedItem}>
              <IconCheck size={13} strokeWidth={2.5} className={styles.planCheck} />
              Ubegrænsede vaults
            </div>
          </div>

          <div className={styles.usageCycle}>
            <div className={styles.usageCycleRow}>
              <IconRefresh size={13} strokeWidth={1.75} className={styles.usageCycleIcon} />
              <span>Forbrug nulstilles den <strong>{org.cycleReset}</strong></span>
            </div>
          </div>

          {(() => {
            const remaining = (subInfo?.userCapacity ?? org.seats.limit) - (memberCount ?? org.seats.used)
            return (
              <div className={styles.usageNote}>
                <span className={styles.usageNoteText}>
                  {remaining} plads{remaining !== 1 ? 'er' : ''} tilbage på din nuværende plan.
                </span>
              </div>
            )
          })()}

          <div className={styles.planActions}>
            <button className={styles.manageBtn}>Se alle grænser</button>
          </div>
        </div>

      </div>

      {/* ── Members ── */}
      <div className={styles.membersCard}>
        <div className={styles.membersHeader}>
          <div>
            <p className={styles.cardEyebrow}>Team</p>
            <h2 className={styles.cardTitle}>Medlemmer</h2>
          </div>
        </div>

        <div className={styles.memberControls}>
          <div className={styles.memberSearchWrap}>
            <IconSearch size={13} strokeWidth={1.75} className={styles.memberSearchIcon} />
            <input
              className={styles.memberSearchInput}
              placeholder="Søg på navn eller e-mail..."
              value={memberSearch}
              onChange={e => setMemberSearch(e.target.value)}
            />
          </div>
          <select
            className={styles.memberRoleSelect}
            value={memberRoleFilter}
            onChange={e => setMemberRoleFilter(e.target.value)}
          >
            <option value="">Alle roller</option>
            <option value="Owner">Owner</option>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
          </select>
        </div>

        <div className={styles.memberTable}>
          <div className={styles.memberTableHead}>
            <span>Medlem</span>
            <span>Rolle</span>
            <span>Tilmeldt</span>
            {canManageRequests && <span />}
          </div>
          <div className={styles.memberRowsScroll}>
            {filteredMembers.length === 0 ? (
              <p className={styles.emptyTableText} style={{ padding: '16px 12px' }}>
                {members.length === 0 ? 'Ingen medlemmer endnu' : 'Ingen resultater'}
              </p>
            ) : filteredMembers.map((m) => (
              <div key={m.email} className={styles.memberRow}>
                <div className={styles.memberInfo}>
                  <div className={styles.memberAvatar}>{initials(m.fullname)}</div>
                  <div className={styles.memberMeta}>
                    <span className={styles.memberName}>{m.fullname}</span>
                    <span className={styles.memberEmail}>{m.email}</span>
                  </div>
                </div>
                <div className={styles.memberRole}>
                  <IconUser size={11} strokeWidth={1.75} />
                  {m.role}
                </div>
                <span className={styles.memberJoined}>{formatDate(m.createdAt)}</span>
                {canManageRequests && <MemberMenu isSelf={m.id === currentUserId} role={m.role} onRemove={() => setPendingRemove(m)} onChangeRole={() => setPendingRoleChange(m)} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Invite code + Access requests ── */}
      <div className={styles.bottomRow}>
        <InviteCode code={orgData?.invitationCode ?? org.invitationCode} onRegenerate={canManageRequests ? handleRegenerate : undefined} />
        <AccessRequests canManage={canManageRequests} />
      </div>

      {/* ── Transfer ownership ── */}
      {role === 'Owner' && <TransferOwnership members={members} currentUserId={currentUserId} />}

      {/* ── Role change confirmation ── */}
      {pendingRoleChange && (
        <ConfirmRoleModal
          member={pendingRoleChange}
          onConfirm={() => {
            const newRole = pendingRoleChange.role === 'Admin' ? 'Member' : 'Admin'
            const token = localStorage.getItem('token') ?? ''
            fetch(`${API_BASE}/api/organisation/update-user-role`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: pendingRoleChange.id, userRole: newRole }),
            })
              .then(r => { if (r.ok) setMembers(prev => prev.map(m => m.id === pendingRoleChange.id ? { ...m, role: newRole } : m)) })
              .catch(() => {})
            setPendingRoleChange(null)
          }}
          onCancel={() => setPendingRoleChange(null)}
        />
      )}

      {/* ── Remove member confirmation ── */}
      {pendingRemove && (
        <ConfirmRemoveModal
          member={pendingRemove}
          onConfirm={() => {
            const token = localStorage.getItem('token') ?? ''
            fetch(`${API_BASE}/api/organisation/revoke-access?userId=${pendingRemove.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` },
            })
              .then(r => { if (r.ok) setMembers(prev => prev.filter(m => m.id !== pendingRemove.id)) })
              .catch(() => {})
            setPendingRemove(null)
          }}
          onCancel={() => setPendingRemove(null)}
        />
      )}

    </div>
  )
}
