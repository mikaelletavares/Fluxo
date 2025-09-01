import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { LoginPage } from './pages/Login';
import { CadastroPage } from './pages/Cadastro';
import { DashboardPage } from './pages/Dashboard';
import { ProjetoPage } from './pages/Projeto';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        <Route path="/projeto/:id" element={<ProjetoPage />} />

        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
