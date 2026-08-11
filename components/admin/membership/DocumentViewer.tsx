'use client';

import React, { useState } from 'react';
import AdminButton from '../AdminButton';
import AdminCard from '../AdminCard';

export type DocumentType = 'IDENTITY' | 'SUPPORTING_DOCUMENT' | 'PROFILE_PHOTO';

export interface MembershipDocument {
  id: string;
  createdAt: string;
  documentType: DocumentType;
  originalFileName: string;
  storedFileName: string;
  mimeType: string;
  fileSize: number;
}

type DocumentViewerProps = {
  documents: MembershipDocument[];
};

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  IDENTITY: 'Identity Document',
  SUPPORTING_DOCUMENT: 'Supporting Document',
  PROFILE_PHOTO: 'Profile Photo',
};

export default function DocumentViewer({ documents }: DocumentViewerProps) {
  const [lightboxImage, setLightboxImage] = useState<{ url: string; name: string } | null>(null);

  const handlePreview = (doc: MembershipDocument) => {
    const isImage = doc.mimeType.startsWith('image/');
    const isPdf = doc.mimeType === 'application/pdf';
    const viewUrl = `/api/membership/documents?id=${doc.id}`;

    if (isImage) {
      setLightboxImage({ url: viewUrl, name: doc.originalFileName });
    } else if (isPdf) {
      window.open(viewUrl, '_blank');
    } else {
      // Fallback: trigger download if not previewable
      handleDownload(doc);
    }
  };

  const handleDownload = (doc: MembershipDocument) => {
    const downloadUrl = `/api/membership/documents?id=${doc.id}&download=true`;
    window.location.href = downloadUrl;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="admin-membership__docs-section">
      <h3 className="admin-card__title" style={{ marginBottom: '1rem', display: 'block', fontSize: '1rem' }}>
        Uploaded Documents ({documents.length})
      </h3>

      {documents.length === 0 ? (
        <p className="admin-membership__date" style={{ fontStyle: 'italic' }}>
          No documents uploaded for this application.
        </p>
      ) : (
        <div className="admin-membership__docs-grid">
          {documents.map((doc) => {
            const isImage = doc.mimeType.startsWith('image/');
            const isPdf = doc.mimeType === 'application/pdf';
            const isPreviewable = isImage || isPdf;

            return (
              <div key={doc.id} className="admin-membership__doc-card">
                <div className="admin-membership__doc-icon">
                  {isImage ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  )}
                </div>

                <div className="admin-membership__doc-info">
                  <span className="admin-membership__doc-label">
                    {DOC_TYPE_LABELS[doc.documentType] || doc.documentType}
                  </span>
                  <span className="admin-membership__doc-name" title={doc.originalFileName}>
                    {doc.originalFileName}
                  </span>
                  <span className="admin-membership__doc-meta">
                    {formatSize(doc.fileSize)} • Uploaded {formatDate(doc.createdAt)}
                  </span>
                </div>

                <div className="admin-membership__doc-actions">
                  <AdminButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreview(doc)}
                    aria-label={`Preview ${doc.originalFileName}`}
                    title={isPreviewable ? 'Preview document' : 'Preview not available for this type'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </AdminButton>
                  <AdminButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(doc)}
                    aria-label={`Download ${doc.originalFileName}`}
                    title="Download file"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </AdminButton>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Image Modal */}
      {lightboxImage && (
        <div 
          className="admin-lightbox" 
          role="dialog" 
          aria-modal="true" 
          aria-label={`Image preview: ${lightboxImage.name}`}
          onClick={() => setLightboxImage(null)}
        >
          <div className="admin-lightbox__content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="admin-lightbox__close" 
              onClick={() => setLightboxImage(null)}
              aria-label="Close image preview"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={lightboxImage.url} 
              alt={lightboxImage.name} 
              className="admin-lightbox__img" 
            />
            <div className="admin-lightbox__caption">{lightboxImage.name}</div>
          </div>
        </div>
      )}
    </div>
  );
}
