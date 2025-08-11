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
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { GridPattern } from "@/components/grid-pattern";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";

export default function MedicalInsurancePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const userId = searchParams.get('userId');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // React Hook Form setup
  const form = useForm({
    defaultValues: {
      members: [
        { member: '', dependency: '' }
      ],
      accidentDetails: [
        { existingCover: '', policyNoCompany: '', premiumPA: '', dueDatePA: '', age: '' }
      ],
      healthDetails: [
        { health: '', existingHealthCover: '', healthPolicyNoCompany: '', premiumHealth: '', dueDateHealth: '' }
      ]
    }
  });

  const membersArray = useFieldArray({ control: form.control, name: 'members' });
  const accidentArray = useFieldArray({ control: form.control, name: 'accidentDetails' });
  const healthArray = useFieldArray({ control: form.control, name: 'healthDetails' });

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
    
    const loadMedicalInsurance = async () => {
      try {
        const response = await fetch(`/api/admin/medical-insurance/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.policies) {
            const policiesData = typeof data.policies === 'string' ? JSON.parse(data.policies) : data.policies;
            form.reset({
              members: policiesData.members || [{ member: '', dependency: '' }],
              accidentDetails: policiesData.accidentDetails || [{ existingCover: '', policyNoCompany: '', premiumPA: '', dueDatePA: '', age: '' }],
              healthDetails: policiesData.healthDetails || [{ health: '', existingHealthCover: '', healthPolicyNoCompany: '', premiumHealth: '', dueDateHealth: '' }]
            });
          }
        } else if (response.status === 404) {
          console.log('No existing medical insurance found');
        }
      } catch (error) {
        console.error('Error loading medical insurance:', error);
      }
    };

    loadMedicalInsurance();
  }, [userId, form]);

  // Save function
  const saveMedicalInsurance = async (data: any) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setSaveStatus('Saving...');
      
      const payload = {
        policies: {
          members: data.members,
          accidentDetails: data.accidentDetails,
          healthDetails: data.healthDetails
        }
      };
      
      const response = await fetch(`/api/admin/medical-insurance/${userId}`, {
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
      console.error('Error saving medical insurance:', error);
      setSaveStatus('✗ Save failed');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    await saveMedicalInsurance(data);
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
          {/* Subtle grid background */}
          <GridPattern className="z-0"  />
          <div className="relative z-10 flex flex-col gap-10 w-full max-w-[98vw] xl:max-w-[1700px]">
            <Card className="w-full bg-gradient-to-br from-background to-muted/60 shadow-lg border border-border px-2 py-4 md:px-4 md:py-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Health Profile, Health Insurance & Personal Accident Insurance</CardTitle>
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {/* Summary Row */}
                  <div className="mb-4">
                    <table className="w-full border-separate border-spacing-y-2">
                      <thead>
                        <tr className="bg-muted/60">
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Member</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Dependency</th>
                          <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {membersArray.fields.map((item, index) => (
                          <tr key={item.id} className="bg-card/80 hover:bg-accent/30 transition-colors">
                            <td className="px-2 py-2">
                              <FormField name={`members.${index}.member`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} className="min-w-[90px] md:min-w-[110px] bg-background/60" placeholder="Member" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <FormField name={`members.${index}.dependency`} render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} className="min-w-[90px] md:min-w-[110px] bg-background/60" placeholder="Dependency" />
                                  </FormControl>
                                </FormItem>
                              )} />
                            </td>
                            <td className="px-2 py-2">
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                onClick={() => membersArray.remove(index)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      className="mt-2"
                      onClick={() => membersArray.append({ member: '', dependency: '' })}
                    >
                      + Add Member
                    </Button>
                  </div>
                  <Accordion type="single" collapsible defaultValue="accident">
                    <AccordionItem value="accident">
                      <AccordionTrigger className="text-base font-semibold">Personal Accident Details</AccordionTrigger>
                      <AccordionContent>
                        <table className="w-full border-separate border-spacing-y-2">
                          <thead>
                            <tr className="bg-muted/40">
                              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Existing PA Cover (INR)</th>
                              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">PA Policy No. & Company</th>
                              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Premium p.a. (Rs.)</th>
                              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">PA Policy Due Date</th>
                              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Age (in Years)</th>
                              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {accidentArray.fields.map((item, index) => (
                              <tr key={item.id} className="bg-card/80 hover:bg-accent/30 transition-colors">
                                <td className="px-2 py-2">
                                  <FormField name={`accidentDetails.${index}.existingCover`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} type="number" className="min-w-[90px] md:min-w-[110px] bg-background/60" placeholder="PA Cover" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2">
                                  <FormField name={`accidentDetails.${index}.policyNoCompany`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} className="min-w-[90px] md:min-w-[110px] bg-background/60" placeholder="Policy & Company" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2">
                                  <FormField name={`accidentDetails.${index}.premiumPA`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} type="number" className="min-w-[90px] md:min-w-[110px] bg-background/60" placeholder="Premium" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2">
                                  <FormField name={`accidentDetails.${index}.dueDatePA`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} type="date" className="min-w-[90px] md:min-w-[110px] bg-background/60" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2">
                                  <FormField name={`accidentDetails.${index}.age`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} type="number" className="min-w-[90px] md:min-w-[110px] bg-background/60" placeholder="Age" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2">
                                  <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => accidentArray.remove(index)}
                                  >
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <Button 
                          type="button" 
                          variant="secondary" 
                          className="mt-2"
                          onClick={() => accidentArray.append({ existingCover: '', policyNoCompany: '', premiumPA: '', dueDatePA: '', age: '' })}
                        >
                          + Add Accident Detail
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="health">
                      <AccordionTrigger className="text-base font-semibold">Health Insurance Details</AccordionTrigger>
                      <AccordionContent>
                        <table className="w-full border-separate border-spacing-y-2">
                          <thead>
                            <tr className="bg-muted/40">
                              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Health</th>
                              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Existing Health Cover in INR</th>
                              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Health Policy No. & Company</th>
                              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Premium p.a. (Rs.)</th>
                              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Policy Due Date</th>
                              <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {healthArray.fields.map((item, index) => (
                              <tr key={item.id} className="bg-card/80 hover:bg-accent/30 transition-colors">
                                <td className="px-2 py-2">
                                  <FormField name={`healthDetails.${index}.health`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} className="min-w-[90px] md:min-w-[110px] bg-background/60" placeholder="Health" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2">
                                  <FormField name={`healthDetails.${index}.existingHealthCover`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} type="number" className="min-w-[90px] md:min-w-[110px] bg-background/60" placeholder="Health Cover" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2">
                                  <FormField name={`healthDetails.${index}.healthPolicyNoCompany`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} className="min-w-[90px] md:min-w-[110px] bg-background/60" placeholder="Policy & Company" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2">
                                  <FormField name={`healthDetails.${index}.premiumHealth`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} type="number" className="min-w-[90px] md:min-w-[110px] bg-background/60" placeholder="Premium" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2">
                                  <FormField name={`healthDetails.${index}.dueDateHealth`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} type="date" className="min-w-[90px] md:min-w-[110px] bg-background/60" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2">
                                  <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => healthArray.remove(index)}
                                  >
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <Button 
                          type="button" 
                          variant="secondary" 
                          className="mt-2"
                          onClick={() => healthArray.append({ health: '', existingHealthCover: '', healthPolicyNoCompany: '', premiumHealth: '', dueDateHealth: '' })}
                        >
                          + Add Health Detail
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="flex justify-center items-center mt-6">
                    <Button type="submit" className="px-8" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Medical Insurance'}
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
