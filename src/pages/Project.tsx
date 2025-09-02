import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { BoardProvider, BoardContext, BoardActionType } from '@/context/BoardContext';
import { boardService } from '@/services/board.service';
import { Column } from '@/components/Column';
import styles from './styles/project.module.css';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { taskService } from '@/services/task.service';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/Spinner';

function ProjectContent() {
  const { id } = useParams<{ id: string }>();
  const context = useContext(BoardContext);
  const queryClient = useQueryClient();

  if (!context) {
    throw new Error('ProjectContent deve ser usado dentro de um BoardProvider');
  }

  const { state, dispatch } = context;

  useEffect(() => {
    const fetchInitialData = async () => {
      const boardId = id; 
      if (!boardId) return;

      dispatch({ type: BoardActionType.SET_LOADING, payload: true });
      try {
        const data = await boardService.fetchBoardData(boardId);
        dispatch({
          type: BoardActionType.SET_BOARD_DATA,
          payload: {
            board: data.board,
            columns: data.columns,
            tasks: data.tasks,
          },
        });
      } catch (err) {
        console.error('Falha ao carregar os dados do quadro:', err);
        dispatch({
          type: BoardActionType.SET_ERROR,
          payload: 'Falha ao carregar os dados do quadro.',
        });
        toast.error('Falha ao carregar os dados do quadro.');
      }
    };

    fetchInitialData();
  }, [id, dispatch]);

  const updateTaskMutation = useMutation({
    mutationFn: (data: { taskId: string; updates: any }) => taskService.updateTask(data.taskId, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', id] });
      toast.success('Tarefa atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar a tarefa.');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', id] });
      toast.success('Tarefa excluída com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir a tarefa.');
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = String(active.id);
    const fromColumnId = String(active.data.current?.columnId);
    const toColumnId = String(over.id);
    if (fromColumnId === toColumnId) return;
    updateTaskMutation.mutate({ taskId, updates: { columnId: toColumnId } });
  };

  const handleEditTask = (taskId: string, newTitle: string) => {
    updateTaskMutation.mutate({ taskId, updates: { title: newTitle } });
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Tem certeza de que deseja excluir esta tarefa?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const handleTaskUpdate = (updatedTask: any) => {
    // Atualizar a tarefa no estado local
    dispatch({
      type: BoardActionType.UPDATE_TASK,
      payload: updatedTask
    });
  };

  if (state.isLoading) {
    return (
      <div className={styles.statusMessage}>
        <Spinner />
        <p>Carregando quadro...</p>
      </div>
    );
  }

  if (state.isError) {
    return <div className={styles.errorMessage}>Erro: {state.error}</div>;
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={styles.boardContainer}>
        <h1 className={styles.boardTitle}>{state.board?.name}</h1>
        <div className={styles.columnsContainer}>
          {state.columns.map((column) => {
            const tasksInColumn = state.tasks
              .filter((task) => task.columnId === column.id)
              .sort((a, b) => a.position - b.position);

            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasksInColumn}
                droppableId={column.id}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onTaskUpdate={handleTaskUpdate}
              />
            );
          })}
        </div>
      </div>
    </DndContext>
  );
}

export function ProjectPage() {
  return (
    <BoardProvider>
      <ProjectContent />
    </BoardProvider>
  );
}