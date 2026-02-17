import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/modules/dashboard/components/DashboardLayout"
import { Button } from "@/modules/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card"
import { Badge } from "@/modules/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shared/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/shared/components/ui/tabs"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/shared/components/ui/table"
import { 
  ArrowLeft,
  Star, 
  Home, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Shield,
  TrendingUp,
  MessageSquare,
  Settings,
  Edit,
  Ban,
  UserCheck,
  Download,
  Eye,
  Loader2
} from "lucide-react"
import hostService from "@/modules/hosts/services/host.service"
import { User } from "@/modules/auth/models/auth.models"

const mockProperties = [
  {
    id: "P001",
    name: "Luxury Villa in Bandra",
    type: "Villa",
    location: "Bandra West, Mumbai",
    status: "Active",
    price: "₹25,000/night",
    rating: 4.8,
    totalBookings: 45,
    totalEarnings: "₹12,45,000",
    lastBooking: "2024-01-20"
  },
  {
    id: "P002",
    name: "Modern Apartment in Andheri",
    type: "Apartment",
    location: "Andheri West, Mumbai",
    status: "Active",
    price: "₹8,500/night",
    rating: 4.6,
    totalBookings: 32,
    totalEarnings: "₹6,78,000",
    lastBooking: "2024-01-18"
  },
  {
    id: "P003",
    name: "Beach House in Juhu",
    type: "Beach House",
    location: "Juhu, Mumbai",
    status: "Maintenance",
    price: "₹35,000/night",
    rating: 4.9,
    totalBookings: 28,
    totalEarnings: "₹9,80,000",
    lastBooking: "2024-01-15"
  }
]

const mockReviews = [
  {
    id: "R001",
    guestName: "Amit Patel",
    rating: 5,
    comment: "Excellent host! Very responsive and the property was exactly as described.",
    date: "2024-01-20",
    propertyName: "Luxury Villa in Bandra"
  },
  {
    id: "R002",
    guestName: "Priya Sharma",
    rating: 4,
    comment: "Great experience overall. The host was helpful and the place was clean.",
    date: "2024-01-18",
    propertyName: "Modern Apartment in Andheri"
  },
  {
    id: "R003",
    guestName: "Rahul Kumar",
    rating: 5,
    comment: "Amazing property and fantastic host. Highly recommended!",
    date: "2024-01-15",
    propertyName: "Beach House in Juhu"
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "verified":
    case "ACTIVE":
      return <Badge className="bg-success/10 text-success border-success/20">Verified</Badge>
    case "active":
      return <Badge className="bg-primary/10 text-primary border-primary/20">Active</Badge>
    case "suspended":
    case "BLOCKED":
    case "BANNED":
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Suspended</Badge>
    case "pending":
    case "PENDING":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getPropertyStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
    case "Maintenance":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Maintenance</Badge>
    case "Inactive":
      return <Badge className="bg-muted/10 text-muted border-muted/20">Inactive</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

// Helper function to map User to display format
const mapUserToDisplay = (user: User) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toISOString().split('T')[0]
  }

  const mapStatus = (status: string) => {
    const statusLower = status?.toLowerCase() || 'active'
    if (statusLower === 'active') return 'verified'
    if (statusLower === 'blocked' || statusLower === 'banned') return 'suspended'
    if (statusLower === 'deleted') return 'suspended'
    return statusLower
  }

  const getLocation = () => {
    if (user.area_coordinator_profile?.city && user.area_coordinator_profile?.state) {
      return `${user.area_coordinator_profile.city}, ${user.area_coordinator_profile.state}`
    }
    return "N/A"
  }

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
    totalProperties: user.host_profile?.experience_years || 0,
    totalEarnings: "₹0",
    lastActivity: formatDate(user.updated_at),
    location: getLocation(),
    rating: 4.5,
    avatar: getAvatar(),
    verificationStatus: user.area_coordinator_profile?.approval_status?.toLowerCase() === 'approved' ? 'verified' : 'pending',
    responseRate: "95%",
  }
}

export default function HostAdvancedView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")
  const [host, setHost] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHost = useCallback(async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await hostService.getHostById(id)
      
      if (response.status && response.data) {
        setHost(response.data)
      } else {
        setError(response.errMessage || "Failed to fetch host details")
      }
    } catch (err) {
      console.error("Error fetching host:", err)
      setError("An error occurred while fetching host details")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchHost()
    }
  }, [id, fetchHost])

  if (loading) {
    return (
      <DashboardLayout
        title="Host Details"
        action={
          <Button variant="outline" onClick={() => navigate('/hosts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hosts
          </Button>
        }
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-4">Loading host details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !host) {
    return (
      <DashboardLayout
        title="Host Details"
        action={
          <Button variant="outline" onClick={() => navigate('/hosts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hosts
          </Button>
        }
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-destructive">{error || "Host not found"}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/hosts')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hosts
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  const hostDisplay = mapUserToDisplay(host)
  const hostName = hostDisplay.name
  const hostAvatar = hostDisplay.avatar
  const hostId = hostDisplay.id
  const initials = hostName && hostName !== 'N/A' 
    ? hostName.split(' ').map((n: string) => n[0]).join('').toUpperCase() 
    : 'H'

  return (
    <DashboardLayout
      title="Host Details"
      action={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/hosts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hosts
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={hostAvatar} alt={hostName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-2xl font-semibold">{hostName}</div>
                <div className="text-sm text-muted-foreground">Host ID: {hostId}</div>
                <div className="mt-2">{getStatusBadge(hostDisplay.status)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Host Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Host Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">{hostDisplay.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Phone</div>
                      <div className="text-sm text-muted-foreground">{hostDisplay.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">{hostDisplay.location}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Member Since</div>
                      <div className="text-sm text-muted-foreground">{hostDisplay.joinDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Verification Status</div>
                      <div>{getStatusBadge(hostDisplay.verificationStatus)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Response Rate</div>
                      <div className="text-sm text-muted-foreground">{hostDisplay.responseRate}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{hostDisplay.totalProperties}</div>
                    <div className="text-sm text-muted-foreground">Total Properties</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-success">{hostDisplay.totalEarnings}</div>
                    <div className="text-sm text-muted-foreground">Total Earnings</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="text-2xl font-bold">{hostDisplay.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-info">{hostDisplay.lastActivity}</div>
                    <div className="text-sm text-muted-foreground">Last Activity</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                  {hostDisplay.status === "pending" && (
                    <Button size="sm">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Verify Account
                    </Button>
                  )}
                  {hostDisplay.status !== "suspended" ? (
                    <Button variant="destructive" size="sm">
                      <Ban className="h-4 w-4 mr-2" />
                      Suspend Account
                    </Button>
                  ) : (
                    <Button size="sm">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Reactivate Account
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Properties ({mockProperties.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Bookings</TableHead>
                        <TableHead>Earnings</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockProperties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{property.name}</div>
                              <div className="text-sm text-muted-foreground">{property.id}</div>
                            </div>
                          </TableCell>
                          <TableCell>{property.type}</TableCell>
                          <TableCell>{property.location}</TableCell>
                          <TableCell>{getPropertyStatusBadge(property.status)}</TableCell>
                          <TableCell className="font-medium">{property.price}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span>{property.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell>{property.totalBookings}</TableCell>
                          <TableCell className="font-medium">{property.totalEarnings}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Guest Reviews ({mockReviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} 
                              />
                            ))}
                          </div>
                          <div>
                            <div className="font-medium">{review.guestName}</div>
                            <div className="text-sm text-muted-foreground">{review.propertyName}</div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{review.date}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Monthly Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">January 2024</span>
                        <span className="font-medium">₹2,45,600</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">December 2023</span>
                        <span className="font-medium">₹2,18,900</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">November 2023</span>
                        <span className="font-medium">₹1,95,400</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Property Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Luxury Villa</span>
                        <span className="font-medium">₹12,45,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Modern Apartment</span>
                        <span className="font-medium">₹6,78,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Beach House</span>
                        <span className="font-medium">₹9,80,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
