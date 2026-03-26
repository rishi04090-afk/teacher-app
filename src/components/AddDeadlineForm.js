import React, { useState } from 'react';
import '../styles/AddDeadlineForm.css';

function AddDeadlineForm({ onAddDeadline }) {
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    priority: 'medium',
    description: '',
    isCompleted: false
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.dueDate) {
      alert('Please fill in the Title and Due Date fields');
      return;
    }

    onAddDeadline(formData);

    // Reset form
    setFormData({
      title: '',
      dueDate: '',
      priority: 'medium',
      description: '',
      isCompleted: false
    });
    setIsExpanded(false);
  };

  return (
    <div className="add-deadline-form">
      <button
        className="toggle-form-btn"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '✖ Close' : '📅 Add New Deadline'}
      </button>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Deadline Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Mid-Term Evaluations Due"
                required
              />
            </div>

            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isCompleted"
                  checked={formData.isCompleted}
                  onChange={handleChange}
                />
                Mark as Completed
              </label>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add details about this deadline..."
                rows="3"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">Add Deadline</button>
        </form>
      )}
    </div>
  );
}

export default AddDeadlineForm;
