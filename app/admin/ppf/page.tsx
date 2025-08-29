"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect, Suspense } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { GridPattern } from "@/components/grid-pattern"
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form"

const fields = [
  "Name of Account Holder",
  "SBI / PO / Other",
  "Account Number",
  "New / Extended",
  "Balance as on this date INR",
  "Deposit to be made p.a. INR",
  "Interst Rate %",
  "Start date (Old / Extended)",
  "Maturity date",
  "Nominee"
]

const accountLabels = ["I", "II", "III", "IV"]

function PPFPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const userId = searchParams.get('userId');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // React Hook Form setup
  const form = useForm({
    defaultValues: {
      accounts: accountLabels.map(label => ({
        label,
        holder: "", institution: "", accountNumber: "", newExtended: "",
        balance: "", deposit: "", interestRate: "", startDate: "", maturityDate: "", nominee: ""
      }))
    }
  });

  const accountsArray = useFieldArray({ control: form.control, name: 'accounts' });

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
    
    const loadPPF = async () => {
      try {
        const response = await fetch(`/api/admin/ppf/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.accounts) {
            const accountsData = typeof data.accounts === 'string' ? JSON.parse(data.accounts) : data.accounts;
            form.reset({ accounts: accountsData });
          }
        } else if (response.status === 404) {
          console.log('No existing PPF data found');
        }
      } catch (error) {
        console.error('Error loading PPF data:', error);
      }
    };

    loadPPF();
  }, [userId, form]);

  // Save function
  const savePPF = async (data: any) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setSaveStatus('Saving...');
      
      const response = await fetch(`/api/admin/ppf/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          accounts: data.accounts,
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
      console.error('Error saving PPF data:', error);
      setSaveStatus('✗ Save failed');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    await savePPF(data);
  };

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
          <div className="relative z-10 flex flex-col gap-10 w-full max-w-[98vw] xl:max-w-[1700px]">
            <Card className="w-full bg-gradient-to-br from-background to-muted/60 shadow-lg border border-border px-2 py-4 md:px-4 md:py-6">
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-center text-primary">
                    Public Provident Fund (PPF) Accounts<br />
                    <span className="text-base font-medium">(Annexure to Net Worth Statement, Debt Instruments (III), Constituent No.5)</span>
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
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/60">
                            <th className="px-2 py-2 text-left font-semibold text-muted-foreground border-b">Account Details</th>
                            {accountLabels.map((label) => (
                              <th key={label} className="px-2 py-2 text-center font-semibold text-muted-foreground border-b">
                                Account {label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-2 py-2 font-medium border-b bg-muted/20">Name of Account Holder</td>
                            {accountsArray.fields.map((account, idx) => (
                              <td key={`${account.id}-holder`} className="px-2 py-2 border-b">
                                <FormField name={`accounts.${idx}.holder`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-32" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-2 py-2 font-medium border-b bg-muted/20">SBI / PO / Other</td>
                            {accountsArray.fields.map((account, idx) => (
                              <td key={`${account.id}-institution`} className="px-2 py-2 border-b">
                                <FormField name={`accounts.${idx}.institution`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-32" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-2 py-2 font-medium border-b bg-muted/20">Account Number</td>
                            {accountsArray.fields.map((account, idx) => (
                              <td key={`${account.id}-number`} className="px-2 py-2 border-b">
                                <FormField name={`accounts.${idx}.accountNumber`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-32" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-2 py-2 font-medium border-b bg-muted/20">New / Extended</td>
                            {accountsArray.fields.map((account, idx) => (
                              <td key={`${account.id}-extended`} className="px-2 py-2 border-b">
                                <FormField name={`accounts.${idx}.newExtended`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-32" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-2 py-2 font-medium border-b bg-muted/20">Balance as on this date INR</td>
                            {accountsArray.fields.map((account, idx) => (
                              <td key={`${account.id}-balance`} className="px-2 py-2 border-b">
                                <FormField name={`accounts.${idx}.balance`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-32 text-right" type="number" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-2 py-2 font-medium border-b bg-muted/20">Deposit to be made p.a. INR</td>
                            {accountsArray.fields.map((account, idx) => (
                              <td key={`${account.id}-deposit`} className="px-2 py-2 border-b">
                                <FormField name={`accounts.${idx}.deposit`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-32 text-right" type="number" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-2 py-2 font-medium border-b bg-muted/20">Interest Rate %</td>
                            {accountsArray.fields.map((account, idx) => (
                              <td key={`${account.id}-rate`} className="px-2 py-2 border-b">
                                <FormField name={`accounts.${idx}.interestRate`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-32 text-right" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-2 py-2 font-medium border-b bg-muted/20">Start date (Old / Extended)</td>
                            {accountsArray.fields.map((account, idx) => (
                              <td key={`${account.id}-start`} className="px-2 py-2 border-b">
                                <FormField name={`accounts.${idx}.startDate`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-32" type="date" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-2 py-2 font-medium border-b bg-muted/20">Maturity date</td>
                            {accountsArray.fields.map((account, idx) => (
                              <td key={`${account.id}-maturity`} className="px-2 py-2 border-b">
                                <FormField name={`accounts.${idx}.maturityDate`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-32" type="date" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-2 py-2 font-medium border-b bg-muted/20">Nominee</td>
                            {accountsArray.fields.map((account, idx) => (
                              <td key={`${account.id}-nominee`} className="px-2 py-2 border-b">
                                <FormField name={`accounts.${idx}.nominee`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="w-32" />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-center mt-4">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save PPF Accounts'}
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

export default function PPFPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <PPFPageContent />
    </Suspense>
  )
}
