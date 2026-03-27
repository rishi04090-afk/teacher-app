import React from 'react';
import '../styles/StudentCard.css';

const ASSIGNMENTS = [
  'CELP',
  'Employer Summative Assessment',
  'Career Fair',
  'Employer Interview'
];

function StudentCard({ student, isSelected, onSelect, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      onDelete(student.id);
    }
  };

  return (
    <div
      className={`student-card ${isSelected ? 'selected' : ''} ${student.status.toLowerCase()}`}
      onClick={() => onSelect(student.id)}
    >
      <div className="card-header">
        <h4>{student.name}</h4>
        <div className="card-header-controls">
          <span className={`status-badge status-${student.status.toLowerCase()}`}>
            {student.status}
          </span>
          <button
            className="card-delete-btn"
            onClick={handleDelete}
            title="Delete student"
          >
            🗑️
          </button>
        </div>
      </div>
      <p className="placement-info">📍 {student.placement}</p>
      <p className="employer-info">🏢 {student.employer}</p>
      <div className="card-dates">
        <small>📅 {student.startDate ? new Date(student.startDate).toLocaleDateString() : 'N/A'} - {student.endDate ? new Date(student.endDate).toLocaleDateString() : 'N/A'}</small>
      </div>
      {/* Hours Completed */}
      <div style={{ fontSize: 13, margin: '4px 0' }}>
        <strong>Hours:</strong> {student.hoursCompleted || 0}
      </div>
      {/* Assignments Summary */}
      <div style={{ fontSize: 13, margin: '4px 0' }}>
        <strong>Assignments:</strong> {student.assignmentsCompleted ? student.assignmentsCompleted.length : 0}/{ASSIGNMENTS.length}
      </div>
      <div className="card-footer">
        <span className={`priority-indicator priority-${student.priority}`}>
          {student.priority.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export default StudentCard;
