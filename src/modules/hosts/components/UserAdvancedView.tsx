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
  Shield,
  Activity,
  Building2,
  Edit,
  UserCheck,
  Ban,
  DollarSign
} from "lucide-react"

interface UserAdvancedViewProps {
  isOpen: boolean
  onClose: () => void
  user: any
}

export function UserAdvancedView({ isOpen, onClose, user }: UserAdvancedViewProps) {
  if (!user) return null

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

  const properties = [
    {
      id: "P001",
      name: "Luxury Villa Goa",
      status: "active",
      bookings: 45,
      revenue: "₹3,82,500"
    },
    {
      id: "P002", 
      name: "Mountain Resort Manali",
      status: "active",
      bookings: 32,
      revenue: "₹1,98,400"
    },
    {
      id: "P003",
      name: "Beach House Kerala",
      status: "pending",
      bookings: 0,
      revenue: "₹0"
    }
  ]

  const recentTransactions = [
    { date: "Jan 22, 2024", amount: "₹8,500", type: "Payout", status: "completed" },
    { date: "Jan 20, 2024", amount: "₹6,200", type: "Payout", status: "completed" },
    { date: "Jan 18, 2024", amount: "₹7,800", type: "Payout", status: "processing" }
  ]

  const performanceMetrics = [
    { label: "Response Rate", value: "98%", color: "text-success" },
    { label: "Response Time", value: "< 1hr", color: "text-success" },
    { label: "Acceptance Rate", value: "85%", color: "text-warning" },
    { label: "Cancellation Rate", value: "2%", color: "text-success" }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Host Profile</span>
            <div className="flex gap-2">
              {getStatusBadge(user.status)}
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {user.status !== "suspended" ? (
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
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Host Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                      <AvatarFallback>{user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-xl">{user.name}</h3>
                      <p className="text-muted-foreground">Host ID: {user.id}</p>
                      <p className="text-sm text-muted-foreground">Host since {user.joinDate}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Last active: {user.lastActive}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Host Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{user.totalProperties}</div>
                      <div className="text-sm text-muted-foreground">Properties</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-success">{user.totalBookings}</div>
                      <div className="text-sm text-muted-foreground">Total Bookings</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-warning">4.9</div>
                      <div className="text-sm text-muted-foreground">Host Rating</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-info">{user.totalEarnings}</div>
                      <div className="text-sm text-muted-foreground">Total Earnings</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Host Level</span>
                      <Badge className="bg-primary/10 text-primary border-primary/20">Super Host</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Verification</span>
                      <span className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-success" />
                        <span className="text-sm text-success">Verified</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Languages</span>
                      <span className="text-sm">English, Hindi</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Host Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Host Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{property.name}</div>
                          <div className="text-sm text-muted-foreground">{property.id}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{property.revenue}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant={property.status === "active" ? "secondary" : "default"}>
                            {property.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {property.bookings} bookings
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{user.totalEarnings}</div>
                    <div className="text-sm text-muted-foreground">Total Earnings</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">₹85,400</div>
                    <div className="text-sm text-muted-foreground">This Month</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">₹12,600</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{transaction.type}</div>
                        <div className="text-sm text-muted-foreground">{transaction.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{transaction.amount}</div>
                        <Badge variant={transaction.status === "completed" ? "secondary" : "default"}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Host Metrics</h4>
                    <div className="space-y-3">
                      {performanceMetrics.map((metric, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{metric.label}</span>
                          <span className={`font-medium ${metric.color}`}>{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Booking Insights</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Avg Booking Value</span>
                        <span className="font-medium">₹7,200</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Repeat Guests</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Peak Season</span>
                        <span className="font-medium">Dec-Jan</span>
                      </div>
                    </div>
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