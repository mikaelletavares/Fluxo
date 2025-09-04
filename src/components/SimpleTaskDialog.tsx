import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Task, TaskStatus } from '@/types/firebase';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import { useTheme } from '@/context/ThemeContext';

interface SimpleTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
  onDelete?: (taskId: string) => void;
  task: Task;
}

export function SimpleTaskDialog({ isOpen, onClose, onUpdate, onDelete, task }: SimpleTaskDialogProps) {
  const { theme } = useTheme();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [startDate, setStartDate] = useState(task.startDate || '');
  const [endDate, setEndDate] = useState(task.endDate || '');
  const [comments, setComments] = useState<string[]>(task.comments || []);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setStartDate(task.startDate || '');
      setEndDate(task.endDate || '');
      setComments(task.comments || []);
      setNewComment('');
    }
  }, [isOpen, task]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments(prev => [...prev, newComment.trim()]);
      setNewComment('');
    }
  };

  const handleRemoveComment = (index: number) => {
    setComments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.(task.id);
    setShowConfirmDelete(false);
    onClose();
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const updatedTask: Task = {
        ...task,
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        comments: comments.length > 0 ? comments : undefined,
      };
      
      await onUpdate(updatedTask);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const dialogContent = (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      margin: 0,
      padding: 0
    }}>
      <div style={{
        backgroundColor: 'var(--color-background)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-xl)',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        animation: 'fadeIn 0.3s ease-out',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 2rem',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            margin: 0
          }}>
            Editar Tarefa
          </h2>
          <button 
            onClick={onClose}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              width: '2rem',
              height: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {/* Título */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              marginBottom: '0.5rem'
            }}>
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: 'var(--color-text-primary)',
                backgroundColor: 'var(--color-background)',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Status */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              marginBottom: '0.5rem'
            }}>
              Status
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setStatus(TaskStatus.PENDING)}
                disabled={isLoading}
                style={{
                  padding: '0.5rem 1rem',
                  border: `2px solid ${status === TaskStatus.PENDING ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: '8px',
                  backgroundColor: status === TaskStatus.PENDING ? 'var(--color-primary-light)' : 'var(--color-background)',
                  color: status === TaskStatus.PENDING ? (theme === 'dark' ? 'var(--color-text-inverse)' : 'var(--color-primary)') : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#f59e0b'
                }}></span>
                Pendente
              </button>
              <button
                type="button"
                onClick={() => setStatus(TaskStatus.COMPLETED)}
                disabled={isLoading}
                style={{
                  padding: '0.5rem 1rem',
                  border: `2px solid ${status === TaskStatus.COMPLETED ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: '8px',
                  backgroundColor: status === TaskStatus.COMPLETED ? 'var(--color-primary-light)' : 'var(--color-background)',
                  color: status === TaskStatus.COMPLETED ? (theme === 'dark' ? 'var(--color-text-inverse)' : 'var(--color-primary)') : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981'
                }}></span>
                Finalizado
              </button>
            </div>
          </div>

          {/* Descrição */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              marginBottom: '0.5rem'
            }}>
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              placeholder="Descrição da tarefa (opcional)"
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: 'var(--color-text-primary)',
                backgroundColor: 'var(--color-background)',
                boxSizing: 'border-box',
                resize: 'vertical',
                minHeight: '100px',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Datas */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1rem', 
            marginBottom: '1.5rem' 
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem'
              }}>
                Data de Início
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-primary)',
                  backgroundColor: 'var(--color-background)',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease',
                  ...(theme === 'dark' && {
                    colorScheme: 'dark'
                  })
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem'
              }}>
                Data de Término
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-primary)',
                  backgroundColor: 'var(--color-background)',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease',
                  ...(theme === 'dark' && {
                    colorScheme: 'dark'
                  })
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Comentários */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              marginBottom: '0.5rem'
            }}>
              Comentários
            </label>
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: 'var(--color-background-secondary)'
            }}>
              {comments.map((comment, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    flex: 1,
                    fontSize: '0.875rem',
                    color: 'var(--color-text-primary)',
                    lineHeight: '1.4'
                  }}>
                    {comment}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveComment(index)}
                    disabled={isLoading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-error)',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '4px',
                      fontSize: '1.25rem',
                      lineHeight: '1',
                      width: '1.5rem',
                      height: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.color = 'var(--color-error-text)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.color = 'var(--color-error)';
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddComment())}
                  placeholder="Adicionar comentário..."
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-primary)',
                    backgroundColor: 'var(--color-background)',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isLoading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-text-inverse)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && newComment.trim()) {
                      e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && newComment.trim()) {
                      e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    }
                  }}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem 0 0 0',
            borderTop: '1px solid var(--color-border)'
          }}>
            {/* Botão de excluir à esquerda */}
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--color-error)',
                  color: 'var(--color-text-inverse)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = 'var(--color-error-text)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = 'var(--color-error)';
                  }
                }}
              >
                Excluir
              </button>
            )}
            
            {/* Botões de ação à direita */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)';
                    e.currentTarget.style.borderColor = 'var(--color-border-dark)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = 'var(--color-background)';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                  }
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--color-success)',
                  color: 'var(--color-text-inverse)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = 'var(--color-success-text)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = 'var(--color-success)';
                  }
                }}
              >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {createPortal(dialogContent, document.body)}
      
      <ConfirmDeleteDialog
        isOpen={showConfirmDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Excluir Tarefa"
        message="Tem certeza que deseja excluir esta tarefa?"
        itemName={task.title}
      />
    </>
  );
}
