import React from 'react';
import { Column as ColumnType, Task } from '@/types';
import { TaskCard } from './TaskCard';
import styles from './styles/Column.module.css';
import { useDroppable } from '@dnd-kit/core'; 

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  droppableId: string; 
}

export function Column({ column, tasks, droppableId }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: droppableId, 
  });

  return (
    <div ref={setNodeRef} className={styles.column}>
      <h3 className={styles.title}>{column.name} ({tasks.length})</h3>
      <div className={styles.taskList}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}