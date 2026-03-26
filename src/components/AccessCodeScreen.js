import React, { useState } from 'react';
import '../styles/AccessCodeScreen.css';

function AccessCodeScreen({ onAccessCode }) {
  const [mode, setMode] = useState('welcome'); // 'welcome', 'create', 'join'
  const [inputCode, setInputCode] = useState('');

  const handleCreateNew = () => {
    setMode('create');
  };

  const handleJoinExisting = () => {
    setMode('join');
    setInputCode('');
  };

  const handleJoinWithCode = () => {
    const code = inputCode.toUpperCase().trim();
    if (code.length === 6) {
      onAccessCode(code);
    } else {
      alert('Please enter a valid 6-character code');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoinWithCode();
    }
  };

  return (
    <div className="access-code-screen">
      <div className="access-card">
        <h1>📚 YRDSB Co-Op Teacher Handoff Dashboard</h1>
        
        {mode === 'welcome' && (
          <div className="welcome-content">
            <p>Welcome! This dashboard helps you organize student placements and handoff information.</p>
            <p>You can create a new dashboard or join an existing one using a code.</p>
            
            <button className="btn btn-primary" onClick={handleCreateNew}>
              ➕ Create New Dashboard
            </button>
            <button className="btn btn-secondary" onClick={handleJoinExisting}>
              🔗 Join Existing Dashboard
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="mode-content">
            <h2>Create New Dashboard</h2>
            <p>A unique code will be generated for you. Share this code with others to let them access your dashboard from anywhere.</p>
            <button className="btn btn-primary" onClick={() => onAccessCode('new')}>
              ✨ Generate New Code
            </button>
            <button className="btn btn-text" onClick={() => setMode('welcome')}>
              ← Back
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="mode-content">
            <h2>Join Existing Dashboard</h2>
            <p>Enter the 6-character code that was shared with you:</p>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="e.g., ABC123"
              maxLength="6"
              autoFocus
              className="code-input"
            />
            <button className="btn btn-primary" onClick={handleJoinWithCode}>
              🔓 Access Dashboard
            </button>
            <button className="btn btn-text" onClick={() => setMode('welcome')}>
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccessCodeScreen;
