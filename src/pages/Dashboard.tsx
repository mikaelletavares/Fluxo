import { Link, useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '@/context/AuthContext';
import styles from './styles/dashboard.module.css';

export function DashboardPage() {
  const { projects, isLoading, isError, error } = useProjects();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p>Carregando projetos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>
          Ocorreu um erro ao buscar os projetos:{' '}
          {error ? error.message : 'Erro desconhecido.'}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Meus Projetos</h1>
        <div className={styles.headerActions}>
          <button className={styles.createButton}>Criar Novo Projeto</button>
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

      {projects && projects.length > 0 ? (
        <ul className={styles.projectList}>
          {projects.map((project) => (
            <li key={project.id} className={styles.projectItem}>
              <Link to={`/projeto/${project.id}`} className={styles.projectLink}>
                {project.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Você ainda não tem projetos. Que tal criar o primeiro?</p>
      )}
    </div>
  );
}

