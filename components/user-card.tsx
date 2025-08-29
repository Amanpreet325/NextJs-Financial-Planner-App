'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import React from "react"

type UserCardProps = {
  userCount?: number
}
export function UserCard({ userCount = 0 }: UserCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // initialize from prop when provided; otherwise start at 0 and fetch from API
  const [count, setCount] = useState<number>(userCount ?? 0)
  const router = useRouter()

  // Fetch initial user count
  useEffect(() => {
    // Only fetch when a prop was not provided (prop takes precedence)
    if (userCount === undefined) {
      fetchUserCount()
    }
  }, [userCount])

  const fetchUserCount = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const payload = await response.json()
      // API may return an array or an object with count
      if (Array.isArray(payload)) {
        setCount(payload.length)
      } else if (typeof payload === 'number') {
        setCount(payload)
      } else if (payload && typeof payload.count === 'number') {
        setCount(payload.count)
      } else {
        // fallback: try length if present
        setCount((payload && payload.length) || 0)
      }
    } catch (error) {
      console.error('Error fetching user count:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      username: formData.get('username'),
      password: formData.get('password'),
      mobile: formData.get('mobile'),
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      const newUser = await response.json()
      setCount(prev => prev + 1)
      setIsOpen(false)
      
      // Redirect to questionnaire page for the new user
      router.push(`/admin/questionnaire?userId=${newUser.id}`)
    } catch (error) {
      console.error('Error creating user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account. The user will be able to log in with their email/username and password.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="User's full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="user@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" placeholder="Unique username" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Set a password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile (Optional)</Label>
                <Input id="mobile" name="mobile" type="tel" placeholder="Phone number" />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">Active client accounts</p>
        <div className="mt-3">
          <Button variant="ghost" size="sm" onClick={() => fetchUserCount()}>
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
