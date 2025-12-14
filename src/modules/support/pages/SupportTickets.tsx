import { useState } from "react";
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
} from "lucide-react";
import {
  SupportTicket,
  Priority,
  IssueStatus,
  priorityOptions,
  categoryOptions,
  typeOptions,
  issueStatusOptions,
} from "../models/support.models";
import { format } from "date-fns";
import { CreateTicketModal } from "../components/CreateTicketModal";

// Mock data for demonstration
const mockTickets: SupportTicket[] = [
  {
    id: 1,
    issue: "AC not working in room 302",
    issue_code: "TKT-001",
    type: "COMPLAINT",
    description: "The air conditioning unit in room 302 is not cooling properly. Guest has complained multiple times.",
    property_id: 1,
    property_name: "Grand Hotel Marina",
    assigned_to_id: 5,
    assigned_to_name: "John Maintenance",
    created_by_id: 10,
    created_by_name: "Sarah Guest",
    priority: "HIGH",
    status: "ACTIVE",
    issue_status: "IN_PROGRESS",
    attachments: ["photo1.jpg", "photo2.jpg"],
    activities_count: 8,
    escalations_count: 1,
    created_on: "2024-12-14T10:30:00Z",
    updated_at: "2024-12-14T12:45:00Z",
  },
  {
    id: 2,
    issue: "Payment refund request",
    issue_code: "TKT-002",
    type: "REQUEST",
    description: "Guest requesting refund for cancelled booking due to emergency.",
    property_id: 2,
    property_name: "Sunset Beach Resort",
    assigned_to_id: 3,
    assigned_to_name: "Mike Finance",
    created_by_id: 15,
    created_by_name: "David Wilson",
    priority: "MEDIUM",
    status: "ACTIVE",
    issue_status: "OPEN",
    attachments: [],
    activities_count: 3,
    escalations_count: 0,
    created_on: "2024-12-13T14:20:00Z",
    updated_at: "2024-12-14T09:00:00Z",
  },
  {
    id: 3,
    issue: "Login issues on mobile app",
    issue_code: "TKT-003",
    type: "COMPLAINT",
    description: "Unable to login to the mobile application. Error message: Invalid credentials.",
    property_id: 0,
    property_name: "N/A",
    assigned_to_id: 8,
    assigned_to_name: "Tech Support Team",
    created_by_id: 22,
    created_by_name: "Emma Brown",
    priority: "LOW",
    status: "ACTIVE",
    issue_status: "RESOLVED",
    attachments: ["screenshot.png"],
    activities_count: 5,
    escalations_count: 0,
    created_on: "2024-12-12T08:15:00Z",
    updated_at: "2024-12-13T16:30:00Z",
  },
  {
    id: 4,
    issue: "Water leak in bathroom",
    issue_code: "TKT-004",
    type: "COMPLAINT",
    description: "Severe water leak from ceiling in bathroom. Room needs immediate attention.",
    property_id: 1,
    property_name: "Grand Hotel Marina",
    assigned_to_id: 5,
    assigned_to_name: "John Maintenance",
    created_by_id: 18,
    created_by_name: "Robert Taylor",
    priority: "CRITICAL",
    status: "ACTIVE",
    issue_status: "OPEN",
    attachments: ["leak1.jpg", "leak2.jpg", "video.mp4"],
    activities_count: 12,
    escalations_count: 2,
    created_on: "2024-12-14T07:00:00Z",
    updated_at: "2024-12-14T13:00:00Z",
  },
  {
    id: 5,
    issue: "Booking modification request",
    issue_code: "TKT-005",
    type: "REQUEST",
    description: "Request to change check-in date from Dec 20 to Dec 22.",
    property_id: 3,
    property_name: "Mountain View Lodge",
    assigned_to_id: 2,
    assigned_to_name: "Lisa Reservations",
    created_by_id: 25,
    created_by_name: "Jennifer Adams",
    priority: "MEDIUM",
    status: "ACTIVE",
    issue_status: "CLOSED",
    attachments: [],
    activities_count: 4,
    escalations_count: 0,
    created_on: "2024-12-11T11:00:00Z",
    updated_at: "2024-12-12T14:00:00Z",
  },
];

const getPriorityBadge = (priority: Priority) => {
  const config = {
    LOW: { variant: "secondary" as const, className: "bg-muted text-muted-foreground" },
    MEDIUM: { variant: "secondary" as const, className: "bg-info/10 text-info border-info/20" },
    HIGH: { variant: "secondary" as const, className: "bg-warning/10 text-warning border-warning/20" },
    CRITICAL: { variant: "destructive" as const, className: "bg-destructive/10 text-destructive border-destructive/20" },
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

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.issue_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || ticket.issue_status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleViewTicket = (ticketId: number) => {
    navigate(`/support-tickets/${ticketId}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  const handleCreateTicket = async (data: {
    issue: string;
    type: string;
    description: string;
    property_id: number;
    assigned_to_id: number;
    priority: string;
    attachments: string[];
    created_by_id: number;
    issue_status: string;
  }) => {
    // TODO: Replace with actual API call
    console.log("Creating ticket:", data);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // TODO: Show success toast and refresh ticket list
  };

  return (
    <DashboardLayout showHeader={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
        <Card className="border-border/50">
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

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {typeOptions.map((option) => (
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockTickets.filter((t) => t.issue_status === "OPEN").length}
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
                  {mockTickets.filter((t) => t.issue_status === "IN_PROGRESS").length}
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
                  {mockTickets.filter((t) => t.issue_status === "RESOLVED").length}
                </p>
                <p className="text-sm text-muted-foreground">Resolved</p>
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
                  {mockTickets.filter((t) => t.priority === "CRITICAL").length}
                </p>
                <p className="text-sm text-muted-foreground">Critical</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets List */}
        {viewMode === "table" ? (
          <Card className="border-border/50">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[100px]">Code</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => {
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
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground line-clamp-1">
                              {ticket.issue}
                            </span>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {ticket.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{ticket.property_name}</span>
                          </div>
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
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{ticket.assigned_to_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(ticket.created_on), "MMM dd, yyyy")}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {ticket.attachments.length > 0 && (
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
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTickets.map((ticket) => {
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
                        {ticket.attachments.length > 0 && (
                          <span className="flex items-center text-xs">
                            <Paperclip className="h-3 w-3 mr-1" />
                            {ticket.attachments.length}
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
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

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
