import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Layout } from '@/components/Layout';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { userService } from '@/services/user.service';
import { UserProfile } from '@/context/AuthContext';
import styles from './styles/settings.module.css';

export function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('account');

  // Estados para as configurações
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskReminders: true,
    projectUpdates: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    showEmail: false,
    allowMessages: true
  });

  const [appearance, setAppearance] = useState({
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo'
  });

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


  const handleSaveSettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Aqui você pode implementar a lógica para salvar as configurações
      // Por enquanto, apenas simular o salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Configurações salvas:', { notifications, privacy, appearance, theme });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsSaving(false);
    }
  };



  if (isLoading) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando configurações...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.logoContainer}>
              <Logo />
            </div>
            <div className={styles.breadcrumb}>
              <span className={styles.breadcrumbItem}>Dashboard</span>
              <span className={styles.separator}>/</span>
              <span className={styles.breadcrumbCurrent}>Configurações</span>
            </div>
          </div>
          
                     <div className={styles.headerActions}>
             <button
               className={styles.userButton}
               onClick={() => navigate('/perfil')}
               title="Ir para perfil"
             >
               <div className={styles.userAvatar}>
                 {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
               </div>
             </button>
           </div>
        </div>

        <div className={styles.content}>
          <div className={styles.settingsContainer}>
            {/* Sidebar de navegação */}
            <div className={styles.sidebar}>
              <h2 className={styles.sidebarTitle}>Configurações</h2>
              <nav className={styles.nav}>
                <button
                  className={`${styles.navItem} ${activeSection === 'account' ? styles.navItemActive : ''}`}
                  onClick={() => setActiveSection('account')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Conta
                </button>
                <button
                  className={`${styles.navItem} ${activeSection === 'notifications' ? styles.navItemActive : ''}`}
                  onClick={() => setActiveSection('notifications')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  Notificações
                </button>
                <button
                  className={`${styles.navItem} ${activeSection === 'privacy' ? styles.navItemActive : ''}`}
                  onClick={() => setActiveSection('privacy')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Privacidade
                </button>
                                 <button
                   className={`${styles.navItem} ${activeSection === 'appearance' ? styles.navItemActive : ''}`}
                   onClick={() => setActiveSection('appearance')}
                 >
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <circle cx="12" cy="12" r="3"/>
                     <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                   </svg>
                   Aparência
                 </button>
              </nav>
            </div>

            {/* Conteúdo principal */}
            <div className={styles.mainContent}>
              <div className={styles.sectionHeader}>
                                 <h2 className={styles.sectionTitle}>
                   {activeSection === 'account' && 'Configurações da Conta'}
                   {activeSection === 'notifications' && 'Notificações'}
                   {activeSection === 'privacy' && 'Privacidade'}
                   {activeSection === 'appearance' && 'Aparência'}
                 </h2>
                 <p className={styles.sectionDescription}>
                   {activeSection === 'account' && 'Gerencie suas informações pessoais e preferências da conta.'}
                   {activeSection === 'notifications' && 'Configure como e quando você deseja receber notificações.'}
                   {activeSection === 'privacy' && 'Controle sua privacidade e visibilidade no Fluxo.'}
                   {activeSection === 'appearance' && 'Personalize a aparência e comportamento da aplicação.'}
                 </p>
              </div>

                             {/* Seção da Conta */}
               {activeSection === 'account' && (
                 <div className={styles.section}>
                   <div className={styles.settingGroup}>
                     <h3 className={styles.settingGroupTitle}>Informações da Conta</h3>
                     <div className={styles.settingItem}>
                       <div className={styles.settingInfo}>
                         <label className={styles.settingLabel}>Email</label>
                         <p className={styles.settingDescription}>Endereço de email da conta</p>
                       </div>
                       <div className={styles.settingValue}>
                         <span className={styles.settingText}>{userProfile?.email || 'Não definido'}</span>
                         <Button variant="secondary" onClick={() => navigate('/perfil')}>
                           Editar
                         </Button>
                       </div>
                     </div>
                     <div className={styles.settingItem}>
                       <div className={styles.settingInfo}>
                         <label className={styles.settingLabel}>Senha</label>
                         <p className={styles.settingDescription}>Altere sua senha de acesso</p>
                       </div>
                       <div className={styles.settingValue}>
                         <span className={styles.settingText}>••••••••</span>
                         <Button variant="secondary">
                           Alterar Senha
                         </Button>
                       </div>
                     </div>
                   </div>
                 </div>
               )}

              {/* Seção de Notificações */}
              {activeSection === 'notifications' && (
                <div className={styles.section}>
                  <div className={styles.settingGroup}>
                    <h3 className={styles.settingGroupTitle}>Notificações por Email</h3>
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <label className={styles.settingLabel}>Notificações por Email</label>
                        <p className={styles.settingDescription}>Receber notificações importantes por email</p>
                      </div>
                      <div className={styles.settingValue}>
                        <label className={styles.toggle}>
                          <input
                            type="checkbox"
                            checked={notifications.email}
                            onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    </div>
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <label className={styles.settingLabel}>Lembretes de Tarefas</label>
                        <p className={styles.settingDescription}>Receber lembretes sobre tarefas pendentes</p>
                      </div>
                      <div className={styles.settingValue}>
                        <label className={styles.toggle}>
                          <input
                            type="checkbox"
                            checked={notifications.taskReminders}
                            onChange={(e) => setNotifications(prev => ({ ...prev, taskReminders: e.target.checked }))}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    </div>
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <label className={styles.settingLabel}>Atualizações de Projeto</label>
                        <p className={styles.settingDescription}>Receber notificações sobre mudanças nos projetos</p>
                      </div>
                      <div className={styles.settingValue}>
                        <label className={styles.toggle}>
                          <input
                            type="checkbox"
                            checked={notifications.projectUpdates}
                            onChange={(e) => setNotifications(prev => ({ ...prev, projectUpdates: e.target.checked }))}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Seção de Privacidade */}
              {activeSection === 'privacy' && (
                <div className={styles.section}>
                  <div className={styles.settingGroup}>
                    <h3 className={styles.settingGroupTitle}>Visibilidade do Perfil</h3>
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <label className={styles.settingLabel}>Visibilidade do Perfil</label>
                        <p className={styles.settingDescription}>Quem pode ver seu perfil</p>
                      </div>
                      <div className={styles.settingValue}>
                        <select
                          className={styles.select}
                          value={privacy.profileVisibility}
                          onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                        >
                          <option value="private">Privado</option>
                          <option value="public">Público</option>
                          <option value="friends">Apenas Amigos</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <label className={styles.settingLabel}>Mostrar Email</label>
                        <p className={styles.settingDescription}>Permitir que outros usuários vejam seu email</p>
                      </div>
                      <div className={styles.settingValue}>
                        <label className={styles.toggle}>
                          <input
                            type="checkbox"
                            checked={privacy.showEmail}
                            onChange={(e) => setPrivacy(prev => ({ ...prev, showEmail: e.target.checked }))}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Seção de Aparência */}
              {activeSection === 'appearance' && (
                <div className={styles.section}>
                  <div className={styles.settingGroup}>
                    <h3 className={styles.settingGroupTitle}>Tema</h3>
                                         <div className={styles.settingItem}>
                       <div className={styles.settingInfo}>
                         <label className={styles.settingLabel}>Tema da Aplicação</label>
                         <p className={styles.settingDescription}>Escolha entre tema claro ou escuro</p>
                       </div>
                       <div className={styles.settingValue}>
                         <select
                           className={styles.select}
                           value={theme}
                           onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                         >
                           <option value="light">Claro</option>
                           <option value="dark">Escuro</option>
                         </select>
                       </div>
                     </div>
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <label className={styles.settingLabel}>Idioma</label>
                        <p className={styles.settingDescription}>Idioma da interface</p>
                      </div>
                      <div className={styles.settingValue}>
                        <select
                          className={styles.select}
                          value={appearance.language}
                          onChange={(e) => setAppearance(prev => ({ ...prev, language: e.target.value }))}
                        >
                          <option value="pt-BR">Português (Brasil)</option>
                          <option value="en-US">English (US)</option>
                          <option value="es-ES">Español</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <label className={styles.settingLabel}>Fuso Horário</label>
                        <p className={styles.settingDescription}>Fuso horário para exibição de datas e horários</p>
                      </div>
                      <div className={styles.settingValue}>
                        <select
                          className={styles.select}
                          value={appearance.timezone}
                          onChange={(e) => setAppearance(prev => ({ ...prev, timezone: e.target.value }))}
                        >
                          <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                          <option value="America/New_York">Nova York (GMT-5)</option>
                          <option value="Europe/London">Londres (GMT+0)</option>
                          <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              

                             {/* Botões de ação */}
               <div className={styles.actions}>
                 <Button
                   variant="primary"
                   onClick={handleSaveSettings}
                   disabled={isSaving}
                   className={styles.saveButton}
                 >
                   {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                 </Button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
