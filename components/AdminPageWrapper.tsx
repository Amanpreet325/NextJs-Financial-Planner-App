"use client"
import { Suspense } from "react"

interface AdminPageWrapperProps {
  children: React.ReactNode
}

export function AdminPageWrapper({ children }: AdminPageWrapperProps) {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      {children}
    </Suspense>
  )
}
