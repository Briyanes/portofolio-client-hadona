import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  hover?: boolean;
}

export function Card({ children, className, noPadding = false, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white shadow-md',
        !noPadding && 'p-6',
        hover && 'transition-shadow duration-200 hover:shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
}
