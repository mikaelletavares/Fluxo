import { http, HttpResponse } from 'msw';
import { Project, Board, Column, Task } from '../types';

const API_URL = 'http://localhost:3001/api';

const mockProjects: Project[] = [
  { id: 'proj-1', name: 'Lançamento do App Mobile', ownerId: 'user-123' },
  { id: 'proj-2', name: 'Trabalho de Conclusão de Curso', ownerId: 'user-123' },
  { id: 'proj-3', name: 'Campanha de Marketing Q4', ownerId: 'user-123' },
];

const mockBoard: Board = {
  id: 'board-1',
  name: 'Quadro Kanban do Projeto',
};

const mockColumns: Column[] = [
  { id: 'col-1', name: 'A Fazer', boardId: 'board-1', position: 1 },
  { id: 'col-2', name: 'Em Andamento', boardId: 'board-1', position: 2 },
  { id: 'col-3', name: 'Concluído', boardId: 'board-1', position: 3 },
];

const mockTasks: Task[] = [
  { id: 'task-1', title: 'Definir escopo', description: 'Reunião com a equipe de produto', columnId: 'col-1', position: 1 },
  { id: 'task-2', title: 'Criar wireframes', description: 'Design das telas principais', columnId: 'col-2', position: 1 },
  { id: 'task-3', title: 'Configurar ambiente', description: 'Instalar dependências e frameworks', columnId: 'col-2', position: 2 },
  { id: 'task-4', title: 'Escrever documentação', description: 'Documentar as APIs', columnId: 'col-3', position: 1 },
];

export const handlers = [
  http.post(`${API_URL}/login`, async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const loginData = await request.json();
    if (!loginData || typeof loginData !== 'object' || !('email' in loginData) || !('password' in loginData)) {
      return HttpResponse.json({ message: 'Dados inválidos' }, { status: 400 });
    }
    return HttpResponse.json({
      user: {
        id: 'c7b3d8e0-5e0b-4b0f-8b3a-2b3c4d5e6f7g',
        name: 'Mikaelle',
        email: (loginData as {email: string}).email,
      },
      token: 'fake-jwt-token-for-development',
    }, { status: 200 });
  }),

  http.get(`${API_URL}/projects`, () => {
    return HttpResponse.json(mockProjects, { status: 200 });
  }),

  http.get(`${API_URL}/boards/:boardId`, ({ params }) => {
    return HttpResponse.json({
      board: mockBoard,
      columns: mockColumns,
      tasks: mockTasks,
    }, { status: 200 });
  }),
];