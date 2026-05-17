import { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, Link } from 'react-router-dom'
import {
  IconArrowNarrowRight,
  IconArrowNarrowLeft,
  IconUpload,
  IconFileTypeCsv,
  IconFileTypeDoc,
  IconBraces,
  IconX,
  IconCheck,
  IconShieldLock,
} from '@tabler/icons-react'
import styles from './OnboardingImportPage.module.css'
import { API_BASE } from '../config'

const ACCEPTED      = ['.csv', '.txt', '.json']
const ACCEPTED_MIME = ['text/csv', 'text/plain', 'application/json', 'text/json']

interface Vault        { id: string; name: string }
interface ImportedItem { vaultName: string; fileName: string }

export default function OnboardingImportPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [vaults, setVaults]               = useState<Vault[]>([])
  const [vaultsLoading, setVaultsLoading] = useState(true)
  const [selectedId, setSelectedId]       = useState<string | null>(null)
  const [file, setFile]                   = useState<File | null>(null)
  const [dragging, setDragging]           = useState(false)
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState('')
  const [imported, setImported]           = useState<ImportedItem[]>([])

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token') ?? ''
        const orgId = localStorage.getItem('orgId') ?? ''
        const res = await fetch(`${API_BASE}/api/vault/list?organisationId=${orgId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        const list: Vault[] = Array.isArray(data) ? data : []
        setVaults(list)
        if (list.length === 1) setSelectedId(list[0].id)
      } catch { /* silent */ } finally {
        setVaultsLoading(false)
      }
    }
    load()
  }, [])

  function pickFile(f: File) {
    const ext = '.' + f.name.split('.').pop()?.toLowerCase()
    if (!ACCEPTED.includes(ext) && !ACCEPTED_MIME.includes(f.type)) {
      setError('Understøttede formater: CSV, TXT, JSON.')
      return
    }
    setError('')
    setFile(f)
  }

  function onDragOver(e: React.DragEvent) { e.preventDefault(); setDragging(true) }
  function onDragLeave() { setDragging(false) }
  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) pickFile(f)
  }

  async function handleImport() {
    if (!file || !selectedId || loading) return
    setError('')
    setLoading(true)
    try {
      const token     = localStorage.getItem('token') ?? ''
      const orgId     = localStorage.getItem('orgId') ?? ''
      const body      = new FormData()
      body.append('file', file)
      body.append('organisationId', orgId)
      body.append('vaultId', selectedId)
      const res = await fetch(`${API_BASE}/api/import`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body,
      })
      if (!res.ok) {
        const text = await res.text()
        setError(text || 'Import fejlede. Prøv igen.')
        return
      }
      const vaultName = vaults.find(v => v.id === selectedId)?.name ?? selectedId
      setImported(prev => [...prev, { vaultName, fileName: file.name }])
      setFile(null)
      setSelectedId(vaults.length === 1 ? selectedId : null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      setError('Netværksfejl. Tjek din forbindelse.')
    } finally {
      setLoading(false)
    }
  }

  const canImport = !!file && !!selectedId && !loading

  return (
    <div className={styles.page}>
      <Helmet><title>Importer – Lockmate</title></Helmet>

      <div className={styles.inner}>
        <div className={styles.head}>
          <Link to="/onboarding/vaults" className={styles.backLink}>
            <IconArrowNarrowLeft size={14} strokeWidth={2} />
            Tilbage til vaults
          </Link>
          <h1 className={styles.title}>Importer dine loginoplysninger</h1>
          <p className={styles.subtitle}>
            Vælg en vault og upload din eksportfil. <br />
            Understøttede formater: CSV, TXT og JSON.
          </p>
        </div>

        {/* ── Completed imports ── */}
        {imported.length > 0 && (
          <div className={styles.importedList}>
            {imported.map((item, i) => (
              <div key={i} className={styles.importedItem}>
                <div className={styles.importedCheck}>
                  <IconCheck size={11} strokeWidth={3} />
                </div>
                <span className={styles.importedText}>
                  <strong>{item.fileName}</strong> importeret til <strong>{item.vaultName}</strong>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Step 1: vault picker ── */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>
            <span className={styles.stepNum}>1</span>
            Vælg vault
          </span>

          {vaultsLoading ? (
            <div className={styles.vaultsLoading}>Henter vaults…</div>
          ) : vaults.length === 0 ? (
            <div className={styles.noVaults}>
              Du har ingen vaults endnu. Gå{' '}
              <Link to="/onboarding/vaults" className={styles.inlineLink}>
                tilbage og opret en vault
              </Link>{' '}
              før du importerer.
            </div>
          ) : (
            <div className={styles.vaultChips}>
              {vaults.map(v => (
                <button
                  key={v.id}
                  className={`${styles.vaultChip} ${selectedId === v.id ? styles.vaultChipSelected : ''}`}
                  onClick={() => setSelectedId(v.id)}
                >
                  <IconShieldLock size={13} strokeWidth={1.75} className={styles.chipIcon} />
                  {v.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Step 2: file upload ── */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>
            <span className={styles.stepNum}>2</span>
            Upload fil
            <span className={styles.formatPills}>
              <span className={styles.fmt}><IconFileTypeCsv size={12} strokeWidth={2} />CSV</span>
              <span className={styles.fmt}><IconFileTypeDoc size={12} strokeWidth={2} />TXT</span>
              <span className={styles.fmt}><IconBraces size={12} strokeWidth={2} />JSON</span>
            </span>
          </span>

          <div
            className={`${styles.dropZone} ${dragging ? styles.dropZoneDragging : ''} ${file ? styles.dropZoneHasFile : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => !file && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && !file && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED.join(',')}
              className={styles.fileInput}
              onChange={e => { const f = e.target.files?.[0]; if (f) pickFile(f) }}
            />

            {file ? (
              <div className={styles.filePreview}>
                <div className={styles.fileInfo}>
                  <div className={styles.fileIconWrap}>
                    <IconUpload size={15} strokeWidth={1.75} />
                  </div>
                  <div className={styles.fileMeta}>
                    <span className={styles.fileName}>{file.name}</span>
                    <span className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
                <button
                  className={styles.removeFileBtn}
                  onClick={e => { e.stopPropagation(); setFile(null) }}
                  aria-label="Fjern fil"
                >
                  <IconX size={13} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <div className={styles.dropPrompt}>
                <div className={styles.dropIcon}>
                  <IconUpload size={20} strokeWidth={1.5} />
                </div>
                <span className={styles.dropText}>Træk en fil hertil</span>
                <span className={styles.dropOr}>
                  eller <span className={styles.dropBrowse}>vælg fra computer</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {/* ── Actions ── */}
        <div className={styles.actions}>
          <button
            className={styles.importBtn}
            onClick={handleImport}
            disabled={!canImport}
          >
            {loading ? 'Importerer…' : 'Importer til vault'}
            {!loading && <IconCheck size={14} strokeWidth={2.5} />}
          </button>
          <button
            className={styles.continueBtn}
            onClick={() => navigate('/app/dashboard')}
          >
            {imported.length > 0 ? 'Fortsæt til dashboard' : 'Spring over'}
            <IconArrowNarrowRight size={15} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}
