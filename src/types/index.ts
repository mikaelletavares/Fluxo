export enum TaskStatus {
  TO_DO = 'A Fazer',
  IN_PROGRESS = 'Em Andamento',
  DONE = 'Concluído',
}

export interface User {
  id: string;      
  name: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  ownerId: string; 
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus; 
  projectId: string; 
}

export type CreateTaskDTO = Omit<Task, 'id' | 'projectId'>;

export type UpdateTaskDTO = Partial<Omit<Task, 'id' | 'projectId'>>;