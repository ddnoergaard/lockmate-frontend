const enc = new TextEncoder()

function toBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}

export function fromBase64(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0))
}

export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16))
}

async function pbkdf2(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    256,
  )
}

// Registration: generate salt + derive key. Returns base64-encoded values ready for the API.
export async function prepareRegistration(password: string): Promise<{ derivedPassword: string; salt: string }> {
  const salt = generateSalt()
  const derived = await pbkdf2(password, salt)
  return { derivedPassword: toBase64(derived), salt: toBase64(salt) }
}

// Login: derive key from password using the salt fetched from the server.
export async function prepareLogin(password: string, saltB64: string): Promise<string> {
  const derived = await pbkdf2(password, fromBase64(saltB64))
  return toBase64(derived)
}
