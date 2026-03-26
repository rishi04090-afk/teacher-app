// Generate a unique 6-character code
export const generateCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// LocalStorage keys
export const getStorageKey = (code, dataType) => `teacher_handoff_${code}_${dataType}`;
export const CURRENT_CODE_KEY = 'teacher_handoff_current_code';
export const DASHBOARD_TYPE_KEY = 'teacher_handoff_dashboard_type';

// Save data to localStorage with code
export const saveData = (code, dataType, data) => {
  const key = getStorageKey(code, dataType);
  localStorage.setItem(key, JSON.stringify(data));
};

// Load data from localStorage by code
export const loadData = (code, dataType, defaultValue = null) => {
  const key = getStorageKey(code, dataType);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

// Save current code to localStorage
export const saveCurrentCode = (code, isNew) => {
  localStorage.setItem(CURRENT_CODE_KEY, code);
  localStorage.setItem(DASHBOARD_TYPE_KEY, isNew ? 'creator' : 'joiner');
};

// Load current code from localStorage
export const loadCurrentCode = () => {
  const code = localStorage.getItem(CURRENT_CODE_KEY);
  const type = localStorage.getItem(DASHBOARD_TYPE_KEY);
  return code ? { code, type } : null;
};

// Clear current code
export const clearCurrentCode = () => {
  localStorage.removeItem(CURRENT_CODE_KEY);
  localStorage.removeItem(DASHBOARD_TYPE_KEY);
};

// Get all codes that have data (for potential future features)
export const getAllCodes = () => {
  const codes = new Set();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('teacher_handoff_') && !key.includes('current_code') && !key.includes('dashboard_type')) {
      const code = key.split('_')[2];
      codes.add(code);
    }
  }
  return Array.from(codes);
};
