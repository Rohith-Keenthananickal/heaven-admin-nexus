import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/modules/dashboard/components/DashboardLayout"
import { Button } from "@/modules/shared/components/ui/button"
import { Input } from "@/modules/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card"
import { Badge } from "@/modules/shared/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/shared/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/shared/components/ui/select"
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  MoreVertical,
  Eye,
  Edit,
  Ban,
  UserCheck,
  MessageSquare,
  Star,
  Home,
  Loader2
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shared/components/ui/avatar"
import hostService from "@/modules/hosts/services/host.service"
import { GetAllAreaCoordinatorsPayload } from "@/modules/atp/models/atp.models"
import { User } from "@/modules/auth/models/auth.models"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/modules/shared/components/ui/pagination"
import { Pagination as PaginationType } from "@/modules/shared/models/api.models"

// Interface for mapped host data used in UI
interface HostDisplayData {
  id: string
  name: string
  email: string
  phone: string
  status: string
  joinDate: string
  totalProperties: number
  totalEarnings: string
  lastActivity: string
  location: string
  rating: number
  avatar: string
  verificationStatus: string
  responseRate: string
  user: User // Keep reference to original user data
}

// Helper function to map User to HostDisplayData
const mapUserToHostDisplay = (user: User): HostDisplayData => {
  // Format date from ISO string to YYYY-MM-DD
  const formatDate = (dateString: string) => {
    if (!dateString) return new Date().toISOString().split('T')[0]
    return new Date(dateString).toISOString().split('T')[0]
  }

  // Map status from API format to UI format
  const mapStatus = (status: string) => {
    const statusLower = status?.toLowerCase() || 'active'
    if (statusLower === 'active') return 'verified'
    if (statusLower === 'blocked' || statusLower === 'banned') return 'suspended'
    if (statusLower === 'deleted') return 'suspended'
    return statusLower
  }

  // Get location from area_coordinator_profile or use default
  const getLocation = () => {
    if (user.area_coordinator_profile?.city && user.area_coordinator_profile?.state) {
      return `${user.area_coordinator_profile.city}, ${user.area_coordinator_profile.state}`
    }
    return "N/A"
  }

  // Generate avatar URL from profile_image or use dicebear
  const getAvatar = () => {
    if (user.profile_image) return user.profile_image
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name || user.id}`
  }

  return {
    id: `H${String(user.id).padStart(3, '0')}`,
    name: user.full_name || 'N/A',
    email: user.email || 'N/A',
    phone: user.phone_number || 'N/A',
    status: mapStatus(user.status),
    joinDate: formatDate(user.created_at),
    totalProperties: user.host_profile?.experience_years || 0, // Using experience_years as placeholder
    totalEarnings: "₹0", // Placeholder - would need additional API call
    lastActivity: formatDate(user.updated_at),
    location: getLocation(),
    rating: 4.5, // Placeholder - would need additional API call
    avatar: getAvatar(),
    verificationStatus: user.area_coordinator_profile?.approval_status?.toLowerCase() === 'approved' ? 'verified' : 'pending',
    responseRate: "95%", // Placeholder - would need additional API call
    user: user
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "verified":
      return <Badge className="bg-success/10 text-success border-success/20">Verified</Badge>
    case "active":
      return <Badge className="bg-primary/10 text-primary border-primary/20">Active</Badge>
    case "suspended":
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Suspended</Badge>
    case "pending":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getVerificationBadge = (status: string) => {
  switch (status) {
    case "verified":
      return <Badge className="bg-success/10 text-success border-success/20">✓ Verified</Badge>
    case "pending":
      return <Badge className="bg-warning/10 text-warning border-warning/20">⏳ Pending</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function HostsListing() {
  const navigate = useNavigate()
  const [hosts, setHosts] = useState<HostDisplayData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  })

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  // Fetch hosts when filters or page change
  useEffect(() => {
    fetchHosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, currentPage])

  const fetchHosts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const payload: GetAllAreaCoordinatorsPayload = {
        user_type: ["HOST"],
        search_query: searchTerm || undefined,
        status: statusFilter === "all" ? undefined : [statusFilter.toUpperCase()] as any,
        page: currentPage,
        limit: 10
      }

      const response = await hostService.getAllHosts(payload)
      
      if (response.status && response.data) {
        // Handle both array and paginated response
        let users: User[] = []
        if (Array.isArray(response.data)) {
          users = response.data
        } else {
          users = []
        }

        // Map User objects to HostDisplayData
        const mappedHosts = users.map(mapUserToHostDisplay)
        setHosts(mappedHosts)

        // Extract pagination from response if available
        // The API might return pagination even if the type doesn't reflect it
        if ((response as any).pagination) {
          setPagination((response as any).pagination)
        } else {
          // If no pagination data, create default pagination
          setPagination({
            page: currentPage,
            limit: 10,
            total: users.length,
            total_pages: Math.ceil(users.length / 10),
            has_next: false,
            has_prev: currentPage > 1,
          })
        }
      } else {
        setError(response.errMessage || "Failed to fetch hosts")
        setHosts([])
      }
    } catch (err) {
      console.error("Error fetching hosts:", err)
      setError("An error occurred while fetching hosts")
      setHosts([])
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of table when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewDetails = (host: HostDisplayData) => {
    // Navigate to host detail page using the user ID
    navigate(`/hosts/${host.user.id}`)
  }

  // Filter hosts by location (client-side filtering)
  const filteredHosts = hosts.filter(host => {
    if (locationFilter === "all") return true
    return host.location.toLowerCase().includes(locationFilter.toLowerCase())
  })

  return (
    <DashboardLayout
      title="Host Management"
      action={
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Hosts
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Host
          </Button>
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Host Database</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage host profiles, properties, and performance metrics.
          </p>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search hosts by name, email, or phone..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
              {error}
            </div>
          )}

          {/* Host Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{hosts.length}</div>
                  <div className="text-sm text-muted-foreground">Total Hosts</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {hosts.filter(h => h.verificationStatus === 'verified').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Verified</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">
                    {hosts.filter(h => h.status === 'pending' || h.verificationStatus === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-info">
                    {hosts.filter(h => h.status === 'suspended').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Suspended</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hosts Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Host</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Total Earnings</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && hosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">Loading hosts...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredHosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <p className="text-sm text-muted-foreground">No hosts found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHosts.map((host) => (
                  <TableRow key={host.id}>
                    <TableCell onClick={() => handleViewDetails(host)} className="cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={host.avatar} alt={host.name} />
                          <AvatarFallback>{host.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{host.name}</div>
                          <div className="text-sm text-muted-foreground">{host.id}</div>
                          <div className="text-xs text-muted-foreground">{getVerificationBadge(host.verificationStatus)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{host.email}</div>
                        <div className="text-sm text-muted-foreground">{host.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{host.location}</TableCell>
                    <TableCell>{getStatusBadge(host.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{host.totalProperties}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{host.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{host.totalEarnings}</TableCell>
                    <TableCell>{host.lastActivity}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(host)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          {host.status === "pending" && (
                            <DropdownMenuItem className="text-success">
                              <UserCheck className="h-4 w-4 mr-2" />
                              Verify Account
                            </DropdownMenuItem>
                          )}
                          {host.status !== "suspended" ? (
                            <DropdownMenuItem className="text-destructive">
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend Account
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-success">
                              <UserCheck className="h-4 w-4 mr-2" />
                              Reactivate Account
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && !error && pagination.total_pages > 0 && (
            <div className="flex justify-center mt-6">
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
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
