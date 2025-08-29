"use client"
import Link from 'next/link' 
import { usePathname } from 'next/navigation'
import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconUsers,
} from "@tabler/icons-react"

import { NavUser } from "@/components/nav-user"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
  name: "DALJIT SINGH",
    email: "dal@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
 navMain: [
        { title: "Dashboard", url: "/admin/dashboard", icon: IconListDetails },
    { title: "Clients", url: "/admin/clients", icon: IconUsers },
    { title: "Questionnaire", url: "/admin/questionnaire", icon: IconListDetails },
    { title: "Financial Goals", url: "/admin/financial-goals", icon: IconChartBar },
    { title: "Medical Insurance", url: "/admin/medical-insurance", icon: IconFileDescription },
    { title: "Balances with Banks in Demand Deposits & Liquid Funds", url: "/admin/demand-deposits", icon: IconDatabase },
    { title: "Balances with Banks & Post Office in Time Deposits", url: "/admin/time-deposits", icon: IconDatabase },
    { title: "Recurring Deposits", url: "/admin/recurring-deposits", icon: IconReport },
    { title: "Bonds, NSC, KVP", url: "/admin/bonds", icon: IconFolder },
    { title: "Balances in Public Provident Fund", url: "/admin/ppf", icon: IconDatabase },
    { title: "Gold & Jewellery Valuation", url: "/admin/gold-jewellery", icon: IconInnerShadowTop },
    { title: "Mutual Funds", url: "/admin/mutual-funds", icon: IconChartBar },
    { title: "Equities", url: "/admin/equities", icon: IconChartBar },
    { title: "Real Estate", url: "/admin/real-estate", icon: IconFolder },
    { title: "Cash Flow Statement", url: "/admin/cash-flow", icon: IconFileAi },
    { title: "Net Worth", url: "/admin/net-worth", icon: IconDashboard },
],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                {/* <IconInnerShadowTop className="!size-5" />  */}
          <ModeToggle />
       
                <span className="text-base font-semibold">APXin Inc.</span>
              </a>
              
            </SidebarMenuButton>
          </SidebarMenuItem>

      <SidebarHeader>
        <SidebarMenu>
           {data.navMain.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={pathname === item.url} className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href={item.url}>  {/* ← This is where the Link goes */}
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
                  </SidebarMenu>
      </SidebarHeader>
      {/* <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent> */}
      <SidebarFooter>
       
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
