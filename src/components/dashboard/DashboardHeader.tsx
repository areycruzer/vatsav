import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, User, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  return (
    <header className="h-16 border-b border-border bg-bg-elevated flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-accent-main" />
          <span className="text-foreground">San Francisco, CA</span>
          <div className="w-2 h-2 bg-status-active rounded-full animate-pulse" />
          <span className="text-status-active">12mi visible</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">12:23:45 AM UT</span>
          <span className="text-status-active font-semibold">LIVE</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">75°</span>
          <span className="text-xs text-muted-foreground">3mph</span>
          <span className="text-xs text-muted-foreground">1 in 2hrs</span>
          <span className="text-xs text-muted-foreground">2 humid</span>
        </div>
        
        <Button variant="ghost" size="sm">
          <Bell className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-main rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm">
            <div className="text-foreground">John Smith</div>
            <div className="text-xs text-muted-foreground">911 Operator</div>
          </div>
        </div>
      </div>
    </header>
  );
}