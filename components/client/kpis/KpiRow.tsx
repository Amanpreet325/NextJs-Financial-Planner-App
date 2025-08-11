"use client"
import { currency } from "@/lib/client/formatters"
import { Kpi } from "@/types/client"
import { KpiTile } from "./KpiTile"

export function KpiRow({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {kpis.map(k => (
        <KpiTile key={k.key} label={k.label} value={k.value} delta={k.delta} spark={k.spark} fmt={k.fmt} />
      ))}
    </div>
  )
}
