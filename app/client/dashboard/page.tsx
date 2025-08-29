"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ClientShell } from "@/components/client/layout/ClientSidebar";
import { TopBar } from "@/components/client/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, TrendingUpIcon, DollarSignIcon, PiggyBankIcon, CreditCardIcon, TargetIcon, AlertTriangleIcon } from "lucide-react";
import { NetWorthChart } from "@/components/client/charts/NetWorthChart";
import { ExpensePieChart } from "@/components/client/charts/ExpensePieChart";
import { CashFlowChart } from "@/components/client/charts/CashFlowChart";
import { useNetWorthData, formatINRSimple } from "@/hooks/useNetWorthData";
import { useMockKpis } from "@/lib/client/mocks";

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: netWorthData, loading: netWorthLoading, error: netWorthError } = useNetWorthData();
  const mockKpis = useMockKpis();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "client") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading" || netWorthLoading)
    return <div className="client-dashboard-vars p-6">Loading...</div>;

  if (netWorthError) {
    return <div className="client-dashboard-vars p-6 text-red-500">Error: {netWorthError}</div>;
  }

  return (
    <div className="client-dashboard-vars min-h-svh bg-slate-900">
      <ClientShell>
        <TopBar />
        <div className="mx-auto max-w-[1600px] px-6 py-8 space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  General Statistic
                </h1>
              </div>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg rounded-full px-6">
                Set Data Sections
              </Button>
            </div>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Net Worth */}
            <Card className="p-6 bg-white/10 dark:bg-slate-900/30 backdrop-blur-xl border-2 border-white/30 dark:border-slate-600/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 ring-1 ring-white/20">
              <div>
                <p className="text-sm text-slate-300 mb-1">Net Worth</p>
                <p className="text-3xl font-bold text-white mb-2">{formatINRSimple(netWorthData.netWorth)}</p>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 shadow-lg shadow-green-400/50"></div>
                  <span className="text-sm text-green-300">
                    {netWorthData.netWorth > 0 ? '+' : ''}
                    {((netWorthData.netWorth / (netWorthData.totalAssets || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </Card>

            {/* Total Investments */}
            <Card className="p-6 bg-white/10 dark:bg-slate-900/30 backdrop-blur-xl border-2 border-white/30 dark:border-slate-600/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 ring-1 ring-white/20" style={{ animationDelay: '100ms' }}>
              <div>
                <p className="text-sm text-slate-300 mb-1">Total Investments</p>
                <p className="text-3xl font-bold text-white mb-2">{formatINRSimple(netWorthData.totalInvestments)}</p>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 shadow-lg shadow-blue-400/50"></div>
                  <span className="text-sm text-blue-300">
                    {((netWorthData.totalInvestments / (netWorthData.totalAssets || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </Card>

            {/* Insurance */}
            <Card className="p-6 bg-white/10 dark:bg-slate-900/30 backdrop-blur-xl border-2 border-white/30 dark:border-slate-600/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 ring-1 ring-white/20" style={{ animationDelay: '200ms' }}>
              <div>
                <p className="text-sm text-slate-300 mb-1">Insurance Coverage</p>
                <p className="text-3xl font-bold text-white mb-2">{formatINRSimple(netWorthData.totalInsurance)}</p>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 shadow-lg shadow-yellow-400/50"></div>
                  <span className="text-sm text-yellow-300">
                    Health & Accident Coverage
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Financial Summary */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Net Worth, Investments, Cash Box */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up">
                  <div className="text-center">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-2">Monthly Income</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{formatINRSimple(netWorthData.monthlyIncome)}</p>
                    <Badge className="mt-2 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 dark:from-purple-900/30 dark:to-violet-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-700">
                      <ArrowUpIcon className="w-3 h-3 mr-1" />
                      +1.8%
                    </Badge>
                  </div>
                </Card>
                
                <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200/50 dark:border-orange-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '100ms' }}>
                  <div className="text-center">
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-2">Monthly Outcome</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">{formatINRSimple(netWorthData.monthlyExpenses)}</p>
                    <Badge className="mt-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 dark:from-orange-900/30 dark:to-amber-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-700">
                      <TrendingUpIcon className="w-3 h-3 mr-1" />
                      +10.2%
                    </Badge>
                  </div>
                </Card>
                
                <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 border-teal-200/50 dark:border-teal-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '200ms' }}>
                  <div className="text-center">
                    <p className="text-sm font-medium text-teal-700 dark:text-teal-400 mb-2">Cash & Deposits</p>
                    <p className="text-2xl font-bold text-teal-900 dark:text-teal-300">{formatINRSimple(netWorthData.monthlyIncome-netWorthData.monthlyExpenses)}</p>
                    <Badge className="mt-2 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 dark:from-teal-900/30 dark:to-cyan-900/30 dark:text-teal-300 border-teal-200 dark:border-teal-700">
                      <ArrowUpIcon className="w-3 h-3 mr-1" />
                      +2.1%
                    </Badge>
                  </div>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Net Worth Chart */}
                <Card className="p-6 bg-white/10 dark:bg-slate-900/30 backdrop-blur-xl border-white/20 dark:border-slate-700/30 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Net Worth Trend</h3>
                    <Badge variant="outline" className="bg-white/10 border-white/20 text-white">12M</Badge>
                  </div>
                  <NetWorthChart />
                </Card>

                {/* Spending Analytics */}
                <ExpensePieChart />
              </div>

              {/* Cash Flow Section */}
              <Card className="p-6 bg-white/10 dark:bg-slate-900/30 backdrop-blur-xl border-white/20 dark:border-slate-700/30 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Cash Flow Analysis</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">Monthly</Button>
                    <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">Half-Yearly</Button>
                    <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">Yearly</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up">
                    <div className="text-center">
                      <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">Cash Inflows</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-300">{formatINRSimple(netWorthData.monthlyIncome)}</p>
                      <Badge className="mt-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 border-green-200 dark:border-green-700">
                        <ArrowUpIcon className="w-3 h-3 mr-1" />
                        Monthly Income
                      </Badge>
                    </div>
                  </Card>
                  
                  <Card className="p-6 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-200/50 dark:border-red-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="text-center">
                      <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">Cash Outflows</p>
                      <p className="text-2xl font-bold text-red-900 dark:text-red-300">{formatINRSimple(netWorthData.monthlyExpenses)}</p>
                      <Badge className="mt-2 bg-gradient-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-300 border-red-200 dark:border-red-700">
                        <ArrowUpIcon className="w-3 h-3 mr-1" />
                        Monthly Expenses
                      </Badge>
                    </div>
                  </Card>
                  
                  <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="text-center">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">Net Cash Flow</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{formatINRSimple(netWorthData.netCashFlow)}</p>
                      <Badge className={`mt-2 bg-gradient-to-r ${netWorthData.netCashFlow > 0 ? 'from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700' : 'from-red-100 to-rose-100 text-red-700 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-300 border-red-200 dark:border-red-700'}`}>
                        {netWorthData.netCashFlow > 0 ? (
                          <ArrowUpIcon className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowUpIcon className="w-3 h-3 mr-1 rotate-180" />
                        )}
                        {netWorthData.netCashFlow > 0 ? 'Positive' : 'Negative'} Flow
                      </Badge>
                    </div>
                  </Card>
                </div>

                {/* Cash Flow Chart */}
                <div className="mb-6">
                  <CashFlowChart />
                </div>

                {/* Emergency Fund Section */}
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/50 animate-slide-up" style={{ animationDelay: '300ms' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <AlertTriangleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="font-medium text-amber-900 dark:text-amber-100">Emergency Fund</p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">7.4 months runway • $25,580</p>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                      Healthy
                    </Badge>
                  </div>
                  <div className="mt-3 bg-amber-100 dark:bg-amber-900/30 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" style={{ width: '74%' }}></div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Current Card & Transactions */}
            <div className="space-y-6">
              
              {/* Current Card */}
                          {/* VISA Card */}
            <Card className="relative p-8 bg-gradient-to-br from-yellow-600/90 to-yellow-800/90 backdrop-blur-xl border-2 border-yellow-400/30 shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-105 ring-1 ring-yellow-400/20 overflow-hidden group" style={{ backgroundColor: '#EFBF04' }}>
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-50"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-2 border-white/40 overflow-hidden shadow-lg">
                        <img 
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-base font-bold text-white tracking-wide">
                        {session?.user?.name?.toUpperCase() || session?.user?.username?.toUpperCase() || "AMANPREET SINGH"}
                      </p>
                      <p className="text-xs text-yellow-100 font-medium">GOLD MEMBER</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-white drop-shadow-lg tracking-wider">VISA</div>
                    <div className="text-xs text-yellow-100 font-bold tracking-widest">GOLD</div>
                  </div>
                </div>
                
                {/* Chip */}
                <div className="mb-8">
                  <div className="w-12 h-9 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md shadow-lg flex items-center justify-center">
                    <div className="w-8 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-sm"></div>
                  </div>
                </div>
                
                {/* Balance */}
                <div className="mb-6">
                  <p className="text-4xl font-black text-white drop-shadow-lg tracking-wide">
                    {formatINRSimple(netWorthData.netWorth)}
                  </p>
                  <p className="text-sm text-yellow-100 font-medium mt-1">Available Balance</p>
                </div>
                
                {/* Footer */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-yellow-100 font-mono font-bold">10/27</p>
                    <p className="text-xs text-yellow-200 font-medium">VALID THRU</p>
                  </div>
                  <div className="text-right">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 bg-gradient-to-br from-white to-yellow-100 rounded-full shadow-inner"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover Animation Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            </Card>

              {/* Transactions */}
              <Card className="p-6 bg-white/10 dark:bg-slate-900/30 backdrop-blur-xl border-white/20 dark:border-slate-700/30 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-white mb-4">Transactions</h3>
                <div className="space-y-4">
                  {[
                    { name: "Cameron Hawkins", type: "Today, 9:30PM", amount: "+$200", color: "text-green-600" },
                    { name: "Netflix Subscription", type: "Oct 17, 3:00PM", amount: "-$180", color: "text-red-600" },
                    { name: "Erica Rosales", type: "Oct 17, 10:30AM", amount: "-$100", color: "text-red-600" },
                    { name: "Aryan Armstrong", type: "Oct 12, 2:20PM", amount: "-$160", color: "text-red-600" }
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {transaction.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">{transaction.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{transaction.type}</p>
                        </div>
                      </div>
                      <p className={`font-semibold ${transaction.color}`}>{transaction.amount}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                    <CreditCardIcon className="w-4 h-4 mr-2" />
                    Pay Bills
                  </Button>
                  <Button variant="outline" className="h-12 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                    <TargetIcon className="w-4 h-4 mr-2" />
                    Set Goals
                  </Button>
                  <Button variant="outline" className="h-12 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800">
                    <PiggyBankIcon className="w-4 h-4 mr-2" />
                    Save Money
                  </Button>
                  <Button variant="outline" className="h-12 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800">
                    <DollarSignIcon className="w-4 h-4 mr-2" />
                    Invest
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </ClientShell>
    </div>
  );
}