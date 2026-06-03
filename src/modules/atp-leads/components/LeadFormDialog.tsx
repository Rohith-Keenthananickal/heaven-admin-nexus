import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/modules/shared/components/ui/dialog";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Textarea } from "@/modules/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/shared/components/ui/select";
import { Loader2 } from "lucide-react";
import { CrmLead, CreateLeadPayload, UpdateLeadPayload, LeadRegistrationStatus } from "../models/atpLeads.models";
import { atpLeadsService } from "../services/atpLeadsService";
import { toast } from "@/modules/shared/hooks/use-toast";

interface LeadFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: CrmLead | null;
  onSuccess: () => void;
}

export function LeadFormDialog({ isOpen, onClose, lead, onSuccess }: LeadFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    lead_id: string;
    registration_status: LeadRegistrationStatus;
    notes: string;
  }>({
    name: "",
    email: "",
    phone: "",
    lead_id: "",
    registration_status: "PENDING",
    notes: "",
  });

  const isEditMode = !!lead;

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        lead_id: lead.lead_id || "",
        registration_status: lead.registration_status || "PENDING",
        notes: lead.notes || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        lead_id: "",
        registration_status: "PENDING",
        notes: "",
      });
    }
  }, [lead, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Name, email, and phone are required fields.",
      });
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && lead) {
        const updatePayload: UpdateLeadPayload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          registration_status: formData.registration_status,
          notes: formData.notes || undefined,
        };
        await atpLeadsService.updateLead(lead.id, updatePayload);
        toast({
          title: "Success",
          description: "Lead updated successfully.",
        });
      } else {
        const createPayload: CreateLeadPayload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          lead_id: formData.lead_id || undefined,
          registration_status: formData.registration_status,
          notes: formData.notes || undefined,
        };
        await atpLeadsService.createLead(createPayload);
        toast({
          title: "Success",
          description: "Lead created successfully.",
        });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving lead:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Lead" : "Add New Lead"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter lead name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+919876543210"
              required
            />
          </div>

          {!isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="lead_id">Lead ID (Optional)</Label>
              <Input
                id="lead_id"
                value={formData.lead_id}
                onChange={(e) => setFormData({ ...formData, lead_id: e.target.value })}
                placeholder="Auto-generated if not provided"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="registration_status">Registration Status</Label>
            <Select
              value={formData.registration_status}
              onValueChange={(value: LeadRegistrationStatus) =>
                setFormData({ ...formData, registration_status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REGISTERED">Registered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this lead..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditMode ? "Update Lead" : "Create Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
