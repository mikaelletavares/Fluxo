import React, { useState } from 'react';
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

export function SimpleTaskCard({ task, onUpdate }: TaskCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCardClick = () => {
    console.log('Card clicado! Estado atual:', isDialogOpen);
    setIsDialogOpen(true);
    console.log('Estado após setState:', true);
  };

  const handleClose = () => {
    console.log('Fechando dialog...');
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
      <div 
        className={styles.taskCard} 
        onClick={handleCardClick}
        style={{ border: '2px solid red' }} // Debug visual
      >
        <div className={styles.cardContent}>
          <h3 className={styles.taskTitle}>{task.title}</h3>
          <span className={`${styles.statusBadge} ${getStatusBadgeClass()}`}>
            {getStatusText()}
          </span>
        </div>
        <div style={{ fontSize: '12px', color: 'red', marginTop: '8px' }}>
          Estado: {isDialogOpen ? 'ABERTO' : 'FECHADO'}
        </div>
      </div>

      {/* Dialog Modal */}
      {isDialogOpen && (
        <div 
          className={styles.dialogOverlay} 
          onClick={handleClose}
          style={{ border: '3px solid blue' }} // Debug visual
        >
          <div 
            className={styles.dialogContent} 
            onClick={(e) => e.stopPropagation()}
            style={{ border: '3px solid green' }} // Debug visual
          >
            <div className={styles.dialogHeader}>
              <h2 className={styles.dialogTitle}>Editar Tarefa - {task.title}</h2>
              <button className={styles.closeButton} onClick={handleClose}>
                ×
              </button>
            </div>

            <div className={styles.dialogBody}>
              <p>Dialog funcionando! Task: {task.title}</p>
              <p>Status: {task.status}</p>
              {task.description && <p>Descrição: {task.description}</p>}
            </div>

            <div className={styles.dialogFooter}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleClose}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
