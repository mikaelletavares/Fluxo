import React, { useState, useRef, useEffect } from 'react';
import { Column, Task, TaskStatus } from '@/types/firebase';
import { taskService } from '@/services/task.service';
import { CreateTaskDialog } from './CreateTaskDialog';
import { SimpleTaskDialog } from './SimpleTaskDialog';
import styles from './styles/projectCard.module.css';

interface ProjectCardProps {
  column: Column;
  tasks: Task[];
  workspaceColor?: string;
  onTaskCreated?: (task: Task) => void;
  onTaskMoved?: (taskId: string, newColumnId: string, newPosition: number) => void;
  onTaskUpdated?: (updatedTask: Task) => void;
  onTaskDeleted?: (taskId: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProjectCard({ column, tasks, workspaceColor = '#162456', onTaskCreated, onTaskMoved, onTaskUpdated, onTaskDeleted, onEdit, onDelete }: ProjectCardProps) {
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleCreateTask = () => {
    setIsCreateTaskDialogOpen(true);
  };

  const handleCloseCreateTaskDialog = () => {
    setIsCreateTaskDialogOpen(false);
  };

  const handleTaskClick = (task: Task) => {
    console.log('Task clicada no ProjectCard:', task.title);
    console.log('Renderizando dialog com Portal no document.body');
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      await taskService.updateTask(updatedTask.id, updatedTask);
      console.log('Task atualizada no banco de dados:', updatedTask);
      // Notificar o componente pai para atualizar a lista de tarefas
      onTaskUpdated?.(updatedTask);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  };

  const handleCloseTaskDialog = () => {
    setIsTaskDialogOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      console.log('Task excluída do banco de dados:', taskId);
      // Notificar o componente pai para remover a task da lista
      onTaskDeleted?.(taskId);
    } catch (error) {
      console.error('Erro ao excluir tarefa do banco de dados:', error);
    }
  };

  const handleEdit = () => {
    setIsDropdownOpen(false);
    onEdit?.();
  };

  const handleDelete = () => {
    setIsDropdownOpen(false);
    onDelete?.();
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCreateTaskSubmit = async (title: string, description?: string) => {
    try {
      console.log('Criando tarefa:', { title, description, columnId: column.id, projectId: column.projectId });
      
      const newTask = await taskService.createTask({
        title,
        description,
        status: TaskStatus.PENDING,
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
        <div className={styles.headerLeft}>
          <h3 className={styles.cardTitle}>{column.name}</h3>
          <span className={styles.taskCount}>{tasks.length}</span>
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
                disabled={!onEdit}
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
                disabled={!onDelete}
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
      
      <div className={styles.tasksList}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className={styles.taskItem}
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <div className={styles.taskContent} onClick={() => handleTaskClick(task)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 className={styles.taskTitle} style={{ flex: 1, margin: 0 }}>{task.title}</h4>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                    flexShrink: 0,
                    marginLeft: '0.5rem',
                    backgroundColor: task.status === TaskStatus.COMPLETED ? '#d1fae5' : '#fef3c7',
                    color: task.status === TaskStatus.COMPLETED ? '#065f46' : '#92400e',
                    border: `1px solid ${task.status === TaskStatus.COMPLETED ? '#10b981' : '#f59e0b'}`
                  }}>
                    {task.status === TaskStatus.COMPLETED ? 'Finalizado' : 'Pendente'}
                  </span>
                </div>
                
                {task.description && (
                  <p className={styles.taskDescription}>{task.description}</p>
                )}
                
                {/* Mostrar informações adicionais se existirem */}
                {(task.startDate || task.endDate) && (
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    {task.startDate && <span>📅 {new Date(task.startDate).toLocaleDateString('pt-BR')}</span>}
                    {task.startDate && task.endDate && <span> - </span>}
                    {task.endDate && <span>🏁 {new Date(task.endDate).toLocaleDateString('pt-BR')}</span>}
                  </div>
                )}
                {task.comments && task.comments.length > 0 && (
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    💬 {task.comments.length} comentário{task.comments.length > 1 ? 's' : ''}
                  </div>
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

      {/* Dialog para editar tarefa */}
      {selectedTask && (
        <SimpleTaskDialog
          isOpen={isTaskDialogOpen}
          onClose={handleCloseTaskDialog}
          onUpdate={handleTaskUpdate}
          onDelete={handleDeleteTask}
          task={selectedTask}
        />
      )}
    </div>
  );
}
