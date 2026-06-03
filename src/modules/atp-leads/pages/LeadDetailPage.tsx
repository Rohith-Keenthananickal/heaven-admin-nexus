import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/modules/dashboard/components/DashboardLayout";
import { Badge } from "@/modules/shared/components/ui/badge";
import { Button } from "@/modules/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu";
import {
  Mail,
  Phone,
  Calendar,
  Activity,
  Edit,
  UserCheck,
  Clock,
  MessageSquare,
  Send,
  Plus,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Trash2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { CrmLead, CrmLeadFollowUp, FollowUpChannel, FollowUpStatus } from "../models/atpLeads.models";
import { atpLeadsService } from "../services/atpLeadsService";
import { toast } from "@/modules/shared/hooks/use-toast";
import { FollowUpFormDialog } from "../components/FollowUpFormDialog";
import { LeadFormDialog } from "../components/LeadFormDialog";
import { ConfirmationModal } from "@/modules/shared/components/ConfirmationModal";
import { formatLongDate } from "@/modules/shared/lib/formatLongDate";

const getRegistrationStatusBadge = (status: string) => {
  switch (status) {
    case "REGISTERED":
      return <Badge className="bg-success/10 text-success border-success/20">Registered</Badge>;
    case "PENDING":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getFollowUpStatusBadge = (status: FollowUpStatus) => {
  switch (status) {
    case "COMPLETED":
      return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>;
    case "PENDING":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    case "FAILED":
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Failed</Badge>;
    case "SKIPPED":
      return <Badge className="bg-muted text-muted-foreground">Skipped</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getChannelIcon = (channel: FollowUpChannel) => {
  switch (channel) {
    case "EMAIL":
      return <Mail className="h-4 w-4" />;
    case "WHATSAPP":
      return <MessageSquare className="h-4 w-4" />;
    case "SMS":
      return <Send className="h-4 w-4" />;
    default:
      return <Mail className="h-4 w-4" />;
  }
};

const getChannelBadge = (channel: FollowUpChannel) => {
  switch (channel) {
    case "EMAIL":
      return (
        <Badge variant="outline" className="gap-1">
          <Mail className="h-3 w-3" />
          Email
        </Badge>
      );
    case "WHATSAPP":
      return (
        <Badge variant="outline" className="gap-1 text-green-600 border-green-200">
          <MessageSquare className="h-3 w-3" />
          WhatsApp
        </Badge>
      );
    case "SMS":
      return (
        <Badge variant="outline" className="gap-1 text-blue-600 border-blue-200">
          <Send className="h-3 w-3" />
          SMS
        </Badge>
      );
    default:
      return <Badge variant="outline">{channel}</Badge>;
  }
};

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [lead, setLead] = useState<CrmLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<CrmLeadFollowUp | null>(null);
  const [showDeleteFollowUpModal, setShowDeleteFollowUpModal] = useState(false);
  const [followUpToDelete, setFollowUpToDelete] = useState<CrmLeadFollowUp | null>(null);
  const [deletingFollowUp, setDeletingFollowUp] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteLeadModal, setShowDeleteLeadModal] = useState(false);
  const [deletingLead, setDeletingLead] = useState(false);

  const fetchLead = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await atpLeadsService.getLeadById(parseInt(id));
      setLead(response.data);
    } catch (error) {
      console.error("Error fetching lead:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load lead details.",
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const handleMarkStatus = async (followUp: CrmLeadFollowUp, status: FollowUpStatus) => {
    if (!lead) return;
    
    setUpdatingStatus(followUp.id);
    try {
      if (status === "COMPLETED") {
        await atpLeadsService.markFollowUpCompleted(lead.id, followUp.id);
      } else if (status === "FAILED") {
        await atpLeadsService.markFollowUpFailed(lead.id, followUp.id);
      } else if (status === "SKIPPED") {
        await atpLeadsService.markFollowUpSkipped(lead.id, followUp.id);
      }
      toast({
        title: "Success",
        description: `Follow-up marked as ${status.toLowerCase()}.`,
      });
      fetchLead();
    } catch (error) {
      console.error("Error updating follow-up status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleEditFollowUp = (followUp: CrmLeadFollowUp) => {
    setSelectedFollowUp(followUp);
    setShowFollowUpDialog(true);
  };

  const handleAddFollowUp = () => {
    setSelectedFollowUp(null);
    setShowFollowUpDialog(true);
  };

  const handleDeleteFollowUp = (followUp: CrmLeadFollowUp) => {
    setFollowUpToDelete(followUp);
    setShowDeleteFollowUpModal(true);
  };

  const confirmDeleteFollowUp = async () => {
    if (!followUpToDelete || !lead) return;
    
    setDeletingFollowUp(true);
    try {
      await atpLeadsService.deleteFollowUp(lead.id, followUpToDelete.id);
      toast({
        title: "Success",
        description: "Follow-up deleted successfully.",
      });
      fetchLead();
    } catch (error) {
      console.error("Error deleting follow-up:", error);
    } finally {
      setDeletingFollowUp(false);
      setShowDeleteFollowUpModal(false);
      setFollowUpToDelete(null);
    }
  };

  const confirmDeleteLead = async () => {
    if (!lead) return;
    
    setDeletingLead(true);
    try {
      await atpLeadsService.deleteLead(lead.id);
      toast({
        title: "Success",
        description: "Lead deleted successfully.",
      });
      navigate("/atp-leads");
    } catch (error) {
      console.error("Error deleting lead:", error);
    } finally {
      setDeletingLead(false);
      setShowDeleteLeadModal(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!lead) {
    return (
      <DashboardLayout title="Lead Not Found">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">The requested lead could not be found.</p>
              <Button onClick={() => navigate("/atp-leads")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Leads
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const sortedFollowUps = [...lead.followups].sort((a, b) => a.step_order - b.step_order);
  const completedFollowUps = lead.followups.filter((f) => f.status === "COMPLETED").length;
  const pendingFollowUps = lead.followups.filter((f) => f.status === "PENDING").length;
  const totalFollowUps = lead.followups.length;

  return (
    <DashboardLayout
      title={`Lead: ${lead.name}`}
      action={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/atp-leads")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button variant="outline" onClick={fetchLead}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteLeadModal(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {lead.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{lead.name}</h2>
              {getRegistrationStatusBadge(lead.registration_status)}
            </div>
            <p className="text-muted-foreground">Lead ID: {lead.lead_id}</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="followups">
              Follow-ups ({totalFollowUps})
            </TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Lead Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Created: {formatLongDate(lead.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Updated: {formatLongDate(lead.updated_at)}</span>
                    </div>
                    {lead.notes && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground font-medium mb-1">Notes:</p>
                        <p className="text-sm">{lead.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Follow-up Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {lead.current_stage || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Current Stage</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-success">{completedFollowUps}</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-warning">{pendingFollowUps}</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-info">{totalFollowUps}</div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                  </div>

                  {totalFollowUps > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Progress</span>
                        <span>
                          {completedFollowUps}/{totalFollowUps}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-success transition-all"
                          style={{
                            width: `${(completedFollowUps / totalFollowUps) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="followups" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Follow-up Schedule</CardTitle>
                <Button size="sm" onClick={handleAddFollowUp}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Follow-up
                </Button>
              </CardHeader>
              <CardContent>
                {sortedFollowUps.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No follow-ups scheduled yet.</p>
                    <Button className="mt-4" variant="outline" onClick={handleAddFollowUp}>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule First Follow-up
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Step</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>Scheduled</TableHead>
                        <TableHead>Sent</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedFollowUps.map((followUp) => (
                        <TableRow key={followUp.id}>
                          <TableCell className="font-medium">#{followUp.step_order}</TableCell>
                          <TableCell>{getChannelBadge(followUp.channel)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {formatLongDate(followUp.scheduled_at)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {followUp.sent_at ? (
                              <span className="text-sm text-success">
                                {formatLongDate(followUp.sent_at)}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>{getFollowUpStatusBadge(followUp.status)}</TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground truncate max-w-[150px] block">
                              {followUp.notes || "-"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={updatingStatus === followUp.id}
                                >
                                  {updatingStatus === followUp.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <MoreVertical className="h-4 w-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditFollowUp(followUp)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                {followUp.status === "PENDING" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => handleMarkStatus(followUp, "COMPLETED")}
                                      className="text-success"
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Mark Completed
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleMarkStatus(followUp, "FAILED")}
                                      className="text-destructive"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Mark Failed
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleMarkStatus(followUp, "SKIPPED")}
                                    >
                                      <AlertCircle className="h-4 w-4 mr-2" />
                                      Mark Skipped
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDeleteFollowUp(followUp)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedFollowUps.map((followUp) => (
                    <div
                      key={followUp.id}
                      className="flex items-start gap-3 p-3 border-l-2 border-primary/20"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          followUp.status === "COMPLETED"
                            ? "bg-success/10 text-success"
                            : followUp.status === "FAILED"
                            ? "bg-destructive/10 text-destructive"
                            : followUp.status === "SKIPPED"
                            ? "bg-muted text-muted-foreground"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {getChannelIcon(followUp.channel)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            Step {followUp.step_order}: {followUp.channel} Follow-up
                          </span>
                          {getFollowUpStatusBadge(followUp.status)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Scheduled: {formatLongDate(followUp.scheduled_at)}
                        </div>
                        {followUp.sent_at && (
                          <div className="text-sm text-success mt-1">
                            Sent: {formatLongDate(followUp.sent_at)}
                          </div>
                        )}
                        {followUp.notes && (
                          <div className="text-sm text-muted-foreground mt-2 bg-muted/50 p-2 rounded">
                            {followUp.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {sortedFollowUps.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No activity yet.</p>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-3 border-l-2 border-muted">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Lead Created</div>
                      <div className="text-sm text-muted-foreground">
                        {formatLongDate(lead.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <FollowUpFormDialog
        isOpen={showFollowUpDialog}
        onClose={() => {
          setShowFollowUpDialog(false);
          setSelectedFollowUp(null);
        }}
        leadId={lead.id}
        followUp={selectedFollowUp}
        existingFollowUps={lead.followups}
        onSuccess={fetchLead}
      />

      <LeadFormDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        lead={lead}
        onSuccess={fetchLead}
      />

      <ConfirmationModal
        isOpen={showDeleteFollowUpModal}
        onClose={() => {
          setShowDeleteFollowUpModal(false);
          setFollowUpToDelete(null);
        }}
        onConfirm={confirmDeleteFollowUp}
        title="Delete Follow-up"
        description={`Are you sure you want to delete this ${followUpToDelete?.channel} follow-up (Step ${followUpToDelete?.step_order})? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
        isLoading={deletingFollowUp}
      />

      <ConfirmationModal
        isOpen={showDeleteLeadModal}
        onClose={() => setShowDeleteLeadModal(false)}
        onConfirm={confirmDeleteLead}
        title="Delete Lead"
        description={`Are you sure you want to delete "${lead.name}" (${lead.lead_id})? This will also delete all associated follow-ups. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
        isLoading={deletingLead}
      />
    </DashboardLayout>
  );
}
