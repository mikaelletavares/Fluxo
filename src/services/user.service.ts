import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { UserProfile } from '@/context/AuthContext';

class UserService {
  private collectionName = 'users';

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, this.collectionName, userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw new Error('Erro ao atualizar perfil do usuário');
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, this.collectionName, userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          id: userSnap.id,
          name: data.name,
          email: data.email,
          birthDate: data.birthDate,
          photoURL: data.photoURL
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw new Error('Erro ao buscar perfil do usuário');
    }
  }

  async uploadProfileImage(userId: string, file: File): Promise<string> {
    try {
      // Criar referência para o arquivo no Storage
      const imageRef = ref(storage, `profile-images/${userId}/${Date.now()}-${file.name}`);
      
      // Upload do arquivo
      const snapshot = await uploadBytes(imageRef, file);
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Atualizar perfil do usuário com a nova URL da imagem
      await this.updateUserProfile(userId, { photoURL: downloadURL });
      
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw new Error('Erro ao fazer upload da imagem de perfil');
    }
  }

  async deleteProfileImage(userId: string, imageUrl: string): Promise<void> {
    try {
      // Extrair o caminho da imagem da URL
      const imageRef = ref(storage, imageUrl);
      
      // Deletar a imagem do Storage
      await deleteObject(imageRef);
      
      // Remover a URL do perfil do usuário
      await this.updateUserProfile(userId, { photoURL: undefined });
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      throw new Error('Erro ao deletar imagem de perfil');
    }
  }
}

export const userService = new UserService();
