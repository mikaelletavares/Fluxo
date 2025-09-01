# 🔥 Regras do Firestore - Atualizadas

## ⚠️ **IMPORTANTE: Configure estas regras no Firebase Console**

### **Como configurar:**

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto: `fluxo-pro-site`
3. Vá para **Firestore Database**
4. Clique na aba **"Regras"**
5. Substitua as regras atuais por estas:

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
        get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/projects/$(request.resource.data.projectId)).data.userId == request.auth.uid;
    }
    
    // Tarefas - usuário pode ler/escrever apenas de seus projetos
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/projects/$(request.resource.data.projectId)).data.userId == request.auth.uid;
    }
  }
}
```

### **Regras temporárias para teste (MENOS SEGURAS):**

Se as regras acima não funcionarem, use estas temporariamente para teste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // PERMISSIVO - apenas para teste
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **Como aplicar:**

1. Cole as regras no Firebase Console
2. Clique em **"Publicar"**
3. Teste novamente o aplicativo

### **Verificar se funcionou:**

1. Faça login no app
2. Vá para o Dashboard
3. Clique em uma área de trabalho
4. Verifique se não aparece mais o erro "Erro ao buscar projetos"
5. Tente criar um projeto

### **Logs para debug:**

Abra o console do navegador (F12) e verifique se aparecem os logs:
- "Iniciando carregamento de dados para workspace: [ID]"
- "Buscando projetos para workspaceId: [ID]"
- "Query executada, documentos encontrados: [NÚMERO]"
- "Projetos retornados: [ARRAY]"

Se aparecer algum erro, copie e cole aqui para análise.

### **Possíveis causas do erro:**

1. **Regras do Firestore** - Permissão negada
2. **Índices ausentes** - Para queries com orderBy
3. **WorkspaceId inválido** - ID não existe
4. **Usuário não autenticado** - Sessão expirada

### **Solução rápida:**

Use as regras temporárias (menos seguras) para testar se o problema é de permissão.
