import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from 'lucide-react';

// Type definition for a call log entry
interface CallLog {
  id: string;
  created_at: string;
  transcript: { message: { role: string; content: string } }[];
  emotions: any;
  triage_status: string;
  summary: string;
  recommended_action: string;
  approved: boolean;
}

export function CallHistory() {
  const fetchCallLogs = async (): Promise<CallLog[]> => {
    const response = await fetch('http://localhost:3001/api/calls');
    if (!response.ok) {
      throw new Error('Failed to fetch call logs');
    }
    const data = await response.json();
    const priorityOrder: { [key: string]: number } = {
      'Critical': 1,
      'Urgent': 2,
      'High': 3,
      'Medium': 4,
      'Low': 5,
    };

    return data.sort((a: CallLog, b: CallLog) => {
      const priorityA = priorityOrder[a.triage_status] || 99;
      const priorityB = priorityOrder[b.triage_status] || 99;
      return priorityA - priorityB;
    });
  };

  const { data: callLogs = [], isLoading, error } = useQuery<CallLog[], Error>({ 
    queryKey: ['callLogs'], 
    queryFn: fetchCallLogs 
  });

  const getBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'urgent': return 'secondary';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      default: return 'default';
    }
  };

  if (isLoading) {
    return <div>Loading call history...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Triage Status</TableHead>
              <TableHead>Approval Status</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Recommended Action</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {callLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(log.triage_status)}>{log.triage_status || 'N/A'}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={log.approved ? 'default' : 'destructive'}>
                    {log.approved ? 'Approved' : 'Not Approved'}
                  </Badge>
                </TableCell>
                <TableCell>{log.summary}</TableCell>
                <TableCell>{log.recommended_action}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Call Details: {new Date(log.created_at).toLocaleString()}</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 mt-4 max-h-[60vh] overflow-y-auto">
                        <div>
                          <h3 className="font-bold mb-2">Transcript</h3>
                          <div className="p-2 border rounded-md bg-muted">
                            {Array.isArray(log.transcript) && log.transcript.map((item, index) => {
                              // Defensive check for malformed transcript items
                              if (!item || !item.message) {
                                console.warn('Skipping malformed transcript item in CallHistory:', item);
                                return null; // Safely skip this item
                              }
                              return (
                                <p key={index} className={`text-sm ${item.message.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                                  <strong>{item.message.role}:</strong> {item.message.content}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold mb-2">Vocal Emotions</h3>
                          <pre className="p-2 border rounded-md bg-muted text-xs whitespace-pre-wrap">
                            {JSON.stringify(log.emotions, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}