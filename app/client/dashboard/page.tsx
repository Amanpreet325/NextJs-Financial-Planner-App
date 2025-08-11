"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ClientShell } from "@/components/client/layout/ClientSidebar";
import { TopBar } from "@/components/client/layout/TopBar";
import { KpiRow } from "@/components/client/kpis/KpiRow";
import { NetWorthSection } from "@/components/client/sections/NetWorthSection";
import {
  CashflowSection,
  SpendingSection,
  GoalsSection,
  PortfolioSection,
  DebtsSection,
  AlertsList,
  ActivityStrip,
} from "@/components/client/sections/Stubs";
import { useMockKpis } from "@/lib/client/mocks";

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "client") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading")
    return <div className="client-dashboard-vars p-6">Loading...</div>;

  const kpis = useMockKpis();

  return (
    <div className="client-dashboard-vars min-h-svh">
      <ClientShell>
        <TopBar />
        <div className="mx-auto max-w-[1600px] px-4 py-4 grid gap-4">
          <KpiRow kpis={kpis} />

          <NetWorthSection />

          <div id="cashflow" className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            <div className="xl:col-span-1 order-2 xl:order-none">
              <CashflowSection />
            </div>
          </div>

          <SpendingSection />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <GoalsSection />
            <PortfolioSection />
            <DebtsSection />
            <AlertsList />
          </div>

          <ActivityStrip />
        </div>
      </ClientShell>
    </div>
  );
}