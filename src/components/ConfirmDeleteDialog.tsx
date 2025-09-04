import React from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@/context/ThemeContext';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
}

export function ConfirmDeleteDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  itemName 
}: ConfirmDeleteDialogProps) {
  const { theme } = useTheme();
  
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
      zIndex: 10000,
      margin: 0,
      padding: 0
    }}>
      <div style={{
        backgroundColor: 'var(--color-background)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-xl)',
        width: '90%',
        maxWidth: '400px',
        padding: '0',
        animation: 'fadeIn 0.3s ease-out',
        border: '1px solid var(--color-border)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 2rem 1rem 2rem',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              backgroundColor: theme === 'dark' ? '#7f1d1d' : 'var(--color-error-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? '#ffffff' : 'var(--color-error)'} strokeWidth="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              margin: 0
            }}>
              {title}
            </h2>
          </div>
          <button 
            onClick={onClose}
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
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '1.5rem 2rem'
        }}>
          <p style={{
            fontSize: '1rem',
            color: 'var(--color-text-primary)',
            lineHeight: '1.5',
            margin: 0,
            marginBottom: '1rem'
          }}>
            {message}
          </p>
          
          {itemName && (
            <div style={{
              backgroundColor: 'var(--color-background-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                margin: 0,
                marginBottom: '0.5rem'
              }}>
                Item a ser excluído:
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-primary)',
                fontWeight: '600',
                margin: 0
              }}>
                "{itemName}"
              </p>
            </div>
          )}

          <div style={{
            backgroundColor: theme === 'dark' ? '#7f1d1d' : 'var(--color-error-bg)',
            border: `1px solid ${theme === 'dark' ? '#dc2626' : 'var(--color-error)'}`,
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? '#ffffff' : 'var(--color-error)'} strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: theme === 'dark' ? '#ffffff' : 'var(--color-error)'
              }}>
                Atenção
              </span>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: theme === 'dark' ? '#ffffff' : 'var(--color-error-text)',
              margin: 0,
              lineHeight: '1.4'
            }}>
              Esta ação não pode ser desfeita. Todos os dados relacionados serão permanentemente removidos.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem',
          padding: '1rem 2rem 1.5rem 2rem',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-background-secondary)',
          borderRadius: '0 0 16px 16px'
        }}>
          <button
            type="button"
            onClick={onClose}
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
              e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)';
              e.currentTarget.style.borderColor = 'var(--color-border-dark)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-background)';
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: theme === 'dark' ? '#dc2626' : 'var(--color-error)',
              color: 'var(--color-text-inverse)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'dark' ? '#b91c1c' : 'var(--color-error-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'dark' ? '#dc2626' : 'var(--color-error)';
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
