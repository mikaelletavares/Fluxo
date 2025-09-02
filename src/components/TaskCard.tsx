import React, { useState, useRef, useEffect } from 'react';
import { Task, TaskStatus } from '@/types/firebase';
import { TaskCardDialog } from './TaskCardDialog';
import styles from './styles/TaskCard.module.css';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { taskService } from '@/services/task.service';

interface TaskCardProps {
  task: Task;
  onEdit: () => void; 
  onDelete: () => void;
  onTaskUpdate?: (updatedTask: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete, onTaskUpdate }: TaskCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      columnId: task.columnId,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTaskToggle = async (isChecked: boolean) => {
    try {
      const newStatus = isChecked ? TaskStatus.COMPLETED : TaskStatus.PENDING;
      await taskService.updateTaskStatus(task.id, newStatus);
      
      // Atualizar a tarefa localmente
      const updatedTask = {
        ...task,
        status: newStatus
      };
      
      onTaskUpdate?.(updatedTask);
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
    }
  };

  const handleEdit = () => {
    setIsDropdownOpen(false);
    onEdit();
  };

  const handleDelete = () => {
    setIsDropdownOpen(false);
    onDelete();
  };

  const handleCardClick = () => {
    setIsDialogOpen(true);
  };

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      await taskService.updateTask(updatedTask.id, updatedTask);
      onTaskUpdate?.(updatedTask);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  };

  const getStatusBadgeClass = (status: TaskStatus) => {
    return status === TaskStatus.COMPLETED ? styles.statusCompleted : styles.statusPending;
  };

  const getStatusText = (status: TaskStatus) => {
    return status === TaskStatus.COMPLETED ? 'Finalizado' : 'Pendente';
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={styles.taskCard}
        onClick={handleCardClick}
      >
        <div className={styles.taskHeader}>
          <div 
            className={`${styles.checkmark} ${task.status === TaskStatus.COMPLETED ? styles.checked : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleTaskToggle(!(task.status === TaskStatus.COMPLETED));
            }}
          >
            {task.status === TaskStatus.COMPLETED && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path 
                  d="M13.5 4.5L6 12L2.5 8.5" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <div className={styles.taskContent}>
            <div className={styles.taskTitleRow}>
              <h4 className={`${styles.title} ${task.status === TaskStatus.COMPLETED ? styles.completed : ''}`}>
                {task.title}
              </h4>
              <span className={`${styles.statusBadge} ${getStatusBadgeClass(task.status)}`}>
                {getStatusText(task.status)}
              </span>
            </div>
            {task.description && (
              <p className={`${styles.description} ${task.status === TaskStatus.COMPLETED ? styles.completed : ''}`}>
                {task.description}
              </p>
            )}
            {(task.startDate || task.endDate) && (
              <div className={styles.dateInfo}>
                {task.startDate && (
                  <span className={styles.dateItem}>
                    📅 Início: {new Date(task.startDate).toLocaleDateString('pt-BR')}
                  </span>
                )}
                {task.endDate && (
                  <span className={styles.dateItem}>
                    🏁 Fim: {new Date(task.endDate).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            )}
            {task.comments && task.comments.length > 0 && (
              <div className={styles.commentsInfo}>
                💬 {task.comments.length} comentário{task.comments.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
          
          {/* Botão de 3 pontinhos */}
          <div className={styles.menuContainer} ref={dropdownRef}>
            <button
              className={styles.menuButton}
              onClick={toggleDropdown}
              aria-label="Menu de opções"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="12" cy="5" r="1"/>
                <circle cx="12" cy="19" r="1"/>
              </svg>
            </button>

            {/* Menu Dropdown */}
            {isDropdownOpen && (
              <div className={styles.dropdown}>
                <button
                  className={styles.dropdownItem}
                  onClick={handleEdit}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Editar
                </button>
                
                <button
                  className={styles.dropdownItem}
                  onClick={handleDelete}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskCardDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onUpdate={handleTaskUpdate}
        task={task}
      />
    </>
  );
}