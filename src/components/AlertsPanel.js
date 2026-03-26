import React from 'react';
import '../styles/AlertsPanel.css';

function AlertsPanel({ alerts, students }) {
  const getStudentName = (studentId) => {
    if (!studentId) return null;
    const student = students.find(s => s.id === studentId);
    return student ? student.name : null;
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return '📌';
    }
  };

  const sortedAlerts = [...alerts].sort((a, b) => {
    const priorityOrder = { error: 0, warning: 1, info: 2, success: 3 };
    return (priorityOrder[a.type] || 4) - (priorityOrder[b.type] || 4);
  });

  return (
    <div className="alerts-panel">
      <h2>🚨 Important Alerts</h2>
      <div className="alerts-list">
        {sortedAlerts.length === 0 ? (
          <p className="no-alerts">No alerts at this time.</p>
        ) : (
          sortedAlerts.map((alert) => (
            <div key={alert.id} className={`alert alert-${alert.type}`}>
              <span className="alert-icon">{getAlertIcon(alert.type)}</span>
              <div className="alert-content">
                <p className="alert-message">{alert.message}</p>
                {getStudentName(alert.studentId) && (
                  <p className="alert-student">Student: {getStudentName(alert.studentId)}</p>
                )}
                <p className="alert-date">{new Date(alert.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AlertsPanel;
