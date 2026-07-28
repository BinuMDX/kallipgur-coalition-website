import React from 'react';

interface FileUploadCardProps {
  title: string;
  acceptedFormats: string[];
  id?: string;
}

export default function FileUploadCard({
  title,
  acceptedFormats,
  id,
}: FileUploadCardProps) {
  return (
    <div className="file-upload-card" id={id}>
      <div className="file-upload-icon" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="4" width="24" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M14 18h12M14 23h12M14 28h8" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <path d="M20 8v6m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="file-upload-title">{title}</div>
      <div className="file-upload-hint">Drag & drop or click to upload</div>
      <div className="file-upload-formats">
        {acceptedFormats.map((fmt) => (
          <span key={fmt} className="file-format-badge">
            {fmt}
          </span>
        ))}
      </div>
    </div>
  );
}
