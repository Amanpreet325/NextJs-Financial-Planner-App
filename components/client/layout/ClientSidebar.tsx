"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
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
  const { data: session } = useSession()

  // Get user info from session, fallback to defaults if not available
  const userInfo = {
    name: session?.user?.username || session?.user?.name || session?.user?.email?.split('@')[0] || "Client",
    email: session?.user?.email || "client@example.com",
    avatar: session?.user?.image || "/avatars/shadcn.jpg"
  }

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
          <NavUser user={userInfo} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
