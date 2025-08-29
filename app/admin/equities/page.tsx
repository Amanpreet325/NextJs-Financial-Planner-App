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
import { AdminPageWrapper } from "@/components/AdminPageWrapper"

type EquityRow = {
  no: string
  scrip: string
  type: string
  date: string
  year: string
  invested: string
  face: string
  shares: string
  purchase: string
  current: string
  market: string
}

function EquitiesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const userId = searchParams.get('userId');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const form = useForm({
    defaultValues: {
      equities: [{ no: "", scrip: "", type: "", date: "", year: "", invested: "", face: "", shares: "", purchase: "", current: "", market: "" }] as EquityRow[]
    }
  });

  const equitiesArray = useFieldArray({ control: form.control, name: 'equities' });

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

  useEffect(() => {
    if (!userId) return;
    
    const loadEquities = async () => {
      try {
        const response = await fetch(`/api/admin/equities/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.equities)) {
  form.reset({ equities: data.equities });
  equitiesArray.replace(data.equities); // if using useFieldArray
}
        }
      } catch (error) {
        console.error('Error loading equities data:', error);
      }
    };
    loadEquities();
  }, [userId, form]);

  const saveEquities = async (data: any) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setSaveStatus('Saving...');
      
      const response = await fetch(`/api/admin/equities/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          investments: { equities: data.equities },
          isCompleted: true,
          completedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSaveStatus('✓ Saved successfully');
        setTimeout(() => setSaveStatus(''), 2000);
      } else {
        setSaveStatus('✗ Save failed');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch {
      setSaveStatus('✗ Save failed');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    await saveEquities(data);
  };

  const watchedData = form.watch();
  const totalInvested = watchedData.equities?.reduce((sum: number, row: EquityRow) => sum + (parseFloat(row.invested) || 0), 0) || 0;
  const totalMarketValue = watchedData.equities?.reduce((sum: number, row: EquityRow) => sum + (parseFloat(row.market) || 0), 0) || 0;

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
                    Investment in Equities<br />
                    <span className="text-base font-medium">(Annexure to Net Worth Statement, Constituent No. 6, 16, 18, 21 & 25)</span>
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
                            <th className="px-2 py-2 text-center font-semibold border-b">No.</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Name of the Scrip</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Type</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Date of Acquisition</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Year of Acquisition</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Amount Invested (Rs.)</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Face Value (Rs.)</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Number of Shares Acquired</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Purchase Price (Rs.)</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Current Price (Rs.)</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Current Market Value (Rs.)</th>
                            <th className="px-2 py-2 text-center font-semibold border-b">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {equitiesArray.fields.map((item, idx) => (
                            <tr key={item.id} className="bg-card/80">
                              <td className="px-2 py-2 border-b">
                                <FormField name={`equities.${idx}.no`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-16 text-center" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`equities.${idx}.scrip`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-40" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`equities.${idx}.type`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-24" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`equities.${idx}.date`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-32" type="date" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`equities.${idx}.year`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-20" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`equities.${idx}.invested`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-24 text-right" type="number" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`equities.${idx}.face`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-20 text-right" type="number" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`equities.${idx}.shares`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-20 text-right" type="number" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`equities.${idx}.purchase`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-24 text-right" type="number" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`equities.${idx}.current`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-24 text-right" type="number" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                              <td className="px-2 py-2 border-b">
                                <FormField name={`equities.${idx}.market`} render={({ field }) => (
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
                                  onClick={() => equitiesArray.remove(idx)}
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-accent/30">
                            <td colSpan={5} className="px-2 py-2 text-right font-bold border-b">Total Invested</td>
                            <td className="px-2 py-2 text-right font-bold border-b text-green-700">{totalInvested.toLocaleString("en-IN")}</td>
                            <td colSpan={4} className="border-b"></td>
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
                        onClick={() => equitiesArray.append({ no: "", scrip: "", type: "", date: "", year: "", invested: "", face: "", shares: "", purchase: "", current: "", market: "" })}
                      >
                        + Add Row
                      </Button>
                      
                      <Button type="submit" disabled={isLoading} className="w-48">
                        {isLoading ? 'Saving...' : 'Save Equities'}
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

export default function EquitiesPage() {
  return (
    <AdminPageWrapper>
      <EquitiesPageContent />
    </AdminPageWrapper>
  )
}
