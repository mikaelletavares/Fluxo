import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { Input } from './Input';
import styles from './styles/createTaskDialog.module.css';

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (title: string, description?: string) => void;
  columnName?: string;
  workspaceColor?: string;
}

export function CreateTaskDialog({ 
  isOpen, 
  onClose, 
  onCreateTask, 
  columnName,
  workspaceColor
}: CreateTaskDialogProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onCreateTask(
        taskTitle.trim(), 
        taskDescription.trim() || undefined
      );
      setTaskTitle('');
      setTaskDescription('');
      onClose();
    }
  };

  const handleClose = () => {
    setTaskTitle('');
    setTaskDescription('');
    onClose();
  };

  if (!isOpen) return null;

  const dialogContent = (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Criar Nova Tarefa</h2>
          {columnName && (
            <p className={styles.columnInfo}>em {columnName}</p>
          )}
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="taskTitle" className={styles.label}>
              Título da Tarefa
            </label>
            <Input
              id="taskTitle"
              type="text"
              placeholder="Ex: Implementar funcionalidade X"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="taskDescription" className={styles.label}>
              Descrição (opcional)
            </label>
            <textarea
              id="taskDescription"
              className={styles.textarea}
              placeholder="Descreva os detalhes da tarefa..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.preview}>
            <label className={styles.label}>Preview</label>
            <div className={styles.previewTask}>
              <div className={styles.previewContent}>
                <h4 className={styles.previewTitle}>
                  {taskTitle || 'Título da Tarefa'}
                </h4>
                {taskDescription && (
                  <p className={styles.previewDescription}>
                    {taskDescription}
                  </p>
                )}
              </div>
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
              disabled={!taskTitle.trim()}
            >
              Criar Tarefa
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
