import { useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, Link } from 'react-router-dom'
import { IconArrowNarrowRight, IconCircleCheck, IconArrowNarrowLeft } from '@tabler/icons-react'
import styles from './InviteCodePage.module.css'
import { API_BASE } from '../config'

const CODE_LENGTH = 7

export default function InviteCodePage() {
  const navigate = useNavigate()
  const [chars,   setChars]   = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [sent,    setSent]    = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  function update(index: number, value: string) {
    const char = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-1)
    const next = [...chars]
    next[index] = char
    setChars(next)
    if (char && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (chars[index]) {
        const next = [...chars]
        next[index] = ''
        setChars(next)
      } else if (index > 0) {
        inputs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, CODE_LENGTH)
    const next = [...chars]
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setChars(next)
    const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1)
    inputs.current[focusIndex]?.focus()
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')

    const code = chars.join('')
    if (code.length < CODE_LENGTH) {
      setError('Indtast den fulde invitationskode.')
      return
    }

    const token = localStorage.getItem('token') ?? ''
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/organisation/add-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(code),
      })

      if (!res.ok) {
        const text = await res.text()
        setError(text || `Fejl ${res.status}. Prøv igen.`)
        return
      }

      setSent(true)
    } catch {
      setError('Kunne ikke forbinde til serveren. Tjek din forbindelse.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Brug invitationskode – Lockmate</title>
      </Helmet>

      <div className={styles.inner}>
        {sent ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <IconCircleCheck size={40} strokeWidth={1.5} />
            </div>
            <div className={styles.head}>
              <h1 className={styles.title}>Anmodning sendt</h1>
              <p className={styles.subtitle}>
                Ejeren af organisationen vil modtage din anmodning og give dig adgang.
              </p>
            </div>
            <button className={styles.submitBtn} onClick={() => navigate('/app/dashboard')}>
              Udforsk Lockmate imens
              <IconArrowNarrowRight size={16} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <>
            <div className={styles.head}>
              <Link to="/onboarding" className={styles.backLink}>
                <IconArrowNarrowLeft size={14} strokeWidth={2} />
                Tilbage til valgmuligheder
              </Link>
              <h1 className={styles.title}>Brug invitationskode</h1>
              <p className={styles.subtitle}>Indtast koden du har modtaget fra din administrator.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.codeRow} onPaste={handlePaste}>
                {chars.map((ch, i) => (
                  <input
                    key={i}
                    ref={el => { inputs.current[i] = el }}
                    className={styles.codeBox}
                    type="text"
                    inputMode="text"
                    maxLength={2}
                    value={ch}
                    onChange={e => update(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    onFocus={e => e.target.select()}
                    autoComplete="off"
                    spellCheck={false}
                  />
                ))}
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Anmoder om adgang...' : 'Anmod om adgang'}
                {!loading && <IconArrowNarrowRight size={16} strokeWidth={2} />}
              </button>

              <p className={styles.hint}>
                Har du ikke modtaget en kode? Kontakt din administrator.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
