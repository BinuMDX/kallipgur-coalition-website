import React from 'react';

interface FormButtonsProps {
  onClear: () => void;
  isSubmitting?: boolean;
}

export default function FormButtons({
  onClear,
  isSubmitting = false,
}: FormButtonsProps) {
  return (
    <div className="form-buttons">
      <button
        type="button"
        className="btn btn-ghost"
        disabled
        aria-label="Save Draft — feature coming soon"
        title="Save Draft — coming soon"
      >
        Save Draft
      </button>
      <button
        type="button"
        className="btn btn-outline"
        onClick={onClear}
      >
        Clear Form
      </button>
      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting…' : 'Submit Membership Request'}
      </button>
    </div>
  );
}
