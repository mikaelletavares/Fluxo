# Componente Card

Um componente de card reutilizável com botão de menu de 3 pontinhos e dropdown.

## 🎯 Funcionalidades

- ✅ **Botão de 3 pontinhos** no canto superior direito
- ✅ **Menu dropdown** com opções de Editar e Excluir
- ✅ **Fechamento automático** ao clicar fora
- ✅ **Estilização responsiva** com Tailwind-like CSS
- ✅ **Acessibilidade** com aria-labels
- ✅ **Animações suaves** de hover e dropdown

## 📋 Props

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `title` | `string` | ✅ | Título do card |
| `children` | `React.ReactNode` | ❌ | Conteúdo do card |
| `onEdit` | `() => void` | ❌ | Função chamada ao clicar em "Editar" |
| `onDelete` | `() => void` | ❌ | Função chamada ao clicar em "Excluir" |
| `className` | `string` | ❌ | Classes CSS adicionais |
| `workspaceColor` | `string` | ❌ | Cor do workspace (padrão: #162456) |

## 🎨 Classes CSS Disponíveis

### Classes de Modificador
- `.compact` - Card compacto com padding reduzido
- `.workspace` - Card de workspace com borda colorida
- `.project` - Card de projeto com borda colorida
- `.task` - Card de tarefa com borda colorida

### Variáveis CSS
- `--workspace-color` - Cor personalizada do workspace
- `--project-color` - Cor personalizada do projeto
- `--task-color` - Cor personalizada da tarefa

## 💡 Exemplos de Uso

### Card Básico
```tsx
<Card
  title="Meu Card"
  onEdit={() => console.log("Editar")}
  onDelete={() => console.log("Excluir")}
>
  <p>Conteúdo do card</p>
</Card>
```

### Card de Workspace
```tsx
<Card
  title="Workspace XPTO"
  onEdit={handleEditWorkspace}
  onDelete={handleDeleteWorkspace}
  className="workspace"
  workspaceColor="#162456"
>
  <p>Descrição do workspace</p>
</Card>
```

### Card de Projeto
```tsx
<Card
  title="Projeto React App"
  onEdit={handleEditProject}
  onDelete={handleDeleteProject}
  className="project"
  workspaceColor="#059669"
>
  <ul>
    <li>Tarefa 1</li>
    <li>Tarefa 2</li>
  </ul>
</Card>
```

### Card Somente Leitura
```tsx
<Card
  title="Card Informativo"
  className="compact"
>
  <p>Este card não possui ações</p>
</Card>
```

## 🎨 Estilização

### Cores Padrão
- **Background**: Branco (#ffffff)
- **Borda**: Cinza claro (#e5e7eb)
- **Sombra**: Sombra suave com hover
- **Texto**: Cinza escuro (#1f2937)

### Estados
- **Hover**: Elevação sutil + sombra mais pronunciada
- **Focus**: Outline azul para acessibilidade
- **Disabled**: Opacidade reduzida

### Responsividade
- **Desktop**: Padding padrão, botões maiores
- **Mobile**: Padding reduzido, botões menores

## 🔧 Implementação Técnica

### Hooks Utilizados
- `useState` - Controle do estado do dropdown
- `useRef` - Referência para detectar cliques fora
- `useEffect` - Listener para cliques externos

### Acessibilidade
- `aria-label` no botão de menu
- Navegação por teclado
- Contraste adequado
- Foco visível

### Performance
- Event listeners são limpos automaticamente
- Animações CSS otimizadas
- Re-renders mínimos

## 🚀 Próximos Passos

Para integrar este componente em seus cards existentes:

1. **Importe o componente**:
   ```tsx
   import { Card } from '@/components/Card';
   ```

2. **Substitua a estrutura atual** pelo componente Card

3. **Implemente as funções** `onEdit` e `onDelete`

4. **Ajuste os estilos** conforme necessário

5. **Teste a responsividade** em diferentes dispositivos
