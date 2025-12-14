import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/modules/dashboard/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card";
import { Button } from "@/modules/shared/components/ui/button";
import { Badge } from "@/modules/shared/components/ui/badge";
import { Textarea } from "@/modules/shared/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/shared/components/ui/tabs";
import { ScrollArea } from "@/modules/shared/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/modules/shared/components/ui/avatar";
import { Separator } from "@/modules/shared/components/ui/separator";
import {
  ArrowLeft,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  User,
  Calendar,
  MessageSquare,
  Paperclip,
  TrendingUp,
  FileText,
  Image,
  Video,
  Send,
  Download,
  Eye,
  AlertTriangle,
  ArrowUpRight,
  Phone,
  Mail,
  Hash,
} from "lucide-react";
import { Priority, IssueStatus, SupportTicket } from "../models/support.models";
import { format } from "date-fns";

// Mock ticket data
const mockTicket: SupportTicket = {
  id: 1,
  issue: "AC not working in room 302",
  issue_code: "TKT-001",
  type: "COMPLAINT",
  description:
    "The air conditioning unit in room 302 is not cooling properly. Guest has complained multiple times about the temperature being too high. The thermostat shows 28°C while set to 20°C. This issue started yesterday evening and has persisted overnight.",
  property_id: 1,
  property_name: "Grand Hotel Marina",
  assigned_to_id: 5,
  assigned_to_name: "John Maintenance",
  created_by_id: 10,
  created_by_name: "Sarah Guest",
  priority: "HIGH",
  status: "ACTIVE",
  issue_status: "IN_PROGRESS",
  attachments: ["photo1.jpg", "photo2.jpg", "video_evidence.mp4"],
  activities_count: 8,
  escalations_count: 1,
  created_on: "2024-12-14T10:30:00Z",
  updated_at: "2024-12-14T12:45:00Z",
};

// Mock activity timeline
const mockActivities = [
  {
    id: 1,
    type: "STATUS_CHANGE",
    description: "Status changed from Open to In Progress",
    created_by: "John Maintenance",
    created_at: "2024-12-14T11:00:00Z",
  },
  {
    id: 2,
    type: "COMMENT",
    description: "Checked the AC unit. The compressor seems to be working but refrigerant levels might be low. Scheduling maintenance check.",
    created_by: "John Maintenance",
    created_at: "2024-12-14T11:30:00Z",
  },
  {
    id: 3,
    type: "ASSIGNMENT",
    description: "Ticket assigned to John Maintenance",
    created_by: "System",
    created_at: "2024-12-14T10:35:00Z",
  },
  {
    id: 4,
    type: "ESCALATION",
    description: "Escalated to Senior Maintenance Manager due to repeated complaints",
    created_by: "Sarah Operations",
    created_at: "2024-12-14T12:00:00Z",
  },
  {
    id: 5,
    type: "COMMENT",
    description: "Maintenance team has been notified. ETA for repair: 2 hours.",
    created_by: "Mike Manager",
    created_at: "2024-12-14T12:30:00Z",
  },
];

// Mock comments
const mockComments = [
  {
    id: 1,
    content: "Guest mentioned the issue started after midnight. Please check if this affects other rooms on the same floor.",
    created_by: "Sarah Operations",
    created_at: "2024-12-14T10:40:00Z",
  },
  {
    id: 2,
    content: "Checked rooms 301 and 303. They seem to be working fine. Issue is isolated to room 302.",
    created_by: "John Maintenance",
    created_at: "2024-12-14T11:45:00Z",
  },
  {
    id: 3,
    content: "Guest has been offered a complimentary upgrade to room 405 while we fix this issue.",
    created_by: "Lisa Front Desk",
    created_at: "2024-12-14T12:15:00Z",
  },
];

// Mock escalations
const mockEscalations = [
  {
    id: 1,
    escalated_to: "Mike Senior Manager",
    escalated_by: "Sarah Operations",
    reason: "High priority issue not resolved within SLA. Guest satisfaction at risk.",
    level: 1,
    created_at: "2024-12-14T12:00:00Z",
  },
];

// Mock attachments with more details
const mockAttachments = [
  { name: "photo1.jpg", type: "image", size: "1.2 MB", uploaded_by: "Sarah Guest", uploaded_at: "2024-12-14T10:32:00Z" },
  { name: "photo2.jpg", type: "image", size: "980 KB", uploaded_by: "Sarah Guest", uploaded_at: "2024-12-14T10:32:00Z" },
  { name: "video_evidence.mp4", type: "video", size: "15.4 MB", uploaded_by: "John Maintenance", uploaded_at: "2024-12-14T11:35:00Z" },
];

const getPriorityBadge = (priority: Priority) => {
  const config = {
    LOW: { className: "bg-muted text-muted-foreground", label: "Low Priority" },
    MEDIUM: { className: "bg-info/10 text-info border-info/20", label: "Medium Priority" },
    HIGH: { className: "bg-warning/10 text-warning border-warning/20", label: "High Priority" },
    CRITICAL: { className: "bg-destructive/10 text-destructive border-destructive/20", label: "Critical" },
  };
  return config[priority] || config.MEDIUM;
};

const getStatusBadge = (status: IssueStatus) => {
  const config = {
    OPEN: { icon: AlertCircle, className: "bg-warning/10 text-warning border-warning/20", label: "Open" },
    IN_PROGRESS: { icon: Clock, className: "bg-info/10 text-info border-info/20", label: "In Progress" },
    RESOLVED: { icon: CheckCircle2, className: "bg-success/10 text-success border-success/20", label: "Resolved" },
    CLOSED: { icon: XCircle, className: "bg-muted text-muted-foreground", label: "Closed" },
  };
  return config[status] || config.OPEN;
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "STATUS_CHANGE":
      return <Clock className="h-4 w-4 text-info" />;
    case "COMMENT":
      return <MessageSquare className="h-4 w-4 text-primary" />;
    case "ASSIGNMENT":
      return <User className="h-4 w-4 text-success" />;
    case "ESCALATION":
      return <TrendingUp className="h-4 w-4 text-destructive" />;
    case "ATTACHMENT":
      return <Paperclip className="h-4 w-4 text-muted-foreground" />;
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

const getFileIcon = (type: string) => {
  switch (type) {
    case "image":
      return <Image className="h-8 w-8 text-success" />;
    case "video":
      return <Video className="h-8 w-8 text-info" />;
    default:
      return <FileText className="h-8 w-8 text-muted-foreground" />;
  }
};

// Attachment Thumbnail Component
const AttachmentThumbnail = ({ file, index }: { file: typeof mockAttachments[0]; index: number }) => {
  const [imageError, setImageError] = useState(false);

  if (file.type === "image" && !imageError) {
    return (
      <div className="aspect-square relative bg-muted/30 group/thumb">
        <img
          src={`https://picsum.photos/200/200?random=${index}`}
          alt={file.name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover/thumb:opacity-100">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 hover:bg-background">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 hover:bg-background">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-square flex flex-col items-center justify-center p-4 bg-muted/30">
      <div className="mb-2">{getFileIcon(file.type)}</div>
      <div className="flex items-center gap-2 mt-auto">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export function SupportTicketAdvancedView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const ticket = mockTicket;
  const priorityConfig = getPriorityBadge(ticket.priority);
  const statusConfig = getStatusBadge(ticket.issue_status);
  const StatusIcon = statusConfig.icon;

  const handleSendComment = () => {
    if (newComment.trim()) {
      // Handle sending comment
      setNewComment("");
    }
  };

  return (
    <DashboardLayout showHeader={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/support-tickets")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-sm font-medium text-primary">{ticket.issue_code}</span>
              <Badge className={priorityConfig.className}>{priorityConfig.label}</Badge>
              <Badge variant="secondary" className={statusConfig.className}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig.label}
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-foreground">{ticket.issue}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="destructive" size="sm">
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
            <Button size="sm">
              <CheckCircle2 className="h-4 w-4" />
              Mark Resolved
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="escalations">Escalations</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 mt-4">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base">Issue Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{ticket.description}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Property</p>
                          <p className="font-medium text-foreground">{ticket.property_name}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-info/10">
                          <Hash className="h-5 w-5 text-info" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Type</p>
                          <p className="font-medium text-foreground capitalize">{ticket.type.toLowerCase()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <MessageSquare className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{ticket.activities_count}</p>
                      <p className="text-xs text-muted-foreground">Activities</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <Paperclip className="h-6 w-6 text-success mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{ticket.attachments.length}</p>
                      <p className="text-xs text-muted-foreground">Attachments</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-6 w-6 text-destructive mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{ticket.escalations_count}</p>
                      <p className="text-xs text-muted-foreground">Escalations</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Attachments Section */}
                <Card className="border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Attachments</CardTitle>
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Add File
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {mockAttachments.map((file, index) => (
                        <div
                          key={index}
                          className="group relative rounded-lg border border-border/50 hover:border-border transition-colors overflow-hidden"
                        >
                          <AttachmentThumbnail file={file} index={index} />
                          <div className="p-3 bg-background">
                            <p className="font-medium text-sm text-foreground truncate mb-1">{file.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {file.size} • {file.uploaded_by}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(file.uploaded_at), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="mt-4">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base">Activity Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-6">
                        {mockActivities.map((activity, index) => (
                          <div key={activity.id} className="relative pl-8">
                            {index !== mockActivities.length - 1 && (
                              <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-border" />
                            )}
                            <div className="absolute left-0 top-1 p-1.5 rounded-full bg-background border-2 border-border">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="bg-muted/30 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-foreground">{activity.created_by}</span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(activity.created_at), "MMM dd, yyyy 'at' HH:mm")}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Comments Tab */}
              <TabsContent value="comments" className="mt-4 space-y-4">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base">Comments & Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] pr-4 mb-4">
                      <div className="space-y-4">
                        {mockComments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {comment.created_by
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-muted/30 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm text-foreground">{comment.created_by}</span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(comment.created_at), "MMM dd 'at' HH:mm")}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <Separator className="my-4" />
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Add a comment or note..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button onClick={handleSendComment} disabled={!newComment.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Escalations Tab */}
              <TabsContent value="escalations" className="mt-4">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Escalation History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {mockEscalations.length > 0 ? (
                      <div className="space-y-4">
                        {mockEscalations.map((escalation) => (
                          <div
                            key={escalation.id}
                            className="p-4 rounded-lg border border-destructive/20 bg-destructive/5"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="destructive">Level {escalation.level}</Badge>
                                <ArrowUpRight className="h-4 w-4 text-destructive" />
                                <span className="font-medium text-foreground">{escalation.escalated_to}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(escalation.created_at), "MMM dd, yyyy 'at' HH:mm")}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{escalation.reason}</p>
                            <p className="text-xs text-muted-foreground">Escalated by: {escalation.escalated_by}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-success/50" />
                        <p>No escalations for this ticket</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Ticket Details Card */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Created By</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {ticket.created_by_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground text-sm">{ticket.created_by_name}</p>
                      <p className="text-xs text-muted-foreground">Reporter</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Assigned To</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-success/10 text-success">
                        {ticket.assigned_to_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground text-sm">{ticket.assigned_to_name}</p>
                      <p className="text-xs text-muted-foreground">Assignee</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Created</span>
                    <span className="text-sm text-foreground">
                      {format(new Date(ticket.created_on), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Last Updated</span>
                    <span className="text-sm text-foreground">
                      {format(new Date(ticket.updated_at), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Reassign Ticket
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Change Status
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Change Priority
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" size="sm">
                  <XCircle className="h-4 w-4 mr-2" />
                  Close Ticket
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info Card */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Contact Reporter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Phone className="h-4 w-4 mr-2 text-success" />
                  +1 234 567 8900
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  sarah.guest@email.com
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
