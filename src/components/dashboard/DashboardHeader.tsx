import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, User, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onProfileClick?: () => void;
}

export function DashboardHeader({ onProfileClick }: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-bg-elevated flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-accent-main" />
          <span className="text-foreground">Mumbai, Maharashtra</span>
          <div className="w-2 h-2 bg-status-active rounded-full animate-pulse" />
          <span className="text-status-active">20km visible</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">12:23:45 PM IST</span>
          <span className="text-status-active font-semibold">LIVE</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">32°C</span>
          <span className="text-xs text-muted-foreground">15kmh</span>
          <span className="text-xs text-muted-foreground">Monsoon</span>
          <span className="text-xs text-muted-foreground">85% humid</span>
        </div>
        
        <Button variant="ghost" size="sm">
          <Bell className="w-4 h-4" />
        </Button>
        
        <button
          type="button"
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-main rounded"
          onClick={onProfileClick}
        >
          <div className="w-8 h-8 bg-accent-main rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm text-left">
            <div className="text-foreground">Vatsav Sharma</div>
            <div className="text-xs text-muted-foreground">Emergency Operator</div>
          </div>
        </button>
      </div>
    </header>
  );
}