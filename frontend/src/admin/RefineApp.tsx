import { lazy, Suspense } from 'react'
import { Refine } from '@refinedev/core'
import { adminDataProvider } from './dataProvider'
import { DashboardPage } from './pages/DashboardPage'
import { Loader } from './components/Loader'
import type { IResourceItem } from '@refinedev/core'

const resources: IResourceItem[] = [
  {
    name: 'users',
    list: '/admin/users',
    show: '/admin/users/:id',
    meta: { label: 'Users' },
  },
]

const ThemedLayout = lazy(() =>
  import('./components/ThemedLayout').then((m) => ({ default: m.ThemedLayout })),
)

export function RefineApp() {
  return (
    <Refine
      dataProvider={adminDataProvider}
      resources={resources}
    >
      <Suspense fallback={<Loader />}>
        <ThemedLayout>
          <DashboardPage />
        </ThemedLayout>
      </Suspense>
    </Refine>
  )
}
