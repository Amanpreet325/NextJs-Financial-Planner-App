"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export default function ClientsListPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    } else if (session?.user?.role !== "admin") {
      router.push("/dashboard")
    }
  }, [session, status, router])

  // Fetch users/clients
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/clients')
        if (response.ok) {
          const userData = await response.json()
          setUsers(userData)
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchUsers()
    }
  }, [session, status])

  if (status === "loading" || loading) {
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
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Clients</h1>
                <Button asChild>
                  <Link href="/admin/clients/new">Add New Client</Link>
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>All Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b bg-muted/50 text-sm">
                          <th className="px-4 py-2 text-left font-medium">Name</th>
                          <th className="px-4 py-2 text-left font-medium">Email</th>
                          <th className="px-4 py-2 text-left font-medium">Questionnaire</th>
                          <th className="px-4 py-2 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? (
                          users.map((user) => (
                            <tr key={user.id} className="border-b text-sm">
                              <td className="px-4 py-2">{user.name}</td>
                              <td className="px-4 py-2">{user.email}</td>
                              <td className="px-4 py-2">
                                <Button asChild variant="outline" size="sm">
                                  <Link href={`/admin/questionnaire?userId=${user.id}`}>
                                    Fill Questionnaire
                                  </Link>
                                </Button>
                              </td>
                              <td className="px-4 py-2 text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button asChild variant="outline" size="sm">
                                    <Link href={`/admin/clients/${user.id}/edit`}>
                                      Manage
                                    </Link>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b text-sm">
                            <td className="px-4 py-2" colSpan={4}>
                              No clients found. Add a new client to get started.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
