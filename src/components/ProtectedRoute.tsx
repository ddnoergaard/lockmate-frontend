import { Navigate, Outlet } from 'react-router-dom'

function isTokenValid(): boolean {
  const token = localStorage.getItem('token')
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export default function ProtectedRoute() {
  if (!isTokenValid()) return <Navigate to="/login" replace />
  return <Outlet />
}
