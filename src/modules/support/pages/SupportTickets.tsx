import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/modules/dashboard/components/DashboardLayout";
import { Card, CardContent } from "@/modules/shared/components/ui/card";
import { Input } from "@/modules/shared/components/ui/input";
import { Button } from "@/modules/shared/components/ui/button";
import { Badge } from "@/modules/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/shared/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/modules/shared/components/ui/pagination";
import {
  Search,
  LayoutGrid,
  List,
  Filter,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  User,
  Calendar,
  MessageSquare,
  TrendingUp,
  Eye,
  Paperclip,
  Plus,
  Loader2,
} from "lucide-react";
import {
  SupportTicket,
  Priority,
  IssueStatus,
  TicketType,
  priorityOptions,
  listTypeFilterOptions,
  issueStatusOptions,
  IssueSearchPayload,
  CreateIssuePayload,
} from "../models/support.models";
import { format } from "date-fns";
import { CreateTicketModal } from "../components/CreateTicketModal";
import { isApiSuccess, supportService } from "../services/Support.service";
import { Pagination as PaginationType } from "@/modules/shared/models/api.models";
import { toast } from "sonner";


const getPriorityBadge = (priority: Priority) => {
  const config = {
    LOW: { variant: "secondary" as const, className: "bg-muted text-muted-foreground" },
    MEDIUM: { variant: "secondary" as const, className: "bg-info/10 text-info border-info/20" },
    HIGH: { variant: "secondary" as const, className: "bg-warning/10 text-warning border-warning/20" },
    URGENT: { variant: "destructive" as const, className: "bg-destructive/10 text-destructive border-destructive/20" },
  };
  return config[priority] || config.MEDIUM;
};

const getStatusBadge = (status: IssueStatus) => {
  const config = {
    OPEN: { icon: AlertCircle, className: "bg-warning/10 text-warning border-warning/20", label: "Open" },
    IN_PROGRESS: { icon: Clock, className: "bg-info/10 text-info border-info/20", label: "In Progress" },
    ESCALATED: { icon: TrendingUp, className: "bg-destructive/10 text-destructive border-destructive/20", label: "Escalated" },
    CLOSED: { icon: XCircle, className: "bg-muted text-muted-foreground", label: "Closed" },
  };
  return config[status] || config.OPEN;
};

export function SupportTickets() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // API state
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  });

  // Fetch tickets from API
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const payload: IssueSearchPayload = {
        page: currentPage,
        limit: 10,
      };

      if (searchQuery.trim()) {
        payload.issue = searchQuery.trim();
      }

      if (typeFilter !== "all") {
        payload.type = typeFilter as TicketType;
      }

      if (statusFilter !== "all") {
        payload.issue_status = statusFilter as IssueStatus;
      }

      if (priorityFilter !== "all") {
        payload.priority = priorityFilter as Priority;
      }

      const response = await supportService.listSupportTickets(payload);

      if (isApiSuccess(response.status) && response.data) {
        setTickets(Array.isArray(response.data) ? response.data : []);
        setPagination(response.pagination);
      } else {
        setTickets([]);
        setError("Failed to fetch tickets");
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("An error occurred while fetching tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, priorityFilter, statusFilter, typeFilter]);

  // Fetch tickets on mount and when filters/page change
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleViewTicket = (ticketId: number) => {
    navigate(`/support-tickets/${ticketId}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateTicket = async (data: {
    issue: string;
    type: TicketType;
    description: string;
    property_id: number;
    assigned_to_id: number;
    priority: Priority;
    attachments: string[];
    created_by_id: number;
    issue_status: IssueStatus;
  }) => {
    const payload: CreateIssuePayload = {
      issue: data.issue.trim(),
      type: data.type,
      description: data.description.trim(),
      property_id: data.property_id,
      assigned_to_id: data.assigned_to_id,
      priority: data.priority,
      attachments: data.attachments.length > 0 ? data.attachments : null,
      created_by_id: data.created_by_id,
      issue_status: data.issue_status,
      source: "INTERNAL_UI",
    };

    const response = await supportService.createSupportTicket(payload);

    if (!isApiSuccess(response.status)) {
      throw new Error(response.errMessage || "Failed to create ticket");
    }

    toast.success("Support ticket created successfully");
    fetchTickets();
  };

  return (
    <DashboardLayout showHeader={false}>
      <div className="flex h-[calc(100vh-3rem)] min-h-0 flex-col gap-4">
        {/* Header */}
        <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Support Tickets</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all support requests
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "card" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("card")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="shrink-0 border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets by issue, code, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Status</SelectItem>
                    {issueStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Priority</SelectItem>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {listTypeFilterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid shrink-0 grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {tickets.filter((t) => t.issue_status === "OPEN").length}
                </p>
                <p className="text-sm text-muted-foreground">Open</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {tickets.filter((t) => t.issue_status === "IN_PROGRESS").length}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {tickets.filter((t) => t.issue_status === "CLOSED").length}
                </p>
                <p className="text-sm text-muted-foreground">Closed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <TrendingUp className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {tickets.filter((t) => t.priority === "URGENT").length}
                </p>
                <p className="text-sm text-muted-foreground">Urgent</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="flex min-h-0 flex-1 flex-col border-border/50">
            <CardContent className="flex flex-1 items-center justify-center p-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading tickets...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="flex min-h-0 flex-1 flex-col border-border/50">
            <CardContent className="flex flex-1 items-center justify-center p-12">
              <div className="flex flex-col items-center gap-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-destructive">{error}</p>
                <Button variant="outline" onClick={fetchTickets}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tickets List */}
        {!loading && !error && (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {viewMode === "table" ? (
              <Card className="flex min-h-0 flex-1 flex-col overflow-hidden border-border/50">
                <CardContent className="flex min-h-0 flex-1 flex-col p-0">
                  <div className="min-h-0 flex-1 overflow-auto">
                  <Table className="table-fixed">
                    <TableHeader className="sticky top-0 z-10 bg-background">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[100px]">Code</TableHead>
                        <TableHead className="max-w-[200px] w-[200px]">Issue</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead className="w-[180px]">Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No tickets found
                          </TableCell>
                        </TableRow>
                      ) : (
                        tickets.map((ticket) => {
                          const priorityConfig = getPriorityBadge(ticket.priority);
                          const statusConfig = getStatusBadge(ticket.issue_status);
                          const StatusIcon = statusConfig.icon;

                          return (
                            <TableRow
                              key={ticket.id}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleViewTicket(ticket.id)}
                            >
                              <TableCell className="font-mono text-sm font-medium text-primary">
                                {ticket.issue_code}
                              </TableCell>
                              <TableCell className="max-w-[200px] w-[200px] overflow-hidden">
                                <div className="flex min-w-0 flex-col">
                                  <span className="truncate font-medium text-foreground">
                                    {ticket.issue}
                                  </span>
                                  <span className="truncate text-xs text-muted-foreground">
                                    {ticket.description}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                  {ticket.property_name ? (
                                    <div className="flex items-center gap-2">
                                      <Building2 className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm">{ticket.property_name}</span>
                                    </div>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">--</span>
                                  )}
                              </TableCell>
                              <TableCell>
                                <Badge variant={priorityConfig.variant} className={priorityConfig.className}>
                                  {ticket.priority}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className={statusConfig.className}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig.label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {ticket.assigned_to_name ? (
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{ticket.assigned_to_name}</span>
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground">--</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="text-sm text-muted-foreground">
                                    {format(new Date(ticket.created_on), "MMM dd, yyyy")}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    by {ticket.created_by_name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {(ticket.attachments?.length ?? 0) > 0 && (
                                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <span className="flex items-center text-xs text-muted-foreground">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    {ticket.activities_count}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewTicket(ticket.id);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {tickets.length === 0 ? (
                  <Card className="border-border/50 col-span-full">
                    <CardContent className="p-12 text-center text-muted-foreground">
                      No tickets found
                    </CardContent>
                  </Card>
                ) : (
                  tickets.map((ticket) => {
                    const priorityConfig = getPriorityBadge(ticket.priority);
                    const statusConfig = getStatusBadge(ticket.issue_status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <Card
                        key={ticket.id}
                        className="border-border/50 hover:shadow-lg transition-all cursor-pointer group"
                        onClick={() => handleViewTicket(ticket.id)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <span className="font-mono text-sm font-medium text-primary">
                              {ticket.issue_code}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge variant={priorityConfig.variant} className={priorityConfig.className}>
                                {ticket.priority}
                              </Badge>
                            </div>
                          </div>

                          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {ticket.issue}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {ticket.description}
                          </p>

                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className={statusConfig.className}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building2 className="h-4 w-4" />
                              <span>{ticket.property_name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>{ticket.assigned_to_name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(ticket.created_on), "MMM dd, yyyy 'at' HH:mm")}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                            <div className="flex items-center gap-3 text-muted-foreground">
                              <span className="flex items-center text-xs">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                {ticket.activities_count} activities
                              </span>
                              {(ticket.attachments?.length ?? 0) > 0 && (
                                <span className="flex items-center text-xs">
                                  <Paperclip className="h-3 w-3 mr-1" />
                                  {ticket.attachments?.length ?? 0}
                                </span>
                              )}
                            </div>
                            {ticket.escalations_count > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {ticket.escalations_count} escalation{ticket.escalations_count > 1 ? "s" : ""}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.total_pages > 0 && (
          <div className="flex shrink-0 justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.has_prev) {
                        handlePageChange(pagination.page - 1);
                      }
                    }}
                    className={!pagination.has_prev ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === pagination.total_pages ||
                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          isActive={page === pagination.page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (page === pagination.page - 2 || page === pagination.page + 2) {
                    return (
                      <PaginationItem key={page}>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.has_next) {
                        handlePageChange(pagination.page + 1);
                      }
                    }}
                    className={!pagination.has_next ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Create Ticket Modal */}
        <CreateTicketModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTicket}
        />
      </div>
    </DashboardLayout>
  );
}
