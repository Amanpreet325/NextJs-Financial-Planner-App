"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconLayoutGrid, IconCreditCard, IconChartPie, IconPigMoney, IconReportMoney, IconTargetArrow, IconBellRinging } from "@tabler/icons-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail } from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"

const items = [
  { href: "/client/dashboard", label: "Overview", icon: IconLayoutGrid },
  { href: "#portfolio", label: "Portfolio", icon: IconChartPie },
  { href: "#cashflow", label: "Cashflow", icon: IconReportMoney },
  { href: "#spending", label: "Spending", icon: IconCreditCard },
  { href: "#goals", label: "Goals", icon: IconTargetArrow },
  { href: "#alerts", label: "Alerts", icon: IconBellRinging },
]

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <SidebarGroup>
            <SidebarGroupLabel>Finance</SidebarGroupLabel>
            <SidebarMenu>
              {items.map(i => (
                <SidebarMenuItem key={i.href}>
                  <SidebarMenuButton asChild isActive={pathname === i.href}>
                    <Link href={i.href} aria-current={pathname === i.href ? "page" : undefined}>
                      <i.icon />
                      <span>{i.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarHeader>
        <SidebarContent />
        <SidebarFooter>
          <NavUser user={{ name: "Client", email: "client@example.com", avatar: "/avatars/shadcn.jpg" }} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
