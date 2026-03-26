import React from 'react';
import StudentCard from './StudentCard';
import '../styles/StudentList.css';

function StudentList({ students, selectedStudentId, onSelectStudent, onDeleteStudent, searchTerm }) {
  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.placement.toLowerCase().includes(searchLower) ||
      student.employer.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="student-list">
      <h3>Student Placements</h3>
      {students.length === 0 ? (
        <p className="no-students">No students added yet. Use the "Add New Student" button above to get started.</p>
      ) : filteredStudents.length === 0 ? (
        <p className="no-students">No students found matching your search.</p>
      ) : (
        <div className="student-cards">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              isSelected={selectedStudentId === student.id}
              onSelect={onSelectStudent}
              onDelete={onDeleteStudent}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentList;
