import React, { useEffect } from 'react';
import { Icon } from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[100000] flex items-center justify-center"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      {/* Modal Panel */}
      <div className="relative w-full max-w-2xl bg-slate-100 dark:bg-slate-800 rounded-lg shadow-xl m-4 flex flex-col max-h-[90vh]">
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <h2 id="modal-title" className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-400"
            aria-label="Close modal"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
