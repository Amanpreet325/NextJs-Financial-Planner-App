"use client"

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { GridPattern } from "@/components/grid-pattern";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

export default function FinancialGoalsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const userId = searchParams.get('userId');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // React Hook Form setup
  const form = useForm({
    defaultValues: {
      regularGoals: [
        { priority: '', goals: '', todaysCost: '', utilisationOfLoan: '', yearToAchieve: '', rateOfInterest: '', recurringYears: '', remark: '' }
      ],
      loanGoals: [
        { priority: '', goalsRequire: '', percentOfGoal: '', monthOfFirstEmi: '', tenureOfLoan: '', rateOfInterest: '', emi: '' }
      ]
    }
  });

  const regularGoalsArray = useFieldArray({ control: form.control, name: 'regularGoals' });
  const loanGoalsArray = useFieldArray({ control: form.control, name: 'loanGoals' });

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
    
    const loadFinancialGoals = async () => {
      try {
        const response = await fetch(`/api/admin/financial-goals/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.goals) {
            // Parse the JSON goals data
            const goalsData = typeof data.goals === 'string' ? JSON.parse(data.goals) : data.goals;
            form.reset({
              regularGoals: goalsData.regularGoals || [
                { priority: '', goals: '', todaysCost: '', utilisationOfLoan: '', yearToAchieve: '', rateOfInterest: '', recurringYears: '', remark: '' }
              ],
              loanGoals: goalsData.loanGoals || [
                { priority: '', goalsRequire: '', percentOfGoal: '', monthOfFirstEmi: '', tenureOfLoan: '', rateOfInterest: '', emi: '' }
              ]
            });
          }
        } else if (response.status === 404) {
          // No existing data, keep default values
          console.log('No existing financial goals found');
        }
      } catch (error) {
        console.error('Error loading financial goals:', error);
      }
    };

    loadFinancialGoals();
  }, [userId, form]);

  // Auto-save function
  const autoSave = async (data: any) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setSaveStatus('Saving...');
      
      // Send the data structure that matches the API expectation
      const payload = {
        goals: {
          regularGoals: data.regularGoals,
          loanGoals: data.loanGoals
        },
        isCompleted: true,
        completedAt: new Date().toISOString()
      };
      
      const response = await fetch(`/api/admin/financial-goals/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
      console.error('Error saving financial goals:', error);
      setSaveStatus('✗ Save failed');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    await autoSave(data);
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
        <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        )}
      />
        <div className="flex flex-1 flex-col items-center justify-center min-h-[80vh] bg-background/80 py-8 px-2">
          <div className="flex flex-col gap-10 w-full max-w-[98vw] xl:max-w-[1700px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                {/* Table 1 - Regular Goals */}
                <Card className="w-full bg-gradient-to-br from-background to-muted/60 shadow-lg border border-border px-4 py-6">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Financial Goals (other than Retirement Planning)</CardTitle>
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
                  </CardHeader>
                  <div className="space-y-4">
                    <table className="w-full border-separate border-spacing-y-2">
                      <thead>
                        <tr className="bg-muted/60">
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Priority</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Goals</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Today's Cost INR</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Utilisation of Loan</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Year to achieve</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Rate of Interest</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Recurring Years</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Remark</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {regularGoalsArray.fields.map((item, index) => (
                          <tr key={item.id} className="bg-card/80 hover:bg-accent/30 transition-colors">
                            <td className="px-2 py-2">
                              <FormField name={`regularGoals.${index}.priority`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} type="number" className="min-w-[80px] bg-background/60" placeholder="Priority" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <FormField name={`regularGoals.${index}.goals`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} className="min-w-[120px] bg-background/60" placeholder="Goals" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <FormField name={`regularGoals.${index}.todaysCost`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} type="number" className="min-w-[120px] bg-background/60" placeholder="Today's Cost" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <FormField name={`regularGoals.${index}.utilisationOfLoan`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} className="min-w-[120px] bg-background/60" placeholder="Utilisation" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <FormField name={`regularGoals.${index}.yearToAchieve`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} type="number" className="min-w-[100px] bg-background/60" placeholder="Year" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <FormField name={`regularGoals.${index}.rateOfInterest`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} type="number" className="min-w-[100px] bg-background/60" placeholder="Rate %" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <FormField name={`regularGoals.${index}.recurringYears`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} type="number" className="min-w-[100px] bg-background/60" placeholder="Years" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <FormField name={`regularGoals.${index}.remark`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} className="min-w-[120px] bg-background/60" placeholder="Remark" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                onClick={() => regularGoalsArray.remove(index)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-6">
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={() => regularGoalsArray.append({ 
                          priority: '', goals: '', todaysCost: '', utilisationOfLoan: '', 
                          yearToAchieve: '', rateOfInterest: '', recurringYears: '', remark: '' 
                        })}
                      >
                        + Add Row
                      </Button>
                      <Button type="submit" className="px-8" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Goals'}
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Table 2 - Loan Goals */}
                <Card className="w-full bg-gradient-to-br from-background to-muted/60 shadow-lg border border-border px-4 py-6">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Goals to be Met from Loan Funds</CardTitle>
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
                  </CardHeader>
                  <div className="space-y-4">
                    <table className="w-full border-separate border-spacing-y-2">
                      <thead>
                        <tr className="bg-muted/60">
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Priority</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Goals Require to be met from loan funds</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">% of Goal from loan</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Month of First EMI</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Tenure of Loan in Month</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Rate of Interest (%) Expected</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">EMI INR</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loanGoalsArray.fields.map((item, index) => (
                          <tr key={item.id} className="bg-card/80 hover:bg-accent/30 transition-colors">
                            <td className="px-2 py-2">
                              <FormField name={`loanGoals.${index}.priority`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} type="number" className="min-w-[80px] bg-background/60" placeholder="Priority" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <FormField name={`loanGoals.${index}.goalsRequire`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} className="min-w-[150px] bg-background/60" placeholder="Goals from loan" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <FormField name={`loanGoals.${index}.percentOfGoal`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} type="number" className="min-w-[100px] bg-background/60" placeholder="% of Goal" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <FormField name={`loanGoals.${index}.monthOfFirstEmi`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} className="min-w-[120px] bg-background/60" placeholder="Month/Year" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <FormField name={`loanGoals.${index}.tenureOfLoan`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} type="number" className="min-w-[100px] bg-background/60" placeholder="Months" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <FormField name={`loanGoals.${index}.rateOfInterest`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} type="number" className="min-w-[100px] bg-background/60" placeholder="Rate %" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <FormField name={`loanGoals.${index}.emi`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} type="number" className="min-w-[100px] bg-background/60" placeholder="EMI" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                onClick={() => loanGoalsArray.remove(index)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-6">
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={() => loanGoalsArray.append({ 
                          priority: '', goalsRequire: '', percentOfGoal: '', monthOfFirstEmi: '', 
                          tenureOfLoan: '', rateOfInterest: '', emi: '' 
                        })}
                      >
                        + Add Row
                      </Button>
                      <Button type="submit" className="px-8" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Loan Goals'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </form>
            </Form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
