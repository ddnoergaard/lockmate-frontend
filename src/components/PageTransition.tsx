import { useLocation } from 'react-router-dom'
import styles from './PageTransition.module.css'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  return (
    <div key={pathname} className={styles.wrap}>
      {children}
    </div>
  )
}
