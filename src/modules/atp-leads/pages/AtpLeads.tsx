import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/modules/dashboard/components/DashboardLayout";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card";
import { Badge } from "@/modules/shared/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/shared/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Clock,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Users,
  MessageSquare,
} from "lucide-react";
import { CrmLead, LeadRegistrationStatus } from "../models/atpLeads.models";
import { atpLeadsService } from "../services/atpLeadsService";
import { LeadFormDialog } from "../components/LeadFormDialog";
import { ConfirmationModal } from "@/modules/shared/components/ConfirmationModal";
import { toast } from "@/modules/shared/hooks/use-toast";
import { formatLongDate } from "@/modules/shared/lib/formatLongDate";

const getRegistrationStatusBadge = (status: LeadRegistrationStatus) => {
  switch (status) {
    case "REGISTERED":
      return <Badge className="bg-success/10 text-success border-success/20">Registered</Badge>;
    case "PENDING":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function AtpLeads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<CrmLead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await atpLeadsService.searchLeads({
        page,
        limit,
        registration_status: statusFilter !== "all" ? (statusFilter as LeadRegistrationStatus) : undefined,
        name: searchQuery || undefined,
      });
      setLeads(response.data);
      setTotalPages(response.pagination.total_pages);
      setTotal(response.pagination.total);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchQuery]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  };

  const handleViewDetails = (lead: CrmLead) => {
    navigate(`/atp-leads/${lead.id}`);
  };

  const handleEditLead = (lead: CrmLead) => {
    setSelectedLead(lead);
    setIsFormDialogOpen(true);
  };

  const handleAddLead = () => {
    setSelectedLead(null);
    setIsFormDialogOpen(true);
  };

  const handleDeleteLead = (lead: CrmLead) => {
    setLeadToDelete(lead);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteLead = async () => {
    if (!leadToDelete) return;

    setIsDeleting(true);
    try {
      await atpLeadsService.deleteLead(leadToDelete.id);
      toast({
        title: "Success",
        description: "Lead deleted successfully.",
      });
      fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setLeadToDelete(null);
    }
  };

  const handleUpdateStatus = async (lead: CrmLead, status: LeadRegistrationStatus) => {
    try {
      await atpLeadsService.updateLeadRegistrationStatus(lead.id, status);
      toast({
        title: "Success",
        description: `Lead status updated to ${status.toLowerCase()}.`,
      });
      fetchLeads();
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };

  const pendingCount = leads.filter((l) => l.registration_status === "PENDING").length;
  const registeredCount = leads.filter((l) => l.registration_status === "REGISTERED").length;
  const totalFollowUps = leads.reduce((acc, l) => acc + l.followups.length, 0);

  return (
    <DashboardLayout
      title="CRM / ATP Leads"
      action={
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchLeads} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddLead}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>ATP Lead Management</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage ATP leads, track registrations, and schedule follow-ups via WhatsApp, Email, and SMS.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, email, or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="REGISTERED">Registered</SelectItem>
                </SelectContent>
              </Select>

              <Button type="submit" variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{total}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Users className="h-4 w-4" />
                    Total Leads
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{registeredCount}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Registered
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">{pendingCount}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" />
                    Pending
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-info">{totalFollowUps}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Follow-ups
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Follow-ups</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-muted-foreground">Loading leads...</p>
                    </TableCell>
                  </TableRow>
                ) : leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No leads found.</p>
                      <Button className="mt-4" variant="outline" onClick={handleAddLead}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Lead
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => {
                    const completedFollowUps = lead.followups.filter(
                      (f) => f.status === "COMPLETED"
                    ).length;
                    const pendingFollowUps = lead.followups.filter(
                      (f) => f.status === "PENDING"
                    ).length;

                    return (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.lead_id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {lead.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{lead.name}</div>
                              {lead.notes && (
                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                  {lead.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{lead.email}</div>
                            <div className="text-sm text-muted-foreground">{lead.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getRegistrationStatusBadge(lead.registration_status)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Stage {lead.current_stage || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-success">{completedFollowUps}</span>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-warning">{pendingFollowUps}</span>
                            <span className="text-muted-foreground">/</span>
                            <span>{lead.followups.length}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatLongDate(lead.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(lead)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditLead(lead)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Lead
                              </DropdownMenuItem>
                              {lead.registration_status === "PENDING" && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(lead, "REGISTERED")}
                                  className="text-success"
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Mark Registered
                                </DropdownMenuItem>
                              )}
                              {lead.registration_status === "REGISTERED" && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(lead, "PENDING")}
                                  className="text-warning"
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  Mark Pending
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDeleteLead(lead)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Lead
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} leads
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <LeadFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => {
          setIsFormDialogOpen(false);
          setSelectedLead(null);
        }}
        lead={selectedLead}
        onSuccess={() => {
          setTimeout(() => {
            fetchLeads();
          }, 1000);
        }}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setLeadToDelete(null);
        }}
        onConfirm={confirmDeleteLead}
        title="Delete Lead"
        description={`Are you sure you want to delete "${leadToDelete?.name}" (${leadToDelete?.lead_id})? This will also delete all associated follow-ups. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}
