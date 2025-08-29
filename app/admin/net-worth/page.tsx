"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { GridPattern } from "@/components/grid-pattern"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form"
import { AdminPageWrapper } from "@/components/AdminPageWrapper"

const ASSET_SECTIONS = [
   {
	   key: "demandDeposits",
	   label: "Cash & Bank Balances as Demand Deposits",
	   items: ["Cash Balance", "Balance with Banks / Post Offices / Liquid MF"],
   },
   {
	   key: "liquidAssets",
	   label: "Highly Liquid Assets",
	   items: [
		   "Bank / Post Office / NBFC Term (Time) Deposits",
		   "RBI Bonds / Treasury Bills / Government Bonds",
		   "Other Receivables / Receivables (Allocable)",
		   "Fund Value of ULIPs of Life Insurance Cos.(Liquid)",
		   "Short Term Schemes of Mutual Funds",
	   ],
   },
   {
	   key: "debtInstruments",
	   label: "Debt Instruments",
	   items: [
		   "Bank / Post Office Recurring Deposits",
		   "National Savings Certificates & Kisan Vikas Patras",
		   "Corporate Bonds, Debentures, Deposits",
		   "Balance in PPF Accounts",
		   "Balance in EPF Accounts & NPS",
		   "Fund Value of ULIPs of Life Insurance Cos.(Debt)",
		   "Jewellery, Gold, Silver, Metals (Allocable)",
		   "Mutual Fund ETFs of Gold & Other Precious Metals",
		   "Value of Precious Metals",
		   "Gilt & Long Term Debt Schemes of Mutual Funds",
	   ],
   },
   {
	   key: "largeCapEquity",
	   label: "Stocks & Equity Related Instruments (Large Cap Equities, Large Cap Funds)",
	   items: [
		   "Equity Shareholdings, Nifty Bees, ETFs",
		   "Equity-Oriented Mutual Funds, Index Funds",
		   "Preference Shareholdings",
		   "Fund Value of ULIPs of Life Insurance Cos.(Equity)",
	   ],
   },
   {
	   key: "midSmallCapEquity",
	   label: "Stocks & Equity Related Instruments (Mid / Small Cap Equities & Funds, Sectoral Funds, International Funds & such other funds)",
	   items: [
		   "Equity Shareholdings, PMS",
		   "Preference Shareholdings",
		   "Equity-Oriented Mutual Funds",
	   ],
   },
   {
	   key: "realEstateSaleable",
	   label: "Non-business Real Estate Assets (Saleable)",
	   items: ["Flats / Bungalow", "Commercial Premises", "Plots of Land", "Developmental Rights"],
   },
   {
	   key: "otherNonMarketable",
	   label: "Other non-marketable Assets",
	   items: ["Value of Collectibles", "Paintings / Sculptures / etc. of Artistic Value"],
   },
   {
	   key: "illiquidHedging",
	   label: "Illiquid Assets, Hedging Instruments, Non-Allocables",
	   items: [
		   "Intangible Rights",
		   "Vehicles (Two & Four Wheelers)",
		   "Household Furniture & White Goods",
		   "Self-occupied house property",
		   "Futures & Options - Equities",
		   "Non-allocable Jewellery, Gold, Silver, Metals",
		   "Real Estate Assets (Not Saleable)",
	   ],
   },
   {
	   key: "businessValuations",
	   label: "Business Valuations (Net Worth)",
	   items: ["(Add business assets as needed)"],
   },
]

const LIABILITY_SECTIONS = [
   {
	   key: "currentLiabilities",
	   label: "Current / Short Term Liabilities",
	   items: [
		   "Credit Card Dues",
		   "Outstanding Utility Bills (Tele, Electricity, Mobile, etc.)",
		   "Tax Dues",
		   "Overdraft facility utilised",
		   "Others",
	   ],
   },
   {
	   key: "longTermLiabilities",
	   label: "Long Term Liabilities",
	   items: ["Term Loans"],
   },
]

type Row = {
	item: string
	value: string
	percent: string
}

type SectionState = {
	rows: Row[]
}

function NetWorthPageContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { data: session, status } = useSession();
	
	const userId = searchParams.get('userId');
	const [isLoading, setIsLoading] = useState(false);
	const [saveStatus, setSaveStatus] = useState('');

	// Create default values for React Hook Form
	const createDefaultValues = () => {
		const defaultAssets: Record<string, any> = {};
		const defaultLiabilities: Record<string, any> = {};
		
		ASSET_SECTIONS.forEach(sec => {
			defaultAssets[sec.key] = sec.items.reduce((acc, item) => {
				acc[item] = { value: "", percent: "" };
				return acc;
			}, {} as Record<string, any>);
		});
		
		LIABILITY_SECTIONS.forEach(sec => {
			defaultLiabilities[sec.key] = sec.items.reduce((acc, item) => {
				acc[item] = { value: "", percent: "" };
				return acc;
			}, {} as Record<string, any>);
		});

		return { assets: defaultAssets, liabilities: defaultLiabilities };
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
		
		const loadNetWorth = async () => {
			try {
				const response = await fetch(`/api/admin/net-worth/${userId}`);
				if (response.ok) {
					const data = await response.json();
					if (data.assets && data.liabilities) {
  form.reset({
    assets: typeof data.assets === 'string' ? JSON.parse(data.assets) : data.assets,
    liabilities: typeof data.liabilities === 'string' ? JSON.parse(data.liabilities) : data.liabilities,
  });
}
				} else if (response.status === 404) {
					console.log('No existing net worth data found');
				}
			} catch (error) {
				console.error('Error loading net worth data:', error);
			}
		};

		loadNetWorth();
	}, [userId, form]);

	// Save function
	const saveNetWorth = async (data: any) => {
		if (!userId) return;
		
		try {
			setIsLoading(true);
			setSaveStatus('Saving...');
			
			const response = await fetch(`/api/admin/net-worth/${userId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					assets: data.assets,
  					liabilities: data.liabilities,
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
			console.error('Error saving net worth data:', error);
			setSaveStatus('✗ Save failed');
			setTimeout(() => setSaveStatus(''), 3000);
		} finally {
			setIsLoading(false);
		}
	};

	const onSubmit = async (data: any) => {
		await saveNetWorth(data);
	};

	// Helper function to get section total
	const getSectionTotal = (sectionKey: string, type: 'assets' | 'liabilities') => {
		const watchedData = form.watch();
		const section = type === 'assets' ? watchedData.assets?.[sectionKey] : watchedData.liabilities?.[sectionKey];
		if (!section) return 0;
		
		return Object.values(section).reduce((sum: number, item: any) => {
			return sum + (parseFloat(item.value?.replace(/,/g, "") || "0") || 0);
		}, 0);
	};

	// Calculate totals
	const watchedData = form.watch();
	const assetGrandTotal = ASSET_SECTIONS.reduce((sum, sec) => sum + getSectionTotal(sec.key, 'assets'), 0);
	const liabilityGrandTotal = LIABILITY_SECTIONS.reduce((sum, sec) => sum + getSectionTotal(sec.key, 'liabilities'), 0);
	const netWorth = assetGrandTotal - liabilityGrandTotal;

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
									<h2 className="text-xl font-bold text-center text-primary">Net Worth Statement</h2>
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
										{/* ASSETS DROPDOWN */}
										<div>
										   <h3 className="text-lg font-semibold mb-2 text-white">Assets</h3>
										   <Accordion type="multiple" className="flex flex-col gap-4">
											   {ASSET_SECTIONS.map((section, idx) => (
												   <AccordionItem key={section.key} value={section.key} className="mb-2 rounded border border-border bg-muted/80">
													   <AccordionTrigger className="px-4 py-2 font-semibold text-base text-white bg-muted/90 rounded-t-lg flex items-center justify-between">
														   <span>{section.label}</span>
													   </AccordionTrigger>
													   <AccordionContent>
															<div className="overflow-x-auto">
																<table className="w-full text-sm">
																	<thead>
																		<tr className="bg-muted/40">
																			<th className="px-2 py-2 text-left font-semibold border-b">Asset Item</th>
																			<th className="px-2 py-2 text-center font-semibold border-b">Value in INR</th>
																			<th className="px-2 py-2 text-center font-semibold border-b">% of Total Assets</th>
																		</tr>
																	</thead>
																	<tbody>
																		{section.items.map((item, i) => (
																			<tr key={i}>
																				<td className="px-2 py-1 border-b min-w-[200px]">{item}</td>
																				<td className="px-2 py-1 border-b">
																					<FormField 
																						name={`assets.${section.key}.${item}.value`} 
																						render={({ field }) => (
																							<FormItem>
																								<FormControl>
																									<Input {...field} className="w-32 text-right" type="text" />
																								</FormControl>
																							</FormItem>
																						)} 
																					/>
																				</td>
																				<td className="px-2 py-1 border-b">
																					<FormField 
																						name={`assets.${section.key}.${item}.percent`} 
																						render={({ field }) => (
																							<FormItem>
																								<FormControl>
																									<Input {...field} className="w-20 text-right" type="text" />
																								</FormControl>
																							</FormItem>
																						)} 
																					/>
																				</td>
																			</tr>
																		))}
																	   <tr className="font-bold bg-accent/20">
																		   <td className="px-2 py-1 text-right border-b">Total of {String.fromCharCode(73 + idx)}</td>
																		   <td className="px-2 py-1 text-right border-b text-white">
																			   {getSectionTotal(section.key, 'assets').toLocaleString("en-IN")}
																		   </td>
																		   <td className="border-b"></td>
																	   </tr>
																	</tbody>
																</table>
															</div>
														</AccordionContent>
													</AccordionItem>
												))}
											</Accordion>
										</div>
										{/* LIABILITIES DROPDOWN */}
										<div>
										   <h3 className="text-lg font-semibold mb-2 text-white">Liabilities</h3>
										   <Accordion type="multiple" className="flex flex-col gap-4">
											   {LIABILITY_SECTIONS.map((section, idx) => (
												   <AccordionItem key={section.key} value={section.key} className="mb-2 rounded border border-border bg-muted/80">
													   <AccordionTrigger className="px-4 py-2 font-semibold text-base text-white bg-muted/90 rounded-t-lg flex items-center justify-between">
														   <span>{section.label}</span>
													   </AccordionTrigger>
													   <AccordionContent>
															<div className="overflow-x-auto">
																<table className="w-full text-sm">
																	<thead>
																		<tr className="bg-muted/40">
																			<th className="px-2 py-2 text-left font-semibold border-b">Liability Item</th>
																			<th className="px-2 py-2 text-center font-semibold border-b">Value in INR</th>
																			<th className="px-2 py-2 text-center font-semibold border-b">% of Total Liabilities</th>
																		</tr>
																	</thead>
																	<tbody>
																		{section.items.map((item, i) => (
																			<tr key={i}>
																				<td className="px-2 py-1 border-b min-w-[200px]">{item}</td>
																				<td className="px-2 py-1 border-b">
																					<FormField 
																						name={`liabilities.${section.key}.${item}.value`} 
																						render={({ field }) => (
																							<FormItem>
																								<FormControl>
																									<Input {...field} className="w-32 text-right" type="text" />
																								</FormControl>
																							</FormItem>
																						)} 
																					/>
																				</td>
																				<td className="px-2 py-1 border-b">
																					<FormField 
																						name={`liabilities.${section.key}.${item}.percent`} 
																						render={({ field }) => (
																							<FormItem>
																								<FormControl>
																									<Input {...field} className="w-20 text-right" type="text" />
																								</FormControl>
																							</FormItem>
																						)} 
																					/>
																				</td>
																			</tr>
																		))}
																	   <tr className="font-bold bg-accent/20">
																		   <td className="px-2 py-1 text-right border-b">Total of {idx === 0 ? "XI" : "XII"}</td>
																		   <td className="px-2 py-1 text-right border-b text-white">
																			   {getSectionTotal(section.key, 'liabilities').toLocaleString("en-IN")}
																		   </td>
																		   <td className="border-b"></td>
																	   </tr>
																	</tbody>
																</table>
															</div>
														</AccordionContent>
													</AccordionItem>
												))}
											</Accordion>
										</div>
										{/* GRAND TOTALS */}
									   <div className="flex flex-col gap-2 mt-6">
										   <div className="flex justify-between items-center bg-muted/80 rounded px-4 py-2 font-semibold text-white">
											   <span>Grand Total of I to IX (Total Assets) [X]</span>
											   <span>{assetGrandTotal.toLocaleString("en-IN")}</span>
										   </div>
										   <div className="flex justify-between items-center bg-muted/80 rounded px-4 py-2 font-semibold text-white">
											   <span>Grand Total of XI & XII (Total Liabilities) [XIII]</span>
											   <span>{liabilityGrandTotal.toLocaleString("en-IN")}</span>
										   </div>
										   <div className="flex justify-between items-center bg-accent/30 rounded px-4 py-2 font-semibold text-lg text-white">
											   <span>Net Worth as on [X - XIII]</span>
											   <span>{netWorth.toLocaleString("en-IN")}</span>
										   </div>
									   </div>

									   <div className="flex justify-center mt-6">
											<Button type="submit" disabled={isLoading} className="w-48">
												{isLoading ? 'Saving...' : 'Save Net Worth'}
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

export default function NetWorthPage() {
  return (
    <AdminPageWrapper>
      <NetWorthPageContent />
    </AdminPageWrapper>
  )
}
