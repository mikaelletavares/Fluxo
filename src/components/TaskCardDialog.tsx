import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/types/firebase';
import { Button } from './Button';
import styles from './styles/taskCardDialog.module.css';

interface TaskCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
  task: Task;
}

export function TaskCardDialog({
  isOpen,
  onClose,
  onUpdate,
  task,
}: TaskCardDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [startDate, setStartDate] = useState(task.startDate || '');
  const [endDate, setEndDate] = useState(task.endDate || '');
  const [comments, setComments] = useState<string[]>(task.comments || []);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setStartDate(task.startDate || '');
      setEndDate(task.endDate || '');
      setComments(task.comments || []);
      setNewComment('');
      setError(null);
    }
  }, [isOpen, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!title.trim()) {
      setError('O título é obrigatório.');
      return;
    }

    setIsLoading(true);
    try {
      const updatedTask: Task = {
        ...task,
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        comments: comments.length > 0 ? comments : undefined,
        updatedAt: new Date()
      };

      await onUpdate(updatedTask);
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar tarefa:', err);
      setError(err.message || 'Erro ao salvar tarefa. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments(prev => [...prev, newComment.trim()]);
      setNewComment('');
    }
  };

  const handleRemoveComment = (index: number) => {
    setComments(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusBadgeClass = (status: TaskStatus) => {
    return status === TaskStatus.COMPLETED ? styles.statusCompleted : styles.statusPending;
  };

  const getStatusText = (status: TaskStatus) => {
    return status === TaskStatus.COMPLETED ? 'Finalizado' : 'Pendente';
  };

  if (!isOpen) return null;

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialogContent}>
        <div className={styles.header}>
          <h2 className={styles.dialogTitle}>Editar Tarefa</h2>
          <button className={styles.closeButton} onClick={onClose} disabled={isLoading}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>Título</label>
            <input
              type="text"
              id="title"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Título da tarefa"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.label}>Status</label>
            <div className={styles.statusContainer}>
              <button
                type="button"
                className={`${styles.statusButton} ${status === TaskStatus.PENDING ? styles.statusButtonActive : ''}`}
                onClick={() => setStatus(TaskStatus.PENDING)}
                disabled={isLoading}
              >
                <span className={`${styles.statusBadge} ${styles.statusPending}`}></span>
                Pendente
              </button>
              <button
                type="button"
                className={`${styles.statusButton} ${status === TaskStatus.COMPLETED ? styles.statusButtonActive : ''}`}
                onClick={() => setStatus(TaskStatus.COMPLETED)}
                disabled={isLoading}
              >
                <span className={`${styles.statusBadge} ${styles.statusCompleted}`}></span>
                Finalizado
              </button>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>Descrição</label>
            <textarea
              id="description"
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              placeholder="Descrição da tarefa (opcional)"
              rows={3}
            />
          </div>

          <div className={styles.dateRow}>
            <div className={styles.formGroup}>
              <label htmlFor="startDate" className={styles.label}>Data de Início</label>
              <input
                type="date"
                id="startDate"
                className={styles.input}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="endDate" className={styles.label}>Data de Término</label>
              <input
                type="date"
                id="endDate"
                className={styles.input}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Comentários</label>
            <div className={styles.commentsContainer}>
              {comments.map((comment, index) => (
                <div key={index} className={styles.commentItem}>
                  <span className={styles.commentText}>{comment}</span>
                  <button
                    type="button"
                    className={styles.removeCommentButton}
                    onClick={() => handleRemoveComment(index)}
                    disabled={isLoading}
                    title="Remover comentário"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              <div className={styles.addCommentContainer}>
                <input
                  type="text"
                  className={styles.commentInput}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddComment())}
                  disabled={isLoading}
                  placeholder="Adicionar comentário..."
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isLoading}
                >
                  Adicionar
                </Button>
              </div>
            </div>
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
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
