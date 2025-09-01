import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/Layout';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { ImageUpload } from '@/components/ImageUpload';
import { userService } from '@/services/user.service';
import { UserProfile } from '@/context/AuthContext';
import styles from './styles/profile.module.css';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const profile = await userService.getUserProfile(user.id);
        setUserProfile(profile || user);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        setUserProfile(user);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      const imageUrl = await userService.uploadProfileImage(user.id, file);
      setUserProfile(prev => prev ? { ...prev, photoURL: imageUrl } : null);
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageDelete = async () => {
    if (!user || !userProfile?.photoURL) return;
    
    try {
      setIsUpdating(true);
      await userService.deleteProfileImage(user.id, userProfile.photoURL);
      setUserProfile(prev => prev ? { ...prev, photoURL: undefined } : null);
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const formatBirthDate = (birthDate?: string) => {
    if (!birthDate) return 'Não informado';
    try {
      return new Date(birthDate).toLocaleDateString('pt-BR');
    } catch {
      return birthDate;
    }
  };

  if (!user || isLoading) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.loading}>
            <p>Carregando informações do usuário...</p>
          </div>
        </div>
      </Layout>
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
            <Button 
              onClick={handleLogout} 
              variant="danger"
              className={styles.logoutButton}
            >
              Sair da Conta
            </Button>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <ImageUpload
                currentImageUrl={userProfile?.photoURL}
                onImageUpload={handleImageUpload}
                onImageDelete={handleImageDelete}
                disabled={isUpdating}
                className={styles.imageUpload}
              />
              
              <div className={styles.userInfo}>
                <h1 className={styles.userName}>{userProfile?.name || user.name}</h1>
                <p className={styles.userEmail}>{userProfile?.email || user.email}</p>
              </div>
            </div>
          </div>

          <div className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Informações Pessoais</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Nome</span>
                  <span className={styles.infoValue}>{userProfile?.name || user.name}</span>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>{userProfile?.email || user.email}</span>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Data de Nascimento</span>
                  <span className={styles.infoValue}>{formatBirthDate(userProfile?.birthDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
