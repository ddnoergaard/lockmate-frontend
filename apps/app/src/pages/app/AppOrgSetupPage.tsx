import { Helmet } from 'react-helmet-async'
import { useNavigate, Link } from 'react-router-dom'
import { IconBuildingSkyscraper, IconLink, IconArrowNarrowLeft } from '@tabler/icons-react'
import styles from '../OnboardingPage.module.css'

const options = [
  {
    id:    'create',
    icon:  IconBuildingSkyscraper,
    title: 'Opret organisation',
    desc:  'Invitér dit team, opret vaults og styr adgang på tværs af hele organisationen.',
  },
  {
    id:    'join',
    icon:  IconLink,
    title: 'Brug invitationslink',
    desc:  'Bliv en del af en eksisterende organisation med et invitationslink fra din administrator.',
  },
]

export default function AppOrgSetupPage() {
  const navigate = useNavigate()

  function handleSelect(id: string) {
    if (id === 'create') navigate('/app/organisation/create')
    if (id === 'join')   navigate('/app/organisation/join')
  }

  return (
    <div className={styles.page}>
      <Helmet><title>Tilføj organisation – Lockmate</title></Helmet>

      <div className={styles.inner}>
        <h1 className={styles.title}>Opret en organisation eller tilslut dig</h1>

        <div className={styles.cards}>
          {options.map(({ id, icon: Icon, title, desc }) => (
            <button key={id} className={styles.card} onClick={() => handleSelect(id)}>
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

        <p className={styles.skip}>
          <Link to="/app/dashboard" className={styles.backLink}>
            <IconArrowNarrowLeft size={14} strokeWidth={2} />
            Tilbage til dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}
