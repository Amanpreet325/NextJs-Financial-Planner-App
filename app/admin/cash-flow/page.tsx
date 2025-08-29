"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { GridPattern } from "@/components/grid-pattern"
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form"
import { AdminPageWrapper } from "@/components/AdminPageWrapper"

const INCOME_SECTIONS = [
  {
    key: "primaryIncome",
    label: "Primary Income Sources",
    items: ["Salary", "Business Income", "Professional Income", "Rental Income"]
  },
  {
    key: "secondaryIncome",
    label: "Secondary Income Sources", 
    items: ["Dividend Income", "Interest Income", "Capital Gains", "Other Income"]
  }
];

const EXPENSE_SECTIONS = [
  {
    key: "housing",
    label: "Housing",
    items: ["House Loan EMIs", "Property Tax", "House Rent", "Insurance Premia", "Repairs & Maintenance"]
  },
  {
    key: "utilities",
    label: "Utilities",
    items: ["Electricity", "Water", "Gas", "Internet", "Mobile", "Cable TV"]
  },
  {
    key: "transportation",
    label: "Transportation",
    items: ["Vehicle Loan EMIs", "Fuel", "Public Transport", "Vehicle Insurance", "Maintenance"]
  },
  {
    key: "foodDining",
    label: "Food & Dining",
    items: ["Groceries", "Dining Out", "Food Delivery", "Beverages"]
  },
  {
    key: "healthcare",
    label: "Healthcare",
    items: ["Medical Insurance", "Doctor Visits", "Medicine", "Health Checkups"]
  },
  {
    key: "education",
    label: "Education",
    items: ["School Fees", "Tuition", "Books", "Education Loan EMIs"]
  },
  {
    key: "lifestyle",
    label: "Lifestyle & Entertainment",
    items: ["Shopping", "Entertainment", "Travel", "Hobbies", "Subscriptions"]
  },
  {
    key: "savings",
    label: "Savings & Investments",
    items: ["SIP Investments", "PPF", "Insurance Premia", "Emergency Fund"]
  }
];

function CashFlowPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const userId = searchParams.get('userId');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Create default values for React Hook Form
  const createDefaultValues = () => {
    const defaultIncome: Record<string, any> = {};
    const defaultExpenses: Record<string, any> = {};
    
    INCOME_SECTIONS.forEach(sec => {
      defaultIncome[sec.key] = sec.items.reduce((acc, item) => {
        acc[item] = "";
        return acc;
      }, {} as Record<string, string>);
    });
    
    EXPENSE_SECTIONS.forEach(sec => {
      defaultExpenses[sec.key] = sec.items.reduce((acc, item) => {
        acc[item] = "";
        return acc;
      }, {} as Record<string, string>);
    });

    return { income: defaultIncome, expenses: defaultExpenses };
  };

  const form = useForm({
    defaultValues: createDefaultValues()
  });

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
    
    const loadCashFlow = async () => {
      try {
        const response = await fetch(`/api/admin/cash-flow/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.statements) {
  const statementsData = typeof data.statements === 'string' ? JSON.parse(data.statements) : data.statements;
  form.reset(statementsData);
}
        } else if (response.status === 404) {
          console.log('No existing cash flow data found');
        }
      } catch (error) {
        console.error('Error loading cash flow data:', error);
      }
    };

    loadCashFlow();
  }, [userId, form]);

  // Save function
  const saveCashFlow = async (data: any) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setSaveStatus('Saving...');
      
      const response = await fetch(`/api/admin/cash-flow/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          statements: data,
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
      console.error('Error saving cash flow data:', error);
      setSaveStatus('✗ Save failed');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    await saveCashFlow(data);
  };

  // Helper function to get section total
  const getSectionTotal = (sectionKey: string, type: 'income' | 'expenses') => {
    const watchedData = form.watch();
    const section = type === 'income' ? watchedData.income?.[sectionKey] : watchedData.expenses?.[sectionKey];
    if (!section) return 0;
    
    return Object.values(section).reduce((sum: number, value: any) => {
      return sum + (parseFloat(value?.replace(/,/g, "") || "0") || 0);
    }, 0);
  };

  // Calculate totals
  const totalIncome = INCOME_SECTIONS.reduce((sum, sec) => sum + getSectionTotal(sec.key, 'income'), 0);
  const totalExpenses = EXPENSE_SECTIONS.reduce((sum, sec) => sum + getSectionTotal(sec.key, 'expenses'), 0);
  const netCashFlow = totalIncome - totalExpenses;

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
          <div className="relative z-10 flex flex-col gap-10 w-full max-w-[98vw] xl:max-w-[1400px]">
            <Card className="w-full bg-gradient-to-br from-background to-muted/60 shadow-lg border border-border px-2 py-4 md:px-4 md:py-6">
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-center text-primary">
                    Cash Flow Statement<br />
                    <span className="text-base font-medium">Monthly Income & Expense Analysis</span>
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
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* INCOME SECTION */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-green-600">Income Sources</h3>
                      <Accordion type="multiple" className="flex flex-col gap-4">
                        {INCOME_SECTIONS.map((section, idx) => (
                          <AccordionItem key={section.key} value={section.key} className="mb-2 rounded border border-border bg-muted/80">
                            <AccordionTrigger className="px-4 py-2 font-semibold text-base  bg-gradient-to-br rounded-t-lg flex items-center justify-between">
                              <span>{section.label}</span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="bg-muted/40">
                                      <th className="px-2 py-2 text-left font-semibold border-b">Income Source</th>
                                      <th className="px-2 py-2 text-center font-semibold border-b">Monthly Amount (INR)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {section.items.map((item, i) => (
                                      <tr key={i}>
                                        <td className="px-2 py-1 border-b min-w-[200px]">{item}</td>
                                        <td className="px-2 py-1 border-b">
                                          <FormField 
                                            name={`income.${section.key}.${item}`} 
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormControl>
                                                  <Input {...field} className="w-32 text-right" type="number" />
                                                </FormControl>
                                              </FormItem>
                                            )} 
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                    <tr className="font-bold bg-gradient-to-br">
                                      <td className="px-2 py-1 text-right border-b">Subtotal</td>
                                      <td className="px-2 py-1 text-right border-b text-green-700">
                                        {getSectionTotal(section.key, 'income').toLocaleString("en-IN")}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>

                    {/* EXPENSES SECTION */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-red-600">Expense Categories</h3>
                      <Accordion type="multiple" className="flex flex-col gap-4">
                        {EXPENSE_SECTIONS.map((section, idx) => (
                          <AccordionItem key={section.key} value={section.key} className="mb-2 rounded border border-border bg-muted/80">
                            <AccordionTrigger className="px-4 py-2 font-semibold text-base  bg-gradient-to-br rounded-t-lg flex items-center justify-between">
                              <span>{section.label}</span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="bg-muted/40">
                                      <th className="px-2 py-2 text-left font-semibold border-b">Expense Item</th>
                                      <th className="px-2 py-2 text-center font-semibold border-b">Monthly Amount (INR)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {section.items.map((item, i) => (
                                      <tr key={i}>
                                        <td className="px-2 py-1 border-b min-w-[200px]">{item}</td>
                                        <td className="px-2 py-1 border-b">
                                          <FormField 
                                            name={`expenses.${section.key}.${item}`} 
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormControl>
                                                  <Input {...field} className="w-32 text-right" type="number" />
                                                </FormControl>
                                              </FormItem>
                                            )} 
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                    <tr className="font-bold bg-gradient-to-br">
                                      <td className="px-2 py-1 text-right border-b">Subtotal</td>
                                      <td className="px-2 py-1 text-right border-b text-red-700">
                                        {getSectionTotal(section.key, 'expenses').toLocaleString("en-IN")}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>

                    {/* SUMMARY */}
                    <div className="flex flex-col gap-2 mt-6">
                      <div className="flex justify-between items-center bg-green-100 rounded px-4 py-2 font-semibold text-green-800">
                        <span>Total Monthly Income</span>
                        <span>₹ {totalIncome.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between items-center bg-red-100 rounded px-4 py-2 font-semibold text-red-800">
                        <span>Total Monthly Expenses</span>
                        <span>₹ {totalExpenses.toLocaleString("en-IN")}</span>
                      </div>
                      <div className={`flex justify-between items-center rounded px-4 py-2 font-semibold text-lg ${
                        netCashFlow >= 0 ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        <span>Net Cash Flow</span>
                        <span>₹ {netCashFlow.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="flex justify-center mt-6">
                      <Button type="submit" disabled={isLoading} className="w-48">
                        {isLoading ? 'Saving...' : 'Save Cash Flow'}
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

export default function CashFlowPage() {
  return (
    <AdminPageWrapper>
      <CashFlowPageContent />
    </AdminPageWrapper>
  )
}
