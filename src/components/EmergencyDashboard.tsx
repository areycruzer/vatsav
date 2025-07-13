import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard/DashboardSidebar";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { LiveDispatch } from "./dashboard/LiveDispatch";
import { DataManagement } from "./dashboard/DataManagement";
import { IncidentManagement } from "./dashboard/IncidentManagement";
import { CallHistory } from "./dashboard/CallHistory";
import { Settings } from "./dashboard/Settings";

type DashboardView = "live" | "data" | "incidents" | "history" | "settings";

export function EmergencyDashboard() {
  const [currentView, setCurrentView] = useState<DashboardView>("live");

  const renderCurrentView = () => {
    switch (currentView) {
      case "live":
        return <LiveDispatch />;
      case "data":
        return <DataManagement />;
      case "incidents":
        return <IncidentManagement />;
      case "history":
        return <CallHistory />;
      case "settings":
        return <Settings />;
      default:
        return <LiveDispatch />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar currentView={currentView} onViewChange={setCurrentView} />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}