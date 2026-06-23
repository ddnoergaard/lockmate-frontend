//export const API_BASE = 'https://api.lockmate.dk' //PROD ENV
export const API_BASE = 'https://localhost:7014' //DEV ENV

// Root URL of the vault app. Set VITE_APP_URL in Vercel env for production.
export const APP_URL = (import.meta.env.VITE_APP_URL as string | undefined) ?? 'http://localhost:5173'
