import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { CreateWorkspaceDialog } from '@/components/CreateWorkspaceDialog';
import { Layout } from '@/components/Layout';
import { workspaceService } from '@/services/workspace.service';
import { Workspace } from '@/types/firebase';
import styles from './styles/dashboard.module.css';

// Função para criar degradê baseado na cor
const createGradient = (color: string) => {
  // Converter hex para RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Criar cor mais clara (adicionar 40% de branco)
  const lightR = Math.min(255, Math.round(r + (255 - r) * 0.4));
  const lightG = Math.min(255, Math.round(g + (255 - g) * 0.4));
  const lightB = Math.min(255, Math.round(b + (255 - b) * 0.4));
  
  const lightColor = `rgb(${lightR}, ${lightG}, ${lightB})`;
  
  return `linear-gradient(135deg, ${color} 0%, ${lightColor} 100%)`;
};

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleProfileClick = () => {
    navigate('/perfil');
  };



  const handleCreateWorkspace = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Carregar workspaces do Firebase
  useEffect(() => {
    const loadWorkspaces = async () => {
      if (!user) {
        console.log('Usuário não encontrado, não carregando workspaces');
        return;
      }
      
      console.log('Iniciando carregamento de workspaces para usuário:', user);
      
      try {
        setIsLoading(true);
        setError(null); // Limpar erro anterior
        console.log('Chamando workspaceService.getUserWorkspaces...');
        const userWorkspaces = await workspaceService.getUserWorkspaces(user.id);
        console.log('Workspaces carregados com sucesso:', userWorkspaces);
        setWorkspaces(userWorkspaces);
      } catch (err: any) {
        console.error('Erro ao carregar workspaces:', err);
        setError(err.message || 'Erro ao carregar áreas de trabalho');
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkspaces();
  }, [user]);

  const handleCreateWorkspaceSubmit = async (name: string, color: string) => {
    if (!user) return;
    
    try {
      const newWorkspace = await workspaceService.createWorkspace({
        name,
        color,
        userId: user.id
      });
      setWorkspaces(prev => [...prev, newWorkspace]);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar área de trabalho');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Carregando áreas de trabalho...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.logoContainer}>
              <img
                src="/fluxo.png"
                alt="Fluxo Logo"
                className={styles.logo}
              />
              <h1 className={styles.brandName}>Fluxo</h1>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.createButton} onClick={handleCreateWorkspace}>
              Criar Área de Trabalho
            </button>
            <button
              onClick={handleProfileClick}
              className={styles.userButton}
              title="Meu Perfil"
            >
              <div className={styles.userAvatar}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>
          </div>
        </header>

      <div className={styles.content}>
        <div className={styles.welcomeSection}>
          <h2>Bem-vindo(a), {user?.name}!</h2>
          <p>Gerencie suas áreas de trabalho e projetos de forma eficiente.</p>
        </div>

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={() => setError(null)}>Fechar</button>
          </div>
        )}

        <div className={styles.workspaceGrid}>
          {workspaces.length > 0 ? (
            workspaces.map((workspace) => (
              <div 
                key={workspace.id} 
                className={styles.workspaceCard}
                style={{ background: createGradient(workspace.color) }}
                onClick={() => navigate(`/desktop/${workspace.id}`)}
              >
                <div 
                  className={styles.workspaceIcon}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: 'white' }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 style={{ color: 'white' }}>{workspace.name}</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Área de trabalho personalizada</p>
                <div className={styles.workspaceAction} style={{ color: 'white' }}>
                  <span>Abrir →</span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyWorkspaces}>
              <div className={styles.emptyIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z" fill="#6B7280"/>
                  <path d="M10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z" fill="#9CA3AF" opacity="0.3"/>
                </svg>
              </div>
              <h3>Nenhuma área de trabalho criada</h3>
              <p>Crie sua primeira área de trabalho para começar a organizar seus projetos</p>
            </div>
          )}
        </div>
      </div>

        <CreateWorkspaceDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onCreateWorkspace={handleCreateWorkspaceSubmit}
        />
      </div>
    </Layout>
  );
}

