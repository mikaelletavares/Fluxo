import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task, CreateTask } from '@/types/firebase';

class TaskService {
  private collectionName = 'tasks';

  async createTask(taskData: CreateTask): Promise<Task> {
    try {
      console.log('Salvando tarefa no Firebase:', taskData);
      
      // Filtrar campos undefined para evitar erro no Firebase
      const cleanTaskData = {
        title: taskData.title,
        position: taskData.position,
        columnId: taskData.columnId,
        projectId: taskData.projectId,
        status: taskData.status,
        ...(taskData.description && { description: taskData.description }),
        ...(taskData.startDate && { startDate: taskData.startDate }),
        ...(taskData.endDate && { endDate: taskData.endDate }),
        ...(taskData.comments && { comments: taskData.comments })
      };
      
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...cleanTaskData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const newTask = {
        id: docRef.id,
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Tarefa salva no Firebase com ID:', docRef.id);
      return newTask;
    } catch (error) {
      console.error('Erro detalhado ao criar tarefa:', error);
      throw new Error(`Erro ao criar tarefa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async getColumnTasks(columnId: string): Promise<Task[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('columnId', '==', columnId)
      );
      
      const querySnapshot = await getDocs(q);
      const tasks: Task[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          position: data.position,
          columnId: data.columnId,
          projectId: data.projectId,
          status: data.status || 'pending',
          startDate: data.startDate,
          endDate: data.endDate,
          comments: data.comments || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      });
      
      // Ordenar localmente por posição
      return tasks.sort((a, b) => a.position - b.position);
    } catch (error) {
      console.error('Erro detalhado ao buscar tarefas da coluna:', error);
      throw new Error(`Erro ao buscar tarefas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async getProjectTasks(projectId: string): Promise<Task[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('projectId', '==', projectId)
      );
      
      const querySnapshot = await getDocs(q);
      const tasks: Task[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          position: data.position,
          columnId: data.columnId,
          projectId: data.projectId,
          status: data.status || 'pending',
          startDate: data.startDate,
          endDate: data.endDate,
          comments: data.comments || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      });
      
      // Ordenar localmente por posição
      return tasks.sort((a, b) => a.position - b.position);
    } catch (error) {
      console.error('Erro detalhado ao buscar tarefas do projeto:', error);
      throw new Error(`Erro ao buscar tarefas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      const taskRef = doc(db, this.collectionName, taskId);
      
      // Filtrar campos undefined para evitar erro no Firebase
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );
      
      await updateDoc(taskRef, {
        ...cleanUpdates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw new Error('Erro ao atualizar tarefa');
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      const taskRef = doc(db, this.collectionName, taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      throw new Error('Erro ao excluir tarefa');
    }
  }

  async updateTaskStatus(taskId: string, status: string): Promise<void> {
    try {
      const taskRef = doc(db, this.collectionName, taskId);
      
      await updateDoc(taskRef, {
        status: status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw new Error('Erro ao atualizar status da tarefa');
    }
  }
}

export const taskService = new TaskService();