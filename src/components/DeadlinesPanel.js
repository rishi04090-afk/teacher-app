import React, { useState } from 'react';
import '../styles/DeadlinesPanel.css';

function DeadlinesPanel({ deadlines, onDeleteDeadline, onUpdateDeadline }) {
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  const upcomingDeadlines = deadlines
    .filter(d => !d.isCompleted)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const completedDeadlines = deadlines.filter(d => d.isCompleted);

  const isOverdue = (date) => {
    return new Date(date) < new Date() && new Date(date).toDateString() !== new Date().toDateString();
  };

  const daysUntil = (date) => {
    const today = new Date();
    const dueDate = new Date(date);
    const diff = dueDate - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleStartEdit = (deadline) => {
    setEditingId(deadline.id);
    setEditingData({ ...deadline });
  };

  const handleSaveEdit = (id) => {
    onUpdateDeadline(id, editingData);
    setEditingId(null);
    setEditingData({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleFieldChange = (field, value) => {
    setEditingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderDeadlineItem = (deadline) => {
    const isEditing = editingId === deadline.id;
    const days = daysUntil(deadline.dueDate);

    return (
      <div
        key={deadline.id}
        className={`deadline-item ${isOverdue(deadline.dueDate) ? 'overdue' : days <= 7 ? 'urgent' : ''}`}
      >
        <div className="deadline-date">
          {isEditing ? (
            <input
              type="date"
              value={editingData.dueDate}
              onChange={(e) => handleFieldChange('dueDate', e.target.value)}
              className="edit-date-input"
            />
          ) : (
            <>
              <span className="date">{new Date(deadline.dueDate).toLocaleDateString()}</span>
              {isOverdue(deadline.dueDate) ? (
                <span className="days-left overdue">OVERDUE</span>
              ) : (
                <span className={`days-left ${days <= 7 ? 'urgent' : 'normal'}`}>
                  {days} days left
                </span>
              )}
            </>
          )}
        </div>
        <div className="deadline-info">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editingData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="edit-title-input"
              />
              <textarea
                value={editingData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="edit-description-input"
                rows="2"
              />
            </>
          ) : (
            <>
              <h4>{deadline.title}</h4>
              <p>{deadline.description}</p>
            </>
          )}
        </div>
        <div className="deadline-controls">
          {!isEditing ? (
            <>
              <span className={`priority-badge priority-${deadline.priority}`}>
                {deadline.priority.toUpperCase()}
              </span>
              <button
                className="deadline-action-btn edit-btn"
                onClick={() => handleStartEdit(deadline)}
                title="Edit"
              >
                ✏️
              </button>
              <button
                className="deadline-action-btn delete-btn"
                onClick={() => onDeleteDeadline(deadline.id)}
                title="Delete"
              >
                🗑️
              </button>
            </>
          ) : (
            <>
              <button
                className="deadline-action-btn save-btn"
                onClick={() => handleSaveEdit(deadline.id)}
                title="Save"
              >
                💾
              </button>
              <button
                className="deadline-action-btn cancel-btn"
                onClick={handleCancelEdit}
                title="Cancel"
              >
                ✖
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="deadlines-panel">
      <h2>📋 Deadlines & Important Dates</h2>

      <div className="deadlines-section">
        <h3>Upcoming Deadlines</h3>
        {upcomingDeadlines.length === 0 ? (
          <p className="no-deadlines">No upcoming deadlines.</p>
        ) : (
          <div className="deadlines-list">
            {upcomingDeadlines.map(deadline => renderDeadlineItem(deadline))}
          </div>
        )}
      </div>

      {completedDeadlines.length > 0 && (
        <div className="deadlines-section">
          <h3>Completed Deadlines</h3>
          <div className="completed-deadlines">
            {completedDeadlines.map(deadline => (
              <div key={deadline.id} className="deadline-item completed">
                <div className="deadline-date">
                  <span className="date">{new Date(deadline.dueDate).toLocaleDateString()}</span>
                  <span className="completed-badge">✓ Completed</span>
                </div>
                <div className="deadline-info">
                  <h4>{deadline.title}</h4>
                </div>
                <button
                  className="deadline-action-btn delete-btn"
                  onClick={() => onDeleteDeadline(deadline.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DeadlinesPanel;
