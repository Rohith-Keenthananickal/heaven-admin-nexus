import { useState } from "react"
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
  Home
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shared/components/ui/avatar"
import { HostAdvancedView } from "@/modules/hosts/components/HostAdvancedView"

const hosts = [
  {
    id: "H001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    status: "verified",
    joinDate: "2022-08-15",
    totalProperties: 8,
    totalEarnings: "₹2,45,600",
    lastActivity: "2024-01-22",
    location: "Mumbai, MH",
    rating: 4.8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    verificationStatus: "verified",
    responseRate: "98%"
  },
  {
    id: "H002", 
    name: "Meera Desai",
    email: "meera.desai@email.com",
    phone: "+91 87654 32109",
    status: "active",
    joinDate: "2023-01-22",
    totalProperties: 5,
    totalEarnings: "₹1,82,300",
    lastActivity: "2024-01-20",
    location: "Ahmedabad, GJ",
    rating: 4.6,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
    verificationStatus: "verified",
    responseRate: "95%"
  },
  {
    id: "H003",
    name: "Vikram Singh",
    email: "vikram.singh@email.com", 
    phone: "+91 76543 21098",
    status: "suspended",
    joinDate: "2021-11-08",
    totalProperties: 3,
    totalEarnings: "₹89,400",
    lastActivity: "2023-12-05",
    location: "Delhi, DL",
    rating: 3.2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    verificationStatus: "pending",
    responseRate: "45%"
  },
  {
    id: "H004",
    name: "Priya Iyer",
    email: "priya.iyer@email.com",
    phone: "+91 65432 10987", 
    status: "verified",
    joinDate: "2022-06-12",
    totalProperties: 12,
    totalEarnings: "₹4,12,800",
    lastActivity: "2024-01-23",
    location: "Bangalore, KA",
    rating: 4.9,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    verificationStatus: "verified",
    responseRate: "99%"
  },
  {
    id: "H005",
    name: "Arjun Gupta",
    email: "arjun.gupta@email.com",
    phone: "+91 54321 09876",
    status: "pending",
    joinDate: "2024-01-10",
    totalProperties: 2,
    totalEarnings: "₹45,600",
    lastActivity: "2024-01-18",
    location: "Pune, MH",
    rating: 4.1,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    verificationStatus: "pending",
    responseRate: "78%"
  }
]

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
  const [selectedHost, setSelectedHost] = useState<any>(null)
  const [isAdvancedViewOpen, setIsAdvancedViewOpen] = useState(false)

  const handleViewDetails = (host: any) => {
    setSelectedHost(host)
    setIsAdvancedViewOpen(true)
  }

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
              <Input placeholder="Search hosts by name, email, or phone..." className="pl-10" />
            </div>
            
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
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

          {/* Host Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">856</div>
                  <div className="text-sm text-muted-foreground">Total Hosts</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">642</div>
                  <div className="text-sm text-muted-foreground">Verified</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">89</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-info">₹18.7L</div>
                  <div className="text-sm text-muted-foreground">Total Earnings</div>
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
                {hosts.map((host) => (
                  <TableRow key={host.id}>
                    <TableCell>
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <HostAdvancedView
        isOpen={isAdvancedViewOpen}
        onClose={() => setIsAdvancedViewOpen(false)}
        host={selectedHost}
      />
    </DashboardLayout>
  )
}
