import { api } from '@/modules/shared';
import { baseUrl } from '@/baseUrl';
import type {
  CreateTrainingModuleContentPayload,
  CreateTrainingModulePayload,
  TrainingAnalyticsEnvelope,
  TrainingContentSingleEnvelope,
  TrainingModuleSingleEnvelope,
  TrainingModulesListEnvelope,
  TrainingModulesListParams,
  TrainingMutationEnvelope,
  UpdateTrainingContentPayload,
  UpdateTrainingModulePayload,
} from '../models/training.models';

class TrainingService {
  /** GET /api/v1/training/modules?limit=&active_only= */
  async listModules(params: TrainingModulesListParams): Promise<TrainingModulesListEnvelope> {
    const response = await api.get<TrainingModulesListEnvelope>(
      `${baseUrl}/api/v1/training/modules`,
      { params: { limit: params.limit, active_only: params.active_only } }
    );
    return response.data;
  }

  /** GET /api/v1/training/admin/analytics */
  async getAdminTrainingAnalytics(): Promise<TrainingAnalyticsEnvelope> {
    const response = await api.get<TrainingAnalyticsEnvelope>(
      `${baseUrl}/api/v1/training/admin/analytics`
    );
    return response.data;
  }

  /** GET /api/v1/training/modules/{module_id} */
  async getModuleById(moduleId: number): Promise<TrainingModuleSingleEnvelope> {
    const response = await api.get<TrainingModuleSingleEnvelope>(
      `${baseUrl}/api/v1/training/modules/${moduleId}`
    );
    return response.data;
  }

  async createModule(
    payload: CreateTrainingModulePayload
  ): Promise<TrainingModuleSingleEnvelope> {
    const response = await api.post<TrainingModuleSingleEnvelope>(
      `${baseUrl}/api/v1/training/modules`,
      payload
    );
    return response.data;
  }

  /**
   * POST /api/v1/training/modules/{module_id}/contents
   * Body: { contents: [...] } — adjust if the API expects a different shape.
   */
  async addModuleContents(
    moduleId: number,
    contents: CreateTrainingModuleContentPayload[]
  ): Promise<TrainingModuleSingleEnvelope> {
    const response = await api.post<TrainingModuleSingleEnvelope>(
      `${baseUrl}/api/v1/training/modules/${moduleId}/contents`,
      { contents }
    );
    return response.data;
  }

  /** PUT /api/v1/training/modules/{module_id} */
  async updateModule(
    moduleId: number,
    payload: UpdateTrainingModulePayload
  ): Promise<TrainingModuleSingleEnvelope> {
    const response = await api.put<TrainingModuleSingleEnvelope>(
      `${baseUrl}/api/v1/training/modules/${moduleId}`,
      payload
    );
    return response.data;
  }

  /** DELETE /api/v1/training/modules/{module_id} */
  async deleteModule(moduleId: number): Promise<TrainingMutationEnvelope> {
    const response = await api.delete<TrainingMutationEnvelope>(
      `${baseUrl}/api/v1/training/modules/${moduleId}`
    );
    return response.data ?? { status: 'success' };
  }

  /** PUT /api/v1/training/contents/{content_id} */
  async updateContent(
    contentId: number,
    payload: UpdateTrainingContentPayload
  ): Promise<TrainingContentSingleEnvelope> {
    const response = await api.put<TrainingContentSingleEnvelope>(
      `${baseUrl}/api/v1/training/contents/${contentId}`,
      payload
    );
    return response.data;
  }

  /** DELETE /api/v1/training/contents/{content_id} */
  async deleteContent(contentId: number): Promise<TrainingMutationEnvelope> {
    const response = await api.delete<TrainingMutationEnvelope>(
      `${baseUrl}/api/v1/training/contents/${contentId}`
    );
    return response.data ?? { status: 'success' };
  }
}

export const trainingService = new TrainingService();
