import React from 'react';

type InputProps = React.ComponentProps<'input'>;

export function Input({ className, ...props }: InputProps) {
  const style: React.CSSProperties = {
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text-primary)',
  };

  return (
    <input style={style} className={className} {...props} />
  );
}
