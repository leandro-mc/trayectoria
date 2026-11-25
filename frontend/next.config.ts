import type { NextConfig } from 'next'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { findEnvProblem, isDemoMode } from './src/config/env'

export default function config(phase: string): NextConfig {
  // Fail the production build early and loudly instead of shipping a bundle that
  // silently points at localhost. `next dev` keeps its localhost fallback.
  if (phase === PHASE_PRODUCTION_BUILD) {
    const problem = findEnvProblem()
    if (problem) throw new Error(`\n\nConfiguración de entorno inválida:\n${problem}\n`)
  }

  return {
    // Docker builds set NEXT_OUTPUT=standalone to produce a minimal self-contained server.
    // Regular `npm run dev` / `npm run build` are unaffected.
    output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,

    // Always defined (never left undefined) so the bundler sees `isDemoMode` as a
    // compile-time constant and drops the demo layer when it is off. See config/env.ts.
    env: {
      NEXT_PUBLIC_DEMO_MODE: isDemoMode ? 'true' : 'false',
    },

    // The demo layer is loaded only through the single entry '@/demo'. When the demo is off, that
    // entry becomes an empty module, so none of src/demo ends up in the bundle: Turbopack does not
    // drop a dynamic import() just because `isDemoMode` is false in another module.
    turbopack: {
      resolveAlias: isDemoMode ? {} : { '@/demo': './src/demo/disabled.ts' },
    },

    // Allow requests from local network devices (phones, tablets, etc.)
    allowedDevOrigins: [
      "http://192.168.100.33:3000",
      "192.168.100.33",
    ],

    // Allow images from Cloudinary (for avatars and logos)
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/**',
        },
      ],
    },

    // Enable strict mode for React
    reactStrictMode: true,

    // Experimental features for Next.js 15
    experimental: {
      // Optimize package imports
      optimizePackageImports: ['lucide-react', 'framer-motion'],
    },
  }
}
