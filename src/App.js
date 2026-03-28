import React, { useState, useEffect } from 'react';
import './styles/App.css';
import AccessCodeScreen from './components/AccessCodeScreen';
import CodeDisplay from './components/CodeDisplay';
import SearchBar from './components/SearchBar';
import DashboardStats from './components/DashboardStats';
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
  const [selectedForm, setSelectedForm] = useState('All');
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const categories = ['All', 'Students', 'Completed', 'In Progress', 'Forms', 'Hours'];
  const forms = ['All', 'CELP', 'Employer Summative Assessment', 'Career Fair', 'Employer Interview'];

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
      image: studentData.image || null,
      hoursCompleted: studentData.hoursCompleted || '',
      assignmentsCompleted: studentData.assignmentsCompleted || [],
      notes: [],
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

  // Filter students based on selected category
  const getFilteredStudents = () => {
    let filtered = students;

    // Apply category filter
    if (selectedCategory === 'Hours') {
      filtered = students.filter(s => s.hoursCompleted && s.hoursCompleted !== '');
    } else if (selectedCategory === 'Forms') {
      filtered = students.filter(s => {
        if (selectedForm === 'All') {
          return s.assignmentsCompleted && s.assignmentsCompleted.length > 0;
        } else {
          return s.assignmentsCompleted && s.assignmentsCompleted.includes(selectedForm);
        }
      });
    } else if (selectedCategory === 'Completed') {
      filtered = students.filter(s => {
        const completedCount = s.assignmentsCompleted ? s.assignmentsCompleted.length : 0;
        return completedCount === 4; // All 4 forms completed
      });
    } else if (selectedCategory === 'In Progress') {
      filtered = students.filter(s => {
        const completedCount = s.assignmentsCompleted ? s.assignmentsCompleted.length : 0;
        return completedCount > 0 && completedCount < 4; // Some forms completed but not all
      });
    }
    // 'All' and 'Students' show all students

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.employer && s.employer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.contact && s.contact.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting based on category
    if (selectedCategory === 'Students') {
      // Sort A to Z by name
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedCategory === 'Hours') {
      // Sort by hours completed (most to least)
      filtered.sort((a, b) => {
        const hoursA = parseFloat(a.hoursCompleted) || 0;
        const hoursB = parseFloat(b.hoursCompleted) || 0;
        return hoursB - hoursA;
      });
    } else if (selectedCategory === 'Completed' || selectedCategory === 'In Progress') {
      // Sort A to Z by name for completion categories
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  };

  const filteredStudents = getFilteredStudents();

  const alerts = filteredStudents
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
            <img 
              src={process.env.PUBLIC_URL + '/yrdsb-logo.png'} 
              alt="YRDSB Logo" 
              className="header-logo"
            />
            <button 
              className="exit-btn" 
              onClick={handleLeaveDashboard}
              title="Exit dashboard"
            >
              Exit
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
          forms={forms}
          selectedForm={selectedForm}
          onFormChange={setSelectedForm}
        />

        <DashboardStats students={filteredStudents} deadlines={deadlines} />

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
              students={filteredStudents}
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
