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

  // Deletar área de trabalho
  async deleteWorkspace(workspaceId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, workspaceId));
    } catch (error) {
      throw new Error('Erro ao deletar área de trabalho');
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
