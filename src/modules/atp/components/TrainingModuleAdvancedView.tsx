import { ArrowLeft, Clock, User, Calendar, Play, FileText, Image, CheckCircle } from "lucide-react"
import { Button } from "@/modules/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card"
import { Badge } from "@/modules/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/shared/components/ui/tabs"
import { TrainingModule } from "../models/training.models"

interface TrainingModuleAdvancedViewProps {
  module: TrainingModule
  onBack: () => void
}

export function TrainingModuleAdvancedView({ module, onBack }: TrainingModuleAdvancedViewProps) {
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Play className="h-4 w-4 text-blue-600" />
      case 'TEXT':
        return <FileText className="h-4 w-4 text-green-600" />
      case 'IMAGE':
        return <Image className="h-4 w-4 text-purple-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'TEXT':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'IMAGE':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const renderContentPreview = (content: any) => {
    switch (content.content_type) {
      case 'VIDEO':
        return (
          <div className="space-y-2">
            {content.thumbnail_url && (
              <img 
                src={content.thumbnail_url} 
                alt={content.title}
                className="w-full h-32 object-cover rounded"
              />
            )}
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {Math.floor((content.video_duration_seconds || 0) / 60)}:{String((content.video_duration_seconds || 0) % 60).padStart(2, '0')}
            </div>
          </div>
        )
      case 'IMAGE':
        return (
          <div className="space-y-2">
            <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
              <Image className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Image content</p>
          </div>
        )
      case 'TEXT':
        return (
          <div className="space-y-2">
            <div className="w-full h-32 bg-gray-50 rounded p-3 overflow-hidden">
              <p className="text-sm text-gray-700 line-clamp-6">
                {content.content || "Text content will be displayed here..."}
              </p>
            </div>
          </div>
        )
      default:
        return <div className="text-sm text-gray-500">Content preview not available</div>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Training Modules
          </Button>
        </div>
        <Badge variant={module.is_active ? "default" : "secondary"}>
          {module.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Module Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{module.title}</h1>
            <p className="text-gray-600 mb-4">{module.description}</p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {module.estimated_duration_minutes} minutes
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                Module #{module.module_order}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created {new Date(module.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content ({module.contents.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Module Statistics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Module Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{module.contents.length}</div>
                    <div className="text-sm text-blue-600">Total Content</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {module.contents.filter(c => c.is_required).length}
                    </div>
                    <div className="text-sm text-green-600">Required</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {module.estimated_duration_minutes}
                    </div>
                    <div className="text-sm text-purple-600">Minutes</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {Array.from(new Set(module.contents.map(c => c.content_type))).length}
                    </div>
                    <div className="text-sm text-orange-600">Content Types</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Types Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Content Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(module.contents.map(c => c.content_type))).map(type => {
                    const count = module.contents.filter(c => c.content_type === type).length
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getContentTypeIcon(type)}
                          <span className="ml-2 text-sm">{type}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Details */}
          <Card>
            <CardHeader>
              <CardTitle>Module Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Module Order</label>
                    <p className="text-sm text-gray-900">#{module.module_order}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <p className="text-sm text-gray-900">
                      <Badge variant={module.is_active ? "default" : "secondary"}>
                        {module.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Estimated Duration</label>
                    <p className="text-sm text-gray-900">{module.estimated_duration_minutes} minutes</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Created By</label>
                    <p className="text-sm text-gray-900">User ID: {module.created_by}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Created At</label>
                    <p className="text-sm text-gray-900">
                      {new Date(module.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-sm text-gray-900">
                      {new Date(module.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {module.contents
              .sort((a, b) => a.content_order - b.content_order)
              .map((content) => (
                <Card key={content.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getContentTypeColor(content.content_type)}>
                          <div className="flex items-center">
                            {getContentTypeIcon(content.content_type)}
                            <span className="ml-1">{content.content_type}</span>
                          </div>
                        </Badge>
                        {content.is_required && (
                          <Badge variant="outline" className="text-red-600 border-red-200">
                            Required
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {renderContentPreview(content)}
                      
                      <div className="text-sm text-gray-500">
                        Order: {content.content_order}
                      </div>

                      {content.quiz_questions && (
                        <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          Includes quiz (Passing score: {content.passing_score}%)
                        </div>
                      )}

                      <div className="text-xs text-gray-400">
                        Updated: {new Date(content.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">145</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">+3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Time Spent</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42m</div>
                <p className="text-xs text-muted-foreground">-2m from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quiz Success Rate</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">John Doe completed the module</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                  <Badge>Completed</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">Sarah Smith started the module</p>
                    <p className="text-sm text-gray-500">4 hours ago</p>
                  </div>
                  <Badge variant="outline">In Progress</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">Mike Johnson passed the quiz</p>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                  <Badge>Passed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}