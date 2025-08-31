import { useState } from "react"
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
import { Progress } from "@/modules/shared/components/ui/progress"
import { 
  ArrowLeft, 
  Check, 
  X, 
  Trash2, 
  Ban, 
  FileText, 
  CreditCard, 
  Users, 
  TrendingUp,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building,
  Download,
  Eye
} from "lucide-react"
import { useToast } from "@/modules/shared/hooks/use-toast"

// Mock data - this would come from API
const mockAtp = {
  id: 1,
  email: "rajesh.kumar@email.com",
  phone_number: "+91-9876543210",
  full_name: "Rajesh Kumar",
  dob: "1985-06-15",
  status: "ACTIVE",
  created_at: "2024-01-15T10:30:00Z",
  profile_image: "",
  area_coordinator_profile: {
    region: "North Delhi",
    assigned_properties: 15,
    approval_status: "APPROVED",
    approval_date: "2024-01-20T14:30:00Z",
    district: "Central Delhi",
    city: "New Delhi",
    state: "Delhi",
    postal_code: "110001",
    address_line1: "123 Main Street",
    address_line2: "Sector 12",
    emergency_contact: "+91-9876543211",
    emergency_contact_name: "Priya Kumar",
    emergency_contact_relationship: "Spouse",
    id_proof_type: "Aadhaar Card",
    id_proof_number: "1234-5678-9012",
    pancard_number: "ABCDE1234F",
    bank_details: {
      bank_name: "State Bank of India",
      account_holder_name: "Rajesh Kumar",
      account_number: "12345678901234",
      ifsc_code: "SBIN0001234",
      branch_name: "CP Branch",
      account_type: "Savings",
      is_verified: true
    }
  }
}

const mockHostsOnboarded = [
  { id: 1, name: "Hotel Grand Plaza", location: "Karol Bagh", status: "Active", properties: 3, joinDate: "2024-02-15" },
  { id: 2, name: "Comfort Inn", location: "Paharganj", status: "Active", properties: 2, joinDate: "2024-03-01" },
  { id: 3, name: "Budget Stay", location: "Dwarka", status: "Pending", properties: 1, joinDate: "2024-03-15" }
]

const mockEarnings = [
  { month: "January 2024", commission: 15000, bonus: 2000, total: 17000 },
  { month: "February 2024", commission: 18000, bonus: 3000, total: 21000 },
  { month: "March 2024", commission: 22000, bonus: 4000, total: 26000 }
]

const mockTrainingModules = [
  { module: "Platform Basics", progress: 100, completedDate: "2024-01-25" },
  { module: "Property Onboarding", progress: 100, completedDate: "2024-01-28" },
  { module: "Host Management", progress: 85, completedDate: null },
  { module: "Conflict Resolution", progress: 60, completedDate: null },
  { module: "Advanced Analytics", progress: 0, completedDate: null }
]

export default function AtpAdvancedView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: "default",
      SUSPENDED: "destructive",
      BANNED: "destructive",
      PENDING: "secondary"
    } as const
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    )
  }

  const getApprovalBadge = (status: string) => {
    const variants = {
      APPROVED: "default",
      PENDING: "secondary",
      REJECTED: "destructive"
    } as const
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    )
  }

  const handleApprove = () => {
    toast({
      title: "ATP Approved",
      description: "Area coordinator has been approved successfully.",
    })
  }

  const handleReject = () => {
    toast({
      title: "ATP Rejected",
      description: "Area coordinator application has been rejected.",
      variant: "destructive",
    })
  }

  const handleBlock = () => {
    toast({
      title: "ATP Blocked",
      description: "Area coordinator has been blocked.",
      variant: "destructive",
    })
  }

  const handleDelete = () => {
    toast({
      title: "ATP Deleted",
      description: "Area coordinator has been deleted permanently.",
      variant: "destructive",
    })
  }

  const isPending = mockAtp.area_coordinator_profile.approval_status === "PENDING"
  const isActive = mockAtp.status === "ACTIVE"

  return (
    <DashboardLayout 
      title={`ATP Details - ${mockAtp.full_name}`}
      action={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/area-coordinators")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          {isPending && (
            <>
              <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          {isActive && (
            <>
              <Button variant="outline" onClick={handleBlock}>
                <Ban className="w-4 h-4 mr-2" />
                Block
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={mockAtp.profile_image} alt={mockAtp.full_name} />
                <AvatarFallback className="text-xl">
                  {mockAtp.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{mockAtp.full_name}</h2>
                    <p className="text-muted-foreground">ID: {mockAtp.id}</p>
                    <div className="flex gap-4 mt-2">
                      {getStatusBadge(mockAtp.status)}
                      {getApprovalBadge(mockAtp.area_coordinator_profile.approval_status)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Region</p>
                    <p className="font-semibold">{mockAtp.area_coordinator_profile.region}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {mockAtp.area_coordinator_profile.assigned_properties} Properties Assigned
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="banking">Bank & Payout</TabsTrigger>
            <TabsTrigger value="hosts">Hosts Onboarded</TabsTrigger>
            <TabsTrigger value="earnings">Earnings & Ledgers</TabsTrigger>
            <TabsTrigger value="training">Training Progress</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{mockAtp.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{mockAtp.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{new Date(mockAtp.dob).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Joined Date</p>
                      <p className="font-medium">{new Date(mockAtp.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{mockAtp.area_coordinator_profile.address_line1}</p>
                    <p className="font-medium">{mockAtp.area_coordinator_profile.address_line2}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">City</p>
                      <p className="font-medium">{mockAtp.area_coordinator_profile.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">State</p>
                      <p className="font-medium">{mockAtp.area_coordinator_profile.state}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">District</p>
                      <p className="font-medium">{mockAtp.area_coordinator_profile.district}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Postal Code</p>
                      <p className="font-medium">{mockAtp.area_coordinator_profile.postal_code}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Name</p>
                    <p className="font-medium">{mockAtp.area_coordinator_profile.emergency_contact_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Relationship</p>
                    <p className="font-medium">{mockAtp.area_coordinator_profile.emergency_contact_relationship}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium">{mockAtp.area_coordinator_profile.emergency_contact}</p>
                  </div>
                </CardContent>
              </Card>

              {/* ID Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Identification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ID Proof Type</p>
                    <p className="font-medium">{mockAtp.area_coordinator_profile.id_proof_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ID Proof Number</p>
                    <p className="font-medium">{mockAtp.area_coordinator_profile.id_proof_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">PAN Card Number</p>
                    <p className="font-medium">{mockAtp.area_coordinator_profile.pancard_number}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Passport Size Photo</h4>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">Status: Verified</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">ID Proof Document</h4>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">Status: Verified</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Address Proof Document</h4>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">Status: Verified</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">PAN Card</h4>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">Status: Pending Verification</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banking Tab */}
          <TabsContent value="banking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Bank Account Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Bank Name</p>
                      <p className="font-medium">{mockAtp.area_coordinator_profile.bank_details.bank_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Holder Name</p>
                      <p className="font-medium">{mockAtp.area_coordinator_profile.bank_details.account_holder_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Number</p>
                      <p className="font-medium">****{mockAtp.area_coordinator_profile.bank_details.account_number.slice(-4)}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">IFSC Code</p>
                      <p className="font-medium">{mockAtp.area_coordinator_profile.bank_details.ifsc_code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Branch Name</p>
                      <p className="font-medium">{mockAtp.area_coordinator_profile.bank_details.branch_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Type</p>
                      <p className="font-medium">{mockAtp.area_coordinator_profile.bank_details.account_type}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <Badge variant={mockAtp.area_coordinator_profile.bank_details.is_verified ? "default" : "secondary"}>
                    {mockAtp.area_coordinator_profile.bank_details.is_verified ? "Verified" : "Pending Verification"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hosts Tab */}
          <TabsContent value="hosts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hosts Onboarded</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Host Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Properties</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockHostsOnboarded.map((host) => (
                      <TableRow key={host.id}>
                        <TableCell className="font-medium">{host.name}</TableCell>
                        <TableCell>{host.location}</TableCell>
                        <TableCell>{host.properties}</TableCell>
                        <TableCell>
                          <Badge variant={host.status === "Active" ? "default" : "secondary"}>
                            {host.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(host.joinDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Earnings Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Bonus</TableHead>
                      <TableHead>Total Earned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEarnings.map((earning, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{earning.month}</TableCell>
                        <TableCell>₹{earning.commission.toLocaleString()}</TableCell>
                        <TableCell>₹{earning.bonus.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold">₹{earning.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Training Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockTrainingModules.map((module, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{module.module}</h4>
                        <span className="text-sm text-muted-foreground">{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                      {module.completedDate && (
                        <p className="text-sm text-muted-foreground">
                          Completed on {new Date(module.completedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}