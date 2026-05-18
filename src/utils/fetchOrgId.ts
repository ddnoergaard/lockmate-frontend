import { API_BASE } from '../config'

interface TokenPayload {
  userId?: string
  orgId?: string | null
  role?: string | null
}

export function storeTokenPayload(token: string): void {
  try {
    const payload: TokenPayload = JSON.parse(atob(token.split('.')[1]))
    if (payload.orgId) localStorage.setItem('orgId', String(payload.orgId))
    if (payload.role)  localStorage.setItem('role',  String(payload.role))
  } catch {
    // malformed token — leave existing values in place
  }
}

export async function fetchAndStoreOrgId(): Promise<void> {
  const token = localStorage.getItem('token') ?? ''
  try {
    const res = await fetch(`${API_BASE}/api/organisation/get-orgid`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (!res.ok) return
    const orgId = await res.json()
    localStorage.setItem('orgId', String(orgId))
  } catch {
    // silently fail — the app handles missing orgId with a banner
  }
}
