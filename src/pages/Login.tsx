import React, { FormEvent, useState, CSSProperties, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; 
import { Button } from '@/components/Button'; 
import { Input } from '@/components/Input'; 
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
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Entrar no Fluxo</h1>

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
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
}

