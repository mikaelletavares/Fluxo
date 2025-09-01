# 🔥 Configuração do Firebase

## 📋 Passos para configurar o Firebase no seu projeto

### 1. **Criar projeto no Firebase Console**
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Digite o nome do projeto (ex: "fluxo-app")
4. Ative/desative o Google Analytics conforme preferir
5. Clique em "Criar projeto"

### 2. **Configurar Authentication**
1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Vá para a aba "Sign-in method"
4. Ative "Email/senha"
5. Clique em "Salvar"

### 3. **Configurar Firestore Database**
1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Começar no modo de teste" (para desenvolvimento)
4. Escolha uma localização (ex: us-central1)
5. Clique em "Concluído"

### 4. **Obter configurações do projeto**
1. No menu lateral, clique no ícone de engrenagem ⚙️
2. Clique em "Configurações do projeto"
3. Role para baixo até "Seus aplicativos"
4. Clique no ícone `</>` (Web)
5. Digite um nome para o app (ex: "fluxo-web")
6. **NÃO** marque "Também configurar o Firebase Hosting"
7. Clique em "Registrar app"
8. Copie as configurações que aparecem

### 5. **Atualizar arquivo de configuração**
Substitua as configurações em `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "seu-app-id"
};
```

### 6. **Configurar regras do Firestore (Segurança)**
No Firestore Database, vá para "Regras" e substitua por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workspaces - usuário pode ler/escrever apenas suas próprias
    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Projetos - usuário pode ler/escrever apenas seus próprios
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Colunas - usuário pode ler/escrever apenas de seus projetos
    match /columns/{columnId} {
      allow read, write: if request.auth != null && 
        resource.data.projectId in get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.projectId in get(/databases/$(database)/documents/projects/$(request.resource.data.projectId)).data.userId == request.auth.uid;
    }
    
    // Tarefas - usuário pode ler/escrever apenas de seus projetos
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
        resource.data.projectId in get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.projectId in get(/databases/$(database)/documents/projects/$(request.resource.data.projectId)).data.userId == request.auth.uid;
    }
  }
}
```

### 7. **Instalar dependências**
```bash
npm install firebase
```

### 8. **Testar a configuração**
1. Execute o projeto: `npm run dev`
2. Tente criar uma conta
3. Faça login
4. Crie uma área de trabalho
5. Crie um projeto

## 🚨 **Importante**

- **Nunca** commite as chaves do Firebase no Git
- Use variáveis de ambiente em produção
- Configure as regras de segurança adequadamente
- Faça backup dos dados importantes

## 🔧 **Estrutura do banco de dados**

```
/users/{userId}
  - name: string
  - email: string
  - createdAt: timestamp
  - updatedAt: timestamp

/workspaces/{workspaceId}
  - name: string
  - color: string
  - userId: string
  - createdAt: timestamp
  - updatedAt: timestamp

/projects/{projectId}
  - name: string
  - description: string
  - workspaceId: string
  - userId: string
  - createdAt: timestamp
  - updatedAt: timestamp

/columns/{columnId}
  - name: string
  - position: number
  - projectId: string
  - createdAt: timestamp

/tasks/{taskId}
  - title: string
  - description: string
  - position: number
  - columnId: string
  - projectId: string
  - createdAt: timestamp
  - updatedAt: timestamp
```

## 🎯 **Próximos passos**

1. Configure o Firebase seguindo os passos acima
2. Teste todas as funcionalidades
3. Configure variáveis de ambiente para produção
4. Implemente backup automático dos dados
