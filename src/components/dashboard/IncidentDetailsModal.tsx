import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Incident } from "@/types";
import { useState, useEffect } from 'react';

interface IncidentDetailsModalProps {
  incident: Incident | null;
  mode: 'view' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedIncident: Incident) => void;
}

export function IncidentDetailsModal({ incident, mode, isOpen, onClose, onSave }: IncidentDetailsModalProps) {
  const [editableIncident, setEditableIncident] = useState<Incident | null>(incident);

  useEffect(() => {
    setEditableIncident(incident);
  }, [incident]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editableIncident) return;
    const { id, value } = e.target;
    setEditableIncident({ ...editableIncident, [id]: value });
  };

  const handleSave = () => {
    if (editableIncident) {
      onSave(editableIncident);
    }
  };

  if (!isOpen || !incident) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-bg-elevated border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{mode === 'edit' ? 'Edit Incident' : 'Incident Details'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">ID</Label>
            <Input id="id" value={incident.id} readOnly className="col-span-3 bg-bg-panel" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Input id="type" value={editableIncident?.type || ''} onChange={handleInputChange} readOnly={mode === 'view'} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">Location</Label>
            <Input id="location" value={editableIncident?.location || ''} onChange={handleInputChange} readOnly={mode === 'view'} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Input id="status" value={editableIncident?.status || ''} onChange={handleInputChange} readOnly={mode === 'view'} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" value={editableIncident?.description || ''} onChange={handleInputChange} readOnly={mode === 'view'} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Close</Button>
          </DialogClose>
          {mode === 'edit' && (
            <Button type="button" onClick={handleSave}>Save Changes</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
