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

export interface Board {
  id: string;
  name: string;
}

export interface Column {
  id: string;
  name: string;
  boardId: string;
  position: number; 
}

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
  position: number;
}

export type CreateTaskDTO = Omit<Task, 'id' | 'columnId'>;

export type UpdateTaskDTO = Partial<Omit<Task, 'id' | 'columnId'>>;