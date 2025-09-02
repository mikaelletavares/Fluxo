import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/Layout';
import { Logo } from '@/components/Logo';
import { projectService } from '@/services/project.service';
import { workspaceService } from '@/services/workspace.service';
import { columnService } from '@/services/column.service';
import { taskService } from '@/services/task.service';
import { Project, Workspace, Column, Task } from '@/types/firebase';
import { ProjectCard } from '@/components/ProjectCard';
import { CreateCardDialog } from '@/components/CreateCardDialog';
import { EditColumnDialog } from '@/components/EditColumnDialog';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import styles from './styles/projects.module.css';

// Lista de ícones (mesma do IconSelector)
const ICONS = [
  { id: 'folder', name: 'Pasta', svg: 'M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z' },
  { id: 'folder-open', name: 'Pasta Aberta', svg: 'M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z' },
  { id: 'document', name: 'Documento', svg: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z' },
  { id: 'clipboard', name: 'Prancheta', svg: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z' },
  { id: 'chart', name: 'Gráfico', svg: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' },
  { id: 'trending-up', name: 'Tendência Alta', svg: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z' },
  { id: 'trending-down', name: 'Tendência Baixa', svg: 'M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z' },
  { id: 'pin', name: 'Alfinete', svg: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' },
  { id: 'location', name: 'Localização', svg: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' },
  { id: 'search', name: 'Busca', svg: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' },
  { id: 'lightbulb', name: 'Lâmpada', svg: 'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z' },
  { id: 'flash', name: 'Raio', svg: 'M7 2v11h3v9l7-12h-4l4-8z' },
  { id: 'fire', name: 'Fogo', svg: 'M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM12 20c-3.31 0-6-2.69-6-6 0-1.53 3.41-6.23 6-6.23s6 4.7 6 6.23c0 3.31-2.69 6-6 6z' },
  { id: 'star', name: 'Estrela', svg: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' },
  { id: 'star-outline', name: 'Estrela Vazia', svg: 'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z' },
  { id: 'diamond', name: 'Diamante', svg: 'M6 2L2 8l4 6 4-6-4-6zm12 0l-4 6 4 6 4-6-4-6z' },
  { id: 'target', name: 'Alvo', svg: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z' },
  { id: 'rocket', name: 'Foguete', svg: 'M12 2.5s8 4 8 11.5c0 1.1-.9 2-2 2s-2-.9-2-2c0-3.5-2.5-6-6-6s-6 2.5-6 6c0 1.1-.9 2-2 2s-2-.9-2-2c0-7.5 8-11.5 8-11.5z' },
  { id: 'palette', name: 'Paleta', svg: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z' },
  { id: 'theater', name: 'Teatro', svg: 'M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z' },
  { id: 'circus', name: 'Circo', svg: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
  { id: 'image', name: 'Imagem', svg: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' },
  { id: 'movie', name: 'Filme', svg: 'M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z' },
  { id: 'music', name: 'Música', svg: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' },
  { id: 'note', name: 'Nota', svg: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' },
  { id: 'mic', name: 'Microfone', svg: 'M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z' },
  { id: 'headphones', name: 'Fones', svg: 'M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z' },
  { id: 'camera', name: 'Câmera', svg: 'M12 12m-3.2 0a3.2 3.2 0 1 1 6.4 0 3.2 3.2 0 1 1-6.4 0' },
  { id: 'video', name: 'Vídeo', svg: 'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z' },
  { id: 'laptop', name: 'Laptop', svg: 'M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z' },
  { id: 'monitor', name: 'Monitor', svg: 'M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v1h12v-1l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z' },
  { id: 'keyboard', name: 'Teclado', svg: 'M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z' },
  { id: 'mouse', name: 'Mouse', svg: 'M20 9c-.04-4.39-3.6-7.93-8-7.93S4.04 4.61 4 9v6c0 4.42 3.58 8 8 8s8-3.58 8-8V9zm-2 6c0 3.31-2.69 6-6 6s-6-2.69-6-6v-4.83c.61-.41 1.3-.73 2-.95V15h2v-4.78c.61-.22 1.27-.35 1.95-.4V15h2v-5.18c.68.05 1.34.18 1.95.4V15h2v-4.78c.7.22 1.39.54 2 .95V15z' },
  { id: 'save', name: 'Salvar', svg: 'M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z' },
  { id: 'disc', name: 'Disco', svg: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
  { id: 'phone', name: 'Telefone', svg: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z' },
  { id: 'phone-alt', name: 'Telefone Alt', svg: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z' },
  { id: 'fax', name: 'Fax', svg: 'M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 12.5h-8v-1h8v1zm0-2h-8v-1h8v1zm0-2h-8v-1h8v1zm2-2h-2v-1h2v1zm0-2h-2v-1h2v1z' },
  { id: 'home', name: 'Casa', svg: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
  { id: 'building', name: 'Prédio', svg: 'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z' },
  { id: 'factory', name: 'Fábrica', svg: 'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z' },
  { id: 'store', name: 'Loja', svg: 'M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' },
  { id: 'school', name: 'Escola', svg: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z' },
  { id: 'mall', name: 'Shopping', svg: 'M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' },
  { id: 'construction', name: 'Construção', svg: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z' },
  { id: 'monument', name: 'Monumento', svg: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' }
];

// Função para obter o SVG do ícone
const getIconSvg = (iconId?: string): string => {
  const icon = ICONS.find(icon => icon.id === iconId);
  return icon?.svg || ICONS[0].svg; // Retorna o primeiro ícone como fallback
};

export function ProjectsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [isCreateCardDialogOpen, setIsCreateCardDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  const handleBackToDesktop = () => {
    if (project?.workspaceId) {
      navigate(`/desktop/${project.workspaceId}`);
    } else {
      navigate('/desktop');
    }
  };

  const handleCreateCard = () => {
    if (columns.length >= 10) {
      alert('Você pode criar no máximo 10 cards.');
      return;
    }
    setIsCreateCardDialogOpen(true);
  };

  const handleCloseCreateCardDialog = () => {
    setIsCreateCardDialogOpen(false);
  };

  // Carregar dados do projeto
  useEffect(() => {
    const loadData = async () => {
      if (!user || !projectId) {
        console.log('Usuário ou projectId não encontrado:', { user: !!user, projectId });
        setIsLoading(false);
        return;
      }
      
      console.log('Iniciando carregamento de dados para projeto:', projectId);
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Carregar projeto
        console.log('Carregando projeto...');
        const projectData = await projectService.getProjectById(projectId);
        console.log('Projeto carregado:', projectData);
        setProject(projectData);
        
        if (projectData) {
          // Carregar workspace do projeto
          console.log('Carregando workspace...');
          const workspaceData = await workspaceService.getWorkspaceById(projectData.workspaceId);
          console.log('Workspace carregado:', workspaceData);
          setWorkspace(workspaceData);
        }
        
        // Carregar colunas do projeto
        console.log('Carregando colunas...');
        const projectColumns = await columnService.getProjectColumns(projectId);
        console.log('Colunas carregadas:', projectColumns);
        setColumns(projectColumns);
        
        // Carregar tarefas do projeto
        console.log('Carregando tarefas...');
        const projectTasks = await taskService.getProjectTasks(projectId);
        console.log('Tarefas carregadas:', projectTasks);
        setTasks(projectTasks);
      } catch (err: any) {
        console.error('Erro ao carregar dados:', err);
        setError(err.message || 'Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, projectId]);

  const handleCreateCardSubmit = async (name: string) => {
    if (!project) return;
    
    try {
      console.log('Criando card:', name);
      const newColumn = await columnService.createColumn({
        name,
        position: columns.length,
        projectId: project.id
      });
      setColumns(prev => [...prev, newColumn]);
    } catch (error) {
      console.error('Erro ao criar card:', error);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    console.log('Nova tarefa recebida no callback:', newTask);
    setTasks(prev => {
      const updatedTasks = [...prev, newTask];
      console.log('Lista de tarefas atualizada:', updatedTasks);
      return updatedTasks;
    });
  };

  const handleTaskMoved = async (taskId: string, newColumnId: string, newPosition: number) => {
    try {
      console.log('Movendo tarefa:', { taskId, newColumnId, newPosition });
      
      // Atualizar a tarefa no Firebase
      await taskService.updateTask(taskId, {
        columnId: newColumnId,
        position: newPosition
      });
      
      // Atualizar o estado local
      setTasks(prev => {
        const updatedTasks = prev.map(task => {
          if (task.id === taskId) {
            return { ...task, columnId: newColumnId, position: newPosition };
          }
          return task;
        });
        console.log('Tarefas atualizadas após movimento:', updatedTasks);
        return updatedTasks;
      });
      
      console.log('Tarefa movida com sucesso');
    } catch (error) {
      console.error('Erro ao mover tarefa:', error);
      alert('Erro ao mover tarefa. Tente novamente.');
    }
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    console.log('Atualizando tarefa na lista local:', updatedTask);
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    console.log('Tarefa atualizada na lista local com sucesso');
  };

  const handleTaskDeleted = (taskId: string) => {
    console.log('Removendo tarefa da lista local:', taskId);
    setTasks(prev => prev.filter(task => task.id !== taskId));
    console.log('Tarefa removida da lista local com sucesso');
  };

  const handleEditColumn = (column: Column) => {
    setSelectedColumn(column);
    setIsEditDialogOpen(true);
  };

  const handleDeleteColumn = (column: Column) => {
    setSelectedColumn(column);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveColumn = async (data: { name: string }) => {
    if (!selectedColumn) return;
    
    try {
      await columnService.updateColumn(selectedColumn.id, { name: data.name });
      
      // Atualizar a coluna na lista local
      setColumns(prev => prev.map(c => 
        c.id === selectedColumn.id 
          ? { ...c, name: data.name }
          : c
      ));
      
      setIsEditDialogOpen(false);
      setSelectedColumn(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar alterações');
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedColumn) return;
    
    try {
      // Primeiro, excluir todas as tarefas da coluna
      const columnTasks = tasks.filter(task => task.columnId === selectedColumn.id);
      for (const task of columnTasks) {
        await taskService.deleteTask(task.id);
      }
      
      // Depois, excluir a coluna
      await columnService.deleteColumn(selectedColumn.id);
      
      // Atualizar o estado local
      setColumns(prev => prev.filter(c => c.id !== selectedColumn.id));
      setTasks(prev => prev.filter(t => t.columnId !== selectedColumn.id));
      
      setIsDeleteDialogOpen(false);
      setSelectedColumn(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir coluna');
      throw err;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.loading}>
            <p>Carregando projeto...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.error}>
            <p>Erro: {error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.error}>
            <p>Projeto não encontrado.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Logo className={styles.logoContainer} />
            <div className={styles.workspaceInfo}>
              <span className={styles.workspaceName}>{workspace?.name}</span>
              <span className={styles.separator}>•</span>
              <span className={styles.projectName}>{project.name}</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.createButton}
              onClick={handleCreateCard}
              disabled={columns.length >= 10}
            >
              + Adicionar Card
            </button>
            <button className={styles.userButton} onClick={handleProfileClick}>
              <div className={styles.userAvatar}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {columns.length > 0 ? (
            <div className={styles.cardsGrid}>
              {columns.map((column) => (
                <ProjectCard
                  key={column.id}
                  column={column}
                  tasks={tasks.filter(task => task.columnId === column.id)}
                  workspaceColor={workspace?.color}
                  onTaskCreated={handleTaskCreated}
                  onTaskMoved={handleTaskMoved}
                  onTaskUpdated={handleTaskUpdated}
                  onTaskDeleted={handleTaskDeleted}
                  onEdit={() => handleEditColumn(column)}
                  onDelete={() => handleDeleteColumn(column)}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
                             <div className={styles.emptyIcon}>
                 <svg 
                   width="80" 
                   height="80" 
                   viewBox="0 0 24 24" 
                   fill="none" 
                   style={{ color: '#9ca3af' }}
                 >
                   <path d={getIconSvg(project.icon)} fill="currentColor" />
                 </svg>
               </div>
              <h2>Nenhum card criado ainda</h2>
              <p>Comece criando seu primeiro card para organizar suas tarefas.</p>
            </div>
          )}
        </div>

        <CreateCardDialog
          isOpen={isCreateCardDialogOpen}
          onClose={handleCloseCreateCardDialog}
          onCreateCard={handleCreateCardSubmit}
          projectName={project.name}
          workspaceColor={workspace?.color}
        />

        <EditColumnDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedColumn(null);
          }}
          onSave={handleSaveColumn}
          currentName={selectedColumn?.name || ''}
        />

        <ConfirmDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedColumn(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Excluir Card"
          message="Tem certeza que deseja excluir este card? Todas as tarefas associadas também serão excluídas permanentemente."
          itemName={selectedColumn?.name || ''}
        />
      </div>
    </Layout>
  );
}
