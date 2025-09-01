import { createContext, Dispatch, ReactNode, useReducer } from 'react';
import { Board, Column, Task } from '@/types';

export interface BoardState {
  board: Board | null;
  columns: Column[];
  tasks: Task[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

export enum BoardActionType {
  SET_BOARD_DATA = 'SET_BOARD_DATA',
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR',
  MOVE_TASK = 'MOVE_TASK',
}

export type BoardAction =
  | { type: BoardActionType.SET_BOARD_DATA; payload: { board: Board; columns: Column[]; tasks: Task[] } }
  | { type: BoardActionType.SET_LOADING; payload: boolean }
  | { type: BoardActionType.SET_ERROR; payload: string | null }
  | { type: BoardActionType.MOVE_TASK; payload: { taskId: string; fromColumnId: string; toColumnId: string; newPosition: number } };

interface BoardContextProps {
  state: BoardState;
  dispatch: Dispatch<BoardAction>;
}

const initialState: BoardState = {
  board: null,
  columns: [],
  tasks: [],
  isLoading: true,
  isError: false,
  error: null,
};

export const BoardContext = createContext<BoardContextProps | undefined>(undefined);

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case BoardActionType.SET_BOARD_DATA:
      const { board, columns, tasks } = action.payload;
      return {
        ...state,
        board,
        columns: columns.sort((a, b) => a.position - b.position),
        tasks,
        isLoading: false,
        isError: false,
        error: null,
      };

    case BoardActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case BoardActionType.SET_ERROR:
      return {
        ...state,
        isError: action.payload !== null,
        error: action.payload,
        isLoading: false,
      };

    case BoardActionType.MOVE_TASK:
      const { taskId, fromColumnId, toColumnId, newPosition } = action.payload;

      const taskToMove = state.tasks.find(task => task.id === taskId);
      if (!taskToMove) return state;

      const updatedTasks = state.tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, columnId: toColumnId, position: newPosition };
        }

        if (task.columnId === fromColumnId && task.position > taskToMove.position) {
          return { ...task, position: task.position - 1 };
        }

        if (task.columnId === toColumnId && task.id !== taskId && task.position >= newPosition) {
          return { ...task, position: task.position + 1 };
        }

        return task;
      });

      return {
        ...state,
        tasks: updatedTasks,
      };

    default:
      return state;
  }
}

interface BoardProviderProps {
  children: ReactNode;
}

export function BoardProvider({ children }: BoardProviderProps) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}