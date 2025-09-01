import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/project.service';
import { Project } from '@/types';

export function useProjects() {
  const {
    data: projects, 
    isLoading,
    isError,
    error,
  } = useQuery<Project[], Error>({
    queryKey: ['projects'],
    queryFn: projectService.fetchProjects, 
  });

  return { projects, isLoading, isError, error };
}
