'use client';

import React, { useState } from 'react';
import AdminButton from '../AdminButton';

export interface NoteItem {
  id: string;
  createdAt: string;
  adminId: string;
  adminName: string;
  note: string;
}

type NotesPanelProps = {
  applicationId: string;
  notes: NoteItem[];
  onNoteAdded: () => void;
};

export default function NotesPanel({
  applicationId,
  notes,
  onNoteAdded,
}: NotesPanelProps) {
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/membership/${applicationId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || 'Failed to submit note.');
      }

      setNewNote('');
      onNoteAdded(); // Trigger parent reload
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add note.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatNoteDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const datePart = date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const timePart = date.toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${datePart} at ${timePart}`;
  };

  return (
    <div className="admin-membership__notes-container">
      <h3 className="admin-card__title" style={{ marginBottom: '1.25rem', display: 'block', fontSize: '1rem' }}>
        Internal Review Notes ({notes.length})
      </h3>

      {/* Note submission form */}
      <form onSubmit={handleSubmit} className="admin-membership__note-form">
        <textarea
          className="admin-input admin-membership__note-textarea"
          placeholder="Add an internal note about this applicant (not visible to applicant)…"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={3}
          required
          disabled={submitting}
        />
        
        {error && (
          <span className="admin-field-error" style={{ display: 'block', marginTop: '0.25rem' }}>
            {error}
          </span>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <AdminButton
            type="submit"
            size="sm"
            loading={submitting}
            disabled={!newNote.trim() || submitting}
          >
            Add Note
          </AdminButton>
        </div>
      </form>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="admin-membership__date" style={{ fontStyle: 'italic', marginTop: '1.5rem' }}>
          No internal review notes added yet.
        </p>
      ) : (
        <div className="admin-membership__notes-list">
          {[...notes]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((noteItem) => (
              <div key={noteItem.id} className="admin-membership__note-card">
                <div className="admin-membership__note-header">
                  <span className="admin-membership__note-author">{noteItem.adminName}</span>
                  <span className="admin-membership__note-date">
                    {formatNoteDate(noteItem.createdAt)}
                  </span>
                </div>
                <p className="admin-membership__note-body">{noteItem.note}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
