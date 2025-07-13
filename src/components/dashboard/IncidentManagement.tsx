import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Eye, Edit, Trash2 } from "lucide-react";

const incidents = [
  {
    id: "001",
    type: "Fire",
    time: "10:03:20 AM UT",
    duration: "2:12 min",
    waitTime: "20 sec",
    severity: "SAFE",
    status: "Active",
    location: "Lincoln Ave"
  },
  {
    id: "002", 
    type: "Flood",
    time: "10:18:20 AM UT",
    duration: "1:25 min",
    waitTime: "19 sec",
    severity: "CRITICAL",
    status: "Resolved",
    location: "Main St"
  },
  {
    id: "003",
    type: "Fire", 
    time: "10:03:20 AM UT",
    duration: "2:12 min",
    waitTime: "20 sec",
    severity: "MILD",
    status: "Active",
    location: "Oak Dr"
  },
  {
    id: "004",
    type: "Medical",
    time: "10:08:12 AM UT", 
    duration: "4:45 min",
    waitTime: "17 sec",
    severity: "SAFE",
    status: "Resolved",
    location: "Pine St"
  },
  {
    id: "005",
    type: "Fire",
    time: "10:03:20 AM UT",
    duration: "2:12 min", 
    waitTime: "20 sec",
    severity: "CRITICAL",
    status: "Active",
    location: "Elm Ave"
  },
  {
    id: "006",
    type: "Robbery",
    time: "10:15:55 AM UT",
    duration: "2:58 min",
    waitTime: "28 sec", 
    severity: "SAFE",
    status: "Resolved",
    location: "1st St"
  },
  {
    id: "007",
    type: "Fire",
    time: "10:03:20 AM UT",
    duration: "2:12 min",
    waitTime: "20 sec",
    severity: "CRITICAL", 
    status: "Active",
    location: "2nd Ave"
  }
];

export function IncidentManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Incident Management</h1>
        <Button>
          <MapPin className="w-4 h-4 mr-2" />
          View on Map
        </Button>
      </div>

      {/* Map Placeholder */}
      <Card className="h-80 bg-bg-elevated border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-panel to-bg-overlay">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-accent-main mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Incident Map View</h3>
              <p className="text-muted-foreground">Real-time incident locations and status</p>
            </div>
          </div>
          
          {/* Simulated incident markers */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-status-critical rounded-full animate-pulse shadow-lg" />
          <div className="absolute top-3/4 right-1/3 w-4 h-4 bg-status-warning rounded-full animate-pulse shadow-lg" />
          <div className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-status-safe rounded-full shadow-lg" />
          <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-status-critical rounded-full animate-pulse shadow-lg" />
        </div>
      </Card>

      {/* Incidents Table */}
      <Card className="bg-bg-elevated border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Incident list</h2>
              <p className="text-sm text-muted-foreground">Active emergency responses</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Filter</Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-left">
                <th className="p-4 text-sm font-medium text-muted-foreground">ID</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Time</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Duration</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Wait time</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Severity</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id} className="border-b border-border hover:bg-bg-panel">
                  <td className="p-4 text-sm text-foreground">{incident.id}</td>
                  <td className="p-4 text-sm text-foreground">{incident.type}</td>
                  <td className="p-4 text-sm text-foreground">{incident.time}</td>
                  <td className="p-4 text-sm text-foreground">{incident.duration}</td>
                  <td className="p-4 text-sm text-foreground">{incident.waitTime}</td>
                  <td className="p-4">
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        incident.severity === 'CRITICAL' ? 'border-status-critical text-status-critical' :
                        incident.severity === 'MILD' ? 'border-status-warning text-status-warning' :
                        'border-status-safe text-status-safe'
                      }`}
                    >
                      {incident.severity}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-foreground">{incident.status}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}