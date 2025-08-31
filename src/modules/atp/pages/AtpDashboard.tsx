import { DashboardLayout } from "@/modules/dashboard/components/DashboardLayout"
import { StatsCard } from "@/modules/dashboard/components/StatsCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts'
import { Users, UserCheck, Clock, MapPin, Building2, TrendingUp } from "lucide-react"

// Mock data for charts
const regionData = [
  { name: 'North India', count: 25 },
  { name: 'South India', count: 30 },
  { name: 'East India', count: 18 },
  { name: 'West India', count: 22 },
  { name: 'Central India', count: 15 }
]

const approvalStatusData = [
  { name: 'Approved', value: 85, color: '#22c55e' },
  { name: 'Pending', value: 12, color: '#f59e0b' },
  { name: 'Rejected', value: 3, color: '#ef4444' }
]

const monthlyGrowthData = [
  { month: 'Jan', atps: 45 },
  { month: 'Feb', atps: 52 },
  { month: 'Mar', atps: 61 },
  { month: 'Apr', atps: 68 },
  { month: 'May', atps: 75 },
  { month: 'Jun', atps: 82 }
]

export default function AtpDashboard() {
  return (
    <DashboardLayout title="ATP Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total ATPs"
            value="110"
            change="+12"
            icon={Users}
            changeType="positive"
          />
          <StatsCard
            title="Pending Approvals"
            value="12"
            change="-3"
            icon={Clock}
            changeType="negative"
            color="yellow"
          />
          <StatsCard
            title="Approved ATPs"
            value="85"
            change="+8"
            icon={UserCheck}
            changeType="positive"
            color="green"
          />
          <StatsCard
            title="Total Properties Assigned"
            value="1,247"
            change="+45"
            icon={Building2}
            changeType="positive"
          />
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Active Regions"
            value="15"
            change="+2"
            icon={MapPin}
            changeType="positive"
          />
          <StatsCard
            title="Avg Properties per ATP"
            value="11.3"
            change="+0.8"
            icon={TrendingUp}
            changeType="positive"
          />
          <StatsCard
            title="This Month Applications"
            value="18"
            change="+5"
            icon={Users}
            changeType="positive"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Region Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>ATP Distribution by Region</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Approval Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Approval Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={approvalStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {approvalStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>ATP Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="atps" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent ATP Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Rajesh Kumar - Approved</p>
                  <p className="text-xs text-muted-foreground">North Delhi Region • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Priya Sharma - Pending Review</p>
                  <p className="text-xs text-muted-foreground">Mumbai Central • 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New Application Received</p>
                  <p className="text-xs text-muted-foreground">Bangalore South • 6 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Amit Patel - Document Verified</p>
                  <p className="text-xs text-muted-foreground">Gujarat Region • 8 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}