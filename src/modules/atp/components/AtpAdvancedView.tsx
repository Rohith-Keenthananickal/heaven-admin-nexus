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
  Eye,
  Loader2
} from "lucide-react"
import { Textarea } from "@/modules/shared/components/ui/textarea"
import { Label } from "@/modules/shared/components/ui/label"
import { useToast } from "@/modules/shared/hooks/use-toast"
import AtpService from "../services/atp.service"
import { User } from "@/modules/auth/models/auth.models"
import { UpdateApprovalStatusPayload, UpdateUserStatusPayload } from "../models/atp.models"
import { ConfirmationModal } from "@/modules/shared/components/ConfirmationModal"

// Mock data for sections that don't have API endpoints yet
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
  const [atp, setAtp] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const fetchAreaCoordinator = useCallback(async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await AtpService.getAreaCoordinatorById(id)
      
      if (response.status && response.data) {
        setAtp(response.data)
      } else {
        setError(response.errMessage || "Failed to fetch area coordinator details")
      }
    } catch (err) {
      console.error("Error fetching area coordinator:", err)
      setError("An error occurred while fetching area coordinator details")
    } finally {
      setLoading(false)
    }
  }, [id])

  // Fetch ATP data on component mount
  useEffect(() => {
    if (id) {
      fetchAreaCoordinator()
    }
  }, [id, fetchAreaCoordinator])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
      case "SUSPENDED":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Suspended</Badge>
      case "BANNED":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Banned</Badge>
      case "PENDING":
        return <Badge className="bg-secondary/10 text-secondary border-secondary/20">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>
      case "PENDING":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>
      case "REJECTED":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleApprove = () => {
    setShowApproveModal(true)
  }

  const handleReject = () => {
    setShowRejectModal(true)
  }

  const confirmApprove = async () => {
    if (!id || !atp) return

    try {
      setIsUpdating(true)
      
      const payload: UpdateApprovalStatusPayload = {
        approval_status: 'APPROVED',
        rejection_reason: ''
      }

      const response = await AtpService.updateApprovalStatus(id, payload)
      
      if (response.status) {
        // Fetch updated user details after successful status update
        await fetchAreaCoordinator()
        setShowApproveModal(false)
        toast({
          title: "ATP Approved",
          description: "Area coordinator has been approved successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: response.errMessage || "Failed to approve area coordinator.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error approving area coordinator:", err)
      toast({
        title: "Error",
        description: "An error occurred while approving the area coordinator.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const confirmReject = async () => {
    if (!id || !atp) return

    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUpdating(true)
      
      const payload: UpdateApprovalStatusPayload = {
        approval_status: 'REJECTED',
        rejection_reason: rejectionReason.trim()
      }

      const response = await AtpService.updateApprovalStatus(id, payload)
      
      if (response.status) {
        // Fetch updated user details after successful status update
        await fetchAreaCoordinator()
        setShowRejectModal(false)
        setRejectionReason("")
        toast({
          title: "ATP Rejected",
          description: "Area coordinator application has been rejected.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: response.errMessage || "Failed to reject area coordinator.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error rejecting area coordinator:", err)
      toast({
        title: "Error",
        description: "An error occurred while rejecting the area coordinator.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleBlock = () => {
    setShowBlockModal(true)
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const confirmBlock = async () => {
    if (!id || !atp) return

    try {
      setIsUpdating(true)
      
      const payload: UpdateUserStatusPayload = {
        status: 'BLOCKED'
      }

      const response = await AtpService.updateUserStatus(id, payload)
      
      if (response.status) {
        // Fetch updated user details after successful status update
        await fetchAreaCoordinator()
        setShowBlockModal(false)
        toast({
          title: "ATP Blocked",
          description: "Area coordinator has been blocked successfully.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: response.errMessage || "Failed to block area coordinator.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error blocking area coordinator:", err)
      toast({
        title: "Error",
        description: "An error occurred while blocking the area coordinator.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const confirmDelete = async () => {
    if (!id || !atp) return

    try {
      setIsUpdating(true)
      
      const payload: UpdateUserStatusPayload = {
        status: 'DELETED'
      }

      const response = await AtpService.updateUserStatus(id, payload)
      
      if (response.status) {
        // Fetch updated user details after successful status update
        await fetchAreaCoordinator()
        setShowDeleteModal(false)
        toast({
          title: "ATP Deleted",
          description: "Area coordinator has been deleted successfully.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: response.errMessage || "Failed to delete area coordinator.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error deleting area coordinator:", err)
      toast({
        title: "Error",
        description: "An error occurred while deleting the area coordinator.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout title="Loading ATP Details...">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading area coordinator details...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error || !atp) {
    return (
      <DashboardLayout title="Error Loading ATP Details">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || "Area coordinator not found"}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={fetchAreaCoordinator} variant="outline">
                Try Again
              </Button>
              <Button onClick={() => navigate("/area-coordinators")} variant="outline">
                Back to List
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const isPending = atp.area_coordinator_profile?.approval_status === "PENDING"
  const isActive = atp.status === "ACTIVE"

  return (
    <DashboardLayout 
      title={`ATP Details - ${atp.full_name || 'Unknown User'}`}
      action={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/area-coordinators")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          {isPending && (
            <>
              <Button onClick={handleApprove} className="bg-success hover:bg-success/90">
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
      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={atp.profile_image} alt={atp.full_name || 'User'} />
              <AvatarFallback className="text-xl">
                {atp.full_name ? atp.full_name.split(' ').map(n => n[0]).join('') : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{atp.full_name || 'Unknown User'}</h2>
                  <p className="text-sm text-muted-foreground">ID: {atp.id}</p>
                  <div className="flex gap-4 mt-2">
                    {getStatusBadge(atp.status)}
                    {getApprovalBadge(atp.area_coordinator_profile?.approval_status || "PENDING")}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Region</p>
                  <p className="font-semibold">{atp.area_coordinator_profile?.region || "N/A"}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {atp.area_coordinator_profile?.assigned_properties || 0} Properties Assigned
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-6 w-full mb-6">
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
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{atp.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{atp.phone_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">{atp.dob ? new Date(atp.dob).toLocaleDateString() : "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Joined Date</p>
                        <p className="font-medium">{new Date(atp.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="w-5 h-5" />
                      Location Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{atp.area_coordinator_profile?.address_line1 || "N/A"}</p>
                      <p className="font-medium">{atp.area_coordinator_profile?.address_line2 || "N/A"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">City</p>
                        <p className="font-medium">{atp.area_coordinator_profile?.city || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">State</p>
                        <p className="font-medium">{atp.area_coordinator_profile?.state || "N/A"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">District</p>
                        <p className="font-medium">{atp.area_coordinator_profile?.district || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Postal Code</p>
                        <p className="font-medium">{atp.area_coordinator_profile?.postal_code || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Phone className="w-5 h-5" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Name</p>
                      <p className="font-medium">{atp.area_coordinator_profile?.emergency_contact_name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Relationship</p>
                      <p className="font-medium">{atp.area_coordinator_profile?.emergency_contact_relationship || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone Number</p>
                      <p className="font-medium">{atp.area_coordinator_profile?.emergency_contact || "N/A"}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* ID Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="w-5 h-5" />
                      Identification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">ID Proof Type</p>
                      <p className="font-medium">{atp.area_coordinator_profile?.id_proof_type || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ID Proof Number</p>
                      <p className="font-medium">{atp.area_coordinator_profile?.id_proof_number || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">PAN Card Number</p>
                      <p className="font-medium">{atp.area_coordinator_profile?.pancard_number || "N/A"}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
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
                    <Badge className="bg-success/10 text-success border-success/20">Verified</Badge>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">ID Proof Document</h4>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20">Verified</Badge>
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
                    <Badge className="bg-success/10 text-success border-success/20">Verified</Badge>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">PAN Card</h4>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                    <Badge className="bg-warning/10 text-warning border-warning/20">Pending Verification</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Banking Tab */}
            <TabsContent value="banking" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Bank Name</p>
                    <p className="font-medium">{atp.area_coordinator_profile?.bank_details?.bank_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Holder Name</p>
                    <p className="font-medium">{atp.area_coordinator_profile?.bank_details?.account_holder_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <p className="font-medium">
                      {atp.area_coordinator_profile?.bank_details?.account_number 
                        ? `****${atp.area_coordinator_profile.bank_details.account_number.slice(-4)}`
                        : "N/A"
                      }
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">IFSC Code</p>
                    <p className="font-medium">{atp.area_coordinator_profile?.bank_details?.ifsc_code || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Branch Name</p>
                    <p className="font-medium">{atp.area_coordinator_profile?.bank_details?.branch_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <p className="font-medium">{atp.area_coordinator_profile?.bank_details?.account_type || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Badge variant={atp.area_coordinator_profile?.bank_details?.is_verified ? "default" : "secondary"}>
                  {atp.area_coordinator_profile?.bank_details?.is_verified ? "Verified" : "Pending Verification"}
                </Badge>
              </div>
            </TabsContent>

            {/* Hosts Tab */}
            <TabsContent value="hosts" className="space-y-6">
              <div className="border rounded-lg">
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
              </div>
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings" className="space-y-6">
              <div className="border rounded-lg">
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
              </div>
            </TabsContent>

            {/* Training Tab */}
            <TabsContent value="training" className="space-y-6">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={confirmApprove}
        title="Approve Area Coordinator"
        description={`Are you sure you want to approve ${atp?.full_name || 'this user'}? This action will change their approval status to approved.`}
        confirmText="Approve"
        cancelText="Cancel"
        confirmVariant="default"
        cancelVariant="outline"
        isLoading={isUpdating}
        icon={<Check className="w-8 h-8 text-success mx-auto" />}
        size="md"
      />

      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false)
          setRejectionReason("")
        }}
        onConfirm={confirmReject}
        title="Reject Area Coordinator"
        description={`Please provide a reason for rejecting ${atp?.full_name || 'this user'}. This action will change their approval status to rejected and they will not be able to access the platform.`}
        confirmText="Reject"
        cancelText="Cancel"
        confirmVariant="destructive"
        cancelVariant="outline"
        isLoading={isUpdating}
        icon={<X className="w-8 h-8 text-destructive mx-auto" />}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="rejection-reason" className="text-sm font-medium">
              Rejection Reason *
            </Label>
            <Textarea
              id="rejection-reason"
              placeholder="Please provide a detailed reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-2 min-h-[100px]"
              disabled={isUpdating}
            />
            <p className="text-xs text-muted-foreground mt-1">
              This reason will be visible to the area coordinator.
            </p>
          </div>
        </div>
      </ConfirmationModal>

      {/* Block Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onConfirm={confirmBlock}
        title="Block Area Coordinator"
        description={`Are you sure you want to block ${atp?.full_name || 'this user'}? This action will prevent them from accessing the platform and all their activities will be suspended.`}
        confirmText="Block"
        cancelText="Cancel"
        confirmVariant="destructive"
        cancelVariant="outline"
        isLoading={isUpdating}
        icon={<Ban className="w-8 h-8 text-destructive mx-auto" />}
        size="md"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Area Coordinator"
        description={`Are you sure you want to delete ${atp?.full_name || 'this user'}? This action is permanent and cannot be undone. All their data and associated records will be removed from the system.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
        cancelVariant="outline"
        isLoading={isUpdating}
        icon={<Trash2 className="w-8 h-8 text-destructive mx-auto" />}
        size="md"
      />
    </DashboardLayout>
  )
}