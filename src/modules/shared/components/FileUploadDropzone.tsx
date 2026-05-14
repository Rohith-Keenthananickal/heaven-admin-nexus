import { useCallback, useId } from "react"
import { useDropzone, type Accept } from "react-dropzone"
import { Upload } from "lucide-react"
import { cn } from "@/modules/shared/lib/utils"

export interface FileUploadDropzoneProps {
  /** Prefix for generated ids (must be unique per mount). */
  idPrefix: string
  accept?: Accept
  disabled?: boolean
  uploading?: boolean
  /** Primary line when idle (not dragging / not uploading). */
  label: string
  /** Secondary helper text under the label. */
  description?: string
  /** Shown under the zone when a value exists (e.g. URL). */
  valuePreview?: string
  onFileAccepted: (file: File) => void | Promise<void>
  className?: string
}

/**
 * Click-or-drag file control built on [react-dropzone](https://react-dropzone.js.org/).
 * Single file per interaction; calls `onFileAccepted` with the chosen file.
 */
export function FileUploadDropzone({
  idPrefix,
  accept,
  disabled = false,
  uploading = false,
  label,
  description,
  valuePreview,
  onFileAccepted,
  className,
}: FileUploadDropzoneProps) {
  const reactId = useId()
  const regionId = `${idPrefix}-${reactId}`

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return
      await onFileAccepted(file)
    },
    [onFileAccepted]
  )

  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    multiple: false,
    disabled: disabled || uploading,
  })

  const isDisabled = disabled || uploading

  return (
    <div className={cn("space-y-2", className)}>
      <div
        {...getRootProps({
          className: cn(
            "flex min-h-[104px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 text-center outline-none transition-colors",
            isDragActive && !isDisabled && "border-primary bg-primary/5",
            !isDragActive &&
              !isDisabled &&
              "border-muted-foreground/25 bg-muted/30 hover:border-muted-foreground/45 hover:bg-muted/40",
            isDisabled && "cursor-not-allowed opacity-60",
            isFocused && !isDisabled && "ring-2 ring-ring ring-offset-2 ring-offset-background"
          ),
          "aria-labelledby": `${regionId}-title`,
          ...(description ? { "aria-describedby": `${regionId}-desc` } : {}),
        })}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 shrink-0 text-muted-foreground" aria-hidden />
        <div className="space-y-1">
          <p id={`${regionId}-title`} className="text-sm font-medium text-foreground">
            {uploading ? "Uploading…" : isDragActive ? "Drop file here" : label}
          </p>
          {description && !uploading && (
            <p id={`${regionId}-desc`} className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {valuePreview ? (
        <p className="truncate text-xs text-muted-foreground" title={valuePreview}>
          {valuePreview}
        </p>
      ) : null}
    </div>
  )
}
