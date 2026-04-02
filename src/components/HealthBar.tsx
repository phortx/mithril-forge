import { getLiquidColors } from '../utils/liquidColors'

type HealthBarProps = {
  hp: number
  maxHp: number
  tempHp: number
  id: string
  isActive?: boolean
  isDead?: boolean
  isReviveHover?: boolean
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
  const crackFilterId = `crack-filter-${id}`
  const crackDispId = `crack-disp-${id}`
  const shardGradId = `shard-grad-${id}`

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


        {/* Dark overlay for dead creatures — renders UNDER skull */}
        {isDead && (
          <circle cx={CX} cy={CY} r={R - 0.5} fill="rgba(0,0,0,0.45)" />
        )}

        {/* Dead / Revive icons */}
        {isDead && (
          <>
            {/* Skull — fades out on hover */}
            <text
              x={CX}
              y={CY - 1}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={51}
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
              y={CY - 1}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={51}
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

        {/* Shattered glass cracks — renders ON TOP of skull */}
        {isDead && (
          <g className="shattered-glass-effect">
            <defs>
              {/* Subtle distortion filter for the entire orb when shattered */}
              <filter id={crackFilterId} x="-5%" y="-5%" width="110%" height="110%">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={4} seed={42} result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.5} xChannelSelector="R" yChannelSelector="G" />
              </filter>
              {/* Displacement map for crack-area refraction */}
              <filter id={crackDispId} x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="turbulence" baseFrequency="0.08" numOctaves={2} seed={7} result="warp" />
                <feDisplacementMap in="SourceGraphic" in2="warp" scale={0.8} />
              </filter>
              {/* Gradient for shard edge highlights */}
              <linearGradient id={shardGradId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            {/* Glass shard fragments — polygonal pieces with visible refraction */}

            {/* Large shard — upper right (impact zone) */}
            <polygon
              points="34,21 38,16 42,19 40,25 36,24"
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(180,170,140,0.4)"
              strokeWidth={0.5}
            />

            {/* Shard — upper area */}
            <polygon
              points="34,21 31,14 27,8 33,10 38,16"
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(180,170,140,0.35)"
              strokeWidth={0.45}
            />

            {/* Shard — right side */}
            <polygon
              points="40,25 42,19 47,24 46,31 42,29"
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(180,170,140,0.35)"
              strokeWidth={0.45}
            />

            {/* Shard — center-left large piece */}
            <polygon
              points="34,21 36,24 33,30 27,33 24,27 28,20"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(180,170,140,0.3)"
              strokeWidth={0.45}
            />

            {/* Shard — lower left */}
            <polygon
              points="27,33 24,27 18,30 15,37 20,40"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(180,170,140,0.28)"
              strokeWidth={0.4}
            />

            {/* Shard — bottom center */}
            <polygon
              points="27,33 20,40 24,47 33,48 36,42 33,30"
              fill="rgba(255,255,255,0.03)"
              stroke="rgba(180,170,140,0.25)"
              strokeWidth={0.4}
            />

            {/* Shard — upper left */}
            <polygon
              points="28,20 24,27 18,24 14,17 20,13 27,14"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(180,170,140,0.25)"
              strokeWidth={0.4}
            />

            {/* Primary crack lines — bold dark lines with subtle refraction offset */}
            {/* Main crack: impact → bottom-left */}
            <path
              d="M34,21 L33,24 L30,28 L27,33 L23,37 L20,40 L17,47"
              fill="none" stroke="rgba(0,0,0,1)" strokeWidth={1.8} strokeLinecap="round"
            />
            <path
              d="M34.5,21.5 L33.5,24.5 L30.5,28.5 L27.5,33.5 L23.5,37.5"
              fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={0.4} strokeLinecap="round"
            />

            {/* Crack: impact → upper-left */}
            <path
              d="M34,21 L28,20 L24,17 L20,13 L14,12"
              fill="none" stroke="rgba(0,0,0,1)" strokeWidth={1.5} strokeLinecap="round"
            />
            <path
              d="M34.4,21.5 L28.4,20.5 L24.4,17.5 L20.4,13.5"
              fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={0.35} strokeLinecap="round"
            />

            {/* Crack: impact → right */}
            <path
              d="M34,21 L38,22 L42,24 L46,28"
              fill="none" stroke="rgba(0,0,0,0.95)" strokeWidth={1.4} strokeLinecap="round"
            />
            <path
              d="M34.4,21.5 L38.4,22.5 L42.4,24.5"
              fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={0.3} strokeLinecap="round"
            />

            {/* Crack: impact → top */}
            <path
              d="M34,21 L33,16 L31,11 L28,6"
              fill="none" stroke="rgba(0,0,0,0.9)" strokeWidth={1.3} strokeLinecap="round"
            />
            <path
              d="M34.4,21.4 L33.4,16.4 L31.4,11.4"
              fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={0.3} strokeLinecap="round"
            />

            {/* Crack: impact → bottom-right */}
            <path
              d="M36,24 L38,29 L42,33 L45,37"
              fill="none" stroke="rgba(0,0,0,0.85)" strokeWidth={1.2} strokeLinecap="round"
            />
            <path
              d="M36.4,24.4 L38.4,29.4 L42.4,33.4"
              fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={0.25} strokeLinecap="round"
            />

            {/* Secondary connecting cracks — web pattern */}
            <path
              d="M24,27 L18,24 L14,22"
              fill="none" stroke="rgba(0,0,0,0.85)" strokeWidth={1.1} strokeLinecap="round"
            />
            <path
              d="M33,30 L36,32 L40,31"
              fill="none" stroke="rgba(0,0,0,0.8)" strokeWidth={1.0} strokeLinecap="round"
            />
            <path
              d="M27,33 L30,36 L33,40 L36,42"
              fill="none" stroke="rgba(0,0,0,0.75)" strokeWidth={0.9} strokeLinecap="round"
            />
            <path
              d="M18,30 L14,33 L11,36"
              fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth={0.85} strokeLinecap="round"
            />

            {/* Subtle refraction highlights along shard edges */}
            <path d="M38,16 L42,19" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={0.35} strokeLinecap="round" />
            <path d="M42,19 L47,24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={0.3} strokeLinecap="round" />
            <path d="M15,37 L20,40" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={0.25} strokeLinecap="round" />
            <path d="M24,47 L33,48" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={0.25} strokeLinecap="round" />
            <path d="M20,13 L27,14" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={0.25} strokeLinecap="round" />
            <path d="M46,31 L42,29" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={0.25} strokeLinecap="round" />

            {/* Impact crater — concentric stress rings */}
            <circle cx={34} cy={21} r={3.5} fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth={0.5} />
            <circle cx={34} cy={21} r={6} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={0.35} strokeDasharray="1.5 1" />
            {/* Impact point — bright refraction spot */}
            <circle cx={34} cy={21} r={1.8} fill="rgba(255,255,255,0.15)" />
            <circle cx={34} cy={21} r={0.8} fill="rgba(255,255,255,0.35)" />

            {/* Micro-fracture splinters near impact */}
            <path d="M32,19 L30.5,17.5" fill="none" stroke="rgba(0,0,0,0.8)" strokeWidth={0.6} />
            <path d="M36,19 L37.5,17" fill="none" stroke="rgba(0,0,0,0.75)" strokeWidth={0.55} />
            <path d="M36,23 L38,24.5" fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth={0.55} />
            <path d="M32,23 L30.5,25" fill="none" stroke="rgba(0,0,0,0.65)" strokeWidth={0.5} />

            {/* Glass dust particles — bright specks that twinkle */}
            <circle cx={31} cy={16} r={0.7} fill="rgba(255,255,255,0.6)" className="glass-dust-1" />
            <circle cx={37} cy={17} r={0.55} fill="rgba(255,255,255,0.5)" className="glass-dust-2" />
            <circle cx={40} cy={21} r={0.6} fill="rgba(255,255,255,0.45)" className="glass-dust-3" />
            <circle cx={32} cy={26} r={0.5} fill="rgba(255,255,255,0.4)" className="glass-dust-4" />
            <circle cx={36} cy={16} r={0.45} fill="rgba(255,255,255,0.35)" className="glass-dust-5" />
            <circle cx={29} cy={20} r={0.5} fill="rgba(255,255,255,0.4)" className="glass-dust-1" />
            <circle cx={38} cy={26} r={0.4} fill="rgba(255,255,255,0.35)" className="glass-dust-3" />
          </g>
        )}

      </svg>
    </div>
  )
}
