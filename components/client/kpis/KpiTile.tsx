"use client"
import { cn } from "@/lib/utils"
import { currency } from "@/lib/client/formatters"
import { 
  IconTrendingUp, IconTrendingDown, IconPigMoney, IconTarget, 
  IconCreditCard, IconChartPie, IconAlarmFilled, IconShield
} from "@tabler/icons-react"
import { Cell, PieChart, Pie, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts"

type Props = {
  label: string
  value: number
  delta: number
  spark: number[]
  fmt: "currency" | "percent" | "number"
}

const getKpiIcon = (label: string) => {
  if (label.includes("Net Worth")) return IconPigMoney
  if (label.includes("Savings")) return IconTarget
  if (label.includes("Cashflow")) return IconTrendingUp
  if (label.includes("Return")) return IconChartPie
  if (label.includes("Debt")) return IconCreditCard
  if (label.includes("Emergency")) return IconShield
  return IconTrendingUp
}

const getKpiGauge = (label: string, value: number, fmt: string) => {
  let normalizedValue = 0
  let color = "var(--chart-2)"
  
  if (label.includes("Savings Rate")) {
    normalizedValue = Math.min(100, (value * 100))
    color = value >= 0.25 ? "#22C55E" : value >= 0.15 ? "#F59E0B" : "#EF4444"
  } else if (label.includes("Return")) {
    normalizedValue = Math.min(100, (value * 100 * 5)) // Scale for visibility
    color = value >= 0.1 ? "#22C55E" : value >= 0.05 ? "#F59E0B" : "#EF4444"
  } else if (label.includes("Debt")) {
    normalizedValue = Math.min(100, (value * 100))
    color = value <= 0.2 ? "#22C55E" : value <= 0.35 ? "#F59E0B" : "#EF4444"
  } else if (label.includes("Emergency")) {
    normalizedValue = Math.min(100, (value / 12) * 100) // 12 months max
    color = value >= 6 ? "#22C55E" : value >= 3 ? "#F59E0B" : "#EF4444"
  } else {
    normalizedValue = 75 // Default for Net Worth and Cashflow
    color = "var(--accent)"
  }
  
  return { value: normalizedValue, color }
}

export function KpiTile({ label, value, delta, spark, fmt }: Props) {
  const val = fmt === "currency" ? currency(value) : fmt === "percent" ? `${(value * 100).toFixed(1)}%` : value.toLocaleString()
  const deltaLabel = `${delta >= 0 ? "+" : ""}${(delta * 100).toFixed(1)}%`
  const deltaColor = delta >= 0 ? "text-[var(--positive)]" : "text-[var(--negative)]"
  const Icon = getKpiIcon(label)
  const gauge = getKpiGauge(label, value, fmt)
  
  // Speedometer data for radial chart
  const speedometerData = [
    { name: "value", value: gauge.value, fill: gauge.color },
    { name: "remaining", value: 100 - gauge.value, fill: "color-mix(in oklab, var(--surface), white 8%)" }
  ]

  return (
    <div className={cn("bg-card rounded-xl border p-4 shadow-sm flex flex-col gap-3 transition-all hover:shadow-md group")}
      role="group" aria-label={`${label} ${val} (${deltaLabel})`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[color-mix(in_oklab,var(--surface),white_6%)] transition-colors group-hover:bg-[color-mix(in_oklab,var(--surface),white_10%)]">
            <Icon className="h-4 w-4 text-[var(--accent)]" />
          </div>
          <span className="text-[--text-secondary] text-sm font-medium">{label}</span>
        </div>
        <span className={cn("text-xs font-bold px-2 py-1 rounded-lg bg-[color-mix(in_oklab,var(--surface),white_8%)] flex items-center gap-1", deltaColor)} aria-live="polite">
          {delta >= 0 ? <IconTrendingUp className="h-3 w-3" /> : <IconTrendingDown className="h-3 w-3" />}
          {deltaLabel}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-[--text-primary] text-2xl font-bold tabular-nums">{val}</div>
        
        {/* Speedometer gauge */}
        <div className="relative h-12 w-12">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              data={speedometerData} 
              startAngle={180} 
              endAngle={0} 
              innerRadius="60%" 
              outerRadius="100%"
            >
              <RadialBar dataKey="value" cornerRadius={4} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-[--text-secondary]">
              {Math.round(gauge.value)}%
            </span>
          </div>
        </div>
      </div>

      {/* Animated progress indicator */}
      <div className="h-1 rounded-full bg-[color-mix(in_oklab,var(--surface),white_6%)] overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${gauge.value}%`, 
            background: `linear-gradient(90deg, ${gauge.color}, color-mix(in oklab, ${gauge.color}, white 20%))`,
            animation: "slideIn 1.5s ease-out"
          }} 
        />
      </div>
    </div>
  )
}
