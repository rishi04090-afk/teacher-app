import React from 'react';
import '../styles/SearchBar.css';

function SearchBar({ searchTerm, onSearchChange, categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="search-bar-container">
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search students, notes, contacts..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>
      
      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
