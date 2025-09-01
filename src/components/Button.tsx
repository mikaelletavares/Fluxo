import React from 'react';

type ButtonProps = React.ComponentProps<'button'> & {
};

export function Button({ children, className, ...props }: ButtonProps) {
  const style: React.CSSProperties = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '1rem',
    cursor: 'pointer',
    opacity: props.disabled ? 0.6 : 1, 
  };

  return (
    <button style={style} className={className} {...props}>
      {children}
    </button>
  );
}
