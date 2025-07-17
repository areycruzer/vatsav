import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Eye, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Incident } from "@/types";
import IncidentMap from "./IncidentMap";

export function IncidentManagement() {
  const queryClient = useQueryClient();

  const { data: incidents, isLoading, error } = useQuery<Incident[], Error>({
    queryKey: ['emergencies'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/api/emergencies');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  const deleteIncidentMutation = useMutation({
    mutationFn: async (incidentId) => {
      const response = await fetch(`http://localhost:3001/api/emergencies/${incidentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete incident');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencies'] });
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      deleteIncidentMutation.mutate(id);
    }
  };

  const handleView = (id) => console.log("View incident:", id);
  const handleEdit = (id) => console.log("Edit incident:", id);

  const mockSeverities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const getRandomSeverity = () => mockSeverities[Math.floor(Math.random() * mockSeverities.length)];

  const getSeverityBadgeClass = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL': return 'border-status-critical text-status-critical';
      case 'HIGH': return 'border-red-500 text-red-500'; // Using red for high as an example
      case 'MEDIUM': return 'border-status-warning text-status-warning';
      case 'LOW': return 'border-status-safe text-status-safe';
      default: return 'border-gray-500 text-gray-500';
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] min-h-0"> {/* 4rem for header if present */}
      {/* Sidebar/Table */}
      <div className="w-1/3 min-w-[350px] max-w-[500px] bg-bg-elevated border-r border-border overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">Incident Management</h1>
          <Button>
            <MapPin className="w-4 h-4 mr-2" />
            View on Map
          </Button>
        </div>
        {/* Incidents Table */}
        <div className="flex-1 overflow-y-auto">
          <Card className="bg-bg-elevated border-none shadow-none">
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
                    <th className="p-4 text-sm font-medium text-muted-foreground">Location</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Severity</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={7} className="p-4 text-center text-muted-foreground">Loading incidents...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={7} className="p-4 text-center text-destructive">Error loading incidents.</td></tr>
                  ) : (
                    incidents.map((incident) => {
                      const severity = incident.triage_status || getRandomSeverity();
                      return (
                        <tr key={incident.id} className="border-b border-border hover:bg-bg-panel">
                          <td className="p-4 text-sm text-foreground">{incident.id}</td>
                          <td className="p-4 text-sm text-foreground">{incident.type || 'N/A'}</td>
                          <td className="p-4 text-sm text-foreground">{new Date(incident.created_at).toLocaleTimeString()}</td>
                          <td className="p-4 text-sm text-foreground">{incident.location || 'N/A'}</td>
                          <td className="p-4">
                            <Badge 
                              variant="outline"
                              className={`text-xs ${getSeverityBadgeClass(severity)}`}
                            >
                              {severity}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-foreground">{incident.status || 'Active'}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleView(incident.id)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(incident.id)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(incident.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
      {/* Map */}
      <div className="flex-1 h-full min-h-0 flex flex-col">
        <div className="flex-1 h-full min-h-0">
          <IncidentMap incidents={incidents} />
        </div>
      </div>
    </div>
  );
}