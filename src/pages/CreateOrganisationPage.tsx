import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import {
  IconBuildingSkyscraper, IconId, IconMail, IconPhone, IconArrowNarrowRight,
} from '@tabler/icons-react'
import styles from './CreateOrganisationPage.module.css'
import { API_BASE } from '../config'

function getStoredUser() {
  try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
}

export default function CreateOrganisationPage() {
  const navigate = useNavigate()
  const user = getStoredUser()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [form, setForm] = useState({
    name:      '',
    vatNumber: '',
    email:     '',
    phone:     '',
  })

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) {
      setError('Organisationsnavn er påkrævet.')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token') ?? ''
      const res = await fetch(`${API_BASE}/api/organisation/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          organisationName: form.name,
          cvr:              form.vatNumber || null,
          email:            form.email    || user.email || null,
          phone:            form.phone    || null,
          userEmail:        user.email,
          isPersonal:       false
        }),
      })

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
        <title>Opret organisation – Lockmate</title>
      </Helmet>

      <div className={styles.inner}>
        <div className={styles.head}>
          <h1 className={styles.title}>Opret din organisation</h1>
          <p className={styles.subtitle}>Du kan tilpasse alle detaljer senere fra organisationsindstillingerne.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>

          {/* Name */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="orgName">Organisationsnavn</label>
            <div className={styles.inputWrap}>
              <IconBuildingSkyscraper size={16} className={styles.inputIcon} strokeWidth={1.75} />
              <input
                id="orgName" type="text" className={styles.input}
                placeholder="Acme ApS" autoComplete="organization"
                value={form.name} onChange={field('name')}
              />
            </div>
          </div>

          {/* VAT */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="vatNumber">
              CVR-nummer <span className={styles.optional}>(valgfrit)</span>
            </label>
            <div className={styles.inputWrap}>
              <IconId size={16} className={styles.inputIcon} strokeWidth={1.75} />
              <input
                id="vatNumber" type="text" className={styles.input}
                placeholder="12345678"
                value={form.vatNumber} onChange={field('vatNumber')}
              />
            </div>
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="orgEmail">
              Organisations-email <span className={styles.optional}>(valgfrit)</span>
            </label>
            <div className={styles.inputWrap}>
              <IconMail size={16} className={styles.inputIcon} strokeWidth={1.75} />
              <input
                id="orgEmail" type="email" className={styles.input}
                placeholder={user.email || 'kontakt@virksomhed.dk'} autoComplete="email"
                value={form.email} onChange={field('email')}
              />
            </div>
            <p className={styles.hint}>Hvis tom bruges {user.email ? <strong>{user.email}</strong> : 'din egen email'}.</p>
          </div>

          {/* Phone */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="orgPhone">
              Telefon <span className={styles.optional}>(valgfrit)</span>
            </label>
            <div className={styles.inputWrap}>
              <IconPhone size={16} className={styles.inputIcon} strokeWidth={1.75} />
              <input
                id="orgPhone" type="tel" className={styles.input}
                placeholder="12345678" maxLength={9}
                value={form.phone} onChange={field('phone')}
              />
            </div>
            {form.phone.length > 8 && (
              <p className={styles.fieldError}>Telefonnummer må højst være 8 tegn.</p>
            )}
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Opretter...' : 'Opret organisation'}
            {!loading && <IconArrowNarrowRight size={16} strokeWidth={2} />}
          </button>
        </form>
      </div>
    </div>
  )
}
