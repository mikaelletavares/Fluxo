import { useParams } from 'react-router-dom';

export function ProjectPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Projeto</h1>
    </div>
  );
}
