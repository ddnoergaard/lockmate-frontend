import { Helmet } from 'react-helmet-async'
import { IconCheck, IconArrowRight, IconChevronDown } from '@tabler/icons-react'
import Navbar from '../components/Navbar'
import VaultMockup from '../components/VaultMockup'
import FeaturesSection from '../components/FeaturesSection'
import StatsSection from '../components/StatsSection'
import PricingSection from '../components/PricingSection'
import Footer from '../components/Footer'
import styles from './HomePage.module.css'

const features = [
  'Generér ubrydelige adgangskoder øjeblikkeligt',
  'Synkronisér på tværs af alle dine enheder',
  'Udfyld login med ét klik',
]

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Helmet>
        <title>Lockmate – Adgangskodehåndtering til teams</title>
        <meta name="description" content="Lockmate beskytter dit teams loginoplysninger med AES-256 kryptering og zero-knowledge arkitektur. Generér stærke adgangskoder, synkronisér på tværs af enheder og udfyld login med ét klik." />
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <Navbar />
        </header>

        <main className={styles.hero} aria-label="Hero section">
          {/* Left — text */}
          <div className={styles.heroText}>
            <span className={styles.badge}>Adgangskodehåndtering</span>

            <h1 className={styles.heading}>
              Sikr dit teams <em>loginoplysninger</em>
            </h1>

            <p className={styles.subtext}>
              Ét sted til adgangskoder, adgangsnøgler og{' '}
              <span className={styles.highlight}>følsomme data</span>. Bygget
              til teams der tager sikkerhed seriøst.
            </p>
            <p className={styles.subtext}>
              Gruppér loginoplysninger efter team eller projekt med vores <strong>vault-system.</strong><br/>
              Hold Teknik, Design og Finans adskilt. Tildel roller, styr adgang.
            </p>

            <ul className={styles.features}>
              {features.map((f) => (
                <li key={f} className={styles.featureItem}>
                  <IconCheck size={14} strokeWidth={2.5} className={styles.checkIcon} />
                  {f}
                </li>
              ))}
            </ul>

            <div className={styles.ctas}>
              <button className={styles.primaryBtn}>Kom gratis i gang</button>
              <button className={styles.textBtn}>
                <IconArrowRight size={15} strokeWidth={2} />
                Se hvordan det virker
              </button>
            </div>
          </div>

          {/* Right — mockup */}
          <div className={styles.heroVisual}>
            <VaultMockup />
          </div>

          <div className={styles.scrollHint} aria-hidden="true">
            <IconChevronDown size={18} strokeWidth={1.5} />
          </div>
        </main>
      </div>

      <FeaturesSection />
      <StatsSection />
      <PricingSection />
      <Footer />
    </div>
  )
}
