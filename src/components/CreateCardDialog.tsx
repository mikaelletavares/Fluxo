import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import styles from './styles/createCardDialog.module.css';

interface CreateCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCard: (name: string) => void;
  projectName?: string;
  workspaceColor?: string;
}

export function CreateCardDialog({ 
  isOpen, 
  onClose, 
  onCreateCard, 
  projectName,
  workspaceColor
}: CreateCardDialogProps) {
  const [cardName, setCardName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardName.trim()) {
      onCreateCard(cardName.trim());
      setCardName('');
      onClose();
    }
  };

  const handleClose = () => {
    setCardName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Criar Novo Card</h2>
          {projectName && (
            <p className={styles.projectInfo}>em {projectName}</p>
          )}
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="cardName" className={styles.label}>
              Nome do Card
            </label>
            <Input
              id="cardName"
              type="text"
              placeholder="Ex: A Fazer, Em Progresso, Concluído"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </div>

          <div className={styles.preview}>
            <label className={styles.label}>Preview</label>
            <div className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <h4 className={styles.previewTitle}>
                  {cardName || 'Nome do Card'}
                </h4>
                <span className={styles.previewCount}>0</span>
              </div>
              <div className={styles.previewContent}>
                <p className={styles.previewEmpty}>Nenhuma tarefa ainda</p>
              </div>
              <button 
                className={styles.previewButton}
                style={{ 
                  backgroundColor: workspaceColor || '#162456',
                  borderColor: workspaceColor || '#162456'
                }}
              >
                + Adicionar Tarefa
              </button>
            </div>
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
              disabled={!cardName.trim()}
            >
              Criar Card
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
