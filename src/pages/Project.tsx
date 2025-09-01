import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { BoardProvider, BoardContext, BoardActionType } from '@/context/BoardContext';
import { boardService } from '@/services/board.service';
import { Column } from '@/components/Column';
import styles from './styles/project.module.css';
import { DndContext, DragEndEvent } from '@dnd-kit/core';

function ProjectContent() {
  const { id } = useParams<{ id: string }>();
  const context = useContext(BoardContext);

  if (!context) {
    throw new Error('ProjectBoardContent deve ser usado dentro de um BoardProvider');
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
      }
    };

    fetchInitialData();
  }, [id, dispatch]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = String(active.id);
    const fromColumnId = String(active.data.current?.columnId);
    
    const toColumnId = String(over.id);
    
    const tasksInToColumn = state.tasks.filter(task => task.columnId === toColumnId);
    const newPosition = tasksInToColumn.length + 1;

    dispatch({
      type: BoardActionType.MOVE_TASK,
      payload: {
        taskId,
        fromColumnId,
        toColumnId,
        newPosition,
      },
    });
  };

  if (state.isLoading) {
    return <div className={styles.statusMessage}>Carregando quadro...</div>;
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