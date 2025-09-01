import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { Toaster } from 'react-hot-toast'; 
import { AuthProvider } from './context/AuthContext';
import { RequireAuth } from './components/auth/RequireAuth';

import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { DashboardPage } from './pages/Dashboard';
import { DesktopPage } from './pages/Desktop';
import { ProjectPage } from './pages/Project'; 
import { ProfilePage } from './pages/Profile';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster /> 
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />

            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              }
            />
            <Route
              path="/desktop"
              element={
                <RequireAuth>
                  <DesktopPage />
                </RequireAuth>
              }
            />
            <Route
              path="/desktop/:workspaceId"
              element={
                <RequireAuth>
                  <DesktopPage />
                </RequireAuth>
              }
            />
            <Route
              path="/projeto/:id"
              element={
                <RequireAuth>
                  <ProjectPage /> 
                </RequireAuth>
              }
            />
            <Route
              path="/perfil"
              element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              }
            />
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;