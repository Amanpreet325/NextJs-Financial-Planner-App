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

type GoldItem = {
  no: string
  make: string
  carat: string
  weight: string
  value: string
  basis: string
}

type JewelleryItem = {
  no: string
  make: string
  value: string
  basis: string
}

export default function GoldJewelleryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const userId = searchParams.get('userId');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // React Hook Form setup
  const form = useForm({
    defaultValues: {
      goldSilver: { gold: "", silver: "" },
      goldItems: [{ no: "", make: "", carat: "", weight: "", value: "", basis: "" }] as GoldItem[],
      jewelleryItems: [{ no: "", make: "", value: "", basis: "" }] as JewelleryItem[],
      allocGold: "",
      allocJewellery: ""
    }
  });

  const goldItemsArray = useFieldArray({ control: form.control, name: 'goldItems' });
  const jewelleryItemsArray = useFieldArray({ control: form.control, name: 'jewelleryItems' });

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
    
    const loadGoldJewellery = async () => {
      try {
        const response = await fetch(`/api/admin/gold-jewellery/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.items) {
            const itemsData = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
            form.reset(itemsData);
          }
        } else if (response.status === 404) {
          console.log('No existing gold & jewellery data found');
        }
      } catch (error) {
        console.error('Error loading gold & jewellery data:', error);
      }
    };

    loadGoldJewellery();
  }, [userId, form]);

  // Save function
  const saveGoldJewellery = async (data: any) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setSaveStatus('Saving...');
      
      const response = await fetch(`/api/admin/gold-jewellery/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: data,
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
      console.error('Error saving gold & jewellery data:', error);
      setSaveStatus('✗ Save failed');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    await saveGoldJewellery(data);
  };

  // Calculate totals
  const watchedData = form.watch();
  const goldTotal = watchedData.goldItems?.reduce((sum: number, item: GoldItem) => sum + (parseFloat(item.value) || 0), 0) || 0;
  const jewelleryTotal = watchedData.jewelleryItems?.reduce((sum: number, item: JewelleryItem) => sum + (parseFloat(item.value) || 0), 0) || 0;

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
                    Gold & Jewellery Valuation<br />
                    <span className="text-base font-medium">(Annexure to Net Worth Statement, Physical Assets (VI), Constituent No.2)</span>
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
                    {/* Gold & Silver Summary */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Gold & Silver Summary</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Gold Std 24 C (INR)</label>
                          <FormField name="goldSilver.gold" render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} type="number" />
                              </FormControl>
                            </FormItem>
                          )} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Silver (INR)</label>
                          <FormField name="goldSilver.silver" render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} type="number" />
                              </FormControl>
                            </FormItem>
                          )} />
                        </div>
                      </div>
                    </div>

                    {/* Gold Items Table */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Gold & Silver Valuation</h3>
                      <div className="overflow-x-auto rounded-lg border bg-card/80">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/60">
                              <th className="px-2 py-2 text-center font-semibold border-b">No.</th>
                              <th className="px-2 py-2 text-center font-semibold border-b">Metal / Make</th>
                              <th className="px-2 py-2 text-center font-semibold border-b">Carat</th>
                              <th className="px-2 py-2 text-center font-semibold border-b">Weight in GMS</th>
                              <th className="px-2 py-2 text-center font-semibold border-b">Value in INR</th>
                              <th className="px-2 py-2 text-center font-semibold border-b">Basis of Valuation</th>
                              <th className="px-2 py-2 text-center font-semibold border-b">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {goldItemsArray.fields.map((item, idx) => (
                              <tr key={item.id} className="bg-card/80">
                                <td className="px-2 py-2 border-b">
                                  <FormField name={`goldItems.${idx}.no`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} className="w-16 text-center" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2 border-b">
                                  <FormField name={`goldItems.${idx}.make`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} className="w-32" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2 border-b">
                                  <FormField name={`goldItems.${idx}.carat`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} className="w-24" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2 border-b">
                                  <FormField name={`goldItems.${idx}.weight`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} className="w-24 text-right" type="number" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2 border-b">
                                  <FormField name={`goldItems.${idx}.value`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} className="w-24 text-right" type="number" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2 border-b">
                                  <FormField name={`goldItems.${idx}.basis`} render={({ field }) => (
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
                                    onClick={() => goldItemsArray.remove(idx)}
                                  >
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-accent/30">
                              <td colSpan={4} className="px-2 py-2 text-right font-bold border-b">Total Gold Value</td>
                              <td className="px-2 py-2 text-right font-bold border-b text-green-700">{goldTotal.toLocaleString("en-IN")}</td>
                              <td colSpan={2} className="border-b"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => goldItemsArray.append({ no: "", make: "", carat: "", weight: "", value: "", basis: "" })}
                      >
                        + Add Gold Item
                      </Button>
                    </div>

                    {/* Jewellery Items Table */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Valuation of Jewellery/Precious Metals/Stones</h3>
                      <div className="overflow-x-auto rounded-lg border bg-card/80">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/60">
                              <th className="px-2 py-2 text-center font-semibold border-b">No.</th>
                              <th className="px-2 py-2 text-center font-semibold border-b">Metal / Make</th>
                              <th className="px-2 py-2 text-center font-semibold border-b">Value in INR</th>
                              <th className="px-2 py-2 text-center font-semibold border-b">Basis of Valuation</th>
                              <th className="px-2 py-2 text-center font-semibold border-b">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {jewelleryItemsArray.fields.map((item, idx) => (
                              <tr key={item.id} className="bg-card/80">
                                <td className="px-2 py-2 border-b">
                                  <FormField name={`jewelleryItems.${idx}.no`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} className="w-16 text-center" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2 border-b">
                                  <FormField name={`jewelleryItems.${idx}.make`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} className="w-40" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2 border-b">
                                  <FormField name={`jewelleryItems.${idx}.value`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} className="w-24 text-right" type="number" />
                                      </FormControl>
                                    </FormItem>
                                  )} />
                                </td>
                                <td className="px-2 py-2 border-b">
                                  <FormField name={`jewelleryItems.${idx}.basis`} render={({ field }) => (
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
                                    onClick={() => jewelleryItemsArray.remove(idx)}
                                  >
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-accent/30">
                              <td colSpan={2} className="px-2 py-2 text-right font-bold border-b">Total Jewellery Value</td>
                              <td className="px-2 py-2 text-right font-bold border-b text-green-700">{jewelleryTotal.toLocaleString("en-IN")}</td>
                              <td colSpan={2} className="border-b"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => jewelleryItemsArray.append({ no: "", make: "", value: "", basis: "" })}
                      >
                        + Add Jewellery Item
                      </Button>
                    </div>

                    {/* Allocable Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Allocable Gold Value (INR)</label>
                        <FormField name="allocGold" render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" />
                            </FormControl>
                          </FormItem>
                        )} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Allocable Jewellery Value (INR)</label>
                        <FormField name="allocJewellery" render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" />
                            </FormControl>
                          </FormItem>
                        )} />
                      </div>
                    </div>

                    <div className="flex justify-center mt-6">
                      <Button type="submit" disabled={isLoading} className="w-48">
                        {isLoading ? 'Saving...' : 'Save Gold & Jewellery'}
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
