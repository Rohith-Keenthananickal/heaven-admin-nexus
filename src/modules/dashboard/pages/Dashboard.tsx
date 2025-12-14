import { DashboardLayout } from "@/modules/dashboard/components/DashboardLayout"
import { StatsCard } from "@/modules/dashboard/components/StatsCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card"
import { Button } from "@/modules/shared/components/ui/button"
import { 
  Building2, 
  Users, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Plus,
  FileCheck,
  UserCheck,
  Ticket,
  Flag,
  Building,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  MessageSquare,
  Wallet
} from "lucide-react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts'

const bookingData = [
  { month: 'JAN', bookings: 100 },
  { month: 'FEB', bookings: 200 },
  { month: 'MAR', bookings: 180 },
  { month: 'APR', bookings: 320 },
  { month: 'MAY', bookings: 200 },
  { month: 'JUN', bookings: 380 },
  { month: 'JUL', bookings: 450 },
  { month: 'AUG', bookings: 350 },
  { month: 'SEP', bookings: 420 },
  { month: 'OCT', bookings: 150 },
  { month: 'NOV', bookings: 380 },
  { month: 'DEC', bookings: 300 }
]


export default function Dashboard() {
  return (
    <DashboardLayout 
      title="Dashboard" 
      
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

      {/* Chart and Quick Actions */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Chart - 70% width */}
        <Card className="flex-1 lg:w-[70%]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Bookings
            </CardTitle>
            <p className="text-sm text-muted-foreground">Booking trends across all properties</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart 
                data={bookingData} 
                margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e5e7eb" 
                  horizontal={true}
                  vertical={false}
                />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[100, 500]}
                  ticks={[100, 200, 300, 400, 500]}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const monthNames: { [key: string]: string } = {
                        'JAN': 'January', 'FEB': 'February', 'MAR': 'March', 'APR': 'April',
                        'MAY': 'May', 'JUN': 'June', 'JUL': 'July', 'AUG': 'August',
                        'SEP': 'September', 'OCT': 'October', 'NOV': 'November', 'DEC': 'December'
                      };
                      return (
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                          <p className="text-xs text-gray-500 mb-1">{monthNames[data.month] || data.month}</p>
                          <p className="text-lg font-bold text-gray-900">₹{data.bookings.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fill="url(#colorBookings)"
                  dot={{ fill: '#10b981', r: 0 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions - 30% width */}
        <Card className="lg:w-[30%]">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                className="h-auto flex-col gap-1.5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {/* ATP action */}}
              >
                <Users className="h-4 w-4" />
                <span className="text-xs font-medium">ATP</span>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto flex-col gap-1.5 py-2.5"
                onClick={() => {/* Hosts action */}}
              >
                <UserCheck className="h-4 w-4" />
                <span className="text-xs font-medium">Hosts</span>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto flex-col gap-1.5 py-2.5"
                onClick={() => {/* Properties action */}}
              >
                <Building2 className="h-4 w-4" />
                <span className="text-xs font-medium">Properties</span>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto flex-col gap-1.5 py-2.5"
                onClick={() => {/* New Service Ticket action */}}
              >
                <Plus className="h-4 w-4" />
                <span className="text-xs font-medium">New Service Ticket</span>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto flex-col gap-1.5 py-2.5"
                onClick={() => {/* Payout action */}}
              >
                <Wallet className="h-4 w-4" />
                <span className="text-xs font-medium">Payout</span>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto flex-col gap-1.5 py-2.5"
                onClick={() => {/* Broadcast message action */}}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs font-medium">Broadcast message</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Properties Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
              Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  <span className="text-sm text-muted-foreground">Total</span>
                </div>
                <span className="text-lg font-semibold">20</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-muted-foreground">Approved</span>
                </div>
                <span className="text-lg font-semibold text-green-600">10</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <span className="text-lg font-semibold text-yellow-600">10</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ATP Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-purple-600" />
              ATP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                  <span className="text-sm text-muted-foreground">Total</span>
                </div>
                <span className="text-lg font-semibold">100</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <span className="text-lg font-semibold text-yellow-600">50</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-muted-foreground">Approved</span>
                </div>
                <span className="text-lg font-semibold text-green-600">40</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-muted-foreground">Rejected</span>
                </div>
                <span className="text-lg font-semibold text-red-600">10</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Tickets Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ticket className="h-5 w-5 text-orange-600" />
              Support Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-600"></div>
                  <span className="text-sm text-muted-foreground">Total</span>
                </div>
                <span className="text-lg font-semibold">10</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-muted-foreground">In Progress</span>
                </div>
                <span className="text-lg font-semibold text-blue-600">2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-muted-foreground">Closed</span>
                </div>
                <span className="text-lg font-semibold text-green-600">3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-muted-foreground">Open</span>
                </div>
                <span className="text-lg font-semibold text-yellow-600">4</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}