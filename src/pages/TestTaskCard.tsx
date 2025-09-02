import React from 'react';
import { NewTaskCard } from '../components/NewTaskCard';
import { SimpleTaskCard } from '../components/SimpleTaskCard';

export function TestTaskCard() {
  const handleTaskUpdate = (updatedTask: any) => {
    console.log('Task atualizada:', updatedTask);
    alert(`Task "${updatedTask.title}" foi atualizada!`);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '600px', 
      margin: '0 auto',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        marginBottom: '2rem', 
        color: '#1f2937',
        textAlign: 'center'
      }}>
        Teste do TaskCard
      </h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#374151' }}>Teste Simples (com debug visual):</h2>
        
        <SimpleTaskCard
          task={{
            id: "test",
            title: "Teste Simples",
            status: "pending",
            description: "Este é um teste simples"
          }}
          onUpdate={handleTaskUpdate}
        />

        <h2 style={{ marginBottom: '1rem', color: '#374151', marginTop: '2rem' }}>Componente Completo:</h2>
        
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

      <div style={{
        padding: '1rem',
        backgroundColor: '#e5e7eb',
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#6b7280'
      }}>
        <strong>Instruções:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>Clique em qualquer card para abrir o dialog de edição</li>
          <li>Edite a descrição, datas e comentários</li>
          <li>Clique em "Salvar" para ver a atualização</li>
          <li>Verifique o console do navegador para logs de debug</li>
        </ul>
      </div>
    </div>
  );
}
