import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Task, TaskStatus } from '@/types/firebase';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';

interface SimpleTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
  onDelete?: (taskId: string) => void;
  task: Task;
}

export function SimpleTaskDialog({ isOpen, onClose, onUpdate, onDelete, task }: SimpleTaskDialogProps) {
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      margin: 0,
      padding: 0
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1f2937',
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
              color: '#6b7280',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              width: '2rem',
              height: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
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
              color: '#374151',
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
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#374151',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Status */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
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
                  border: `2px solid ${status === TaskStatus.PENDING ? '#3b82f6' : '#d1d5db'}`,
                  borderRadius: '8px',
                  backgroundColor: status === TaskStatus.PENDING ? '#eff6ff' : '#ffffff',
                  color: status === TaskStatus.PENDING ? '#1d4ed8' : '#6b7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
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
                  border: `2px solid ${status === TaskStatus.COMPLETED ? '#3b82f6' : '#d1d5db'}`,
                  borderRadius: '8px',
                  backgroundColor: status === TaskStatus.COMPLETED ? '#eff6ff' : '#ffffff',
                  color: status === TaskStatus.COMPLETED ? '#1d4ed8' : '#6b7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
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
              color: '#374151',
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
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#374151',
                boxSizing: 'border-box',
                resize: 'vertical',
                minHeight: '100px',
                fontFamily: 'inherit'
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
                color: '#374151',
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
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#374151',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
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
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#374151',
                  boxSizing: 'border-box'
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
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Comentários
            </label>
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: '#f9fafb'
            }}>
              {comments.map((comment, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    flex: 1,
                    fontSize: '0.875rem',
                    color: '#374151',
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
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '4px',
                      fontSize: '1.25rem',
                      lineHeight: '1',
                      width: '1.5rem',
                      height: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
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
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#374151'
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isLoading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
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
            borderTop: '1px solid #e5e7eb'
          }}>
            {/* Botão de excluir à esquerda */}
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#ef4444';
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
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer'
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
