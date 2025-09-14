export interface TrainingModule {
  id: number;
  title: string;
  description: string;
  module_order: number;
  is_active: boolean;
  estimated_duration_minutes: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  contents: TrainingContent[];
}

export interface TrainingContent {
  id: number;
  module_id: number;
  content_type: 'TEXT' | 'VIDEO' | 'IMAGE';
  title: string;
  content: string;
  content_order: number;
  is_required: boolean;
  video_duration_seconds?: number;
  thumbnail_url?: string;
  quiz_questions?: Record<string, any>;
  passing_score?: number;
  created_at: string;
  updated_at: string;
}

export interface TrainingModulesResponse {
  status: string;
  data: TrainingModule[];
  message: string;
}