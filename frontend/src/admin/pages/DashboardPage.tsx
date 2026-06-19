import { useEffect, useState } from 'react'
import { Users, UserCheck, UserX } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import posthog from 'posthog-js'

type DailyEntry = { date: string; count: number }

type Stats = {
  total: number
  verified: number
  unverified: number
  daily: DailyEntry[]
}

export function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const response = await fetch('/api/admin/users/stats', {
          credentials: 'include',
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = (await response.json()) as Stats
        if (!cancelled) {
          setStats(data)
          posthog.capture('admin_dashboard_viewed', { user_count: data.total })
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load stats')
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <div className="panel-parchment panel-ornate rounded-lg p-6 text-forge-burgundy-light">
        Failed to load dashboard: {error}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="font-heading tracking-widest text-forge-tan uppercase text-sm">
        Loading dashboard…
      </div>
    )
  }

  const verifiedPct =
    stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0

  return (
    <div className="flex flex-col gap-6" data-testid="admin-dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          icon={<Users size={20} />}
          label="Total Users"
          value={stats.total}
          testId="kpi-total"
        />
        <KpiCard
          icon={<UserCheck size={20} />}
          label="Verified"
          value={stats.verified}
          subtitle={`${verifiedPct}%`}
          tone="positive"
          testId="kpi-verified"
        />
        <KpiCard
          icon={<UserX size={20} />}
          label="Unverified"
          value={stats.unverified}
          tone={stats.unverified > 0 ? 'warning' : 'neutral'}
          testId="kpi-unverified"
        />
      </div>

      <section
        className="panel-parchment panel-ornate rounded-lg p-6"
        aria-label="User growth"
      >
        <header className="mb-4">
          <h2 className="font-title text-xl text-forge-gold tracking-wider">
            User Growth
          </h2>
          <p className="text-forge-tan text-sm font-heading uppercase tracking-wider">
            Last 30 days · registrations per day
          </p>
        </header>
        <div className="h-72 w-full" data-testid="growth-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.daily} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#c9a84c" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#3a2e22" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                stroke="#a08660"
                tick={{ fill: '#a08660', fontSize: 12 }}
                tickFormatter={formatShortDate}
                interval={4}
              />
              <YAxis
                stroke="#a08660"
                tick={{ fill: '#a08660', fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1410',
                  border: '1px solid #c9a84c',
                  borderRadius: 6,
                  color: '#f1e8d3',
                }}
                labelFormatter={(label) => {
                  if (typeof label === 'string') return formatLongDate(label)
                  return label
                }}
                formatter={(value) => {
                  const numeric = typeof value === 'number' ? value : Number(value)
                  return [`${Number.isFinite(numeric) ? numeric : 0} registrations`, 'Count']
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#c9a84c"
                strokeWidth={2}
                fill="url(#growthGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

type KpiCardProps = {
  icon: React.ReactNode
  label: string
  value: number
  subtitle?: string
  tone?: 'neutral' | 'positive' | 'warning'
  testId?: string
}

function KpiCard({ icon, label, value, subtitle, tone = 'neutral', testId }: KpiCardProps) {
  const toneClass =
    tone === 'positive'
      ? 'text-forge-green-light'
      : tone === 'warning'
        ? 'text-forge-burgundy-light'
        : 'text-forge-parchment-light'
  return (
    <div
      className="panel-parchment panel-ornate rounded-lg p-5"
      data-testid={testId}
    >
      <div className="flex items-center gap-2 text-forge-tan text-xs font-heading uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className={`mt-2 text-3xl font-title tracking-wider ${toneClass}`}>
        {value.toLocaleString()}
      </div>
      {subtitle && (
        <div className="text-forge-tan text-xs font-heading uppercase tracking-wider mt-1">
          {subtitle}
        </div>
      )}
    </div>
  )
}

const SHORT_DATE = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
})
const LONG_DATE = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function formatShortDate(iso: string): string {
  return SHORT_DATE.format(new Date(iso))
}

function formatLongDate(iso: string): string {
  return LONG_DATE.format(new Date(iso))
}
