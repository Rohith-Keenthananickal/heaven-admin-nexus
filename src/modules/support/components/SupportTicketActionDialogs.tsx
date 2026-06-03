import { useEffect, useState } from "react";
import { Button } from "@/modules/shared/components/ui/button";
import { Label } from "@/modules/shared/components/ui/label";
import { Textarea } from "@/modules/shared/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/shared/components/ui/select";
import {
  EscalationLevel,
  IssueStatus,
  Priority,
  escalationLevelOptions,
  issueStatusOptions,
  priorityOptions,
} from "../models/support.models";
import { authService } from "@/modules/auth/services/authService";
import AtpService from "@/modules/atp/services/atp.service";
import { User } from "@/modules/auth/models/auth.models";
import { GetAllAreaCoordinatorsPayload } from "@/modules/atp/models/atp.models";
import { isApiSuccess, supportService } from "../services/Support.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export type TicketActionType = "status" | "priority" | "assign" | "escalate" | null;

interface SupportTicketActionDialogsProps {
  issueId: number;
  action: TicketActionType;
  currentStatus: IssueStatus;
  currentPriority: Priority;
  currentAssigneeId?: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function SupportTicketActionDialogs({
  issueId,
  action,
  currentStatus,
  currentPriority,
  currentAssigneeId,
  onClose,
  onSuccess,
}: SupportTicketActionDialogsProps) {
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [issueStatus, setIssueStatus] = useState<IssueStatus>(currentStatus);
  const [statusNote, setStatusNote] = useState("");
  const [priority, setPriority] = useState<Priority>(currentPriority);
  const [assignedToId, setAssignedToId] = useState<string>(
    currentAssigneeId ? String(currentAssigneeId) : "unassigned"
  );
  const [escalationLevel, setEscalationLevel] = useState<EscalationLevel>("LEVEL_1");
  const [escalatedToId, setEscalatedToId] = useState("");
  const [escalationReason, setEscalationReason] = useState("");

  useEffect(() => {
    if (!action || (action !== "assign" && action !== "escalate")) return;

    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await AtpService.getAllAreaCoordinators({
          user_type: ["ADMIN", "AREA_COORDINATOR", "HOST"] as unknown as GetAllAreaCoordinatorsPayload["user_type"],
          limit: 100,
        });
        if (isApiSuccess(response.status) && Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setUsers([]);
        }
      } catch {
        toast.error("Failed to load users");
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [action]);

  useEffect(() => {
    if (action === "status") setIssueStatus(currentStatus);
    if (action === "priority") setPriority(currentPriority);
    if (action === "assign") {
      setAssignedToId(currentAssigneeId ? String(currentAssigneeId) : "unassigned");
    }
  }, [action, currentStatus, currentPriority, currentAssigneeId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (action === "status") {
        console.log("authService.getCurrentUserId()", authService.getCurrentUserId());
        const response = await supportService.updateIssueStatus(issueId, {
          issue_status: issueStatus,
          description: statusNote.trim() || null,
          updated_by_id: authService.getCurrentUserId(),
        });
        if (!isApiSuccess(response.status)) {
          throw new Error(response.errMessage || "Failed to update status");
        }
        toast.success("Status updated");
      } else if (action === "priority") {
        const response = await supportService.updateIssuePriority(issueId, { priority });
        if (!isApiSuccess(response.status)) {
          throw new Error(response.errMessage || "Failed to update priority");
        }
        toast.success("Priority updated");
      } else if (action === "assign") {
        const response = await supportService.assignIssue(issueId, {
          assigned_to_id:
            assignedToId && assignedToId !== "unassigned"
              ? parseInt(assignedToId, 10)
              : null,
        });
        if (!isApiSuccess(response.status)) {
          throw new Error(response.errMessage || "Failed to assign ticket");
        }
        toast.success("Ticket reassigned");
      } else if (action === "escalate") {
        const performedById = authService.getCurrentUserId();
        if (!performedById) {
          toast.error("You must be signed in to escalate");
          return;
        }
        if (!escalatedToId) {
          toast.error("Select who to escalate to");
          return;
        }
        const response = await supportService.createEscalation(issueId, {
          escalation_level: escalationLevel,
          reason: escalationReason.trim() || null,
          escalated_by_id: performedById,
          escalated_to_id: parseInt(escalatedToId, 10),
        });
        if (!isApiSuccess(response.status)) {
          throw new Error(response.errMessage || "Failed to create escalation");
        }
        toast.success("Escalation created");
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  const titles: Record<Exclude<TicketActionType, null>, string> = {
    status: "Change Status",
    priority: "Change Priority",
    assign: "Reassign Ticket",
    escalate: "Escalate Ticket",
  };

  return (
    <Dialog open={action !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{action ? titles[action] : ""}</DialogTitle>
        </DialogHeader>

        {action === "status" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={issueStatus} onValueChange={(v) => setIssueStatus(v as IssueStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {issueStatusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Reason for status change..."
              />
            </div>
          </div>
        )}

        {action === "priority" && (
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {(action === "assign" || action === "escalate") && (
          <div className="space-y-4">
            {action === "escalate" && (
              <div className="space-y-2">
                <Label>Escalation Level</Label>
                <Select
                  value={escalationLevel}
                  onValueChange={(v) => setEscalationLevel(v as EscalationLevel)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {escalationLevelOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>{action === "assign" ? "Assign To" : "Escalate To"}</Label>
              <Select
                value={action === "assign" ? assignedToId : escalatedToId}
                onValueChange={action === "assign" ? setAssignedToId : setEscalatedToId}
                disabled={loadingUsers}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingUsers ? "Loading..." : "Select user"} />
                </SelectTrigger>
                <SelectContent>
                  {action === "assign" && (
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                  )}
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {action === "escalate" && (
              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  placeholder="Why is this being escalated?"
                />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
