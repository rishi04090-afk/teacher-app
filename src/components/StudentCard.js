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
      
      {/* Assignments Summary with Progress */}
      <div style={{ fontSize: 13, margin: '10px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <strong>Assignments:</strong>
          <span>{student.assignmentsCompleted ? student.assignmentsCompleted.length : 0}/{ASSIGNMENTS.length}</span>
        </div>
        <div style={{ background: '#e0e0e0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
          <div
            style={{
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              height: '100%',
              width: `${((student.assignmentsCompleted ? student.assignmentsCompleted.length : 0) / ASSIGNMENTS.length) * 100}%`,
              transition: 'width 0.3s ease'
            }}
          ></div>
        </div>
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
