import { db, ref, set, get } from './firebaseConfig';

/**
 * Save dashboard code and type to Firebase
 * This creates a session reference for the current user
 */
export const saveCurrentCodeToFirebase = async (code, isCreator) => {
  try {
    const codeRef = ref(db, `dashboards/${code}/metadata`);
    const timestamp = new Date().toISOString();
    
    await set(codeRef, {
      created: timestamp,
      lastUpdated: timestamp,
      isCreator,
    });

    // Also save to localStorage as fallback
    localStorage.setItem('teacher_handoff_current_code', code);
    localStorage.setItem('teacher_handoff_dashboard_type', isCreator ? 'creator' : 'joiner');
    
    return true;
  } catch (error) {
    console.error('Error saving current code to Firebase:', error);
    // Fall back to localStorage only
    try {
      localStorage.setItem('teacher_handoff_current_code', code);
      localStorage.setItem('teacher_handoff_dashboard_type', isCreator ? 'creator' : 'joiner');
    } catch (storageError) {
      console.error('Error saving to localStorage:', storageError);
    }
    return false;
  }
};

/**
 * Load dashboard code from Firebase/localStorage
 */
export const loadCurrentCodeFromFirebase = async () => {
  try {
    const code = localStorage.getItem('teacher_handoff_current_code');
    const type = localStorage.getItem('teacher_handoff_dashboard_type');
    
    if (!code || !type) return null;
    
    // Verify the code exists in Firebase
    const codeRef = ref(db, `dashboards/${code}`);
    const snapshot = await get(codeRef);
    
    if (snapshot.exists()) {
      return { code, type };
    }
    
    // Code doesn't exist in Firebase, clear local storage
    localStorage.removeItem('teacher_handoff_current_code');
    localStorage.removeItem('teacher_handoff_dashboard_type');
    return null;
  } catch (error) {
    console.error('Error loading code from Firebase:', error);
    // Fallback to localStorage
    const code = localStorage.getItem('teacher_handoff_current_code');
    const type = localStorage.getItem('teacher_handoff_dashboard_type');
    return code && type ? { code, type } : null;
  }
};

/**
 * Save students data to Firebase
 */
export const saveStudentsToFirebase = async (code, students) => {
  try {
    const studentsRef = ref(db, `dashboards/${code}/students`);
    await set(studentsRef, students);

    // Also save to localStorage as backup
    localStorage.setItem(`teacher_handoff_${code}_students`, JSON.stringify(students));
    return true;
  } catch (error) {
    console.error('Error saving students to Firebase:', error);
    try {
      localStorage.setItem(`teacher_handoff_${code}_students`, JSON.stringify(students));
    } catch (storageError) {
      console.error('Error saving to localStorage:', storageError);
    }
    return false;
  }
};

/**
 * Load students data from Firebase
 */
export const loadStudentsFromFirebase = async (code) => {
  try {
    const studentsRef = ref(db, `dashboards/${code}/students`);
    const snapshot = await get(studentsRef);
    
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    
    // Try localStorage as fallback
    const localData = localStorage.getItem(`teacher_handoff_${code}_students`);
    return localData ? JSON.parse(localData) : [];
  } catch (error) {
    console.error('Error loading students from Firebase:', error);
    // Fallback to localStorage
    const localData = localStorage.getItem(`teacher_handoff_${code}_students`);
    return localData ? JSON.parse(localData) : [];
  }
};

/**
 * Save deadlines data to Firebase
 */
export const saveDeadlinesToFirebase = async (code, deadlines) => {
  try {
    const deadlinesRef = ref(db, `dashboards/${code}/deadlines`);
    await set(deadlinesRef, deadlines);

    // Also save to localStorage as backup
    localStorage.setItem(`teacher_handoff_${code}_deadlines`, JSON.stringify(deadlines));
    return true;
  } catch (error) {
    console.error('Error saving deadlines to Firebase:', error);
    try {
      localStorage.setItem(`teacher_handoff_${code}_deadlines`, JSON.stringify(deadlines));
    } catch (storageError) {
      console.error('Error saving to localStorage:', storageError);
    }
    return false;
  }
};

/**
 * Load deadlines data from Firebase
 */
export const loadDeadlinesFromFirebase = async (code) => {
  try {
    const deadlinesRef = ref(db, `dashboards/${code}/deadlines`);
    const snapshot = await get(deadlinesRef);
    
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    
    // Try localStorage as fallback
    const localData = localStorage.getItem(`teacher_handoff_${code}_deadlines`);
    return localData ? JSON.parse(localData) : [];
  } catch (error) {
    console.error('Error loading deadlines from Firebase:', error);
    // Fallback to localStorage
    const localData = localStorage.getItem(`teacher_handoff_${code}_deadlines`);
    return localData ? JSON.parse(localData) : [];
  }
};

/**
 * Clear current session
 */
export const clearCurrentCodeFromFirebase = async () => {
  try {
    localStorage.removeItem('teacher_handoff_current_code');
    localStorage.removeItem('teacher_handoff_dashboard_type');
    return true;
  } catch (error) {
    console.error('Error clearing current code:', error);
    return false;
  }
};

/**
 * Sync data after saving locally - triggers Firebase writes
 */
export const syncDataToFirebase = async (code, students, deadlines) => {
  try {
    await saveStudentsToFirebase(code, students);
    await saveDeadlinesToFirebase(code, deadlines);
    return true;
  } catch (error) {
    console.error('Error syncing data to Firebase:', error);
    return false;
  }
};
