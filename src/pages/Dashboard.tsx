import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { CreateWorkspaceDialog } from '@/components/CreateWorkspaceDialog';
import { EditWorkspaceDialog } from '@/components/EditWorkspaceDialog';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { WorkspaceCard } from '@/components/WorkspaceCard';
import { Layout } from '@/components/Layout';
import { Logo } from '@/components/Logo';
import { workspaceService } from '@/services/workspace.service';
import { Workspace } from '@/types/firebase';
import styles from './styles/dashboard.module.css';



export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
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

  const handleCreateWorkspaceSubmit = async (name: string, description: string, color: string) => {
    if (!user) return;
    
    try {
      const newWorkspace = await workspaceService.createWorkspace({
        name,
        description: description || undefined,
        color,
        userId: user.id
      });
      setWorkspaces(prev => [...prev, newWorkspace]);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar área de trabalho');
    }
  };

  const handleEditWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setIsEditDialogOpen(true);
  };

  const handleDeleteWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveWorkspace = async (data: { name: string; description?: string }) => {
    if (!selectedWorkspace) return;
    
    try {
      await workspaceService.updateWorkspace(selectedWorkspace.id, data);
      
      // Atualizar o workspace na lista local
      setWorkspaces(prev => prev.map(w => 
        w.id === selectedWorkspace.id 
          ? { ...w, name: data.name, description: data.description }
          : w
      ));
      
      setIsEditDialogOpen(false);
      setSelectedWorkspace(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar alterações');
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedWorkspace) return;
    
    try {
      await workspaceService.deleteWorkspace(selectedWorkspace.id);
      setWorkspaces(prev => prev.filter(w => w.id !== selectedWorkspace.id));
      setIsDeleteDialogOpen(false);
      setSelectedWorkspace(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir área de trabalho');
      throw err;
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
            <Logo className={styles.logoContainer} />
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
              <WorkspaceCard
                key={workspace.id}
                workspace={workspace}
                onClick={() => navigate(`/desktop/${workspace.id}`)}
                onEdit={() => handleEditWorkspace(workspace)}
                onDelete={() => handleDeleteWorkspace(workspace)}
              />
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

        <EditWorkspaceDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedWorkspace(null);
          }}
          onSave={handleSaveWorkspace}
          currentName={selectedWorkspace?.name || ''}
          currentDescription={selectedWorkspace?.description}
        />

        <ConfirmDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedWorkspace(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Excluir Área de Trabalho"
          message="Tem certeza que deseja excluir esta área de trabalho? Todos os projetos, cards e tarefas associados também serão excluídos permanentemente."
          itemName={selectedWorkspace?.name || ''}
        />
      </div>
    </Layout>
  );
}

