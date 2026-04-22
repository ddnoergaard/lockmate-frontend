import styles from './StatsSection.module.css'

const points = [
  {
    title: 'Vi ser aldrig dine data',
    body: 'Alle loginoplysninger er krypteret på din enhed, inden de når vores servere. Zero-knowledge betyder præcis det.',
  },
  {
    title: 'Bygget til den måde teams faktisk arbejder',
    body: 'Delte vaults, rollebaseret adgang og revisionslogge. Ingen enterprise-priser, ingen seks måneders onboarding.',
  },
  {
    title: 'Sikkerhed der ikke bremser dig',
    body: 'Autofill med ét klik, øjeblikkelig søgning og en browserudvidelse der holder sig i baggrunden, indtil du har brug for den.',
  },
]

export default function StatsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        {/* Left — abstract visual */}
        <div className={styles.visual}>
          <div className={styles.glow} />
          <div className={styles.dotGrid}>
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className={styles.cell} />
            ))}
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Zero-knowledge arkitektur
          </div>
        </div>

        {/* Right — copy */}
        <div className={styles.content}>
          <p className={styles.eyebrow}>Vores tilgang</p>
          <h2 className={styles.heading}>
            Sikkerhed bør ikke være<br />et kompromis
          </h2>
          <div className={styles.points}>
            {points.map((p) => (
              <div key={p.title} className={styles.point}>
                <span className={styles.pointTitle}>{p.title}</span>
                <p className={styles.pointBody}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
