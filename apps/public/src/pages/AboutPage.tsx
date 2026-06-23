import { Helmet } from 'react-helmet-async'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from './AboutPage.module.css'

const founders = [
  {
    name: 'Anton',
    role: 'Medstifter',
    bio: 'Placeholder bio for Anton. Background, vision, what drives them to build Lockmate.',
  },
  {
    name: 'Daniel',
    role: 'Medstifter',
    bio: 'Placeholder bio for Daniel. Background, vision, what drives them to build Lockmate.',
  },
]

const values = [
  {
    label: 'Privatliv først',
    body: 'Zero-knowledge by design. Vi bygger hver funktion, så dine data forbliver dine. Vi ser dem aldrig.',
  },
  {
    label: 'Bygget til teams',
    body: 'Individuelle værktøjer fungerer aldrig godt i en teamkontekst. Lockmate er bygget fra bunden til samarbejde.',
  },
  {
    label: 'Ingen oppustethed',
    body: 'Vi fjerner enhver funktion der ikke tjener et formål. Hurtigt, fokuseret og ude af din vej.',
  },
  {
    label: 'Gennemsigtig',
    body: 'Åbne priser, ærlige sikkerhedspåstande og ingen mørke mønstre. Det du ser, er det du får.',
  },
]

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <Helmet>
        <title>Om os – Lockmate</title>
        <meta name="description" content="Mød teamet bag Lockmate. Vi byggede en adgangskodemanager der faktisk er til at forstå – skabt til teams der tager sikkerhed seriøst." />
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <Navbar />
        </header>
      </div>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.inner}>
          <span className={styles.label}>Om os</span>
          <h1 className={styles.heading}>
            Bygget af folk der blev<br />trætte af dårlige værktøjer
          </h1>
          <p className={styles.sub}>
            Lockmate startede fordi vi ikke kunne finde en adgangskodemanager der faktisk virkede for et voksende team. Alt var enten for simpelt, for dyrt eller for enterprise. Så vi byggede vores eget.
          </p>
        </div>
      </section>

      {/* ── Team ── */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.label}>Teamet</span>
          <h2 className={styles.sectionHeading}>De to mennesker bag det</h2>

          <div className={styles.founderGrid}>
            {founders.map((f) => (
              <div key={f.name} className={styles.founderCard}>
                <div className={styles.founderPhoto}>
                  <span className={styles.founderPhotoLabel}>Foto kommer snart</span>
                </div>
                <div className={styles.founderInfo}>
                  <div>
                    <h3 className={styles.founderName}>{f.name}</h3>
                    <span className={styles.founderRole}>{f.role}</span>
                  </div>
                  <p className={styles.founderBio}>{f.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.label}>Hvad vi tror på</span>
          <h2 className={styles.sectionHeading}>Principperne vi bygger efter</h2>

          <div className={styles.valuesGrid}>
            {values.map((v) => (
              <div key={v.label} className={styles.valueCard}>
                <h3 className={styles.valueLabel}>{v.label}</h3>
                <p className={styles.valueBody}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
