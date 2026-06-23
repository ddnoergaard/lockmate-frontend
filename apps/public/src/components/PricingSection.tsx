import { IconCheck, IconArrowNarrowRight } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { APP_URL } from '../config'
import styles from './PricingSection.module.css'

const plans = [
  {
    badge: 'Starter',
    price: '149 kr',
    desc: 'Til små teams der vil i gang hurtigt og sikkert.',
    features: ['Op til 5 brugere', 'Ubegrænsede loginoplysninger', 'AES-256 kryptering', 'Adgangskodegenerator', 'Sikker deling'],
    cta: '30 dage gratis',
    ctaLink: '/register',
    dark: false,
  },
  {
    badge: 'Mest populær',
    price: '249 kr',
    desc: 'Til voksende teams med overvågning og prioriteret support.',
    features: ['Op til 15 brugere', 'Alt i Starter', 'Brud-overvågning', 'Prioriteret support'],
    cta: 'Start gratis prøveperiode',
    ctaLink: '/register',
    dark: true,
  },
  {
    badge: 'Scale',
    price: '449 kr',
    desc: 'Flat takst for op til 50 brugere. Fuld kontrol.',
    features: ['Op til 50 brugere', 'Alt i Growth', 'Revisionslogge', 'Dedikeret support'],
    cta: 'Kom i gang',
    ctaLink: '/register',
    dark: false,
  },
]

export default function PricingSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Left — copy */}
        <div className={styles.copy}>
          <span className={styles.label}>Priser</span>
          <h2 className={styles.heading}>Enkle, gennemsigtige priser</h2>
          <div className={styles.body}>
            <p>Flat månedlig takst. Ingen overraskelser, uanset hvor mange I er.</p>
            <p>
              Start med 30 dage gratis på Starter-planen. Intet kreditkort kræves.
            </p>
            <p>
              Jo flere I er, jo mere sparer I sammenlignet med konkurrenterne. Fra 16 brugere slår vi selv Bitwarden.
            </p>
            <p>
              Ingen skjulte gebyrer, ingen binding. Annuller når som helst.
            </p>
          </div>
          <Link to="/pricing/comparison" className={styles.compareLink}>
            Se prissammenligning <IconArrowNarrowRight size={14} strokeWidth={2} />
          </Link>
        </div>

        {/* Right — cards */}
        <div className={styles.cards}>
          <div className={styles.planRow}>
            {plans.map((plan) => (
              <div
                key={plan.badge}
                className={`${styles.planCard} ${plan.dark ? styles.planCardDark : ''}`}
              >
                <span className={`${styles.planBadge} ${plan.dark ? styles.planBadgeDark : ''}`}>
                  {plan.badge}
                </span>
                <div className={styles.planHeader}>
                  <div className={styles.planPrice}>
                    <span className={styles.priceAmount}>{plan.price}</span>
                    <span className={styles.pricePer}> / md.</span>
                  </div>
                  <span className={styles.vatNote}>eks. moms</span>
                  <p className={styles.planDesc}>{plan.desc}</p>
                </div>
                <div className={`${styles.divider} ${plan.dark ? styles.dividerDark : ''}`} />
                <ul className={styles.featureList}>
                  {plan.features.map((f) => (
                    <li key={f} className={styles.featureItem}>
                      <IconCheck
                        size={13}
                        strokeWidth={2.5}
                        className={plan.dark ? styles.checkDark : styles.checkLight}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={`${APP_URL}${plan.ctaLink}`} className={`${styles.planBtn} ${plan.dark ? styles.planBtnDark : ''}`}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          {/* Enterprise banner */}
          <div className={styles.enterprise}>
            <div className={styles.enterpriseLeft}>
              <span className={styles.enterpriseName}>Enterprise</span>
              <p className={styles.enterpriseDesc}>
                Over 50 brugere? SSO, dedikeret support og tilpasset onboarding. Kontakt os for en skræddersyet pris.
              </p>
            </div>
            <div className={styles.enterpriseRight}>
              <span className={styles.enterprisePrice}>Tilpasset pris</span>
              <a href="mailto:contact@lockmate.dk" className={styles.enterpriseBtn}>
                Kontakt os <IconArrowNarrowRight size={15} strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
