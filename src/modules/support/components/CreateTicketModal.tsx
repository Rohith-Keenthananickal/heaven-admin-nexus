import { useState, useCallback, useEffect, type ComponentType } from "react";
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
  FileText,
  Image as ImageIcon,
  File,
  Trash2,
  Building2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shared/components/ui/avatar";
import {
  Priority,
  IssueStatus,
  TicketType,
  priorityOptions,
  issueStatusOptions,
  ticketTypeOptions,
} from "../models/support.models";
import { cn } from "@/modules/shared/lib/utils";
import { authService } from "@/modules/auth/services/authService";
import { supportService, PropertyOption } from "../services/Support.service";
import AtpService from "@/modules/atp/services/atp.service";
import { uploadService } from "@/modules/shared/services/upload.service";
import { User } from "@/modules/auth/models/auth.models";
import { GetAllAreaCoordinatorsPayload } from "@/modules/atp/models/atp.models";
import { toast } from "sonner";

interface CreateTicketFormData {
  issue: string;
  type: TicketType;
  description: string;
  property_id?: number;
  assigned_to_id?: number;
  priority: Priority;
  attachments: File[];
  created_by_id: number;
  issue_status: IssueStatus;
}

const initialFormData: CreateTicketFormData = {
  issue: "",
  type: "SUPPORT",
  description: "",
  property_id: undefined,
  assigned_to_id: undefined,
  priority: "MEDIUM",
  attachments: [],
  created_by_id: 0,
  issue_status: "OPEN",
};

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Omit<CreateTicketFormData, "attachments"> & { attachments: string[] }) => Promise<void>;
}

function getUserAvatarUrl(user: User): string {
  if (user.profile_image?.trim()) return user.profile_image.trim();
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.full_name || String(user.id))}`;
}

function getPropertyImageUrl(property: PropertyOption): string | undefined {
  if (property.cover_image?.trim()) return property.cover_image.trim();
  return undefined;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SelectOptionRow({
  imageUrl,
  label,
  fallback,
  fallbackIcon: FallbackIcon,
  compact = false,
}: {
  imageUrl?: string;
  label: string;
  fallback: string;
  fallbackIcon?: ComponentType<{ className?: string }>;
  compact?: boolean;
}) {
  const avatarSize = compact ? "h-6 w-6" : "h-8 w-8";
  const iconSize = compact ? "h-3 w-3" : "h-4 w-4";

  return (
    <div className="flex flex-row items-center gap-2 min-w-0 flex-1 overflow-hidden">
      <Avatar className={cn(avatarSize, "shrink-0")}>
        {imageUrl ? <AvatarImage src={imageUrl} alt={label} /> : null}
        <AvatarFallback className="text-xs bg-muted">
          {FallbackIcon ? <FallbackIcon className={cn(iconSize, "text-muted-foreground")} /> : fallback}
        </AvatarFallback>
      </Avatar>
      <span className="truncate text-sm leading-none">{label}</span>
    </div>
  );
}

export function CreateTicketModal({ isOpen, onClose, onSubmit }: CreateTicketModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateTicketFormData>(initialFormData);
  const [isDragging, setIsDragging] = useState(false);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const currentUserId = authService.getCurrentUserId();
    setFormData((prev) => ({
      ...initialFormData,
      created_by_id: currentUserId ?? 0,
    }));

    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const [propertyList, usersResponse] = await Promise.all([
          supportService.searchProperties(),
          AtpService.getAllAreaCoordinators({
            user_type: ["ADMIN", "AREA_COORDINATOR", "HOST"] as unknown as GetAllAreaCoordinatorsPayload["user_type"],
            limit: 100,
          }),
        ]);

        setProperties(propertyList);

        if (usersResponse.status && Array.isArray(usersResponse.data)) {
          setUsers(usersResponse.data);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error loading ticket form options:", error);
        toast.error("Failed to load properties or users");
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!formData.issue.trim() || !formData.description.trim()) {
      toast.error("Please enter an issue title and description");
      return;
    }
    if (!formData.property_id) {
      toast.error("Please select a property");
      return;
    }
    if (!formData.assigned_to_id) {
      toast.error("Please select who this ticket is assigned to");
      return;
    }
    if (!formData.created_by_id) {
      toast.error("You must be signed in to create a ticket");
      return;
    }

    setIsSubmitting(true);
    try {
      const attachmentUrls = await Promise.all(
        formData.attachments.map((file) =>
          uploadService.uploadFile(file, file.type.startsWith("image/") ? "image" : "document")
        )
      );

      const submitData = {
        issue: formData.issue.trim(),
        type: formData.type,
        description: formData.description.trim(),
        property_id: formData.property_id,
        assigned_to_id: formData.assigned_to_id,
        priority: formData.priority,
        created_by_id: formData.created_by_id,
        issue_status: formData.issue_status,
        attachments: attachmentUrls,
      };

      if (onSubmit) {
        await onSubmit(submitData);
      }

      setFormData(initialFormData);
      onClose();
    } catch (error) {
      console.error("Error creating ticket:", error);
      const message =
        error instanceof Error ? error.message : "Failed to create ticket. Please try again.";
      toast.error(message);
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

  const isFormValid =
    formData.issue.trim() &&
    formData.description.trim();

  const selectedProperty = properties.find((p) => p.id === formData.property_id);
  const selectedUser = users.find((u) => u.id === formData.assigned_to_id);

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setFormData(initialFormData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
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
                value={formData.property_id ? formData.property_id.toString() : undefined}
                onValueChange={(value) =>
                  setFormData({ ...formData, property_id: parseInt(value, 10) })
                }
                disabled={loadingOptions}
              >
                <SelectTrigger
                  id="property_id"
                  className="h-10 py-0 gap-2 overflow-hidden [&>span]:line-clamp-none"
                >
                  {selectedProperty ? (
                    <SelectOptionRow
                      compact
                      imageUrl={getPropertyImageUrl(selectedProperty)}
                      label={selectedProperty.property_name || "Unnamed property"}
                      fallback={getInitials(selectedProperty.property_name || "Property")}
                      fallbackIcon={Building2}
                    />
                  ) : (
                    <SelectValue placeholder={loadingOptions ? "Loading..." : "Select property"} />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem
                      key={property.id}
                      value={property.id.toString()}
                      className="py-2 pl-3 pr-2 focus:bg-accent [&>span:first-child]:hidden"
                    >
                      <SelectOptionRow
                        imageUrl={getPropertyImageUrl(property)}
                        label={property.property_name || "Unnamed property"}
                        fallback={getInitials(property.property_name || "Property")}
                        fallbackIcon={Building2}
                      />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assigned_to_id">Assigned To *</Label>
              <Select
                value={formData.assigned_to_id ? formData.assigned_to_id.toString() : undefined}
                onValueChange={(value) =>
                  setFormData({ ...formData, assigned_to_id: parseInt(value, 10) })
                }
                disabled={loadingOptions}
              >
                <SelectTrigger
                  id="assigned_to_id"
                  className="h-10 py-0 gap-2 overflow-hidden [&>span]:line-clamp-none"
                >
                  {selectedUser ? (
                    <SelectOptionRow
                      compact
                      imageUrl={getUserAvatarUrl(selectedUser)}
                      label={selectedUser.full_name}
                      fallback={getInitials(selectedUser.full_name)}
                    />
                  ) : (
                    <SelectValue placeholder={loadingOptions ? "Loading..." : "Select user"} />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem
                      key={user.id}
                      value={user.id.toString()}
                      className="py-2 pl-3 pr-2 focus:bg-accent [&>span:first-child]:hidden"
                    >
                      <SelectOptionRow
                        imageUrl={getUserAvatarUrl(user)}
                        label={user.full_name}
                        fallback={getInitials(user.full_name)}
                      />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Issue Status */}
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

