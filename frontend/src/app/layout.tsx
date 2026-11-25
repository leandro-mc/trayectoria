import type { Metadata } from 'next'
import './globals.css'
import { AppFrame } from '@/components/shared/layout/AppFrame'
import { Providers } from '@/components/shared/layout/Providers'

export const metadata: Metadata = {
  title: {
    default:  'TrayectorIA — Tu carrera, impulsada por IA',
    template: '%s | TrayectorIA',
  },
  description:
    'Plataforma de networking laboral potenciada por inteligencia artificial. Conectamos candidatos con empresas.',
  keywords: ['empleos', 'trabajo', 'IA', 'currículum', 'entrevistas', 'networking'],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground min-h-dvh flex flex-col">
        <AppFrame>
          <Providers>
            {children}
          </Providers>
        </AppFrame>
      </body>
    </html>
  )
}
