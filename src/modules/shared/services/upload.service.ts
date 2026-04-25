import { baseUrl } from '@/baseUrl';
import type { ImageUploadApiResponse, ImageUploadResultData } from '../models/upload.models';
import api from './api';

/** Matches multipart field used by /api/v1/images/upload (e.g. document, image, video). */
export type ImageUploadType = 'document' | 'image' | 'video' | string;

function parseUploadResponse(body: unknown): ImageUploadResultData | null {
  if (body == null || typeof body !== 'object') return null;
  const envelope = body as Partial<ImageUploadApiResponse>;
  const data = envelope.data;
  if (!data || typeof data.url !== 'string' || !data.url.trim()) return null;
  return data as ImageUploadResultData;
}

/**
 * Upload a file via POST /api/v1/images/upload (multipart).
 * Response: `{ status, message, data: { url, s3_key, ... } }` — returns `data.url`.
 */
class UploadService {
  private async postUpload(file: File, imageType: ImageUploadType): Promise<ImageUploadResultData> {
    const form = new FormData();
    form.append('file', file);
    form.append('image_type', imageType);

    const response = await api.post<ImageUploadApiResponse>(`${baseUrl}/api/v1/images/upload`, form);

    const data = parseUploadResponse(response.data);
    if (!data) {
      throw new Error('Upload succeeded but no file URL was found in the response.');
    }
    return data;
  }

  async uploadFile(file: File, imageType: ImageUploadType): Promise<string> {
    const data = await this.postUpload(file, imageType);
    return data.url.trim();
  }

  /** Full `data` object from the upload response (S3 key, file metadata, URL, etc.). */
  async uploadFileWithMeta(file: File, imageType: ImageUploadType): Promise<ImageUploadResultData> {
    return this.postUpload(file, imageType);
  }
}

export const uploadService = new UploadService();
