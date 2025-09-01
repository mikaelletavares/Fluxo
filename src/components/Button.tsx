import React from 'react';
import styles from './styles/button.module.css'; 

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'primary' | 'danger' | 'secondary';
};

export function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
  const variantClass = styles[variant] || styles.primary;
  
  return (
    <button className={`${styles.button} ${variantClass} ${className || ''}`} {...props}>
      {children}
    </button>
  );
}