import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';


export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  birthDate?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  birthDate?: string;
  photoURL?: string;
}

class AuthService {
  // Login
  async login({ email, password }: LoginData): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Buscar perfil do usuário no Firestore
      try {
        const userProfile = await this.getUserProfile(user.uid);
        return userProfile;
      } catch (profileError) {
        // Se o perfil não existir, criar um básico
        console.warn('Perfil não encontrado, criando perfil básico:', profileError);
        const basicProfile: UserProfile = {
          id: user.uid,
          name: user.displayName || 'Usuário',
          email: user.email || email
        };
        
        // Tentar criar o perfil no Firestore
        try {
          await this.createUserProfile(basicProfile);
        } catch (createError) {
          console.warn('Erro ao criar perfil, continuando com perfil básico:', createError);
        }
        
        return basicProfile;
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Registro
  async register({ name, email, password, birthDate }: RegisterData): Promise<UserProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Atualizar perfil do usuário
      await updateProfile(user, {
        displayName: name
      });

      // Criar perfil no Firestore
      const userProfile: UserProfile = {
        id: user.uid,
        name,
        email: user.email!,
        birthDate,
        photoURL: undefined
      };

      await this.createUserProfile(userProfile);

      return userProfile;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error('Erro ao fazer logout');
    }
  }

  // Obter perfil do usuário
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          id: userId,
          name: userData.name,
          email: userData.email,
          birthDate: userData.birthDate,
          photoURL: userData.photoURL
        };
      } else {
        throw new Error('Perfil do usuário não encontrado');
      }
    } catch (error: any) {
      throw new Error('Erro ao buscar perfil do usuário');
    }
  }

  // Criar perfil do usuário no Firestore
  private async createUserProfile(userProfile: UserProfile): Promise<void> {
    try {
      await setDoc(doc(db, 'users', userProfile.id), {
        name: userProfile.name,
        email: userProfile.email,
        birthDate: userProfile.birthDate,
        photoURL: userProfile.photoURL,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      throw new Error('Erro ao criar perfil do usuário');
    }
  }

  // Listener para mudanças de autenticação
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userProfile = await this.getUserProfile(user.uid);
          callback(userProfile);
        } catch (error) {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // Obter usuário atual
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Converter códigos de erro do Firebase para mensagens em português
  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/email-already-in-use': 'Este email já está em uso',
      'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres',
      'auth/invalid-email': 'Email inválido',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
      'auth/user-disabled': 'Esta conta foi desabilitada'
    };

    return errorMessages[errorCode] || 'Erro de autenticação';
  }
}

export const authService = new AuthService();