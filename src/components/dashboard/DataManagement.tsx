import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, BarChart3, Map, Users } from "lucide-react";

const metrics = [
  { label: "Total calls received", value: "146", status: "normal" },
  { label: "Resolution rate", value: "99.7%", status: "normal" },
  { label: "Total wait time", value: "31:21 min", status: "normal" },
  { label: "Average wait time", value: "5 sec", status: "excessive" }
];

const statusData = [
  { name: "Radio tower 2", location: "North", status: "active" },
  { name: "Radio tower 2", location: "North", status: "active" },
  { name: "Radio tower 2", location: "North", status: "active" }
];

const dispatchers = [
  { id: "001", role: "911", lastActive: "10:03:20 AM UT", status: "Active", contact: "+1 714123456", languages: "English, Spanish" },
  { id: "002", role: "911", lastActive: "10:18:20 AM UT", status: "Active", contact: "+1 714123456", languages: "English, Spanish" },
  { id: "003", role: "RCO", lastActive: "10:03:20 AM UT", status: "Busy", contact: "+1 714123456", languages: "English" },
  { id: "004", role: "Transit", lastActive: "10:08:12 AM UT", status: "Active", contact: "+1 714123456", languages: "English, Chinese" },
  { id: "005", role: "Transit", lastActive: "10:03:20 AM UT", status: "Busy", contact: "+1 714123456", languages: "English, Vietnamese" }
];

export function DataManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Data Management</h1>
          <p className="text-muted-foreground">RAW DATA</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="morning">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">MORNING</SelectItem>
              <SelectItem value="afternoon">AFTERNOON</SelectItem>
              <SelectItem value="evening">EVENING</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-4 bg-bg-elevated border-border">
            <div className="text-xs text-muted-foreground mb-1 uppercase">
              {metric.status === "normal" ? "NORMAL" : "EXCESSIVE"}
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-muted-foreground">{metric.label}</div>
          </Card>
        ))}
      </div>

      {/* Communication Status */}
      <Card className="p-6 bg-bg-elevated border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Communication status</h2>
          <Select defaultValue="morning">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">MORNING</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {statusData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent-main rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{item.name}</div>
                <div className="text-xs text-muted-foreground">Location: {item.location}</div>
              </div>
              <div className="ml-auto">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-status-active rounded-full" />
                  <span className="text-xs text-status-active font-semibold">ACTIVE</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Charts Placeholder */}
        <Card className="p-6 bg-bg-elevated border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Calls over time</h3>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="h-64 bg-bg-panel rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-accent-main mx-auto mb-2" />
              <p className="text-muted-foreground">Call volume analytics</p>
            </div>
          </div>
        </Card>

        {/* Map Overview */}
        <Card className="p-6 bg-bg-elevated border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Map overview</h3>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="h-64 bg-bg-panel rounded-lg flex items-center justify-center relative">
            <div className="text-center">
              <Map className="w-12 h-12 text-accent-main mx-auto mb-2" />
              <p className="text-muted-foreground">Geographic incident distribution</p>
            </div>
            <div className="absolute top-4 right-4 text-xs text-muted-foreground">
              Frequency: Low → High
            </div>
          </div>
        </Card>
      </div>

      {/* Dispatcher List */}
      <Card className="bg-bg-elevated border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Dispatcher list</h3>
            <Select defaultValue="morning">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">MORNING</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-left">
                <th className="p-4 text-sm font-medium text-muted-foreground">ID</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Role</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Last Active</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Contact</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Languages</th>
              </tr>
            </thead>
            <tbody>
              {dispatchers.map((dispatcher) => (
                <tr key={dispatcher.id} className="border-b border-border">
                  <td className="p-4 text-sm text-foreground">{dispatcher.id}</td>
                  <td className="p-4 text-sm text-foreground">{dispatcher.role}</td>
                  <td className="p-4 text-sm text-foreground">{dispatcher.lastActive}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      dispatcher.status === 'Active' 
                        ? 'bg-status-active/20 text-status-active' 
                        : 'bg-status-warning/20 text-status-warning'
                    }`}>
                      {dispatcher.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-foreground">{dispatcher.contact}</td>
                  <td className="p-4 text-sm text-foreground">{dispatcher.languages}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}