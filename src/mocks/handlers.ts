import { http, HttpResponse } from 'msw';
import { Project } from '../types';

const API_URL = 'http://localhost:3001/api';

const mockProjects: Project[] = [
  { id: 'proj-1', name: 'Lançamento do App Mobile', ownerId: 'user-123' },
  { id: 'proj-2', name: 'Trabalho de Conclusão de Curso', ownerId: 'user-123' },
  { id: 'proj-3', name: 'Campanha de Marketing Q4', ownerId: 'user-123' },
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
];

