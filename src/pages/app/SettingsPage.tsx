import { IconSettings } from '@tabler/icons-react'
import styles from './PlaceholderPage.module.css'

export default function SettingsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageSubtitle}>Manage your account, security, and preferences.</p>
        </div>
      </div>

      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <IconSettings size={24} strokeWidth={1.5} />
        </div>
        <p className={styles.emptyTitle}>Settings coming soon</p>
        <p className={styles.emptyDesc}>Account, security, and notification settings will live here.</p>
      </div>
    </div>
  )
}
