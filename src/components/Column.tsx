import React from 'react';
import { Column as ColumnType, Task } from '@/types/firebase';
import { TaskCard } from './TaskCard';
import styles from './styles/Column.module.css';
import { useDroppable } from '@dnd-kit/core';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  droppableId: string;
  onEditTask: (taskId: string, newTitle: string) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskUpdate?: (updatedTask: Task) => void;
}

export function Column({ column, tasks, droppableId, onEditTask, onDeleteTask, onTaskUpdate }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: droppableId,
  });

  return (
    <div ref={setNodeRef} className={styles.column}>
      <h3 className={styles.title}>{column.name} ({tasks.length})</h3>
      <div className={styles.taskList}>
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onEdit={() => { 
              const newTitle = prompt('Novo título da tarefa:', task.title);
              if (newTitle) onEditTask(task.id, newTitle);
            }} 
            onDelete={() => onDeleteTask(task.id)}
            onTaskUpdate={onTaskUpdate}
          />
        ))}
      </div>
    </div>
  );
}