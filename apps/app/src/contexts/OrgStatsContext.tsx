import { createContext, useContext, useEffect, useState } from 'react'
import { API_BASE } from '../config'
import { getTokenPayload } from '../utils/fetchOrgId'

interface OrgStats {
  credentialCount: number | null
  vaultCount:      number | null
  memberCount:     number | null
}

interface OrgStatsCtx extends OrgStats {
  loading:          boolean
  refresh:          () => void
  orgId:            string | null
  setOrgId:         (id: string | null) => void
  refreshFromToken: () => void
}

function orgIdFromToken(): string | null {
  const { orgId } = getTokenPayload()
  const id = orgId ? String(orgId) : null
  return id && id !== '0' ? id : null
}

const OrgStatsContext = createContext<OrgStatsCtx>({
  credentialCount:  null,
  vaultCount:       null,
  memberCount:      null,
  loading:          false,
  refresh:          () => {},
  orgId:            null,
  setOrgId:         () => {},
  refreshFromToken: () => {},
})

export function useOrgStats() {
  return useContext(OrgStatsContext)
}

export function OrgStatsProvider({ children }: { children: React.ReactNode }) {
  const [stats,   setStats]   = useState<OrgStats>({ credentialCount: null, vaultCount: null, memberCount: null })
  const [loading, setLoading] = useState(false)
  const [tick,    setTick]    = useState(0)
  const [orgId,   setOrgId]   = useState<string | null>(orgIdFromToken)

  function refresh()          { setTick(t => t + 1) }
  function refreshFromToken() { setOrgId(orgIdFromToken()) }

  useEffect(() => {
    if (!orgId) return

    setLoading(true)
    const token   = localStorage.getItem('token') ?? ''
    const headers = { 'Authorization': `Bearer ${token}` }

    Promise.all([
      fetch(`${API_BASE}/api/Credential/get-credential-count?orgId=${orgId}`, { headers })
        .then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API_BASE}/api/vault/get-count?orgId=${orgId}`, { headers })
        .then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API_BASE}/api/organisation/get-member-count?orgId=${orgId}`, { headers })
        .then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([credentialCount, vaultCount, memberCount]) => {
      setStats({ credentialCount, vaultCount, memberCount })
    }).finally(() => setLoading(false))
  }, [tick, orgId])

  return (
    <OrgStatsContext.Provider value={{ ...stats, loading, refresh, orgId, setOrgId, refreshFromToken }}>
      {children}
    </OrgStatsContext.Provider>
  )
}
