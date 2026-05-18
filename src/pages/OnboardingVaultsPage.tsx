import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, Link } from 'react-router-dom'
import {
  IconArrowNarrowRight,
  IconShieldLock,
  IconPencil,
  IconX,
} from '@tabler/icons-react'
import styles from './OnboardingVaultsPage.module.css'
import { API_BASE } from '../config'

interface Vault {
  localId: number
  name: string
}

let counter = 0

export default function OnboardingVaultsPage() {
  const navigate = useNavigate()
  const [input, setInput]           = useState('')
  const [vaults, setVaults]         = useState<Vault[]>([])
  const [editingId, setEditingId]   = useState<number | null>(null)
  const [editValue, setEditValue]   = useState('')
  const [continuing, setContinuing] = useState(false)
  const [error, setError]           = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleAdd() {
    const name = input.trim()
    if (!name) return
    if (vaults.length >= 50) { setError('Du kan højst oprette 50 vaults under onboarding.'); return }
    if (name.length > 30) { setError('Vault navn må højst være 30 tegn.'); return }
    setError('')
    setVaults(prev => [...prev, { localId: ++counter, name }])
    setInput('')
    inputRef.current?.focus()
  }

  function handleDelete(localId: number) {
    setVaults(prev => prev.filter(v => v.localId !== localId))
  }

  function startEdit(vault: Vault) {
    setEditingId(vault.localId)
    setEditValue(vault.name)
  }

  function saveEdit(localId: number) {
    const name = editValue.trim()
    if (name) setVaults(prev => prev.map(v => v.localId === localId ? { ...v, name } : v))
    setEditingId(null)
  }

  async function handleContinue() {
    if (continuing) return
    setError('')

    if (vaults.length === 0) {
      navigate('/onboarding/import')
      return
    }

    setContinuing(true)
    try {
      const token = localStorage.getItem('token') ?? ''
      const res = await fetch(`${API_BASE}/api/vault/onboarding-vault-create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(vaults.map(v => ({ name: v.name }))),
      })
      if (!res.ok) {
        const text = await res.text()
        setError(text || 'Kunne ikke gemme vaults. Prøv igen.')
        return
      }
      navigate('/onboarding/import')
    } catch {
      setError('Netværksfejl. Tjek din forbindelse.')
    } finally {
      setContinuing(false)
    }
  }

  return (
    <div className={styles.page}>
      <Helmet><title>Opret vaults – Lockmate</title></Helmet>

      <div className={styles.inner}>
        <div className={styles.head}>
          <h1 className={styles.title}>Lad os få lavet dine første vaults</h1>
          <p className={styles.subtitle}>
            Vaults holder loginoplysninger organiseret efter team eller projekt.
            Du kan altid oprette og redigere vaults fra dit dashboard.
          </p>
        </div>

        {/* Input row */}
        <form
          className={styles.inputRow}
          onSubmit={e => { e.preventDefault(); handleAdd() }}
        >
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Vault navn...."
            value={input}
            onChange={e => setInput(e.target.value)}
            maxLength={30}
            autoFocus
            autoComplete="off"
          />
          <button
            type="submit"
            className={styles.addBtn}
            disabled={!input.trim() || vaults.length >= 50}
            aria-label="Tilføj vault"
          >
            <IconArrowNarrowRight size={18} strokeWidth={2} />
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        {/* Vault tiles */}
        {vaults.length > 0 && (
          <div className={styles.tilesSection}>
            <span className={styles.tilesLabel}>Oprettede vaults: {vaults.length} / 50</span>
            <div className={styles.tiles}>
              {vaults.map(vault => (
                <div key={vault.localId} className={styles.tile}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(vault.localId)}
                    aria-label={`Slet ${vault.name}`}
                  >
                    <IconX size={9} strokeWidth={3} />
                  </button>

                  <div className={styles.tileIcon}>
                    <IconShieldLock size={26} strokeWidth={1.25} />
                  </div>

                  {editingId === vault.localId ? (
                    <form
                      className={styles.editForm}
                      onSubmit={e => { e.preventDefault(); saveEdit(vault.localId) }}
                    >
                      <input
                        className={styles.editInput}
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={() => saveEdit(vault.localId)}
                        autoFocus
                      />
                    </form>
                  ) : (
                    <span className={styles.tileName}>{vault.name}</span>
                  )}

                  {editingId !== vault.localId && (
                    <button
                      className={styles.editBtn}
                      onClick={() => startEdit(vault)}
                      aria-label={`Rediger ${vault.name}`}
                    >
                      <IconPencil size={11} strokeWidth={2} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom actions */}
        <div className={styles.actions}>
          <button
            className={styles.continueBtn}
            onClick={handleContinue}
            disabled={continuing}
          >
            {continuing ? 'Gemmer...' : 'Fortsæt'}
            {!continuing && <IconArrowNarrowRight size={15} strokeWidth={2} />}
          </button>
          <Link to="/app/dashboard" className={styles.skipLink}>
            Spring onboarding over
          </Link>
        </div>
      </div>
    </div>
  )
}
