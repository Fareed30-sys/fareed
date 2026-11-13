import React from 'react';

export const Textarea = ({
  label,
  error,
  helperText,
  required = false,
  className = '',
  rows = 4,
  id,
  ...props
}) => {
  const textareaId = id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 bg-white placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-agro-500 focus:border-agro-500 disabled:bg-gray-100 disabled:text-gray-500 ${
          error ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
      {!error && helperText && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

