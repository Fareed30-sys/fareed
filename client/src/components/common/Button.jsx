import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm';

  const variants = {
    primary:
      'bg-agro-600 hover:bg-agro-700 text-white focus:ring-agro-500 shadow-agro-600/20 active:scale-[0.99]',
    secondary:
      'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-gray-300',
    outline:
      'border-2 border-agro-600 text-agro-700 hover:bg-agro-50 focus:ring-agro-500',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-red-600/20',
    ghost:
      'text-gray-600 hover:bg-gray-100 shadow-none focus:ring-gray-200',
    earth:
      'bg-earth-700 hover:bg-earth-800 text-white focus:ring-earth-600',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

