import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/modules/shared/components/ui/dialog"
import { Badge } from "@/modules/shared/components/ui/badge"
import { Button } from "@/modules/shared/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/shared/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shared/components/ui/avatar"
import { 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  Camera, 
  Wifi, 
  Car, 
  Utensils,
  Check,
  X,
  Edit
} from "lucide-react"

interface PropertyAdvancedViewProps {
  isOpen: boolean
  onClose: () => void
  property: any
}

export function PropertyAdvancedView({ isOpen, onClose, property }: PropertyAdvancedViewProps) {
  if (!property) return null

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

  const amenities = [
    { icon: Wifi, name: "Free WiFi", available: true },
    { icon: Car, name: "Parking", available: true },
    { icon: Utensils, name: "Kitchen", available: false },
    { icon: Camera, name: "Security Cameras", available: true }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Property Details</span>
            <div className="flex gap-2">
              {getStatusBadge(property.status)}
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="host">Host Details</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Property Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{property.name}</h3>
                    <p className="text-muted-foreground">{property.location}</p>
                    <p className="text-2xl font-bold text-primary mt-2">{property.price}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{property.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{property.bookings} bookings</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Amenities & Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                        <amenity.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">{amenity.name}</span>
                        {amenity.available ? (
                          <Check className="h-4 w-4 text-success ml-auto" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Property Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{property.bookings}</div>
                    <div className="text-sm text-muted-foreground">Total Bookings</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-success">95%</div>
                    <div className="text-sm text-muted-foreground">Occupancy Rate</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-warning">₹2.1L</div>
                    <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-info">12</div>
                    <div className="text-sm text-muted-foreground">Avg Stay (days)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="host" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Host Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${property.host}`} />
                    <AvatarFallback>{property.host.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{property.host}</h3>
                    <p className="text-muted-foreground">Host since March 2021</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>4.9 Host Rating</span>
                      </div>
                      <div>142 Reviews</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-xl font-bold">8</div>
                    <div className="text-sm text-muted-foreground">Properties</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-xl font-bold">98%</div>
                    <div className="text-sm text-muted-foreground">Response Rate</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-xl font-bold">&lt; 1hr</div>
                    <div className="text-sm text-muted-foreground">Response Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((booking) => (
                    <div key={booking} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>G{booking}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Guest {booking}</div>
                          <div className="text-sm text-muted-foreground">
                            Jan {15 + booking} - Jan {20 + booking}, 2024
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{8500 * (booking + 2)}</div>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Guest Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>G{review}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">Guest {review}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>4.{review + 6}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "Amazing property with great amenities. The host was very responsive and helpful throughout our stay."
                      </p>
                      <div className="text-xs text-muted-foreground mt-2">
                        Jan {10 + review}, 2024
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}