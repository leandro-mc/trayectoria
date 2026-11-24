/**
 * Única fuente de configuración de entorno del frontend: ningún otro archivo de src/
 * lee `process.env`. Todas las variables son `NEXT_PUBLIC_*`, o sea que se HORNEAN en el
 * bundle durante `next build`: cambiar una exige volver a compilar y desplegar.
 *
 * Cada variable se referencia con su nombre literal (no con `process.env[name]`) porque
 * Next solo reemplaza en el bundle del navegador las referencias escritas así.
 */

/** Solo para `next dev`. Una build de producción nunca cae acá: `findEnvProblem` la rechaza. */
const DEV_API_URL = 'http://localhost:8080/api'

/** `next dev` (hot reload, devtools). `false` in any build. */
export const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Modo demo: el frontend no habla con ningún backend; responde una capa mock con datos
 * ficticios (ver docs/demo-mode.md). Solo el valor exacto `true` lo activa.
 *
 * Es una constante de compilación: next.config.ts siempre define la variable (por defecto
 * `false`), así el bundler descarta las ramas `if (isDemoMode)` y el código de `src/demo`
 * no llega al bundle cuando el demo está inactivo.
 */
export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

/**
 * URL base del backend, sin barra final y sin `/v1`. En demo es '' a propósito: ninguna
 * petición debe poder apuntar a un servidor real, ni siquiera por error.
 */
export const apiUrl = isDemoMode
  ? ''
  : (process.env.NEXT_PUBLIC_API_URL?.trim() || DEV_API_URL).replace(/\/+$/, '')

/**
 * Describe qué está mal en la configuración, o `null` si está bien. La usa next.config.ts
 * para frenar `next build` con un mensaje claro en vez de generar un bundle que apunta
 * en silencio a localhost.
 */
export function findEnvProblem(): string | null {
  const demo = process.env.NEXT_PUBLIC_DEMO_MODE?.trim()
  if (demo && demo !== 'true' && demo !== 'false') {
    return `NEXT_PUBLIC_DEMO_MODE debe ser "true" o "false" (valor recibido: "${demo}").`
  }

  if (demo !== 'true' && !process.env.NEXT_PUBLIC_API_URL?.trim()) {
    return [
      'Falta NEXT_PUBLIC_API_URL y el modo demo está inactivo.',
      '  - Para conectar un backend:  NEXT_PUBLIC_API_URL=https://tu-backend.example.com/api',
      '  - Para publicar sin backend: NEXT_PUBLIC_DEMO_MODE=true',
      'Detalle en docs/demo-mode.md.',
    ].join('\n')
  }

  return null
}
