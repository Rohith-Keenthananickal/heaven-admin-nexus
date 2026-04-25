/** Nested `data` from POST /api/v1/images/upload */
export interface ImageUploadResultData {
  s3_key: string;
  file_name: string;
  file_size: number;
  file_type: string;
  image_type: string;
  url: string;
  uploaded_at: string;
  metadata?: Record<string, unknown>;
}

/** Full JSON body from POST /api/v1/images/upload */
export interface ImageUploadApiResponse {
  status: string;
  message?: string;
  data: ImageUploadResultData;
}
