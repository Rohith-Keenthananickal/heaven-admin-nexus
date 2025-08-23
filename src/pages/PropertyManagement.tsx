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
  Trash,
  Check,
  X
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const properties = [
  {
    id: "P001",
    name: "Luxury Villa Goa",
    host: "Rajesh Kumar",
    location: "Goa, India",
    status: "active",
    price: "₹8,500/night",
    bookings: 45,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop"
  },
  {
    id: "P002", 
    name: "Mountain Resort Manali",
    host: "Priya Sharma",
    location: "Manali, HP",
    status: "pending",
    price: "₹6,200/night",
    bookings: 32,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=100&h=100&fit=crop"
  },
  {
    id: "P003",
    name: "Beach House Kerala",
    host: "Mohammed Ali",
    location: "Kerala, India", 
    status: "rejected",
    price: "₹7,800/night",
    bookings: 28,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1520637836862-4d197d17c13a?w=100&h=100&fit=crop"
  },
  {
    id: "P004",
    name: "Heritage Haveli Rajasthan",
    host: "Arjun Singh",
    location: "Jaipur, RJ",
    status: "flagged",
    price: "₹12,000/night", 
    bookings: 67,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=100&h=100&fit=crop"
  },
  {
    id: "P005",
    name: "City Apartment Mumbai",
    host: "Sneha Patel",
    location: "Mumbai, MH",
    status: "active",
    price: "₹4,500/night",
    bookings: 89,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&h=100&fit=crop"
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
    case "pending":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>
    case "rejected":
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>
    case "flagged":
      return <Badge className="bg-info/10 text-info border-info/20">Flagged</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function PropertyManagement() {
  return (
    <DashboardLayout
      title="Property Management"
      action={
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage all properties from one place.
          </p>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search properties..." className="pl-10" />
            </div>
            
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="goa">Goa</SelectItem>
                  <SelectItem value="kerala">Kerala</SelectItem>
                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="himachal">Himachal Pradesh</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Properties Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={property.image} alt={property.name} />
                          <AvatarFallback>{property.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{property.name}</div>
                          <div className="text-sm text-muted-foreground">{property.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{property.host}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>{getStatusBadge(property.status)}</TableCell>
                    <TableCell className="font-medium">{property.price}</TableCell>
                    <TableCell>{property.bookings}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{property.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Property
                          </DropdownMenuItem>
                          {property.status === "pending" && (
                            <>
                              <DropdownMenuItem className="text-success">
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
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
    </DashboardLayout>
  )
}