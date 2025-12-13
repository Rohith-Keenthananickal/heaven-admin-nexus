import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/components/ui/dialog"
import { Button } from "@/modules/shared/components/ui/button"
import { Download, X, Loader2, FileText, Image as ImageIcon } from "lucide-react"
import { cn } from "@/modules/shared/lib/utils"

interface DocumentViewerProps {
  /** Document URL to display */
  documentUrl: string | null | undefined
  /** Document title to display in the header */
  title?: string
  /** Trigger element that opens the viewer */
  trigger?: React.ReactNode
  /** Whether the dialog is open (controlled) */
  open?: boolean
  /** Callback when dialog open state changes */
  onOpenChange?: (open: boolean) => void
  /** Additional className for the dialog content */
  className?: string
}

/**
 * Reusable DocumentViewer component that can display images and PDFs in a modal dialog.
 * Automatically detects file type based on URL extension or content type.
 */
export function DocumentViewer({
  documentUrl,
  title = "Document Viewer",
  trigger,
  open: controlledOpen,
  onOpenChange,
  className,
}: DocumentViewerProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use controlled or internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  // Determine file type
  const getFileType = (url: string | null | undefined): "image" | "pdf" | "unknown" => {
    if (!url) return "unknown"
    
    // Ensure url is a string
    const urlString = String(url)
    if (!urlString || urlString.trim() === "") return "unknown"
    
    const urlLower = urlString.toLowerCase()
    
    // Check for image extensions
    if (/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(urlLower)) {
      return "image"
    }
    
    // Check for PDF extension
    if (/\.pdf$/i.test(urlLower)) {
      return "pdf"
    }
    
    // Default to unknown (will try to render as image first)
    return "unknown"
  }

  const fileType = getFileType(documentUrl)
  const hasDocument = documentUrl && String(documentUrl).trim() !== ""

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    if (!newOpen) {
      setError(null)
      setIsLoading(true)
    }
  }

  const handleDownload = () => {
    if (!documentUrl) return
    
    try {
      const link = document.createElement("a")
      link.href = String(documentUrl)
      link.download = title || "document"
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Error downloading document:", err)
    }
  }

  const handleImageLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setError("Failed to load document. Please check if the URL is valid.")
  }

  return (
    <>
      {trigger && (
        <div onClick={() => hasDocument && handleOpenChange(true)}>
          {trigger}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className={cn(
            "max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col p-0",
            className
          )}
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                {fileType === "pdf" ? (
                  <FileText className="w-5 h-5 text-blue-600" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-green-600" />
                )}
                {title}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {hasDocument && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-900">
            {!hasDocument ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FileText className="w-16 h-16 text-slate-400 mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  No document available
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <X className="w-16 h-16 text-destructive mb-4" />
                <p className="text-destructive mb-2">{error}</p>
                <Button variant="outline" onClick={() => handleOpenChange(false)}>
                  Close
                </Button>
              </div>
            ) : fileType === "pdf" ? (
              <div className="w-full h-full min-h-[500px]">
                {isLoading && (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                )}
                <iframe
                  src={String(documentUrl)}
                  className="w-full h-full min-h-[500px] border-0 rounded-lg"
                  title={title}
                  onLoad={() => setIsLoading(false)}
                  onError={handleImageError}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                {isLoading && (
                  <div className="absolute flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                  </div>
                )}
                <img
                  src={String(documentUrl)}
                  alt={title}
                  className={cn(
                    "max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg",
                    isLoading && "opacity-0"
                  )}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

