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
  onTaskMoved?: (taskId: string, newColumnId: string, newPosition: number) => void;
}

export function ProjectCard({ column, tasks, workspaceColor = '#162456', onTaskCreated, onTaskMoved }: ProjectCardProps) {
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

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      taskId: task.id,
      sourceColumnId: column.id,
      task: task
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { taskId, sourceColumnId, task } = data;
      
      // Se a tarefa já está nesta coluna, não fazer nada
      if (sourceColumnId === column.id) {
        return;
      }
      
      // Calcular nova posição (adicionar no final da lista)
      const newPosition = tasks.length;
      
      if (onTaskMoved) {
        onTaskMoved(taskId, column.id, newPosition);
      }
    } catch (error) {
      console.error('Erro ao processar drop:', error);
    }
  };

  return (
    <div 
      className={styles.card}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{column.name}</h3>
        <span className={styles.taskCount}>{tasks.length}</span>
      </div>
      
      <div className={styles.tasksList}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className={styles.taskItem}
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
            >
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
