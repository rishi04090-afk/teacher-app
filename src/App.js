import React, { useState, useEffect } from 'react';
import './styles/App.css';
import AccessCodeScreen from './components/AccessCodeScreen';
import CodeDisplay from './components/CodeDisplay';
import SearchBar from './components/SearchBar';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import AlertsPanel from './components/AlertsPanel';
import DeadlinesPanel from './components/DeadlinesPanel';
import AddStudentForm from './components/AddStudentForm';
import AddDeadlineForm from './components/AddDeadlineForm';
import { generateCode, saveData, loadData, saveCurrentCode, loadCurrentCode, clearCurrentCode } from './utils/codeStorage';

function App() {
  const [currentCode, setCurrentCode] = useState(null);
  const [dashboardType, setDashboardType] = useState(null);
  const [students, setStudents] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const categories = ['All', 'Students', 'Forms', 'Notes'];

  // Load saved dashboard code on mount
  useEffect(() => {
    const savedDashboard = loadCurrentCode();
    if (savedDashboard) {
      setCurrentCode(savedDashboard.code);
      setDashboardType(savedDashboard.type);
    }
  }, []);

  // Load data from localStorage when code changes
  useEffect(() => {
    if (currentCode) {
      const loadedStudents = loadData(currentCode, 'students', []);
      const loadedDeadlines = loadData(currentCode, 'deadlines', []);
      setStudents(loadedStudents);
      setDeadlines(loadedDeadlines);
    }
  }, [currentCode]);

  // Save students to localStorage whenever they change
  useEffect(() => {
    if (currentCode) {
      saveData(currentCode, 'students', students);
    }
  }, [students, currentCode]);

  // Save deadlines to localStorage whenever they change
  useEffect(() => {
    if (currentCode) {
      saveData(currentCode, 'deadlines', deadlines);
    }
  }, [deadlines, currentCode]);

  const handleAccessCode = (codeOrMode) => {
    let code;
    let type;
    if (codeOrMode === 'new') {
      code = generateCode();
      type = 'creator';
    } else {
      code = codeOrMode;
      type = 'joiner';
    }
    setCurrentCode(code);
    setDashboardType(type);
    setSelectedStudentId(null);
    saveCurrentCode(code, type === 'creator');
  };

  const handleLeaveDashboard = () => {
    setCurrentCode(null);
    setDashboardType(null);
    setStudents([]);
    setDeadlines([]);
    setSelectedStudentId(null);
    clearCurrentCode();
  };

  const handleAddStudent = (studentData) => {
    const newStudent = {
      id: Date.now(),
      ...studentData,
      documents: []
    };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    setSelectedStudentId(newStudent.id);
  };

  const handleAddDeadline = (deadlineData) => {
    const newDeadline = {
      id: Date.now(),
      ...deadlineData
    };
    setDeadlines([...deadlines, newDeadline]);
  };

  const handleDeleteStudent = (studentId) => {
    setStudents(students.filter(s => s.id !== studentId));
    if (selectedStudentId === studentId) {
      setSelectedStudentId(null);
    }
  };

  const handleUpdateStudent = (studentId, updatedData) => {
    setStudents(students.map(s => 
      s.id === studentId ? { ...s, ...updatedData } : s
    ));
  };

  const handleDeleteDeadline = (deadlineId) => {
    setDeadlines(deadlines.filter(d => d.id !== deadlineId));
  };

  const handleUpdateDeadline = (deadlineId, updatedData) => {
    setDeadlines(deadlines.map(d => 
      d.id === deadlineId ? { ...d, ...updatedData } : d
    ));
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const alerts = students
    .filter(s => s.priority === 'high' && s.status === 'Active')
    .map((s, idx) => ({
      id: idx,
      type: 'info',
      message: `${s.name} - High priority student at ${s.employer}`,
      studentId: s.id,
      date: new Date().toISOString().split('T')[0]
    }));

  const isCreator = dashboardType === 'creator';

  if (!currentCode) {
    return <AccessCodeScreen onAccessCode={handleAccessCode} />;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1>Co-Op Program Dashboard</h1>
            <span className="dashboard-type">{isCreator ? 'Dashboard Creator' : 'Guest Access'}</span>
          </div>
          <div className="header-right">
            <button 
              className="leave-btn" 
              onClick={handleLeaveDashboard}
              title="Leave dashboard"
            >
              🚪 Leave
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <CodeDisplay code={currentCode} onSwitchCode={handleLeaveDashboard} isCreator={isCreator} />

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="dashboard-layout">
          {/* Alerts Section */}
          <section className="section alerts-section">
            <AlertsPanel alerts={alerts} students={students} />
          </section>

          {/* Deadlines Section */}
          <section className="section deadlines-section">
            <AddDeadlineForm onAddDeadline={handleAddDeadline} />
            <DeadlinesPanel 
              deadlines={deadlines}
              onDeleteDeadline={handleDeleteDeadline}
              onUpdateDeadline={handleUpdateDeadline}
            />
          </section>

          {/* Students List Section */}
          <section className="section students-section">
            <AddStudentForm onAddStudent={handleAddStudent} />
            <StudentList
              students={students}
              selectedStudentId={selectedStudentId}
              onSelectStudent={setSelectedStudentId}
              onDeleteStudent={handleDeleteStudent}
              searchTerm={searchTerm}
            />
          </section>

          {/* Student Details Section */}
          <section className="section details-section">
            <StudentDetail 
              student={selectedStudent}
              isNewDashboard={!isCreator}
              onUpdateStudent={handleUpdateStudent}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
