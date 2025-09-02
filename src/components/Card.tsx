import React, { useState, useRef, useEffect } from 'react';
import styles from './styles/card.module.css';

interface CardProps {
  title: string;
  children?: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
  workspaceColor?: string;
}

export function Card({ 
  title, 
  children, 
  onEdit, 
  onDelete, 
  className = '',
  workspaceColor = '#162456'
}: CardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    setIsDropdownOpen(false);
    onEdit?.();
  };

  const handleDelete = () => {
    setIsDropdownOpen(false);
    onDelete?.();
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        
        {/* Botão de 3 pontinhos */}
        <div className={styles.menuContainer} ref={dropdownRef}>
          <button
            className={styles.menuButton}
            onClick={toggleDropdown}
            aria-label="Menu de opções"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="12" cy="5" r="1"/>
              <circle cx="12" cy="19" r="1"/>
            </svg>
          </button>

          {/* Menu Dropdown */}
          {isDropdownOpen && (
            <div className={styles.dropdown}>
              <button
                className={styles.dropdownItem}
                onClick={handleEdit}
                disabled={!onEdit}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Editar
              </button>
              
              <button
                className={styles.dropdownItem}
                onClick={handleDelete}
                disabled={!onDelete}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      {children && (
        <div className={styles.cardContent}>
          {children}
        </div>
      )}
    </div>
  );
}
