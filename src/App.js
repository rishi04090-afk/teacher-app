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
import { generateCode, saveData, loadData, saveCurrentCode, clearCurrentCode } from './utils/codeStorage';
import { 
  saveCurrentCodeToFirebase, 
  loadCurrentCodeFromFirebase, 
  loadStudentsFromFirebase, 
  loadDeadlinesFromFirebase, 
  saveStudentsToFirebase, 
  saveDeadlinesToFirebase,
  clearCurrentCodeFromFirebase
} from './utils/firebaseDatabase';

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
    const loadSavedDashboard = async () => {
      try {
        // Try Firebase first
        const savedDashboard = await loadCurrentCodeFromFirebase();
        if (savedDashboard) {
          setCurrentCode(savedDashboard.code);
          setDashboardType(savedDashboard.type);
        }
      } catch (error) {
        console.error('Error loading dashboard from Firebase:', error);
      }
    };
    
    loadSavedDashboard();
  }, []);

  // Load data from Firebase when code changes
  useEffect(() => {
    if (!currentCode) return;

    const loadDataFromFirebase = async () => {
      try {
        const [loadedStudents, loadedDeadlines] = await Promise.all([
          loadStudentsFromFirebase(currentCode),
          loadDeadlinesFromFirebase(currentCode)
        ]);
        
        setStudents(loadedStudents || []);
        setDeadlines(loadedDeadlines || []);
      } catch (error) {
        console.error('Error loading data from Firebase:', error);
        // Fallback to localStorage
        const loadedStudents = loadData(currentCode, 'students', []);
        const loadedDeadlines = loadData(currentCode, 'deadlines', []);
        setStudents(loadedStudents);
        setDeadlines(loadedDeadlines);
      }
    };

    loadDataFromFirebase();
  }, [currentCode]);

  // Save students to Firebase whenever they change
  useEffect(() => {
    if (!currentCode) return;
    
    const saveStudents = async () => {
      try {
        await saveStudentsToFirebase(currentCode, students);
      } catch (error) {
        console.error('Error saving students to Firebase:', error);
        // Fallback to localStorage
        saveData(currentCode, 'students', students);
      }
    };

    // Debounce the save to avoid too many writes
    const timer = setTimeout(saveStudents, 500);
    return () => clearTimeout(timer);
  }, [students, currentCode]);

  // Save deadlines to Firebase whenever they change
  useEffect(() => {
    if (!currentCode) return;
    
    const saveDeadlines = async () => {
      try {
        await saveDeadlinesToFirebase(currentCode, deadlines);
      } catch (error) {
        console.error('Error saving deadlines to Firebase:', error);
        // Fallback to localStorage
        saveData(currentCode, 'deadlines', deadlines);
      }
    };

    // Debounce the save to avoid too many writes
    const timer = setTimeout(saveDeadlines, 500);
    return () => clearTimeout(timer);
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
    
    // Save to Firebase and localStorage
    saveCurrentCodeToFirebase(code, type === 'creator');
    saveCurrentCode(code, type === 'creator');
  };

  const handleLeaveDashboard = async () => {
    setCurrentCode(null);
    setDashboardType(null);
    setStudents([]);
    setDeadlines([]);
    setSelectedStudentId(null);
    
    // Clear from Firebase and localStorage
    await clearCurrentCodeFromFirebase();
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
