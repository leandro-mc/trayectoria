/**
 * Stands in for src/demo/index.ts when NEXT_PUBLIC_DEMO_MODE is not "true": next.config.ts
 * aliases '@/demo' to this file, so none of the demo layer reaches the bundle. Every call
 * site is guarded by `isDemoMode`, so nothing is ever read from it.
 */
export {}
