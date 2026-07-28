import React from 'react';
import FileUploadCard from '../ui/FileUploadCard';
import SectionCard from '../ui/SectionCard';

export default function DocumentsSection() {
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
        />
        <FileUploadCard
          title="Supporting Documents"
          acceptedFormats={['PDF', 'DOCX', 'PNG', 'JPG']}
          id="upload-supporting"
        />
        <FileUploadCard
          title="Profile Photo"
          acceptedFormats={['PNG', 'JPG']}
          id="upload-photo"
        />
      </div>
    </SectionCard>
  );
}
