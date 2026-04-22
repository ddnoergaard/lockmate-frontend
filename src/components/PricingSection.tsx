import { IconCheck, IconArrowNarrowRight } from '@tabler/icons-react'
import styles from './PricingSection.module.css'

const plans = [
  {
    badge: 'Gratis',
    name: 'Personlig',
    price: '0 kr',
    desc: 'Alt du skal bruge for at komme i gang.',
    features: ['25 loginoplysninger', '1 bruger', 'AES-256 kryptering', 'Adgangskodegenerator', 'Browserudvidelse'],
    cta: 'Kom gratis i gang',
    dark: false,
  },
  {
    badge: 'Basis',
    name: 'Starter',
    price: '69 kr',
    desc: 'Til brugere der har brug for mere plads.',
    features: ['200 loginoplysninger', 'Op til 3 brugere', 'Alt i Gratis', 'Sikker deling', 'Brud-overvågning'],
    cta: 'Kom i gang',
    dark: false,
  },
  {
    badge: 'Mest populær',
    name: 'Vækst',
    price: '129 kr',
    desc: 'Til teams der har brug for fuld kontrol.',
    features: ['1000 loginoplysninger', 'Op til 10 brugere', 'Alt i Starter', 'Prioriteret support', 'Revisionslogge'],
    cta: 'Start 14-dages prøveperiode',
    dark: true,
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
            <p>Start gratis og opgrader efterhånden som du vokser.</p>
            <p>
              Lockmate giver dig alt, hvad du skal bruge for at sikre dit
              digitale liv, uden at det koster dig noget.
            </p>
            <p>
              Efterhånden som dine behov vokser, kan du låse op for avancerede
              funktioner som ubegrænset enhedssynk, prioriteret support og sikker deling til teams.
            </p>
            <p>
              Ingen skjulte gebyrer, intet kreditkort krævet for at starte. Annuller når som helst uden besvær.
            </p>
          </div>
        </div>

        {/* Right — cards */}
        <div className={styles.cards}>
          <div className={styles.planRow}>
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`${styles.planCard} ${plan.dark ? styles.planCardDark : ''}`}
              >
                <span className={`${styles.planBadge} ${plan.dark ? styles.planBadgeDark : ''}`}>
                  {plan.badge}
                </span>
                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <div className={styles.planPrice}>
                    <span className={styles.priceAmount}>{plan.price}</span>
                    <span className={styles.pricePer}> / mo</span>
                  </div>
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
                <button className={`${styles.planBtn} ${plan.dark ? styles.planBtnDark : ''}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Enterprise banner */}
          <div className={styles.enterprise}>
            <div className={styles.enterpriseLeft}>
              <span className={styles.enterpriseName}>Enterprise</span>
              <p className={styles.enterpriseDesc}>
                Ubegrænsede loginoplysninger, ubegrænsede brugere. SSO, dedikeret support,
                tilpasset onboarding og revisionslogge inkluderet.
              </p>
            </div>
            <div className={styles.enterpriseRight}>
              <span className={styles.enterprisePrice}>Fra 349 kr / md.</span>
              <button className={styles.enterpriseBtn}>
                Kom i gang <IconArrowNarrowRight size={15} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
