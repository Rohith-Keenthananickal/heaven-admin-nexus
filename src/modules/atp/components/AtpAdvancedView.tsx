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
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => navigate("/area-coordinators")} className="shadow-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          {isPending && (
            <>
              <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button variant="destructive" onClick={handleReject} className="shadow-sm">
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          {isActive && (
            <>
              <Button variant="outline" onClick={handleBlock} className="border-amber-300 text-amber-700 hover:bg-amber-50 shadow-sm">
                <Ban className="w-4 h-4 mr-2" />
                Block
              </Button>
              <Button variant="destructive" onClick={handleDelete} className="shadow-sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      }
    >
      <div className="space-y-8">
        {/* Enhanced Header Card with Gradient Background */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <Avatar className="w-28 h-28 ring-4 ring-white shadow-lg">
                  <AvatarImage src={atp.profile_image} alt={atp.full_name || 'User'} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {atp.full_name ? atp.full_name.split(' ').map(n => n[0]).join('') : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                      {atp.full_name || 'Unknown User'}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                      ID: {atp.id}
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      {getStatusBadge(atp.status)}
                      {getApprovalBadge(atp.area_coordinator_profile?.approval_status || "PENDING")}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border">
                    <div className="text-center">
                      <MapPin className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">Region</p>
                      <p className="font-bold text-lg text-slate-900 dark:text-white">
                        {atp.area_coordinator_profile?.region || "N/A"}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {atp.area_coordinator_profile?.assigned_properties || 0} Properties
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Tabs with Better Styling */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <TabsTrigger value="overview" className="py-3 rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Users className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="documents" className="py-3 rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="banking" className="py-3 rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Banking
                </TabsTrigger>
                <TabsTrigger value="hosts" className="py-3 rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Building className="w-4 h-4 mr-2" />
                  Hosts
                </TabsTrigger>
                <TabsTrigger value="earnings" className="py-3 rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Earnings
                </TabsTrigger>
                <TabsTrigger value="training" className="py-3 rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Training
                </TabsTrigger>
              </TabsList>

              {/* Enhanced Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Information with Enhanced Design */}
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-t-lg">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                          <Users className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                        </div>
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                          <Mail className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Email Address</p>
                          <p className="font-semibold text-slate-900 dark:text-white break-all">{atp.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                          <Phone className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Phone Number</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{atp.phone_number}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                          <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Date of Birth</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {atp.dob ? new Date(atp.dob).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                          <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Joined Date</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {new Date(atp.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location Information with Enhanced Design */}
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-t-lg">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                          <MapPin className="w-6 h-6 text-green-600 dark:text-green-300" />
                        </div>
                        Location Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Address</p>
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {atp.area_coordinator_profile?.address_line1 || "N/A"}
                          </p>
                          {atp.area_coordinator_profile?.address_line2 && (
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {atp.area_coordinator_profile.address_line2}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">City</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {atp.area_coordinator_profile?.city || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">State</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {atp.area_coordinator_profile?.state || "N/A"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">District</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {atp.area_coordinator_profile?.district || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Postal Code</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {atp.area_coordinator_profile?.postal_code || "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Emergency Contact with Enhanced Design */}
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 rounded-t-lg">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg">
                          <Phone className="w-6 h-6 text-amber-600 dark:text-amber-300" />
                        </div>
                        Emergency Contact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Contact Name</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {atp.area_coordinator_profile?.emergency_contact_name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Relationship</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {atp.area_coordinator_profile?.emergency_contact_relationship || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Phone Number</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {atp.area_coordinator_profile?.emergency_contact || "N/A"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ID Information with Enhanced Design */}
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-t-lg">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                          <FileText className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                        </div>
                        Identification
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">ID Proof Type</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {atp.area_coordinator_profile?.id_proof_type || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">ID Proof Number</p>
                        <p className="font-semibold text-slate-900 dark:text-white font-mono">
                          {atp.area_coordinator_profile?.id_proof_number || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">PAN Card Number</p>
                        <p className="font-semibold text-slate-900 dark:text-white font-mono">
                          {atp.area_coordinator_profile?.pancard_number || "N/A"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Enhanced Documents Tab */}
              <TabsContent value="documents" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                              <Eye className="w-5 h-5 text-green-600 dark:text-green-300" />
                            </div>
                            <h4 className="font-bold text-lg">Passport Size Photo</h4>
                          </div>
                          <Button variant="outline" size="sm" className="shadow-sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200 font-semibold">
                          ✓ Verified
                        </Badge>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                              <Download className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                            </div>
                            <h4 className="font-bold text-lg">ID Proof Document</h4>
                          </div>
                          <Button variant="outline" size="sm" className="shadow-sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200 font-semibold">
                          ✓ Verified
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-6">
                    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                              <Download className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                            </div>
                            <h4 className="font-bold text-lg">Address Proof Document</h4>
                          </div>
                          <Button variant="outline" size="sm" className="shadow-sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200 font-semibold">
                          ✓ Verified
                        </Badge>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg">
                              <Eye className="w-5 h-5 text-amber-600 dark:text-amber-300" />
                            </div>
                            <h4 className="font-bold text-lg">PAN Card</h4>
                          </div>
                          <Button variant="outline" size="sm" className="shadow-sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-semibold">
                          ⏳ Pending Verification
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Enhanced Banking Tab */}
              <TabsContent value="banking" className="space-y-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <CreditCard className="w-7 h-7 text-slate-600 dark:text-slate-300" />
                      </div>
                      Bank Account Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Bank Name</p>
                          <p className="font-bold text-lg text-slate-900 dark:text-white">
                            {atp.area_coordinator_profile?.bank_details?.bank_name || "N/A"}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Account Holder Name</p>
                          <p className="font-bold text-lg text-slate-900 dark:text-white">
                            {atp.area_coordinator_profile?.bank_details?.account_holder_name || "N/A"}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Account Number</p>
                          <p className="font-bold text-lg text-slate-900 dark:text-white font-mono">
                            {atp.area_coordinator_profile?.bank_details?.account_number 
                              ? `••••••••••••${atp.area_coordinator_profile.bank_details.account_number.slice(-4)}`
                              : "N/A"
                            }
                          </p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">IFSC Code</p>
                          <p className="font-bold text-lg text-slate-900 dark:text-white font-mono">
                            {atp.area_coordinator_profile?.bank_details?.ifsc_code || "N/A"}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Branch Name</p>
                          <p className="font-bold text-lg text-slate-900 dark:text-white">
                            {atp.area_coordinator_profile?.bank_details?.branch_name || "N/A"}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Account Type</p>
                          <p className="font-bold text-lg text-slate-900 dark:text-white">
                            {atp.area_coordinator_profile?.bank_details?.account_type || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 flex justify-center">
                      <Badge 
                        variant={atp.area_coordinator_profile?.bank_details?.is_verified ? "default" : "secondary"}
                        className="px-4 py-2 text-lg"
                      >
                        {atp.area_coordinator_profile?.bank_details?.is_verified ? "✓ Verified" : "⏳ Pending Verification"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Hosts Tab */}
              <TabsContent value="hosts" className="space-y-8">
                <Card className="border-0 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <Building className="w-7 h-7 text-slate-600 dark:text-slate-300" />
                      </div>
                      Hosts Onboarded
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-800">
                          <TableRow>
                            <TableHead className="font-bold text-slate-900 dark:text-white">Host Name</TableHead>
                            <TableHead className="font-bold text-slate-900 dark:text-white">Location</TableHead>
                            <TableHead className="font-bold text-slate-900 dark:text-white">Properties</TableHead>
                            <TableHead className="font-bold text-slate-900 dark:text-white">Status</TableHead>
                            <TableHead className="font-bold text-slate-900 dark:text-white">Join Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockHostsOnboarded.map((host) => (
                            <TableRow key={host.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                              <TableCell className="font-bold text-slate-900 dark:text-white">{host.name}</TableCell>
                              <TableCell className="text-slate-600 dark:text-slate-300">{host.location}</TableCell>
                              <TableCell className="font-semibold text-blue-600 dark:text-blue-400">{host.properties}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={host.status === "Active" ? "default" : "secondary"}
                                  className="font-semibold"
                                >
                                  {host.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-slate-600 dark:text-slate-300">
                                {new Date(host.joinDate).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Earnings Tab */}
              <TabsContent value="earnings" className="space-y-8">
                <Card className="border-0 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900 dark:to-green-900">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-3 bg-emerald-100 dark:bg-emerald-800 rounded-lg">
                        <TrendingUp className="w-7 h-7 text-emerald-600 dark:text-emerald-300" />
                      </div>
                      Earnings & Ledgers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-emerald-50 dark:bg-emerald-900">
                          <TableRow>
                            <TableHead className="font-bold text-slate-900 dark:text-white">Month</TableHead>
                            <TableHead className="font-bold text-slate-900 dark:text-white">Commission</TableHead>
                            <TableHead className="font-bold text-slate-900 dark:text-white">Bonus</TableHead>
                            <TableHead className="font-bold text-slate-900 dark:text-white">Total Earned</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockEarnings.map((earning, index) => (
                            <TableRow key={index} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                              <TableCell className="font-bold text-slate-900 dark:text-white">{earning.month}</TableCell>
                              <TableCell className="font-semibold text-green-600 dark:text-green-400">
                                ₹{earning.commission.toLocaleString()}
                              </TableCell>
                              <TableCell className="font-semibold text-blue-600 dark:text-blue-400">
                                ₹{earning.bonus.toLocaleString()}
                              </TableCell>
                              <TableCell className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                                ₹{earning.total.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Training Tab */}
              <TabsContent value="training" className="space-y-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-lg">
                        <GraduationCap className="w-7 h-7 text-purple-600 dark:text-purple-300" />
                      </div>
                      Training Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-8">
                      {mockTrainingModules.map((module, index) => (
                        <Card key={index} className="border-0 shadow-sm bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="font-bold text-lg text-slate-900 dark:text-white">{module.module}</h4>
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {module.progress}%
                                  </span>
                                  {module.progress === 100 && (
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                      <Check className="w-4 h-4 text-white" />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Progress 
                                value={module.progress} 
                                className="h-3 bg-slate-200 dark:bg-slate-700"
                              />
                              {module.completedDate && (
                                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                                  ✓ Completed on {new Date(module.completedDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Existing modals remain the same */}
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