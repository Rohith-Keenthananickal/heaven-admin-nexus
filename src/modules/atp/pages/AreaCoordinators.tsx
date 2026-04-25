import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/modules/dashboard/components/DashboardLayout"
import { Button } from "@/modules/shared/components/ui/button"
import { Input } from "@/modules/shared/components/ui/input"
import { Card, CardContent, CardHeader } from "@/modules/shared/components/ui/card"
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
import { Search, Filter, Loader2 } from "lucide-react"
import AtpService from "../services/atp.service"
import { GetAllAreaCoordinatorsPayload } from "../models/atp.models"
import { User } from "@/modules/auth/models/auth.models"

export default function AreaCoordinators() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [approvalFilter, setApprovalFilter] = useState("all")
  const [atps, setAtps] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Fetch area coordinators on component mount
  useEffect(() => {
    fetchAreaCoordinators()
  }, [])

  // Fetch area coordinators when filters change
  useEffect(() => {
    fetchAreaCoordinators()
  }, [searchTerm, statusFilter, approvalFilter])

  const fetchAreaCoordinators = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const payload: GetAllAreaCoordinatorsPayload = {
        user_type: ["AREA_COORDINATOR"],
        search_query: searchTerm || undefined,
        status: statusFilter === "all" ? undefined : [statusFilter as unknown as "ACTIVE" | "BLOCKED" | "DELETED"],
        approval_status: approvalFilter === "all" ? undefined : [approvalFilter],
        limit: 100 // Set a reasonable limit
      }

      const response = await AtpService.getAllAreaCoordinators(payload)
      
      if (response.status && response.data) {
        // Handle both array and paginated response
        if (Array.isArray(response.data)) {
          setAtps(response.data)
        } else if (response.data && Array.isArray(response.data)) {
          setAtps(response.data)
        } else {
          setAtps([])
        }
      } else {
        setError(response.errMessage || "Failed to fetch area coordinators")
        setAtps([])
      }
    } catch (err) {
      console.error("Error fetching area coordinators:", err)
      setError("An error occurred while fetching area coordinators")
      setAtps([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
      case "INACTIVE":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Suspended</Badge>
      case "DELETED":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Banned</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>
      case "PENDING":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>
      case "REJECTED":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredAtps = atps.filter(atp => {
    const matchesSearch = atp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         atp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (atp.area_coordinator_profile?.region?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || atp.status === statusFilter
    const matchesApproval = approvalFilter === "all" || atp.area_coordinator_profile?.approval_status === approvalFilter
    return matchesSearch && matchesStatus && matchesApproval
  })

  const totalItems = filteredAtps.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedAtps = filteredAtps.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, approvalFilter, pageSize])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  if (loading && atps.length === 0) {
    return (
      <DashboardLayout title="Area Coordinators">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading area coordinators...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error && atps.length === 0) {
    return (
      <DashboardLayout title="Area Coordinators">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchAreaCoordinators} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title="Area Coordinators" 
      // action={
      //   <Button>
      //     <Plus className="w-4 h-4 mr-2" />
      //     Add New ATP
      //   </Button>
      // }
    >
      <Card className="h-[calc(100vh-8.5rem)] flex flex-col">
        <CardHeader>
          {/* <CardTitle>Area Coordinators</CardTitle> */}
          <p className="text-sm text-muted-foreground">
            Manage all area coordinators from one place.
          </p>
        </CardHeader>
        
        <CardContent className="flex flex-col min-h-0">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="BANNED">Banned</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={approvalFilter} onValueChange={setApprovalFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Approvals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Approvals</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ATP Table */}
          <div className="border rounded-lg flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow>
                  <TableHead>ATP Details</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Refreshing data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedAtps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No area coordinators found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAtps.map((atp) => (
                    <TableRow key={atp.id} onClick={() => navigate(`/area-coordinators/${atp.id}`)} className="cursor-pointer">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={atp.profile_image} alt={atp.full_name} />
                            <AvatarFallback>
                              {atp.full_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{atp.full_name}</div>
                            <div className="text-sm text-muted-foreground">ID: {atp.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{atp.email}</div>
                          <div className="text-sm text-muted-foreground">{atp.phone_number}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{atp.area_coordinator_profile?.region || "N/A"}</div>
                          <div className="text-sm text-muted-foreground">
                            {atp.area_coordinator_profile?.city || "N/A"}, {atp.area_coordinator_profile?.state || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-bold text-lg">{atp.area_coordinator_profile?.assigned_properties || 0}</div>
                          <div className="text-xs text-muted-foreground">Properties</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(atp.status)}
                      </TableCell>
                      <TableCell>
                        {getApprovalBadge(atp.area_coordinator_profile?.approval_status || "PENDING")}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(atp.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                     
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {totalItems === 0 ? 0 : startIndex + 1}-{endIndex} of {totalItems}
            </p>

            <div className="flex items-center gap-2">
              <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="20">20 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safeCurrentPage <= 1 || loading}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground min-w-[90px] text-center">
                Page {safeCurrentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage >= totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}