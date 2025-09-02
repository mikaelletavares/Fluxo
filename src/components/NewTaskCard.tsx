import React, { useState, useEffect } from 'react';
import styles from './styles/newTaskCard.module.css';

interface Task {
  id: string;
  title: string;
  status: "pending" | "done";
  description?: string;
  startDate?: string;
  endDate?: string;
  comments?: string[];
}

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
}

export function NewTaskCard({ task, onUpdate }: TaskCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [description, setDescription] = useState(task.description || '');
  const [startDate, setStartDate] = useState(task.startDate || '');
  const [endDate, setEndDate] = useState(task.endDate || '');
  const [comments, setComments] = useState<string[]>(task.comments || []);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sincronizar estado com props quando task mudar
  useEffect(() => {
    setDescription(task.description || '');
    setStartDate(task.startDate || '');
    setEndDate(task.endDate || '');
    setComments(task.comments || []);
  }, [task]);

  const handleCardClick = () => {
    console.log('Card clicado! Abrindo dialog...');
    setIsDialogOpen(true);
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

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedTask: Task = {
        ...task,
        description: description.trim() || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        comments: comments.length > 0 ? comments : undefined,
      };
      
      await onUpdate(updatedTask);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const getStatusBadgeClass = () => {
    return task.status === 'done' ? styles.statusDone : styles.statusPending;
  };

  const getStatusText = () => {
    return task.status === 'done' ? 'Finalizado' : 'Pendente';
  };

  return (
    <>
      {/* Task Card */}
      <div className={styles.taskCard} onClick={handleCardClick}>
        <div className={styles.cardContent}>
          <h3 className={styles.taskTitle}>{task.title}</h3>
          <span className={`${styles.statusBadge} ${getStatusBadgeClass()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Dialog Modal */}
      {isDialogOpen && (
        <div className={styles.dialogOverlay} onClick={handleClose}>
          <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.dialogHeader}>
              <h2 className={styles.dialogTitle}>Editar Tarefa</h2>
              <button className={styles.closeButton} onClick={handleClose} disabled={isLoading}>
                ×
              </button>
            </div>

            <div className={styles.dialogBody}>
              {/* Descrição */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Descrição</label>
                <textarea
                  className={styles.textarea}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Adicione uma descrição para a tarefa..."
                  rows={4}
                  disabled={isLoading}
                />
              </div>

              {/* Datas */}
              <div className={styles.dateRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Data de Início</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Data de Término</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Comentários */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Comentários</label>
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
                      placeholder="Adicionar comentário..."
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className={styles.addCommentButton}
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || isLoading}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.dialogFooter}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.saveButton}
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
