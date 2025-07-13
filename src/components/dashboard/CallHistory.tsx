import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Filter, Eye, Edit, Trash2 } from "lucide-react";

const callHistory = [
  {
    id: "001",
    type: "Fire",
    time: "10:03:20 AM IST", 
    duration: "2:12 min",
    waitTime: "20 sec",
    severity: "SAFE",
    status: "Active"
  },
  {
    id: "002",
    type: "Flood", 
    time: "10:18:20 AM IST",
    duration: "1:25 min",
    waitTime: "19 sec",
    severity: "CRITICAL",
    status: "Resolved"
  },
  {
    id: "003",
    type: "Fire",
    time: "10:03:20 AM IST",
    duration: "2:12 min", 
    waitTime: "20 sec",
    severity: "MILD",
    status: "Active"
  },
  {
    id: "004",
    type: "Medical",
    time: "10:08:12 AM IST",
    duration: "4:45 min",
    waitTime: "17 sec",
    severity: "SAFE", 
    status: "Resolved"
  },
  {
    id: "005",
    type: "Fire",
    time: "10:03:20 AM IST",
    duration: "2:12 min",
    waitTime: "20 sec",
    severity: "CRITICAL",
    status: "Active"
  },
  {
    id: "006", 
    type: "Robbery",
    time: "10:15:55 AM IST",
    duration: "2:58 min",
    waitTime: "28 sec",
    severity: "SAFE",
    status: "Resolved"
  },
  {
    id: "007",
    type: "Fire",
    time: "10:03:20 AM IST", 
    duration: "2:12 min",
    waitTime: "20 sec",
    severity: "CRITICAL",
    status: "Active"
  }
];

export function CallHistory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Call History</h1>
          <p className="text-muted-foreground">Complete record of emergency calls and responses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-bg-elevated">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="psap">PSAP</TabsTrigger>
          <TabsTrigger value="rto">RTO</TabsTrigger>
          <TabsTrigger value="transit">Transit</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card className="bg-bg-elevated border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Call history</h2>
                  <p className="text-sm text-muted-foreground">Complete log of all emergency calls</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">+ Add</Button>
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
                  {callHistory.map((call) => (
                    <tr key={call.id} className="border-b border-border hover:bg-bg-panel">
                      <td className="p-4 text-sm text-foreground">{call.id}</td>
                      <td className="p-4 text-sm text-foreground">{call.type}</td>
                      <td className="p-4 text-sm text-foreground">{call.time}</td>
                      <td className="p-4 text-sm text-foreground">{call.duration}</td>
                      <td className="p-4 text-sm text-foreground">{call.waitTime}</td>
                      <td className="p-4">
                        <Badge 
                          variant="outline"
                          className={`text-xs ${
                            call.severity === 'CRITICAL' ? 'border-status-critical text-status-critical' :
                            call.severity === 'MILD' ? 'border-status-warning text-status-warning' :
                            'border-status-safe text-status-safe'
                          }`}
                        >
                          {call.severity}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-foreground">{call.status}</td>
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
        </TabsContent>
        
        <TabsContent value="psap" className="space-y-4">
          <Card className="p-6 bg-bg-elevated border-border">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">PSAP Call Records</h3>
              <p className="text-muted-foreground">Public Safety Answering Point call logs</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="rto" className="space-y-4">
          <Card className="p-6 bg-bg-elevated border-border">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">RTO Call Records</h3>
              <p className="text-muted-foreground">Radio Telephone Operator call logs</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="transit" className="space-y-4">
          <Card className="p-6 bg-bg-elevated border-border">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Transit Call Records</h3>
              <p className="text-muted-foreground">Transit authority call logs</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}