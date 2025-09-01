import { FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Spinner } from '@/components/Spinner'; 
import styles from './styles/login.module.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, isAuthenticated, isLoading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      console.error('Falha na tentativa de login:', err);
    }
  };

  return (
    <div className={styles.container}>
      {/* Container azul escuro - lateral esquerda */}
      <div className={styles.leftPanel}>
        <div className={styles.brandContent}>
          <div className={styles.logo}>
            <img 
              src="/fluxo.png" 
              alt="Fluxo Logo" 
              className={styles.logoImage}
            />
            <h1 className={styles.brandTitle}>Fluxo</h1>
            <p className={styles.brandSubtitle}>Gerencie seus projetos com eficiência</p>
          </div>
        </div>
      </div>

      {/* Container do formulário - lateral direita */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formHeader}>
              <h1 className={styles.title}>Bem-vindo de volta</h1>
              <p className={styles.subtitle}>Entre na sua conta para continuar</p>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner /> : 'Entrar'}
            </Button>

            <div className={styles.footer}>
              <p className={styles.footerText}>
                Não tem uma conta?{' '}
                <a href="/cadastro" className={styles.link}>
                  Cadastre-se aqui
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}