interface TokenPayload {
  userId?: string
  orgId?:  string | number | null
  role?:   string | null
}

export function getTokenPayload(): TokenPayload {
  try {
    const token = localStorage.getItem('token') ?? ''
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return {}
  }
}
