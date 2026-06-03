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
import {
  CrmLeadFollowUp,
  CreateFollowUpPayload,
  UpdateFollowUpPayload,
  FollowUpChannel,
  FollowUpStatus,
} from "../models/atpLeads.models";
import { atpLeadsService } from "../services/atpLeadsService";
import { toast } from "@/modules/shared/hooks/use-toast";

interface FollowUpFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: number;
  followUp?: CrmLeadFollowUp | null;
  existingFollowUps?: CrmLeadFollowUp[];
  onSuccess: () => void;
}

export function FollowUpFormDialog({
  isOpen,
  onClose,
  leadId,
  followUp,
  existingFollowUps = [],
  onSuccess,
}: FollowUpFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    step_order: number;
    channel: FollowUpChannel;
    scheduled_at: string;
    status: FollowUpStatus;
    notes: string;
  }>({
    step_order: 1,
    channel: "EMAIL",
    scheduled_at: "",
    status: "PENDING",
    notes: "",
  });

  const isEditMode = !!followUp;

  useEffect(() => {
    if (followUp) {
      setFormData({
        step_order: followUp.step_order,
        channel: followUp.channel,
        scheduled_at: followUp.scheduled_at ? followUp.scheduled_at.slice(0, 16) : "",
        status: followUp.status,
        notes: followUp.notes || "",
      });
    } else {
      const nextStepOrder =
        existingFollowUps.length > 0
          ? Math.max(...existingFollowUps.map((f) => f.step_order)) + 1
          : 1;
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      
      setFormData({
        step_order: nextStepOrder,
        channel: "EMAIL",
        scheduled_at: tomorrow.toISOString().slice(0, 16),
        status: "PENDING",
        notes: "",
      });
    }
  }, [followUp, existingFollowUps, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.scheduled_at) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Scheduled date and time is required.",
      });
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && followUp) {
        const updatePayload: UpdateFollowUpPayload = {
          step_order: formData.step_order,
          channel: formData.channel,
          scheduled_at: new Date(formData.scheduled_at).toISOString(),
          status: formData.status,
          notes: formData.notes || undefined,
        };
        await atpLeadsService.updateFollowUp(leadId, followUp.id, updatePayload);
        toast({
          title: "Success",
          description: "Follow-up updated successfully.",
        });
      } else {
        const createPayload: CreateFollowUpPayload = {
          step_order: formData.step_order,
          channel: formData.channel,
          scheduled_at: new Date(formData.scheduled_at).toISOString(),
          status: formData.status,
          notes: formData.notes || undefined,
        };
        await atpLeadsService.createFollowUp(leadId, createPayload);
        toast({
          title: "Success",
          description: "Follow-up created successfully.",
        });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving follow-up:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Follow-Up" : "Schedule New Follow-Up"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="step_order">Step Order</Label>
              <Input
                id="step_order"
                type="number"
                min={1}
                value={formData.step_order}
                onChange={(e) =>
                  setFormData({ ...formData, step_order: parseInt(e.target.value) || 1 })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel">Channel *</Label>
              <Select
                value={formData.channel}
                onValueChange={(value: FollowUpChannel) =>
                  setFormData({ ...formData, channel: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduled_at">Scheduled Date & Time *</Label>
            <Input
              id="scheduled_at"
              type="datetime-local"
              value={formData.scheduled_at}
              onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: FollowUpStatus) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="SKIPPED">Skipped</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add notes about this follow-up..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditMode ? "Update Follow-Up" : "Schedule Follow-Up"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
