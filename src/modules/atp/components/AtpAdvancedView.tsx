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
  Unlock,
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
  Eye,
  Loader2,
  Shield,
  Briefcase,
  Home,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Wallet,
  BookOpen
} from "lucide-react"
import { Textarea } from "@/modules/shared/components/ui/textarea"
import { Label } from "@/modules/shared/components/ui/label"
import { useToast } from "@/modules/shared/hooks/use-toast"
import AtpService from "../services/atp.service"
import { User } from "@/modules/auth/models/auth.models"
import { UpdateApprovalStatusPayload, UpdateUserStatusPayload } from "../models/atp.models"
import { ConfirmationModal, DocumentViewer } from "@/modules/shared"
import { formatLongDate } from "@/modules/shared/lib/formatLongDate"
import { cn } from "@/modules/shared/lib/utils"

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

interface InfoItemProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-primary/5 text-primary shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-sm font-semibold text-foreground mt-0.5">{value || "N/A"}</p>
      </div>
    </div>
  )
}

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
  const [showUnblockModal, setShowUnblockModal] = useState(false)
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

  useEffect(() => {
    if (id) {
      fetchAreaCoordinator()
    }
  }, [id, fetchAreaCoordinator])

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { icon: React.ReactNode; className: string; label: string }> = {
      ACTIVE: { 
        icon: <CheckCircle2 className="w-3 h-3" />, 
        className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        label: "Active"
      },
      BLOCKED: { 
        icon: <Ban className="w-3 h-3" />, 
        className: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        label: "Blocked"
      },
      DELETED: { 
        icon: <XCircle className="w-3 h-3" />, 
        className: "bg-red-500/10 text-red-600 border-red-500/20",
        label: "Deleted"
      },
      PENDING: { 
        icon: <Clock className="w-3 h-3" />, 
        className: "bg-slate-500/10 text-slate-600 border-slate-500/20",
        label: "Pending"
      }
    }
    const config = configs[status] || configs.PENDING
    return (
      <Badge variant="outline" className={cn("gap-1 font-medium text-xs", config.className)}>
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const getApprovalBadge = (status: string) => {
    const configs: Record<string, { icon: React.ReactNode; className: string; label: string }> = {
      APPROVED: { 
        icon: <CheckCircle2 className="w-3 h-3" />, 
        className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        label: "Approved"
      },
      PENDING: { 
        icon: <Clock className="w-3 h-3" />, 
        className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        label: "Pending"
      },
      REJECTED: { 
        icon: <XCircle className="w-3 h-3" />, 
        className: "bg-red-500/10 text-red-600 border-red-500/20",
        label: "Rejected"
      }
    }
    const config = configs[status] || configs.PENDING
    return (
      <Badge variant="outline" className={cn("gap-1 font-medium text-xs", config.className)}>
        {config.icon}
        {config.label}
      </Badge>
    )
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

  const handleUnblock = () => {
    setShowUnblockModal(true)
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

  const confirmUnblock = async () => {
    if (!id || !atp) return

    try {
      setIsUpdating(true)

      const payload: UpdateUserStatusPayload = {
        status: 'ACTIVE'
      }

      const response = await AtpService.updateUserStatus(id, payload)

      if (response.status) {
        await fetchAreaCoordinator()
        setShowUnblockModal(false)
        toast({
          title: "ATP Unblocked",
          description: "Area coordinator has been unblocked successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: response.errMessage || "Failed to unblock area coordinator.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error unblocking area coordinator:", err)
      toast({
        title: "Error",
        description: "An error occurred while unblocking the area coordinator.",
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

  const hasDocumentUrl = (url?: string | null) =>
    typeof url === "string" && url.trim().length > 0

  const renderDocumentCard = (
    documentUrl: string | null | undefined,
    title: string,
    icon: React.ReactNode
  ) => {
    const hasDocument = hasDocumentUrl(documentUrl)
    
    return (
      <Card className={cn(
        "transition-all",
        hasDocument ? "border-emerald-200 bg-emerald-50/30" : "border-dashed"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2.5 rounded-lg",
                hasDocument 
                  ? "bg-emerald-100 text-emerald-600" 
                  : "bg-muted text-muted-foreground"
              )}>
                {icon}
              </div>
              <div>
                <p className="font-medium text-sm">{title}</p>
                <p className={cn(
                  "text-xs mt-0.5",
                  hasDocument ? "text-emerald-600" : "text-muted-foreground"
                )}>
                  {hasDocument ? "Document uploaded" : "Not uploaded"}
                </p>
              </div>
            </div>
            {hasDocument ? (
              <DocumentViewer
                documentUrl={documentUrl}
                title={title}
                trigger={
                  <Button variant="outline" size="sm" className="gap-1.5 h-8">
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Button>
                }
              />
            ) : (
              <Badge variant="secondary" className="text-xs">Missing</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <DashboardLayout title="Loading...">
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading details...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !atp) {
    return (
      <DashboardLayout title="Error">
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <div className="p-3 rounded-full bg-destructive/10">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div className="text-center">
            <p className="font-medium">{error || "Area coordinator not found"}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchAreaCoordinator} variant="outline" size="sm">
              Try Again
            </Button>
            <Button onClick={() => navigate("/area-coordinators")} size="sm">
              Back to List
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const isPending = atp.area_coordinator_profile?.approval_status === "PENDING"
  const isActive = atp.status === "ACTIVE"
  const isBlocked = atp.status === "BLOCKED"

  const totalEarnings = mockEarnings.reduce((acc, e) => acc + e.total, 0)
  const completedModules = mockTrainingModules.filter(m => m.progress === 100).length
  const overallProgress = Math.round(mockTrainingModules.reduce((acc, m) => acc + m.progress, 0) / mockTrainingModules.length)

  return (
    <DashboardLayout 
      title="Area Coordinator Details"
      action={
        <Button variant="ghost" size="sm" onClick={() => navigate("/area-coordinators")} className="gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Profile Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Profile Info */}
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16 border-2 border-primary/10">
                  <AvatarImage src={atp.profile_image} alt={atp.full_name || 'User'} />
                  <AvatarFallback className="text-lg font-semibold bg-primary/5 text-primary">
                    {atp.full_name ? atp.full_name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{atp.full_name || 'Unknown User'}</h2>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {atp?.area_coordinator_profile?.atp_uuid || atp.id}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {getStatusBadge(atp.status)}
                    {getApprovalBadge(atp.area_coordinator_profile?.approval_status || "PENDING")}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Region</span>
                  </div>
                  <p className="font-bold text-foreground">{atp.area_coordinator_profile?.region || "N/A"}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                    <Building className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Properties</span>
                  </div>
                  <p className="font-bold text-foreground">{atp.area_coordinator_profile?.assigned_properties || 0}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Hosts</span>
                  </div>
                  <p className="font-bold text-foreground">{mockHostsOnboarded.length}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Training</span>
                  </div>
                  <p className="font-bold text-foreground">{overallProgress}%</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {(isPending || isActive || isBlocked) && (
              <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t">
                {isPending && (
                  <>
                    <Button onClick={handleApprove} size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                      <Check className="w-3.5 h-3.5" />
                      Approve
                    </Button>
                    <Button onClick={handleReject} size="sm" variant="destructive" className="gap-1.5">
                      <X className="w-3.5 h-3.5" />
                      Reject
                    </Button>
                  </>
                )}
                {isActive && (
                  <>
                    <Button onClick={handleBlock} size="sm" variant="outline" className="gap-1.5 text-orange-600 border-orange-200 hover:bg-orange-50">
                      <Ban className="w-3.5 h-3.5" />
                      Block User
                    </Button>
                    <Button onClick={handleDelete} size="sm" variant="destructive" className="gap-1.5">
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete User
                    </Button>
                  </>
                )}
                {isBlocked && (
                  <Button onClick={handleUnblock} size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                    <Unlock className="w-3.5 h-3.5" />
                    Unblock User
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="h-auto p-1 bg-muted/50">
            {[
              { value: "overview", icon: Users, label: "Overview" },
              { value: "documents", icon: FileText, label: "Documents" },
              { value: "banking", icon: CreditCard, label: "Banking" },
              { value: "hosts", icon: Building, label: "Hosts" },
              { value: "earnings", icon: TrendingUp, label: "Earnings" },
              { value: "training", icon: GraduationCap, label: "Training" },
            ].map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value} 
                className="gap-1.5 px-3 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Personal Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoItem icon={<Mail className="w-4 h-4" />} label="Email Address" value={atp.email} />
                  <InfoItem icon={<Phone className="w-4 h-4" />} label="Phone Number" value={atp.phone_number} />
                  <InfoItem icon={<Calendar className="w-4 h-4" />} label="Date of Birth" value={atp.dob ? formatLongDate(atp.dob) : "N/A"} />
                  <InfoItem icon={<Calendar className="w-4 h-4" />} label="Joined Date" value={formatLongDate(atp.created_at)} />
                </CardContent>
              </Card>

              {/* Location Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoItem 
                    icon={<Home className="w-4 h-4" />} 
                    label="Address" 
                    value={
                      <>
                        {atp.area_coordinator_profile?.address_line1 || "N/A"}
                        {atp.area_coordinator_profile?.address_line2 && (
                          <span className="text-muted-foreground">, {atp.area_coordinator_profile.address_line2}</span>
                        )}
                      </>
                    } 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem icon={<MapPin className="w-4 h-4" />} label="City" value={atp.area_coordinator_profile?.city} />
                    <InfoItem icon={<MapPin className="w-4 h-4" />} label="State" value={atp.area_coordinator_profile?.state} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem icon={<MapPin className="w-4 h-4" />} label="District" value={atp.area_coordinator_profile?.district} />
                    <InfoItem icon={<MapPin className="w-4 h-4" />} label="Postal Code" value={atp.area_coordinator_profile?.postal_code} />
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoItem icon={<Users className="w-4 h-4" />} label="Contact Name" value={atp.area_coordinator_profile?.emergency_contact_name} />
                  <InfoItem icon={<Briefcase className="w-4 h-4" />} label="Relationship" value={atp.area_coordinator_profile?.emergency_contact_relationship} />
                  <InfoItem icon={<Phone className="w-4 h-4" />} label="Phone Number" value={atp.area_coordinator_profile?.emergency_contact} />
                </CardContent>
              </Card>

              {/* Identification */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Identification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoItem icon={<FileText className="w-4 h-4" />} label="ID Proof Type" value={atp.area_coordinator_profile?.id_proof_type} />
                  <InfoItem icon={<Shield className="w-4 h-4" />} label="ID Proof Number" value={<span className="font-mono">{atp.area_coordinator_profile?.id_proof_number || "N/A"}</span>} />
                  <InfoItem icon={<CreditCard className="w-4 h-4" />} label="PAN Card Number" value={<span className="font-mono">{atp.area_coordinator_profile?.pancard_number || "N/A"}</span>} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {renderDocumentCard(atp.area_coordinator_profile?.passport_size_photo, "Passport Size Photo", <Users className="w-4 h-4" />)}
              {renderDocumentCard(atp.area_coordinator_profile?.id_proof_document, "ID Proof Document", <FileText className="w-4 h-4" />)}
              {renderDocumentCard(atp.area_coordinator_profile?.address_proof_document, "Address Proof Document", <Home className="w-4 h-4" />)}
              {renderDocumentCard(atp.area_coordinator_profile?.id_proof_document, "PAN Card", <CreditCard className="w-4 h-4" />)}
            </div>
          </TabsContent>

          {/* Banking Tab */}
          <TabsContent value="banking" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-primary" />
                    Bank Account Details
                  </CardTitle>
                  <Badge 
                    variant="outline"
                    className={cn(
                      "gap-1 text-xs",
                      atp.area_coordinator_profile?.bank_details?.is_verified 
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    )}
                  >
                    {atp.area_coordinator_profile?.bank_details?.is_verified 
                      ? <><CheckCircle2 className="w-3 h-3" /> Verified</>
                      : <><Clock className="w-3 h-3" /> Pending</>
                    }
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoItem icon={<Building className="w-4 h-4" />} label="Bank Name" value={atp.area_coordinator_profile?.bank_details?.bank_name} />
                  <InfoItem icon={<Users className="w-4 h-4" />} label="Account Holder" value={atp.area_coordinator_profile?.bank_details?.account_holder_name} />
                  <InfoItem 
                    icon={<CreditCard className="w-4 h-4" />} 
                    label="Account Number" 
                    value={
                      atp.area_coordinator_profile?.bank_details?.account_number 
                        ? <span className="font-mono">••••{atp.area_coordinator_profile.bank_details.account_number.slice(-4)}</span>
                        : "N/A"
                    } 
                  />
                  <InfoItem icon={<Shield className="w-4 h-4" />} label="IFSC Code" value={<span className="font-mono">{atp.area_coordinator_profile?.bank_details?.ifsc_code || "N/A"}</span>} />
                  <InfoItem icon={<MapPin className="w-4 h-4" />} label="Branch Name" value={atp.area_coordinator_profile?.bank_details?.branch_name} />
                  <InfoItem icon={<Briefcase className="w-4 h-4" />} label="Account Type" value={atp.area_coordinator_profile?.bank_details?.account_type} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hosts Tab */}
          <TabsContent value="hosts" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Building className="w-4 h-4 text-primary" />
                    Hosts Onboarded
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">{mockHostsOnboarded.length} Hosts</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="text-xs font-semibold">Host Name</TableHead>
                      <TableHead className="text-xs font-semibold">Location</TableHead>
                      <TableHead className="text-xs font-semibold text-center">Properties</TableHead>
                      <TableHead className="text-xs font-semibold">Status</TableHead>
                      <TableHead className="text-xs font-semibold">Join Date</TableHead>
                      <TableHead className="w-8"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockHostsOnboarded.map((host) => (
                      <TableRow key={host.id} className="group cursor-pointer">
                        <TableCell className="text-sm font-medium">{host.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{host.location}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="text-xs font-mono">{host.properties}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={cn(
                              "text-xs",
                              host.status === "Active" 
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            )}
                          >
                            {host.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(host.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </TableCell>
                        <TableCell>
                          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card className="bg-emerald-50/50 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Earnings</p>
                      <p className="text-lg font-bold text-emerald-700">₹{totalEarnings.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50/50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Commission</p>
                      <p className="text-lg font-bold text-blue-700">₹{mockEarnings.reduce((a, e) => a + e.commission, 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-amber-50/50 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Bonus</p>
                      <p className="text-lg font-bold text-amber-700">₹{mockEarnings.reduce((a, e) => a + e.bonus, 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Earnings History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="text-xs font-semibold">Month</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Commission</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Bonus</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEarnings.map((earning, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-sm font-medium">{earning.month}</TableCell>
                        <TableCell className="text-sm text-right font-mono text-emerald-600">₹{earning.commission.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-sm text-right font-mono text-blue-600">₹{earning.bonus.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-sm text-right font-mono font-semibold">₹{earning.total.toLocaleString('en-IN')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card className="bg-emerald-50/50 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="text-lg font-bold text-emerald-700">{completedModules}/{mockTrainingModules.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50/50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Overall Progress</p>
                      <p className="text-lg font-bold text-blue-700">{overallProgress}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-amber-50/50 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">In Progress</p>
                      <p className="text-lg font-bold text-amber-700">{mockTrainingModules.filter(m => m.progress > 0 && m.progress < 100).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  Training Modules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockTrainingModules.map((module, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "rounded-lg border p-4",
                      module.progress === 100 ? "bg-emerald-50/50 border-emerald-200" : "bg-muted/30"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                          module.progress === 100 
                            ? "bg-emerald-500 text-white"
                            : module.progress > 0 
                              ? "bg-amber-500 text-white"
                              : "bg-muted text-muted-foreground"
                        )}>
                          {module.progress === 100 ? <Check className="w-3.5 h-3.5" /> : index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{module.module}</p>
                          {module.completedDate && (
                            <p className="text-xs text-emerald-600">Completed {formatLongDate(module.completedDate)}</p>
                          )}
                        </div>
                      </div>
                      <span className={cn(
                        "text-sm font-bold",
                        module.progress === 100 ? "text-emerald-600" : module.progress > 0 ? "text-amber-600" : "text-muted-foreground"
                      )}>
                        {module.progress}%
                      </span>
                    </div>
                    <Progress 
                      value={module.progress} 
                      className={cn(
                        "h-1.5",
                        module.progress === 100 ? "[&>div]:bg-emerald-500" : module.progress > 0 ? "[&>div]:bg-amber-500" : ""
                      )}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
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

      <ConfirmationModal
        isOpen={showUnblockModal}
        onClose={() => setShowUnblockModal(false)}
        onConfirm={confirmUnblock}
        title="Unblock Area Coordinator"
        description={`Are you sure you want to unblock ${atp?.full_name || 'this user'}? They will regain access to the platform and resume their activities.`}
        confirmText="Unblock"
        cancelText="Cancel"
        confirmVariant="default"
        cancelVariant="outline"
        isLoading={isUpdating}
        icon={<Unlock className="w-8 h-8 text-emerald-600 mx-auto" />}
        size="md"
      />

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
