import React from 'react';
import FileUploadCard from '../ui/FileUploadCard';
import SectionCard from '../ui/SectionCard';

interface DocumentsSectionProps {
  onFilesChange?: (documentType: string, files: File[]) => void;
  uploadStates?: Record<string, 'idle' | 'uploading' | 'success' | 'error'>;
  uploadProgresses?: Record<string, number>;
  uploadErrors?: Record<string, string>;
}

export default function DocumentsSection({
  onFilesChange,
  uploadStates = {},
  uploadProgresses = {},
  uploadErrors = {},
}: DocumentsSectionProps = {}) {
  return (
    <SectionCard
      number={6}
      title="Supporting Documents"
      description="Upload your supporting documents below. Accepted formats: PDF, DOCX, PNG, JPG."
      id="section-documents"
    >
      <div className="form-row form-row--3">
        <FileUploadCard
          title="Proof of Identity"
          acceptedFormats={['PDF', 'DOCX', 'PNG', 'JPG']}
          id="upload-identity"
          documentType="IDENTITY"
          multiple={false}
          maxFiles={1}
          onFilesChange={onFilesChange}
          uploadState={uploadStates['IDENTITY'] || 'idle'}
          uploadProgress={uploadProgresses['IDENTITY'] || 0}
          uploadError={uploadErrors['IDENTITY']}
        />
        <FileUploadCard
          title="Supporting Documents"
          acceptedFormats={['PDF', 'DOCX', 'PNG', 'JPG']}
          id="upload-supporting"
          documentType="SUPPORTING_DOCUMENT"
          multiple={true}
          maxFiles={5}
          onFilesChange={onFilesChange}
          uploadState={uploadStates['SUPPORTING_DOCUMENT'] || 'idle'}
          uploadProgress={uploadProgresses['SUPPORTING_DOCUMENT'] || 0}
          uploadError={uploadErrors['SUPPORTING_DOCUMENT']}
        />
        <FileUploadCard
          title="Profile Photo"
          acceptedFormats={['PNG', 'JPG']}
          id="upload-photo"
          documentType="PROFILE_PHOTO"
          multiple={false}
          maxFiles={1}
          onFilesChange={onFilesChange}
          uploadState={uploadStates['PROFILE_PHOTO'] || 'idle'}
          uploadProgress={uploadProgresses['PROFILE_PHOTO'] || 0}
          uploadError={uploadErrors['PROFILE_PHOTO']}
        />
      </div>
    </SectionCard>
  );
}
