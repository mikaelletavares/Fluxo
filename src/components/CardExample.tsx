import React from 'react';
import { Card } from './Card';

// Exemplo de uso do componente Card
export function CardExample() {
  const handleEdit = () => {
    console.log('Editar card');
    // Aqui você pode implementar a lógica de edição
  };

  const handleDelete = () => {
    console.log('Excluir card');
    // Aqui você pode implementar a lógica de exclusão
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2>Exemplos de Cards</h2>
      
      {/* Card de Workspace */}
      <Card
        title="Workspace XPTO"
        onEdit={handleEdit}
        onDelete={handleDelete}
        className="workspace"
        workspaceColor="#162456"
      >
        <p>Este é um exemplo de card de workspace com conteúdo personalizado.</p>
        <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
          <strong>Detalhes:</strong> Workspace para desenvolvimento de projetos.
        </div>
      </Card>

      {/* Card de Projeto */}
      <Card
        title="Projeto React App"
        onEdit={handleEdit}
        onDelete={handleDelete}
        className="project"
        workspaceColor="#059669"
      >
        <p>Card de projeto com funcionalidades específicas.</p>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>Funcionalidade 1</li>
          <li>Funcionalidade 2</li>
          <li>Funcionalidade 3</li>
        </ul>
      </Card>

      {/* Card de Tarefa */}
      <Card
        title="Implementar autenticação"
        onEdit={handleEdit}
        onDelete={handleDelete}
        className="task"
        workspaceColor="#dc2626"
      >
        <p>Card de tarefa com informações específicas.</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <span style={{ 
            padding: '0.25rem 0.5rem', 
            backgroundColor: '#fef3c7', 
            color: '#92400e', 
            borderRadius: '4px', 
            fontSize: '0.75rem' 
          }}>
            Em Progresso
          </span>
          <span style={{ 
            padding: '0.25rem 0.5rem', 
            backgroundColor: '#dbeafe', 
            color: '#1e40af', 
            borderRadius: '4px', 
            fontSize: '0.75rem' 
          }}>
            Alta Prioridade
          </span>
        </div>
      </Card>

      {/* Card sem ações */}
      <Card
        title="Card Somente Leitura"
        className="compact"
      >
        <p>Este card não possui ações de editar ou excluir.</p>
      </Card>
    </div>
  );
}
