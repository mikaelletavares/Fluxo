import React, { useState, useRef } from 'react';
import styles from './styles/imageUpload.module.css';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (file: File) => Promise<void>;
  onImageDelete?: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({ 
  currentImageUrl, 
  onImageUpload, 
  onImageDelete, 
  disabled = false,
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      await onImageUpload(file);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
      // Limpar o input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async () => {
    if (!onImageDelete) return;
    
    const confirmed = window.confirm('Tem certeza que deseja remover esta imagem?');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onImageDelete();
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      alert('Erro ao remover a imagem. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClick = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.imageContainer}>
        {currentImageUrl ? (
          <img 
            src={currentImageUrl} 
            alt="Foto de perfil" 
            className={styles.profileImage}
          />
        ) : (
          <div className={styles.placeholder}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        )}
        
        {!disabled && (
          <div className={styles.overlay}>
            <button
              type="button"
              onClick={handleClick}
              disabled={isUploading}
              className={styles.uploadButton}
            >
              {isUploading ? (
                <div className={styles.spinner} />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              )}
            </button>
            
            {currentImageUrl && onImageDelete && (
              <button
                type="button"
                onClick={handleDeleteImage}
                disabled={isDeleting}
                className={styles.deleteButton}
              >
                {isDeleting ? (
                  <div className={styles.spinner} />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                  </svg>
                )}
              </button>
            )}
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className={styles.hiddenInput}
        disabled={disabled}
      />
      
      <p className={styles.helpText}>
        Clique para {currentImageUrl ? 'alterar' : 'adicionar'} foto de perfil
      </p>
    </div>
  );
}
