import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Workspace, CreateWorkspace } from '@/types/firebase';

class WorkspaceService {
  private collectionName = 'workspaces';

  // Criar nova área de trabalho
  async createWorkspace(workspaceData: CreateWorkspace): Promise<Workspace> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...workspaceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        ...workspaceData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      throw new Error('Erro ao criar área de trabalho');
    }
  }

  // Buscar áreas de trabalho do usuário
  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    try {
      console.log('Buscando workspaces para userId:', userId);
      
      // Tentar consulta simples primeiro
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const workspaces: Workspace[] = [];

      console.log('Query executada, documentos encontrados:', querySnapshot.size);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Documento encontrado:', doc.id, data);
        workspaces.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          color: data.color,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      });

      // Ordenar manualmente por data de criação
      workspaces.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      console.log('Workspaces retornados:', workspaces);
      return workspaces;
    } catch (error) {
      console.error('Erro detalhado ao buscar workspaces:', error);
      
      // Se for erro de permissão, retornar array vazio em vez de erro
      if (error.code === 'permission-denied') {
        console.warn('Permissão negada, retornando array vazio');
        return [];
      }
      
      throw new Error(`Erro ao buscar áreas de trabalho: ${error.message || error}`);
    }
  }

  // Atualizar área de trabalho
  async updateWorkspace(workspaceId: string, updates: Partial<CreateWorkspace>): Promise<void> {
    try {
      const workspaceRef = doc(db, this.collectionName, workspaceId);
      await updateDoc(workspaceRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw new Error('Erro ao atualizar área de trabalho');
    }
  }

  // Deletar área de trabalho e todos os dados relacionados
  async deleteWorkspace(workspaceId: string): Promise<void> {
    try {
      // Importar outros serviços para exclusão em cascata
      const { projectService } = await import('./project.service');
      const { columnService } = await import('./column.service');
      const { taskService } = await import('./task.service');

      // 1. Buscar todos os projetos do workspace
      const projects = await projectService.getWorkspaceProjects(workspaceId);
      
      // 2. Para cada projeto, excluir colunas e tarefas
      for (const project of projects) {
        // Buscar colunas do projeto
        const columns = await columnService.getProjectColumns(project.id);
        
        // Para cada coluna, excluir todas as tarefas
        for (const column of columns) {
          const tasks = await taskService.getColumnTasks(column.id);
          for (const task of tasks) {
            await taskService.deleteTask(task.id);
          }
          // Excluir a coluna
          await columnService.deleteColumn(column.id);
        }
        
        // Excluir o projeto
        await projectService.deleteProject(project.id);
      }
      
      // 3. Finalmente, excluir o workspace
      await deleteDoc(doc(db, this.collectionName, workspaceId));
    } catch (error) {
      console.error('Erro ao deletar workspace:', error);
      throw new Error('Erro ao deletar área de trabalho e dados relacionados');
    }
  }

  // Buscar área de trabalho por ID
  async getWorkspaceById(workspaceId: string): Promise<Workspace | null> {
    try {
      const workspaceRef = doc(db, this.collectionName, workspaceId);
      const workspaceSnap = await getDoc(workspaceRef);
      
      if (workspaceSnap.exists()) {
        const data = workspaceSnap.data();
        return {
          id: workspaceSnap.id,
          name: data.name,
          description: data.description,
          color: data.color,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      }

      return null;
    } catch (error) {
      throw new Error('Erro ao buscar área de trabalho');
    }
  }
}

export const workspaceService = new WorkspaceService();
