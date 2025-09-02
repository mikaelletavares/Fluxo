import React, { useState, useEffect } from 'react';
import styles from './styles/editColumnDialog.module.css';
import { Button } from './Button';

interface EditColumnDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string }) => Promise<void>;
  currentName: string;
}

export function EditColumnDialog({
  isOpen,
  onClose,
  onSave,
  currentName,
}: EditColumnDialogProps) {
  const [name, setName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setError(null);
    }
  }, [isOpen, currentName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      setError('O nome é obrigatório.');
      return;
    }

    setIsLoading(true);
    try {
      await onSave({ name });
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar coluna:', err);
      setError(err.message || 'Erro ao salvar coluna. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialogContent}>
        <h2 className={styles.dialogTitle}>Editar Card</h2>
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
              placeholder="Nome do card"
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
