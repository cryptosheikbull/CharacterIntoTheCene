import React, { useEffect } from 'react';
import { XIcon } from './icons';

interface PreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ imageUrl, onClose }) => {
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

  return (
    <div
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image Preview"
    >
      <button
        className="absolute top-4 right-4 text-white hover:text-slate-300 transition-colors"
        onClick={onClose}
        aria-label="Close preview"
      >
        <XIcon className="w-8 h-8" />
      </button>
      <div className="p-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageUrl}
          alt="Generated Montage Preview"
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default PreviewModal;
