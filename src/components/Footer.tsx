import { IconArrowUp } from '@tabler/icons-react'
import styles from './Footer.module.css'

const products = ['Funktioner', 'Priser', 'Sikkerhed', 'FAQ', 'Køreplan']
const resources = ['Blog', 'Hjælpecenter', 'API-dokumentation', 'Browserudvidelse', 'Download apps']

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <span className={styles.logo}>Lockmate</span>
            <div className={styles.meta}>
              <span>CVR: DKXXXXXXXXXX</span>
              <span>Mail: Contact@lockhub.com</span>
              <span>Phone: +4512345678</span>
              <span>Address: None of ya business</span>
            </div>
            <button className={styles.backToTop} onClick={scrollToTop}>
              <IconArrowUp size={13} strokeWidth={2.5} />
              Tilbage til toppen
            </button>
          </div>

          {/* Links */}
          <div className={styles.linkGroup}>
            <span className={styles.groupLabel}>Produkter</span>
            <ul className={styles.linkList}>
              {products.map((l) => (
                <li key={l}><a href="#" className={styles.link}>{l}</a></li>
              ))}
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <span className={styles.groupLabel}>Ressourcer</span>
            <ul className={styles.linkList}>
              {resources.map((l) => (
                <li key={l}><a href="#" className={styles.link}>{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© 2026 Lockmate. Alle rettigheder forbeholdes.</span>
        </div>
      </div>
    </footer>
  )
}
