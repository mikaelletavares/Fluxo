import apiClient from '@/api/client';
import { Task, UpdateTaskDTO } from '@/types';

async function updateTask(taskId: string, taskData: UpdateTaskDTO): Promise<Task> {
  const response = await apiClient.patch<Task>(`/tasks/${taskId}`, taskData);
  return response.data;
}

async function deleteTask(taskId: string): Promise<void> {
  await apiClient.delete(`/tasks/${taskId}`);
}

export const taskService = {
  updateTask,
  deleteTask,
};