import { API_BASE } from '../config'

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
