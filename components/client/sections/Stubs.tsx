"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { currency } from "@/lib/client/formatters"
import { useMockCashflow, useMockSpending, useMockGoals, useMockPortfolio, useMockDebts, useMockAlerts, useMockActivity } from "@/lib/client/mocks"
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts"

const green = "#22C55E", red = "#EF4444", warn = "#F59E0B", gray = "#9AA3AF", accent = "var(--accent)"

export const CashflowSection = () => {
  const data = useMockCashflow()
  const chart = data.map(d => ({
    date: d.date,
    income: d.incomeFixed + d.incomeVariable,
    expenses: d.expenseFixed + d.expenseVariable,
    fixed: d.expenseFixed,
    variable: d.expenseVariable,
  }))
  return (
    <Card>
      <CardHeader><CardTitle>Cashflow Overview</CardTitle></CardHeader>
      <CardContent>
        <ChartContainer
          className="h-60"
          config={{ income: { label: "Income", color: green }, expenses: { label: "Expenses", color: red } }}
        >
          <BarChart data={chart} stackOffset="sign" margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="date" hide />
            <YAxis tickFormatter={(v)=>currency(Math.abs(v))} />
            <Tooltip content={<ChartTooltipContent />} formatter={(v: any, n: any)=>[currency(Math.abs(Number(v))), n]} />
            <Bar dataKey="income" fill={green} stackId="a" radius={[4,4,0,0]} />
            <Bar dataKey="expenses" fill={red} stackId="a" radius={[0,0,4,4]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export const SpendingSection = () => {
  const cats = useMockSpending()
  const total = cats.reduce((s,c)=>s+c.amount,0)
  const donutData = cats.map(c => ({ name: c.name, value: c.amount, over: c.mom > 0.1 }))
  return (
    <Card id="spending">
      <CardHeader><CardTitle>Spending Insights</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChartContainer className="h-64" config={{ spend: { label: "Spend", color: "var(--chart-2)" } }}>
          <PieChart>
            <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
              {donutData.map((e, i) => (
                <Cell key={i} fill={e.over ? warn : `var(--chart-${(i%5)+1})`} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} formatter={(v: any, n: any)=>[currency(Number(v)), n]} />
          </PieChart>
        </ChartContainer>
        <div className="md:col-span-2">
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={cats} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v)=>currency(v)} />
              <Tooltip formatter={(v:any, n:any)=>[currency(Number(v)), n]} />
              <Bar dataKey="amount" radius={[4,4,0,0]}>
                {cats.map((c,i)=>(
                  <Cell key={i} fill={c.mom > 0.1 ? warn : "var(--chart-1)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="text-sm text-muted-foreground mt-2">Total Spend: <span className="text-foreground font-medium">{currency(total)}</span></div>
        </div>
      </CardContent>
    </Card>
  )
}

export const GoalsSection = () => {
  const goals = useMockGoals()
  const donut = goals.map(g=>({ name: g.name, value: Math.round(g.progress*100), color: g.progress >= 0.8 ? green : g.progress < 0.5 ? warn : accent }))
  return (
    <Card id="goals">
      <CardHeader><CardTitle>Goals Progress</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={donut} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
              {donut.map((d,i)=>(<Cell key={i} fill={d.color} />))}
            </Pie>
            <Tooltip formatter={(v:any,n:any)=>[`${v}%`, n]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="md:col-span-2 grid gap-3">
          {goals.map((g,i)=>{
            const color = g.progress >= 1 ? green : g.progress >= 0.8 ? accent : g.progress < 0.5 ? warn : gray
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{g.name}</span>
                  <span className="text-muted-foreground">ETA {g.etaMonths}m</span>
                </div>
                <div className="h-2 rounded bg-[color-mix(in_oklab,var(--surface),white_6%)]">
                  <div className="h-2 rounded" style={{ width: `${Math.min(100, g.progress*100)}%`, background: color }} />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export const PortfolioSection = () => {
  const alloc = useMockPortfolio()
  const flat = alloc.map(a=>({ name:a.name, value:a.value }))
  const risk = 0.63 // mock risk score
  const riskColor = risk > 0.75 ? red : risk < 0.35 ? green : warn
  return (
    <Card>
      <CardHeader><CardTitle>Portfolio & Risk</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={flat} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
              {flat.map((d,i)=>(<Cell key={i} fill={`var(--chart-${(i%5)+1})`} />))}
            </Pie>
            <Tooltip formatter={(v:any,n:any)=>[`${v}%`, n]} />
          </PieChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={220}>
          <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: "Risk", value: Math.round(risk*100), fill: riskColor }] } startAngle={180} endAngle={0}>
            <RadialBar dataKey="value" cornerRadius={8} />
            <Tooltip formatter={(v:any)=>[`${v}%`, "Risk"]} />
          </RadialBarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart outerRadius={70} data={alloc.map(a=>({ name:a.name, score: a.value }))}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={45} domain={[0, 100]} />
            <Radar name="Allocation" dataKey="score" stroke={accent} fill={accent} fillOpacity={0.25} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export const DebtsSection = () => {
  const debts = useMockDebts()
  const total = debts.reduce((s,d)=>s+d.balance,0)
  const bars = debts.map(d=>({ name: d.name, value: d.balance, color: d.rate > 0.25 ? red : d.rate > 0.12 ? warn : green }))
  return (
    <Card>
      <CardHeader><CardTitle>Debts & Paydown</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={bars}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(v)=>currency(v)} />
            <Tooltip formatter={(v:any,n:any)=>[currency(Number(v)), n]} />
            <Bar dataKey="value" radius={[4,4,0,0]}>
              {bars.map((b,i)=>(<Cell key={i} fill={b.color} />))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="text-sm text-muted-foreground mt-2">Total Debt: <span className="text-foreground font-medium">{currency(total)}</span></div>
      </CardContent>
    </Card>
  )
}

export const AlertsList = () => {
  const alerts = useMockAlerts()
  const color = (s: string)=> s === "high" ? red : s === "medium" ? warn : gray
  return (
    <Card id="alerts">
      <CardHeader><CardTitle>Alerts & Recommendations</CardTitle></CardHeader>
      <CardContent className="grid gap-2">
        {alerts.map(a=> (
          <div key={a.id} className="flex items-start gap-2 p-2 rounded border" style={{ borderColor: color(a.severity) }}>
            <span className="inline-flex h-2 w-2 rounded-full mt-2" style={{ background: color(a.severity) }} aria-hidden />
            <p className="text-sm">{a.message}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export const ActivityStrip = () => {
  const feed = useMockActivity()
  return (
    <Card>
      <CardHeader><CardTitle>Activity & Upcoming</CardTitle></CardHeader>
      <CardContent className="flex gap-4 overflow-x-auto">
        {feed.map(i=> (
          <div key={i.id} className="min-w-64 p-3 rounded bg-[color-mix(in_oklab,var(--surface),white_4%)]">
            <div className="text-xs text-muted-foreground">{new Date(i.date).toLocaleDateString()}</div>
            <div className="text-sm">{i.description}</div>
            {typeof i.amount === 'number' && <div className="text-sm tabular-nums text-muted-foreground">{currency(i.amount)}</div>}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
