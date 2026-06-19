import { lazy } from 'react'

export const AdminApp = lazy(() =>
  import('./RefineApp').then((m) => ({ default: m.RefineApp })),
)
