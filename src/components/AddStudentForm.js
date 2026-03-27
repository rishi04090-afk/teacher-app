
import React, { useState } from 'react';
import '../styles/AddStudentForm.css';

// List of assignments (corrected spelling)
const ASSIGNMENTS = [
  'CELP',
  'Employer Summative Assessment',
  'Career Fair',
  'Employer Interview'
];

function AddStudentForm({ onAddStudent }) {
  const [formData, setFormData] = useState({
    name: '',
    placement: '',
    employer: '',
    email: '',
    employerContact: '',
    employerPhone: '',
    startDate: '',
    endDate: '',
    notes: '',
    status: 'Active',
    priority: 'medium',
    image: null,
    hoursCompleted: '',
    assignmentsCompleted: []
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else if (name === 'assignmentsCompleted') {
      setFormData(prev => {
        const updated = checked
          ? [...prev.assignmentsCompleted, value]
          : prev.assignmentsCompleted.filter(a => a !== value);
        return { ...prev, assignmentsCompleted: updated };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.placement || !formData.employer || !formData.email) {
      alert('Please fill in all required fields (Name, Placement, Employer, Email)');
      return;
    }

    // Prepare image as data URL if present
    if (formData.image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAddStudent({ ...formData, image: reader.result });
        resetForm();
      };
      reader.readAsDataURL(formData.image);
    } else {
      onAddStudent(formData);
      resetForm();
    }

    function resetForm() {
      setFormData({
        name: '',
        placement: '',
        employer: '',
        email: '',
        employerContact: '',
        employerPhone: '',
        startDate: '',
        endDate: '',
        notes: '',
        status: 'Active',
        priority: 'medium',
        image: null,
        hoursCompleted: '',
        assignmentsCompleted: []
      });
      setIsExpanded(false);
    }
    
    // Reset form
    setFormData({
      name: '',
      placement: '',
      employer: '',
      email: '',
      employerContact: '',
      employerPhone: '',
      startDate: '',
      endDate: '',
      notes: '',
      status: 'Active',
      priority: 'medium'
    });
    setIsExpanded(false);
  };

  return (
    <div className="add-student-form">
      <button
        className="toggle-form-btn"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '✖ Close' : '➕ Add New Student'}
      </button>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-grid">
            <div className="form-group">
              <label>Student Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Alex Johnson"
                required
              />
            </div>

            <div className="form-group">
              <label>Placement/Company *</label>
              <input
                type="text"
                name="placement"
                value={formData.placement}
                onChange={handleChange}
                placeholder="e.g., Google Canada"
                required
              />
            </div>

            <div className="form-group">
              <label>Employer Name *</label>
              <input
                type="text"
                name="employer"
                value={formData.employer}
                onChange={handleChange}
                placeholder="e.g., Google"
                required
              />
            </div>

            <div className="form-group">
              <label>Student Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@school.ca"
                required
              />
            </div>

            <div className="form-group">
              <label>Employer Contact Email</label>
              <input
                type="email"
                name="employerContact"
                value={formData.employerContact}
                onChange={handleChange}
                placeholder="hr@company.ca"
              />
            </div>

            <div className="form-group">
              <label>Employer Phone</label>
              <input
                type="tel"
                name="employerPhone"
                value={formData.employerPhone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
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

            <div className="form-group full-width">
              <label>Notes & Important Information</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any important notes about this student..."
                rows="3"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Student Picture</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Hours Completed</label>
            <input
              type="number"
              name="hoursCompleted"
              value={formData.hoursCompleted}
              onChange={handleChange}
              min="0"
              placeholder="e.g., 40"
            />
          </div>

          <div className="form-group">
            <label>Assignments Completed</label>
            <div className="assignments-list">
              {ASSIGNMENTS.map((assignment) => (
                <label key={assignment} style={{ display: 'block', marginBottom: 4 }}>
                  <input
                    type="checkbox"
                    name="assignmentsCompleted"
                    value={assignment}
                    checked={formData.assignmentsCompleted.includes(assignment)}
                    onChange={handleChange}
                  />
                  {assignment}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn">Add Student</button>
        </form>
      )}
    </div>
  );
}

export default AddStudentForm;
