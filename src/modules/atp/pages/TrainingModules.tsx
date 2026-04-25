import { useState, useEffect, useCallback } from "react"
import {
  Eye,
  Search,
  Clock,
  Play,
  FileText,
  Image,
  Plus,
  Loader2,
  AlertCircle,
  BookOpen,
  Layers,
  CheckCircle2,
  Filter,
  LayoutGrid,
  List,
  RefreshCw,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/modules/shared/components/ui/input"
import { Button } from "@/modules/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/shared/components/ui/card"
import { Badge } from "@/modules/shared/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/shared/components/ui/select"
import type { TrainingModule } from "../models/training.models"
import { TrainingModuleAdvancedView } from "../components/TrainingModuleAdvancedView"
import { DashboardLayout } from "@/modules/dashboard/components/DashboardLayout"
import { trainingService } from "../services/training.service"
import { formatLongDate } from "@/modules/shared/lib/formatLongDate"
import { cn } from "@/modules/shared/lib/utils"

const DEFAULT_LIMIT = 100

const contentTypeConfig: Record<string, { icon: typeof FileText; color: string; bgColor: string }> = {
  TEXT: { icon: FileText, color: "text-emerald-600", bgColor: "bg-emerald-50" },
  VIDEO: { icon: Play, color: "text-blue-600", bgColor: "bg-blue-50" },
  IMAGE: { icon: Image, color: "text-purple-600", bgColor: "bg-purple-50" },
}

export default function TrainingModules() {
  const navigate = useNavigate()
  const [modules, setModules] = useState<TrainingModule[]>([])
  const [filteredModules, setFilteredModules] = useState<TrainingModule[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null)
  const [detailModule, setDetailModule] = useState<TrainingModule | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  const [showAdvancedView, setShowAdvancedView] = useState(false)
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  const fetchModules = useCallback(async () => {
    try {
      setLoading(true)
      setListError(null)
      const active_only = statusFilter === "active"
      const res = await trainingService.listModules({ limit, active_only })

      if (res?.status === "success" && Array.isArray(res.data)) {
        let list = res.data
        if (statusFilter === "inactive") {
          list = list.filter((m) => !m.is_active)
        }
        setModules(list)
      } else {
        setModules([])
        setListError(res?.message ?? "Could not load training modules.")
      }
    } catch {
      setModules([])
    } finally {
      setLoading(false)
    }
  }, [limit, statusFilter])

  useEffect(() => {
    void fetchModules()
  }, [fetchModules])

  useEffect(() => {
    let list = modules
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      list = list.filter(
        (m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
      )
    }
    setFilteredModules(list)
  }, [searchTerm, modules])

  useEffect(() => {
    if (!showAdvancedView || selectedModuleId == null) return

    let cancelled = false
    const loadDetail = async () => {
      setDetailLoading(true)
      setDetailError(null)
      setDetailModule(null)
      try {
        const res = await trainingService.getModuleById(selectedModuleId)
        if (cancelled) return
        if (res?.status === "success" && res.data?.id != null) {
          setDetailModule(res.data)
        } else {
          setDetailError(res?.message ?? "Module could not be loaded.")
        }
      } catch {
        if (!cancelled) {
          setDetailError("Module could not be loaded.")
        }
      } finally {
        if (!cancelled) setDetailLoading(false)
      }
    }

    void loadDetail()
    return () => {
      cancelled = true
    }
  }, [showAdvancedView, selectedModuleId])

  const handleViewDetails = (module: TrainingModule) => {
    setSelectedModuleId(module.id)
    setShowAdvancedView(true)
  }

  const handleBackFromDetail = () => {
    setShowAdvancedView(false)
    setSelectedModuleId(null)
    setDetailModule(null)
    setDetailError(null)
    void fetchModules()
  }

  const totalContent = modules.reduce((acc, m) => acc + (m.contents?.length ?? 0), 0)
  const activeModules = modules.filter((m) => m.is_active).length
  const avgDuration =
    modules.length > 0
      ? Math.round(modules.reduce((acc, m) => acc + m.estimated_duration_minutes, 0) / modules.length)
      : 0

  if (showAdvancedView && selectedModuleId != null) {
    return (
      <DashboardLayout title="Training Module Details">
        {detailLoading ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full bg-primary/20" />
              <Loader2 className="relative h-16 w-16 animate-spin text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Loading module details…</p>
          </div>
        ) : detailError || !detailModule ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Unable to load module</h3>
              <p className="max-w-md text-sm text-muted-foreground">{detailError ?? "Module not found."}</p>
            </div>
            <Button variant="outline" onClick={handleBackFromDetail} className="gap-2">
              Back to modules
            </Button>
          </div>
        ) : (
          <TrainingModuleAdvancedView module={detailModule} onBack={handleBackFromDetail} />
        )}
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Training Modules"
      action={
        <Button
          onClick={() => navigate("/training-modules/create")}
          className="gap-2 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          <Plus className="h-4 w-4" />
          Create Module
        </Button>
      }
    >
      <div className="space-y-8">
        <p className="text-muted-foreground">Manage and organize training content for area coordinators</p>

        {listError && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
            <span className="flex-1 text-sm text-destructive">{listError}</span>
            <Button variant="outline" size="sm" onClick={() => void fetchModules()} className="shrink-0 gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-400" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{modules.length}</div>
              <p className="mt-1 text-xs text-muted-foreground">Training modules available</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeModules}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {modules.length > 0 ? Math.round((activeModules / modules.length) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md">
            <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-400" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Content Items</CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
                <Layers className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalContent}</div>
              <p className="mt-1 text-xs text-muted-foreground">Videos, texts & images</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md">
            <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-400" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgDuration}m</div>
              <p className="mt-1 text-xs text-muted-foreground">Minutes per module</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={String(limit)} onValueChange={(v) => setLimit(parseInt(v, 10))}>
              <SelectTrigger className="w-full sm:w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 items</SelectItem>
                <SelectItem value="50">50 items</SelectItem>
                <SelectItem value="100">100 items</SelectItem>
                <SelectItem value="200">200 items</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-9 w-9"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-9 w-9"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className={cn(viewMode === "grid" ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-3")}>
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                {viewMode === "grid" && <div className="h-40 bg-muted" />}
                <CardHeader className={viewMode === "list" ? "py-4" : ""}>
                  <div className="h-5 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </CardHeader>
                {viewMode === "grid" && (
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 rounded bg-muted" />
                      <div className="h-4 w-2/3 rounded bg-muted" />
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/20 px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No training modules found</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first training module"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={() => navigate("/training-modules/create")} className="mt-6 gap-2">
                <Plus className="h-4 w-4" />
                Create Module
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredModules.map((module) => {
              const thumbnail = module.contents?.find((c) => c.thumbnail_url)?.thumbnail_url
              const contentTypes = Array.from(new Set((module.contents ?? []).map((c) => c.content_type)))
              return (
                <Card
                  key={module.id}
                  className="group cursor-pointer overflow-hidden border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
                  onClick={() => handleViewDetails(module)}
                >
                  <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                    {thumbnail ? (
                      <img src={thumbnail} alt={module.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-16 w-16 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-0 font-medium",
                          module.is_active
                            ? "bg-emerald-500/90 text-white"
                            : "bg-slate-500/90 text-white"
                        )}
                      >
                        {module.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-xs font-medium text-white/90">#{module.module_order}</span>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 text-lg">{module.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{module.estimated_duration_minutes} min</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Layers className="h-4 w-4" />
                        <span>{module.contents?.length ?? 0} items</span>
                      </div>
                    </div>
                    {contentTypes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {contentTypes.map((type) => {
                          const config = contentTypeConfig[type] || contentTypeConfig.TEXT
                          const Icon = config.icon
                          return (
                            <Badge key={type} variant="outline" className={cn("gap-1 px-2 py-0.5", config.bgColor, config.color, "border-current/20")}>
                              <Icon className="h-3 w-3" />
                              <span className="text-xs">{type}</span>
                            </Badge>
                          )
                        })}
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t pt-3">
                      <span className="text-xs text-muted-foreground">{formatLongDate(module.created_at)}</span>
                      <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-primary">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredModules.map((module) => {
              const contentTypes = Array.from(new Set((module.contents ?? []).map((c) => c.content_type)))
              return (
                <Card
                  key={module.id}
                  className="cursor-pointer border-0 shadow-sm transition-all hover:shadow-md"
                  onClick={() => handleViewDetails(module)}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                      module.is_active ? "bg-emerald-50" : "bg-slate-100"
                    )}>
                      <BookOpen className={cn("h-6 w-6", module.is_active ? "text-emerald-600" : "text-slate-400")} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{module.title}</h3>
                        <Badge variant={module.is_active ? "default" : "secondary"} className="shrink-0">
                          {module.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground truncate">{module.description}</p>
                    </div>
                    <div className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{module.estimated_duration_minutes}m</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Layers className="h-4 w-4" />
                        <span>{module.contents?.length ?? 0}</span>
                      </div>
                      <div className="flex gap-1">
                        {contentTypes.slice(0, 3).map((type) => {
                          const config = contentTypeConfig[type] || contentTypeConfig.TEXT
                          const Icon = config.icon
                          return <Icon key={type} className={cn("h-4 w-4", config.color)} />
                        })}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="shrink-0 gap-1.5">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {!loading && filteredModules.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Showing {filteredModules.length} of {modules.length} module{modules.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </DashboardLayout>
  )
}
