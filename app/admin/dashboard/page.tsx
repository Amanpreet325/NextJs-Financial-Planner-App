"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { UserCard } from "@/components/user-card"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import data from "../../client/dashboard/data.json"

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Debug session data
  useEffect(() => {
    console.log("Session data:", session);
  }, [session]);

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      console.log("Not admin, redirecting to dashboard");
      router.push("/client/dashboard")
    }
  }, [session, status, router])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <UserCard userCount={0} />
              </div>
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
         