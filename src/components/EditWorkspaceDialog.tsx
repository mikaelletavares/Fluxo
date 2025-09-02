import React, { useState, useEffect } from 'react';
import styles from './styles/editWorkspaceDialog.module.css';
import { Button } from './Button';

interface EditWorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description?: string }) => Promise<void>;
  currentName: string;
  currentDescription?: string;
}

export function EditWorkspaceDialog({
  isOpen,
  onClose,
  onSave,
  currentName,
  currentDescription,
}: EditWorkspaceDialogProps) {
  const [name, setName] = useState(currentName);
  const [description, setDescription] = useState(currentDescription || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setDescription(currentDescription || '');
      setError(null);
    }
  }, [isOpen, currentName, currentDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      setError('O nome é obrigatório.');
      return;
    }

    setIsLoading(true);
    try {
      await onSave({ name, description: description || undefined });
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar workspace:', err);
      setError(err.message || 'Erro ao salvar workspace. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialogContent}>
        <h2 className={styles.dialogTitle}>Editar Área de Trabalho</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Nome</label>
            <input
              type="text"
              id="name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Nome da área de trabalho"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>Descrição</label>
            <textarea
              id="description"
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              placeholder="Descrição da área de trabalho (opcional)"
              rows={3}
            />
          </div>
          
          {error && <p className={styles.errorMessage}>{error}</p>}
          
          <div className={styles.dialogActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
