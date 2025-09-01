import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import styles from './styles/profile.module.css';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <p>Carregando informações do usuário...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={handleGoBack} className={styles.backButton}>
          ← Voltar
        </button>
        <h1>Meu Perfil</h1>
      </header>

      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          <div className={styles.avatarPlaceholder}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className={styles.userInfo}>
          <h2 className={styles.userName}>{user.name}</h2>
          <p className={styles.userEmail}>{user.email}</p>
        </div>

        <div className={styles.actions}>
          <Button 
            onClick={handleLogout} 
            variant="danger"
            className={styles.logoutButton}
          >
            Sair da Conta
          </Button>
        </div>
      </div>

      <div className={styles.infoSection}>
        <h3>Informações da Conta</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Nome:</span>
            <span className={styles.infoValue}>{user.name}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email:</span>
            <span className={styles.infoValue}>{user.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>ID do Usuário:</span>
            <span className={styles.infoValue}>{user.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
