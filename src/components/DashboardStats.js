import React from 'react';
import '../styles/DashboardStats.css';

function DashboardStats({ students, deadlines }) {
  const calculateStats = () => {
    const totalStudents = students.length;
    const completedForms = students.reduce((sum, s) => {
      return sum + (s.assignmentsCompleted ? s.assignmentsCompleted.length : 0);
    }, 0);
    const totalPossibleForms = totalStudents * 4; // 4 forms per student
    const totalHours = students.reduce((sum, s) => {
      return sum + (parseFloat(s.hoursCompleted) || 0);
    }, 0);
    const upcomingDeadlines = deadlines.filter(d => new Date(d.date) > new Date()).length;

    return {
      totalStudents,
      completedForms,
      totalPossibleForms,
      completionPercentage: totalPossibleForms > 0 ? Math.round((completedForms / totalPossibleForms) * 100) : 0,
      totalHours: totalHours.toFixed(1),
      upcomingDeadlines
    };
  };

  const stats = calculateStats();

  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <div className="stat-icon">👥</div>
        <div className="stat-content">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{stats.totalStudents}</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <div className="stat-label">Forms Completed</div>
          <div className="stat-value">{stats.completedForms}/{stats.totalPossibleForms}</div>
          <div className="stat-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${stats.completionPercentage}%` }}></div>
            </div>
            <span className="progress-text">{stats.completionPercentage}%</span>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">⏱️</div>
        <div className="stat-content">
          <div className="stat-label">Total Hours Logged</div>
          <div className="stat-value">{stats.totalHours}h</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">📌</div>
        <div className="stat-content">
          <div className="stat-label">Upcoming Deadlines</div>
          <div className="stat-value">{stats.upcomingDeadlines}</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
