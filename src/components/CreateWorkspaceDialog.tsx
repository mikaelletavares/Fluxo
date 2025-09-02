import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import styles from './styles/createWorkspaceDialog.module.css';

interface CreateWorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWorkspace: (name: string, description: string, color: string) => void;
}

const WORKSPACE_COLORS = [
  { name: 'Azul', value: '#000080', preview: '#000080' },
  { name: 'Verde', value: '#008B8B', preview: '#008B8B' },
  { name: 'Roxo', value: '#4B0082', preview: '#4B0082' },
  { name: 'Rosa', value: '#C71585', preview: '#C71585' },
  { name: 'Laranja', value: '#FF8C00', preview: '#FF8C00' },
  { name: 'Vermelho', value: '#800000', preview: '#800000' },
  { name: 'Cinza', value: '#6b7280', preview: '#6b7280' },
  { name: 'Índigo', value: '#9400D3', preview: '#9400D3' },
];

export function CreateWorkspaceDialog({ isOpen, onClose, onCreateWorkspace }: CreateWorkspaceDialogProps) {
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(WORKSPACE_COLORS[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workspaceName.trim()) {
      onCreateWorkspace(workspaceName.trim(), workspaceDescription.trim(), selectedColor);
      setWorkspaceName('');
      setWorkspaceDescription('');
      setSelectedColor(WORKSPACE_COLORS[0].value);
      onClose();
    }
  };

  const handleClose = () => {
    setWorkspaceName('');
    setWorkspaceDescription('');
    setSelectedColor(WORKSPACE_COLORS[0].value);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Criar Nova Área de Trabalho</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="workspaceName" className={styles.label}>
              Nome da Área de Trabalho
            </label>
            <Input
              id="workspaceName"
              type="text"
              placeholder="Ex: Projeto Marketing"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="workspaceDescription" className={styles.label}>
              Descrição (opcional)
            </label>
            <textarea
              id="workspaceDescription"
              className={styles.textarea}
              placeholder="Descreva o propósito desta área de trabalho"
              value={workspaceDescription}
              onChange={(e) => setWorkspaceDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Cor de Fundo</label>
            <div className={styles.colorGrid}>
              {WORKSPACE_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`${styles.colorOption} ${
                    selectedColor === color.value ? styles.selected : ''
                  }`}
                  onClick={() => setSelectedColor(color.value)}
                  title={color.name}
                >
                  <div
                    className={styles.colorPreview}
                    style={{ backgroundColor: color.preview }}
                  />
                  <span className={styles.colorName}>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.preview}>
            <label className={styles.label}>Preview</label>
            <div
              className={styles.previewCard}
              style={{ backgroundColor: selectedColor }}
            >
              <span className={styles.previewText}>
                {workspaceName || 'Nome da Área de Trabalho'}
              </span>
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
              disabled={!workspaceName.trim()}
            >
              Criar Área de Trabalho
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
