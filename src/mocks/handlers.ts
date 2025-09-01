import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:3001/api';

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
];
