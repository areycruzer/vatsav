import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, Eye, X, Phone } from "lucide-react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { CallHistory } from './CallHistory';
import IncidentMap from './IncidentMap';
import { Incident } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

const metrics = [
  { label: "Total Calls", value: "123", color: "text-foreground" },
  { label: "Critical Calls", value: "34", color: "text-status-critical" },
  { label: "Resolved", value: "12", color: "text-status-safe" }
];

export function LiveDispatch() {
  const [emergencies, setEmergencies] = useState<Incident[]>([]);
  const [selectedEmergency, setSelectedEmergency] = useState<Incident | null>(null);
  const [transcript, setTranscript] = useState<any[]>([]);
  const [emotions, setEmotions] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'http://localhost:3003') {
        // In production, you should uncomment the return statement below
        // to ensure messages are only accepted from a trusted origin.
        // return;
      }

      const data = event.data;

      // Check for valid message types from the Hume iframe
      if (data.type === 'user_message' || data.type === 'assistant_message') {
        // The component expects a nested `message` object.
        // We create this structure from the flat data sent by the iframe.
        const formattedMessage = {
          message: {
            role: data.role,
            content: data.content,
          },
        };
        setTranscript(prev => [...prev, formattedMessage]);
      } else if (data.type === 'assistant_end' && data.models?.prosody) {
        // Capture the final emotion summary when the call ends
        setEmotions(data.models.prosody.scores);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    // Fetch initial data
    fetch('http://localhost:3001/api/emergencies')
      .then(response => response.json())
      .then(data => setEmergencies(data))
      .catch(error => console.error('Error fetching emergencies:', error));

    // Establish WebSocket connection
    const ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'CREATE':
          setEmergencies(prev => [message.payload, ...prev]);
          break;
        case 'UPDATE':
          setEmergencies(prev => prev.map(e => e.id === message.payload.id ? message.payload : e));
          break;
        case 'DELETE':
          setEmergencies(prev => prev.filter(e => e.id !== message.payload.id));
          break;
        default:
          break;
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, []);

  const handleDismiss = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/api/emergencies/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error dismissing emergency:', error);
    }
  };

  const handleAnalyzeCall = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:3001/api/calls/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript, emotions }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze call');
      }

      const analysisResult = await response.json();
      console.log('Analysis complete:', analysisResult);
      queryClient.invalidateQueries({ queryKey: ['callLogs'] });
      setTranscript([]);
      setEmotions(null);

    } catch (error) {
      console.error('Error analyzing call:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <div role="alert" className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Something went wrong:</p>
          <pre className="text-sm">{error.message}</pre>
          <button onClick={() => window.location.reload()} className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Reload Page</button>
        </div>
      )}
    >
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
              <div className="p-4 space-y-3 h-[548px] overflow-y-auto">
                {emergencies.map((emergency) => (
                  <div key={emergency.id} className="space-y-2 p-2 rounded-lg hover:bg-background">
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
                      {emergency.location}
                      {emergency.created_at && (
                        <> • {new Date(emergency.created_at).toLocaleTimeString()}</>
                      )}
                    </div>
                    {(emergency as any).description && (
                      <div className="text-xs text-muted-foreground">
                        {(emergency as any).description}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="destructive" onClick={() => handleDismiss(String(emergency.id))}>
                        Dismiss
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setSelectedEmergency(emergency)}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Map */}
          <div className="col-span-8">
            <Card className="h-[600px] bg-bg-elevated border-border relative overflow-hidden">
              <IncidentMap incidents={emergencies} />
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
              <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border">
                <iframe
                  src="http://localhost:3000"
                  className="w-full h-full"
                  title="Emergency Call Interface"
                  frameBorder="0"
                  allow="microphone"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleAnalyzeCall} disabled={isAnalyzing || transcript.length === 0}>
                  {isAnalyzing ? 'Analyzing...' : 'End Call & Analyze'}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 border border-border rounded-lg h-[200px] overflow-y-auto">
                  <CardTitle className="text-lg mb-2">Live Transcript</CardTitle>
                  <div>
                    {transcript.map((msg, index) => {

                      if (!msg || !msg.message) {
                        console.warn('Skipping malformed transcript message:', msg);
                        return null;
                      }

                      return (
                        <div key={index} className={msg.message.role === 'user' ? 'text-right' : 'text-left'}>
                          <span className={`px-2 py-1 rounded-lg ${msg.message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            <strong>{msg.message.role === 'user' ? 'User' : 'Assistant'}:</strong>
                            <span className="ml-2">{msg.message.content}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-4 border border-border rounded-lg h-[200px] overflow-y-auto">
                  <CardTitle className="text-lg mb-2">Vocal Emotions</CardTitle>
                  {emotions ? (
                    <div>
                      {Object.entries(emotions).sort(([, a], [, b]) => (b as number) - (a as number)).slice(0, 5).map(([emotion, score]) => (
                        <div key={emotion} className="flex justify-between items-center mb-1">
                          <span className="capitalize">{emotion.replace(/_/g, ' ')}</span>
                          <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(score as number) * 100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No emotion data yet.</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Call History Table */}
        <div className="mt-6">
          <CallHistory />
        </div>

        {selectedEmergency && (
          <Dialog open={!!selectedEmergency} onOpenChange={() => setSelectedEmergency(null)}>
            <DialogContent className="bg-bg-elevated border-border text-foreground z-[9999]">
              <DialogHeader>
                <DialogTitle className="text-foreground">{selectedEmergency.type}</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {selectedEmergency.location}
                  {selectedEmergency.created_at && (
                    <> • {new Date(selectedEmergency.created_at).toLocaleTimeString()}</>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-4">
                <p><strong className="font-semibold">Status:</strong> <span className={`font-medium ${selectedEmergency.status === 'critical' ? 'text-status-critical' : selectedEmergency.status === 'warning' ? 'text-status-warning' : 'text-status-safe'}`}>{selectedEmergency.status}</span></p>
                {(selectedEmergency as any).description && <p><strong className="font-semibold">Description:</strong> {(selectedEmergency as any).description}</p>}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </ErrorBoundary>
  );
}