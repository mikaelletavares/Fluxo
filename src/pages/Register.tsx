import { FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Spinner } from '@/components/Spinner';
import styles from './styles/register.module.css';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { user, isLoading, error, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    // Validações
    if (password !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!name.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    if (!birthDate) {
      alert('Data de nascimento é obrigatória');
      return;
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password: password
      });
      // O redirecionamento será feito automaticamente pelo useEffect
    } catch (err) {
      console.error('Falha na tentativa de cadastro:', err);
      // O erro será exibido automaticamente pelo contexto
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
            <p className={styles.brandSubtitle}>Crie sua conta e comece a gerenciar seus projetos</p>
          </div>
        </div>
      </div>

      {/* Container do formulário - lateral direita */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formHeader}>
              <h1 className={styles.title}>Criar Conta</h1>
              <p className={styles.subtitle}>Preencha os dados abaixo para se cadastrar</p>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Nome Completo
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="birthDate" className={styles.label}>
                Data de Nascimento
              </label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                disabled={isLoading}
              />
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

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirmar Senha
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner /> : 'Criar Conta'}
            </Button>

            <div className={styles.footer}>
              <p className={styles.footerText}>
                Já tem uma conta?{' '}
                <a href="/login" className={styles.link}>
                  Faça login aqui
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
