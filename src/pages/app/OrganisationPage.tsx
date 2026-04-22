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
  IconUserPlus,
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

const planFeatures = [
  '1.000 loginoplysninger',
  'Op til 10 brugere',
  'Ubegrænsede enheder',
  'Alt i Starter',
  'Prioriteret support',
  'Revisionslogge',
]

const initialRequests = [
  { name: 'James Whitfield', email: 'james@whitfield.io',  requestedAt: '2 minutes ago'  },
  { name: 'Priya Sharma',    email: 'priya@sharmatech.dk', requestedAt: '14 minutes ago' },
  { name: 'Tom Eriksen',     email: 'tom.eriksen@mail.com', requestedAt: '1 hour ago'    },
]

const members = [
  { name: 'Alice Johnson',  email: 'alice@acme.com',   role: 'Admin',  joined: 'Jan 12, 2025' },
  { name: 'Bob Martinez',   email: 'bob@acme.com',     role: 'Member', joined: 'Jan 14, 2025' },
  { name: 'Carol White',    email: 'carol@acme.com',   role: 'Member', joined: 'Feb 2, 2025'  },
  { name: 'David Kim',      email: 'david@acme.com',   role: 'Member', joined: 'Feb 9, 2025'  },
  { name: 'Eva Larsson',    email: 'eva@acme.com',     role: 'Member', joined: 'Feb 21, 2025' },
  { name: 'Frank Osei',     email: 'frank@acme.com',   role: 'Member', joined: 'Mar 3, 2025'  },
  { name: 'Grace Tan',      email: 'grace@acme.com',   role: 'Admin',  joined: 'Mar 15, 2025' },
  { name: 'Henry Nguyen',   email: 'henry@acme.com',   role: 'Member', joined: 'Apr 1, 2025'  },
]

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

  if (requests.length === 0) return null

  return (
    <div className={styles.requestsCard}>
      <div className={styles.membersHeader}>
        <div>
          <p className={styles.cardEyebrow}>Afventer</p>
          <h2 className={styles.cardTitle}>Adgangsanmodninger</h2>
        </div>
        <span className={styles.requestsBadge}>{requests.length}</span>
      </div>

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

function MemberMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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

export default function OrganisationPage() {
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
              <h2 className={styles.orgName}>{org.name}</h2>
              <span className={styles.orgTypeBadge}>{org.isPersonal ? 'Personlig' : 'Erhverv'}</span>
            </div>
            <span className={styles.orgMeta}>lockhub.io/{org.slug}</span>
          </div>
        </div>
        <div className={styles.orgMetas}>
          <div className={styles.orgMetaItem}>
            <IconCalendar size={13} strokeWidth={1.75} className={styles.orgMetaIcon} />
            Oprettet {org.createdAt}
          </div>
          <div className={styles.orgMetaItem}>
            <IconUsers size={13} strokeWidth={1.75} className={styles.orgMetaIcon} />
            {org.seats.used} members
          </div>
          <div className={styles.orgMetaItem}>
            <IconMail size={13} strokeWidth={1.75} className={styles.orgMetaIcon} />
            {org.email}
          </div>
          {org.phone && (
            <div className={styles.orgMetaItem}>
              <IconPhone size={13} strokeWidth={1.75} className={styles.orgMetaIcon} />
              {org.phone}
            </div>
          )}
          {org.vatNumber && (
            <div className={styles.orgMetaItem}>
              <IconReceiptTax size={13} strokeWidth={1.75} className={styles.orgMetaIcon} />
              {org.vatNumber}
            </div>
          )}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className={styles.statsRow}>
        {[
          { icon: IconKey,         label: 'Loginoplysninger', value: org.credentials.used },
          { icon: IconShieldLock,  label: 'Vaults',           value: org.vaults.used      },
          { icon: IconUsers,       label: 'Medlemmer',        value: org.seats.used       },
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
            <span className={styles.planBadge}>{org.plan}</span>
          </div>

          <div className={styles.planDetails}>
            <div className={styles.planPrice}>
              <span className={styles.planAmount}>{org.pricePerMonth}</span>
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
            {planFeatures.map((f) => (
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
            <UsageBar label="Pladser"          used={org.seats.used}       limit={org.seats.limit}       />
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
              {org.seats.limit - org.seats.used} plads{org.seats.limit - org.seats.used !== 1 ? 'er' : ''} tilbage på din nuværende plan.
            </span>
            <a href="#" className={styles.usageNoteLink}>Invitér medlemmer →</a>
          </div>

          <div className={styles.planActions}>
            <button className={styles.upgradeBtn}>
              <IconUserPlus size={14} strokeWidth={2} />
              Invitér medlem
            </button>
            <button className={styles.manageBtn}>Se alle grænser</button>
          </div>
        </div>

      </div>

      {/* ── Invite code ── */}
      <InviteCode code={org.invitationCode} />

      {/* ── Access requests ── */}
      <AccessRequests />

      {/* ── Members ── */}
      <div className={styles.membersCard}>
        <div className={styles.membersHeader}>
          <div>
            <p className={styles.cardEyebrow}>Team</p>
            <h2 className={styles.cardTitle}>Medlemmer</h2>
          </div>
          <button className={styles.upgradeBtn} style={{ fontSize: '13px', padding: '7px 14px' }}>
            <IconUserPlus size={13} strokeWidth={2} />
            Invitér
          </button>
        </div>

        <div className={styles.memberTable}>
          <div className={styles.memberTableHead}>
            <span>Medlem</span>
            <span>Rolle</span>
            <span>Tilmeldt</span>
            <span />
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
              <span className={styles.memberJoined}>{m.joined}</span>
              <MemberMenu email={m.email} />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
