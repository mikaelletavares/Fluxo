import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import styles from './styles/editProfileDialog.module.css';

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; birthDate: string }) => void;
  currentName: string;
  currentBirthDate?: string;
}

export function EditProfileDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  currentName, 
  currentBirthDate 
}: EditProfileDialogProps) {
  const [name, setName] = useState(currentName);
  const [birthDate, setBirthDate] = useState(currentBirthDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({
        name: name.trim(),
        birthDate: birthDate || undefined
      });
      onClose();
    }
  };

  const handleClose = () => {
    setName(currentName);
    setBirthDate(currentBirthDate || '');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Editar Perfil</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Nome Completo
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
            />
          </div>

          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
