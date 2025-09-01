import React, { useState } from 'react';
import { Column, Task } from '@/types/firebase';
import { taskService } from '@/services/task.service';
import { CreateTaskDialog } from './CreateTaskDialog';
import styles from './styles/projectCard.module.css';

interface ProjectCardProps {
  column: Column;
  tasks: Task[];
  workspaceColor?: string;
  onTaskCreated?: (task: Task) => void;
}

export function ProjectCard({ column, tasks, workspaceColor = '#162456', onTaskCreated }: ProjectCardProps) {
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);

  const handleCreateTask = () => {
    setIsCreateTaskDialogOpen(true);
  };

  const handleCloseCreateTaskDialog = () => {
    setIsCreateTaskDialogOpen(false);
  };

  const handleCreateTaskSubmit = async (title: string, description?: string) => {
    try {
      console.log('Criando tarefa:', { title, description, columnId: column.id, projectId: column.projectId });
      
      const newTask = await taskService.createTask({
        title,
        description,
        position: tasks.length,
        columnId: column.id,
        projectId: column.projectId
      });
      
      console.log('Tarefa criada com sucesso:', newTask);
      
      if (onTaskCreated) {
        onTaskCreated(newTask);
        console.log('Callback onTaskCreated chamado');
      } else {
        console.warn('onTaskCreated não foi fornecido');
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      alert('Erro ao criar tarefa. Tente novamente.');
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{column.name}</h3>
        <span className={styles.taskCount}>{tasks.length}</span>
      </div>
      
      <div className={styles.tasksList}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className={styles.taskItem}>
              <div className={styles.taskContent}>
                <h4 className={styles.taskTitle}>{task.title}</h4>
                {task.description && (
                  <p className={styles.taskDescription}>{task.description}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyTasks}>
            <p>Nenhuma tarefa ainda</p>
          </div>
        )}
      </div>
      
      <button 
        className={styles.addTaskButton}
        onClick={handleCreateTask}
        style={{ 
          backgroundColor: workspaceColor,
          borderColor: workspaceColor 
        }}
      >
        + Adicionar Tarefa
      </button>

      <CreateTaskDialog
        isOpen={isCreateTaskDialogOpen}
        onClose={handleCloseCreateTaskDialog}
        onCreateTask={handleCreateTaskSubmit}
        columnName={column.name}
        workspaceColor={workspaceColor}
      />
    </div>
  );
}
