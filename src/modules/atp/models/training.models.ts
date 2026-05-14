/** API content types for create/update payloads */
export type TrainingApiContentType = 'TEXT' | 'VIDEO' | 'IMAGE';

/** UI may include types that map to API payloads */
export type TrainingFormContentType = TrainingApiContentType | 'DOCUMENT' | 'QUIZ';

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
  content_type: TrainingApiContentType;
  title: string;
  content: string;
  content_order: number;
  is_required: boolean;
  video_duration_seconds?: number;
  thumbnail_url?: string;
  quiz_questions?: Record<string, unknown>;
  passing_score?: number;
  created_at: string;
  updated_at: string;
}

/** GET /api/v1/training/modules query params */
export interface TrainingModulesListParams {
  limit: number;
  active_only: boolean;
}

/** GET /api/v1/training/modules response envelope */
export interface TrainingModulesListEnvelope {
  status: string;
  data: TrainingModule[];
  message?: string;
}

/** POST /api/v1/training/modules — body item */
export interface CreateTrainingModuleContentPayload {
  content_type: TrainingApiContentType;
  title: string;
  content: string;
  content_order: number;
  is_required: boolean;
  video_duration_seconds: number;
  thumbnail_url: string;
  quiz_questions: Record<string, unknown>;
  passing_score: number;
}

/** POST /api/v1/training/modules */
export interface CreateTrainingModulePayload {
  title: string;
  description: string;
  module_order: number;
  is_active: boolean;
  estimated_duration_minutes: number;
  contents: CreateTrainingModuleContentPayload[];
}

/** POST /api/v1/training/modules/{id} single-module envelope */
export interface TrainingModuleSingleEnvelope {
  status: string;
  data: TrainingModule;
  message?: string;
}

/** PUT /api/v1/training/modules/{module_id} — module fields only (no contents) */
export interface UpdateTrainingModulePayload {
  title: string;
  description: string;
  module_order: number;
  is_active: boolean;
  estimated_duration_minutes: number;
}

/** PUT /api/v1/training/contents/{content_id} */
export type UpdateTrainingContentPayload = CreateTrainingModuleContentPayload;

/** Typical success envelope for DELETE or content PUT when `data` is a single content row */
export interface TrainingContentSingleEnvelope {
  status: string;
  data: TrainingContent;
  message?: string;
}

export interface TrainingMutationEnvelope {
  status: string;
  message?: string;
  data?: unknown;
}

/** Form row for create UI (matches CreateTrainingModule state shape) */
export interface TrainingModuleFormContent {
  content_type: TrainingFormContentType;
  title: string;
  content: string;
  content_order: number;
  is_required: boolean;
  video_duration_seconds?: number;
  thumbnail_url?: string;
  quiz_questions?: Record<string, unknown>;
  passing_score?: number;
}

export interface TrainingModuleFormValues {
  title: string;
  description: string;
  module_order: number;
  is_active: boolean;
  estimated_duration_minutes: number;
  contents: TrainingModuleFormContent[];
}

const noQuiz = (): Record<string, unknown> => ({});

/**
 * Maps UI content rows to API create payload.
 * QUIZ and DOCUMENT are represented as TEXT on the API with appropriate fields.
 */
export function toCreateTrainingModulePayload(
  form: TrainingModuleFormValues
): CreateTrainingModulePayload {
  const contents: CreateTrainingModuleContentPayload[] = form.contents.map((c, index) => {
    const content_order = index;
    const video_duration_seconds = c.video_duration_seconds ?? 0;
    const thumbnail_url = c.thumbnail_url ?? '';
    const passing_score = c.passing_score ?? 100;
    const quiz_questions =
      c.content_type === 'QUIZ'
        ? (c.quiz_questions && Object.keys(c.quiz_questions).length > 0 ? c.quiz_questions : noQuiz())
        : noQuiz();

    if (c.content_type === 'QUIZ') {
      return {
        content_type: 'TEXT',
        title: c.title,
        content: c.content || ' ',
        content_order,
        is_required: c.is_required,
        video_duration_seconds: 0,
        thumbnail_url: '',
        quiz_questions,
        passing_score,
      };
    }

    if (c.content_type === 'DOCUMENT') {
      return {
        content_type: 'TEXT',
        title: c.title,
        content: c.content,
        content_order,
        is_required: c.is_required,
        video_duration_seconds: 0,
        thumbnail_url,
        quiz_questions: noQuiz(),
        passing_score: 100,
      };
    }

    if (c.content_type === 'VIDEO') {
      return {
        content_type: 'VIDEO',
        title: c.title,
        content: c.content,
        content_order,
        is_required: c.is_required,
        video_duration_seconds,
        thumbnail_url,
        quiz_questions: noQuiz(),
        passing_score: 100,
      };
    }

    if (c.content_type === 'IMAGE') {
      return {
        content_type: 'IMAGE',
        title: c.title,
        content: c.content,
        content_order,
        is_required: c.is_required,
        video_duration_seconds: 0,
        thumbnail_url,
        quiz_questions: noQuiz(),
        passing_score: 100,
      };
    }

    return {
      content_type: 'TEXT',
      title: c.title,
      content: c.content,
      content_order,
      is_required: c.is_required,
      video_duration_seconds: 0,
      thumbnail_url,
      quiz_questions: noQuiz(),
      passing_score: 100,
    };
  });

  return {
    title: form.title,
    description: form.description,
    module_order: form.module_order,
    is_active: form.is_active,
    estimated_duration_minutes: form.estimated_duration_minutes,
    contents,
  };
}

/** GET /api/v1/training/admin/analytics — `data.summary` */
export interface TrainingAnalyticsSummary {
  total_atps: number;
  total_active_training_modules: number;
  total_module_enrollments: number;
  total_content_progress_rows: number;
  atps_completed_all_modules: number;
  completion_rate_percentage: number;
  avg_time_spent_seconds: number;
  users_not_started: number;
  users_in_progress: number;
  users_completed: number;
  users_failed: number;
  atps_with_any_failed_record: number;
}

export interface TrainingAnalyticsUser {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  atp_uuid: string;
  overall_training_status: string;
  completed_modules: number;
  total_active_modules: number;
  overall_progress_percentage: number;
  total_time_spent_seconds: number;
  last_activity_at: string | null;
}

export interface TrainingAnalyticsData {
  summary: TrainingAnalyticsSummary;
  users: TrainingAnalyticsUser[];
}

/** GET /api/v1/training/admin/analytics */
export interface TrainingAnalyticsEnvelope {
  status: string;
  data: TrainingAnalyticsData;
  message?: string;
}