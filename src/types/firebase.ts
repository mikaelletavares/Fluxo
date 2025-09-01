

// Tipos para o Firestore
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  workspaceId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  name: string;
  position: number;
  projectId: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  position: number;
  columnId: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para criação (sem id e timestamps)
export interface CreateWorkspace {
  name: string;
  color: string;
  userId: string;
}

export interface CreateProject {
  name: string;
  description?: string;
  icon?: string;
  workspaceId: string;
  userId: string;
}

export interface CreateColumn {
  name: string;
  position: number;
  projectId: string;
}

export interface CreateTask {
  title: string;
  description?: string;
  position: number;
  columnId: string;
  projectId: string;
}
