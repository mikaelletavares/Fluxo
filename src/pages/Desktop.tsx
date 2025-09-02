import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import { EditProjectDialog } from '@/components/EditProjectDialog';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { DesktopProjectCard } from '@/components/DesktopProjectCard';
import { Layout } from '@/components/Layout';
import { Logo } from '@/components/Logo';
import { projectService } from '@/services/project.service';
import { workspaceService } from '@/services/workspace.service';
import { Project, Workspace } from '@/types/firebase';
import styles from './styles/desktop.module.css';





export function DesktopPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId?: string }>();
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleProfileClick = () => {
    navigate('/perfil');
  };



  const handleCreateProject = () => {
    setIsCreateProjectDialogOpen(true);
  };

  const handleCloseCreateProjectDialog = () => {
    setIsCreateProjectDialogOpen(false);
  };

  // Carregar dados da workspace e projetos
  useEffect(() => {
    const loadData = async () => {
      if (!user || !workspaceId) {
        console.log('Usuário ou workspaceId não encontrado:', { user: !!user, workspaceId });
        setIsLoading(false);
        return;
      }
      
      console.log('Iniciando carregamento de dados para workspace:', workspaceId);
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Carregar workspace
        console.log('Carregando workspace...');
        const workspaceData = await workspaceService.getWorkspaceById(workspaceId);
        console.log('Workspace carregado:', workspaceData);
        setWorkspace(workspaceData);
        
        // Carregar projetos da workspace
        console.log('Carregando projetos...');
        const workspaceProjects = await projectService.getWorkspaceProjects(workspaceId);
        console.log('Projetos carregados:', workspaceProjects);
        setProjects(workspaceProjects);
      } catch (err: any) {
        console.error('Erro ao carregar dados:', err);
        setError(err.message || 'Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, workspaceId]);

  const handleCreateProjectSubmit = async (name: string, description: string, icon: string) => {
    if (!user || !workspaceId) return;
    
    try {
      const newProject = await projectService.createProject({
        name,
        description,
        icon,
        workspaceId,
        userId: user.id
      });
      setProjects(prev => [...prev, newProject]);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar projeto');
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveProject = async (data: { name: string; description?: string; icon?: string }) => {
    if (!selectedProject) return;
    
    try {
      await projectService.updateProject(selectedProject.id, data);
      
      // Atualizar o projeto na lista local
      setProjects(prev => prev.map(p => 
        p.id === selectedProject.id 
          ? { ...p, name: data.name, description: data.description, icon: data.icon }
          : p
      ));
      
      setIsEditDialogOpen(false);
      setSelectedProject(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar alterações');
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProject) return;
    
    try {
      await projectService.deleteProject(selectedProject.id);
      setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir projeto');
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Carregando projetos...</p>
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
            <div className={styles.workspaceInfo}>
              <span className={styles.separator}>/</span>
              <span className={styles.workspaceName}>{workspace?.name || 'Área de Trabalho'}</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.createButton} onClick={handleCreateProject}>
              Criar Novo Projeto
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
        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={() => setError(null)}>Fechar</button>
          </div>
        )}

        {projects.length > 0 ? (
          <div className={styles.projectsGrid}>
            {projects.map((project) => (
              <DesktopProjectCard
                key={project.id}
                project={project}
                workspaceColor={workspace?.color}
                onEdit={() => handleEditProject(project)}
                onDelete={() => handleDeleteProject(project)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Nenhum projeto encontrado</h2>
            <p>Você ainda não tem projetos nesta área de trabalho. Que tal criar o primeiro?</p>
          </div>
        )}
        </div>

        <CreateProjectDialog
          isOpen={isCreateProjectDialogOpen}
          onClose={handleCloseCreateProjectDialog}
          onCreateProject={handleCreateProjectSubmit}
          workspaceName={workspace?.name}
          workspaceColor={workspace?.color}
        />

        <EditProjectDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedProject(null);
          }}
          onSave={handleSaveProject}
          currentName={selectedProject?.name || ''}
          currentDescription={selectedProject?.description}
          currentIcon={selectedProject?.icon}
        />

        <ConfirmDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedProject(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Excluir Projeto"
          message="Tem certeza que deseja excluir este projeto? Todos os cards e tarefas associados também serão excluídos permanentemente."
          itemName={selectedProject?.name || ''}
        />
      </div>
    </Layout>
  );
}
