import { useState, useEffect } from "react"
import { Eye, Search, Filter, Clock, Play, FileText, Image, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import defaultThumbnail from "@/assets/training-module-default.jpg"
import { Input } from "@/modules/shared/components/ui/input"
import { Button } from "@/modules/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card"
import { Badge } from "@/modules/shared/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/shared/components/ui/select"
import { TrainingModule } from "../models/training.models"
import { TrainingModuleAdvancedView } from "../components/TrainingModuleAdvancedView"

// Mock data for now
const mockTrainingModules: TrainingModule[] = [
  {
    id: 1,
    title: "Hospitality Fundamentals",
    description: "Learn the basics of hospitality management and guest service excellence",
    module_order: 1,
    is_active: true,
    estimated_duration_minutes: 45,
    created_by: 1,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    contents: [
      {
        id: 1,
        module_id: 1,
        content_type: "VIDEO",
        title: "Introduction to Hospitality",
        content: "https://example.com/video1",
        content_order: 1,
        is_required: true,
        video_duration_seconds: 1200,
        thumbnail_url: "https://example.com/thumb1",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z"
      },
      {
        id: 2,
        module_id: 1,
        content_type: "TEXT",
        title: "Service Standards",
        content: "Detailed guide on service standards...",
        content_order: 2,
        is_required: true,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z"
      }
    ]
  },
  {
    id: 2,
    title: "Property Management",
    description: "Complete guide to managing properties and maintaining quality standards",
    module_order: 2,
    is_active: true,
    estimated_duration_minutes: 60,
    created_by: 1,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
    contents: [
      {
        id: 3,
        module_id: 2,
        content_type: "IMAGE",
        title: "Property Inspection Checklist",
        content: "https://example.com/checklist.jpg",
        content_order: 1,
        is_required: true,
        created_at: "2024-01-20T10:00:00Z",
        updated_at: "2024-01-20T10:00:00Z"
      }
    ]
  }
]

export default function TrainingModules() {
  const navigate = useNavigate()
  const [modules, setModules] = useState<TrainingModule[]>([])
  const [filteredModules, setFilteredModules] = useState<TrainingModule[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null)
  const [showAdvancedView, setShowAdvancedView] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchModules = async () => {
      try {
        setLoading(true)
        // Replace with actual API call
        setTimeout(() => {
          setModules(mockTrainingModules)
          setFilteredModules(mockTrainingModules)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching training modules:", error)
        setLoading(false)
      }
    }

    fetchModules()
  }, [])

  useEffect(() => {
    let filtered = modules

    if (searchTerm) {
      filtered = filtered.filter(module =>
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(module => 
        statusFilter === "active" ? module.is_active : !module.is_active
      )
    }

    setFilteredModules(filtered)
  }, [searchTerm, statusFilter, modules])

  const handleViewDetails = (module: TrainingModule) => {
    setSelectedModule(module)
    setShowAdvancedView(true)
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Play className="h-4 w-4" />
      case 'TEXT':
        return <FileText className="h-4 w-4" />
      case 'IMAGE':
        return <Image className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (showAdvancedView && selectedModule) {
    return (
      <TrainingModuleAdvancedView
        module={selectedModule}
        onBack={() => setShowAdvancedView(false)}
      />
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Modules</h1>
          <p className="text-gray-600 mt-2">Manage and organize training content for area coordinators</p>
        </div>
        <Button onClick={() => navigate('/training-modules/create')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Module
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modules.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modules.filter(m => m.is_active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modules.reduce((acc, m) => acc + m.contents.length, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {modules.length > 0 ? Math.round(modules.reduce((acc, m) => acc + m.estimated_duration_minutes, 0) / modules.length) : 0}m
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Modules Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <Card key={module.id} className="hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                <img 
                  src={module.contents.find(c => c.thumbnail_url)?.thumbnail_url || defaultThumbnail}
                  alt={module.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={module.is_active ? "default" : "secondary"}>
                    {module.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">{module.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {module.estimated_duration_minutes} minutes
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Content:</span>
                    <div className="flex gap-1">
                      {Array.from(new Set(module.contents.map(c => c.content_type))).map(type => (
                        <div key={type} className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                          {getContentTypeIcon(type)}
                          <span className="ml-1">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    {module.contents.length} content item{module.contents.length !== 1 ? 's' : ''}
                  </div>

                  <Button
                    onClick={() => handleViewDetails(module)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredModules.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No training modules found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}