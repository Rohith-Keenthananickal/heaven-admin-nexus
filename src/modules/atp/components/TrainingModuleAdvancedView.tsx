import { useState, useEffect, useCallback, useRef } from "react"
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Play,
  FileText,
  Image,
  CheckCircle,
  Pencil,
  Trash2,
  Loader2,
  Users,
  BarChart3,
  AlertCircle,
  Layers,
  Hash,
  X,
  Maximize2,
  Volume2,
  VolumeX,
  Eye,
  GripVertical,
  Sparkles,
  TrendingUp,
  Award,
  Target,
} from "lucide-react"
import { Button } from "@/modules/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/modules/shared/components/ui/card"
import { Badge } from "@/modules/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/shared/components/ui/tabs"
import { Input } from "@/modules/shared/components/ui/input"
import { Label } from "@/modules/shared/components/ui/label"
import { Textarea } from "@/modules/shared/components/ui/textarea"
import { Switch } from "@/modules/shared/components/ui/switch"
import { Progress } from "@/modules/shared/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/shared/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/components/ui/dialog"
import { ConfirmationModal } from "@/modules/shared/components/ConfirmationModal"
import { useToast } from "@/modules/shared/hooks/use-toast"
import type {
  TrainingAnalyticsData,
  TrainingAnalyticsUser,
  TrainingApiContentType,
  TrainingContent,
  TrainingModule,
  UpdateTrainingContentPayload,
  UpdateTrainingModulePayload,
} from "../models/training.models"
import { trainingService } from "../services/training.service"
import { formatLongDate } from "@/modules/shared/lib/formatLongDate"
import { cn } from "@/modules/shared/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/shared/components/ui/table"

interface TrainingModuleAdvancedViewProps {
  module: TrainingModule
  onBack: () => void
}

interface ModuleEditForm {
  title: string
  description: string
  module_order: number
  is_active: boolean
  estimated_duration_minutes: number
}

interface ContentEditForm {
  content_type: TrainingApiContentType
  title: string
  content: string
  content_order: number
  is_required: boolean
  video_duration_seconds: number
  thumbnail_url: string
  passing_score: number
  quiz_questions_json: string
}

const contentTypeConfig: Record<string, { icon: typeof FileText; color: string; bgColor: string; borderColor: string }> = {
  TEXT: { icon: FileText, color: "text-emerald-600", bgColor: "bg-emerald-50", borderColor: "border-emerald-200" },
  VIDEO: { icon: Play, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  IMAGE: { icon: Image, color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
}

function moduleToEditForm(m: TrainingModule): ModuleEditForm {
  return {
    title: m.title,
    description: m.description,
    module_order: m.module_order,
    is_active: m.is_active,
    estimated_duration_minutes: m.estimated_duration_minutes,
  }
}

function contentToEditForm(c: TrainingContent): ContentEditForm {
  return {
    content_type: c.content_type,
    title: c.title,
    content: c.content,
    content_order: c.content_order,
    is_required: c.is_required,
    video_duration_seconds: c.video_duration_seconds ?? 0,
    thumbnail_url: c.thumbnail_url ?? "",
    passing_score: c.passing_score ?? 100,
    quiz_questions_json: JSON.stringify(c.quiz_questions ?? {}, null, 2),
  }
}

function formatDurationSeconds(total: number): string {
  if (!Number.isFinite(total) || total < 0) return "—"
  if (total < 60) return `${Math.round(total * 10) / 10}s`
  const m = Math.floor(total / 60)
  const s = Math.round(total % 60)
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

function formatVideoDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, "0")}`
}

function getOverallTrainingStatusBadge(status: string): { label: string; className: string } {
  switch (status.toUpperCase()) {
    case "NOT_STARTED":
      return {
        label: "Not started",
        className:
          "border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-100/90 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-200",
      }
    case "IN_PROGRESS":
      return {
        label: "In progress",
        className:
          "border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-50/90 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-50",
      }
    case "COMPLETED":
      return {
        label: "Completed",
        className:
          "border-emerald-300 bg-emerald-50 text-emerald-950 hover:bg-emerald-50/90 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-50",
      }
    case "FAILED":
      return {
        label: "Failed",
        className:
          "border-red-300 bg-red-50 text-red-900 hover:bg-red-50/90 dark:border-red-800 dark:bg-red-950/40 dark:text-red-50",
      }
    default:
      return {
        label: status.replace(/_/g, " "),
        className: "border-border bg-muted text-muted-foreground",
      }
  }
}

function buildContentUpdatePayload(form: ContentEditForm): UpdateTrainingContentPayload {
  let quiz_questions: Record<string, unknown> = {}
  try {
    quiz_questions = form.quiz_questions_json.trim()
      ? (JSON.parse(form.quiz_questions_json) as Record<string, unknown>)
      : {}
  } catch {
    quiz_questions = {}
  }
  return {
    content_type: form.content_type,
    title: form.title,
    content: form.content,
    content_order: form.content_order,
    is_required: form.is_required,
    video_duration_seconds: form.video_duration_seconds,
    thumbnail_url: form.thumbnail_url,
    quiz_questions,
    passing_score: form.passing_score,
  }
}

export function TrainingModuleAdvancedView({ module, onBack }: TrainingModuleAdvancedViewProps) {
  const { toast } = useToast()
  const [localModule, setLocalModule] = useState<TrainingModule>(module)
  const moduleIdRef = useRef(module.id)
  moduleIdRef.current = localModule.id

  useEffect(() => {
    setLocalModule(module)
  }, [module])

  const contents = localModule.contents ?? []

  const refreshModule = useCallback(async () => {
    const res = await trainingService.getModuleById(moduleIdRef.current)
    if (res?.status === "success" && res.data?.id != null) {
      setLocalModule(res.data)
    }
  }, [])

  const [editModuleOpen, setEditModuleOpen] = useState(false)
  const [moduleForm, setModuleForm] = useState<ModuleEditForm>(() => moduleToEditForm(module))
  const [savingModule, setSavingModule] = useState(false)

  const [deleteModuleOpen, setDeleteModuleOpen] = useState(false)
  const [deletingModule, setDeletingModule] = useState(false)

  const [editContentOpen, setEditContentOpen] = useState(false)
  const [editingContentId, setEditingContentId] = useState<number | null>(null)
  const [contentForm, setContentForm] = useState<ContentEditForm | null>(null)
  const [savingContent, setSavingContent] = useState(false)

  const [deleteContentOpen, setDeleteContentOpen] = useState(false)
  const [deletingContentId, setDeletingContentId] = useState<number | null>(null)
  const [deletingContent, setDeletingContent] = useState(false)

  const [mainTab, setMainTab] = useState("overview")
  const [analytics, setAnalytics] = useState<TrainingAnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)

  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [videoContent, setVideoContent] = useState<TrainingContent | null>(null)
  const [videoMuted, setVideoMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true)
    setAnalyticsError(null)
    try {
      const res = await trainingService.getAdminTrainingAnalytics()
      if (res?.status === "success" && res.data?.summary) {
        setAnalytics(res.data)
      } else {
        setAnalytics(null)
        setAnalyticsError(res?.message ?? "Could not load analytics.")
      }
    } catch {
      setAnalytics(null)
      setAnalyticsError("Could not load analytics.")
    } finally {
      setAnalyticsLoading(false)
    }
  }, [])

  useEffect(() => {
    setAnalytics(null)
    setAnalyticsError(null)
  }, [module.id])

  useEffect(() => {
    if (mainTab !== "analytics") return
    void loadAnalytics()
  }, [mainTab, module.id, loadAnalytics])

  const openEditModule = () => {
    setModuleForm(moduleToEditForm(localModule))
    setEditModuleOpen(true)
  }

  const saveModule = async () => {
    const payload: UpdateTrainingModulePayload = {
      title: moduleForm.title.trim(),
      description: moduleForm.description.trim(),
      module_order: moduleForm.module_order,
      is_active: moduleForm.is_active,
      estimated_duration_minutes: moduleForm.estimated_duration_minutes,
    }
    if (!payload.title || !payload.description) {
      toast({ title: "Validation", description: "Title and description are required.", variant: "destructive" })
      return
    }
    setSavingModule(true)
    try {
      const res = await trainingService.updateModule(localModule.id, payload)
      if (res?.status === "success" && res.data?.id != null) {
        setLocalModule(res.data)
        toast({ title: "Saved", description: res.message ?? "Module updated." })
        setEditModuleOpen(false)
      } else {
        toast({ title: "Error", description: res?.message ?? "Update failed.", variant: "destructive" })
      }
    } catch {
      // interceptor toast
    } finally {
      setSavingModule(false)
    }
  }

  const runDeleteModule = async () => {
    setDeletingModule(true)
    try {
      await trainingService.deleteModule(localModule.id)
      toast({ title: "Deleted", description: "Training module was removed." })
      setDeleteModuleOpen(false)
      onBack()
    } catch {
      // interceptor
    } finally {
      setDeletingModule(false)
    }
  }

  const openEditContent = (c: TrainingContent) => {
    setEditingContentId(c.id)
    setContentForm(contentToEditForm(c))
    setEditContentOpen(true)
  }

  const saveContent = async () => {
    if (editingContentId == null || !contentForm) return
    if (contentForm.quiz_questions_json.trim()) {
      try {
        JSON.parse(contentForm.quiz_questions_json)
      } catch {
        toast({ title: "Invalid JSON", description: "Fix quiz questions JSON before saving.", variant: "destructive" })
        return
      }
    }
    const payload = buildContentUpdatePayload(contentForm)
    if (!payload.title.trim()) {
      toast({ title: "Validation", description: "Content title is required.", variant: "destructive" })
      return
    }
    setSavingContent(true)
    try {
      const res = await trainingService.updateContent(editingContentId, payload)
      if (res?.status === "success" || res?.data?.id != null) {
        toast({ title: "Saved", description: res.message ?? "Content updated." })
        setEditContentOpen(false)
        setEditingContentId(null)
        setContentForm(null)
        await refreshModule()
      } else {
        toast({ title: "Error", description: res?.message ?? "Update failed.", variant: "destructive" })
      }
    } catch {
      // interceptor
    } finally {
      setSavingContent(false)
    }
  }

  const confirmDeleteContent = (contentId: number) => {
    setDeletingContentId(contentId)
    setDeleteContentOpen(true)
  }

  const runDeleteContent = async () => {
    if (deletingContentId == null) return
    setDeletingContent(true)
    try {
      await trainingService.deleteContent(deletingContentId)
      toast({ title: "Deleted", description: "Content item removed." })
      setDeleteContentOpen(false)
      setDeletingContentId(null)
      await refreshModule()
    } catch {
      // interceptor
    } finally {
      setDeletingContent(false)
    }
  }

  const openVideoModal = (content: TrainingContent) => {
    setVideoContent(content)
    setVideoModalOpen(true)
  }

  const closeVideoModal = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    setVideoModalOpen(false)
    setVideoContent(null)
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const requiredCount = contents.filter((c) => c.is_required).length
  const videoCount = contents.filter((c) => c.content_type === "VIDEO").length
  const textCount = contents.filter((c) => c.content_type === "TEXT").length
  const imageCount = contents.filter((c) => c.content_type === "IMAGE").length
  const totalVideoDuration = contents
    .filter((c) => c.content_type === "VIDEO")
    .reduce((acc, c) => acc + (c.video_duration_seconds ?? 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="w-fit gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Training Modules
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={openEditModule}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" className="gap-2" onClick={() => setDeleteModuleOpen(true)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-0 shadow-lg">
        <div className={cn("h-2", localModule.is_active ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-slate-400 to-slate-300")} />
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium",
                    localModule.is_active
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-slate-300 bg-slate-50 text-slate-700"
                  )}
                >
                  {localModule.is_active ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline" className="gap-1 text-muted-foreground">
                  <Hash className="h-3 w-3" />
                  Module {localModule.module_order}
                </Badge>
              </div>
              <CardTitle className="text-2xl sm:text-3xl">{localModule.title}</CardTitle>
              <CardDescription className="text-base">{localModule.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="border-t bg-muted/30 py-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{localModule.estimated_duration_minutes} minutes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              <span>{contents.length} content items</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>Created by User #{localModule.created_by}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{formatLongDate(localModule.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={mainTab} onValueChange={setMainTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="overview" className="gap-2 data-[state=active]:shadow-sm">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2 data-[state=active]:shadow-sm">
            <Layers className="h-4 w-4" />
            Content ({contents.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2 data-[state=active]:shadow-sm">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Content</CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                  <Layers className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contents.length}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Required</CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                  <Target className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{requiredCount}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Duration</CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{localModule.estimated_duration_minutes}m</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Video Time</CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                  <Play className="h-4 w-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatDurationSeconds(totalVideoDuration)}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Content Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                        <Play className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium">Videos</span>
                    </div>
                    <span className="text-lg font-semibold">{videoCount}</span>
                  </div>
                  <Progress value={contents.length > 0 ? (videoCount / contents.length) * 100 : 0} className="h-2 bg-blue-100" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                        <FileText className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="font-medium">Text</span>
                    </div>
                    <span className="text-lg font-semibold">{textCount}</span>
                  </div>
                  <Progress value={contents.length > 0 ? (textCount / contents.length) * 100 : 0} className="h-2 bg-emerald-100" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                        <Image className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-medium">Images</span>
                    </div>
                    <span className="text-lg font-semibold">{imageCount}</span>
                  </div>
                  <Progress value={contents.length > 0 ? (imageCount / contents.length) * 100 : 0} className="h-2 bg-purple-100" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Module Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Module Order</dt>
                    <dd className="font-medium">#{localModule.module_order}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd>
                      <Badge variant={localModule.is_active ? "default" : "secondary"}>
                        {localModule.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Estimated Duration</dt>
                    <dd className="font-medium">{localModule.estimated_duration_minutes} minutes</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Created By</dt>
                    <dd className="font-medium">User #{localModule.created_by}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Created</dt>
                    <dd className="font-medium">{formatLongDate(localModule.created_at)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Last Updated</dt>
                    <dd className="font-medium">{formatLongDate(localModule.updated_at)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {contents.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Layers className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No content yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">This module doesn't have any content items.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {[...contents]
                .sort((a, b) => a.content_order - b.content_order)
                .map((content, index) => {
                  const config = contentTypeConfig[content.content_type] || contentTypeConfig.TEXT
                  const Icon = config.icon
                  return (
                    <Card key={content.id} className="group overflow-hidden border-0 shadow-md transition-all hover:shadow-lg">
                      <div className="flex">
                        <div className={cn("flex w-14 shrink-0 flex-col items-center justify-center", config.bgColor)}>
                          <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                          <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 flex-1 space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className={cn("gap-1", config.bgColor, config.color, config.borderColor)}>
                                  <Icon className="h-3 w-3" />
                                  {content.content_type}
                                </Badge>
                                {content.is_required && (
                                  <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">Required</Badge>
                                )}
                                {content.quiz_questions && Object.keys(content.quiz_questions).length > 0 && (
                                  <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 gap-1">
                                    <Award className="h-3 w-3" />
                                    Quiz
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-semibold text-lg">{content.title}</h3>
                              {content.content_type === "TEXT" && content.content && (
                                <p className="line-clamp-2 text-sm text-muted-foreground">{content.content}</p>
                              )}
                              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                {content.content_type === "VIDEO" && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatVideoDuration(content.video_duration_seconds ?? 0)}
                                  </span>
                                )}
                                {content.passing_score != null && content.passing_score > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    Pass: {content.passing_score}%
                                  </span>
                                )}
                                <span>Updated {formatLongDate(content.updated_at)}</span>
                              </div>
                            </div>

                            <div className="flex shrink-0 gap-2">
                              {content.content_type === "VIDEO" && content.content && (
                                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openVideoModal(content)}>
                                  <Play className="h-4 w-4" />
                                  Watch
                                </Button>
                              )}
                              {content.content_type === "IMAGE" && content.content && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1.5"
                                  onClick={() => window.open(content.content, "_blank")}
                                >
                                  <Eye className="h-4 w-4" />
                                  View
                                </Button>
                              )}
                              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openEditContent(content)}>
                                <Pencil className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-destructive hover:bg-destructive/10"
                                onClick={() => confirmDeleteContent(content.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {content.content_type === "VIDEO" && content.thumbnail_url && (
                            <div className="mt-4">
                              <div
                                className="relative h-40 w-full max-w-md cursor-pointer overflow-hidden rounded-lg bg-slate-100"
                                onClick={() => openVideoModal(content)}
                              >
                                <img src={content.thumbnail_url} alt={content.title} className="h-full w-full object-cover transition-transform hover:scale-105" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40">
                                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
                                    <Play className="h-6 w-6 text-slate-900 ml-1" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {content.content_type === "IMAGE" && content.content && (
                            <div className="mt-4">
                              <div
                                className="relative h-40 w-full max-w-md cursor-pointer overflow-hidden rounded-lg bg-slate-100"
                                onClick={() => window.open(content.content, "_blank")}
                              >
                                <img src={content.content} alt={content.title} className="h-full w-full object-cover transition-transform hover:scale-105" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analyticsLoading && (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <div className="relative">
                <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full bg-primary/20" />
                <Loader2 className="relative h-16 w-16 animate-spin text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Loading analytics…</p>
            </div>
          )}

          {!analyticsLoading && analyticsError && (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-sm text-muted-foreground">{analyticsError}</p>
                <Button variant="outline" size="sm" onClick={() => void loadAnalytics()}>
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {!analyticsLoading && !analyticsError && analytics && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="overflow-hidden border-0 shadow-md">
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-400" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analytics.summary.total_module_enrollments}</div>
                    <p className="mt-1 text-xs text-muted-foreground">Module enrollment records</p>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden border-0 shadow-md">
                  <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analytics.summary.completion_rate_percentage}%</div>
                    <p className="mt-1 text-xs text-muted-foreground">Overall completion</p>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden border-0 shadow-md">
                  <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-400" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Time Spent</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatDurationSeconds(analytics.summary.avg_time_spent_seconds)}</div>
                    <p className="mt-1 text-xs text-muted-foreground">Per session average</p>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden border-0 shadow-md">
                  <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-400" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analytics.summary.total_active_training_modules}</div>
                    <p className="mt-1 text-xs text-muted-foreground">Published modules</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                  <CardDescription>Overview of ATP training progress across all users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                    {[
                      { label: "Total ATPs", value: analytics.summary.total_atps, color: "bg-slate-100" },
                      { label: "Progress Rows", value: analytics.summary.total_content_progress_rows, color: "bg-blue-50" },
                      { label: "ATPs Completed All", value: analytics.summary.atps_completed_all_modules, color: "bg-emerald-50" },
                      { label: "Not Started", value: analytics.summary.users_not_started, color: "bg-slate-50" },
                      { label: "In Progress", value: analytics.summary.users_in_progress, color: "bg-amber-50" },
                      { label: "Completed", value: analytics.summary.users_completed, color: "bg-emerald-50" },
                      { label: "Failed", value: analytics.summary.users_failed, color: "bg-red-50" },
                      { label: "ATPs w/ Fails", value: analytics.summary.atps_with_any_failed_record, color: "bg-red-50" },
                    ].map((item) => (
                      <div key={item.label} className={cn("rounded-lg p-3 text-center", item.color)}>
                        <div className="text-2xl font-bold">{item.value}</div>
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    ATP Training Overview
                  </CardTitle>
                  <CardDescription>
                    {(analytics.users ?? []).length} user{(analytics.users ?? []).length !== 1 ? "s" : ""} in analytics dataset
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  {(analytics.users ?? []).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground/30" />
                      <p className="mt-4 text-sm text-muted-foreground">No user data available</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>ATP ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Progress</TableHead>
                            <TableHead className="text-right">Modules</TableHead>
                            <TableHead className="text-right">Time</TableHead>
                            <TableHead>Last Activity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(analytics.users ?? []).map((u: TrainingAnalyticsUser) => {
                            const statusBadge = getOverallTrainingStatusBadge(u.overall_training_status)
                            return (
                              <TableRow key={`${u.user_id}-${u.atp_uuid}`}>
                                <TableCell className="font-medium">{u.full_name}</TableCell>
                                <TableCell className="max-w-[180px] truncate text-muted-foreground" title={u.email}>
                                  {u.email}
                                </TableCell>
                                <TableCell className="font-mono text-xs">{u.atp_uuid}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={cn("font-medium", statusBadge.className)}>
                                    {statusBadge.label}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Progress value={u.overall_progress_percentage} className="h-2 w-16" />
                                    <span className="text-xs font-medium w-8">{u.overall_progress_percentage}%</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {u.completed_modules}/{u.total_active_modules}
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                  {formatDurationSeconds(u.total_time_spent_seconds)}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {formatLongDate(u.last_activity_at)}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={videoModalOpen} onOpenChange={(open) => !open && closeVideoModal()}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="pr-8">{videoContent?.title}</DialogTitle>
              <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={closeVideoModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="relative bg-black aspect-video">
            {videoContent?.content ? (
              <video
                ref={videoRef}
                src={videoContent.content}
                controls
                autoPlay
                muted={videoMuted}
                className="w-full h-full"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/50">
                <Play className="h-16 w-16" />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between p-4 border-t bg-muted/30">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {videoContent?.video_duration_seconds && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatVideoDuration(videoContent.video_duration_seconds)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setVideoMuted(!videoMuted)}>
                {videoMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editModuleOpen} onOpenChange={setEditModuleOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Module</DialogTitle>
            <DialogDescription>Update module metadata. Changes apply immediately after save.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="m-title">Title</Label>
              <Input
                id="m-title"
                value={moduleForm.title}
                onChange={(e) => setModuleForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="m-desc">Description</Label>
              <Textarea
                id="m-desc"
                rows={4}
                value={moduleForm.description}
                onChange={(e) => setModuleForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="m-order">Module Order</Label>
                <Input
                  id="m-order"
                  type="number"
                  min={0}
                  value={moduleForm.module_order}
                  onChange={(e) => setModuleForm((f) => ({ ...f, module_order: parseInt(e.target.value, 10) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="m-dur">Duration (minutes)</Label>
                <Input
                  id="m-dur"
                  type="number"
                  min={0}
                  value={moduleForm.estimated_duration_minutes}
                  onChange={(e) =>
                    setModuleForm((f) => ({ ...f, estimated_duration_minutes: parseInt(e.target.value, 10) || 0 }))
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Switch
                id="m-active"
                checked={moduleForm.is_active}
                onCheckedChange={(v) => setModuleForm((f) => ({ ...f, is_active: v }))}
              />
              <Label htmlFor="m-active">Active module</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModuleOpen(false)} disabled={savingModule}>
              Cancel
            </Button>
            <Button onClick={() => void saveModule()} disabled={savingModule}>
              {savingModule ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editContentOpen} onOpenChange={(open) => { setEditContentOpen(open); if (!open) { setEditingContentId(null); setContentForm(null) } }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>Update this content item. Use valid JSON for quiz questions when applicable.</DialogDescription>
          </DialogHeader>
          {contentForm && (
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={contentForm.content_type}
                    onValueChange={(v: TrainingApiContentType) =>
                      setContentForm((f) => (f ? { ...f, content_type: v } : f))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEXT">TEXT</SelectItem>
                      <SelectItem value="VIDEO">VIDEO</SelectItem>
                      <SelectItem value="IMAGE">IMAGE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-order">Content Order</Label>
                  <Input
                    id="c-order"
                    type="number"
                    min={0}
                    value={contentForm.content_order}
                    onChange={(e) =>
                      setContentForm((f) =>
                        f ? { ...f, content_order: parseInt(e.target.value, 10) || 0 } : f
                      )
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-title">Title</Label>
                <Input
                  id="c-title"
                  value={contentForm.title}
                  onChange={(e) => setContentForm((f) => (f ? { ...f, title: e.target.value } : f))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-body">Content / URL</Label>
                <Textarea
                  id="c-body"
                  rows={4}
                  value={contentForm.content}
                  onChange={(e) => setContentForm((f) => (f ? { ...f, content: e.target.value } : f))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="c-vdur">Video Duration (seconds)</Label>
                  <Input
                    id="c-vdur"
                    type="number"
                    min={0}
                    value={contentForm.video_duration_seconds}
                    onChange={(e) =>
                      setContentForm((f) =>
                        f ? { ...f, video_duration_seconds: parseInt(e.target.value, 10) || 0 } : f
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-pass">Passing Score (%)</Label>
                  <Input
                    id="c-pass"
                    type="number"
                    min={0}
                    max={100}
                    value={contentForm.passing_score}
                    onChange={(e) =>
                      setContentForm((f) => (f ? { ...f, passing_score: parseInt(e.target.value, 10) || 0 } : f))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-thumb">Thumbnail URL</Label>
                <Input
                  id="c-thumb"
                  value={contentForm.thumbnail_url}
                  onChange={(e) => setContentForm((f) => (f ? { ...f, thumbnail_url: e.target.value } : f))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-quiz">Quiz Questions (JSON)</Label>
                <Textarea
                  id="c-quiz"
                  rows={5}
                  className="font-mono text-sm"
                  value={contentForm.quiz_questions_json}
                  onChange={(e) => setContentForm((f) => (f ? { ...f, quiz_questions_json: e.target.value } : f))}
                />
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Switch
                  id="c-req"
                  checked={contentForm.is_required}
                  onCheckedChange={(v) => setContentForm((f) => (f ? { ...f, is_required: v } : f))}
                />
                <Label htmlFor="c-req">Required</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditContentOpen(false)} disabled={savingContent}>
              Cancel
            </Button>
            <Button onClick={() => void saveContent()} disabled={savingContent || !contentForm}>
              {savingContent ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Content"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        isOpen={deleteModuleOpen}
        onClose={() => !deletingModule && setDeleteModuleOpen(false)}
        onConfirm={() => void runDeleteModule()}
        title="Delete Training Module?"
        description={`This will permanently remove "${localModule.title}" and cannot be undone.`}
        confirmText="Delete Module"
        confirmVariant="destructive"
        isLoading={deletingModule}
        preventClose={deletingModule}
      />

      <ConfirmationModal
        isOpen={deleteContentOpen}
        onClose={() => !deletingContent && setDeleteContentOpen(false)}
        onConfirm={() => void runDeleteContent()}
        title="Delete Content?"
        description="This content item will be removed from the module."
        confirmText="Delete Content"
        confirmVariant="destructive"
        isLoading={deletingContent}
        preventClose={deletingContent}
      />
    </div>
  )
}
