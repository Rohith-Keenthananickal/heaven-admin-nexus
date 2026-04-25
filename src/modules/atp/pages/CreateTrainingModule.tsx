import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Accept } from "react-dropzone"
import {
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  Video,
  Image as ImageIcon,
  HelpCircle,
  Save,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Clock,
  Layers,
  CheckCircle2,
  BookOpen,
  Sparkles,
} from "lucide-react"
import { Button } from "@/modules/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/shared/components/ui/card"
import { Input } from "@/modules/shared/components/ui/input"
import { Label } from "@/modules/shared/components/ui/label"
import { Textarea } from "@/modules/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/shared/components/ui/select"
import { Switch } from "@/modules/shared/components/ui/switch"
import { Badge } from "@/modules/shared/components/ui/badge"
import { useToast } from "@/modules/shared/hooks/use-toast"
import type { TrainingFormContentType, TrainingModuleFormContent, TrainingModuleFormValues } from "../models/training.models"
import { toCreateTrainingModulePayload } from "../models/training.models"
import { trainingService } from "../services/training.service"
import { FileUploadDropzone } from "@/modules/shared/components/FileUploadDropzone"
import { uploadService, type ImageUploadType } from "@/modules/shared/services/upload.service"
import { DashboardLayout } from "@/modules/dashboard/components/DashboardLayout"
import { cn } from "@/modules/shared/lib/utils"

function acceptForMainContent(contentType: TrainingFormContentType): Accept | undefined {
  switch (contentType) {
    case "VIDEO":
      return { "video/*": [] }
    case "IMAGE":
      return { "image/*": [] }
    case "DOCUMENT":
      return {
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      }
    default:
      return undefined
  }
}

const acceptThumbnail: Accept = { "image/*": [] }

const contentTypeConfig: Record<
  TrainingFormContentType,
  { icon: typeof FileText; label: string; color: string; bgColor: string }
> = {
  TEXT: { icon: FileText, label: "Text", color: "text-blue-600", bgColor: "bg-blue-50" },
  VIDEO: { icon: Video, label: "Video", color: "text-purple-600", bgColor: "bg-purple-50" },
  IMAGE: { icon: ImageIcon, label: "Image", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  DOCUMENT: { icon: FileText, label: "Document", color: "text-amber-600", bgColor: "bg-amber-50" },
  QUIZ: { icon: HelpCircle, label: "Quiz", color: "text-rose-600", bgColor: "bg-rose-50" },
}

export default function CreateTrainingModule() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [formData, setFormData] = useState<TrainingModuleFormValues>({
    title: "",
    description: "",
    module_order: 1,
    is_active: true,
    estimated_duration_minutes: 30,
    contents: [],
  })

  const [loading, setLoading] = useState(false)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [expandedContent, setExpandedContent] = useState<number | null>(null)

  const handleInputChange = (field: keyof TrainingModuleFormValues, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addContent = (type: TrainingFormContentType = "TEXT") => {
    const newContent: TrainingModuleFormContent = {
      content_type: type,
      title: "",
      content: "",
      content_order: formData.contents.length + 1,
      is_required: true,
    }
    setFormData((prev) => ({ ...prev, contents: [...prev.contents, newContent] }))
    setExpandedContent(formData.contents.length)
  }

  const updateContent = (index: number, field: keyof TrainingModuleFormContent, value: unknown) => {
    const updatedContents = [...formData.contents]
    updatedContents[index] = { ...updatedContents[index], [field]: value }
    setFormData((prev) => ({ ...prev, contents: updatedContents }))
  }

  const removeContent = (index: number) => {
    const updatedContents = formData.contents.filter((_, i) => i !== index)
    updatedContents.forEach((content, i) => {
      content.content_order = i + 1
    })
    setFormData((prev) => ({ ...prev, contents: updatedContents }))
    if (expandedContent === index) setExpandedContent(null)
  }

  const moveContent = (index: number, direction: "up" | "down") => {
    const updatedContents = [...formData.contents]
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < updatedContents.length) {
      ;[updatedContents[index], updatedContents[newIndex]] = [updatedContents[newIndex], updatedContents[index]]
      updatedContents.forEach((content, i) => {
        content.content_order = i + 1
      })
      setFormData((prev) => ({ ...prev, contents: updatedContents }))
      setExpandedContent(newIndex)
    }
  }

  const resolveUploadImageType = (contentType: TrainingFormContentType, slot: "content" | "thumbnail"): ImageUploadType => {
    if (slot === "thumbnail") return "image"
    switch (contentType) {
      case "VIDEO":
        return "video"
      case "IMAGE":
        return "image"
      case "DOCUMENT":
        return "document"
      default:
        return "document"
    }
  }

  const runUploadForSlot = async (index: number, slot: "content" | "thumbnail", file: File) => {
    const row = formData.contents[index]
    const key = `${index}-${slot}`
    setUploadingKey(key)
    try {
      const imageType = resolveUploadImageType(row.content_type, slot)
      const url = await uploadService.uploadFile(file, imageType)
      if (slot === "content") {
        updateContent(index, "content", url)
      } else {
        updateContent(index, "thumbnail_url", url)
      }
      toast({ title: "File uploaded", description: `${file.name} uploaded successfully.` })
    } catch {
      // Error toast is handled by the shared API interceptor
    } finally {
      setUploadingKey(null)
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" })
      return
    }

    for (let i = 0; i < formData.contents.length; i++) {
      const c = formData.contents[i]
      if (!c.title.trim()) {
        toast({ title: "Error", description: `Content #${i + 1}: title is required.`, variant: "destructive" })
        return
      }
      if (c.content_type === "VIDEO" || c.content_type === "IMAGE" || c.content_type === "DOCUMENT") {
        if (!c.content.trim()) {
          toast({ title: "Error", description: `Content #${i + 1}: upload a file or provide a URL.`, variant: "destructive" })
          return
        }
      }
    }

    setLoading(true)
    try {
      const payload = toCreateTrainingModulePayload(formData)
      const res = await trainingService.createModule(payload)
      if (res?.data?.id != null) {
        toast({ title: "Success", description: res.message ?? "Training module created successfully." })
        navigate("/training-modules")
      } else {
        toast({ title: "Error", description: res?.message ?? "Unexpected response from server.", variant: "destructive" })
      }
    } catch {
      // Error toast handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  const getContentConfig = (type: TrainingFormContentType) => contentTypeConfig[type] || contentTypeConfig.TEXT

  const completedContents = formData.contents.filter((c) => c.title.trim()).length
  const progress = formData.title && formData.description ? (completedContents / Math.max(formData.contents.length, 1)) * 100 : 0

  return (
    <DashboardLayout
      title="Create Training Module"
      action={
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Creating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Create Module
            </>
          )}
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/training-modules")}
          className="group -ml-2 gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Training Modules
        </Button>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          {/* Main Form Area */}
          <div className="space-y-6 xl:col-span-8">
            {/* Module Information Card */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Module Details</CardTitle>
                    <CardDescription>Basic information about your training module</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Module Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Introduction to Hospitality"
                      className="h-11 transition-shadow focus:shadow-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="module_order" className="text-sm font-medium">
                      Display Order
                    </Label>
                    <Input
                      id="module_order"
                      type="number"
                      value={formData.module_order}
                      onChange={(e) => handleInputChange("module_order", parseInt(e.target.value) || 1)}
                      min={1}
                      className="h-11 transition-shadow focus:shadow-md"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Provide a brief overview of what this module covers..."
                    rows={4}
                    className="resize-none transition-shadow focus:shadow-md"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-sm font-medium">
                      Estimated Duration
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="duration"
                        type="number"
                        value={formData.estimated_duration_minutes}
                        onChange={(e) => handleInputChange("estimated_duration_minutes", parseInt(e.target.value) || 0)}
                        min={1}
                        className="h-11 pl-10 transition-shadow focus:shadow-md"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">minutes</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-4 pb-2">
                    <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
                      <Switch
                        id="active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                      />
                      <Label htmlFor="active" className="cursor-pointer text-sm font-medium">
                        {formData.is_active ? "Active" : "Inactive"}
                      </Label>
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full transition-colors",
                          formData.is_active ? "bg-emerald-500" : "bg-muted-foreground/40"
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Module Contents Card */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-pink-400" />
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                      <Layers className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Module Contents</CardTitle>
                      <CardDescription>Add and organize your training materials</CardDescription>
                    </div>
                  </div>
                  {formData.contents.length > 0 && (
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                      <Layers className="h-3.5 w-3.5" />
                      {formData.contents.length} item{formData.contents.length !== 1 && "s"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.contents.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/20 px-6 py-12 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                      <Sparkles className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">No content yet</h3>
                    <p className="mb-6 text-sm text-muted-foreground">
                      Start building your module by adding different types of content
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {(["TEXT", "VIDEO", "IMAGE", "DOCUMENT", "QUIZ"] as TrainingFormContentType[]).map((type) => {
                        const config = getContentConfig(type)
                        const Icon = config.icon
                        return (
                          <Button
                            key={type}
                            variant="outline"
                            size="sm"
                            onClick={() => addContent(type)}
                            className={cn("gap-2 transition-all hover:scale-105", config.bgColor, config.color, "border-current/20 hover:bg-current/10")}
                          >
                            <Icon className="h-4 w-4" />
                            {config.label}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.contents.map((content, index) => {
                      const config = getContentConfig(content.content_type)
                      const Icon = config.icon
                      const isExpanded = expandedContent === index

                      return (
                        <div
                          key={index}
                          className={cn(
                            "group overflow-hidden rounded-xl border bg-card transition-all",
                            isExpanded ? "shadow-lg ring-2 ring-primary/20" : "hover:shadow-md"
                          )}
                        >
                          {/* Collapsed Header */}
                          <div
                            className="flex cursor-pointer items-center gap-3 p-4"
                            onClick={() => setExpandedContent(isExpanded ? null : index)}
                          >
                            <div className="flex items-center gap-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", config.bgColor)}>
                              <Icon className={cn("h-4 w-4", config.color)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium truncate">
                                  {content.title || `Untitled ${config.label}`}
                                </span>
                                {content.is_required && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className={config.color}>{config.label}</span>
                                <span>•</span>
                                <span>#{content.content_order}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {index > 0 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    moveContent(index, "up")
                                  }}
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                              )}
                              {index < formData.contents.length - 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    moveContent(index, "down")
                                  }}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeContent(index)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <div className={cn("transition-transform", isExpanded && "rotate-180")}>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                          </div>

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="border-t bg-muted/20 p-4 space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Content Type</Label>
                                  <Select
                                    value={content.content_type}
                                    onValueChange={(value: TrainingFormContentType) =>
                                      updateContent(index, "content_type", value)
                                    }
                                  >
                                    <SelectTrigger className="h-10">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {(["TEXT", "VIDEO", "IMAGE", "DOCUMENT", "QUIZ"] as TrainingFormContentType[]).map(
                                        (type) => {
                                          const c = getContentConfig(type)
                                          const TypeIcon = c.icon
                                          return (
                                            <SelectItem key={type} value={type}>
                                              <div className="flex items-center gap-2">
                                                <TypeIcon className={cn("h-4 w-4", c.color)} />
                                                {c.label}
                                              </div>
                                            </SelectItem>
                                          )
                                        }
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">
                                    Title <span className="text-destructive">*</span>
                                  </Label>
                                  <Input
                                    value={content.title}
                                    onChange={(e) => updateContent(index, "title", e.target.value)}
                                    placeholder="Enter content title"
                                    className="h-10"
                                  />
                                </div>
                              </div>

                              {content.content_type === "TEXT" && (
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Content</Label>
                                  <Textarea
                                    value={content.content}
                                    onChange={(e) => updateContent(index, "content", e.target.value)}
                                    placeholder="Enter your text content here..."
                                    rows={5}
                                    className="resize-none"
                                  />
                                </div>
                              )}

                              {(content.content_type === "VIDEO" ||
                                content.content_type === "DOCUMENT" ||
                                content.content_type === "IMAGE") && (
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                      Upload {config.label}
                                    </Label>
                                    <FileUploadDropzone
                                      idPrefix={`training-main-${index}`}
                                      accept={acceptForMainContent(content.content_type)}
                                      disabled={loading}
                                      uploading={uploadingKey === `${index}-content`}
                                      label={`Upload ${config.label.toLowerCase()}`}
                                      description="Drag and drop or click to browse"
                                      valuePreview={content.content || undefined}
                                      onFileAccepted={(file) => runUploadForSlot(index, "content", file)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">Thumbnail (optional)</Label>
                                    <FileUploadDropzone
                                      idPrefix={`training-thumb-${index}`}
                                      accept={acceptThumbnail}
                                      disabled={loading}
                                      uploading={uploadingKey === `${index}-thumbnail`}
                                      label="Upload thumbnail"
                                      description="PNG, JPG, or WebP"
                                      valuePreview={content.thumbnail_url || undefined}
                                      onFileAccepted={(file) => runUploadForSlot(index, "thumbnail", file)}
                                    />
                                  </div>
                                </div>
                              )}

                              {content.content_type === "VIDEO" && (
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Video Duration</Label>
                                  <div className="relative max-w-xs">
                                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                      type="number"
                                      value={content.video_duration_seconds || ""}
                                      onChange={(e) =>
                                        updateContent(index, "video_duration_seconds", parseInt(e.target.value, 10) || 0)
                                      }
                                      placeholder="Duration"
                                      className="h-10 pl-10"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                      seconds
                                    </span>
                                  </div>
                                </div>
                              )}

                              {content.content_type === "QUIZ" && (
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">Quiz Questions (JSON)</Label>
                                    <Textarea
                                      value={JSON.stringify(content.quiz_questions || {}, null, 2)}
                                      onChange={(e) => {
                                        try {
                                          const questions = JSON.parse(e.target.value)
                                          updateContent(index, "quiz_questions", questions)
                                        } catch {
                                          // Invalid JSON
                                        }
                                      }}
                                      placeholder='{"question1": {"question": "...", "options": [...], "correct": 0}}'
                                      rows={6}
                                      className="font-mono text-sm"
                                    />
                                  </div>
                                  <div className="space-y-2 max-w-xs">
                                    <Label className="text-sm font-medium">Passing Score</Label>
                                    <div className="relative">
                                      <Input
                                        type="number"
                                        value={content.passing_score || ""}
                                        onChange={(e) => updateContent(index, "passing_score", parseInt(e.target.value) || 0)}
                                        placeholder="80"
                                        min={0}
                                        max={100}
                                        className="h-10 pr-8"
                                      />
                                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        %
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3">
                                <Switch
                                  id={`required-${index}`}
                                  checked={content.is_required}
                                  onCheckedChange={(checked) => updateContent(index, "is_required", checked)}
                                />
                                <Label htmlFor={`required-${index}`} className="cursor-pointer text-sm">
                                  Mark as required content
                                </Label>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {/* Add Content Button */}
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        className="w-full gap-2 border-dashed py-6 text-muted-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
                        onClick={() => addContent()}
                      >
                        <Plus className="h-5 w-5" />
                        Add Content Block
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 xl:col-span-4">
            {/* Progress Card */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400" />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">Module Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <div className="text-2xl font-bold text-foreground">{formData.contents.length}</div>
                    <div className="text-xs text-muted-foreground">Content Items</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <div className="text-2xl font-bold text-foreground">{formData.estimated_duration_minutes}</div>
                    <div className="text-xs text-muted-foreground">Minutes</div>
                  </div>
                </div>

                {/* Module Info */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-muted-foreground">Title</span>
                    <span className="text-sm font-medium text-right max-w-[60%] truncate">
                      {formData.title || "Untitled"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={formData.is_active ? "default" : "secondary"} className="gap-1">
                      <div className={cn("h-1.5 w-1.5 rounded-full", formData.is_active ? "bg-white" : "bg-muted-foreground/50")} />
                      {formData.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Order</span>
                    <span className="text-sm font-medium">#{formData.module_order}</span>
                  </div>
                </div>

                {/* Content Types */}
                {formData.contents.length > 0 && (
                  <div className="space-y-2 pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Content Types</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from(new Set(formData.contents.map((c) => c.content_type))).map((type) => {
                        const config = getContentConfig(type)
                        const Icon = config.icon
                        const count = formData.contents.filter((c) => c.content_type === type).length
                        return (
                          <Badge
                            key={type}
                            variant="outline"
                            className={cn("gap-1.5 px-2.5", config.bgColor, config.color, "border-current/20")}
                          >
                            <Icon className="h-3 w-3" />
                            {config.label}
                            <span className="ml-1 rounded-full bg-current/10 px-1.5 text-[10px]">{count}</span>
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Add Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Add</CardTitle>
                <CardDescription>Click to add content blocks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {(["TEXT", "VIDEO", "IMAGE", "DOCUMENT", "QUIZ"] as TrainingFormContentType[]).map((type) => {
                    const config = getContentConfig(type)
                    const Icon = config.icon
                    return (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        onClick={() => addContent(type)}
                        className={cn(
                          "h-auto flex-col gap-2 py-4 transition-all hover:scale-[1.02]",
                          config.bgColor,
                          config.color,
                          "border-current/20 hover:bg-current/10"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-medium">{config.label}</span>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
