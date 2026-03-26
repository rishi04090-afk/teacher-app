import React from 'react';
import '../styles/CodeDisplay.css';

function CodeDisplay({ code, onSwitchCode, isCreator }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard! Share it with others.');
  };

  return (
    <div className="code-display">
      <div className="code-info">
        <span className="code-label">Your Dashboard Code:</span>
        <span className="code-value">{code}</span>
      </div>
      <button className="copy-btn" onClick={handleCopy} title="Copy code to clipboard">
        📋 Copy Code
      </button>
      <button className="switch-btn" onClick={onSwitchCode} title="Switch to different code">
        🔄 Switch Code
      </button>
    </div>
  );
}

export default CodeDisplay;
