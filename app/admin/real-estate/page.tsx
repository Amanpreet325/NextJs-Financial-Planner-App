"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { GridPattern } from "@/components/grid-pattern"
import { cn } from "@/lib/utils"
import { AdminPageWrapper } from "@/components/AdminPageWrapper"

const columns = [
  "No.",
  "Name of the Owner",
  "Type of Property",
  "Details of Property (Address, Location)",
  "Market Value",
  "Date of Acquisition",
  "Purchase Cost",
  "Annual Rent Received",
  "Return Earned %"
]

type Row = {
  no: string
  owner: string
  type: string
  details: string
  market: string
  date: string
  purchase: string
  rent: string
  returnPercent: string
}

function RealEstatePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const userId = searchParams.get('userId');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const [rows, setRows] = useState<Row[]>([
    {
      no: "",
      owner: "",
      type: "",
      details: "",
      market: "",
      date: "",
      purchase: "",
      rent: "",
      returnPercent: ""
    }
  ])

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
    
    const loadRealEstate = async () => {
      try {
        console.log('Loading real estate for userId:', userId);
        const response = await fetch(`/api/admin/real-estate/${userId}`);
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Loaded data:', data);
          
          if (data.properties) {
            const propertiesData = typeof data.properties === 'string' ? JSON.parse(data.properties) : data.properties;
  setRows(propertiesData);
          }
        } else if (response.status === 404) {
          console.log('No existing real estate data found');
        } else {
          console.error('Error response:', await response.text());
        }
      } catch (error) {
        console.error('Error loading real estate data:', error);
      }
    };

    loadRealEstate();
  }, [userId]);

  // Save function
  const saveRealEstate = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setSaveStatus('Saving...');
      
      const response = await fetch(`/api/admin/real-estate/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          properties: rows,
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
      console.error('Error saving real estate data:', error);
      setSaveStatus('✗ Save failed');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (idx: number, field: keyof Row, value: string) => {
    const updated = [...rows]
    updated[idx][field] = value
    setRows(updated)
  }

  const addRow = () => {
    setRows([
      ...rows,
      {
        no: "",
        owner: "",
        type: "",
        details: "",
        market: "",
        date: "",
        purchase: "",
        rent: "",
        returnPercent: ""
      }
    ])
  }

  const totalMarket = rows.reduce((sum, r) => sum + (parseFloat(r.market.replace(/,/g, "")) || 0), 0)
  const totalRent = rows.reduce((sum, r) => sum + (parseFloat(r.rent.replace(/,/g, "")) || 0), 0)

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
                    Non-Business Real Estate Assets (Saleable & Not Saleable)
                    <br />
                    <span className="text-base font-medium">(Annexure to Net Worth Statement, Constituent No. 25 to 28, 34 & 37)</span>
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
                      {rows.map((row, idx) => (
                        <tr key={idx} className="bg-card/80 hover:bg-accent/30 transition-colors">
                          <td className="px-2 py-2 border-b">
                            <Input value={row.no} onChange={e => handleChange(idx, "no", e.target.value)} className="w-12 text-center" />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <Input value={row.owner} onChange={e => handleChange(idx, "owner", e.target.value)} className="w-40" />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <Input value={row.type} onChange={e => handleChange(idx, "type", e.target.value)} className="w-32" />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <Input value={row.details} onChange={e => handleChange(idx, "details", e.target.value)} className="w-64" />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <Input value={row.market} onChange={e => handleChange(idx, "market", e.target.value)} className="w-24 text-right" type="text" />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <Input value={row.date} onChange={e => handleChange(idx, "date", e.target.value)} className="w-32" type="date" />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <Input value={row.purchase} onChange={e => handleChange(idx, "purchase", e.target.value)} className="w-24 text-right" type="text" />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <Input value={row.rent} onChange={e => handleChange(idx, "rent", e.target.value)} className="w-24 text-right" type="text" />
                          </td>
                          <td className="px-2 py-2 border-b">
                            <Input value={row.returnPercent} onChange={e => handleChange(idx, "returnPercent", e.target.value)} className="w-24 text-right" type="text" />
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-accent/30">
                        <td colSpan={4} className="px-2 py-2 text-right font-bold border-b">Return on Real Estate Portfolio</td>
                        <td className="px-2 py-2 text-right font-bold border-b text-green-700 dark:text-green-300">{totalMarket.toLocaleString("en-IN")}</td>
                        <td colSpan={2} className="border-b"></td>
                        <td className="px-2 py-2 text-right font-bold border-b text-green-700 dark:text-green-300">{totalRent.toLocaleString("en-IN")}</td>
                        <td className="border-b"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={addRow}>
                    + Add Row
                  </Button>
                  <Button onClick={saveRealEstate} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Real Estate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function RealEstatePage() {
  return (
    <AdminPageWrapper>
      <RealEstatePageContent />
    </AdminPageWrapper>
  )
}
