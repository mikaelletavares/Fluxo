import React from 'react';
import styles from './styles/button.module.css'; 

type ButtonProps = React.ComponentProps<'button'>;

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button className={`${styles.button} ${className || ''}`} {...props}>
      {children}
    </button>
  );
}