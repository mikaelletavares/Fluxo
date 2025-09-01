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
import { Project, CreateProject } from '@/types/firebase';

class ProjectService {
  private collectionName = 'projects';

  // Criar novo projeto
  async createProject(projectData: CreateProject): Promise<Project> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...projectData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      throw new Error('Erro ao criar projeto');
    }
  }

  // Buscar projetos de uma área de trabalho
  async getWorkspaceProjects(workspaceId: string): Promise<Project[]> {
    try {
      console.log('Buscando projetos para workspaceId:', workspaceId);

      // Tentar consulta simples primeiro
      const q = query(
        collection(db, this.collectionName),
        where('workspaceId', '==', workspaceId)
      );

      const querySnapshot = await getDocs(q);
      const projects: Project[] = [];

      console.log('Query executada, documentos encontrados:', querySnapshot.size);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Documento encontrado:', doc.id, data);
        projects.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          icon: data.icon,
          workspaceId: data.workspaceId,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      });

      // Ordenar manualmente por data de criação
      projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      console.log('Projetos retornados:', projects);
      return projects;
    } catch (error: any) {
      console.error('Erro detalhado ao buscar projetos:', error);

      // Se for erro de permissão, retornar array vazio em vez de erro
      if (error.code === 'permission-denied') {
        console.warn('Permissão negada, retornando array vazio');
        return [];
      }

      throw new Error(`Erro ao buscar projetos: ${error.message || error}`);
    }
  }

  // Buscar todos os projetos do usuário
  async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const projects: Project[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        projects.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          icon: data.icon,
          workspaceId: data.workspaceId,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      });

      return projects;
    } catch (error) {
      throw new Error('Erro ao buscar projetos do usuário');
    }
  }

  // Atualizar projeto
  async updateProject(projectId: string, updates: Partial<CreateProject>): Promise<void> {
    try {
      const projectRef = doc(db, this.collectionName, projectId);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw new Error('Erro ao atualizar projeto');
    }
  }

  // Deletar projeto
  async deleteProject(projectId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, projectId));
    } catch (error) {
      throw new Error('Erro ao deletar projeto');
    }
  }

  // Buscar projeto por ID
  async getProjectById(projectId: string): Promise<Project | null> {
    try {
      const projectRef = doc(db, this.collectionName, projectId);
      const projectSnap = await getDoc(projectRef);
      
      if (projectSnap.exists()) {
        const data = projectSnap.data();
        return {
          id: projectSnap.id,
          name: data.name,
          description: data.description,
          icon: data.icon,
          workspaceId: data.workspaceId,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      }

      return null;
    } catch (error) {
      throw new Error('Erro ao buscar projeto');
    }
  }
}

export const projectService = new ProjectService();