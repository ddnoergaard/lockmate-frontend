import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { IconLink, IconArrowNarrowRight } from '@tabler/icons-react'
import styles from './InviteCodePage.module.css'
import { API_BASE } from '../config'

export default function InviteCodePage() {
  const navigate = useNavigate()
  const [inviteCode, setInviteCode] = useState('')
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')

    if (!inviteCode.trim()) {
      setError('Indtast venligst en invitationskode.')
      return
    }

    const token = localStorage.getItem('token') ?? ''

    setLoading(true)
    try {
      const res = await fetch(
        `${API_BASE}/api/organisation/request-access?inviteCode=${encodeURIComponent(inviteCode)}`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        }
      )

      if (!res.ok) {
        const text = await res.text()
        setError(text || `Fejl ${res.status}. Prøv igen.`)
        return
      }

      navigate('/app/dashboard')
    } catch {
      setError('Kunne ikke forbinde til serveren. Tjek din forbindelse.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Brug invitationskode – Lockmate</title>
      </Helmet>

      <div className={styles.inner}>
        <div className={styles.head}>
          <h1 className={styles.title}>Brug invitationskode</h1>
          <p className={styles.subtitle}>Indtast koden du har modtaget fra din administrator.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="inviteCode">Invitationskode</label>
            <div className={styles.inputWrap}>
              <IconLink size={16} className={styles.inputIcon} strokeWidth={1.75} />
              <input
                id="inviteCode"
                type="text"
                className={styles.input}
                placeholder="XXXX-XXXX"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value)}
              />
            </div>
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Anmoder om adgang...' : 'Anmod om adgang'}
            {!loading && <IconArrowNarrowRight size={16} strokeWidth={2} />}
          </button>
        </form>
      </div>
    </div>
  )
}
