export interface Incident {
  id: string;
  type: string;
  location: string;
  time: string;
  status: 'critical' | 'warning' | 'safe';
  description?: string;
  created_at?: string;
  latitude?: number;
  longitude?: number;
  triage_status?: string;
}
