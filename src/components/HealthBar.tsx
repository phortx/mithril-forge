type HealthBarProps = {
  hp: number
  maxHp: number
  tempHp: number
  id: string
  isActive?: boolean
  isDead?: boolean
  isReviveHover?: boolean
}

// Liquid color interpolation: green (>60%) → orange (30-60%) → red (<30%)
export function getLiquidColors(percent: number): { top: string; mid: string; bottom: string } {
  if (percent > 60) {
    return { top: '#44cc44', mid: '#228822', bottom: '#0e4a0e' }
  }
  if (percent > 30) {
    // Orange zone
    const t = (percent - 30) / 30 // 0 at 30%, 1 at 60%
    const r = Math.round(204 + t * (68 - 204))  // 204→68
    const g = Math.round(120 + t * (204 - 120))  // 120→204
    const b = Math.round(20 + t * (20 - 20))
    return {
      top: `rgb(${r},${g},${b})`,
      mid: `rgb(${Math.round(r * 0.65)},${Math.round(g * 0.65)},${Math.round(b * 0.65)})`,
      bottom: `rgb(${Math.round(r * 0.3)},${Math.round(g * 0.3)},${Math.round(b * 0.3)})`,
    }
  }
  return { top: '#cc2828', mid: '#991515', bottom: '#4a0e0e' }
}

const R = 28 // orb outer radius
const WALL = 4 // glass wall thickness
const IR = R - WALL // inner radius (liquid area)
const CX = 30
const CY = 30
const VB = 60

// Fillable area within the inner circle
const FILL_TOP = CY - IR
const FILL_BOTTOM = CY + IR
const FILL_HEIGHT = FILL_BOTTOM - FILL_TOP

export function HealthBar({ hp, maxHp, tempHp, id, isActive = false, isDead = false, isReviveHover = false }: HealthBarProps) {
  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100))
  const tempPercent = Math.min(100 - hpPercent, (tempHp / maxHp) * 100)
  const totalFill = hpPercent + tempPercent

  const clipId = `orb-clip-${id}`
  const gradientId = `liquid-grad-${id}`
  const glassGradId = `glass-grad-${id}`
  const innerShadowId = `inner-shadow-${id}`
  const liquidGlowId = `liquid-glow-${id}`

  const liquidY = FILL_BOTTOM - (FILL_HEIGHT * totalFill) / 100
  const tempBoundaryY = FILL_BOTTOM - (FILL_HEIGHT * hpPercent) / 100

  const colors = getLiquidColors(hpPercent)

  return (
    <div className="relative h-full">
      <svg viewBox={`0 0 ${VB} ${VB}`} className={`h-full aspect-square min-h-[70px] -translate-x-1/2 ${isReviveHover ? 'drop-shadow-[0_0_20px_rgba(58,138,74,0.6)]' : isActive ? 'drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]' : 'drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]'} transition-[filter] duration-300`} aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <circle cx={CX} cy={CY} r={IR} />
          </clipPath>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.top} />
            <stop offset="40%" stopColor={colors.mid} />
            <stop offset="100%" stopColor={colors.bottom} />
          </linearGradient>
          {/* Glass surface gradient — radial highlight top-left */}
          <radialGradient id={glassGradId} cx="0.35" cy="0.3" r="0.6" fx="0.3" fy="0.25">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          {/* Inner edge shadow for glass depth */}
          <radialGradient id={innerShadowId} cx="0.5" cy="0.5" r="0.5">
            <stop offset="70%" stopColor="rgba(0,0,0,0)" />
            <stop offset="95%" stopColor="rgba(0,0,0,0.4)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
          </radialGradient>
          {/* Liquid inner glow */}
          <radialGradient id={liquidGlowId} cx="0.5" cy="0.7" r="0.5">
            <stop offset="0%" stopColor={colors.top} stopOpacity={0.3} />
            <stop offset="100%" stopColor={colors.bottom} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Outer glass shell */}
        <circle cx={CX} cy={CY} r={R} fill="rgba(20,16,12,0.95)" />

        {/* Inner cavity — darker background for liquid area */}
        <circle cx={CX} cy={CY} r={IR} fill="rgba(6,4,2,0.95)" />

        <g clipPath={`url(#${clipId})`}>
          {/* HP liquid fill */}
          {hpPercent > 0 && (
            <rect
              x={0}
              y={tempBoundaryY}
              width={VB}
              height={FILL_BOTTOM - tempBoundaryY}
              fill={`url(#${gradientId})`}
              style={{ transition: 'y 500ms ease, height 500ms ease' }}
            />
          )}

          {/* Temp HP layer */}
          {tempPercent > 0 && (
            <rect
              x={0}
              y={liquidY}
              width={VB}
              height={tempBoundaryY - liquidY}
              fill="var(--color-forge-ember)"
              opacity={0.65}
              style={{ transition: 'y 500ms ease, height 500ms ease' }}
            />
          )}

          {/* Liquid surface meniscus */}
          {totalFill > 0 && (
            <ellipse
              cx={CX}
              cy={liquidY + 1}
              rx={IR - 3}
              ry={3}
              fill="rgba(255,255,255,0.22)"
              className="liquid-surface"
              style={{ transition: 'cy 500ms ease' }}
            />
          )}

          {/* Rising bubbles */}
          {totalFill > 5 && (
            <>
              <circle cx={CX - 5} cy={FILL_BOTTOM - 4} r={1.6} fill="rgba(255,255,255,0.45)" className="liquid-bubble-1" />
              <circle cx={CX + 3} cy={FILL_BOTTOM - 6} r={1.2} fill="rgba(255,255,255,0.4)" className="liquid-bubble-2" />
              <circle cx={CX + 7} cy={FILL_BOTTOM - 3} r={1.4} fill="rgba(255,255,255,0.35)" className="liquid-bubble-3" />
            </>
          )}

          {/* Liquid depth glow */}
          {totalFill > 0 && (
            <circle cx={CX} cy={CY + 8} r={16} fill={`url(#${liquidGlowId})`} />
          )}

          {/* Inner shadow overlay — gives glass curvature inside cavity */}
          <circle cx={CX} cy={CY} r={IR} fill={`url(#${innerShadowId})`} />
        </g>

        {/* Glass surface highlight */}
        <circle cx={CX} cy={CY} r={R} fill={`url(#${glassGradId})`} />

        {/* Orb outline — outer glass rim */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="rgba(180,160,120,0.3)"
          strokeWidth={1.2}
        />

        {/* Inner cavity rim */}
        <circle
          cx={CX}
          cy={CY}
          r={IR}
          fill="none"
          stroke="rgba(0,0,0,0.3)"
          strokeWidth={0.8}
        />

        {/* Primary specular highlight — top-left crescent */}
        <ellipse
          cx={CX - 8}
          cy={CY - 10}
          rx={8}
          ry={6}
          fill="rgba(255,255,255,0.15)"
          transform={`rotate(-20, ${CX - 8}, ${CY - 10})`}
          className="bottle-shimmer"
        />

        {/* Sharp specular dot */}
        <circle cx={CX - 10} cy={CY - 12} r={2.5} fill="rgba(255,255,255,0.3)" />
        <circle cx={CX - 8} cy={CY - 8} r={1} fill="rgba(255,255,255,0.2)" />

        {/* Subtle bottom-right rim light */}
        <ellipse
          cx={CX + 10}
          cy={CY + 10}
          rx={5}
          ry={3}
          fill="rgba(255,255,255,0.04)"
          transform={`rotate(30, ${CX + 10}, ${CY + 10})`}
        />

        {/* HP fraction text — centered in orb (hidden when dead) */}
        {!isDead && (
          <>
            <text
              x={CX}
              y={CY - 3}
              textAnchor="middle"
              dominantBaseline="auto"
              fontFamily="Cinzel, serif"
              fontWeight={600}
              fontSize={hp >= 100 || maxHp >= 100 ? 10 : 12}
              fill="rgba(255,255,255,0.85)"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth={1.5}
              paintOrder="stroke"
            >
              {hp}{tempHp > 0 ? `+${tempHp}` : ''}
            </text>
            <line
              x1={CX - 8}
              y1={CY + 1}
              x2={CX + 8}
              y2={CY + 1}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={0.7}
            />
            <text
              x={CX}
              y={CY + 5}
              textAnchor="middle"
              dominantBaseline="hanging"
              fontFamily="Cinzel, serif"
              fontWeight={600}
              fontSize={maxHp >= 100 ? 10 : 12}
              fill="rgba(255,255,255,0.6)"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth={1.5}
              paintOrder="stroke"
            >
              {maxHp}
            </text>
          </>
        )}


        {/* Shattered glass cracks for dead creatures */}
        {isDead && (
          <g>
            {/* Impact point — upper right area */}
            {/* Radial crack 1 — down-left from impact (main crack) */}
            <path
              d="M34,22 Q32,25 31,27 Q29,30 27,33 Q25,36 22,40 Q20,43 17,47"
              fill="none" stroke="rgba(180,165,130,0.7)" strokeWidth={1.1} strokeLinecap="round"
            />
            {/* Refraction highlight along main crack */}
            <path
              d="M34.5,22.5 Q32.5,25.5 31.5,27.5 Q29.5,30.5 27.5,33.5"
              fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={0.4} strokeLinecap="round"
            />
            {/* Radial crack 2 — upper-left from impact */}
            <path
              d="M34,22 Q30,20 27,18 Q24,16.5 20,15 Q17,14 13,14"
              fill="none" stroke="rgba(180,165,130,0.6)" strokeWidth={0.9} strokeLinecap="round"
            />
            {/* Radial crack 3 — right from impact */}
            <path
              d="M34,22 Q37,23 40,25 Q43,27 46,28"
              fill="none" stroke="rgba(180,165,130,0.55)" strokeWidth={0.8} strokeLinecap="round"
            />
            {/* Radial crack 4 — down-right from impact */}
            <path
              d="M34,22 Q36,26 38,31 Q39,34 41,38"
              fill="none" stroke="rgba(180,165,130,0.5)" strokeWidth={0.7} strokeLinecap="round"
            />
            {/* Radial crack 5 — up from impact */}
            <path
              d="M34,22 Q33,18 31,14 Q30,11 28,7"
              fill="none" stroke="rgba(180,165,130,0.5)" strokeWidth={0.7} strokeLinecap="round"
            />

            {/* Concentric connecting crack — inner ring */}
            <path
              d="M27,18 Q29,21 31,27 Q33,25 38,31"
              fill="none" stroke="rgba(180,165,130,0.35)" strokeWidth={0.6} strokeLinecap="round"
            />
            {/* Concentric connecting crack — outer ring */}
            <path
              d="M13,14 Q15,19 20,25 Q22,30 22,40"
              fill="none" stroke="rgba(180,165,130,0.3)" strokeWidth={0.5} strokeLinecap="round"
            />

            {/* Branch off crack 1 — left fork */}
            <path
              d="M27,33 Q23,31 19,30 Q16,29 12,30"
              fill="none" stroke="rgba(180,165,130,0.45)" strokeWidth={0.7} strokeLinecap="round"
            />
            {/* Branch off crack 2 — right fork near bottom */}
            <path
              d="M22,40 Q26,41 30,43 Q33,44 37,43"
              fill="none" stroke="rgba(180,165,130,0.4)" strokeWidth={0.6} strokeLinecap="round"
            />
            {/* Branch off crack 3 — tiny splinter from crack 2 */}
            <path
              d="M20,15 Q19,19 17,22"
              fill="none" stroke="rgba(180,165,130,0.35)" strokeWidth={0.5} strokeLinecap="round"
            />
            {/* Branch off crack 4 — tiny splinter downward */}
            <path
              d="M40,25 Q42,30 43,33"
              fill="none" stroke="rgba(180,165,130,0.3)" strokeWidth={0.45} strokeLinecap="round"
            />

            {/* Micro-fractures near impact */}
            <path
              d="M33,24 L31,23" fill="none" stroke="rgba(200,185,150,0.4)" strokeWidth={0.4}
            />
            <path
              d="M35,24 L37,22" fill="none" stroke="rgba(200,185,150,0.35)" strokeWidth={0.35}
            />
            <path
              d="M32,20 L30,19" fill="none" stroke="rgba(200,185,150,0.35)" strokeWidth={0.35}
            />

            {/* Impact star — small radial lines at impact point */}
            <circle cx={34} cy={22} r={1.5} fill="none" stroke="rgba(200,185,150,0.25)" strokeWidth={0.3} />
          </g>
        )}

        {/* Dead / Revive icons — ON TOP of the orb */}
        {isDead && (
          <>
            {/* Skull — fades out on hover */}
            <text
              x={CX}
              y={CY}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={34}
              fill="rgba(180,50,50,1)"
              stroke="rgba(0,0,0,0.8)"
              strokeWidth={1.5}
              paintOrder="stroke"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.7))"
              opacity={isReviveHover ? 0 : 1}
              style={{ transition: 'opacity 250ms ease' }}
            >
              &#x2620;
            </text>
            {/* Revive cross — fades in on hover */}
            <text
              x={CX}
              y={CY}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={34}
              fill="rgba(58,200,90,1)"
              stroke="rgba(0,0,0,0.8)"
              strokeWidth={1.5}
              paintOrder="stroke"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
              opacity={isReviveHover ? 1 : 0}
              style={{ transition: 'opacity 250ms ease' }}
            >
              &#x2618;
            </text>
          </>
        )}
      </svg>
    </div>
  )
}
