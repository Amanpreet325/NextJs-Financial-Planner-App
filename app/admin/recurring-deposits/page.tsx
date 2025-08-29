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

type Row = {
  no: string
  holder: string
  account: string
  bank: string
  balance: string
  day: string
  rdPerMonth: string
  maturityDate: string
  maturityValue: string
  rate: string
  nominee: string
}

const columns = [
  "No.",
  "Name of Holder",
  "A/C No.",
  "Bank / Post Office",
  "Current Balance (Rs.)",
  "Day of the Month",
  "RD Per Month (Rs.)",
  "Maturity Date",
  "Maturity Value (Rs.)",
  "Rate of Interest % p.a.",
  "Nominee"
]

function RecurringDepositsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const userId = searchParams.get('userId');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // React Hook Form setup
  const form = useForm({
    defaultValues: {
      deposits: [
        {
          no: "", holder: "", account: "", bank: "", balance: "", day: "",
          rdPerMonth: "", maturityDate: "", maturityValue: "", rate: "", nominee: ""
        }
      ]
    }
  });

  const depositsArray = useFieldArray({ control: form.control, name: 'deposits' });

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
    
    const loadRecurringDeposits = async () => {
      try {
        const response = await fetch(`/api/admin/recurring-deposits/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.deposits) {
            const depositsData = typeof data.deposits === 'string' ? JSON.parse(data.deposits) : data.deposits;
            form.reset({ deposits: depositsData });
          }
        } else if (response.status === 404) {
          console.log('No existing recurring deposits found');
        }
      } catch (error) {
        console.error('Error loading recurring deposits:', error);
      }
    };

    loadRecurringDeposits();
  }, [userId, form]);

  // Save function
  const saveRecurringDeposits = async (data: any) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setSaveStatus('Saving...');
      
      const response = await fetch(`/api/admin/recurring-deposits/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          deposits: data.deposits,
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
      console.error('Error saving recurring deposits:', error);
      setSaveStatus('✗ Save failed');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    await saveRecurringDeposits(data);
  };

  // Calculate totals
  const deposits = form.watch('deposits') || [];
  const totalBalance = deposits.reduce((sum: number, r: any) => sum + (parseFloat(r.balance) || 0), 0);
  const totalMaturity = deposits.reduce((sum: number, r: any) => sum + (parseFloat(r.maturityValue) || 0), 0);

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
          <div className="relative z-1 flex flex-col gap-10 w-full max-w-[98vw] xl:max-w-[1700px] ">
            <Card className="w-full bg-gradient-to-br from-background to-muted/60 shadow-lg border border-border px-2 py-4 md:px-4 md:py-6">
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-center text-primary">
                    Bank & Post Office Recurring Deposits<br />
                    <span className="text-base font-medium">(Annexure to Net Worth Statement, Debt Instruments (III), Constituent No.8)</span>
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
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="overflow-x-auto rounded-lg border bg-card/80">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-muted/60">
                        {columns.map((col) => (
                          <th key={col} className="px-2 py-2 font-semibold text-center border-b text-muted-foreground whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {depositsArray.fields.map((item, idx) => (
                        <tr key={item.id} className="bg-card/80 hover:bg-accent/30 transition-colors">
                          <td className="px-2 py-2 border-b">
                            <FormField name={`deposits.${idx}.no`} render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} className="w-16 text-center" />
                                </FormControl>
                              </FormItem>
                            )} />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <FormField name={`deposits.${idx}.holder`} render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} className="w-40" />
                                </FormControl>
                              </FormItem>
                            )} />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <FormField name={`deposits.${idx}.account`} render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} className="w-32" />
                                </FormControl>
                              </FormItem>
                            )} />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <FormField name={`deposits.${idx}.bank`} render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} className="w-32" />
                                </FormControl>
                              </FormItem>
                            )} />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <FormField name={`deposits.${idx}.balance`} render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} className="w-24 text-right" type="number" />
                                </FormControl>
                              </FormItem>
                            )} />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <FormField name={`deposits.${idx}.day`} render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} className="w-24 text-center" />
                                </FormControl>
                              </FormItem>
                            )} />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <FormField name={`deposits.${idx}.rdPerMonth`} render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} className="w-24 text-right" type="number" />
                                </FormControl>
                              </FormItem>
                            )} />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <FormField name={`deposits.${idx}.maturityDate`} render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} className="w-32" type="date" />
                                </FormControl>
                              </FormItem>
                            )} />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <FormField name={`deposits.${idx}.maturityValue`} render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} className="w-24 text-right" type="number" />
                                </FormControl>
                              </FormItem>
                            )} />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <FormField name={`deposits.${idx}.rate`} render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} className="w-24 text-right" />
                                </FormControl>
                              </FormItem>
                            )} />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <FormField name={`deposits.${idx}.nominee`} render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} className="w-32" />
                                </FormControl>
                              </FormItem>
                            )} />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm"
                              onClick={() => depositsArray.remove(idx)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-accent/30">
                        <td colSpan={4} className="px-2 py-2 text-right font-bold border-b">Total Balance</td>
                        <td className="px-2 py-2 text-right font-bold border-b text-green-700 dark:text-green-300">{totalBalance.toLocaleString("en-IN")}</td>
                        <td colSpan={3} className="border-b"></td>
                        <td className="px-2 py-2 text-right font-bold border-b text-green-700 dark:text-green-300">{totalMaturity.toLocaleString("en-IN")}</td>
                        <td colSpan={2} className="border-b"></td>
                      </tr>
                    </tbody>
                  </table>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => depositsArray.append({
                          no: "", holder: "", account: "", bank: "", balance: "", day: "",
                          rdPerMonth: "", maturityDate: "", maturityValue: "", rate: "", nominee: ""
                        })}
                      >
                        + Add Row
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Recurring Deposits'}
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

export default function RecurringDepositsPage() {
  return (
    <AdminPageWrapper>
      <RecurringDepositsPageContent />
    </AdminPageWrapper>
  )
}
