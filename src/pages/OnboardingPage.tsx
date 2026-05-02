import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { IconBuildingSkyscraper, IconLink, IconUser } from '@tabler/icons-react'
import styles from './OnboardingPage.module.css'

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

export default function OnboardingPage() {
  const navigate = useNavigate()

  function handleSelect(id: string) {
    if (id === 'organisation') navigate('/onboarding/organisation')
    if (id === 'invite')       navigate('/onboarding/invite')
    if (id === 'personal')     navigate('/app/dashboard')
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
      </div>
    </div>
  )
}
