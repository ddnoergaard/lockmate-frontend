import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { IconCheck, IconChevronDown, IconArrowNarrowRight } from '@tabler/icons-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from './PricingPage.module.css'

/* ── Plans ── */
const plans = [
  {
    name: 'Gratis',
    monthlyPrice: '0 kr',
    annualPrice: '0 kr',
    desc: 'Alt du skal bruge for at komme i gang.',
    cta: 'Kom gratis i gang',
    ctaLink: '/register',
    highlight: false,
    features: [
      '25 loginoplysninger',
      '1 bruger',
      '2 enheder',
      'AES-256 kryptering',
      'Adgangskodegenerator',
      'Browserudvidelse',
    ],
  },
  {
    name: 'Starter',
    monthlyPrice: '69 kr',
    annualPrice: '55 kr',
    desc: 'Til små teams der har brug for plads til vækst.',
    cta: 'Start gratis prøveperiode',
    ctaLink: '/register',
    highlight: false,
    features: [
      '200 loginoplysninger',
      'Op til 3 brugere',
      'Ubegrænsede enheder',
      'Alt i Gratis',
      'Sikker deling',
      'Brud-overvågning',
    ],
  },
  {
    name: 'Vækst',
    monthlyPrice: '129 kr',
    annualPrice: '99 kr',
    desc: 'Til teams der har brug for fuld kontrol.',
    cta: 'Start gratis prøveperiode',
    ctaLink: '/register',
    highlight: true,
    features: [
      '1.000 loginoplysninger',
      'Op til 10 brugere',
      'Ubegrænsede enheder',
      'Alt i Starter',
      'Prioriteret support',
      'Revisionslogge',
    ],
  },
]

/* ── FAQ ── */
const faqs = [
  {
    q: 'Er der en gratis prøveperiode?',
    a: 'Ja. Starter- og Vækst-planer kommer med en 14-dages gratis prøveperiode. Intet kreditkort kræves for at starte.',
  },
  {
    q: 'Hvordan fungerer zero-knowledge kryptering?',
    a: 'Din masterkodeord forlader aldrig din enhed. Alt krypteres lokalt med AES-256 inden det rammer vores servere. Vi kan bogstaveligt talt ikke læse dine data. Selv hvis vi ville.',
  },
  {
    q: 'Kan jeg importere fra en anden adgangskodemanager?',
    a: 'Ja. Vi understøtter import fra 1Password, LastPass, Bitwarden, Dashlane og ethvert generisk CSV-eksport.',
  },
  {
    q: 'Hvad sker der med mine data hvis jeg opsiger?',
    a: 'Du har 30 dage til at eksportere alt efter opsigelse. Efter dette vindue slettes alle data permanent fra vores servere.',
  },
  {
    q: 'Kan jeg tilføje flere teammedlemmer senere?',
    a: 'Absolut. Du kan opgradere din plan eller købe ekstra pladser når som helst fra dine organisationsindstillinger.',
  },
  {
    q: 'Er min masterkodeord gemt nogen steder?',
    a: 'Nej. Din masterkodeord sendes aldrig til eller gemmes på vores servere. Den bruges lokalt til at udlede din krypteringsnøgle og kasseres derefter.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`${styles.faqItem} ${open ? styles.faqItemOpen : ''}`}>
      <button className={styles.faqQuestion} onClick={() => setOpen((v) => !v)}>
        <span>{q}</span>
        <IconChevronDown size={16} strokeWidth={1.75} className={styles.faqChevron} />
      </button>
      {open && <p className={styles.faqAnswer}>{a}</p>}
    </div>
  )
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Priser – Lockmate</title>
        <meta name="description" content="Se Lockmates prisplaner. Start gratis, eller vælg en plan der passer til dit team. Ingen skjulte gebyrer – betal kun for det du bruger." />
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <Navbar />
        </header>

        {/* ── Page header ── */}
        <div className={styles.pageHead}>
        <span className={styles.eyebrow}>Priser</span>
        <h1 className={styles.title}>Enkle, gennemsigtige priser</h1>
        <p className={styles.subtitle}>
          Start gratis. Opgrader når dit team har brug for mere.
          <br />Ingen skjulte gebyrer, ingen overraskelser.
        </p>

        {/* Billing toggle */}
        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${!annual ? styles.toggleActive : ''}`}
            onClick={() => setAnnual(false)}
          >
            Månedlig
          </button>
          <button
            className={`${styles.toggleBtn} ${annual ? styles.toggleActive : ''}`}
            onClick={() => setAnnual(true)}
          >
            Årlig
            <span className={styles.saveBadge}>Spar 20%</span>
          </button>
        </div>
        </div>
      </div>

      {/* ── Plans ── */}
      <div className={styles.plansWrap}>
        <div className={styles.plans}>
          {plans.map((plan) => (
            <div key={plan.name} className={`${styles.card} ${plan.highlight ? styles.cardHighlight : ''}`}>
              {plan.highlight && <span className={styles.popularBadge}>Mest populær</span>}

              <div className={styles.cardTop}>
                <span className={styles.planName}>{plan.name}</span>
                <div className={styles.priceRow}>
                  <span className={styles.price}>
                    {annual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className={styles.priceSuffix}> / md.</span>
                </div>
                {annual && plan.monthlyPrice !== '0 kr' && (
                  <span className={styles.billedNote}>Faktureres årligt</span>
                )}
                <p className={styles.planDesc}>{plan.desc}</p>
              </div>

              <div className={styles.cardCtas}>
                <Link to={plan.ctaLink} className={`${styles.primaryCta} ${plan.highlight ? styles.primaryCtaGreen : ''}`}>
                  {plan.cta}
                </Link>
                <a href="#" className={styles.secondaryCta}>Kontakt salg</a>
              </div>

              <div className={styles.divider} />

              <div className={styles.featuresBlock}>
                <span className={styles.featuresLabel}>Funktioner</span>
                <ul className={styles.featureList}>
                  {plan.features.map((f) => (
                    <li key={f} className={styles.featureItem}>
                      <IconCheck size={14} strokeWidth={2.5} className={styles.featureCheck} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise banner */}
        <div className={styles.enterprise}>
          <div>
            <p className={styles.enterpriseName}>Enterprise</p>
            <p className={styles.enterpriseDesc}>
              Ubegrænsede loginoplysninger, ubegrænsede brugere. SSO, dedikeret support, tilpasset onboarding og revisionslogge inkluderet.
            </p>
          </div>
          <div className={styles.enterpriseRight}>
            <span className={styles.enterprisePrice}>Fra 349 kr / md.</span>
            <Link to="/register" className={styles.enterpriseBtn}>
              Kom i gang <IconArrowNarrowRight size={15} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className={styles.faqWrap}>
        <div className={styles.faqInner}>
          {/* Left */}
          <div className={styles.faqLeft}>
            <span className={styles.faqEyebrow}>Support</span>
            <h2 className={styles.faqTitle}>FAQ</h2>
            <p className={styles.faqSubtitle}>
              Alt du skal vide om produktet og fakturering.
              Kan du ikke finde svaret?{' '}
              <a href="mailto:contact@lockhub.com" className={styles.faqContact}>
                Skriv til os.
              </a>
            </p>
          </div>

          {/* Right */}
          <div className={styles.faqList}>
            {faqs.map((f) => <FAQItem key={f.q} {...f} />)}
          </div>
        </div>
      </div>

      {/* ── No contracts section ── */}
      <div className={styles.contractsWrap}>
        <div className={styles.contractsInner}>
          {/* Left — copy */}
          <div className={styles.contractsLeft}>
            <h2 className={styles.contractsHeading}>
              Så nemt som 1, 2, 3..<br />Ingen faldgruber.
            </h2>
            <p className={styles.contractsBody}>
              Kørende på under 5 minutter. Opret din organisation, lav en vault, gem dine loginoplysninger og få hele teamet med. Alt inden dit næste møde. <br /><br /> Priser der skalerer med <strong>dig</strong>, ikke imod <strong>dig</strong>.
            </p>
            <div className={styles.contractsCtas}>
              <Link to="/register" className={styles.contractsPrimary}>Kom gratis i gang</Link>
              <Link to="/pricing" className={styles.contractsSecondary}>Se priser</Link>
            </div>
          </div>

          {/* Right — setup steps */}
          <div className={styles.contractsRight}>
            {[
              { step: '01', title: 'Opret din organisation',          desc: 'Opret din konto og konfigurer din organisation på under et minut.' },
              { step: '02', title: 'Lav en vault',                     desc: 'Vaults holder loginoplysninger organiseret efter projekt, team eller adgangsniveau.' },
              { step: '03', title: 'Begynd at gemme loginoplysninger', desc: 'Tilføj manuelt eller importér fra 1Password, LastPass, Bitwarden eller CSV.' },
              { step: '04', title: 'Invitér dit team',                  desc: 'Del vaults og tildel roller. Ingen IT-sag krævet.' },
            ].map((s) => (
              <div key={s.step} className={styles.stepCard}>
                <div className={styles.stepMeta}>
                  <span className={styles.stepNum}>{s.step}</span>
                </div>
                <p className={styles.stepTitle}>{s.title}</p>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
