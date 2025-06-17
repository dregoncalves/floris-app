import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { DashboardHistoryChart } from "@/components/dashboard/DashboardHistoryChart";
import { DashboardProjectionsChart } from "@/components/dashboard/DashboardProjectionsChart";

export default function Page() {
  return (
    <>
      <DashboardCards />
      <div className="grid grid-cols-2">
        <div className="px-4 lg:px-6 mt-6">
          <DashboardProjectionsChart /> {/* 2. Renderize o gráfico aqui */}
        </div>
        <div className="px-4 lg:px-6 mt-6">
          <DashboardHistoryChart />
        </div>
      </div>
    </>
  );
}
