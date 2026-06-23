import { IconUserCircle } from '@tabler/icons-react'
import styles from './PlaceholderPage.module.css'

export default function AccountPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Account</h1>
          <p className={styles.pageSubtitle}>Manage your profile, password, and personal preferences.</p>
        </div>
      </div>

      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <IconUserCircle size={24} strokeWidth={1.5} />
        </div>
        <p className={styles.emptyTitle}>Account coming soon</p>
        <p className={styles.emptyDesc}>Profile details, password changes, and preferences will live here.</p>
      </div>
    </div>
  )
}
