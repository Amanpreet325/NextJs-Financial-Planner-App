"use client"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModeToggle } from "@/components/mode-toggle"

export function TopBar() {
  return (
    <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b bg-background/70">
      <div className="mx-auto max-w-[1600px] px-4 py-2 flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <ToggleGroup type="single" defaultValue="M" aria-label="Date range">
            {(["M","Q","YTD","1Y"] as const).map(k => (
              <ToggleGroupItem key={k} value={k} aria-label={k}>{k}</ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]" aria-label="Account filter">
              <SelectValue placeholder="Accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="bank">Bank</SelectItem>
              <SelectItem value="broker">Broker</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
            </SelectContent>
          </Select>
          <ToggleGroup type="single" defaultValue="MoM" aria-label="Compare">
            <ToggleGroupItem value="MoM">MoM</ToggleGroupItem>
            <ToggleGroupItem value="YoY">YoY</ToggleGroupItem>
          </ToggleGroup>
          <ModeToggle />
          <Button size="sm" className="bg-[var(--accent)] text-black">Quick Action</Button>
        </div>
      </div>
    </div>
  )
}
