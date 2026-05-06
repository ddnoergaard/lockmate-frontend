import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, Link } from 'react-router-dom'
import { IconBuildingSkyscraper, IconLink, IconUser } from '@tabler/icons-react'
import styles from './OnboardingPage.module.css'
import { API_BASE } from '../config'

const options = [
  {
    id:    'organisation',
    icon:  IconBuildingSkyscraper,
    title: 'Opret organisation',
    desc:  'Invitér dit team, opret vaults og styr adgang på tværs af hele organisationen.',
  },
  {
    id:    'invite',
    icon:  IconLink,
    title: 'Brug invitationslink',
    desc:  'Bliv en del af en eksisterende organisation med et invitationslink fra din administrator.',
  },
  {
    id:    'personal',
    icon:  IconUser,
    title: 'Personlig vault',
    desc:  'Brug Lockmate til dig selv. Gem og autofyld dine egne loginoplysninger sikkert.',
  },
]

function getStoredUser() {
  try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSelect(id: string) {
    if (id === 'organisation') { navigate('/onboarding/organisation'); return }
    if (id === 'invite')       { navigate('/onboarding/invite');       return }

    // Personal — fire API call directly
    setError('')
    setLoading(true)
    try {
      const user  = getStoredUser()
      const token = localStorage.getItem('token') ?? ''
      const res   = await fetch(`${API_BASE}/api/organisation/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          organisationName: user.firstName || 'Personlig',
          email:            user.email     || null,
          cvr:              null,
          phone:            null,
          isPersonal:       true,
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
        <title>Kom i gang – Lockmate</title>
      </Helmet>

      <div className={styles.inner}>
        <h1 className={styles.title}>Hvordan vil du bruge Lockmate?</h1>

        <div className={styles.cards}>
          {options.map(({ id, icon: Icon, title, desc }) => (
            <button key={id} className={styles.card} onClick={() => handleSelect(id)} disabled={loading}>
              <div className={styles.iconWrap}>
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardTitle}>{title}</span>
                <span className={styles.cardDesc}>{desc}</span>
              </div>
              <div className={styles.cardArrow}>→</div>
            </button>
          ))}
        </div>

        {error && <p className={styles.errorMsg}>{error}</p>}

        <p className={styles.skip}>
          Vil du udforske først?{' '}
          <Link to="/app/dashboard" className={styles.skipLink}>
            Spring opsætning over
          </Link>
        </p>
      </div>
    </div>
  )
}
