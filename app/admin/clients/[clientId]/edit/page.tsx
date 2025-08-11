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
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditClientPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const { clientId } = params
  
  interface ClientData {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }

  interface FormProgress {
    questionnaire: boolean;
    financialGoals: boolean;
    netWorth: boolean;
    cashFlow: boolean;
    lifeInsurance: boolean;
    medicalInsurance: boolean;
    mutualFunds: boolean;
    equities: boolean;
    bonds: boolean;
    ppf: boolean;
    realEstate: boolean;
    goldJewellery: boolean;
    timeDeposits: boolean;
    recurringDeposits: boolean;
    demandDeposits: boolean;
  }

  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<ClientData | null>(null)
  const [progress, setProgress] = useState<FormProgress>({
    questionnaire: false,
    financialGoals: false,
    netWorth: false,
    cashFlow: false,
    lifeInsurance: false,
    medicalInsurance: false,
    mutualFunds: false,
    equities: false,
    bonds: false,
    ppf: false,
    realEstate: false,
    goldJewellery: false,
    timeDeposits: false,
    recurringDeposits: false,
    demandDeposits: false,
  })
  const [error, setError] = useState("")

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    } else if (session?.user?.role !== "admin") {
      router.push("/dashboard")
    }
  }, [session, status, router])

  // Fetch client data and form progress
  useEffect(() => {
    const fetchClientData = async () => {
      if (status === "authenticated" && clientId) {
        try {
          setLoading(true)
          
          // Fetch client data
          const clientResponse = await fetch(`/api/admin/users/${clientId}`)
          if (!clientResponse.ok) {
            throw new Error('Failed to fetch client data')
          }
          const clientData = await clientResponse.json()
          setClient(clientData)

          // Fetch form progress
          const progressResponse = await fetch(`/api/admin/progress/${clientId}`)
          if (progressResponse.ok) {
            const progressData = await progressResponse.json()
            setProgress(progressData)
          }
          
          setLoading(false)
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'An error occurred')
          setLoading(false)
        }
      }
    }
    
    fetchClientData()
  }, [clientId, status])

  // Calculate completion percentage
  const calculateProgress = () => {
    const totalForms = Object.keys(progress).length
    const completedForms = Object.values(progress).filter(Boolean).length
    return Math.round((completedForms / totalForms) * 100)
  }

  // Get next incomplete form
  const getNextForm = () => {
    const formOrder = [
      { key: 'questionnaire', path: '/admin/questionnaire', name: 'Client Questionnaire' },
      { key: 'financialGoals', path: '/admin/financial-goals', name: 'Financial Goals' },
      { key: 'netWorth', path: '/admin/net-worth', name: 'Net Worth' },
      { key: 'cashFlow', path: '/admin/cash-flow', name: 'Cash Flow' },
      { key: 'lifeInsurance', path: '/admin/life-insurance', name: 'Life Insurance' },
      { key: 'medicalInsurance', path: '/admin/medical-insurance', name: 'Medical Insurance' },
      { key: 'mutualFunds', path: '/admin/mutual-funds', name: 'Mutual Funds' },
      { key: 'equities', path: '/admin/equities', name: 'Equities' },
      { key: 'bonds', path: '/admin/bonds', name: 'Bonds' },
      { key: 'ppf', path: '/admin/ppf', name: 'PPF' },
      { key: 'realEstate', path: '/admin/real-estate', name: 'Real Estate' },
      { key: 'goldJewellery', path: '/admin/gold-jewellery', name: 'Gold & Jewellery' },
      { key: 'timeDeposits', path: '/admin/time-deposits', name: 'Time Deposits' },
      { key: 'recurringDeposits', path: '/admin/recurring-deposits', name: 'Recurring Deposits' },
      { key: 'demandDeposits', path: '/admin/demand-deposits', name: 'Demand Deposits' },
    ]
    
    return formOrder.find(form => !progress[form.key as keyof FormProgress])
  }

  if (status === "loading" || loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
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
                <div className="flex items-center">
                  <Button variant="ghost" onClick={() => router.back()} className="mr-2">
                    ← Back
                  </Button>
                  <h1 className="text-2xl font-bold">Edit Client: {client?.name}</h1>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Progress</div>
                  <div className="text-lg font-semibold">{calculateProgress()}% Complete</div>
                </div>
              </div>

              {/* Progress Overview Card */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Client Profile Completion</span>
                    <span className="text-sm font-normal">
                      {Object.values(progress).filter(Boolean).length} of {Object.keys(progress).length} forms completed
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-muted rounded-full h-2 mb-4">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                  {getNextForm() && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Next: {getNextForm()?.name}
                      </span>
                      <Button 
                        size="sm"
                        onClick={() => router.push(`${getNextForm()?.path}?userId=${clientId}`)}
                      >
                        Continue →
                      </Button>
                    </div>
                  )}
                  {calculateProgress() === 100 && (
                    <div className="text-center text-green-600 font-semibold">
                      🎉 All forms completed!
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* Core Forms */}
                <Card className={`bg-gradient-to-br from-background to-muted/60 ${progress.questionnaire ? 'border-green-500/50 bg-green-50/20' : 'border-orange-500/50'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Client Questionnaire</span>
                      {progress.questionnaire ? (
                        <span className="text-green-600 text-sm">✓ Complete</span>
                      ) : (
                        <span className="text-orange-600 text-sm">⚠ Pending</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Personal details, family information, employment, and income details.
                    </p>
                    <Button 
                      className="w-full"
                      variant={progress.questionnaire ? "outline" : "default"}
                      onClick={() => router.push(`/admin/questionnaire?userId=${clientId}`)}
                    >
                      {progress.questionnaire ? "Review" : "Start"} Questionnaire
                    </Button>
                  </CardContent>
                </Card>

                <Card className={`bg-gradient-to-br from-background to-muted/60 ${progress.financialGoals ? 'border-green-500/50 bg-green-50/20' : 'border-orange-500/50'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Financial Goals</span>
                      {progress.financialGoals ? (
                        <span className="text-green-600 text-sm">✓ Complete</span>
                      ) : (
                        <span className="text-orange-600 text-sm">⚠ Pending</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Set and manage client's financial objectives and goals.
                    </p>
                    <Button 
                      className="w-full"
                      variant={progress.financialGoals ? "outline" : "default"}
                      onClick={() => router.push(`/admin/financial-goals?userId=${clientId}`)}
                    >
                      {progress.financialGoals ? "Review" : "Set"} Goals
                    </Button>
                  </CardContent>
                </Card>

                <Card className={`bg-gradient-to-br from-background to-muted/60 ${progress.netWorth ? 'border-green-500/50 bg-green-50/20' : 'border-orange-500/50'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Net Worth</span>
                      {progress.netWorth ? (
                        <span className="text-green-600 text-sm">✓ Complete</span>
                      ) : (
                        <span className="text-orange-600 text-sm">⚠ Pending</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Track and manage client's assets, liabilities and net worth.
                    </p>
                    <Button 
                      className="w-full"
                      variant={progress.netWorth ? "outline" : "default"}
                      onClick={() => router.push(`/admin/net-worth?userId=${clientId}`)}
                    >
                      {progress.netWorth ? "View" : "Calculate"} Net Worth
                    </Button>
                  </CardContent>
                </Card>

                <Card className={`bg-gradient-to-br from-background to-muted/60 ${progress.cashFlow ? 'border-green-500/50 bg-green-50/20' : 'border-orange-500/50'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Cash Flow</span>
                      {progress.cashFlow ? (
                        <span className="text-green-600 text-sm">✓ Complete</span>
                      ) : (
                        <span className="text-orange-600 text-sm">⚠ Pending</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Analyze and manage client's income and expenses.
                    </p>
                    <Button 
                      className="w-full"
                      variant={progress.cashFlow ? "outline" : "default"}
                      onClick={() => router.push(`/admin/cash-flow?userId=${clientId}`)}
                    >
                      {progress.cashFlow ? "Review" : "Setup"} Cash Flow
                    </Button>
                  </CardContent>
                </Card>

                <Card className={`bg-gradient-to-br from-background to-muted/60 ${progress.lifeInsurance && progress.medicalInsurance ? 'border-green-500/50 bg-green-50/20' : 'border-orange-500/50'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Insurance Policies</span>
                      {(progress.lifeInsurance && progress.medicalInsurance) ? (
                        <span className="text-green-600 text-sm">✓ Complete</span>
                      ) : (
                        <span className="text-orange-600 text-sm">⚠ Pending</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Manage life and medical insurance policies.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button 
                        className="w-full"
                        variant={progress.lifeInsurance ? "outline" : "default"}
                        onClick={() => router.push(`/admin/life-insurance?userId=${clientId}`)}
                      >
                        Life Insurance {progress.lifeInsurance ? "✓" : ""}
                      </Button>
                      <Button 
                        className="w-full"
                        variant={progress.medicalInsurance ? "outline" : "default"}
                        onClick={() => router.push(`/admin/medical-insurance?userId=${clientId}`)}
                      >
                        Medical Insurance {progress.medicalInsurance ? "✓" : ""}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`bg-gradient-to-br from-background to-muted/60 ${progress.mutualFunds && progress.equities && progress.bonds ? 'border-green-500/50 bg-green-50/20' : 'border-orange-500/50'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Investments</span>
                      {(progress.mutualFunds && progress.equities && progress.bonds) ? (
                        <span className="text-green-600 text-sm">✓ Complete</span>
                      ) : (
                        <span className="text-orange-600 text-sm">⚠ Pending</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Manage various investment portfolios.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button 
                        className="w-full"
                        variant={progress.mutualFunds ? "outline" : "default"}
                        onClick={() => router.push(`/admin/mutual-funds?userId=${clientId}`)}
                      >
                        Mutual Funds {progress.mutualFunds ? "✓" : ""}
                      </Button>
                      <Button 
                        className="w-full"
                        variant={progress.equities ? "outline" : "default"}
                        onClick={() => router.push(`/admin/equities?userId=${clientId}`)}
                      >
                        Equities {progress.equities ? "✓" : ""}
                      </Button>
                      <Button 
                        className="w-full"
                        variant={progress.bonds ? "outline" : "default"}
                        onClick={() => router.push(`/admin/bonds?userId=${clientId}`)}
                      >
                        Bonds {progress.bonds ? "✓" : ""}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Bank Deposits */}
                <Card className={`bg-gradient-to-br from-background to-muted/60 ${progress.demandDeposits && progress.timeDeposits && progress.recurringDeposits && progress.ppf ? 'border-green-500/50 bg-green-50/20' : 'border-orange-500/50'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Bank Deposits</span>
                      {(progress.demandDeposits && progress.timeDeposits && progress.recurringDeposits && progress.ppf) ? (
                        <span className="text-green-600 text-sm">✓ Complete</span>
                      ) : (
                        <span className="text-orange-600 text-sm">⚠ Pending</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Manage various types of bank deposits and savings.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button 
                        className="w-full"
                        variant={progress.demandDeposits ? "outline" : "default"}
                        onClick={() => router.push(`/admin/demand-deposits?userId=${clientId}`)}
                      >
                        Demand Deposits {progress.demandDeposits ? "✓" : ""}
                      </Button>
                      <Button 
                        className="w-full"
                        variant={progress.timeDeposits ? "outline" : "default"}
                        onClick={() => router.push(`/admin/time-deposits?userId=${clientId}`)}
                      >
                        Time Deposits {progress.timeDeposits ? "✓" : ""}
                      </Button>
                      <Button 
                        className="w-full"
                        variant={progress.recurringDeposits ? "outline" : "default"}
                        onClick={() => router.push(`/admin/recurring-deposits?userId=${clientId}`)}
                      >
                        Recurring Deposits {progress.recurringDeposits ? "✓" : ""}
                      </Button>
                      <Button 
                        className="w-full"
                        variant={progress.ppf ? "outline" : "default"}
                        onClick={() => router.push(`/admin/ppf?userId=${clientId}`)}
                      >
                        PPF Accounts {progress.ppf ? "✓" : ""}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Assets */}
                <Card className={`bg-gradient-to-br from-background to-muted/60 ${progress.realEstate && progress.goldJewellery ? 'border-green-500/50 bg-green-50/20' : 'border-orange-500/50'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Physical Assets</span>
                      {(progress.realEstate && progress.goldJewellery) ? (
                        <span className="text-green-600 text-sm">✓ Complete</span>
                      ) : (
                        <span className="text-orange-600 text-sm">⚠ Pending</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Manage physical assets and valuations.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button 
                        className="w-full"
                        variant={progress.realEstate ? "outline" : "default"}
                        onClick={() => router.push(`/admin/real-estate?userId=${clientId}`)}
                      >
                        Real Estate {progress.realEstate ? "✓" : ""}
                      </Button>
                      <Button 
                        className="w-full"
                        variant={progress.goldJewellery ? "outline" : "default"}
                        onClick={() => router.push(`/admin/gold-jewellery?userId=${clientId}`)}
                      >
                        Gold & Jewellery {progress.goldJewellery ? "✓" : ""}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
