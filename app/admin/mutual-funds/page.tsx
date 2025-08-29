"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { GridPattern } from "@/components/grid-pattern"
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form"

type MutualFundRow = {
  scheme: string
  periodicity: string
  startDate: string
  endDate: string
  type: string
  option: string
  nominee: string
  mode: string
  bank: string
  investment: string
  sips: string
  totalInvested: string
  units: string
  nav: string
  marketValue: string
}

import { AdminPageWrapper } from "@/components/AdminPageWrapper"

function MutualFundsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const userId = searchParams.get('userId');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // React Hook Form setup
  const form = useForm({
    defaultValues: {
      mutualFunds: [{ 
        scheme: "", periodicity: "", startDate: "", endDate: "", type: "", option: "", 
        nominee: "", mode: "", bank: "", investment: "", sips: "", totalInvested: "", 
        units: "", nav: "", marketValue: "" 
      }] as MutualFundRow[]
    }
  });

  const mutualFundsArray = useFieldArray({ control: form.control, name: 'mutualFunds' });

  // Authentication check
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "admin") {
      router.push("/login");
      return;
    }
    if (!userId) {
      router.push("/admin/clients");
      return;
    }
  }, [session, status, router, userId]);

  // Load existing data
  useEffect(() => {
    if (!userId) return;
    
    const loadMutualFunds = async () => {
      try {
        const response = await fetch(`/api/admin/mutual-funds/${userId}`);
        if (response.ok) {
          const data = await response.json();
        if (Array.isArray(data.mutualFunds)) {
          form.reset({ mutualFunds: data.mutualFunds });
        }
      } else if (response.status === 404) {
        console.log('No existing mutual funds data found');
      }
    } catch (error) {
      console.error('Error loading mutual funds data:', error);
    }
  };

    loadMutualFunds();
  }, [userId, form]);

  // Save function
  const saveMutualFunds = async (data: any) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setSaveStatus('Saving...');
      
      const response = await fetch(`/api/admin/mutual-funds/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          investments: { mutualFunds: data.mutualFunds },
          isCompleted: true,
          completedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSaveStatus('✓ Saved successfully');
        setTimeout(() => setSaveStatus(''), 2000);
      } else {
        const errorData = await response.json();
        console.error('Save failed:', errorData);
        setSaveStatus('✗ Save failed');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (error) {
      console.error('Error saving mutual funds data:', error);
      setSaveStatus('✗ Save failed');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    await saveMutualFunds(data);
  };

  // Calculate totals
  const watchedData = form.watch();
  const totalInvested = watchedData.mutualFunds?.reduce((sum: number, row: MutualFundRow) => sum + (parseFloat(row.totalInvested) || 0), 0) || 0;
  const totalMarketValue = watchedData.mutualFunds?.reduce((sum: number, row: MutualFundRow) => sum + (parseFloat(row.marketValue) || 0), 0) || 0;

  if (status === "loading") return <div>Loading...</div>;
  if (!session || session.user?.role !== "admin") return null;

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="relative flex flex-1 flex-col items-center justify-center min-h-[80vh] bg-background/80 py-8 px-2 overflow-hidden">
          <GridPattern className="z-0" />
          <div className="relative z-10 flex flex-col gap-10 w-full max-w-[98vw] xl:max-w-[1600px]">
            <Card className="w-full bg-gradient-to-br from-background to-muted/60 shadow-lg border border-border px-2 py-4 md:px-4 md:py-6">
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-center text-primary">
                    Investments in Mutual Funds (Other than Liquid & FMPs)<br />
                    <span className="text-base font-medium">(Annexure to Net Worth Statement, Constituent No. 7, 15, 17, 19 & 24)</span>
                  </h2>
                  {saveStatus && (
                    <div className={`text-sm px-3 py-1 rounded ${
                      saveStatus.includes('✓') ? 'bg-green-100 text-green-800' : 
                      saveStatus.includes('✗') ? 'bg-red-100 text-red-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {saveStatus}
                    </div>
                  )}
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="overflow-x-auto rounded-lg border bg-card/80">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/60">
                            <th className="px-2 py-2 text-center font-semibold border-b">Name of the Scheme</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Periodicity</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Start Date</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">End Date (if any)</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Type</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Option</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Nominee</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Mode of Holding</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Linked Bank & Number</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Investment Per Period (Rs.)</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Number of SIPs Paid</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Total Value Invested (Rs.)</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Units Accumulated</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Current NAV (Rs.)</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Market Value (Rs.)</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mutualFundsArray.fields.map((item, idx) => (
                            <tr key={item.id} className="bg-card/80">
                              <td className="px-2 py-2 border-b">
                                <FormField name={`mutualFunds.${idx}.scheme`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-40" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`mutualFunds.${idx}.periodicity`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-24" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`mutualFunds.${idx}.startDate`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-32" type="date" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`mutualFunds.${idx}.endDate`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-32" type="date" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`mutualFunds.${idx}.type`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-24" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`mutualFunds.${idx}.option`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-24" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`mutualFunds.${idx}.nominee`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-32" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`mutualFunds.${idx}.mode`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-24" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`mutualFunds.${idx}.bank`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-32" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`mutualFunds.${idx}.investment`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-24 text-right" type="number" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`mutualFunds.${idx}.sips`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-24 text-right" type="number" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`mutualFunds.${idx}.totalInvested`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-24 text-right" type="number" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`mutualFunds.${idx}.units`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-24 text-right" type="number" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`mutualFunds.${idx}.nav`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-24 text-right" type="number" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`mutualFunds.${idx}.marketValue`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-24 text-right" type="number" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <Button 
                                  type="button" 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => mutualFundsArray.remove(idx)}
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-accent/30">
                            <td colSpan={11} className="px-2 py-2 text-right font-bold border-b">Total Invested</td>
                            <td className="px-2 py-2 text-right font-bold border-b text-green-700">{totalInvested.toLocaleString("en-IN")}</td>
                            <td colSpan={2} className="border-b"></td>
                            <td className="px-2 py-2 text-right font-bold border-b text-green-700">{totalMarketValue.toLocaleString("en-IN")}</td>
                            <td className="border-b"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => mutualFundsArray.append({ 
                          scheme: "", periodicity: "", startDate: "", endDate: "", type: "", option: "", 
                          nominee: "", mode: "", bank: "", investment: "", sips: "", totalInvested: "", 
                          units: "", nav: "", marketValue: "" 
                        })}
                      >
                        + Add Row
                      </Button>
                      
                      <Button type="submit" disabled={isLoading} className="w-48">
                        {isLoading ? 'Saving...' : 'Save Mutual Funds'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function MutualFundsPage() {
  return (
    <AdminPageWrapper>
      <MutualFundsPageContent />
    </AdminPageWrapper>
  )
}
