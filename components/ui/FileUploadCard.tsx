'use client';

import React, { useRef, useState, ChangeEvent, DragEvent } from 'react';

export interface FileUploadCardProps {
  title: string;
  acceptedFormats: string[];
  id?: string;
  documentType?: 'IDENTITY' | 'SUPPORTING_DOCUMENT' | 'PROFILE_PHOTO';
  multiple?: boolean;
  maxFiles?: number;
  onFilesChange?: (documentType: string, files: File[]) => void;
  uploadState?: 'idle' | 'uploading' | 'success' | 'error';
  uploadProgress?: number;
  uploadError?: string;
}

export default function FileUploadCard({
  title,
  acceptedFormats,
  id,
  documentType = 'SUPPORTING_DOCUMENT',
  multiple = false,
  maxFiles = 1,
  onFilesChange,
  uploadState = 'idle',
  uploadProgress = 0,
  uploadError,
}: FileUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  // Derive accept string from formats (e.g., ['PDF', 'DOCX'] -> '.pdf,.docx')
  const acceptString = acceptedFormats.map((fmt) => `.${fmt.toLowerCase()}`).join(',');

  const handleContainerClick = () => {
    if (uploadState === 'uploading' || uploadState === 'success') return;
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploadState === 'uploading' || uploadState === 'success') return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const validateAndAddFiles = (newFiles: FileList | File[]) => {
    setLocalError(null);
    let validFiles: File[] = [];
    
    // Check total limit
    if (multiple) {
      if (selectedFiles.length + newFiles.length > maxFiles) {
        setLocalError(`You can only upload up to ${maxFiles} files.`);
        return;
      }
      validFiles = [...selectedFiles];
    }

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      // Type validation
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!acceptString.includes(ext)) {
        setLocalError(`File format ${ext} is not allowed.`);
        return;
      }
      
      // Size validation (client-side matching server default 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setLocalError(`File ${file.name} exceeds 10MB limit.`);
        return;
      }

      validFiles.push(file);
      
      if (!multiple && validFiles.length >= 1) {
        break; // Stop after 1 if not multiple
      }
    }

    if (!multiple && validFiles.length > 1) {
      validFiles = [validFiles[0]];
    }

    setSelectedFiles(validFiles);
    if (onFilesChange) onFilesChange(documentType, validFiles);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (uploadState === 'uploading' || uploadState === 'success') return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeFile = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation(); // prevent clicking the card
    if (uploadState === 'uploading' || uploadState === 'success') return;
    
    const newFiles = selectedFiles.filter((_, idx) => idx !== indexToRemove);
    setSelectedFiles(newFiles);
    setLocalError(null);
    if (onFilesChange) onFilesChange(documentType, newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className={`file-upload-wrapper ${uploadState !== 'idle' ? 'upload-' + uploadState : ''}`}>
      <div 
        className={`file-upload-card ${isDragOver ? 'file-upload-card--dragover' : ''} ${selectedFiles.length > 0 ? 'file-upload-card--has-file' : ''}`}
        id={id}
        onClick={handleContainerClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept={acceptString}
          multiple={multiple}
        />

        {uploadState === 'success' ? (
          <div className="file-upload-success-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--clr-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <div className="file-upload-title" style={{ marginTop: '0.5rem' }}>Uploaded</div>
          </div>
        ) : (
          <>
            <div className="file-upload-icon" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="4" width="24" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M14 18h12M14 23h12M14 28h8" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                <path d="M20 8v6m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="file-upload-title">{title}</div>
            
            {selectedFiles.length === 0 && (
              <>
                <div className="file-upload-hint">Drag & drop or click to upload</div>
                <div className="file-upload-formats">
                  {acceptedFormats.map((fmt) => (
                    <span key={fmt} className="file-format-badge">
                      {fmt}
                    </span>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && uploadState !== 'success' && (
        <div className="file-upload-selected-list">
          {selectedFiles.map((file, idx) => (
            <div key={`${file.name}-${idx}`} className="file-upload-selected-item">
              <div className="file-upload-selected-info">
                <span className="file-upload-selected-name" title={file.name}>{file.name}</span>
                <span className="file-upload-selected-size">{formatFileSize(file.size)}</span>
              </div>
              {uploadState === 'idle' && (
                <button 
                  type="button" 
                  className="file-upload-remove-btn"
                  onClick={(e) => removeFile(e, idx)}
                  aria-label="Remove file"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {uploadState === 'uploading' && (
        <div className="file-upload-progress-wrap">
          <div className="file-upload-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
        </div>
      )}

      {/* Error Messages */}
      {(localError || uploadError) && (
        <div className="file-upload-error-msg">
          {uploadError || localError}
        </div>
      )}
    </div>
  );
}
