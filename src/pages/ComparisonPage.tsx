import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { IconCheck, IconX, IconMinus, IconArrowNarrowRight } from '@tabler/icons-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from './ComparisonPage.module.css'

/* ── Competitor pricing ── */
const competitors = [
  { name: 'Bitwarden Teams',    pricePerUser: 28, usd: '$4/bruger/md.'   },
  { name: '1Password Business', pricePerUser: 56, usd: '$7.99/bruger/md.' },
  { name: 'Dashlane',           pricePerUser: 56, usd: '$8/bruger/md.'   },
]

function getLockmateTier(users: number) {
  if (users <= 5)  return { name: 'Starter',  price: 149 }
  if (users <= 15) return { name: 'Growth',   price: 249 }
  return                  { name: 'Scale', price: 449 }
}

/* ── Feature table ── */
type FVal = boolean | string

const featureRows: { feature: string; lockmate: FVal; bitwarden: FVal; onepassword: FVal; dashlane: FVal }[] = [
  { feature: 'Prismodel',               lockmate: 'Flat månedlig takst', bitwarden: 'Pr. bruger',      onepassword: 'Pr. bruger',     dashlane: 'Pr. bruger'     },
  { feature: 'Maks. brugere (top plan)', lockmate: 'Op til 50',          bitwarden: 'Ubegrænset',      onepassword: 'Ubegrænset',     dashlane: 'Ubegrænset'     },
  { feature: 'AES-256 kryptering',       lockmate: true,                 bitwarden: true,              onepassword: true,             dashlane: true             },
  { feature: 'Zero-knowledge',           lockmate: true,                 bitwarden: true,              onepassword: true,             dashlane: true             },
  { feature: 'Ubegrænsede passwords',    lockmate: true,                 bitwarden: true,              onepassword: true,             dashlane: true             },
  { feature: 'Autofill',                 lockmate: true,                 bitwarden: true,              onepassword: true,             dashlane: true             },
  { feature: 'Import fra andre apps',    lockmate: true,                 bitwarden: true,              onepassword: true,             dashlane: true             },
  { feature: 'Breach monitoring *',       lockmate: 'Growth',           bitwarden: true,              onepassword: true,             dashlane: true             },
  { feature: 'Audit logs **',             lockmate: 'Scale',             bitwarden: true,              onepassword: true,             dashlane: true             },
  { feature: 'Gratis prøveperiode',      lockmate: '30 dage',            bitwarden: 'Gratis tier',     onepassword: '14 dage',        dashlane: '30 dage'        },
  { feature: 'SSO / SAML ***',              lockmate: false,                bitwarden: 'Enterprise',      onepassword: true,             dashlane: true             },
  { feature: 'Avanceret admin-panel',    lockmate: false,                bitwarden: true,              onepassword: true,             dashlane: true             },
  { feature: 'VPN inkluderet',           lockmate: false,                bitwarden: false,             onepassword: false,            dashlane: true             },
]

function Cell({ val }: { val: FVal }) {
  if (val === true)  return <IconCheck size={16} strokeWidth={2.5} className={styles.iconYes} />
  if (val === false) return <IconX     size={16} strokeWidth={2}   className={styles.iconNo}  />
  if (val === '')    return <IconMinus size={16} strokeWidth={1.5} className={styles.iconNeutral} />
  return <span className={styles.cellText}>{val}</span>
}

/* ── Stats ── */
const stats = [
  { num: '449', unit: 'kr/md.', label: 'Maksimalpris. Uanset om I er 16 eller 50 brugere.' },
  { num: '30',  unit: 'dage',   label: 'Gratis prøveperiode. Intet kreditkort kræves.'      },
  { num: '5',   unit: 'min.',   label: 'Onboarding-tid. Fra konto til første vault.'         },
]

export default function ComparisonPage() {
  const [users, setUsers] = useState(20)
  const lockmate    = getLockmateTier(users)
  const compPrices  = competitors.map(c => ({ ...c, total: c.pricePerUser * users }))
  const maxCost     = Math.max(lockmate.price, ...compPrices.map(c => c.total))
  const maxSaving   = Math.max(...compPrices.map(c => c.total)) - lockmate.price

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Prissammenligning – Lockmate</title>
        <meta name="description" content="Sammenlign Lockmate med Bitwarden, 1Password og Dashlane. Se hvordan vores flade månedlige takst kan spare dit team for tusindvis af kroner." />
      </Helmet>
      <div className={styles.container}>
        <header><Navbar /></header>
      </div>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Prissammenligning</span>
          <h1 className={styles.heroTitle}>
            De skalerer prisen<br />med dig. Vi gør ikke.
          </h1>
          <p className={styles.heroSub}>
            Konkurrenter fakturerer pr. bruger – det virker billigt til at starte med. Men når teamet vokser, vokser regningen med. Lockmate har én flat takst. Uanset om I er 5 eller 50.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/register" className={styles.heroPrimary}>Start 30 dage gratis</Link>
            <Link to="/pricing"  className={styles.heroSecondary}>Se prisplaner</Link>
          </div>
        </div>
      </div>

      {/* ── Price calculator ── */}
      <div className={styles.calcSection}>
        <div className={styles.calcInner}>
          <div className={styles.calcHead}>
            <span className={styles.eyebrow}>Beregner</span>
            <h2 className={styles.calcTitle}>Hvad koster det for dit team?</h2>
            <p className={styles.calcSub}>Træk slideren og se hvad du betaler – og hvad du sparer.</p>
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
                  style={{ left: `calc(${(v - 1) / 49} * (100% - 22px) + 11px)` }}
                >
                  <div className={styles.tickMark} />
                  <span className={styles.tickLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {maxSaving > 0 && (
            <div className={styles.savingsCallout}>
              <div className={styles.savingsLeft}>
                <span className={styles.savingsLabel}>Du sparer op til</span>
                <span className={styles.savingsAmount}>{maxSaving} kr/md. <span className={styles.savingsVat}>eks. moms</span></span>
              </div>
              <p className={styles.savingsNote}>
                sammenlignet med det dyreste alternativ ved {users} {users === 1 ? 'bruger' : 'brugere'}
              </p>
            </div>
          )}

          <div className={styles.compareRows}>
            <div className={`${styles.compareRow} ${styles.compareRowLock}`}>
              <div className={styles.rowLeft}>
                <span className={styles.rowName}>Lockmate {lockmate.name}</span>
                <span className={styles.rowTag}>Flat månedlig takst</span>
              </div>
              <div className={styles.rowBarWrap}>
                <div
                  className={`${styles.barFill} ${styles.barGreen}`}
                  style={{ width: `${Math.max(4, (lockmate.price / maxCost) * 100)}%` }}
                />
              </div>
              <span className={styles.rowPrice}>{lockmate.price} kr/md. <span className={styles.rowVat}>eks. moms</span></span>
            </div>

            {compPrices.map(c => (
              <div key={c.name} className={styles.compareRow}>
                <div className={styles.rowLeft}>
                  <span className={styles.rowName}>{c.name}</span>
                  <span className={styles.rowNote}>{c.pricePerUser} kr × {users} {users === 1 ? 'bruger' : 'brugere'}</span>
                </div>
                <div className={styles.rowBarWrap}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${Math.max(4, (c.total / maxCost) * 100)}%` }}
                  />
                </div>
                <span className={`${styles.rowPrice} ${c.total > lockmate.price ? styles.rowPriceDim : ''}`}>
                  {c.total} kr/md.
                </span>
              </div>
            ))}
          </div>

          <div className={styles.calcNoteRow}>
            <p className={styles.calcNote}>
              * Konkurrentpriser omregnet fra USD til DKK (ca. 1 USD = 7 DKK) og er vejledende.{' '}
              {competitors.map((c, i) => (
                <span key={c.name}>{c.name}: {c.usd}{i < competitors.length - 1 ? ' · ' : ''}</span>
              ))}
            </p>
          </div>
        </div>
      </div>

      {/* ── Feature comparison ── */}
      <div className={styles.featureSection}>
        <div className={styles.featureInner}>
          <div className={styles.featureHead}>
            <span className={styles.eyebrow}>Funktioner</span>
            <h2 className={styles.featureTitle}>En ærlig sammenligning</h2>
            <p className={styles.featureSub}>
              Vores konkurrenter har flere features — det er sandt. Men de fleste teams bruger dem aldrig. Vi er bygget til at gøre det grundlæggende rigtigt: simpelt, sikkert og til en forudsigelig pris.
            </p>
          </div>

          <div className={styles.tableWrap}>
            <div className={styles.featureTable}>
              {/* Header */}
              <div className={styles.tableHeader}>
                <div className={styles.thFeature} />
                <div className={`${styles.thCompany} ${styles.thLock}`}>Lockmate</div>
                <div className={styles.thCompany}>Bitwarden</div>
                <div className={styles.thCompany}>1Password</div>
                <div className={styles.thCompany}>Dashlane</div>
              </div>

              {featureRows.map((row) => (
                <div key={row.feature} className={styles.tableRow}>
                  <div className={styles.tdFeature}>{row.feature}</div>
                  <div className={`${styles.tdValue} ${styles.tdLock}`}><Cell val={row.lockmate}    /></div>
                  <div className={styles.tdValue}><Cell val={row.bitwarden}   /></div>
                  <div className={styles.tdValue}><Cell val={row.onepassword} /></div>
                  <div className={styles.tdValue}><Cell val={row.dashlane}    /></div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.featureNotes}>
            <p className={styles.featureNote}>
              * Breach monitoring overvåger om jeres adgangskoder eller e-mails optræder i kendte datalæk. Tilgængeligt fra Growth-planen.
            </p>
            <p className={styles.featureNote}>
              ** Audit logs giver et komplet aktivitetsspor – hvem tilgik hvad og hvornår. Tilgængeligt på Scale-planen.
            </p>
            <p className={styles.featureNote}>
              *** SSO, VPN og avanceret admin er features for enterprise-teams med dedikeret IT. For de fleste 5–50 personers teams er de irrelevante tilføjelser der øger kompleksiteten – og prisen.
            </p>
          </div>
        </div>
      </div>

      {/* ── Why simple wins ── */}
      <div className={styles.whySection}>
        <div className={styles.whyInner}>
          <div className={styles.whyLeft}>
            <span className={styles.eyebrow}>Vores filosofi</span>
            <h2 className={styles.whyTitle}>
              Simpelt. Sikkert.<br />Skalerbart.
            </h2>
            <p className={styles.whyBody}>
              Vi har ikke bygget Lockmate til at konkurrere med enterprise-løsninger til 500 ansatte. Vi har bygget det til dig – et team på 5 til 50 mennesker, der har brug for et password-værktøj der bare virker.
            </p>
            <p className={styles.whyBody}>
              Konkurrenterne har imponerende feature-lister, men de fakturerer pr. hoved. Det betyder, at din regning vokser med hvert nyt teammedlem. Vores pris? Den er den samme, uanset om I er 16 eller 50.
            </p>
            <Link to="/register" className={styles.whyCta}>
              Start gratis i dag <IconArrowNarrowRight size={15} strokeWidth={2} />
            </Link>
          </div>

          <div className={styles.whyRight}>
            {stats.map(s => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statValue}>
                  {s.num}
                  {s.unit && <span className={styles.statUnit}>{s.unit}</span>}
                </div>
                <p className={styles.statLabel}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Klar til at prøve?</h2>
          <p className={styles.ctaSub}>30 dage gratis. Intet kreditkort. Annuller når som helst.</p>
          <div className={styles.ctaBtns}>
            <Link to="/register" className={styles.ctaPrimary}>Opret gratis konto</Link>
            <Link to="/pricing"  className={styles.ctaSecondary}>Se alle prisplaner</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
