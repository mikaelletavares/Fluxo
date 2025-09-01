import React from 'react';

type InputProps = React.ComponentProps<'input'>;

export function Input({ className, ...props }: InputProps) {
  const style: React.CSSProperties = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <input style={style} className={className} {...props} />
  );
}
