import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { DashboardHistoryChart } from "@/components/dashboard/DashboardHistoryChart";
import { DashboardProjectionsChart } from "@/components/dashboard/DashboardProjectionsChart";

export default function Page() {
  return (
    <>
      <DashboardCards />
      <div className="grid gap-6 grid-cols-2 max-md:grid-cols-1">
        <div className="pl-4 lg:pl-6 max-lg:pr-4 mt-6">
          <DashboardProjectionsChart /> {/* 2. Renderize o gráfico aqui */}
        </div>
        <div className="pr-4 lg:pr-5 max-lg:pl-4 mt-6">
          <DashboardHistoryChart />
        </div>
      </div>
    </>
  );
}
