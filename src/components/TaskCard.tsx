import React from 'react';
import { Task } from '@/types';
import styles from './styles/TaskCard.module.css';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onEdit: () => void; 
  onDelete: () => void; 
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      columnId: task.columnId,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={styles.taskCard}
    >
      <h4 className={styles.title}>{task.title}</h4>
      <p className={styles.description}>{task.description}</p>
      <div className={styles.actions}>
        <button className={styles.editButton} onClick={onEdit}>Editar</button>
        <button className={styles.deleteButton} onClick={onDelete}>Excluir</button>
      </div>
    </div>
  );
}