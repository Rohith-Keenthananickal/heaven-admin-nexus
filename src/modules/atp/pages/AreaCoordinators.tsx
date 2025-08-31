import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/modules/dashboard/components/DashboardLayout"
import { Button } from "@/modules/shared/components/ui/button"
import { Input } from "@/modules/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card"
import { Badge } from "@/modules/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shared/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/shared/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/shared/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/modules/shared/components/ui/pagination"
import { Search, Plus, Filter, Eye, Edit, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu"

// Mock data based on the swagger model
const mockAtps = [
  {
    id: 1,
    email: "rajesh.kumar@email.com",
    phone_number: "+91-9876543210",
    full_name: "Rajesh Kumar",
    dob: "1985-06-15",
    status: "ACTIVE",
    created_at: "2024-01-15T10:30:00Z",
    area_coordinator_profile: {
      region: "North Delhi",
      assigned_properties: 15,
      approval_status: "APPROVED",
      approval_date: "2024-01-20T14:30:00Z",
      district: "Central Delhi",
      city: "New Delhi",
      state: "Delhi"
    }
  },
  {
    id: 2,
    email: "priya.sharma@email.com",
    phone_number: "+91-9876543211",
    full_name: "Priya Sharma",
    dob: "1990-03-22",
    status: "ACTIVE",
    created_at: "2024-02-10T09:15:00Z",
    area_coordinator_profile: {
      region: "Mumbai Central",
      assigned_properties: 22,
      approval_status: "PENDING",
      approval_date: null,
      district: "Mumbai",
      city: "Mumbai",
      state: "Maharashtra"
    }
  },
  {
    id: 3,
    email: "amit.patel@email.com",
    phone_number: "+91-9876543212",
    full_name: "Amit Patel",
    dob: "1988-11-08",
    status: "ACTIVE",
    created_at: "2024-01-25T16:45:00Z",
    area_coordinator_profile: {
      region: "Gujarat Region",
      assigned_properties: 18,
      approval_status: "APPROVED",
      approval_date: "2024-02-01T11:20:00Z",
      district: "Ahmedabad",
      city: "Ahmedabad",
      state: "Gujarat"
    }
  },
  {
    id: 4,
    email: "sunita.reddy@email.com",
    phone_number: "+91-9876543213",
    full_name: "Sunita Reddy",
    dob: "1992-07-30",
    status: "SUSPENDED",
    created_at: "2024-03-05T12:00:00Z",
    area_coordinator_profile: {
      region: "Bangalore South",
      assigned_properties: 12,
      approval_status: "REJECTED",
      approval_date: null,
      district: "Bangalore Urban",
      city: "Bangalore",
      state: "Karnataka"
    }
  },
  {
    id: 5,
    email: "vikram.singh@email.com",
    phone_number: "+91-9876543214",
    full_name: "Vikram Singh",
    dob: "1987-12-12",
    status: "ACTIVE",
    created_at: "2024-02-20T08:30:00Z",
    area_coordinator_profile: {
      region: "Rajasthan West",
      assigned_properties: 20,
      approval_status: "APPROVED",
      approval_date: "2024-02-25T15:45:00Z",
      district: "Jaipur",
      city: "Jaipur",
      state: "Rajasthan"
    }
  }
]

export default function AreaCoordinators() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [approvalFilter, setApprovalFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: "default",
      SUSPENDED: "destructive",
      BANNED: "destructive"
    } as const
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    )
  }

  const getApprovalBadge = (status: string) => {
    const variants = {
      APPROVED: "default",
      PENDING: "secondary",
      REJECTED: "destructive"
    } as const
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    )
  }

  const filteredAtps = mockAtps.filter(atp => {
    const matchesSearch = atp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         atp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         atp.area_coordinator_profile.region.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || atp.status === statusFilter
    const matchesApproval = approvalFilter === "all" || atp.area_coordinator_profile.approval_status === approvalFilter
    return matchesSearch && matchesStatus && matchesApproval
  })

  const totalPages = Math.ceil(filteredAtps.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAtps = filteredAtps.slice(startIndex, startIndex + itemsPerPage)

  return (
    <DashboardLayout 
      title="Area Coordinators" 
      action={
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New ATP
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or region..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Account Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="BANNED">Banned</SelectItem>
                </SelectContent>
              </Select>
              <Select value={approvalFilter} onValueChange={setApprovalFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Approval Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Approvals</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* ATP Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Area Coordinators ({filteredAtps.length})</CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ATP Details</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAtps.map((atp) => (
                  <TableRow key={atp.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src="" alt={atp.full_name} />
                          <AvatarFallback>
                            {atp.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{atp.full_name}</p>
                          <p className="text-sm text-muted-foreground">ID: {atp.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{atp.email}</p>
                        <p className="text-sm text-muted-foreground">{atp.phone_number}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{atp.area_coordinator_profile.region}</p>
                        <p className="text-sm text-muted-foreground">
                          {atp.area_coordinator_profile.city}, {atp.area_coordinator_profile.state}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <p className="font-bold text-lg">{atp.area_coordinator_profile.assigned_properties}</p>
                        <p className="text-xs text-muted-foreground">Properties</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(atp.status)}
                    </TableCell>
                    <TableCell>
                      {getApprovalBadge(atp.area_coordinator_profile.approval_status)}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {new Date(atp.created_at).toLocaleDateString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={() => navigate(`/area-coordinators/${atp.id}`)}>
                             <Eye className="w-4 h-4 mr-2" />
                             View Details
                           </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit ATP
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Suspend Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}