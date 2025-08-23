import { useState } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  MessageSquare
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GuestAdvancedView } from "@/components/GuestAdvancedView"

const guests = [
  {
    id: "G001",
    name: "Aarav Sharma",
    email: "aarav.sharma@email.com",
    phone: "+91 98765 43210",
    status: "verified",
    joinDate: "2023-01-15",
    totalBookings: 12,
    totalSpent: "₹85,400",
    lastBooking: "2024-01-20",
    location: "Mumbai, MH",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav"
  },
  {
    id: "G002", 
    name: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+91 87654 32109",
    status: "active",
    joinDate: "2023-03-22",
    totalBookings: 8,
    totalSpent: "₹52,600",
    lastBooking: "2024-01-18",
    location: "Ahmedabad, GJ",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
  },
  {
    id: "G003",
    name: "Rahul Singh",
    email: "rahul.singh@email.com", 
    phone: "+91 76543 21098",
    status: "suspended",
    joinDate: "2022-11-08",
    totalBookings: 5,
    totalSpent: "₹28,900",
    lastBooking: "2023-12-05",
    location: "Delhi, DL",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
  },
  {
    id: "G004",
    name: "Anita Iyer",
    email: "anita.iyer@email.com",
    phone: "+91 65432 10987", 
    status: "verified",
    joinDate: "2023-06-12",
    totalBookings: 15,
    totalSpent: "₹1,12,300",
    lastBooking: "2024-01-22",
    location: "Bangalore, KA",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anita"
  },
  {
    id: "G005",
    name: "Karan Gupta",
    email: "karan.gupta@email.com",
    phone: "+91 54321 09876",
    status: "pending",
    joinDate: "2024-01-10",
    totalBookings: 2,
    totalSpent: "₹15,800",
    lastBooking: "2024-01-15",
    location: "Pune, MH",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karan"
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

export default function CrmGuest() {
  const [selectedGuest, setSelectedGuest] = useState<any>(null)
  const [isAdvancedViewOpen, setIsAdvancedViewOpen] = useState(false)

  const handleViewDetails = (guest: any) => {
    setSelectedGuest(guest)
    setIsAdvancedViewOpen(true)
  }

  return (
    <DashboardLayout
      title="CRM / Guest Management"
      action={
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Guests
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Guest
          </Button>
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Guest Database</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage guest profiles, bookings, and customer relationships.
          </p>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search guests by name, email, or phone..." className="pl-10" />
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

          {/* Guest Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1,247</div>
                  <div className="text-sm text-muted-foreground">Total Guests</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">892</div>
                  <div className="text-sm text-muted-foreground">Verified</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">156</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-info">₹24.5L</div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Guests Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Booking</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={guest.avatar} alt={guest.name} />
                          <AvatarFallback>{guest.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{guest.name}</div>
                          <div className="text-sm text-muted-foreground">{guest.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{guest.email}</div>
                        <div className="text-sm text-muted-foreground">{guest.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{guest.location}</TableCell>
                    <TableCell>{getStatusBadge(guest.status)}</TableCell>
                    <TableCell className="font-medium">{guest.totalBookings}</TableCell>
                    <TableCell className="font-medium">{guest.totalSpent}</TableCell>
                    <TableCell>{guest.lastBooking}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(guest)}>
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
                          {guest.status === "pending" && (
                            <DropdownMenuItem className="text-success">
                              <UserCheck className="h-4 w-4 mr-2" />
                              Verify Account
                            </DropdownMenuItem>
                          )}
                          {guest.status !== "suspended" ? (
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

      <GuestAdvancedView
        isOpen={isAdvancedViewOpen}
        onClose={() => setIsAdvancedViewOpen(false)}
        guest={selectedGuest}
      />
    </DashboardLayout>
  )
}