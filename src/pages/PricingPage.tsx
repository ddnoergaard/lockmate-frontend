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
    name: 'Starter',
    monthlyPrice: '149',
    annualPrice: '119',
    desc: 'Til små teams der vil i gang hurtigt og sikkert.',
    cta: 'Start gratis prøveperiode',
    ctaLink: '/register',
    highlight: false,
    features: [
      'Op til 5 brugere',
      'Ubegrænsede loginoplysninger',
      'Ubegrænsede enheder',
      'AES-256 kryptering',
      'Adgangskodegenerator',
      'Sikker deling',
      'Browserudvidelse',
    ],
  },
  {
    name: 'Growth',
    monthlyPrice: '249',
    annualPrice: '199',
    desc: 'Til voksende teams med overvågning og prioriteret support.',
    cta: 'Start gratis prøveperiode',
    ctaLink: '/register',
    highlight: true,
    features: [
      'Op til 15 brugere',
      'Ubegrænsede loginoplysninger',
      'Alt i Starter',
      'Brud-overvågning',
      'Prioriteret support',
    ],
  },
  {
    name: 'Scale',
    monthlyPrice: '449',
    annualPrice: '359',
    desc: 'Til teams der skal skalere. Op til 50 brugere, fuld kontrol.',
    cta: 'Start gratis prøveperiode',
    ctaLink: '/register',
    highlight: false,
    features: [
      'Op til 50 brugere',
      'Ubegrænsede loginoplysninger',
      'Alt i Growth',
      'Revisionslogge',
      'Dedikeret support',
    ],
  },
]

/* ── Comparison teaser ── */
const competitors = [
  { name: 'Bitwarden Teams',    pricePerUser: 28 },
  { name: '1Password Business', pricePerUser: 56 },
  { name: 'Dashlane',           pricePerUser: 56 },
]

function getLockmateTier(users: number) {
  if (users <= 5)  return { name: 'Starter',  price: 149 }
  if (users <= 15) return { name: 'Growth',   price: 249 }
  return                  { name: 'Scale', price: 449 }
}

function ComparisonTeaser() {
  const [users, setUsers] = useState(20)
  const lockmate   = getLockmateTier(users)
  const compPrices = competitors.map(c => ({ ...c, total: c.pricePerUser * users }))
  const maxCost    = Math.max(lockmate.price, ...compPrices.map(c => c.total))

  return (
    <div className={styles.compareWrap}>
      <div className={styles.compareInner}>
        <div className={styles.compareHead}>
          <span className={styles.eyebrow}>Prissammenligning</span>
          <h2 className={styles.compareTitle}>Flat takst. Ingen ubehagelige overraskelser.</h2>
          <p className={styles.compareSubtitle}>
            Konkurrenterne fakturerer pr. bruger. Vi gør ikke. Træk slideren og se forskellen.
          </p>
        </div>

        <div className={styles.sliderBlock}>
          <div className={styles.sliderLabelRow}>
            <span className={styles.sliderLabel}>Antal brugere</span>
            <span className={styles.sliderValue}>{users}</span>
          </div>
          <input
            type="range" min={1} max={50} value={users}
            onChange={e => setUsers(Number(e.target.value))}
            className={styles.slider}
          />
          <div className={styles.sliderTicks}>
            {([
              { v: 1,  label: 'Starter'  },
              { v: 6,  label: 'Growth'   },
              { v: 16, label: 'Scale' },
            ] as const).map(({ v, label }) => (
              <div
                key={v}
                className={styles.tick}
                style={{ left: `calc(${(v - 1) / 49} * (100% - 20px) + 10px)` }}
              >
                <div className={styles.tickMark} />
                <span className={styles.tickLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.compareRows}>
          <div className={`${styles.compareRow} ${styles.compareRowLock}`}>
            <div className={styles.rowLeft}>
              <span className={styles.rowName}>Lockmate {lockmate.name}</span>
              <span className={styles.rowTag}>Vores pris</span>
            </div>
            <div className={styles.rowBarWrap}>
              <div
                className={`${styles.barFill} ${styles.barGreen}`}
                style={{ width: `${Math.max(4, (lockmate.price / maxCost) * 100)}%` }}
              />
            </div>
            <span className={styles.rowPrice}>{lockmate.price} kr/md.</span>
          </div>

          {compPrices.map(c => (
            <div key={c.name} className={styles.compareRow}>
              <div className={styles.rowLeft}>
                <span className={styles.rowName}>{c.name}</span>
                <span className={styles.rowNote}>{c.pricePerUser} kr/bruger/md.</span>
              </div>
              <div className={styles.rowBarWrap}>
                <div
                  className={styles.barFill}
                  style={{ width: `${Math.max(4, (c.total / maxCost) * 100)}%` }}
                />
              </div>
              <span className={styles.rowPrice}>{c.total} kr/md.</span>
            </div>
          ))}
        </div>

        <div className={styles.compareFooter}>
          <p className={styles.compareNote}>
            * Konkurrentpriser omregnet fra USD til DKK (ca. 1 USD = 7 DKK). Vejledende priser.
          </p>
          <Link to="/pricing/comparison" className={styles.compareLink}>
            Se fuld sammenligning <IconArrowNarrowRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ── FAQ ── */
const faqs = [
  {
    q: 'Er der en gratis prøveperiode?',
    a: 'Ja. Starter-planen kommer med 30 dages gratis prøveperiode – intet kreditkort kræves for at starte.',
  },
  {
    q: 'Hvordan fungerer zero-knowledge kryptering?',
    a: 'Din masterkodeord forlader aldrig din enhed. Alt krypteres lokalt med AES-256 inden det rammer vores servere. Vi kan bogstaveligt talt ikke læse dine data.',
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
    q: 'Kan jeg tilføje flere teammedlemmer later?',
    a: 'Absolut. Du kan opgradere din plan når som helst fra dine organisationsindstillinger. Ingen IT-sag krævet.',
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
      <div className={`${styles.faqAnswerWrap} ${open ? styles.faqAnswerOpen : ''}`}>
        <p className={styles.faqAnswer}>{a}</p>
      </div>
    </div>
  )
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Priser – Lockmate</title>
        <meta name="description" content="Se Lockmates prisplaner. Start med 30 dage gratis. Flat månedlig takst – ingen skjulte gebyrer, uanset hvor mange I er." />
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <Navbar />
        </header>

        <div className={styles.pageHead}>
          <span className={styles.eyebrow}>Priser</span>
          <h1 className={styles.title}>Enkle, gennemsigtige priser</h1>
          <p className={styles.subtitle}>
            Flat månedlig takst. Ingen overraskelser, uanset hvor mange I er.
            <br />Start med 30 dage gratis – intet kreditkort kræves.
          </p>

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
                  <span className={styles.priceSuffix}> kr / md.</span>
                </div>
                {annual && (
                  <span className={styles.billedNote}>Faktureres årligt</span>
                )}
                <p className={styles.planDesc}>{plan.desc}</p>
              </div>

              <div className={styles.cardCtas}>
                <Link
                  to={plan.ctaLink}
                  className={`${styles.primaryCta} ${plan.highlight ? styles.primaryCtaGreen : ''}`}
                >
                  {plan.cta}
                </Link>
                <span className={styles.trialNote}>30 dage gratis · Intet kreditkort kræves</span>
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
              Over 50 brugere? Kontakt os for en skræddersyet løsning med SSO, dedikeret support og tilpasset onboarding.
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

      {/* ── Comparison teaser ── */}
      <ComparisonTeaser />

      {/* ── FAQ ── */}
      <div className={styles.faqWrap}>
        <div className={styles.faqInner}>
          <div className={styles.faqLeft}>
            <span className={styles.faqEyebrow}>Support</span>
            <h2 className={styles.faqTitle}>FAQ</h2>
            <p className={styles.faqSubtitle}>
              Alt du skal vide om produktet og fakturering.
              Kan du ikke finde svaret?{' '}
              <a href="mailto:contact@lockmate.dk" className={styles.faqContact}>
                Skriv til os.
              </a>
            </p>
          </div>
          <div className={styles.faqList}>
            {faqs.map((f) => <FAQItem key={f.q} {...f} />)}
          </div>
        </div>
      </div>

      {/* ── No contracts section ── */}
      <div className={styles.contractsWrap}>
        <div className={styles.contractsInner}>
          <div className={styles.contractsLeft}>
            <h2 className={styles.contractsHeading}>
              Så nemt som 1, 2, 3..<br />Ingen faldgruber.
            </h2>
            <p className={styles.contractsBody}>
              Kørende på under 5 minutter. Opret din organisation, lav en vault, gem dine loginoplysninger og få hele teamet med. Alt inden dit næste møde.
              <br /><br />
              Priser der skalerer med <strong>dig</strong>, ikke imod <strong>dig</strong>.
            </p>
            <div className={styles.contractsCtas}>
              <Link to="/register" className={styles.contractsPrimary}>Kom gratis i gang</Link>
              <Link to="/pricing/comparison" className={styles.contractsSecondary}>Se prissammenligning</Link>
            </div>
          </div>

          <div className={styles.contractsRight}>
            {[
              { step: '01', title: 'Opret din organisation',           desc: 'Opret din konto og konfigurer din organisation på under et minut.' },
              { step: '02', title: 'Lav en vault',                      desc: 'Vaults holder loginoplysninger organiseret efter projekt, team eller adgangsniveau.' },
              { step: '03', title: 'Begynd at gemme loginoplysninger',  desc: 'Tilføj manuelt eller importér fra 1Password, LastPass, Bitwarden eller CSV.' },
              { step: '04', title: 'Invitér dit team',                   desc: 'Del vaults og tildel roller. Ingen IT-sag krævet.' },
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
