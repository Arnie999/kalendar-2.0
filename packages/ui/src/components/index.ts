import React from 'react';

// Basic semantic HTML components (NO STYLES)
export function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return React.createElement('button', props, children);
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return React.createElement('input', props);
} 