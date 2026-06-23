import { IconCheck, IconArrowNarrowRight } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import styles from './FeaturesSection.module.css'

const encryptionPills = [
  'AES-256 aktiv',
  'Argon2 hashing',
  'Ende-til-ende krypteret',
]

const smallCards = [
  { tag: 'Autofill',    slug: 'autofill',           title: 'Autofill med ét klik',        desc: 'Stop med at taste adgangskoder manuelt. Lockmate udfylder dine loginoplysninger med ét klik på alle dine sider.' },
  { tag: 'Generator',   slug: 'password-generator',  title: 'Adgangskodegenerator',         desc: 'Lav ubrydelige adgangskoder øjeblikkeligt. Tilpas længde, symboler og kompleksitet, så alle konti forbliver sikre.' },
  { tag: 'Sikkerhed',   slug: 'breach-monitoring',   title: 'Brud-overvågning',             desc: 'Bliv advaret hvis dine adgangskoder optræder i databrud. Hold dig et skridt foran med realtids sikkerhedsvarsler.' },
]

export default function FeaturesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.sectionHead}>
          <span className={styles.label}>Hvorfor Lockmate</span>
          <h2 className={styles.heading}>Alt dit team har brug for</h2>
        </div>

        <div className={styles.grid}>
          {/* Large encryption card */}
          <div className={styles.encryptCard}>
            <div className={styles.encryptLeft}>
              <span className={styles.encryptTag}>Kryptering</span>
              <h3 className={styles.encryptTitle}>Militærkvalitets kryptering</h3>
              <p className={styles.encryptDesc}>
                Dine adgangskoder er beskyttet med Argon2 hashing og AES-256
                kryptering. Selv vi kan ikke se dine data. Ægte zero-knowledge
                sikkerhed.
              </p>
              <Link to="/features/encryption" className={styles.learnLink}>
                Læs hvordan det virker <IconArrowNarrowRight size={14} strokeWidth={2} />
              </Link>
            </div>
            <div className={styles.encryptRight}>
              {encryptionPills.map((pill) => (
                <div key={pill} className={styles.pill}>
                  <span className={styles.pillDot} />
                  <span className={styles.pillText}>{pill}</span>
                  <IconCheck size={12} strokeWidth={2.5} className={styles.pillCheck} />
                </div>
              ))}
            </div>
          </div>

          {/* Access anywhere */}
          <div className={styles.featureCard}>
            <span className={styles.featureTag}>Tværplatform</span>
            <h3 className={styles.featureTitle}>Adgang overalt</h3>
            <p className={styles.featureDesc}>
              Synkronisér på tværs af computer, mobil og tablet. Din vault er
              altid tilgængelig, når du har brug for den.
            </p>
            <Link to="/features/cross-platform" className={styles.readMoreLink}>
              Læs mere <IconArrowNarrowRight size={14} strokeWidth={2} />
            </Link>
          </div>

          {/* Bottom row */}
          {smallCards.map((card) => (
            <div key={card.title} className={styles.featureCard}>
              <span className={styles.featureTag}>{card.tag}</span>
              <h3 className={styles.featureTitle}>{card.title}</h3>
              <p className={styles.featureDesc}>{card.desc}</p>
              <Link to={`/features/${card.slug}`} className={styles.readMoreLink}>
                Læs mere <IconArrowNarrowRight size={14} strokeWidth={2} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
