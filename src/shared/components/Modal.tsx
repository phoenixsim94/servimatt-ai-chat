import React from 'react';
import { useEscapeKey } from '../hooks/ui';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  useEscapeKey(() => {
    if (isOpen) {
      onClose();
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div 
        className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10 ring-1 ring-gray-900/5" 
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        )}
        {children}
      </div>
    </div>
  );
};