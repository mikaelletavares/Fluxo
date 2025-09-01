import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from './Login';
import { AuthContext } from '@/context/AuthContext'; 

const mockLogin = vi.fn();

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthContext.Provider
    value={{
      login: mockLogin,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      user: null, 
      accessToken: null, 
      logout: vi.fn(), 
    }}
  >
    {children}
  </AuthContext.Provider>
);

describe('LoginPage', () => {
  it('should call the login function with the correct credentials on submit', async () => {
    render(
      <BrowserRouter>
        <MockAuthProvider>
          <LoginPage />
        </MockAuthProvider>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Senha/i);
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalled();

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});