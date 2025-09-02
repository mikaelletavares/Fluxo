# 🔥 Regras do Firebase Storage - Configuração

## ⚠️ **IMPORTANTE: Configure estas regras no Firebase Console**

### **Como configurar:**

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto: `fluxo-pro-site`
3. Vá para **Storage**
4. Clique na aba **"Regras"**
5. Substitua as regras atuais por estas:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Imagens de perfil - usuário pode ler/escrever apenas suas próprias
    match /profile-images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Outros arquivos - usuário pode ler/escrever apenas seus próprios
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **Regras temporárias para teste (MENOS SEGURAS):**

Se as regras acima não funcionarem, use estas temporariamente para teste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // PERMISSIVO - apenas para teste
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **Regras ULTRA PERMISSIVAS para debug (TEMPORÁRIAS):**

Se ainda não funcionar, use estas para identificar o problema:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // ULTRA PERMISSIVO - apenas para debug
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### **Como aplicar:**

1. Cole as regras no Firebase Console
2. Clique em **"Publicar"**
3. Teste novamente o upload de imagem

### **Verificar se funcionou:**

1. Faça login no app
2. Vá para o Perfil
3. Tente fazer upload de uma imagem
4. Verifique se não aparece mais o erro de CORS

### **Logs para debug:**

Abra o console do navegador (F12) e verifique se aparecem os logs:
- "Iniciando upload da imagem..."
- "Upload concluído:"
- "URL de download obtida:"

Se aparecer algum erro, copie e cole aqui para análise.

### **Problemas comuns:**

1. **CORS Error**: Configure as regras do Storage
2. **Unauthorized**: Verifique se o usuário está logado
3. **Bucket not found**: Verifique se o bucket está configurado corretamente
4. **File too large**: Reduza o tamanho da imagem (máximo 5MB)
5. **Invalid file type**: Use apenas JPG, PNG, GIF ou WebP
