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
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de arquivo não suportado. Use JPG, PNG, GIF ou WebP.');
      }

      // Validar tamanho do arquivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Arquivo muito grande. Tamanho máximo permitido: 5MB.');
      }

      // Criar referência para o arquivo no Storage
      const imageRef = ref(storage, `profile-images/${userId}/${Date.now()}-${file.name}`);
      
      console.log('Iniciando upload da imagem...', { userId, fileName: file.name, fileSize: file.size });
      
      // Upload do arquivo
      const snapshot = await uploadBytes(imageRef, file);
      console.log('Upload concluído:', snapshot);
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('URL de download obtida:', downloadURL);
      
      // Atualizar perfil do usuário com a nova URL da imagem
      await this.updateUserProfile(userId, { photoURL: downloadURL });
      
      return downloadURL;
    } catch (error) {
      console.error('Erro detalhado ao fazer upload da imagem:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('storage/unauthorized')) {
          throw new Error('Você não tem permissão para fazer upload de imagens.');
        } else if (error.message.includes('storage/object-not-found')) {
          throw new Error('Arquivo não encontrado.');
        } else if (error.message.includes('storage/bucket-not-found')) {
          throw new Error('Bucket de armazenamento não encontrado.');
        } else if (error.message.includes('storage/project-not-found')) {
          throw new Error('Projeto não encontrado.');
        } else if (error.message.includes('storage/quota-exceeded')) {
          throw new Error('Cota de armazenamento excedida.');
        } else if (error.message.includes('storage/unauthenticated')) {
          throw new Error('Você precisa estar logado para fazer upload de imagens.');
        } else if (error.message.includes('storage/retry-limit-exceeded')) {
          throw new Error('Tentativas de upload excedidas. Tente novamente mais tarde.');
        } else if (error.message.includes('storage/invalid-checksum')) {
          throw new Error('Arquivo corrompido. Tente novamente.');
        } else if (error.message.includes('storage/canceled')) {
          throw new Error('Upload cancelado.');
        } else if (error.message.includes('storage/invalid-event-name')) {
          throw new Error('Nome de evento inválido.');
        } else if (error.message.includes('storage/invalid-url')) {
          throw new Error('URL inválida.');
        } else if (error.message.includes('storage/invalid-argument')) {
          throw new Error('Argumento inválido.');
        } else if (error.message.includes('storage/no-default-bucket')) {
          throw new Error('Bucket padrão não configurado.');
        } else if (error.message.includes('storage/cannot-slice-blob')) {
          throw new Error('Não foi possível processar o arquivo.');
        } else if (error.message.includes('storage/server-file-wrong-size')) {
          throw new Error('Tamanho do arquivo incorreto.');
        }
      }
      
      throw new Error('Erro ao fazer upload da imagem de perfil. Tente novamente.');
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
