import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Clock, Eye, X, Phone } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const emergencies = [
  {
    id: "001",
    type: "House Fire",
    location: "Linking Road, Bandra",
    time: "10:31AM",
    status: "critical",
    description: "Critical house fire detected. Located 5 km away in Carter Road area."
  },
  {
    id: "002", 
    type: "Vehicle Theft",
    location: "SV Road, Goregaon",
    time: "10:31AM",
    status: "warning"
  },
  {
    id: "003",
    type: "Attempted Robbery",
    location: "Cafe Coffee Day, Andheri",
    time: "10:31AM", 
    status: "warning"
  },
  {
    id: "004",
    type: "Noise complaint",
    location: "Hill Road, Bandra",
    time: "10:31AM",
    status: "safe"
  },
  {
    id: "005",
    type: "Illegal parking",
    location: "Marine Drive",
    time: "10:31AM",
    status: "safe"
  },
  {
    id: "006",
    type: "Loud party",
    location: "Juhu Beach Road",
    time: "10:31AM",
    status: "safe"
  }
];

const metrics = [
  { label: "Total Calls", value: "123", color: "text-foreground" },
  { label: "Critical Calls", value: "34", color: "text-status-critical" },
  { label: "Resolved", value: "12", color: "text-status-safe" }
];

export function LiveDispatch() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Emergency Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-status-active rounded-full animate-pulse" />
          <span className="text-sm text-status-active font-semibold">LIVE</span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-4 bg-bg-elevated border-border">
            <div className="text-2xl font-bold mb-1" style={{ color: metric.color }}>
              {metric.value}
            </div>
            <div className="text-sm text-muted-foreground">{metric.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Emergency List */}
        <div className="col-span-4">
          <Card className="bg-bg-elevated border-border">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Emergencies</h2>
              <p className="text-sm text-muted-foreground">Alerts</p>
            </div>
            <div className="p-4 space-y-3">
              {emergencies.map((emergency) => (
                <div key={emergency.id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle 
                        className={`w-4 h-4 ${
                          emergency.status === 'critical' ? 'text-status-critical' :
                          emergency.status === 'warning' ? 'text-status-warning' :
                          'text-status-safe'
                        }`} 
                      />
                      <span className="text-sm font-medium text-foreground">
                        {emergency.type}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          emergency.status === 'critical' ? 'border-status-critical text-status-critical' :
                          emergency.status === 'warning' ? 'border-status-warning text-status-warning' :
                          'border-status-safe text-status-safe'
                        }`}
                      >
                        {emergency.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {emergency.location} • {emergency.time}
                  </div>
                  {emergency.description && (
                    <div className="text-xs text-muted-foreground">
                      {emergency.description}
                    </div>
                  )}
                  {emergency.id === "001" && (
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="destructive">
                        Dismiss
                      </Button>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Map */}
        <div className="col-span-8">
          <Card className="h-[600px] bg-bg-elevated border-border relative overflow-hidden">
            <MapContainer center={[19.0760, 72.8777]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[19.0760, 72.8777]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </Card>
        </div>
      </div>

      {/* Initiate Call Section */}
      <div className="mt-6">
        <Card className="bg-bg-elevated border-border">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-accent-main" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Initiate Emergency Call</h2>
                <p className="text-sm text-muted-foreground">AI-powered emergency communication system</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="w-full h-[500px] rounded-lg overflow-hidden border border-border">
              <iframe 
                src="https://hume-tan.vercel.app/"
                className="w-full h-full"
                title="Emergency Call Interface"
                frameBorder="0"
                allow="microphone"
                allowFullScreen
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}