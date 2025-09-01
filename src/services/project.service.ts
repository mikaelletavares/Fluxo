import apiClient from '@/api/client';
import { Project } from '@/types';

async function fetchProjects(): Promise<Project[]> {
  const response = await apiClient.get<Project[]>('/projects');
  return response.data;
}

export const projectService = {
  fetchProjects,
};
