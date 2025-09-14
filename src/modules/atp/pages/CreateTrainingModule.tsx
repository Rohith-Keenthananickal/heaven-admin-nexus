import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Trash2, Upload, FileText, Video, Image as ImageIcon, HelpCircle, Save } from "lucide-react"
import { Button } from "@/modules/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card"
import { Input } from "@/modules/shared/components/ui/input"
import { Label } from "@/modules/shared/components/ui/label"
import { Textarea } from "@/modules/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/shared/components/ui/select"
import { Switch } from "@/modules/shared/components/ui/switch"
import { Badge } from "@/modules/shared/components/ui/badge"
import { Separator } from "@/modules/shared/components/ui/separator"
import { useToast } from "@/modules/shared/hooks/use-toast"

type ContentType = 'TEXT' | 'VIDEO' | 'DOCUMENT' | 'QUIZ'

interface TrainingContent {
  content_type: ContentType
  title: string
  content: string
  content_order: number
  is_required: boolean
  video_duration_seconds?: number
  thumbnail_url?: string
  quiz_questions?: Record<string, any>
  passing_score?: number
}

interface TrainingModuleForm {
  title: string
  description: string
  module_order: number
  is_active: boolean
  estimated_duration_minutes: number
  contents: TrainingContent[]
}

export default function CreateTrainingModule() {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<TrainingModuleForm>({
    title: "",
    description: "",
    module_order: 1,
    is_active: true,
    estimated_duration_minutes: 30,
    contents: []
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: keyof TrainingModuleForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addContent = () => {
    const newContent: TrainingContent = {
      content_type: 'TEXT',
      title: '',
      content: '',
      content_order: formData.contents.length + 1,
      is_required: true
    }
    
    setFormData(prev => ({
      ...prev,
      contents: [...prev.contents, newContent]
    }))
  }

  const updateContent = (index: number, field: keyof TrainingContent, value: any) => {
    const updatedContents = [...formData.contents]
    updatedContents[index] = {
      ...updatedContents[index],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      contents: updatedContents
    }))
  }

  const removeContent = (index: number) => {
    const updatedContents = formData.contents.filter((_, i) => i !== index)
    // Reorder content_order
    updatedContents.forEach((content, i) => {
      content.content_order = i + 1
    })
    setFormData(prev => ({
      ...prev,
      contents: updatedContents
    }))
  }

  const moveContent = (index: number, direction: 'up' | 'down') => {
    const updatedContents = [...formData.contents]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < updatedContents.length) {
      [updatedContents[index], updatedContents[newIndex]] = [updatedContents[newIndex], updatedContents[index]]
      // Update content_order
      updatedContents.forEach((content, i) => {
        content.content_order = i + 1
      })
      setFormData(prev => ({
        ...prev,
        contents: updatedContents
      }))
    }
  }

  const handleFileUpload = (index: number, type: 'content' | 'thumbnail') => {
    // Simulate file upload
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = type === 'thumbnail' ? 'image/*' : '*/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // In real implementation, upload file and get URL
        const mockUrl = `https://example.com/${file.name}`
        if (type === 'content') {
          updateContent(index, 'content', mockUrl)
        } else {
          updateContent(index, 'thumbnail_url', mockUrl)
        }
        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded successfully.`
        })
      }
    }
    input.click()
  }

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="h-4 w-4" />
      case 'TEXT':
        return <FileText className="h-4 w-4" />
      case 'DOCUMENT':
        return <ImageIcon className="h-4 w-4" />
      case 'QUIZ':
        return <HelpCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Success",
        description: "Training module created successfully!"
      })
      
      navigate('/training-modules')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create training module. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/training-modules')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Training Modules
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Training Module</h1>
          <p className="text-gray-600 mt-2">Create a new training module with content</p>
        </div>
        <Button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {loading ? "Creating..." : "Create Module"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter module title"
                  />
                </div>
                <div>
                  <Label htmlFor="module_order">Module Order</Label>
                  <Input
                    id="module_order"
                    type="number"
                    value={formData.module_order}
                    onChange={(e) => handleInputChange('module_order', parseInt(e.target.value))}
                    min={1}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter module description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.estimated_duration_minutes}
                    onChange={(e) => handleInputChange('estimated_duration_minutes', parseInt(e.target.value))}
                    min={1}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                  <Label>Active Module</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Module Contents */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Module Contents</CardTitle>
                <Button onClick={addContent} size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Content
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.contents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No content added yet. Click "Add Content" to get started.</p>
                </div>
              ) : (
                formData.contents.map((content, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getContentTypeIcon(content.content_type)}
                            {content.content_type}
                          </Badge>
                          <Badge variant="secondary">#{content.content_order}</Badge>
                          {content.is_required && <Badge variant="destructive">Required</Badge>}
                        </div>
                        <div className="flex items-center gap-2">
                          {index > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveContent(index, 'up')}
                            >
                              ↑
                            </Button>
                          )}
                          {index < formData.contents.length - 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveContent(index, 'down')}
                            >
                              ↓
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeContent(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Content Type</Label>
                          <Select
                            value={content.content_type}
                            onValueChange={(value: ContentType) => updateContent(index, 'content_type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TEXT">Text</SelectItem>
                              <SelectItem value="VIDEO">Video</SelectItem>
                              <SelectItem value="DOCUMENT">Document</SelectItem>
                              <SelectItem value="QUIZ">Quiz</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={content.title}
                            onChange={(e) => updateContent(index, 'title', e.target.value)}
                            placeholder="Enter content title"
                          />
                        </div>
                      </div>

                      {content.content_type === 'TEXT' && (
                        <div>
                          <Label>Content</Label>
                          <Textarea
                            value={content.content}
                            onChange={(e) => updateContent(index, 'content', e.target.value)}
                            placeholder="Enter text content"
                            rows={4}
                          />
                        </div>
                      )}

                      {(content.content_type === 'VIDEO' || content.content_type === 'DOCUMENT') && (
                        <div className="space-y-4">
                          <div>
                            <Label>File Upload</Label>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleFileUpload(index, 'content')}
                                className="flex items-center gap-2"
                              >
                                <Upload className="h-4 w-4" />
                                Upload {content.content_type === 'VIDEO' ? 'Video' : 'Document'}
                              </Button>
                              {content.content && (
                                <span className="text-sm text-gray-600">{content.content}</span>
                              )}
                            </div>
                          </div>

                          {content.content_type === 'VIDEO' && (
                            <div>
                              <Label>Video Duration (seconds)</Label>
                              <Input
                                type="number"
                                value={content.video_duration_seconds || ''}
                                onChange={(e) => updateContent(index, 'video_duration_seconds', parseInt(e.target.value) || 0)}
                                placeholder="Enter duration in seconds"
                              />
                            </div>
                          )}

                          <div>
                            <Label>Thumbnail</Label>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleFileUpload(index, 'thumbnail')}
                                className="flex items-center gap-2"
                              >
                                <Upload className="h-4 w-4" />
                                Upload Thumbnail
                              </Button>
                              {content.thumbnail_url && (
                                <span className="text-sm text-gray-600">{content.thumbnail_url}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {content.content_type === 'QUIZ' && (
                        <div className="space-y-4">
                          <div>
                            <Label>Quiz Questions (JSON)</Label>
                            <Textarea
                              value={JSON.stringify(content.quiz_questions || {}, null, 2)}
                              onChange={(e) => {
                                try {
                                  const questions = JSON.parse(e.target.value)
                                  updateContent(index, 'quiz_questions', questions)
                                } catch {
                                  // Invalid JSON, ignore
                                }
                              }}
                              placeholder='{"question1": {"question": "What is...", "options": ["A", "B", "C"], "correct": 0}}'
                              rows={6}
                            />
                          </div>
                          <div>
                            <Label>Passing Score (%)</Label>
                            <Input
                              type="number"
                              value={content.passing_score || ''}
                              onChange={(e) => updateContent(index, 'passing_score', parseInt(e.target.value) || 0)}
                              placeholder="Enter passing score percentage"
                              min={0}
                              max={100}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={content.is_required}
                          onCheckedChange={(checked) => updateContent(index, 'is_required', checked)}
                        />
                        <Label>Required Content</Label>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Title</div>
                <div className="font-medium">{formData.title || 'Untitled Module'}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-gray-600">Duration</div>
                <div className="font-medium">{formData.estimated_duration_minutes} minutes</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-gray-600">Content Items</div>
                <div className="font-medium">{formData.contents.length}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-gray-600">Status</div>
                <Badge variant={formData.is_active ? "default" : "secondary"}>
                  {formData.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              {formData.contents.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Content Types</div>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(new Set(formData.contents.map(c => c.content_type))).map(type => (
                        <Badge key={type} variant="outline" className="flex items-center gap-1">
                          {getContentTypeIcon(type)}
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}