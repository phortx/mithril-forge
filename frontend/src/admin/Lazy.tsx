import { lazy } from 'react'

export const AdminApp = lazy(() =>
  import('./RefineApp').then((m) => ({ default: m.RefineApp })),
)

export const AdminGuardLazy = lazy(() =>
  import('./AdminGuard').then((m) => ({ default: m.AdminGuard })),
)
