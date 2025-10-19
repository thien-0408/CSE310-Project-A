'use client';

import { useEffect, Fragment, FC, ReactNode } from 'react';

// Define the props for the ConfirmModal component
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode; // To display the descriptive message
  iconType?: 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
}

/**
 * A reusable, accessible confirmation modal dialog.
 * It's designed to be generic for various actions like delete, logout, etc.
 */
const ConfirmModal: FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  iconType = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  // Effect to handle closing the modal with the 'Escape' key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  const iconClasses = {
    warning: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
  };

  const buttonClasses = {
    warning: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  };

  const Icon = () => (
    <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconClasses[iconType]} sm:mx-0 sm:h-10 sm:w-10`}>
      {iconType === 'warning' && <i className="fas fa-exclamation-triangle h-6 w-6" aria-hidden="true"></i>}
      {iconType === 'info' && <i className="fas fa-info-circle h-6 w-6" aria-hidden="true"></i>}
    </div>
  );

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* 1. The Modal Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur transition-opacity" onClick={onClose}></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          {/* 2. The Modal Panel */}
          <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <Icon />
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                    {title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{children}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors sm:ml-3 sm:w-auto ${buttonClasses[iconType]}`}
                onClick={() => {
                  onConfirm();
                  onClose(); // Close modal after confirming
                }}
              >
                {confirmText}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={onClose}
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;


