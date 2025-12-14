import { useState, useCallback } from "react";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Textarea } from "@/modules/shared/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Badge } from "@/modules/shared/components/ui/badge";
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  File,
  Trash2,
} from "lucide-react";
import {
  Priority,
  IssueStatus,
  TicketType,
  priorityOptions,
  issueStatusOptions,
  ticketTypeOptions,
} from "../models/support.models";
import { cn } from "@/modules/shared/lib/utils";

interface CreateTicketFormData {
  issue: string;
  type: TicketType;
  description: string;
  property_id: number;
  assigned_to_id: number;
  priority: Priority;
  attachments: File[];
  created_by_id: number;
  issue_status: IssueStatus;
}

interface Property {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email?: string;
}

// Mock data for dropdowns
const mockProperties: Property[] = [
  { id: 1, name: "Grand Hotel Marina" },
  { id: 2, name: "Sunset Beach Resort" },
  { id: 3, name: "Mountain View Lodge" },
  { id: 4, name: "City Center Hotel" },
  { id: 5, name: "Riverside Inn" },
];

const mockUsers: User[] = [
  { id: 1, name: "John Maintenance", email: "john@example.com" },
  { id: 2, name: "Lisa Reservations", email: "lisa@example.com" },
  { id: 3, name: "Mike Finance", email: "mike@example.com" },
  { id: 4, name: "Sarah Operations", email: "sarah@example.com" },
  { id: 5, name: "David Wilson", email: "david@example.com" },
  { id: 6, name: "Emma Brown", email: "emma@example.com" },
  { id: 7, name: "Robert Taylor", email: "robert@example.com" },
  { id: 8, name: "Tech Support Team", email: "tech@example.com" },
];

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Omit<CreateTicketFormData, "attachments"> & { attachments: string[] }) => Promise<void>;
}

export function CreateTicketModal({ isOpen, onClose, onSubmit }: CreateTicketModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateTicketFormData>({
    issue: "",
    type: "COMPLAINT",
    description: "",
    property_id: 0,
    assigned_to_id: 0,
    priority: "MEDIUM",
    attachments: [],
    created_by_id: 0,
    issue_status: "OPEN",
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async () => {
    if (!formData.issue || !formData.description || !formData.property_id || !formData.assigned_to_id || !formData.created_by_id) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert File objects to URLs/names for API
      const attachmentUrls = await Promise.all(
        formData.attachments.map(async (file) => {
          // In a real implementation, upload the file and get the URL
          // For now, we'll use the file name
          return file.name;
        })
      );

      const submitData = {
        ...formData,
        attachments: attachmentUrls,
      };

      if (onSubmit) {
        await onSubmit(submitData);
      } else {
        // Default behavior
        console.log("Creating ticket:", submitData);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Reset form
      setFormData({
        issue: "",
        type: "COMPLAINT",
        description: "",
        property_id: 0,
        assigned_to_id: 0,
        priority: "MEDIUM",
        attachments: [],
        created_by_id: 0,
        issue_status: "OPEN",
      });
      onClose();
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter((file) => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const validTypes = ["image/svg+xml", "image/png", "image/jpeg", "image/jpg", "application/pdf"];
      return file.size <= maxSize && validTypes.some((type) => file.type === type);
    });

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles],
    }));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const validTypes = ["image/svg+xml", "image/png", "image/jpeg", "image/jpg", "application/pdf"];
      return file.size <= maxSize && validTypes.some((type) => file.type === type);
    });

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles],
    }));
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5" />;
    }
    if (file.type === "application/pdf") {
      return <FileText className="h-5 w-5" />;
    }
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const isFormValid = formData.issue && formData.description && formData.property_id && formData.assigned_to_id && formData.created_by_id;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Support Ticket</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new support ticket.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Issue */}
          <div className="space-y-2">
            <Label htmlFor="issue">Issue *</Label>
            <Input
              id="issue"
              placeholder="Enter issue title"
              value={formData.issue}
              onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
            />
          </div>

          {/* Type and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: TicketType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ticketTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Priority) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Enter detailed description of the issue"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          {/* Property ID and Assigned To ID */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="property_id">Property *</Label>
              <Select
                value={formData.property_id.toString()}
                onValueChange={(value) => setFormData({ ...formData, property_id: parseInt(value) })}
              >
                <SelectTrigger id="property_id">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {mockProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id.toString()}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assigned_to_id">Assigned To *</Label>
              <Select
                value={formData.assigned_to_id.toString()}
                onValueChange={(value) => setFormData({ ...formData, assigned_to_id: parseInt(value) })}
              >
                <SelectTrigger id="assigned_to_id">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Created By ID and Issue Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="created_by_id">Created By *</Label>
              <Select
                value={formData.created_by_id.toString()}
                onValueChange={(value) => setFormData({ ...formData, created_by_id: parseInt(value) })}
              >
                <SelectTrigger id="created_by_id">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue_status">Issue Status *</Label>
              <Select
                value={formData.issue_status}
                onValueChange={(value: IssueStatus) => setFormData({ ...formData, issue_status: value })}
              >
                <SelectTrigger id="issue_status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {issueStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Attachments - Drag and Drop */}
          <div className="space-y-2">
            <Label>Attach Files</Label>
            <div
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 bg-muted/30"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept=".svg,.png,.jpg,.jpeg,.pdf"
                onChange={handleFileSelect}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center gap-4"
              >
                <div className="rounded-full bg-muted p-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    <span className="text-primary hover:underline">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    SVG, PNG, JPG or PDF (MAX. 10MB)
                  </p>
                </div>
              </label>
            </div>

            {/* Uploaded Files List */}
            {formData.attachments.length > 0 && (
              <div className="space-y-2 mt-4">
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background"
                  >
                    <div className="p-2 rounded bg-muted">{getFileIcon(file)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFile(index)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !isFormValid}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Creating...
              </>
            ) : (
              "Create Ticket"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

