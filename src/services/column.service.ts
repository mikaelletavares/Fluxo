import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Column, CreateColumn } from '@/types/firebase';

class ColumnService {
  private collectionName = 'columns';

  async createColumn(columnData: CreateColumn): Promise<Column> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...columnData,
        createdAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        ...columnData,
        createdAt: new Date()
      };
    } catch (error) {
      throw new Error('Erro ao criar coluna');
    }
  }

  async getProjectColumns(projectId: string): Promise<Column[]> {
    try {
      // Primeiro, vamos tentar sem orderBy para evitar problemas de índice
      const q = query(
        collection(db, this.collectionName),
        where('projectId', '==', projectId)
      );
      
      const querySnapshot = await getDocs(q);
      const columns: Column[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        columns.push({
          id: doc.id,
          name: data.name,
          position: data.position || 0,
          projectId: data.projectId,
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });
      
      // Ordenar localmente por posição
      return columns.sort((a, b) => a.position - b.position);
    } catch (error) {
      console.error('Erro detalhado ao buscar colunas:', error);
      // Se não há colunas, retornar array vazio em vez de erro
      if (error instanceof Error && error.message.includes('No documents')) {
        return [];
      }
      throw new Error(`Erro ao buscar colunas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async updateColumn(columnId: string, updates: Partial<Column>): Promise<void> {
    try {
      const columnRef = doc(db, this.collectionName, columnId);
      await updateDoc(columnRef, updates);
    } catch (error) {
      throw new Error('Erro ao atualizar coluna');
    }
  }

  async deleteColumn(columnId: string): Promise<void> {
    try {
      const columnRef = doc(db, this.collectionName, columnId);
      await deleteDoc(columnRef);
    } catch (error) {
      throw new Error('Erro ao excluir coluna');
    }
  }
}

export const columnService = new ColumnService();
