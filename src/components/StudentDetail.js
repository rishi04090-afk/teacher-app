import React, { useState, useEffect } from 'react';
import '../styles/StudentDetail.css';

function StudentDetail({ student, isNewDashboard, onUpdateStudent }) {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState('');
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [editedStudent, setEditedStudent] = useState(null);

  // Fix: isNewDashboard=false means creator (previous teacher), isNewDashboard=true means joiner (new teacher)
  const authorName = isNewDashboard ? 'New Teacher' : 'Previous Teacher';

  useEffect(() => {
    if (student && student.notes && Array.isArray(student.notes)) {
      setNotes(student.notes);
    } else {
      setNotes([]);
    }
    setIsEditingStudent(false);
    setEditedStudent(null);
  }, [student]);

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote,
        date: new Date().toISOString().split('T')[0],
        author: authorName
      };
      const updatedNotes = [...notes, note];
      setNotes(updatedNotes);
      setNewNote('');
      // Save to Firebase
      onUpdateStudent(student.id, { ...student, notes: updatedNotes });
    }
  };

  const handleEditNote = (noteId, text) => {
    setEditingNoteId(noteId);
    setEditingNoteText(text);
  };

  const handleSaveEditNote = (noteId) => {
    const updatedNotes = notes.map(n => 
      n.id === noteId ? { ...n, text: editingNoteText } : n
    );
    setNotes(updatedNotes);
    setEditingNoteId(null);
    setEditingNoteText('');
    // Save to Firebase
    onUpdateStudent(student.id, { ...student, notes: updatedNotes });
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = notes.filter(n => n.id !== noteId);
    setNotes(updatedNotes);
    // Save to Firebase
    onUpdateStudent(student.id, { ...student, notes: updatedNotes });
  };

  const handleStartEditStudent = () => {
    setEditedStudent({ ...student });
    setIsEditingStudent(true);
  };

  const handleSaveEditStudent = () => {
    if (editedStudent) {
      onUpdateStudent(student.id, editedStudent);
      setIsEditingStudent(false);
      setEditedStudent(null);
    }
  };

  const handleCancelEditStudent = () => {
    setIsEditingStudent(false);
    setEditedStudent(null);
  };

  const handleFieldChange = (field, value) => {
    setEditedStudent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!student) {
    return <div className="student-detail empty">Select a student to view details</div>;
  }

  return (
    <div className="student-detail">
      <div className="detail-header">
        <div className="header-title">
          {isEditingStudent ? (
            <input
              type="text"
              value={editedStudent?.name || ''}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className="edit-input-large"
            />
          ) : (
            <h2>{student.name}</h2>
          )}
        </div>
        <div className="header-controls">
          <span className={`status-badge status-${(editedStudent?.status || student.status).toLowerCase()}`}>
            {editedStudent?.status || student.status}
          </span>
          {!isEditingStudent ? (
            <button className="edit-btn" onClick={handleStartEditStudent} title="Edit student">✏️</button>
          ) : (
            <>
              <button className="save-btn" onClick={handleSaveEditStudent} title="Save changes">💾</button>
              <button className="cancel-btn" onClick={handleCancelEditStudent} title="Cancel">✖</button>
            </>
          )}
        </div>
      </div>

      <div className="detail-section">
        <h3>Placement Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Company</label>
            {isEditingStudent ? (
              <input
                type="text"
                value={editedStudent?.placement || ''}
                onChange={(e) => handleFieldChange('placement', e.target.value)}
                className="edit-input"
              />
            ) : (
              <p>{student.placement}</p>
            )}
          </div>
          <div className="info-item">
            <label>Employer</label>
            {isEditingStudent ? (
              <input
                type="text"
                value={editedStudent?.employer || ''}
                onChange={(e) => handleFieldChange('employer', e.target.value)}
                className="edit-input"
              />
            ) : (
              <p>{student.employer}</p>
            )}
          </div>
          <div className="info-item">
            <label>Start Date</label>
            {isEditingStudent ? (
              <input
                type="date"
                value={editedStudent?.startDate || ''}
                onChange={(e) => handleFieldChange('startDate', e.target.value)}
                className="edit-input"
              />
            ) : (
              <p>{student.startDate ? new Date(student.startDate).toLocaleDateString() : 'N/A'}</p>
            )}
          </div>
          <div className="info-item">
            <label>End Date</label>
            {isEditingStudent ? (
              <input
                type="date"
                value={editedStudent?.endDate || ''}
                onChange={(e) => handleFieldChange('endDate', e.target.value)}
                className="edit-input"
              />
            ) : (
              <p>{student.endDate ? new Date(student.endDate).toLocaleDateString() : 'N/A'}</p>
            )}
          </div>
        </div>
      </div>

      {isEditingStudent && (
        <div className="detail-section">
          <h3>Student Status</h3>
          <div className="info-grid">
            <div className="info-item full-width">
              <label>Status</label>
              <select
                value={editedStudent?.status || 'Active'}
                onChange={(e) => handleFieldChange('status', e.target.value)}
                className="edit-select"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
            <div className="info-item full-width">
              <label>Priority</label>
              <select
                value={editedStudent?.priority || 'medium'}
                onChange={(e) => handleFieldChange('priority', e.target.value)}
                className="edit-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="detail-section">
        <h3>Contact Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Student Email</label>
            {isEditingStudent ? (
              <input
                type="email"
                value={editedStudent?.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className="edit-input"
              />
            ) : (
              <p>{student.email ? <a href={`mailto:${student.email}`}>{student.email}</a> : 'N/A'}</p>
            )}
          </div>
          <div className="info-item">
            <label>Employer Contact</label>
            {isEditingStudent ? (
              <input
                type="email"
                value={editedStudent?.employerContact || ''}
                onChange={(e) => handleFieldChange('employerContact', e.target.value)}
                className="edit-input"
              />
            ) : (
              <p>{student.employerContact ? <a href={`mailto:${student.employerContact}`}>{student.employerContact}</a> : 'N/A'}</p>
            )}
          </div>
          <div className="info-item">
            <label>Employer Phone</label>
            {isEditingStudent ? (
              <input
                type="tel"
                value={editedStudent?.employerPhone || ''}
                onChange={(e) => handleFieldChange('employerPhone', e.target.value)}
                className="edit-input"
              />
            ) : (
              <p>{student.employerPhone ? <a href={`tel:${student.employerPhone}`}>{student.employerPhone}</a> : 'N/A'}</p>
            )}
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Documents</h3>
        <div className="documents-list">
          {student.documents && student.documents.length > 0 ? (
            student.documents.map((doc, index) => (
              <div key={index} className="document-item">
                <span>📄</span>
                <button 
                  className="document-link"
                  onClick={() => alert(`Opening ${doc}`)}
                >
                  {doc}
                </button>
              </div>
            ))
          ) : (
            <p className="no-items">No documents added</p>
          )}
        </div>
      </div>

      <div className="detail-section">
        <h3>Notes & Important Information</h3>
        <div className="notes-container">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="note-item">
                <div className="note-header">
                  <div className="note-meta">
                    <strong>{note.author}</strong> - {note.date}
                  </div>
                  <div className="note-actions">
                    {editingNoteId === note.id ? (
                      <>
                        <button 
                          className="note-action-btn save-btn" 
                          onClick={() => handleSaveEditNote(note.id)}
                          title="Save"
                        >
                          💾
                        </button>
                        <button 
                          className="note-action-btn cancel-btn" 
                          onClick={() => setEditingNoteId(null)}
                          title="Cancel"
                        >
                          ✖
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="note-action-btn edit-btn" 
                          onClick={() => handleEditNote(note.id, note.text)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="note-action-btn delete-btn" 
                          onClick={() => handleDeleteNote(note.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {editingNoteId === note.id ? (
                  <textarea
                    value={editingNoteText}
                    onChange={(e) => setEditingNoteText(e.target.value)}
                    className="edit-note-textarea"
                  />
                ) : (
                  <p>{note.text}</p>
                )}
              </div>
            ))
          ) : (
            <p className="no-items">No notes yet</p>
          )}
        </div>
        <div className="add-note">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            rows="3"
          />
          <button onClick={handleAddNote}>Add Note</button>
        </div>
      </div>
    </div>
  );
}

export default StudentDetail;
