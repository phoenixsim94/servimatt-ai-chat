import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    error,
    className = '',
    style,
    ...props
  },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent focus-visible:border-transparent focus-visible:ring-0 focus:outline-none transition-colors duration-200 resize-none min-h-[44px] ${
          error ? 'border-red-500' : ''
        } ${className}`}
        style={{ ...style, overflow: 'hidden' }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';