import React from 'react';
import '../styles/SearchBar.css';

function SearchBar({ searchTerm, onSearchChange, categories, selectedCategory, onCategoryChange, forms, selectedForm, onFormChange }) {
  return (
    <div className="search-bar-container">
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search students, company, contacts..."
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

      {selectedCategory === 'Forms' && forms && (
        <div className="form-filter">
          <label>Filter by Form:</label>
          <select 
            value={selectedForm} 
            onChange={(e) => onFormChange(e.target.value)}
            className="form-dropdown"
          >
            {forms.map((form) => (
              <option key={form} value={form}>
                {form}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
