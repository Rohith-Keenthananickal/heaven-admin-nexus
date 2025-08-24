import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/modules/shared/components/ui/dialog"
import { Badge } from "@/modules/shared/components/ui/badge"
import { Button } from "@/modules/shared/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/shared/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shared/components/ui/avatar"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  CreditCard,
  Shield,
  Activity,
  MessageSquare,
  Edit,
  UserCheck,
  Ban
} from "lucide-react"

interface GuestAdvancedViewProps {
  isOpen: boolean
  onClose: () => void
  guest: any
}

export function GuestAdvancedView({ isOpen, onClose, guest }: GuestAdvancedViewProps) {
  if (!guest) return null

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

  const bookingHistory = [
    {
      id: "B001",
      property: "Luxury Villa Goa",
      dates: "Dec 15-20, 2023",
      amount: "₹42,500",
      status: "completed",
      rating: 5
    },
    {
      id: "B002", 
      property: "Mountain Resort Manali",
      dates: "Nov 8-12, 2023",
      amount: "₹24,800",
      status: "completed",
      rating: 4
    },
    {
      id: "B003",
      property: "Beach House Kerala", 
      dates: "Jan 20-25, 2024",
      amount: "₹39,000",
      status: "confirmed",
      rating: null
    }
  ]

  const activityLog = [
    { action: "Profile Updated", timestamp: "2024-01-22 10:30 AM", details: "Updated phone number" },
    { action: "Booking Created", timestamp: "2024-01-20 3:45 PM", details: "Booked Beach House Kerala" },
    { action: "Review Posted", timestamp: "2023-12-21 9:15 AM", details: "Reviewed Luxury Villa Goa" },
    { action: "Account Verified", timestamp: "2023-03-22 2:20 PM", details: "Email and phone verified" }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Guest Profile</span>
            <div className="flex gap-2">
              {getStatusBadge(guest.status)}
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {guest.status !== "suspended" ? (
                <Button size="sm" variant="destructive">
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend
                </Button>
              ) : (
                <Button size="sm" variant="default">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Reactivate
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={guest.avatar} alt={guest.name} />
                      <AvatarFallback>{guest.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-xl">{guest.name}</h3>
                      <p className="text-muted-foreground">Guest ID: {guest.id}</p>
                      <p className="text-sm text-muted-foreground">Member since {guest.joinDate}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{guest.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{guest.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{guest.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Last booking: {guest.lastBooking}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Guest Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{guest.totalBookings}</div>
                      <div className="text-sm text-muted-foreground">Total Bookings</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-success">{guest.totalSpent}</div>
                      <div className="text-sm text-muted-foreground">Total Spent</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-warning">4.8</div>
                      <div className="text-sm text-muted-foreground">Avg Rating</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-info">5.2</div>
                      <div className="text-sm text-muted-foreground">Avg Stay (days)</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Account Type</span>
                      <Badge variant="secondary">Premium Guest</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Loyalty Points</span>
                      <span className="font-medium">2,450 pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Referrals</span>
                      <span className="font-medium">3 users</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">UPI</div>
                    <div className="text-sm text-muted-foreground">Preferred Method</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">₹0</div>
                    <div className="text-sm text-muted-foreground">Outstanding</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">100%</div>
                    <div className="text-sm text-muted-foreground">Payment Success</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingHistory.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium">{booking.id}</span>
                        </div>
                        <div>
                          <div className="font-medium">{booking.property}</div>
                          <div className="text-sm text-muted-foreground">{booking.dates}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{booking.amount}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant={booking.status === "completed" ? "secondary" : "default"}>
                            {booking.status}
                          </Badge>
                          {booking.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{booking.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLog.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border-l-2 border-primary/20">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.action}</div>
                        <div className="text-sm text-muted-foreground">{activity.details}</div>
                        <div className="text-xs text-muted-foreground mt-1">{activity.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Support History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Booking Cancellation Request</div>
                      <div className="text-sm text-muted-foreground">
                        Ticket #T001 • Jan 18, 2024
                      </div>
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20">Resolved</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Payment Issue</div>
                      <div className="text-sm text-muted-foreground">
                        Ticket #T002 • Dec 22, 2023
                      </div>
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20">Resolved</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}