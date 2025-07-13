import { Activity, Database, AlertTriangle, History, Settings as SettingsIcon, Truck, Radio, MapPin } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type DashboardView = "live" | "data" | "incidents" | "history" | "settings";

interface DashboardSidebarProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

const navigationItems = [
  {
    title: "Live Dispatch",
    icon: Activity,
    view: "live" as DashboardView,
  },
  {
    title: "Data Management",
    icon: Database,
    view: "data" as DashboardView,
  },
  {
    title: "Incident Management",
    icon: AlertTriangle,
    view: "incidents" as DashboardView,
  },
  {
    title: "Call History",
    icon: History,
    view: "history" as DashboardView,
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    view: "settings" as DashboardView,
  },
];

export function DashboardSidebar({ currentView, onViewChange }: DashboardSidebarProps) {
  return (
    <Sidebar className="border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-main rounded-lg flex items-center justify-center">
            <Radio className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Vatsav Emergency Dashboard</h2>
            <p className="text-xs text-muted-foreground">LIVE</p>
          </div>
        </div>
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.view}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.view)}
                    className={`w-full justify-start ${
                      currentView === item.view 
                        ? "bg-accent-main text-white" 
                        : "hover:bg-sidebar-accent"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}