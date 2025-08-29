"use client"
import { useForm, useFieldArray } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { GridPattern } from "@/components/grid-pattern"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from '@/components/ui/button';
import { AdminPageWrapper } from "@/components/AdminPageWrapper"


function AdminQuestionnairePageContent() {
  // 1. React core hooks
  const [spouseName, setSpouseName] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoadingQuestionnaire, setIsLoadingQuestionnaire] = useState(false);

  // 2. Router and navigation hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 3. Auth hooks
  const { data: session, status } = useSession();
  const userId = searchParams.get('userId');
  // 4. Form hooks
  const form = useForm();
  // 9. Load questionnaire data on mount
  useEffect(() => {
    if (!userId) return;
    const loadQuestionnaire = async () => {
      setIsLoadingQuestionnaire(true);
      try {
        const response = await fetch(`/api/admin/questionnaire/${userId}`);
        if (response.ok) {
          const data = await response.json();
          // Defensive: parse JSON fields if needed
          form.reset({
            personal: typeof data.personal === 'string' ? JSON.parse(data.personal) : data.personal || {},
            family: typeof data.family === 'string' ? JSON.parse(data.family) : data.family || {},
            employment: typeof data.employment === 'string' ? JSON.parse(data.employment) : data.employment || {},
            income: typeof data.income === 'string' ? JSON.parse(data.income) : data.income || {},
            liabilities: typeof data.liabilities === 'string' ? JSON.parse(data.liabilities) : data.liabilities || {},
            insurance: typeof data.insurance === 'string' ? JSON.parse(data.insurance) : data.insurance || {},
            goals: typeof data.goals === 'string' ? JSON.parse(data.goals) : data.goals || {},
            investments: typeof data.investments === 'string' ? JSON.parse(data.investments) : data.investments || {},
            planner: typeof data.planner === 'string' ? JSON.parse(data.planner) : data.planner || {},
          });
        }
      } catch (error) {
        console.error('Error loading questionnaire:', error);
      } finally {
        setIsLoadingQuestionnaire(false);
      }
    };
    loadQuestionnaire();
  }, [userId, form]);
  
  // 5. Get URL params
  

  // 6. Form field array hooks - keep these together
  const salaryArray = useFieldArray({ control: form.control, name: 'income.salary' });
  const retirementArray = useFieldArray({ control: form.control, name: 'income.retirementBenefits' });
  const businessArray = useFieldArray({ control: form.control, name: 'income.business' });
  const otherIncomeArray = useFieldArray({ control: form.control, name: 'income.other' });
  const gratuityArray = useFieldArray({ control: form.control, name: 'income.gratuity' });
  const creditCardArray = useFieldArray({ control: form.control, name: 'liabilities.creditCards' });
  const termLoanArray = useFieldArray({ control: form.control, name: 'liabilities.termLoans' });
  const postRetirementIncomeArray = useFieldArray({ control: form.control, name: 'postRetirementIncome' });

  // 7. Form field watchers
  const maritalStatus = form.watch('personal.maritalStatus');
  const employmentType = form.watch('personal.employmentType');
  const spouseEmploymentType = form.watch('personal.spouseEmploymentType');
  const isMarried = maritalStatus === 'Married';

  // 8. Side effects
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard")
    }
  }, [session, status, router])

  // Fetch user details
  useEffect(() => {
    if (userId) {
      fetchUserDetails()
    }
  }, [userId])

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      if (response.ok) {
        const userData = await response.json()
        setCurrentUser(userData)
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
  }

  if (status === "loading" || isLoadingQuestionnaire) {
    return <div>Loading...</div>
  }

  // Auto-save function for questionnaire sections only
  const saveSection = async (sectionData: any, sectionName: string) => {
    if (!userId) {
      console.error('No user ID provided')
      return
    }

    try {
      const response = await fetch(`/api/admin/questionnaire/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...sectionData,
          isCompleted: false, // Mark as in-progress save
          completedAt: null
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to save ${sectionName}`)
      }
      
      alert(`${sectionName} saved successfully!`)
    } catch (error) {
      console.error(`Error saving ${sectionName}:`, error)
      alert(`Failed to save ${sectionName}`)
    }
  }

  const onSubmit = async (data: any) => {
    if (!userId) {
      console.error('No user ID provided')
      return
    }

    try {
      // Only save questionnaire data (personal, family, employment, income, liabilities, planner)
      const response = await fetch(`/api/admin/questionnaire/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personal: data.personal || {},
          family: data.family || {},
          employment: data.employment || {},
          income: data.income || {},
          liabilities: data.liabilities || {},
          insurance: data.insurance || {},
          planner: data.planner || {},
          investments: data.investments || {},
          isCompleted: true,
          completedAt: new Date()
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save questionnaire')
      }

      alert('Questionnaire saved successfully!')
      // Navigate back to client edit page to see updated progress
      router.push(`/admin/clients/${userId}/edit`)
    } catch (error) {
      console.error('Error saving questionnaire:', error)
      alert('Error saving questionnaire. Please try again.')
    }
  }

  // We already have these watchers and field arrays defined at the top of the component

  return (
    <SidebarProvider
          style={{
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties}
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <div className="w-full h-full fixed inset-0 z-0 pointer-events-none">
              <GridPattern
                width={30}
                height={30}
                x={-1}
                y={-1}
                strokeDasharray={"4 2"}
                className={cn(
                  "opacity-90",
                  "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
                )}
              />
            </div>
            <SiteHeader />
            <div className="flex flex-1 flex-col items-center justify-center min-h-[80vh] bg-background/80 py-8 px-2">
              <div className="flex flex-col gap-10 w-full max-w-[98vw] xl:max-w-[1700px]">
                <h1 className="text-3xl font-bold">Client Questionnaire - Admin View</h1>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {/* Personal Details */}
                    <AccordionItem value="personal" className="bg-gradient-to-br from-background to-muted/60 rounded-xl shadow-lg border border-border px-4 py-6">
                      <AccordionTrigger className="text-lg font-semibold">Personal Details</AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="personal.title" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <select {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded">
                                    <option value="">Select...</option>
                                    <option value="Mr.">Mr.</option>
                                    <option value="Mrs.">Mrs.</option>
                                    <option value="Ms.">Ms.</option>
                                    <option value="Dr.">Dr.</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField name="personal.sex" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sex</FormLabel>
                                <FormControl>
                                  <select {...field} className="w-full p-2 border rounded">
                                    <option value="">Select...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="personal.firstName" render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <input {...field} className="w-full p-2 border rounded" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField name="personal.middleInitial" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Middle Initial</FormLabel>
                                <FormControl>
                                  <input {...field} className="w-full p-2 border rounded" maxLength={2} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField name="personal.lastName" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <input {...field} className="w-full p-2 border rounded" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField name="personal.maritalStatus" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Marital Status</FormLabel>
                                <FormControl>
                                  <select {...field} className="w-full p-2 border rounded">
                                    <option value="">Select...</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="personal.dateOfBirth" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                  <input type="date" {...field} className="w-full p-2 border rounded" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField name="personal.currentAge" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Age in Years</FormLabel>
                                <FormControl>
                                  <input type="number" {...field} className="w-full p-2 border rounded" min={0} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>
                          <FormField name="personal.address" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Residential Address</FormLabel>
                              <FormControl>
                                <textarea {...field} className="w-full p-2 border rounded" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="personal.contact.telR" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Tel. (R)</FormLabel>
                                <FormControl>
                                  <input {...field} className="w-full p-2 border rounded" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField name="personal.contact.telO" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Tel. (O)</FormLabel>
                                <FormControl>
                                  <input {...field} className="w-full p-2 border rounded" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField name="personal.contact.cell" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cell</FormLabel>
                                <FormControl>
                                  <input {...field} className="w-full p-2 border rounded" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField name="personal.contact.email" render={({ field }) => (
                              <FormItem>
                                <FormLabel>E-Mail</FormLabel>
                                <FormControl>
                                  <input type="email" {...field} className="w-full p-2 border rounded" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="personal.parentalResponsibility.father" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Parental Financial Responsibility (Father)</FormLabel>
                                <FormControl>
                                  <select {...field} className="w-full p-2 border rounded">
                                    <option value="">Select...</option>
                                    <option value="Total">Total</option>
                                    <option value="Partial">Partial</option>
                                    <option value="None">None</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField name="personal.parentalResponsibility.mother" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Parental Financial Responsibility (Mother)</FormLabel>
                                <FormControl>
                                  <select {...field} className="w-full p-2 border rounded">
                                    <option value="">Select...</option>
                                    <option value="Total">Total</option>
                                    <option value="Partial">Partial</option>
                                    <option value="None">None</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>
                          {/* Marital status dependent fields */}
                          {isMarried && (
                            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 mt-4">
                              <h3 className="font-semibold mb-2">Spouse/Partner Details</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField name="personal.spouseName" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Spouse/Husband Name</FormLabel>
                                    <FormControl>
                                      <input {...field} className="w-full p-2 border rounded" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                                <FormField name="personal.spouseEmploymentType" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Spouse Employment Type</FormLabel>
                                    <FormControl>
                                      <select {...field} className="w-full p-2 border rounded">
                                        <option value="">Select...</option>
                                        <option value="Self Employed">Self Employed</option>
                                        <option value="Full Time">Full Time</option>
                                        <option value="Part Time">Part Time</option>
                                        <option value="Business Owner">Business Owner</option>
                                        <option value="Retired">Retired</option>
                                        <option value="Other">Other</option>
                                      </select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField name="personal.spouseRetirementAge" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Spouse Retirement Age</FormLabel>
                                    <FormControl>
                                      <input type="number" {...field} className="w-full p-2 border rounded" min={0} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                              </div>
                            </div>
                          )}
                          {/* Employment type for self */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="personal.employmentType" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Employment Type</FormLabel>
                                <FormControl>
                                  <select {...field} className="w-full p-2 border rounded">
                                    <option value="">Select...</option>
                                    <option value="Self Employed">Self Employed</option>
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                    <option value="Business Owner">Business Owner</option>
                                    <option value="Retired">Retired</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>
                          {/* Save Personal Details Button */}
                          <div className="flex justify-end mt-6">
                            <Button 
                              type="button" 
                              onClick={() => saveSection({ personal: form.getValues('personal') }, 'Personal Details')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Save Personal Details
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Family Members */}
                    <AccordionItem value="family" className="bg-gradient-to-br from-background to-muted/60 rounded-xl shadow-lg border border-border px-4 py-6">
                      <AccordionTrigger className="text-lg font-semibold">Family Members</AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="space-y-4">
                          <FormField name="family.numChildren" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Children</FormLabel>
                              <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField name="family.childrenNames" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name(s) of the Children</FormLabel>
                              <FormControl><textarea {...field} className="w-full p-2 border rounded" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          {/* Save Family Details Button */}
                          <div className="flex justify-end mt-6">
                            <Button 
                              type="button" 
                              onClick={() => saveSection({ family: form.getValues('family') }, 'Family Details')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Save Family Details
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Employment & Retirement */}
                    <AccordionItem value="employment" className="bg-gradient-to-br from-background to-muted/60 rounded-xl shadow-lg border border-border px-4 py-6">
                      <AccordionTrigger className="text-lg font-semibold">Employment & Retirement</AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="space-y-4">
                          <FormField name="employment.info" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Employment Information</FormLabel>
                              <FormControl><textarea {...field} className="w-full p-2 border rounded" placeholder="Self employed, Directorship, etc." /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField name="employment.retirementAgeKaushal" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age of Retirement (Kaushal)</FormLabel>
                              <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField name="employment.retirementDateKaushal" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tentative Date of Retirement (Kaushal)</FormLabel>
                              <FormControl><input type="date" {...field} className="w-full p-2 border rounded" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField name="employment.retirementAgeDeepika" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age of Retirement (Deepika)</FormLabel>
                              <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField name="employment.retirementDateDeepika" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tentative Date of Retirement (Deepika)</FormLabel>
                              <FormControl><input type="date" {...field} className="w-full p-2 border rounded" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          {/* Save Employment Details Button */}
                          <div className="flex justify-end mt-6">
                            <Button 
                              type="button" 
                              onClick={() => saveSection({ employment: form.getValues('employment') }, 'Employment Details')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Save Employment Details
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Sources of Income (Refactored Table Layout) */}
                    <AccordionItem value="income" className="bg-gradient-to-br from-background to-muted/60 rounded-xl shadow-lg border border-border px-4 py-6">
                      <AccordionTrigger className="text-lg font-semibold">Sources of Income</AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="space-y-8">
                          {/* a) Salary Income */}
                          <div className="bg-gradient-to-br from-background to-muted/60 rounded-xl p-4 shadow-lg border border-border mb-8">
                            <h3 className="text-lg font-semibold mb-4">a) Salary Income</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full border-separate border-spacing-y-2">
                                <thead>
                                  <tr className="bg-muted/60">
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Owner</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Name of Employer</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Start Year</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">End Year</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Take Home Salary (INR)</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Growth % (Take Home)</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Growth % (Basic)</th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {salaryArray.fields.map((item, idx) => (
                                    <tr key={item.id} className="bg-card/80 hover:bg-accent/30 transition-colors">
                                      <td className="px-2 py-2">
                                        <FormField name={`income.salary.${idx}.owner`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl>
                                              <select {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded">
                                                <option value="">Select...</option>
                                                <option value="Self">Self</option>
                                                <option value="Spouse">Spouse</option>
                                              </select>
                                            </FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.salary.${idx}.employer`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.salary.${idx}.startYear`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.salary.${idx}.endYear`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.salary.${idx}.takeHome`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.salary.${idx}.growthTakeHome`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" step="0.01" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.salary.${idx}.growthBasic`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" step="0.01" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2 text-right">
                                        <button type="button" className="text-red-500" onClick={() => salaryArray.remove(idx)}>Remove</button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="flex justify-between items-center mt-6">
                              <Button type="button" variant="secondary" onClick={() => salaryArray.append({})}>+ Add Row</Button>
                              {/* Optionally add a Save button here if needed */}
                            </div>
                          </div>
                          {/* b) Retirement Benefits */}
                          <div className="bg-gradient-to-br from-background to-muted/60 rounded-xl p-4 shadow-lg border border-border mb-8">
                            <h3 className="font-semibold mb-2">b) Retirement Benefits</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full border-separate border-spacing-y-2">
                                <thead>
                                  <tr className="bg-muted/60">
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Owner</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Pension Fund</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Start Year</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">End Year</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Monthly Pension (INR)</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Growth %</th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {retirementArray.fields.map((item, idx) => (
                                    <tr key={item.id} className="bg-card/80 hover:bg-accent/30 transition-colors">
                                      <td className="px-2 py-2">
                                        <FormField name={`income.retirementBenefits.${idx}.owner`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl>
                                              <select {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded">
                                                <option value="">Select...</option>
                                                <option value="Self">Self</option>
                                                <option value="Spouse">Spouse</option>
                                              </select>
                                            </FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.retirementBenefits.${idx}.pensionFund`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.retirementBenefits.${idx}.startYear`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.retirementBenefits.${idx}.endYear`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.retirementBenefits.${idx}.monthlyPension`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.retirementBenefits.${idx}.growth`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" step="0.01" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2 text-right">
                                        <button type="button" className="text-red-500" onClick={() => retirementArray.remove(idx)}>Remove</button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="flex justify-between items-center mt-6">
                              <Button type="button" variant="secondary" onClick={() => retirementArray.append({})}>+ Add Row</Button>
                              {/* Optionally add a Save button here if needed */}
                            </div>
                          </div>
                          {/* c) Business Income */}
                          <div className="bg-gradient-to-br from-background to-muted/60 rounded-xl p-4 shadow-lg border border-border mb-8">
                            <h3 className="font-semibold mb-2">c) Business Income</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full border-separate border-spacing-y-2">
                                <thead>
                                  <tr className="bg-muted/60">
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Owner</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Business Type</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Start Year</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">End Year</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Annual Income (INR)</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Growth %</th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {businessArray.fields.map((item, idx) => (
                                    <tr key={item.id} className="bg-card/80 hover:bg-accent/30 transition-colors">
                                      <td className="px-2 py-2">
                                        <FormField name={`income.business.${idx}.owner`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl>
                                              <select {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded">
                                                <option value="">Select...</option>
                                                <option value="Self">Self</option>
                                                <option value="Spouse">Spouse</option>
                                              </select>
                                            </FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.business.${idx}.businessType`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.business.${idx}.startYear`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.business.${idx}.endYear`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.business.${idx}.annualIncome`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.business.${idx}.growth`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" step="0.01" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2 text-right">
                                        <button type="button" className="text-red-500" onClick={() => businessArray.remove(idx)}>Remove</button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="flex justify-between items-center mt-6">
                              <Button type="button" variant="secondary" onClick={() => businessArray.append({})}>+ Add Row</Button>
                              {/* Optionally add a Save button here if needed */}
                            </div>
                          </div>
                          {/* d) Other Income */}
                          <div className="bg-gradient-to-br from-background to-muted/60 rounded-xl p-4 shadow-lg border border-border mb-8">
                            <h3 className="font-semibold mb-2">d) Other Income</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full border-separate border-spacing-y-2">
                                <thead>
                                  <tr className="bg-muted/60">
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Owner</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Source</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Start Year</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">End Year</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Annual Income (INR)</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Growth %</th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {otherIncomeArray.fields.map((item, idx) => (
                                    <tr key={item.id} className="bg-card/80 hover:bg-accent/30 transition-colors">
                                      <td className="px-2 py-2">
                                        <FormField name={`income.other.${idx}.owner`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl>
                                              <select {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded">
                                                <option value="">Select...</option>
                                                <option value="Self">Self</option>
                                                <option value="Spouse">Spouse</option>
                                              </select>
                                            </FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.other.${idx}.source`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.other.${idx}.startYear`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.other.${idx}.endYear`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.other.${idx}.annualIncome`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.other.${idx}.growth`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" step="0.01" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2 text-right">
                                        <button type="button" className="text-red-500" onClick={() => otherIncomeArray.remove(idx)}>Remove</button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="flex justify-between items-center mt-6">
                              <Button type="button" variant="secondary" onClick={() => otherIncomeArray.append({})}>+ Add Row</Button>
                              {/* Optionally add a Save button here if needed */}
                            </div>
                          </div>
                          {/* e) Gratuity */}
                          <div className="bg-gradient-to-br from-background to-muted/60 rounded-xl p-4 shadow-lg border border-border mb-8">
                            <h3 className="font-semibold mb-2">e) Gratuity</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full border-separate border-spacing-y-2">
                                <thead>
                                  <tr className="bg-muted/60">
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Owner</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Employer</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Service Years</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Gratuity Amount (INR)</th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground">Growth %</th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {gratuityArray.fields.map((item, idx) => (
                                    <tr key={item.id} className="bg-card/80 hover:bg-accent/30 transition-colors">
                                      <td className="px-2 py-2">
                                        <FormField name={`income.gratuity.${idx}.owner`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl>
                                              <select {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded">
                                                <option value="">Select...</option>
                                                <option value="Self">Self</option>
                                                <option value="Spouse">Spouse</option>
                                              </select>
                                            </FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.gratuity.${idx}.employer`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.gratuity.${idx}.serviceYears`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.gratuity.${idx}.amount`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2">
                                        <FormField name={`income.gratuity.${idx}.growth`} render={({ field }) => (
                                          <FormItem>
                                            <FormControl><input type="number" step="0.01" {...field} className="min-w-[120px] bg-background/60 w-full p-2 border rounded" /></FormControl>
                                          </FormItem>
                                        )} />
                                      </td>
                                      <td className="px-2 py-2 text-right">
                                        <button type="button" className="text-red-500" onClick={() => gratuityArray.remove(idx)}>Remove</button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="flex justify-between items-center mt-6">
                              <Button type="button" variant="secondary" onClick={() => gratuityArray.append({})}>+ Add Row</Button>
                              {/* Optionally add a Save button here if needed */}
                            </div>
                          </div>
                          {/* Save Income Details Button */}
                          <div className="flex justify-end mt-6">
                            <Button 
                              type="button" 
                              onClick={() => saveSection({ income: form.getValues('income') }, 'Income Details')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Save Income Details
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Financial Goals - This should be a separate page */}
                    <AccordionItem value="goals" className="bg-gradient-to-br from-background to-muted/60 rounded-xl shadow-lg border border-border px-4 py-6">
                      <AccordionTrigger>Financial Goals / Objectives</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              <strong>Note:</strong> Financial Goals should be managed on a separate page. 
                              This section will be moved to its own dedicated form.
                            </p>
                          </div>
                          <div className="flex justify-center mt-6">
                            <Button 
                              type="button" 
                              onClick={() => router.push(`/admin/financial-goals?userId=${userId}`)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Go to Financial Goals Page
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Planner's Questionnaire (Full) */}
                    <AccordionItem value="plannersQuestionnaire" className="bg-gradient-to-br from-background to-muted/60 rounded-xl shadow-lg border border-border px-4 py-6">
                      <AccordionTrigger>Planner's Questionnaire</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-semibold mb-2">Expected Rate of Returns & Asset Allocation for Model Portfolio (pre-tax)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField name="planner.expectedReturns.liquidAssets" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Highly Liquid Assets (%)</FormLabel>
                                  <FormControl><input type="number" step="0.01" {...field} className="w-full p-2 border rounded" /></FormControl>
                                </FormItem>
                              )} />
                              <FormField name="planner.expectedReturns.debtInstruments" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Debt Instruments (%)</FormLabel>
                                  <FormControl><input type="number" step="0.01" {...field} className="w-full p-2 border rounded" /></FormControl>
                                </FormItem>
                              )} />
                              <FormField name="planner.expectedReturns.stocksLarge" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Stocks & Funds (Large) (%)</FormLabel>
                                  <FormControl><input type="number" step="0.01" {...field} className="w-full p-2 border rounded" /></FormControl>
                                </FormItem>
                              )} />
                              <FormField name="planner.expectedReturns.stocksOthers" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Stocks & Funds (Others) (%)</FormLabel>
                                  <FormControl><input type="number" step="0.01" {...field} className="w-full p-2 border rounded" /></FormControl>
                                </FormItem>
                              )} />
                              <FormField name="planner.expectedReturns.realEstate" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Non-business Real Estate Assets (%)</FormLabel>
                                  <FormControl><input type="number" step="0.01" {...field} className="w-full p-2 border rounded" /></FormControl>
                                </FormItem>
                              )} />
                            </div>
                          </div>
                          <FormField name="planner.riskAppetiteJudgement" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Personal Judgement of the Planner about Kaushal Parekh with respect to Risk Appetite</FormLabel>
                              <FormControl><input {...field} className="w-full p-2 border rounded" /></FormControl>
                            </FormItem>
                          )} />
                          <FormField name="planner.overrideRiskProfiling" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Override logical risk profiling? (Zero exposure to equity)</FormLabel>
                              <FormControl>
                                <select {...field} className="w-full p-2 border rounded">
                                  <option value="">Select...</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </FormControl>
                            </FormItem>
                          )} />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="planner.totalFees" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Total Fees for Financial Planning (INR)</FormLabel>
                                <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                              </FormItem>
                            )} />
                            <FormField name="planner.advanceReceived" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Advance Received (INR)</FormLabel>
                                <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                              </FormItem>
                            )} />
                          </div>
                          <FormField name="planner.reviewPeriodicity" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Periodical Review Periodicity</FormLabel>
                              <FormControl><input {...field} className="w-full p-2 border rounded" /></FormControl>
                            </FormItem>
                          )} />
                          <div>
                            <h3 className="font-semibold mb-2">Value of Indices</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField name="planner.indices.cnxNifty" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CNX Nifty</FormLabel>
                                  <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                                </FormItem>
                              )} />
                              <FormField name="planner.indices.cnxMidcap" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CNX Midcap</FormLabel>
                                  <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                                </FormItem>
                              )} />
                              <FormField name="planner.indices.bankFDRate" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bank Fixed Deposit Rate</FormLabel>
                                  <FormControl><input type="number" step="0.01" {...field} className="w-full p-2 border rounded" /></FormControl>
                                </FormItem>
                              )} />
                              <div className="grid grid-cols-2 gap-2">
                                <FormField name="planner.indices.dateOfPlan" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Date of Plan</FormLabel>
                                    <FormControl><input type="date" {...field} className="w-full p-2 border rounded" /></FormControl>
                                  </FormItem>
                                )} />
                                <FormField name="planner.indices.dateOfReview" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Date of Review</FormLabel>
                                    <FormControl><input type="date" {...field} className="w-full p-2 border rounded" /></FormControl>
                                  </FormItem>
                                )} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Liabilities (Existing / Current Liabilities) */}
                    <AccordionItem value="liabilities" className="bg-gradient-to-br from-background to-muted/60 rounded-xl shadow-lg border border-border px-4 py-6">
                      <AccordionTrigger className="text-lg font-semibold">Existing / Current Liabilities</AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="space-y-8">
                          {/* a) Credit Card Dues & Other Immediate Cash Liabilities / Needs */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">a) Credit Card Dues & Other Immediate Cash Liabilities / Needs</h3>
                              <button type="button" className="text-blue-600" onClick={() => creditCardArray.append({})}>+ Add Row</button>
                            </div>
                            <div className="space-y-4">
                              {creditCardArray.fields.map((item, idx) => (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end bg-zinc-50 dark:bg-zinc-800 p-2 rounded">
                                  <FormField name={`liabilities.creditCards.${idx}.owner`} render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Owner</FormLabel>
                                      <FormControl>
                                        <select {...field} className="w-full p-2 border rounded">
                                          <option value="">Select...</option>
                                          <option value="Self">Self</option>
                                          <option value="Spouse">Spouse</option>
                                        </select>
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                  <FormField name={`liabilities.creditCards.${idx}.type`} render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Type</FormLabel>
                                      <FormControl><input {...field} className="w-full p-2 border rounded" /></FormControl>
                                    </FormItem>
                                  )} />
                                  <FormField name={`liabilities.creditCards.${idx}.institution`} render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Financial Institution</FormLabel>
                                      <FormControl><input {...field} className="w-full p-2 border rounded" /></FormControl>
                                    </FormItem>
                                  )} />
                                  <FormField name={`liabilities.creditCards.${idx}.amountOwed`} render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Amount Owed (INR)</FormLabel>
                                      <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                                    </FormItem>
                                  )} />
                                  <FormField name={`liabilities.creditCards.${idx}.creditLimit`} render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Credit Card Limit</FormLabel>
                                      <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                                    </FormItem>
                                  )} />
                                  <button type="button" className="text-red-500 ml-2" onClick={() => creditCardArray.remove(idx)}>Remove</button>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* b) Term Loans */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">b) Term Loans</h3>
                              <button type="button" className="text-blue-600" onClick={() => termLoanArray.append({})}>+ Add Row</button>
                            </div>
                            <div className="space-y-4">
                              {termLoanArray.fields.map((item, idx) => (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-7 gap-2 items-end bg-zinc-50 dark:bg-zinc-800 p-2 rounded">
                                  <FormField name={`liabilities.termLoans.${idx}.owner`} render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Owner</FormLabel>
                                      <FormControl>
                                        <select {...field} className="w-full p-2 border rounded">
                                          <option value="">Select...</option>
                                          <option value="Self">Self</option>
                                          <option value="Spouse">Spouse</option>
                                        </select>
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                  <FormField name={`liabilities.termLoans.${idx}.type`} render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Type</FormLabel>
                                      <FormControl><input {...field} className="w-full p-2 border rounded" /></FormControl>
                                    </FormItem>
                                  )} />
                                  <FormField name={`liabilities.termLoans.${idx}.institution`} render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Institution</FormLabel>
                                      <FormControl><input {...field} className="w-full p-2 border rounded" /></FormControl>
                                    </FormItem>
                                  )} />
                                  <FormField name={`liabilities.termLoans.${idx}.costOfBorrowing`} render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Cost of Borrowing %</FormLabel>
                                      <FormControl><input type="number" step="0.01" {...field} className="w-full p-2 border rounded" /></FormControl>
                                    </FormItem>
                                  )} />
                                  <FormField name={`liabilities.termLoans.${idx}.amountOwed`} render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Amount Owed as of now (INR)</FormLabel>
                                      <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                                    </FormItem>
                                  )} />
                                  <FormField name={`liabilities.termLoans.${idx}.emi`} render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>EMI (INR)</FormLabel>
                                      <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                                    </FormItem>
                                  )} />
                                  <FormField name={`liabilities.termLoans.${idx}.lastEmiDate`} render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Date of Last EMI</FormLabel>
                                      <FormControl><input type="date" {...field} className="w-full p-2 border rounded" /></FormControl>
                                    </FormItem>
                                  )} />
                                  <button type="button" className="text-red-500 ml-2" onClick={() => termLoanArray.remove(idx)}>Remove</button>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Additional fields below liabilities table */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="liabilities.emergencyFundMonths" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Emergency Fund Required for (Months)</FormLabel>
                                <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField name="liabilities.cashBalance" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cash Balance as on this date (INR)</FormLabel>
                                <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>
                          <FormField name="liabilities.professionalIndemnity" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Do you own any Professional Indemnity Insurance Cover?</FormLabel>
                              <FormControl>
                                <select {...field} className="w-full p-2 border rounded">
                                  <option value="">Select...</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField name="liabilities.coverageAmount" render={({ field }) => (
                            <FormItem>
                              <FormLabel>If answer above is affirmative, coverage amount (INR)</FormLabel>
                              <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField name="liabilities.lifeExpectancy" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Life Expectancy in Years</FormLabel>
                              <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField name="liabilities.expenseRatio" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Post-Retirement Living Expenses ratio to Current Expenses ratio</FormLabel>
                              <FormControl><input type="number" step="0.01" {...field} className="w-full p-2 border rounded" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField name="liabilities.standardOfLiving" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Standard of Living to be maintained in case of immediate death</FormLabel>
                              <FormControl><input {...field} className="w-full p-2 border rounded" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Post-Retirement Income */}
                    <AccordionItem value="postRetirementIncome" className="bg-gradient-to-br from-background to-muted/60 rounded-xl shadow-lg border border-border px-4 py-6">
                      <AccordionTrigger className="text-lg font-semibold">Post-Retirement Income (Job/Business/Profession/Superannuation)</AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">Expected Post-Retirement Income</h3>
                            <button type="button" className="text-blue-600" onClick={() => postRetirementIncomeArray.append({})}>+ Add Row</button>
                          </div>
                          <div className="space-y-4">
                            {postRetirementIncomeArray.fields.map((item, idx) => (
                              <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end bg-zinc-50 dark:bg-zinc-800 p-2 rounded">
                                <FormField name={`postRetirementIncome.${idx}.owner`} render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Owner</FormLabel>
                                    <FormControl>
                                      <select {...field} className="w-full p-2 border rounded">
                                        <option value="">Select...</option>
                                        <option value="Kaushal">Kaushal</option>
                                        <option value="Deepika">Deepika</option>
                                        <option value="Other">Other</option>
                                      </select>
                                    </FormControl>
                                  </FormItem>
                                )} />
                                <FormField name={`postRetirementIncome.${idx}.startYear`} render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Year</FormLabel>
                                    <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                                  </FormItem>
                                )} />
                                <FormField name={`postRetirementIncome.${idx}.endYear`} render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Year</FormLabel>
                                    <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                                  </FormItem>
                                )} />
                                <FormField name={`postRetirementIncome.${idx}.annualIncome`} render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Annual Income (INR)</FormLabel>
                                    <FormControl><input type="number" {...field} className="w-full p-2 border rounded" /></FormControl>
                                  </FormItem>
                                )} />
                                <FormField name={`postRetirementIncome.${idx}.growth`} render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Growth p.a. (%)</FormLabel>
                                    <FormControl><input type="number" step="0.01" {...field} className="w-full p-2 border rounded" /></FormControl>
                                  </FormItem>
                                )} />
                                <button type="button" className="text-red-500 ml-2" onClick={() => postRetirementIncomeArray.remove(idx)}>Remove</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Life Insurance - This should be a separate page */}
                    <AccordionItem value="lifeInsurance" className="bg-gradient-to-br from-background to-muted/60 rounded-xl shadow-lg border border-border px-4 py-6">
                      <AccordionTrigger className="text-lg font-semibold">Life Insurance Policies (Pure Term/Whole Life)</AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="space-y-4">
                          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              <strong>Note:</strong> Life Insurance should be managed on a separate page. 
                              This section will be moved to its own dedicated form.
                            </p>
                          </div>
                          <div className="flex justify-center mt-6">
                            <Button 
                              type="button" 
                              onClick={() => router.push(`/admin/life-insurance?userId=${userId}`)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Go to Life Insurance Page
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  {/* Final Submit Button */}
                  <div className="flex justify-center mt-8">
                    <Button 
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                    >
                      Complete & Submit Questionnaire
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
  );
}

export default function AdminQuestionnairePage() {
  return (
    <AdminPageWrapper>
      <AdminQuestionnairePageContent />
    </AdminPageWrapper>
  )
}
