export interface Incident {
  id: number;
  type: string;
  location: string;
  status: string;
  triage_status: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | null;
  created_at: string;
  latitude?: number;
  longitude?: number;
}
