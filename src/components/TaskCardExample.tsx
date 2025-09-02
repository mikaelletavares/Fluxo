import React from 'react';
import { NewTaskCard } from './NewTaskCard';

// Exemplo de uso do NewTaskCard
export function TaskCardExample() {
  const handleTaskUpdate = (updatedTask: any) => {
    console.log('Task atualizada:', updatedTask);
    // Aqui você pode implementar a lógica para salvar no banco de dados
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px' }}>
      <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>Exemplo de TaskCard</h2>
      
      <NewTaskCard
        task={{
          id: "1",
          title: "Criar layout do app",
          status: "pending",
          description: "Montar a base de UI",
          startDate: "2025-09-01",
          endDate: "2025-09-05",
          comments: ["Primeira versão criada"]
        }}
        onUpdate={handleTaskUpdate}
      />

      <NewTaskCard
        task={{
          id: "2",
          title: "Implementar autenticação",
          status: "done",
          description: "Sistema de login e registro",
          startDate: "2025-08-15",
          endDate: "2025-08-20",
          comments: ["JWT implementado", "Validação de formulários"]
        }}
        onUpdate={handleTaskUpdate}
      />

      <NewTaskCard
        task={{
          id: "3",
          title: "Testes unitários",
          status: "pending",
          description: "Criar testes para componentes principais"
        }}
        onUpdate={handleTaskUpdate}
      />
    </div>
  );
}
