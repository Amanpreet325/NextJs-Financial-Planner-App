"use client"
import { useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, Legend, Line, ReferenceDot, Tooltip, XAxis, YAxis, Bar, BarChart, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { currency } from "@/lib/client/formatters"
import { useMockNetWorth } from "@/lib/client/mocks"

export function NetWorthSection() {
  const { series } = useMockNetWorth()
  const [includeHome, setIncludeHome] = useState(true)
  const [includeLiab, setIncludeLiab] = useState(true)

  const chartData = useMemo(() => series.map(p => ({
    date: p.date,
    net: p.netWorth,
    assets: p.assets,
    liabilities: includeLiab ? -p.liabilities : 0,
    event: p.event,
    up: p.netWorth >= (series.find(s => s.date === p.date)?.netWorth ?? 0),
  })), [series, includeLiab])

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Net Worth</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <label className="inline-flex items-center gap-1">
              <input type="checkbox" checked={includeHome} onChange={e=>setIncludeHome(e.target.checked)} aria-label="Include Home Equity" />
              Include Home Equity
            </label>
            <label className="inline-flex items-center gap-1">
              <input type="checkbox" checked={includeLiab} onChange={e=>setIncludeLiab(e.target.checked)} aria-label="Include Liabilities" />
              Include Liabilities
            </label>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ net: { label: "Net Worth", color: "var(--chart-2)" }, assets: { label: "Assets", color: "var(--chart-1)" }, liabilities: { label: "Liabilities", color: "var(--chart-3)" } }}
            className="h-72"
          >
            <AreaChart data={chartData} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="netFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v)=>currency(v)} width={80} />
              <Tooltip content={<ChartTooltipContent />} formatter={(v: any, n: any, item: any) => [currency(Number(v)), (n === "net" ? "Net Worth" : n === "assets" ? "Assets" : "Liabilities")]} />
              <Legend />
              <Area type="monotone" dataKey="net" stroke="var(--chart-2)" fill="url(#netFill)" strokeWidth={2} />
              <Line type="monotone" dataKey="assets" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="liabilities" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
              {chartData.map((d, i) => (
                d.event ? <ReferenceDot key={i} x={d.date} y={d.net} r={3} fill="var(--accent)" stroke="none" /> : null
              ))}
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Net Worth Composition</CardTitle>
          <p className="text-sm text-muted-foreground">
            Monthly breakdown of your total assets vs liabilities over time
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ 
              assets: { label: "Total Assets", color: "#22C55E" }, 
              liabilities: { label: "Total Liabilities", color: "#EF4444" } 
            }}
            className="h-56"
          >
            <BarChart data={series.slice(-12).map(s => ({ 
              date: new Date(s.date + "-01").toLocaleDateString('en', { month: 'short' }), 
              assets: s.assets, 
              liabilities: s.liabilities 
            }))}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v)=>currency(v)} width={70} />
              <Tooltip 
                content={<ChartTooltipContent />}
                formatter={(v: any, n: any) => [currency(Number(v)), n === "assets" ? "Assets" : "Liabilities"]} 
              />
              <Bar dataKey="assets" fill="#22C55E" radius={[2,2,0,0]} />
              <Bar dataKey="liabilities" fill="#EF4444" radius={[2,2,0,0]} />
            </BarChart>
          </ChartContainer>
          
          {/* Summary stats */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-[#22C55E]"></div>
              <div>
                <div className="font-medium">Assets</div>
                <div className="text-muted-foreground">{currency(series[series.length-1]?.assets || 0)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-[#EF4444]"></div>
              <div>
                <div className="font-medium">Liabilities</div>
                <div className="text-muted-foreground">{currency(series[series.length-1]?.liabilities || 0)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
