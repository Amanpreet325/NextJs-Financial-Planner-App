"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { GridPattern } from "@/components/grid-pattern"
import { cn } from "@/lib/utils"
import { de } from "zod/v4/locales"

const columns = [
	"No.",
	"Name of the Holder",
	"A/C / Folio No.",
	"Bank / M/F Name",
	"Balance",
	"Nominee",
	"Address",
	"MICR, if applicable",
	"IFSC, if any",
	"Savings / Liquid M/F",
]

export default function DemandDepositsPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { data: session, status } = useSession();
	
	const userId = searchParams.get('userId');
	const [isLoading, setIsLoading] = useState(false);
	const [isDataLoading, setIsDataLoading] = useState(false);
	const [saveStatus, setSaveStatus] = useState('');

	const [rows, setRows] = useState([
		{
			no: "",
			holder: "",
			account: "",
			bank: "",
			balance: "",
			nominee: "",
			address: "",
			micr: "",
			ifsc: "",
			type: "",
		},
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
		
		const loadDemandDeposits = async () => {
			try {
				setIsDataLoading(true);
				console.log('Loading demand deposits for userId:', userId);
				const response = await fetch(`/api/admin/demand-deposits/${userId}`);
				console.log('Response status:', response.status);
				
				if (response.ok) {
					const data = await response.json();
					console.log('Loaded data:', data);
					
					if (Array.isArray(data.accounts)) {
  setRows(data.accounts);
}
				} else if (response.status === 404) {
					console.log('No existing demand deposits data found');
				} else {
					console.error('Error response:', await response.text());
				}
			} catch (error) {
				console.error('Error loading demand deposits data:', error);
			} finally {
				setIsDataLoading(false);
			}
		};

		loadDemandDeposits();
	}, [userId]);

	// Save function
	const saveDemandDeposits = async () => {
		if (!userId) return;
		
		try {
			setIsLoading(true);
			setSaveStatus('Saving...');
			
			const response = await fetch(`/api/admin/demand-deposits/${userId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					accounts: rows,
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
			console.error('Error saving demand deposits data:', error);
			setSaveStatus('✗ Save failed');
			setTimeout(() => setSaveStatus(''), 3000);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (idx: number, field: string, value: string) => {
		const updated = [...rows]
		updated[idx][field as keyof typeof updated[0]] = value
		setRows(updated)
	}

	const addRow = () => {
		setRows([
			...rows,
			{
				no: "",
				holder: "",
				account: "",
				bank: "",
				balance: "",
				nominee: "",
				address: "",
				micr: "",
				ifsc: "",
				type: "",
			},
		])
	}

	const totalBalance = rows.reduce((sum, r) => sum + (parseFloat(r.balance) || 0), 0)

	if (status === "loading" || isDataLoading) return <div>Loading...</div>;
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
					<div className="relative z-1 flex flex-col gap-10 w-full max-w-[98vw] xl:max-w-[1700px]">
						<Card className="w-full bg-gradient-to-br from-background to-muted/60 shadow-lg border border-border px-2 py-4 md:px-4 md:py-6">
							<CardContent>
								<div className="flex justify-between items-center mb-4">
									<h2 className="text-xl font-bold text-center text-primary">
										Balance with Banks (Savings) & Liquid Schemes of Mutual Funds
										<br />
										<span className="text-base font-medium">
											(Annexure to Net Worth Statement, Constituent No.2)
										</span>
										<br />
										<span className="text-sm text-muted-foreground">in INR</span>
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
													<th
														key={col}
														className="px-2 py-2 font-semibold text-center border-b text-muted-foreground whitespace-nowrap"
													>
														{col}
													</th>
												))}
											</tr>
										</thead>
										<tbody>
											{rows.map((row, idx) => (
												<tr
													key={idx}
													className="bg-card/80 hover:bg-accent/30 transition-colors"
												>
													<td className="px-2 py-2 border-b">
														<Input
															value={row.no}
															onChange={(e) =>
																handleChange(idx, "no", e.target.value)
															}
															className="w-16 text-center"
														/>
													</td>
													<td className="px-2 py-2 border-b">
														<Input
															value={row.holder}
															onChange={(e) =>
																handleChange(idx, "holder", e.target.value)
															}
															className="w-40"
														/>
													</td>
													<td className="px-2 py-2 border-b">
														<Input
															value={row.account}
															onChange={(e) =>
																handleChange(idx, "account", e.target.value)
															}
															className="w-32"
														/>
													</td>
													<td className="px-2 py-2 border-b">
														<Input
															value={row.bank}
															onChange={(e) =>
																handleChange(idx, "bank", e.target.value)
															}
															className="w-32"
														/>
													</td>
													<td className="px-2 py-2 border-b">
														<Input
															value={row.balance}
															onChange={(e) =>
																handleChange(idx, "balance", e.target.value)
															}
															className="w-24 text-right"
															type="number"
														/>
													</td>
													<td className="px-2 py-2 border-b">
														<Input
															value={row.nominee}
															onChange={(e) =>
																handleChange(idx, "nominee", e.target.value)
															}
															className="w-32"
														/>
													</td>
													<td className="px-2 py-2 border-b">
														<Input
															value={row.address}
															onChange={(e) =>
																handleChange(idx, "address", e.target.value)
															}
															className="w-40"
														/>
													</td>
													<td className="px-2 py-2 border-b">
														<Input
															value={row.micr}
															onChange={(e) =>
																handleChange(idx, "micr", e.target.value)
															}
															className="w-24"
														/>
													</td>
													<td className="px-2 py-2 border-b">
														<Input
															value={row.ifsc}
															onChange={(e) =>
																handleChange(idx, "ifsc", e.target.value)
															}
															className="w-24"
														/>
													</td>
													<td className="px-2 py-2 border-b">
														<Input
															value={row.type}
															onChange={(e) =>
																handleChange(idx, "type", e.target.value)
															}
															className="w-32"
														/>
													</td>
												</tr>
											))}
											<tr className="bg-accent/30">
												<td colSpan={4} className="px-2 py-2 text-right font-bold border-b">
													Total
												</td>
												<td className="px-2 py-2 text-right font-bold border-b text-green-700 dark:text-green-300">
													{totalBalance.toLocaleString("en-IN")}
												</td>
												<td colSpan={5} className="border-b"></td>
											</tr>
										</tbody>
									</table>
								</div>
								<div className="flex justify-between mt-4">
									<Button variant="outline" onClick={addRow}>
										+ Add Row
									</Button>
									<Button onClick={saveDemandDeposits} disabled={isLoading}>
										{isLoading ? 'Saving...' : 'Save Demand Deposits'}
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
