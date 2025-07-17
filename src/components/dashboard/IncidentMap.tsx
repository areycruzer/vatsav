import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import { Incident } from '@/types';

// This is a common workaround for react-leaflet's icon issue with bundlers like Vite/Webpack
if (L.Icon.Default.prototype instanceof L.Icon) {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
}

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface IncidentMapProps {
  incidents: Incident[] | undefined;
}

const IncidentMap = ({ incidents }: IncidentMapProps) => {
  // Default center for the map, in case no incidents have coordinates
  const defaultPosition: LatLngExpression = [20.5937, 78.9629]; // Center of India

  const validIncidents = incidents?.filter(inc => inc.latitude != null && inc.longitude != null) || [];

  const mapCenter: LatLngExpression = validIncidents.length > 0 && validIncidents[0].latitude && validIncidents[0].longitude
    ? [validIncidents[0].latitude, validIncidents[0].longitude]
    : defaultPosition;

  return (
    <MapContainer center={mapCenter} zoom={validIncidents.length > 0 ? 13 : 5} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {validIncidents.map(incident => (
        <Marker 
          key={incident.id} 
          position={[incident.latitude!, incident.longitude!]}
        >
          {incident.triage_status === 'CRITICAL' ? (
            <Tooltip permanent direction="top">
              <span style={{ color: 'red', fontWeight: 'bold' }}>URGENT ASSISTANCE NEEDED</span><br />
              {incident.type || 'Incident'}
            </Tooltip>
          ) : (
            <Tooltip permanent direction="top">
              {incident.type || 'Incident'}
            </Tooltip>
          )}
          <Popup>
            <b>{incident.type || 'Incident'}</b><br />
            Location: {incident.location || 'N/A'}<br />
            Status: {incident.status || 'Active'}<br />
            Severity: {incident.triage_status || 'Unknown'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default IncidentMap;
