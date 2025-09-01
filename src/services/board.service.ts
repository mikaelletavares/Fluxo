import { Board, Column, Task } from '@/types';
import apiClient from '@/api/client';

export interface BoardData {
  board: Board;
  columns: Column[];
  tasks: Task[];
}

async function fetchBoardData(boardId: string): Promise<BoardData> {
  const response = await apiClient.get<BoardData>(`/boards/${boardId}`);
  return response.data;
}

export const boardService = {
  fetchBoardData,
};