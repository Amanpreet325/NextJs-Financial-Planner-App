"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"

export default function NewClientPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
    mobile: ""
  })

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    } else if (session?.user?.role !== "admin") {
      router.push("/dashboard")
    }
  }, [session, status, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.password || !formData.username) {
        throw new Error('Please fill in all required fields')
      }

      // Create new user/client
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user')
      }
      
      // Redirect to edit client page to fill forms
      router.push(`/admin/clients/${data.id}/edit`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create user. Please try again.")
      console.error('Failed to create user', err)
    } finally {
      setLoading(false)
    }
  }

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
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
              <div className="flex items-center">
                <Button variant="ghost" onClick={() => router.back()} className="mr-2">
                  ← Back
                </Button>
                <h1 className="text-2xl font-bold">Add New Client</h1>
              </div>
              
              <Card className="bg-gradient-to-br from-background to-muted/60">
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Create a new client account. After creation, you'll be redirected to fill out their detailed forms.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="rounded bg-destructive/15 p-3 text-sm text-destructive">
                        {error}
                      </div>
                    )}
                    
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input 
                        id="mobile" 
                        name="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Optional"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Client"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
