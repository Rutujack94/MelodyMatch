interface MatchRingProps {
  value: number // 0..1
  size?: number
}

export function MatchRing({ value, size = 44 }: MatchRingProps) {
  const pct = Math.round(value * 100)
  const radius = (size - 6) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - value)

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(245,239,230,0.1)"
          strokeWidth={3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={pct >= 70 ? '#F2A93B' : pct >= 40 ? '#3FC1B0' : '#A79BB0'}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-cream">
        {pct}%
      </span>
    </div>
  )
}
