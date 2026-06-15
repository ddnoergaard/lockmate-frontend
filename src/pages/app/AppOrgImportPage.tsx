import { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, Link } from 'react-router-dom'
import {
  IconArrowNarrowRight, IconArrowNarrowLeft,
  IconUpload, IconFileTypeCsv, IconFileTypeDoc, IconBraces,
  IconX, IconCheck, IconShieldLock,
} from '@tabler/icons-react'
import styles from '../OnboardingImportPage.module.css'
import { API_BASE } from '../../config'

type TargetField = 'name' | 'username' | 'password' | 'url' | 'ignore'

interface Vault        { id: string; name: string }
interface ImportedItem { vaultName: string; fileName: string }
interface ParsedFile   { columns: string[]; rows: Record<string, string>[] }

const ACCEPTED      = ['.csv', '.txt', '.json']
const ACCEPTED_MIME = ['text/csv', 'text/plain', 'application/json', 'text/json']

const FIELD_LABELS: Record<TargetField, string> = {
  name: 'Navn', username: 'Brugernavn', password: 'Adgangskode', url: 'URL', ignore: 'Ignorer',
}

const FIELD_HINTS: Partial<Record<TargetField, string[]>> = {
  name:     ['name', 'title', 'label', 'service', 'account', 'entry', 'site', 'description'],
  username: ['username', 'user', 'email', 'mail', 'emailaddress'],
  password: ['password', 'pass', 'passwd', 'pwd', 'secret', 'passcode'],
  url:      ['url', 'uri', 'uris', 'website', 'link', 'web'],
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = []; let field = ''; let inQuote = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { if (inQuote && line[i + 1] === '"') { field += '"'; i++ } else inQuote = !inQuote }
    else if (ch === ',' && !inQuote) { fields.push(field.trim()); field = '' }
    else field += ch
  }
  fields.push(field.trim()); return fields
}

function parseCSV(text: string): ParsedFile {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim())
  if (lines.length === 0) return { columns: [], rows: [] }
  const columns = parseCSVLine(lines[0])
  const rows = lines.slice(1).map(line => {
    const vals = parseCSVLine(line)
    return Object.fromEntries(columns.map((c, i) => [c, vals[i] ?? '']))
  })
  return { columns, rows }
}

function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    const k = prefix ? `${prefix}.${key}` : key
    if (value === null || value === undefined) result[k] = ''
    else if (Array.isArray(value)) {
      if (value.length === 0) result[k] = ''
      else if (typeof value[0] === 'object' && value[0] !== null)
        Object.assign(result, flattenObject(value[0] as Record<string, unknown>, k))
      else result[k] = value.join(', ')
    } else if (typeof value === 'object') Object.assign(result, flattenObject(value as Record<string, unknown>, k))
    else result[k] = String(value)
  }
  return result
}

function flattenArray(arr: Record<string, unknown>[]): ParsedFile {
  if (arr.length === 0) return { columns: [], rows: [] }
  const rows = arr.map(item => flattenObject(item))
  const columns = Object.keys(rows[0])
  return { columns, rows: rows.map(r => Object.fromEntries(columns.map(c => [c, r[c] ?? '']))) }
}

function parseJSON(text: string): ParsedFile {
  const data = JSON.parse(text)
  if (Array.isArray(data)) return flattenArray(data as Record<string, unknown>[])
  if (typeof data === 'object' && data !== null) {
    let best: Record<string, unknown>[] = []
    for (const value of Object.values(data as Record<string, unknown>))
      if (Array.isArray(value) && value.length > best.length && typeof value[0] === 'object')
        best = value as Record<string, unknown>[]
    return best.length > 0 ? flattenArray(best) : flattenArray([data as Record<string, unknown>])
  }
  return { columns: [], rows: [] }
}

function parseFileContent(text: string, ext: string): ParsedFile {
  return ext === 'json' ? parseJSON(text) : parseCSV(text)
}

function autoMap(col: string): TargetField {
  const segs = col.toLowerCase().split(/[._\-\s]+/)
  const ordered = [segs[segs.length - 1], ...segs.slice(0, -1)]
  for (const seg of ordered)
    for (const [field, hints] of Object.entries(FIELD_HINTS) as [TargetField, string[]][])
      if (hints!.includes(seg)) return field
  return 'ignore'
}

function analyseValues(values: string[]): TargetField {
  const non = values.map(v => v.trim()).filter(Boolean)
  if (non.length === 0) return 'ignore'
  if (non.every(v => /^https?:\/\//i.test(v))) return 'url'
  if (non.filter(v => v.includes('@') && v.includes('.')).length >= Math.ceil(non.length / 2)) return 'username'
  return 'ignore'
}

export default function AppOrgImportPage() {
  const navigate    = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [vaults,        setVaults]        = useState<Vault[]>([])
  const [vaultsLoading, setVaultsLoading] = useState(true)
  const [selectedId,    setSelectedId]    = useState<string | null>(null)
  const [file,          setFile]          = useState<File | null>(null)
  const [dragging,      setDragging]      = useState(false)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')
  const [imported,      setImported]      = useState<ImportedItem[]>([])

  const [columns,     setColumns]     = useState<string[]>([])
  const [sampleRow,   setSampleRow]   = useState<Record<string, string>>({})
  const [allRows,     setAllRows]     = useState<Record<string, string>[]>([])
  const [mapping,     setMapping]     = useState<Record<string, TargetField>>({})
  const [mapperReady, setMapperReady] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token') ?? ''
        const res = await fetch(`${API_BASE}/api/vault/vaults-by-orgId`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        const list: Vault[] = Array.isArray(data) ? data : []
        setVaults(list)
        if (list.length === 1) setSelectedId(list[0].id)
      } catch { } finally { setVaultsLoading(false) }
    }
    load()
  }, [])

  function resetFile() {
    setFile(null); setMapperReady(false); setColumns([]); setSampleRow({}); setAllRows([]); setMapping({})
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function pickFile(f: File) {
    const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
    if (!ACCEPTED.includes('.' + ext) && !ACCEPTED_MIME.includes(f.type)) {
      setError('Understøttede formater: CSV, TXT, JSON.'); return
    }
    setError(''); setFile(f); setMapperReady(false)
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const parsed = parseFileContent(e.target?.result as string, ext)
        if (parsed.columns.length === 0) { setError('Filen ser ud til at være tom eller har et ukendt format.'); return }
        const initMapping: Record<string, TargetField> = Object.fromEntries(
          parsed.columns.map(c => {
            const byHeader = autoMap(c)
            if (byHeader !== 'ignore') return [c, byHeader]
            return [c, analyseValues(parsed.rows.slice(0, 5).map(r => r[c] ?? ''))]
          })
        )
        setColumns(parsed.columns); setSampleRow(parsed.rows[0] ?? {}); setAllRows(parsed.rows)
        setMapping(initMapping); setMapperReady(true)
      } catch { setError('Kunne ikke læse filen. Kontrollér formatet.') }
    }
    reader.readAsText(f)
  }

  function onDragOver(e: React.DragEvent)  { e.preventDefault(); setDragging(true) }
  function onDragLeave()                    { setDragging(false) }
  function onDrop(e: React.DragEvent) { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) pickFile(f) }

  async function handleImport() {
    if (!selectedId || loading || !mapperReady) return
    setError('')
    const credentials = allRows
      .map(row => {
        const cred: Record<string, string> = { name: '', username: '', password: '', url: '' }
        Object.entries(mapping).forEach(([col, field]) => { if (field !== 'ignore') cred[field] = row[col] ?? '' })
        return cred
      })
      .filter(c => c.name || c.username || c.password)

    if (credentials.length === 0) { setError('Ingen gyldige legitimationsoplysninger fundet med den valgte kortlægning.'); return }

    setLoading(true)
    try {
      const token = localStorage.getItem('token') ?? ''
      const res = await fetch(`${API_BASE}/api/credential/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ vaultId: selectedId, credentials }),
      })
      if (!res.ok) { setError((await res.text()) || 'Import fejlede. Prøv igen.'); return }
      const vaultName = vaults.find(v => v.id === selectedId)?.name ?? selectedId
      setImported(prev => [...prev, { vaultName, fileName: file!.name }])
      resetFile()
      if (vaults.length !== 1) setSelectedId(null)
    } catch { setError('Netværksfejl. Tjek din forbindelse.') }
    finally { setLoading(false) }
  }

  const canImport = !!selectedId && mapperReady && !loading
  const credentialCount = mapperReady
    ? allRows.map(row => {
        const c: Record<string, string> = {}
        Object.entries(mapping).forEach(([col, f]) => { if (f !== 'ignore') c[f] = row[col] ?? '' })
        return c
      }).filter(c => c.name || c.username || c.password).length
    : 0

  return (
    <div className={styles.page}>
      <Helmet><title>Importer – Lockmate</title></Helmet>

      <div className={`${styles.inner} ${mapperReady ? styles.innerWide : ''}`}>
        <div className={styles.head}>
          <Link to="/app/organisation/vaults" className={styles.backLink}>
            <IconArrowNarrowLeft size={14} strokeWidth={2} />
            Tilbage til vaults
          </Link>
          <h1 className={styles.title}>Importer dine loginoplysninger</h1>
          <p className={styles.subtitle}>
            Vælg en vault og upload din eksportfil.<br />
            Understøttede formater: CSV, TXT og JSON.
          </p>
        </div>

        {imported.length > 0 && (
          <div className={styles.importedList}>
            {imported.map((item, i) => (
              <div key={i} className={styles.importedItem}>
                <div className={styles.importedCheck}><IconCheck size={11} strokeWidth={3} /></div>
                <span className={styles.importedText}>
                  <strong>{item.fileName}</strong> importeret til <strong>{item.vaultName}</strong>
                </span>
              </div>
            ))}
          </div>
        )}

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
              <Link to="/app/organisation/vaults" className={styles.inlineLink}>
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
            onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            onClick={() => !file && fileInputRef.current?.click()}
            role="button" tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && !file && fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept={ACCEPTED.join(',')} className={styles.fileInput}
              onChange={e => { const f = e.target.files?.[0]; if (f) pickFile(f) }} />
            {file ? (
              <div className={styles.filePreview}>
                <div className={styles.fileInfo}>
                  <div className={styles.fileIconWrap}><IconUpload size={15} strokeWidth={1.75} /></div>
                  <div className={styles.fileMeta}>
                    <span className={styles.fileName}>{file.name}</span>
                    <span className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB · {allRows.length} rækker</span>
                  </div>
                </div>
                <button className={styles.removeFileBtn} onClick={e => { e.stopPropagation(); resetFile() }} aria-label="Fjern fil">
                  <IconX size={13} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <div className={styles.dropPrompt}>
                <div className={styles.dropIcon}><IconUpload size={20} strokeWidth={1.5} /></div>
                <span className={styles.dropText}>Træk en fil hertil</span>
                <span className={styles.dropOr}>eller <span className={styles.dropBrowse}>vælg fra computer</span></span>
              </div>
            )}
          </div>
        </div>

        {mapperReady && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              <span className={styles.stepNum}>3</span>
              Kortlæg felter
              <span className={styles.rowCount}>{allRows.length} rækker</span>
              {credentialCount > 0 && <span className={styles.credCount}>{credentialCount} klar til import</span>}
            </span>
            <div className={styles.mapper}>
              <div className={styles.mapperHeader}>
                <span className={styles.mapperHeaderCell}>Kolonne i fil</span>
                <span />
                <span className={styles.mapperHeaderCell}>Lockmate felt</span>
              </div>
              {columns.map(col => (
                <div key={col} className={styles.mapperRow}>
                  <div className={styles.sourceCell}>
                    <span className={styles.sourceColName}>{col}</span>
                    {sampleRow[col] && <span className={styles.sourceSample}>{sampleRow[col]}</span>}
                  </div>
                  <span className={styles.mapArrow}>→</span>
                  <select
                    className={`${styles.mapSelect} ${mapping[col] !== 'ignore' ? styles.mapSelectActive : ''}`}
                    value={mapping[col]}
                    onChange={e => setMapping(prev => ({ ...prev, [col]: e.target.value as TargetField }))}
                  >
                    <option value="ignore">— Ignorer</option>
                    {(['name', 'username', 'password', 'url'] as TargetField[]).map(field => {
                      const takenBy = Object.entries(mapping).find(([c, f]) => c !== col && f === field)
                      return (
                        <option key={field} value={field} disabled={!!takenBy}>
                          {FIELD_LABELS[field]}{takenBy ? ' (brugt)' : ''}
                        </option>
                      )
                    })}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button className={styles.importBtn} onClick={handleImport} disabled={!canImport}>
            {loading ? 'Importerer…' : credentialCount > 0 ? `Importer ${credentialCount} loginoplysninger` : 'Importer til vault'}
            {!loading && <IconCheck size={14} strokeWidth={2.5} />}
          </button>
          <button className={styles.continueBtn} onClick={() => navigate('/app/organisation')}>
            {imported.length > 0 ? 'Fortsæt til organisation' : 'Spring over'}
            <IconArrowNarrowRight size={15} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}
