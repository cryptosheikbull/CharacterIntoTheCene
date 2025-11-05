
import React, { useState, useCallback, useRef } from 'react';
import { UploadCloudIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (base64: string) => void;
  label: string;
  id: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, label, id }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const onDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <label
        htmlFor={id}
        className={`flex justify-center items-center w-full h-48 px-4 transition bg-slate-800 border-2 border-slate-700 border-dashed rounded-md appearance-none cursor-pointer hover:border-indigo-500 focus:outline-none ${isDragging ? 'border-indigo-500' : ''}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="h-full w-full object-contain" />
        ) : (
          <span className="flex flex-col items-center space-y-2">
            <UploadCloudIcon className="w-10 h-10 text-slate-500" />
            <span className="font-medium text-slate-400">
              Drop an image, or{' '}
              <span className="text-indigo-400 underline">browse</span>
            </span>
            <span className="text-xs text-slate-500">PNG, JPG, WEBP</span>
          </span>
        )}
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
        className="sr-only"
        ref={fileInputRef}
      />
    </div>
  );
};

export default ImageUploader;
