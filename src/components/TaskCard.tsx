import React from 'react';
import { Task } from '@/types';
import styles from './styles/TaskCard.module.css';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className={styles.taskCard}>
      <h4 className={styles.title}>{task.title}</h4>
      <p className={styles.description}>{task.description}</p>
    </div>
  );
}