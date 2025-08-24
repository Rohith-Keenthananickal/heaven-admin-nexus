import { DashboardLayout } from "@/modules/dashboard/components/DashboardLayout"
import { StatsCard } from "@/modules/dashboard/components/StatsCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card"
import { Button } from "@/modules/shared/components/ui/button"
import { 
  Building2, 
  Users, 
  DollarSign, 
  Calendar,
  BarChart3,
  TrendingUp,
  Plus
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

const bookingData = [
  { month: 'Jan', bookings: 65 },
  { month: 'Feb', bookings: 70 },
  { month: 'Mar', bookings: 85 },
  { month: 'Apr', bookings: 75 },
  { month: 'May', bookings: 90 },
  { month: 'Jun', bookings: 95 },
  { month: 'Jul', bookings: 88 }
]

const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 61000 },
  { month: 'Apr', revenue: 58000 },
  { month: 'May', revenue: 67000 },
  { month: 'Jun', revenue: 71000 },
  { month: 'Jul', revenue: 69000 }
]

export default function Dashboard() {
  return (
    <DashboardLayout 
      title="Dashboard" 
      action={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Properties"
          value="1,245"
          change="+12% from last month"
          changeType="positive"
          icon={Building2}
          color="blue"
        />
        <StatsCard
          title="Total Bookings"
          value="3,678"
          change="+8% from last month"
          changeType="positive"
          icon={Calendar}
          color="green"
        />
        <StatsCard
          title="Revenue"
          value="₹4,25,000"
          change="+15% from last month"
          changeType="positive"
          icon={DollarSign}
          color="yellow"
        />
        <StatsCard
          title="Active Users"
          value="8,432"
          change="+5% from last month"
          changeType="positive"
          icon={Users}
          color="red"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Booking Trends
            </CardTitle>
            <p className="text-sm text-muted-foreground">Monthly booking percentage for all properties</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue by Month
            </CardTitle>
            <p className="text-sm text-muted-foreground">Monthly revenue statistics</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="revenue" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">New property listed</p>
                <p className="text-sm text-muted-foreground">Luxury Villa in Goa submitted for approval</p>
              </div>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Booking confirmed</p>
                <p className="text-sm text-muted-foreground">Mountain Resort booked for 5 nights</p>
              </div>
              <span className="text-sm text-muted-foreground">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Host verified</p>
                <p className="text-sm text-muted-foreground">Rajesh Kumar's account has been verified</p>
              </div>
              <span className="text-sm text-muted-foreground">6 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}