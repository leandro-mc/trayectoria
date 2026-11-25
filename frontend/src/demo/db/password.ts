/**
 * 53-bit string hash (cyrb53). NOT cryptography: it only keeps a password the visitor typed
 * while registering from sitting readable in sessionStorage. Synchronous on purpose:
 * crypto.subtle is unavailable on plain-http origins such as a LAN dev server.
 */
export function hashPassword(password: string): string {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < password.length; i++) {
    const code = password.charCodeAt(i)
    h1 = Math.imul(h1 ^ code, 2654435761)
    h2 = Math.imul(h2 ^ code, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36)
}
